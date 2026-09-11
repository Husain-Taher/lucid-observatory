from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Dict, Any
from datetime import date, timedelta
from app.core.database import get_db
from app.models import User, Decision, Portfolio, Holding, ModuleProgress
from app.schemas import BehavioralMirrorOut, BehavioralFlag, TimelineTracePoint
from app.api.v1.auth import get_current_user
from app.services.ml.behavioral_mirror import behavioral_mirror

router = APIRouter(prefix="/insights", tags=["insights"])

@router.get("/patterns", response_model=BehavioralMirrorOut)
async def get_behavioral_patterns(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Fetch decisions
    d_res = await db.execute(select(Decision).where(Decision.user_id == current_user.id))
    decisions = d_res.scalars().all()
    dec_dicts = [
        {
            "id": d.id,
            "action": d.action,
            "ticker": d.ticker,
            "entry_price": d.entry_price,
            "entry_sentiment_score": d.entry_sentiment_score,
            "entry_atmosphere": d.entry_atmosphere,
            "confidence_level": d.confidence_level,
            "thesis": d.thesis,
            "created_at": d.created_at
        }
        for d in decisions
    ]

    # Fetch holdings
    p_res = await db.execute(select(Portfolio).where(Portfolio.user_id == current_user.id))
    portfolio = p_res.scalar_one_or_none()
    holdings_dicts = []
    if portfolio:
        h_res = await db.execute(select(Holding).where(Holding.portfolio_id == portfolio.id))
        holdings = h_res.scalars().all()
        holdings_dicts = [{"ticker": h.ticker, "quantity": h.quantity, "avg_cost": h.avg_cost} for h in holdings]

    # Run Behavioral Pattern Recognition Engine
    flags_raw = behavioral_mirror.analyze_patterns(dec_dicts, holdings_dicts)
    behavioral_flags = [BehavioralFlag(**f) for f in flags_raw]

    # Build 30-day timeline overlay
    today = date.today()
    base_price = 520.0
    trace_points: List[TimelineTracePoint] = []

    # Map decisions to dates
    decision_by_date = {
        d.created_at.strftime("%Y-%m-%d"): d for d in decisions if d.created_at
    }

    for i in range(30, -1, -1):
        dt = today - timedelta(days=i)
        dt_str = str(dt)
        # Price sinusoidal wave + trend
        px = base_price + (math_drift := (30 - i) * 0.8) + (12.0 if (i % 7 < 3) else -8.0)
        # Sentiment oscillation
        comp = 50.0 + (18.0 if i < 10 else (-12.0 if i < 20 else 8.0))
        atmo = "TENSE" if comp > 65 else ("UNCERTAIN" if comp > 48 else "EXPANSIVE")

        # Check if user made a decision on this day
        d_match = decision_by_date.get(dt_str)

        trace_points.append(
            TimelineTracePoint(
                date=dt_str,
                asset_price=round(px, 2),
                sentiment_composite=round(comp, 1),
                atmosphere=atmo,
                user_action=d_match.action if d_match else None,
                user_thesis=d_match.thesis if d_match else None
            )
        )

    # Fetch completed learning modules for constellation map
    m_res = await db.execute(
        select(ModuleProgress).where(
            ModuleProgress.user_id == current_user.id,
            ModuleProgress.completed == True
        )
    )
    completed_ids = {m.module_id for m in m_res.scalars().all()}
    
    all_modules = ["compounding", "risk-return", "diversification", "dca", "inflation", "market-cycles", "jewels-metals"]
    learning_path = [
        {"module_id": mid, "title": mid.replace("-", " ").title(), "unlocked": mid in completed_ids or mid in ("risk-return", "jewels-metals")}
        for mid in all_modules
    ]

    metrics = behavioral_mirror.compute_metrics(dec_dicts)

    return BehavioralMirrorOut(
        trace_points=trace_points,
        behavioral_flags=behavioral_flags,
        decisions_count=len(decisions),
        learning_path_nodes=learning_path,
        rolling_emotional_beta=metrics["rolling_emotional_beta"],
        patience_ratio=metrics["patience_ratio"],
        fomo_chasing_ratio=metrics["fomo_chasing_ratio"]
    )
