from fastapi import APIRouter
from app.services.data_ingestion.commodities_service import commodities_service

router = APIRouter(prefix="/commodities", tags=["commodities"])

@router.get("/live")
def get_live_commodities():
    """
    Returns live quotes for Gold, Silver, Platinum/Jewels, S&P 500,
    Gold/Silver Ratio (GSR), and real-time metals regime prediction.
    """
    return commodities_service.get_live_quotes()

@router.get("/purchasing-power")
def get_purchasing_power_timeline():
    """
    Returns 100-year real purchasing power comparison (1925-2026)
    for 1 oz Gold vs 50 oz Silver vs $1,000 Cash.
    """
    return commodities_service.get_purchasing_power_timeline()
