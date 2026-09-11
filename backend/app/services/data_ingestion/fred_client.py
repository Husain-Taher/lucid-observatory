import httpx
import os
from typing import Dict, Any, Optional
from datetime import datetime, timezone
from app.core.config import settings

ATTRIBUTION_NOTICE = "This product uses the FRED® API but is not endorsed or certified by the Federal Reserve Bank of St. Louis."

class FredClient:
    """
    Asynchronous client for St. Louis Fed FRED® API with local in-memory caching.
    """
    BASE_URL = "https://api.stlouisfed.org/fred/series/observations"

    def __init__(self):
        self.api_key = settings.FRED_API_KEY
        self._cache: Dict[str, Dict[str, Any]] = {}
        self._cache_ttl_seconds = 3600  # 1 hour cache

    async def get_latest_observation(self, series_id: str) -> Dict[str, Any]:
        """
        Fetches the latest non-empty observation for a given series.
        Cached for 1 hour.
        """
        now = datetime.now(timezone.utc).timestamp()
        if series_id in self._cache:
            entry = self._cache[series_id]
            if now - entry["cached_at"] < self._cache_ttl_seconds:
                return entry["data"]

        if not self.api_key or self.api_key.startswith("your_"):
            fallback = self._get_fallback(series_id)
            return fallback

        params = {
            "series_id": series_id,
            "api_key": self.api_key,
            "file_type": "json",
            "sort_order": "desc",
            "limit": 10
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(self.BASE_URL, params=params)
                if resp.status_code == 200:
                    data = resp.json()
                    observations = data.get("observations", [])
                    for obs in observations:
                        val_str = obs.get("value", "").strip()
                        if val_str and val_str != ".":
                            try:
                                val = float(val_str)
                                result = {
                                    "series_id": series_id,
                                    "value": val,
                                    "date": obs.get("date"),
                                    "source": "FRED® API",
                                    "attribution": ATTRIBUTION_NOTICE
                                }
                                self._cache[series_id] = {
                                    "cached_at": now,
                                    "data": result
                                }
                                return result
                            except ValueError:
                                continue
        except Exception as e:
            print(f"[FRED] Error fetching {series_id}: {e}")

        fallback = self._get_fallback(series_id)
        return fallback

    def _get_fallback(self, series_id: str) -> Dict[str, Any]:
        fallbacks = {
            "VIXCLS": {"value": 21.5, "date": "2026-09-08"},
            "BAMLH0A1HYBB": {"value": 4.80, "date": "2026-09-08"},
            "T10Y2Y": {"value": 0.15, "date": "2026-09-08"},
            "CPIAUCSL": {"value": 314.5, "date": "2026-08-01"}
        }
        fb = fallbacks.get(series_id, {"value": 0.0, "date": "2026-09-08"})
        return {
            "series_id": series_id,
            "value": fb["value"],
            "date": fb["date"],
            "source": "FRED® Calibrated (Offline Fallback)",
            "attribution": ATTRIBUTION_NOTICE
        }

    async def get_live_macro_bundle(self) -> Dict[str, Any]:
        vix = await self.get_latest_observation("VIXCLS")
        credit = await self.get_latest_observation("BAMLH0A1HYBB")
        yield_spread = await self.get_latest_observation("T10Y2Y")
        cpi = await self.get_latest_observation("CPIAUCSL")

        return {
            "vix": vix,
            "credit_spread": credit,
            "yield_spread": yield_spread,
            "cpi": cpi,
            "attribution": ATTRIBUTION_NOTICE
        }

fred_client = FredClient()
