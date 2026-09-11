import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.services.integrity.integrity_engine import integrity_engine

@pytest.mark.asyncio
async def test_methodologies_list():
    meths = integrity_engine.get_methodologies()
    assert "AAOIFI" in meths
    assert "DJIM" in meths
    assert "FTSE" in meths
    assert "MSCI" in meths
    assert meths["AAOIFI"]["debt_threshold"] == 30.0

@pytest.mark.asyncio
async def test_screen_ticker_aapl():
    res = integrity_engine.screen_ticker("AAPL", "AAOIFI")
    assert res["symbol"] == "AAPL"
    assert res["is_eligible"] is True
    assert res["status_verdict"] == "ELIGIBLE"
    assert res["integrity_index"] > 80
    assert "ratios" in res
    assert "debt_ratio" in res["ratios"]
    assert res["ratios"]["debt_ratio"]["passed"] is True
    assert res["business_activities"]["is_passed"] is True
    assert len(res["business_activities"]["subsidiaries"]) > 0

@pytest.mark.asyncio
async def test_screen_ticker_jpm_restricted():
    res = integrity_engine.screen_ticker("JPM", "AAOIFI")
    assert res["symbol"] == "JPM"
    assert res["is_eligible"] is False
    assert res["status_verdict"] == "NON_COMPLIANT"
    assert len(res["business_activities"]["restricted_activities"]) > 0

@pytest.mark.asyncio
async def test_capital_trail():
    trail = integrity_engine.get_capital_trail("AAPL")
    assert trail["symbol"] == "AAPL"
    assert len(trail["stages"]) >= 5
    stage_ids = [st["stage_id"] for st in trail["stages"]]
    assert "INVESTMENT" in stage_ids
    assert "BUSINESS_SEGMENTS" in stage_ids
    assert "SUBSIDIARIES" in stage_ids
    assert "BALANCE_SHEET_DEBT" in stage_ids

@pytest.mark.asyncio
async def test_monitoring_history():
    history = integrity_engine.get_monitoring_history("AAPL")
    assert history["symbol"] == "AAPL"
    assert len(history["quarters"]) == 4
    assert history["monitoring_status"] in ("STABLE", "TIGHTENING", "DRIFT_ALERT")

@pytest.mark.asyncio
async def test_purification_calculator():
    purif = integrity_engine.calculate_purification("AAPL", shares=100)
    assert purif["symbol"] == "AAPL"
    assert purif["shares_owned"] == 100
    assert "purification_amount_due" in purif
    assert purif["purification_amount_due"] >= 0

@pytest.mark.asyncio
async def test_integrity_api_endpoints():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        m_res = await ac.get("/api/v1/integrity/methodologies")
        assert m_res.status_code == 200
        assert "AAOIFI" in m_res.json()

        s_res = await ac.get("/api/v1/integrity/screen?ticker=AAPL&methodology=DJIM")
        assert s_res.status_code == 200
        assert s_res.json()["symbol"] == "AAPL"

        t_res = await ac.get("/api/v1/integrity/capital-trail?ticker=AAPL")
        assert t_res.status_code == 200
        assert len(t_res.json()["stages"]) >= 5

        mon_res = await ac.get("/api/v1/integrity/monitoring?ticker=AAPL")
        assert mon_res.status_code == 200
        assert len(mon_res.json()["quarters"]) == 4

        p_res = await ac.post("/api/v1/integrity/purify", json={"ticker": "AAPL", "shares": 50})
        assert p_res.status_code == 200
        assert p_res.json()["shares_owned"] == 50
