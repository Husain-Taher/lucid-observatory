import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.services.data_ingestion.market_floor_service import market_floor_service

@pytest.mark.asyncio
async def test_market_tape():
    tape = market_floor_service.get_market_tape()
    assert len(tape) >= 10
    symbols = [item["symbol"] for item in tape]
    assert "GLD" in symbols
    assert "SLV" in symbols
    assert "SPY" in symbols

@pytest.mark.asyncio
async def test_detailed_quote():
    quote = market_floor_service.get_detailed_quote("GLD", period="1y")
    assert quote["symbol"] == "GLD"
    assert quote["price"] > 0
    assert len(quote["sparkline"]) > 0
    assert "history" in quote
    assert len(quote["history"]) > 0
    assert quote["period"] == "1y"

@pytest.mark.asyncio
async def test_magic_news():
    news = market_floor_service.get_magic_news("semiconductors")
    assert len(news) > 0
    first = news[0]
    assert "highlight_type" in first
    assert first["highlight_type"] in ("GOLD_STRUCTURAL", "CRIMSON_HYPE", "AMBER_COMMENTARY")
    assert "wax_seal" in first
    assert "what_they_want_you_to_feel" in first
    assert "what_actually_happened" in first
    assert "byline" in first

@pytest.mark.asyncio
async def test_market_floor_api():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        t_res = await ac.get("/api/v1/market/tape")
        assert t_res.status_code == 200
        assert isinstance(t_res.json(), list)

        q_res = await ac.get("/api/v1/market/quote?ticker=GLD&period=6mo")
        assert q_res.status_code == 200
        data = q_res.json()
        assert data["symbol"] == "GLD"
        assert "history" in data
        assert data["period"] == "6mo"

        m_res = await ac.get("/api/v1/market/magic-news?query=gold")
        assert m_res.status_code == 200
        assert isinstance(m_res.json(), list)
