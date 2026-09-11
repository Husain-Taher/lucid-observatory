from fastapi import APIRouter, Query
from typing import List, Dict, Any, Optional
from app.services.data_ingestion.market_floor_service import market_floor_service

router = APIRouter(prefix="/market", tags=["market_floor"])

@router.get("/tape")
def get_market_tape():
    """
    Returns streaming real-time prices for the running ticker tape across
    Gold, Silver, Platinum, major indices, yields, and tech leaders.
    """
    return market_floor_service.get_market_tape()

@router.get("/quote")
def get_detailed_quote(
    ticker: str = Query("GLD", description="Asset ticker, e.g. GLD, SLV, NVDA, AAPL, SPY"),
    period: str = Query("1mo", description="Historical timeframe: 1d, 5d, 1mo, 6mo, 1y, 5y, max")
):
    """
    Returns detailed quote with multi-timeframe candle history, volume, and 20-period moving average.
    """
    return market_floor_service.get_detailed_quote(ticker=ticker, period=period)

@router.get("/magic-news")
def get_magic_news(
    query: str = Query("GLD", description="Search query, ticker, or sector (e.g. GLD, semiconductors, fed, oil)"),
    ticker: Optional[str] = Query(None, description="Legacy ticker alias")
):
    """
    Returns authentic Daily Prophet vintage broadsheet articles,
    separating verified structural realities from speculative emotional hype.
    """
    search_term = ticker if ticker else query
    return market_floor_service.get_magic_news(query=search_term)
