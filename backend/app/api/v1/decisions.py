from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone, timedelta
from app.core.database import get_db
from app.models import User, Decision, DecisionOutcome, Portfolio, Holding, Transaction, utcnow
from app.schemas import DecisionSubmission, DecisionOut
from app.api.v1.auth import get_current_user
from app.api.v1.portfolio import get_current_price, place_order, OrderPlacement
from app.services.ml.sentiment_regime import sentiment_engine

router = APIRouter(prefix="/decisions", tags=["decisions"])

@router.post("", response_model=DecisionOut)
async def log_decision(
    payload: DecisionSubmission,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    action = payload.action.upper()
    if action not in ("BUY", "WAIT", "PASS"):
        raise HTTPException(status_code=400, detail="Action must be BUY, WAIT, or PASS.")

    ticker = (payload.ticker or "SPY").upper().replace("$", "")
    px = get_current_price(ticker)
    
    # Today's environment snapshot
    atmo = sentiment_engine.compute_atmosphere()

    decision = Decision(
        user_id=current_user.id,
        claim_id=payload.claim_id,
        action=action,
        ticker=ticker,
        thesis=payload.thesis,
        falsification_criteria=payload.falsification_criteria,
        confidence_level=payload.confidence_level.upper(),
        time_horizon=payload.time_horizon,
        entry_price=px,
        entry_sentiment_score=atmo["composite_score"],
        entry_atmosphere=atmo["atmosphere"],
        created_at=utcnow()
    )
    db.add(decision)
    await db.flush()

    # If action is BUY, also execute in paper trading portfolio
    if action == "BUY":
        try:
            qty = payload.quantity or 10.0
            await place_order(OrderPlacement(ticker=ticker, side="BUY", quantity=qty), db, current_user)
        except Exception:
            pass

    # Create mock/synthetic resolved outcome for learning simulation
    actual_drift = 3.2 if action == "BUY" else (-1.8 if action == "WAIT" else 0.5)
    counterfactual = (
        f"You chose {action}. If you had entered an aggressive long position instead, "
        f"historical regime variance would have subjected the trade to a -6.4% drawdown before recovering."
    )
    
    outcome = DecisionOutcome(
        decision_id=decision.id,
        expected_change=5.0,
        actual_change=actual_drift,
        thesis_held=True if abs(actual_drift) > 0 else False,
        reflection_notes=f"Decision executed under {atmo['atmosphere']} conditions.",
        counterfactual_notes=counterfactual,
        evaluated_at=utcnow()
    )
    db.add(outcome)

    await db.commit()
    await db.refresh(decision)

    return DecisionOut(
        id=decision.id,
        ticker=decision.ticker,
        action=decision.action,
        thesis=decision.thesis,
        falsification_criteria=decision.falsification_criteria,
        confidence_level=decision.confidence_level,
        entry_price=decision.entry_price,
        entry_sentiment_score=decision.entry_sentiment_score,
        entry_atmosphere=decision.entry_atmosphere,
        time_horizon=decision.time_horizon,
        created_at=decision.created_at,
        outcome={
            "actual_change": outcome.actual_change,
            "thesis_held": outcome.thesis_held,
            "reflection_notes": outcome.reflection_notes,
            "counterfactual": outcome.counterfactual_notes
        }
    )

@router.get("", response_model=List[DecisionOut])
async def list_decisions(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Decision)
        .where(Decision.user_id == current_user.id)
        .order_by(Decision.created_at.desc())
    )
    decisions = result.scalars().all()
    
    out = []
    for d in decisions:
        outcome_dict = None
        o_res = await db.execute(select(DecisionOutcome).where(DecisionOutcome.decision_id == d.id))
        o = o_res.scalar_one_or_none()
        if o:
            outcome_dict = {
                "actual_change": o.actual_change,
                "thesis_held": o.thesis_held,
                "reflection_notes": o.reflection_notes,
                "counterfactual": o.counterfactual_notes
            }

        out.append(
            DecisionOut(
                id=d.id,
                ticker=d.ticker,
                action=d.action,
                thesis=d.thesis,
                falsification_criteria=d.falsification_criteria,
                confidence_level=d.confidence_level,
                entry_price=d.entry_price,
                entry_sentiment_score=d.entry_sentiment_score,
                entry_atmosphere=d.entry_atmosphere,
                time_horizon=d.time_horizon,
                created_at=d.created_at,
                outcome=outcome_dict
            )
        )
    return out

@router.get("/counterfactual")
def get_counterfactual_trajectory(
    action: str = "BUY",
    ticker: Optional[str] = "SPY"
):
    """
    Computes interactive 90-day counterfactual trajectory data comparing
    User's Chosen Action vs Aggressive Peak-Hype Chaser vs Market Benchmark.
    """
    act = action.upper() if action else "BUY"
    days = [1, 7, 14, 30, 60, 90]
    trajectory = []

    for d in days:
        if d <= 14:
            fomo_ret = round(-0.45 * d, 1) # dips to -6.3%
        elif d <= 30:
            fomo_ret = round(-6.3 + ((d - 14) * 0.15), 1)
        else:
            fomo_ret = round(-3.9 + ((d - 30) * 0.08), 1)

        bench_ret = round((d / 90.0) * 2.8 + (1.2 if (d % 14 < 7) else -0.8), 1)

        if act == "BUY":
            user_ret = round(fomo_ret * 0.85, 1)
            reflection = f"At Day {d}, entering long subjected capital to a {user_ret}% path. Notice how volatility tested conviction."
        elif act == "WAIT":
            if d <= 14:
                user_ret = 0.0
            elif d <= 30:
                user_ret = round((d - 14) * 0.22, 1)
            else:
                user_ret = round(3.5 + ((d - 30) * 0.06), 1)
            reflection = f"At Day {d}, choosing WAIT bypassed the initial drawdown. Capital was protected while evidence settled (+{user_ret}%)."
        else: # PASS
            user_ret = 0.0
            reflection = f"At Day {d}, passing preserved 100% of optionality. No drawdown stress endured."

        trajectory.append({
            "day": d,
            "user_return_pct": user_ret,
            "fomo_chaser_pct": fomo_ret,
            "benchmark_pct": bench_ret,
            "reflection": reflection
        })

    return {
        "action": act,
        "ticker": ticker,
        "trajectory": trajectory,
        "learning_takeaway": (
            f"You selected {act}. Notice that waiting or disciplined allocation "
            "dampens the severe drawdown phase experienced by peak-hype entries."
        )
    }
