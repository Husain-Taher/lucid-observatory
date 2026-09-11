import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.services.data_ingestion.fred_client import fred_client
from app.services.data_ingestion.commodities_service import commodities_service
from app.services.nlp.news_analyzer import news_analyzer

@pytest.mark.asyncio
async def test_fred_client_live_bundle():
    bundle = await fred_client.get_live_macro_bundle()
    assert "vix" in bundle
    assert "credit_spread" in bundle
    assert "yield_spread" in bundle
    assert "cpi" in bundle
    assert "FRED® API" in bundle["attribution"] or "FRED® Calibrated" in bundle["attribution"]

@pytest.mark.asyncio
async def test_commodities_service():
    quotes_res = commodities_service.get_live_quotes()
    assert "quotes" in quotes_res
    assert "gold" in quotes_res["quotes"]
    assert "silver" in quotes_res["quotes"]
    assert "gold_silver_ratio" in quotes_res
    assert quotes_res["gold_silver_ratio"]["ratio"] > 0
    assert "metals_regime" in quotes_res

    timeline_res = commodities_service.get_purchasing_power_timeline()
    assert len(timeline_res["timeline"]) >= 5
    assert timeline_res["timeline"][0]["year"] == 1925
    assert timeline_res["timeline"][-1]["year"] == 2026

@pytest.mark.asyncio
async def test_news_analyzer():
    news = news_analyzer.get_live_news("GLD", limit=3)
    assert len(news) > 0
    assert "title" in news[0]
    assert "classification" in news[0]
    assert news[0]["classification"] in ("OBJECTIVE_EVENT", "SENSATIONAL_NARRATIVE", "MIXED_COMMENTARY")

    grounding = news_analyzer.ground_claim_against_news("Gold is guaranteed to 10x in 6 months", "GLD")
    assert "grounding_score" in grounding
    assert 0 <= grounding["grounding_score"] <= 100
    assert "what_it_actually_means" in grounding

@pytest.mark.asyncio
async def test_api_endpoints():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Commodities live
        c_res = await ac.get("/api/v1/commodities/live")
        assert c_res.status_code == 200
        assert "quotes" in c_res.json()

        # Purchasing power
        p_res = await ac.get("/api/v1/commodities/purchasing-power")
        assert p_res.status_code == 200
        assert "timeline" in p_res.json()

        # News live
        n_res = await ac.get("/api/v1/news/live?ticker=GLD")
        assert n_res.status_code == 200
        assert isinstance(n_res.json(), list)

        # Counterfactual trajectory
        cf_res = await ac.get("/api/v1/decisions/counterfactual?action=WAIT")
        assert cf_res.status_code == 200
        cf_data = cf_res.json()
        assert cf_data["action"] == "WAIT"
        assert len(cf_data["trajectory"]) == 6

        # Sentiment live
        s_res = await ac.get("/api/v1/sentiment/today")
        assert s_res.status_code == 200
        assert s_res.json()["composite_score"] >= 0
