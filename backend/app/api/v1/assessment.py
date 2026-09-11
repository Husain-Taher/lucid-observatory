from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Dict, Any
from datetime import datetime, timezone
from app.core.database import get_db
from app.models import User, LiteracyProfile, utcnow
from app.schemas import AssessmentSubmission, LiteracyProfileOut
from app.api.v1.auth import get_current_user

router = APIRouter(prefix="/assessment", tags=["assessment"])

BASELINE_QUESTIONS = [
    {
        "id": "risk_1",
        "category": "risk",
        "prompt": "When an investment promises a higher expected long-term return, what usually happens to its range of possible annual outcomes?",
        "options": [
            "The range narrows because higher return provides a cushion.",
            "The range widens — higher expected reward is paired with greater dispersion and downside uncertainty.",
            "The outcome becomes guaranteed over a 10-year period.",
            "The investment ceases to be impacted by broader market cycles."
        ],
        "correct_index": 1,
        "explanation": "Comprehending Risk: Expected return and uncertainty travel together. A higher expected return does not make the outcome certain; it broadens the envelope of what might happen."
    },
    {
        "id": "investing_1",
        "category": "investing",
        "prompt": "Why does adding a second, uncorrelated asset to a stock portfolio generally reduce its overall volatility?",
        "options": [
            "It guarantees that neither asset will ever lose value simultaneously.",
            "Uncorrelated assets don't move in lockstep; when one declines, the other may remain stable or rise.",
            "It automatically doubles the annualized compound growth rate.",
            "It eliminates inflation risk completely."
        ],
        "correct_index": 1,
        "explanation": "Diversification: When independent asset paths combine, the portfolio's overall outcome distribution calms."
    },
    {
        "id": "saving_1",
        "category": "saving",
        "prompt": "If you hold $10,000 in cash in a zero-interest checking account for 20 years while inflation averages 3% per year, what happens?",
        "options": [
            "You still have $10,000, and its purchasing power remains unchanged.",
            "Your nominal balance is still $10,000, but its real purchasing power drops by roughly 45%.",
            "Your balance automatically adjusts upward with the Consumer Price Index.",
            "Your money becomes risk-free because it is protected from market drawdowns."
        ],
        "correct_index": 1,
        "explanation": "Inflation Erosion: Holding cash preserves nominal face value but suffers guaranteed purchasing-power decay."
    },
    {
        "id": "earning_1",
        "category": "earning",
        "prompt": "What creates the dramatic bend in a compound-growth curve over a 20-year horizon?",
        "options": [
            "The initial principal amount deposited on day one.",
            "Earning returns on your prior returns as time accumulates, rather than just on your original principal.",
            "Timing the market to buy only at cycle troughs.",
            "Constant rebalancing between cash and equities."
        ],
        "correct_index": 1,
        "explanation": "Compounding: The surprising part isn't the early years — it's the exponential curvature that emerges when time gets involved."
    },
    {
        "id": "borrowing_1",
        "category": "borrowing",
        "prompt": "When credit spreads widen between high-yield corporate bonds and U.S. Treasuries, what does it signify?",
        "options": [
            "Lenders are demanding higher compensation to lend to riskier borrowers, indicating market stress.",
            "Companies are earning record profits and lowering borrowing costs.",
            "Treasuries have become riskier than high-yield corporate debt.",
            "Equity markets are experiencing broad and healthy participation."
        ],
        "correct_index": 0,
        "explanation": "Credit Conditions: Credit stress reflects how easily corporations can borrow. Widening spreads signal tightening financial conditions."
    }
]

@router.get("/questions")
async def get_questions():
    # Return questions without the answers revealed
    return [
        {
            "id": q["id"],
            "category": q["category"],
            "prompt": q["prompt"],
            "options": q["options"]
        }
        for q in BASELINE_QUESTIONS
    ]

@router.post("", response_model=LiteracyProfileOut)
async def submit_assessment(
    payload: AssessmentSubmission,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Score the answers
    category_scores = {
        "earning": 40,
        "saving": 40,
        "borrowing": 40,
        "investing": 40,
        "risk": 35 # default slightly lower reflecting empirical research
    }
    
    question_map = {q["id"]: q for q in BASELINE_QUESTIONS}
    for ans in payload.answers:
        q = question_map.get(ans.question_id)
        if q:
            cat = q["category"]
            if ans.selected_option == q["correct_index"]:
                category_scores[cat] = 85
            else:
                category_scores[cat] = 30

    # Retrieve or create profile
    result = await db.execute(select(LiteracyProfile).where(LiteracyProfile.user_id == current_user.id))
    profile = result.scalar_one_or_none()
    if not profile:
        profile = LiteracyProfile(user_id=current_user.id)
        db.add(profile)

    profile.earning_score = category_scores["earning"]
    profile.saving_score = category_scores["saving"]
    profile.borrowing_score = category_scores["borrowing"]
    profile.investing_score = category_scores["investing"]
    profile.risk_score = category_scores["risk"]
    profile.last_assessed_at = utcnow()

    await db.commit()
    await db.refresh(profile)

    # Determine weakest dimension
    dimensions = [
        ("risk", profile.risk_score, "risk-return"),
        ("investing", profile.investing_score, "diversification"),
        ("saving", profile.saving_score, "compounding"),
        ("earning", profile.earning_score, "dca"),
        ("borrowing", profile.borrowing_score, "market-cycles"),
    ]
    weakest = min(dimensions, key=lambda x: x[1])

    return LiteracyProfileOut(
        earning_score=profile.earning_score,
        saving_score=profile.saving_score,
        borrowing_score=profile.borrowing_score,
        investing_score=profile.investing_score,
        risk_score=profile.risk_score,
        weakest_dimension=weakest[0].capitalize(),
        recommended_module_id=weakest[2],
        last_assessed_at=profile.last_assessed_at
    )

@router.get("/profile", response_model=LiteracyProfileOut)
async def get_profile(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(LiteracyProfile).where(LiteracyProfile.user_id == current_user.id))
    profile = result.scalar_one_or_none()
    if not profile:
        profile = LiteracyProfile(user_id=current_user.id)
        db.add(profile)
        await db.commit()
        await db.refresh(profile)

    dimensions = [
        ("risk", profile.risk_score, "risk-return"),
        ("investing", profile.investing_score, "diversification"),
        ("saving", profile.saving_score, "compounding"),
        ("earning", profile.earning_score, "dca"),
        ("borrowing", profile.borrowing_score, "market-cycles"),
    ]
    weakest = min(dimensions, key=lambda x: x[1])

    return LiteracyProfileOut(
        earning_score=profile.earning_score,
        saving_score=profile.saving_score,
        borrowing_score=profile.borrowing_score,
        investing_score=profile.investing_score,
        risk_score=profile.risk_score,
        weakest_dimension=weakest[0].capitalize(),
        recommended_module_id=weakest[2],
        last_assessed_at=profile.last_assessed_at
    )
