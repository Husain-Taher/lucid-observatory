from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Dict, Any
from datetime import date, datetime, timezone
from app.core.database import get_db
from app.models import User, Portfolio, Holding, Transaction, utcnow
from app.schemas import PortfolioOut, HoldingOut, OrderPlacement
from app.api.v1.auth import get_current_user

router = APIRouter(prefix="/portfolio", tags=["portfolio"])

# Approximate market prices for paper simulation
MOCK_MARKET_PRICES = {
    "SPY": 545.20,
    "NVDA": 128.50,
    "AAPL": 224.30,
    "MSFT": 442.80,
    "TSLA": 218.40,
    "TLT": 98.60,
    "GLD": 232.10,
    "BIL": 91.50
}

def get_current_price(ticker: str) -> float:
    cleaned = ticker.upper().replace("$", "")
    return MOCK_MARKET_PRICES.get(cleaned, 150.0)

@router.get("", response_model=PortfolioOut)
async def get_portfolio(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Portfolio).where(Portfolio.user_id == current_user.id))
    portfolio = result.scalar_one_or_none()
    if not portfolio:
        portfolio = Portfolio(user_id=current_user.id, cash_balance=100000.0)
        db.add(portfolio)
        await db.commit()
        await db.refresh(portfolio)

    h_result = await db.execute(select(Holding).where(Holding.portfolio_id == portfolio.id))
    holdings_records = h_result.scalars().all()

    holdings_out = []
    total_holdings_val = 0.0

    for h in holdings_records:
        px = get_current_price(h.ticker)
        mkt_val = h.quantity * px
        cost_val = h.quantity * h.avg_cost
        unrealized = mkt_val - cost_val
        unrealized_pct = (unrealized / cost_val) * 100.0 if cost_val > 0 else 0.0

        total_holdings_val += mkt_val
        holdings_out.append(
            HoldingOut(
                ticker=h.ticker,
                quantity=h.quantity,
                avg_cost=h.avg_cost,
                current_price=px,
                market_value=round(mkt_val, 2),
                unrealized_pl=round(unrealized, 2),
                unrealized_pl_pct=round(unrealized_pct, 2)
            )
        )

    return PortfolioOut(
        trading_account_id=portfolio.trading_account_id,
        cash_balance=round(portfolio.cash_balance, 2),
        portfolio_value=round(portfolio.cash_balance + total_holdings_val, 2),
        holdings=holdings_out
    )

@router.post("/orders", response_model=PortfolioOut)
async def place_order(
    payload: OrderPlacement,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Portfolio).where(Portfolio.user_id == current_user.id))
    portfolio = result.scalar_one_or_none()
    if not portfolio:
        portfolio = Portfolio(user_id=current_user.id, cash_balance=100000.0)
        db.add(portfolio)
        await db.flush()

    ticker = payload.ticker.upper().replace("$", "")
    px = get_current_price(ticker)
    total_cost = payload.quantity * px

    if payload.side.upper() == "BUY":
        if portfolio.cash_balance < total_cost:
            raise HTTPException(status_code=400, detail="Insufficient cash in paper portfolio.")
        
        portfolio.cash_balance -= total_cost

        # Update or create holding
        h_res = await db.execute(
            select(Holding).where(
                Holding.portfolio_id == portfolio.id,
                Holding.ticker == ticker
            )
        )
        holding = h_res.scalar_one_or_none()
        if holding:
            new_qty = holding.quantity + payload.quantity
            new_avg = ((holding.quantity * holding.avg_cost) + total_cost) / new_qty
            holding.quantity = new_qty
            holding.avg_cost = new_avg
        else:
            holding = Holding(
                portfolio_id=portfolio.id,
                ticker=ticker,
                quantity=payload.quantity,
                avg_cost=px
            )
            db.add(holding)

    elif payload.side.upper() == "SELL":
        h_res = await db.execute(
            select(Holding).where(
                Holding.portfolio_id == portfolio.id,
                Holding.ticker == ticker
            )
        )
        holding = h_res.scalar_one_or_none()
        if not holding or holding.quantity < payload.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient holdings of {ticker} to sell.")

        portfolio.cash_balance += total_cost
        holding.quantity -= payload.quantity
        if holding.quantity <= 0.001:
            await db.delete(holding)
    else:
        raise HTTPException(status_code=400, detail="Side must be BUY or SELL.")

    # Record transaction with link to sentiment date
    tx = Transaction(
        portfolio_id=portfolio.id,
        ticker=ticker,
        side=payload.side.upper(),
        quantity=payload.quantity,
        price=px,
        sentiment_snapshot_date=date.today(),
        executed_at=utcnow()
    )
    db.add(tx)

    await db.commit()
    return await get_portfolio(db, current_user)
