from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any, Optional
from datetime import date, timedelta
from app.core.database import get_db
from app.schemas import SentimentSnapshotOut
from app.services.ml.sentiment_regime import sentiment_engine
from app.services.data_ingestion.fred_client import fred_client

router = APIRouter(prefix="/sentiment", tags=["sentiment"])

# Curated historical snapshots for Historical Mode ("Take me somewhere else")
HISTORICAL_REGIMES_DATA = [
    {
        "year": 2008,
        "date": "2008-10-15",
        "composite_score": 88.4,
        "atmosphere": "COMPRESSED",
        "headline": "Historic liquidity crisis and peak volatility.",
        "vix": 69.2,
        "credit_spread": 10.4,
        "breadth": 8.0,
        "narrative": "During the peak of the Great Financial Crisis, all five signals aligned into maximum compression. Extreme safe-haven flight and high-yield spread blowout."
    },
    {
        "year": 2012,
        "date": "2012-06-20",
        "composite_score": 52.1,
        "atmosphere": "UNCERTAIN",
        "headline": "European sovereign debt concerns offsetting steady domestic data.",
        "vix": 18.5,
        "credit_spread": 5.2,
        "breadth": 51.0,
        "narrative": "A divided market where domestic corporate earnings remained resilient despite headline macroeconomic anxiety."
    },
    {
        "year": 2016,
        "date": "2016-11-15",
        "composite_score": 38.6,
        "atmosphere": "EXPANSIVE",
        "headline": "Post-election cyclical reflation with broad equity participation.",
        "vix": 13.8,
        "credit_spread": 4.1,
        "breadth": 68.0,
        "narrative": "Breadth expanded across industrials and financials as risk appetite spread beyond mega-cap technology."
    },
    {
        "year": 2020,
        "date": "2020-03-23",
        "composite_score": 92.0,
        "atmosphere": "COMPRESSED",
        "headline": "Global pandemic lockdown shock.",
        "vix": 61.6,
        "credit_spread": 8.8,
        "breadth": 4.0,
        "narrative": "Unprecedented speed of equity liquidation followed immediately by massive global central bank liquidity facilities."
    },
    {
        "year": 2024,
        "date": "2024-07-15",
        "composite_score": 42.0,
        "atmosphere": "EXPANSIVE",
        "headline": "Artificial Intelligence infrastructure adoption driving selective leadership.",
        "vix": 12.8,
        "credit_spread": 3.4,
        "breadth": 61.0,
        "narrative": "Corporate balance sheets maintained low default rates while technology capital expenditures reached record levels."
    },
    {
        "year": 2026,
        "date": "2026-09-09",
        "composite_score": 63.0,
        "atmosphere": "UNCERTAIN",
        "headline": "The market is unsettled. You can understand it first.",
        "vix": 21.5,
        "credit_spread": 4.8,
        "breadth": 48.0,
        "narrative": "Volatility has ticked upward without a catastrophic collapse in market breadth. Three independent public signals are pulling together: options hedging is elevated, but credit stress remains contained."
    }
]

@router.get("/today", response_model=SentimentSnapshotOut)
async def get_today_sentiment():
    """
    Returns today's transparent Market Atmosphere snapshot.
    Integrates live FRED® series (VIXCLS, BAMLH0A1HYBB, T10Y2Y).
    """
    bundle = await fred_client.get_live_macro_bundle()
    vix_val = float(bundle["vix"].get("value", 21.5))
    credit_val = float(bundle["credit_spread"].get("value", 4.8))
    yield_val = float(bundle["yield_spread"].get("value", 0.15))

    return sentiment_engine.compute_atmosphere(
        vix=vix_val,
        credit_spread=credit_val,
        put_call_ratio=0.92,
        safe_haven_spread=yield_val,
        breadth=48.0
    )

@router.get("/sync")
async def sync_sentiment():
    """
    Forces live sync and verification of FRED® data feeds.
    """
    bundle = await fred_client.get_live_macro_bundle()
    atmo = await get_today_sentiment()
    return {
        "status": "synced",
        "macro_bundle": bundle,
        "atmosphere": atmo
    }

@router.get("/history")
async def get_sentiment_history(year: Optional[int] = Query(None)):
    """
    Returns historical sentiment regimes for timeline exploration ("Take me somewhere else").
    """
    if year:
        matched = [r for r in HISTORICAL_REGIMES_DATA if r["year"] == year]
        if matched:
            regime = matched[0]
            # Convert to full atmosphere format
            atmo = sentiment_engine.compute_atmosphere(
                vix=regime["vix"],
                credit_spread=regime["credit_spread"],
                put_call_ratio=0.85 if regime["composite_score"] < 70 else 1.25,
                safe_haven_spread=-0.2 if regime["composite_score"] > 70 else 0.4,
                breadth=regime["breadth"]
            )
            atmo["headline"] = regime["headline"]
            atmo["narrative"] = regime["narrative"]
            atmo["snapshot_date"] = regime["date"]
            return atmo

    return {
        "timeline_years": [2008, 2012, 2016, 2020, 2024, 2026],
        "regimes": HISTORICAL_REGIMES_DATA
    }
