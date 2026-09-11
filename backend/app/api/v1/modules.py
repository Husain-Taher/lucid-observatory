from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from app.core.database import get_db
from app.models import User, LearningModule, ModuleProgress, utcnow
from app.schemas import LearningModuleOut
from app.api.v1.auth import get_current_user
from app.services.data_ingestion.market_data import market_data_service

router = APIRouter(prefix="/modules", tags=["modules"])

CONCEPTS = [
    {
        "id": "compounding",
        "domain": "Saving & Growth",
        "title": "Compounding",
        "subtitle": "How time turns small additions into exponential curves.",
        "visualization_type": "ORGANIC_GROWTH_CURVE",
        "metaphor": "A small seed branching organically into an exponential canopy.",
        "content": "Risk is not a number. It is a relationship. Watch what happens when time gets involved.",
        "order_index": 1
    },
    {
        "id": "risk-return",
        "domain": "Risk Comprehension",
        "title": "Risk & Return",
        "subtitle": "Why higher expected reward expands uncertainty rather than certainty.",
        "visualization_type": "UNCERTAINTY_CLOUD",
        "metaphor": "A single point expanding into a widening horizon of possible futures.",
        "content": "You moved the expected return upward. Notice what happened to the range.",
        "order_index": 2
    },
    {
        "id": "diversification",
        "domain": "Investing Architecture",
        "title": "Diversification",
        "subtitle": "How independent paths combine into a calmer distribution.",
        "visualization_type": "BRANCHING_THREADS",
        "metaphor": "One glowing thread branching into independent paths, converging into calm.",
        "content": "What changed? Not just the return — the entire dispersion of outcomes narrowed.",
        "order_index": 3
    },
    {
        "id": "dca",
        "domain": "Disciplined Execution",
        "title": "Dollar-Cost Averaging",
        "subtitle": "Turning market volatility into a structural mathematical advantage.",
        "visualization_type": "RHYTHMIC_TIME_MARKS",
        "metaphor": "Repeated steady marks anchoring across turbulent waves.",
        "content": "Removing timing emotion through automated periodic cadence.",
        "order_index": 4
    },
    {
        "id": "inflation",
        "domain": "Purchasing Power",
        "title": "Inflation Erosion",
        "subtitle": "The invisible risk of cash: guaranteed decay of real goods.",
        "visualization_type": "SHRINKING_BASKET",
        "metaphor": "The same basket of goods visibly contracting over decades.",
        "content": "Face value remains untouched, but what you can exchange it for diminishes.",
        "order_index": 5
    },
    {
        "id": "market-cycles",
        "domain": "Macro Regimes",
        "title": "Market Cycles",
        "subtitle": "How environments breathe through historical drawdowns and recoveries.",
        "visualization_type": "BREATHING_REGIMES",
        "metaphor": "A topological landscape expanding and contracting across historical shocks.",
        "content": "2008, 2020, 2022 — what did uncertainty feel like when you were inside it?",
        "order_index": 6
    }
]

@router.get("", response_model=List[LearningModuleOut])
async def list_modules(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Fetch user's completion status
    result = await db.execute(select(ModuleProgress).where(ModuleProgress.user_id == current_user.id))
    progress_records = {p.module_id: p.completed for p in result.scalars().all()}

    modules_out = []
    for c in CONCEPTS:
        modules_out.append(
            LearningModuleOut(
                id=c["id"],
                domain=c["domain"],
                title=c["title"],
                subtitle=c["subtitle"],
                visualization_type=c["visualization_type"],
                metaphor=c["metaphor"],
                content=c["content"],
                order_index=c["order_index"],
                completed=progress_records.get(c["id"], False)
            )
        )
    return modules_out

@router.get("/{module_id}/data")
async def get_module_data(
    module_id: str,
    # Parameters for compounding
    principal: float = Query(5000.0),
    monthly_contribution: float = Query(250.0),
    annual_rate: float = Query(8.0),
    years: int = Query(20),
    pause_contribution_year: int = Query(0),
    # Parameters for risk-return
    expected_return: float = Query(8.0),
    # Parameters for diversification
    asset_count: int = Query(3),
    # Parameters for inflation
    inflation_rate: float = Query(3.0)
):
    if module_id == "compounding":
        return market_data_service.compute_compounding(
            principal=principal,
            monthly_contribution=monthly_contribution,
            annual_rate=annual_rate,
            years=years,
            pause_contribution_year=pause_contribution_year
        )
    elif module_id == "risk-return":
        return market_data_service.compute_risk_return(expected_return=expected_return)
    elif module_id == "diversification":
        return market_data_service.compute_diversification(asset_count=asset_count)
    elif module_id == "inflation":
        return market_data_service.compute_inflation_erosion(years=years, inflation_rate=inflation_rate)
    elif module_id == "market-cycles":
        return {
            "cycles": market_data_service.HISTORICAL_CYCLES,
            "insight": "Every secular drawdown felt permanent while occurring. History illustrates that drawdowns are the fee for long-term equity compounding."
        }
    elif module_id == "dca":
        # Dollar cost averaging vs Lump Sum comparison
        return {
            "annual_rate": annual_rate,
            "years": years,
            "comparison": [
                {"strategy": "DCA ($250/mo)", "final_value": 147300, "max_drawdown": -12.4},
                {"strategy": "Lump Sum ($60,000)", "final_value": 158400, "max_drawdown": -34.8}
            ],
            "insight": "Lump sum achieves slightly higher median return, but DCA drastically smooths the psychological drawdown risk for early-stage investors."
        }
    else:
        raise HTTPException(status_code=404, detail="Module not found.")

@router.post("/{module_id}/complete")
async def complete_module(
    module_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(ModuleProgress).where(
            ModuleProgress.user_id == current_user.id,
            ModuleProgress.module_id == module_id
        )
    )
    progress = result.scalar_one_or_none()
    if not progress:
        progress = ModuleProgress(
            user_id=current_user.id,
            module_id=module_id,
            interaction_count=1,
            completed=True,
            completed_at=utcnow()
        )
        db.add(progress)
    else:
        progress.interaction_count += 1
        progress.completed = True
        progress.completed_at = utcnow()

    await db.commit()
    return {"status": "success", "module_id": module_id, "completed": True}
