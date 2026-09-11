from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Dict, Any
from datetime import datetime, timezone
from app.core.database import get_db
from app.core.security import sanitize_claim_input, validate_url_safe
from app.models import User, Claim, EvidenceItem, RiskSignal, utcnow
from app.schemas import ClaimSubmission, ClaimInvestigationOut, DeconstructedClaim, EvidenceLayer
from app.api.v1.auth import get_current_user
from app.services.nlp.claim_deconstructor import claim_deconstructor
from app.services.nlp.persuasion_detector import persuasion_detector
from app.services.narrative.grounder import narrative_grounder
from app.services.nlp.news_analyzer import news_analyzer

router = APIRouter(prefix="/claims", tags=["claims"])

@router.post("", response_model=ClaimInvestigationOut)
async def submit_and_investigate_claim(
    payload: ClaimSubmission,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Sanitize against prompt injection
    raw_text = sanitize_claim_input(payload.text)

    # 2. SSRF Check if URL is provided
    if payload.source_url:
        if not validate_url_safe(payload.source_url):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Provided source URL resolves to a prohibited internal or unsafe address."
            )

    # 3. Syntactic & Semantic Deconstruction (NLP)
    decomp = claim_deconstructor.deconstruct(raw_text)

    # 4. Hype & Persuasion ML Classification
    ml_res = persuasion_detector.predict(raw_text)

    # 5. Build Progressive Evidence Stack
    evidence_stack: List[EvidenceLayer] = [
        EvidenceLayer(
            factor_name="CERTAINTY",
            factor_finding=f"Claim uses '{decomp['certainty'].lower()}' certainty cues ('{decomp['certainty']}').",
            strength="LOW" if decomp['certainty'] in ("EXTREME", "HIGH") else "MODERATE",
            details="Empirical finance shows that future cash flows and market prices cannot be guaranteed. High certainty language is a primary marker of promotional rhetoric rather than analytical diligence.",
            source_name="SEC Investor Bulletin & FINRA Guidelines",
            source_url="https://www.sec.gov/investor"
        ),
        EvidenceLayer(
            factor_name="COMPARISON",
            factor_finding=f"Benchmarked against: {decomp['comparison']}.",
            strength="MODERATE" if decomp['comparison'] != "None Stated" else "ABSENT",
            details=f"Comparing returns without adjusting for volatility or beta misstates risk. Outperforming {decomp['comparison']} requires higher factor exposure or leverage.",
            source_name="Center for Research in Security Prices (CRSP)",
            source_url="https://www.crsp.org"
        ),
        EvidenceLayer(
            factor_name="TIMEFRAME",
            factor_finding=f"Horizon stated: {decomp['time_horizon']}.",
            strength="HIGH" if decomp['time_horizon'] != "Unspecified" else "ABSENT",
            details="Without an explicit timeframe, assertions cannot be held accountable or falsified against historical outcomes.",
            source_name="Academic Financial Literacy Benchmark",
            source_url=None
        ),
        EvidenceLayer(
            factor_name="HISTORICAL EVIDENCE",
            factor_finding="Technological paradigm shifts historically experience sharp multiple compressions.",
            strength="HIGH",
            details="During the 1998-2002 internet infrastructure buildout and the 2020-2022 cloud boom, sector leaders grew revenue at >30% while their stock prices suffered 40-70% drawdowns due to valuation resetting.",
            source_name="Historical S&P 500 Sub-Industry Series (FRED)",
            source_url="https://fred.stlouisfed.org"
        )
    ]

    # 6. Real News Context & Ground-Truth NLP Verification
    ticker_guess = decomp.get("subject", "SPY").replace("$", "").split()[0]
    news_grounding = news_analyzer.ground_claim_against_news(raw_text, ticker=ticker_guess)

    if news_grounding.get("corroborating_facts"):
        evidence_stack.append(
            EvidenceLayer(
                factor_name="REAL NEWS & EVENT CONTEXT",
                factor_finding=f"Live reporting on {ticker_guess}: {len(news_grounding['corroborating_facts'])} verified facts identified.",
                strength="HIGH",
                details=" | ".join(news_grounding["corroborating_facts"][:2]),
                source_name="Verified Live Publisher Feeds (Yahoo Finance)",
                source_url="https://finance.yahoo.com"
            )
        )

    # 7. Generate Grounded Narrative and "Uncomfortable Truth"
    narrative_parts = narrative_grounder.generate_claim_explanation(
        decomp, [e.model_dump() for e in evidence_stack]
    )

    # 8. Persist to Database
    db_claim = Claim(
        user_id=current_user.id,
        raw_input=raw_text,
        asset_ticker=decomp.get("subject", "MARKET")[:32],
        claim_type=decomp.get("claim_type"),
        time_horizon=decomp.get("time_horizon"),
        comparison_target=decomp.get("comparison"),
        certainty_level=decomp.get("certainty"),
        hype_score=ml_res.get("hype_score", 0.0),
        submitted_at=utcnow()
    )
    db.add(db_claim)
    await db.flush()

    # Add evidence items
    for item in evidence_stack:
        db_item = EvidenceItem(
            claim_id=db_claim.id,
            source_type="HISTORICAL_BENCHMARK",
            source_title=item.source_name,
            source_url=item.source_url,
            stance="CONTRADICTS" if item.strength == "LOW" else "SUPPORTS",
            excerpt=item.details,
            evidence_factor=item.factor_name
        )
        db.add(db_item)

    # Add risk signals if hype detected
    for cue in ml_res.get("linguistic_cues", []):
        db_sig = RiskSignal(
            claim_id=db_claim.id,
            signal_type=cue.upper().replace(" ", "_"),
            evidence_excerpt=f"Identified in claim: {cue}",
            confidence=0.85
        )
        db.add(db_sig)

    await db.commit()
    await db.refresh(db_claim)

    return ClaimInvestigationOut(
        claim_id=db_claim.id,
        raw_input=raw_text,
        deconstructed=DeconstructedClaim(
            subject=decomp["subject"],
            claim_type=decomp["claim_type"],
            time_horizon=decomp["time_horizon"],
            comparison=decomp["comparison"],
            certainty=decomp["certainty"],
            hype_score=ml_res["hype_score"],
            urgency_level=ml_res["urgency_level"]
        ),
        evidence_stack=evidence_stack,
        grounded_summary=narrative_parts["grounded_summary"],
        uncomfortable_truth=narrative_parts["uncomfortable_truth"],
        grounding_score=news_grounding.get("grounding_score", 75),
        real_news_context=news_grounding.get("real_news_context", []),
        what_it_actually_means=news_grounding.get("what_it_actually_means")
    )
