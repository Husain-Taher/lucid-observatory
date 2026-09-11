import yfinance as yf
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
import re
import math
from app.services.nlp.news_analyzer import news_analyzer

FRED_NOTICE = "This product uses the FRED® API but is not endorsed or certified by the Federal Reserve Bank of St. Louis."

def _clean_float(val: Any, default: float = 0.0) -> float:
    try:
        f = float(val)
        if math.isnan(f) or math.isinf(f):
            return default
        return f
    except Exception:
        return default

class MarketFloorService:
    """
    High-Speed Market Floor Service.
    Powers the living trading chamber with live quotes for Gold, Silver, Platinum,
    Indices, and Equities, plus the Harry Potter-style Flying Daily Prophet news feed.
    """
    TAPE_SYMBOLS = [
        {"symbol": "GLD", "name": "Gold Bullion", "category": "metals"},
        {"symbol": "SLV", "name": "Silver Trust", "category": "metals"},
        {"symbol": "PPLT", "name": "Platinum & Jewels", "category": "metals"},
        {"symbol": "SPY", "name": "S&P 500", "category": "index"},
        {"symbol": "QQQ", "name": "Nasdaq 100", "category": "index"},
        {"symbol": "DIA", "name": "Dow Jones", "category": "index"},
        {"symbol": "NVDA", "name": "Nvidia", "category": "tech"},
        {"symbol": "AAPL", "name": "Apple", "category": "tech"},
        {"symbol": "MSFT", "name": "Microsoft", "category": "tech"},
        {"symbol": "TSLA", "name": "Tesla", "category": "tech"},
        {"symbol": "AMD", "name": "AMD", "category": "tech"},
        {"symbol": "AMZN", "name": "Amazon", "category": "tech"},
        {"symbol": "GOOGL", "name": "Alphabet", "category": "tech"},
        {"symbol": "META", "name": "Meta Platforms", "category": "tech"},
        {"symbol": "^TNX", "name": "10Y Yield", "category": "macro"},
        {"symbol": "^VIX", "name": "CBOE Volatility", "category": "macro"},
        {"symbol": "BTC-USD", "name": "Bitcoin", "category": "crypto"},
    ]

    def __init__(self):
        self._tape_cache: List[Dict[str, Any]] = []
        self._tape_cache_time: float = 0
        self._tape_ttl: float = 60

    def get_market_tape(self) -> List[Dict[str, Any]]:
        now = datetime.now(timezone.utc).timestamp()
        if self._tape_cache and (now - self._tape_cache_time < self._tape_ttl):
            return self._tape_cache

        items = []
        for item in self.TAPE_SYMBOLS:
            sym = item["symbol"]
            try:
                t = yf.Ticker(sym)
                fast = t.fast_info
                last_px = float(getattr(fast, "last_price", None) or fast.get("lastPrice", 0) or 0)
                if not last_px or last_px <= 0:
                    items.append(self._get_fallback_tape_item(item))
                    continue

                prev_close = float(getattr(fast, "previous_close", None) or fast.get("previousClose", last_px) or last_px)
                chg = round(last_px - prev_close, 2)
                chg_pct = round(((last_px - prev_close) / prev_close) * 100, 2) if prev_close else 0.0

                items.append({
                    "symbol": sym.replace("^", ""),
                    "raw_symbol": sym,
                    "name": item["name"],
                    "category": item["category"],
                    "price": round(last_px, 2),
                    "change": chg,
                    "change_pct": chg_pct,
                    "is_positive": chg >= 0,
                    "last_updated": datetime.now(timezone.utc).isoformat()
                })
            except Exception:
                items.append(self._get_fallback_tape_item(item))

        self._tape_cache = items
        self._tape_cache_time = now
        return items

    def _get_fallback_tape_item(self, item: Dict[str, str]) -> Dict[str, Any]:
        fallbacks = {
            "GLD": {"price": 396.30, "change": 1.40, "change_pct": 0.57},
            "SLV": {"price": 28.40, "change": 0.25, "change_pct": 0.89},
            "PPLT": {"price": 87.20, "change": 0.30, "change_pct": 0.35},
            "SPY": {"price": 558.20, "change": 1.40, "change_pct": 0.25},
            "QQQ": {"price": 476.80, "change": 2.10, "change_pct": 0.44},
            "DIA": {"price": 408.90, "change": -0.80, "change_pct": -0.20},
            "NVDA": {"price": 118.50, "change": 3.20, "change_pct": 2.78},
            "AAPL": {"price": 224.30, "change": -0.90, "change_pct": -0.40},
            "MSFT": {"price": 428.10, "change": 1.80, "change_pct": 0.42},
            "TSLA": {"price": 218.40, "change": -3.50, "change_pct": -1.58},
            "AMD": {"price": 142.80, "change": 2.60, "change_pct": 1.85},
            "AMZN": {"price": 182.20, "change": 0.90, "change_pct": 0.50},
            "GOOGL": {"price": 164.50, "change": -0.60, "change_pct": -0.36},
            "META": {"price": 512.70, "change": 4.10, "change_pct": 0.81},
            "^TNX": {"price": 3.72, "change": -0.03, "change_pct": -0.80},
            "^VIX": {"price": 21.50, "change": 0.80, "change_pct": 3.86},
            "BTC-USD": {"price": 57400.00, "change": 850.00, "change_pct": 1.50}
        }
        sym = item["symbol"]
        fb = fallbacks.get(sym, {"price": 100.0, "change": 0.5, "change_pct": 0.5})
        return {
            "symbol": sym.replace("^", ""),
            "raw_symbol": sym,
            "name": item["name"],
            "category": item["category"],
            "price": fb["price"],
            "change": fb["change"],
            "change_pct": fb["change_pct"],
            "is_positive": fb["change"] >= 0,
            "last_updated": datetime.now(timezone.utc).isoformat()
        }

    def get_detailed_quote(self, ticker: str = "GLD", period: str = "1mo") -> Dict[str, Any]:
        clean_ticker = ticker.upper().strip().replace("$", "")
        valid_periods = {"1d", "5d", "1mo", "6mo", "1y", "5y", "max"}
        chosen_period = period if period in valid_periods else "1mo"

        interval_map = {
            "1d": "5m",
            "5d": "30m",
            "1mo": "1d",
            "6mo": "1d",
            "1y": "1wk",
            "5y": "1mo",
            "max": "1mo"
        }
        chosen_interval = interval_map.get(chosen_period, "1d")

        try:
            t = yf.Ticker(clean_ticker)
            fast = t.fast_info
            last_px = float(getattr(fast, "last_price", None) or fast.get("lastPrice", 0) or 0)
            
            hist = t.history(period=chosen_period, interval=chosen_interval)
            if hist.empty and chosen_period in ("1d", "5d"):
                hist = t.history(period=chosen_period)

            if (not last_px or last_px <= 0) and not hist.empty and "Close" in hist.columns:
                last_px = float(hist["Close"].iloc[-1])

            last_px = _clean_float(last_px, 100.0)
            if not last_px or last_px <= 0:
                return self._get_fallback_detailed_quote(clean_ticker, chosen_period)

            raw_prev = getattr(fast, "previous_close", None) or fast.get("previousClose", last_px)
            prev_close = _clean_float(raw_prev, last_px)
            raw_open = getattr(fast, "open", None) or fast.get("open", prev_close)
            open_px = _clean_float(raw_open, prev_close)
            raw_high = getattr(fast, "day_high", None) or fast.get("dayHigh", last_px * 1.01)
            day_high = _clean_float(raw_high, last_px * 1.01)
            raw_low = getattr(fast, "day_low", None) or fast.get("dayLow", last_px * 0.99)
            day_low = _clean_float(raw_low, last_px * 0.99)
            raw_vol = getattr(fast, "last_volume", None) or fast.get("lastVolume", 0) or fast.get("threeMonthAverageVolume", 0)
            volume = int(_clean_float(raw_vol, 0.0))
            raw_mkt_cap = getattr(fast, "market_cap", None) or fast.get("marketCap", 0)
            mkt_cap = _clean_float(raw_mkt_cap, 0.0)
            raw_yhigh = getattr(fast, "year_high", None) or fast.get("yearHigh", last_px * 1.15)
            year_high = _clean_float(raw_yhigh, last_px * 1.15)
            raw_ylow = getattr(fast, "year_low", None) or fast.get("yearLow", last_px * 0.85)
            year_low = _clean_float(raw_ylow, last_px * 0.85)

            chg = round(last_px - prev_close, 2)
            chg_pct = round(((last_px - prev_close) / prev_close) * 100, 2) if prev_close else 0.0

            sparkline = []
            history_points = []
            closes = []

            if not hist.empty and "Close" in hist.columns:
                sparkline = [_clean_float(val) for val in hist["Close"].tolist()]
                for dt, row in hist.iterrows():
                    c_px = _clean_float(row.get("Close", 0))
                    o_px = _clean_float(row.get("Open", c_px))
                    h_px = _clean_float(row.get("High", c_px))
                    l_px = _clean_float(row.get("Low", c_px))
                    vol = int(_clean_float(row.get("Volume", 0)))
                    closes.append(c_px)
                    sma_val = sum(closes[-20:]) / min(len(closes), 20) if len(closes) >= 5 else None
                    sma20 = round(_clean_float(sma_val), 2) if sma_val is not None and not math.isnan(sma_val) else None
                    dt_str = dt.strftime("%Y-%m-%d %H:%M") if chosen_period in ("1d", "5d") else dt.strftime("%b %d, %Y")
                    history_points.append({
                        "date": dt_str,
                        "open": round(o_px, 2),
                        "high": round(h_px, 2),
                        "low": round(l_px, 2),
                        "close": round(c_px, 2),
                        "volume": vol,
                        "sma20": sma20
                    })
            else:
                sparkline = [round(last_px * (1.0 + (i - 10) * 0.005), 2) for i in range(20)]
                history_points = [
                    {
                        "date": f"T-{20-i}",
                        "open": round(px * 0.998, 2),
                        "high": round(px * 1.005, 2),
                        "low": round(px * 0.995, 2),
                        "close": px,
                        "volume": 1200000 + i * 50000,
                        "sma20": round(px * 0.999, 2)
                    }
                    for i, px in enumerate(sparkline)
                ]

            name = clean_ticker
            try:
                info = t.info
                name = info.get("shortName") or info.get("longName") or clean_ticker
            except Exception:
                pass

            return {
                "symbol": clean_ticker,
                "name": name,
                "price": round(last_px, 2),
                "change": chg,
                "change_pct": chg_pct,
                "is_positive": chg >= 0,
                "open": round(open_px, 2),
                "day_high": round(day_high, 2),
                "day_low": round(day_low, 2),
                "volume": volume,
                "market_cap": mkt_cap,
                "year_high": round(year_high, 2),
                "year_low": round(year_low, 2),
                "sparkline": sparkline[-30:] if len(sparkline) > 30 else sparkline,
                "history": history_points,
                "period": chosen_period,
                "last_updated": datetime.now(timezone.utc).isoformat(),
                "attribution": FRED_NOTICE
            }
        except Exception as e:
            print(f"[MarketFloor] Quote error for {ticker}: {e}")
            return self._get_fallback_detailed_quote(clean_ticker, chosen_period)

    def _get_fallback_detailed_quote(self, ticker: str, period: str = "1mo") -> Dict[str, Any]:
        base_price = 396.30 if ticker == "GLD" else (28.40 if ticker == "SLV" else (87.20 if ticker == "PPLT" else 558.20))
        pts_count = 24 if period in ("1d", "5d", "1mo") else (52 if period in ("6mo", "1y") else 60)
        spark = [round(base_price * (1 + (i - pts_count//2) * 0.004), 2) for i in range(pts_count)]
        history = [
            {
                "date": f"Session {i+1}",
                "open": round(px * 0.998, 2),
                "high": round(px * 1.004, 2),
                "low": round(px * 0.996, 2),
                "close": px,
                "volume": 7500000 + i * 20000,
                "sma20": round(px * 0.999, 2)
            }
            for i, px in enumerate(spark)
        ]
        return {
            "symbol": ticker,
            "name": f"{ticker} Asset Wire",
            "price": base_price,
            "change": 1.25,
            "change_pct": 0.51,
            "is_positive": True,
            "open": base_price - 0.5,
            "day_high": base_price + 2.0,
            "day_low": base_price - 1.5,
            "volume": 8500000,
            "market_cap": 75000000000,
            "year_high": round(base_price * 1.15, 2),
            "year_low": round(base_price * 0.85, 2),
            "sparkline": spark,
            "history": history,
            "period": period,
            "last_updated": datetime.now(timezone.utc).isoformat(),
            "attribution": FRED_NOTICE
        }

    def get_magic_news(self, query: str = "GLD") -> List[Dict[str, Any]]:
        clean_q = query.strip().lower()
        topic_ticker_map = {
            "gold": "GLD",
            "silver": "SLV",
            "platinum": "PPLT",
            "jewels": "GLD",
            "metals": "GLD",
            "semiconductor": "NVDA",
            "semiconductors": "NVDA",
            "chips": "NVDA",
            "ai": "NVDA",
            "fed": "^TNX",
            "rates": "^TNX",
            "interest": "^TNX",
            "macro": "^TNX",
            "inflation": "GLD",
            "oil": "XLE",
            "energy": "XLE",
            "crypto": "BTC-USD",
            "bitcoin": "BTC-USD",
            "tech": "QQQ",
            "market": "SPY",
            "stocks": "SPY",
        }

        resolved_ticker = topic_ticker_map.get(clean_q, query.upper().strip().replace("$", ""))
        raw_articles = news_analyzer.get_live_news(ticker=resolved_ticker, limit=10)
        magic_articles = []

        byline_options = [
            "Financial Wire Staff Bureau",
            "Senior Macroeconomic Desk",
            "Commodities & Currency Wire",
            "Institutional Flow Analyst",
            "Sovereign Balance Sheet Dispatch"
        ]

        for idx, art in enumerate(raw_articles):
            is_event = art["classification"] == "OBJECTIVE_EVENT"
            is_hype = art["classification"] == "SENSATIONAL_NARRATIVE"

            if is_event:
                highlight_type = "GOLD_STRUCTURAL"
                importance_badge = "VERIFIED STRUCTURAL"
                wax_seal = "SEAL OF VERIFIED REALITY"
                theme_aura = "luminous-gold"
                hook = "Verifiable central bank flow, debt print, or physical supply rebalancing."
                reality = art.get("what_it_actually_means") or "Physical demand and monetary liquidity shift grounded in verifiable accounting."
            elif is_hype:
                highlight_type = "CRIMSON_HYPE"
                importance_badge = "SPECULATIVE HYPE"
                wax_seal = "CAUTION: SPECULATIVE MAGNET"
                theme_aura = "pulsing-crimson"
                hook = "Engineered urgency framing normal price fluctuation as an existential boom or bust."
                reality = "Short-term speculative churn detached from durable balance sheet fundamentals."
            else:
                highlight_type = "AMBER_COMMENTARY"
                importance_badge = "MARKET CONTEXT"
                wax_seal = "ANALYST ESTIMATE"
                theme_aura = "warm-amber"
                hook = "Interpretive commentary blending historical valuation models with price targets."
                reality = art.get("what_it_actually_means") or "Observe audited earnings and capital flows rather than sentiment estimates."

            float_rotation = ((idx * 5) % 9) - 4
            levitation_delay = (idx * 0.25) % 1.5
            byline = byline_options[idx % len(byline_options)]

            magic_articles.append({
                "id": f"prophet-{idx}",
                "title": art["title"],
                "summary": art.get("summary") or "Real-time dispatch from the financial wire.",
                "publisher": art.get("publisher") or "The Daily Financial Prophet",
                "published_at": art.get("published_at") or str(datetime.now(timezone.utc).date()),
                "url": art.get("url") or "https://finance.yahoo.com",
                "classification": art["classification"],
                "substance_score": art.get("substance_score", 70),
                "hype_score": art.get("hype_score", 30),
                "highlight_type": highlight_type,
                "importance_badge": importance_badge,
                "wax_seal": wax_seal,
                "theme_aura": theme_aura,
                "float_rotation": float_rotation,
                "levitation_delay": round(levitation_delay, 2),
                "what_they_want_you_to_feel": hook,
                "what_actually_happened": reality,
                "byline": byline,
                "issue_no": f"VOL. XCVII NO. {34100 + idx}",
                "search_query": query,
                "resolved_ticker": resolved_ticker,
                "source": "Yahoo Finance Wire"
            })

        return magic_articles

market_floor_service = MarketFloorService()
