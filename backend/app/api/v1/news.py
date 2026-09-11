from fastapi import APIRouter, Query
from typing import Optional
from pydantic import BaseModel
from app.services.nlp.news_analyzer import news_analyzer

router = APIRouter(prefix="/news", tags=["news"])

class AnalyzeTextRequest(BaseModel):
    text: str
    ticker: Optional[str] = "SPY"

@router.get("/live")
def get_live_news(ticker: str = Query("GLD", description="Asset ticker, e.g. GLD, SLV, SPY, NVDA")):
    """
    Returns real, live financial news articles with Fact vs Hype classification.
    Zero synthetic or fake articles.
    """
    return news_analyzer.get_live_news(ticker=ticker)

@router.post("/analyze")
def analyze_text(req: AnalyzeTextRequest):
    """
    Deconstructs text or headlines to determine Fact vs Hype posture.
    """
    return news_analyzer.classify_fact_vs_hype(title=req.text)
