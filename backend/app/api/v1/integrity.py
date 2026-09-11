from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.services.integrity.integrity_engine import integrity_engine

router = APIRouter(prefix="/integrity", tags=["investment_integrity"])

class PurificationRequest(BaseModel):
    ticker: str = "AAPL"
    shares: float = 100.0
    dividend_amount: Optional[float] = None

@router.get("/methodologies")
def get_methodologies():
    """
    Returns supported screening methodologies (AAOIFI, DJIM, FTSE, MSCI, CUSTOM_ETHICAL).
    """
    return integrity_engine.get_methodologies()

@router.get("/screen")
def screen_ticker(
    ticker: str = Query("AAPL", description="Stock symbol (e.g. AAPL, MSFT, NVDA, TSLA, JPM)"),
    methodology: str = Query("AAOIFI", description="Methodology key: AAOIFI, DJIM, FTSE, MSCI, CUSTOM_ETHICAL")
):
    """
    Full multi-dimensional Investment Integrity Report including business activities,
    subsidiary exposures, financial structure ratios, and scorecards.
    """
    return integrity_engine.screen_ticker(ticker=ticker, methodology=methodology)

@router.get("/capital-trail")
def get_capital_trail(
    ticker: str = Query("AAPL", description="Stock symbol (e.g. AAPL, MSFT, NVDA, TSLA, JPM)")
):
    """
    The Capital Trail: Follow your investment dollar from allocation to public entity,
    business segments, subsidiaries, balance sheet debt, and final verdict.
    """
    return integrity_engine.get_capital_trail(ticker=ticker)

@router.get("/monitoring")
def get_monitoring_history(
    ticker: str = Query("AAPL", description="Stock symbol (e.g. AAPL, MSFT, NVDA, TSLA, JPM)")
):
    """
    Continuous Monitoring: 4-quarter filing drift history tracking changes in debt/cash ratios.
    """
    return integrity_engine.get_monitoring_history(ticker=ticker)

@router.post("/purify")
def calculate_purification(payload: PurificationRequest):
    """
    Purification Calculator: Independent calculation of dividend cleansing amount.
    """
    return integrity_engine.calculate_purification(
        ticker=payload.ticker,
        shares=payload.shares,
        dividend_amount=payload.dividend_amount
    )
