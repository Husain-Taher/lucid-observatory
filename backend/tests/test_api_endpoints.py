import pytest
import os
import sys
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c

def test_health(client):
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

def test_assessment_questions(client):
    res = client.get("/api/v1/assessment/questions")
    assert res.status_code == 200
    questions = res.json()
    assert len(questions) == 5
    assert any(q["category"] == "risk" for q in questions)

def test_sentiment_today(client):
    res = client.get("/api/v1/sentiment/today")
    assert res.status_code == 200
    data = res.json()
    assert "composite_score" in data
    assert "atmosphere" in data
    assert len(data["signals"]) == 5

def test_modules_list_and_compounding_data(client):
    res = client.get("/api/v1/modules")
    assert res.status_code == 200
    modules = res.json()
    assert len(modules) == 6

    # Test compounding calculation
    c_res = client.get("/api/v1/modules/compounding/data?principal=5000&years=10")
    assert c_res.status_code == 200
    c_data = c_res.json()
    assert "with_contrib_series" in c_data
    assert "insight" in c_data

def test_claim_investigation(client):
    claim_payload = {"text": "AI stocks are guaranteed to 10x over the next 5 years"}
    res = client.post("/api/v1/claims", json=claim_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["deconstructed"]["subject"] in ("AI Stocks", "AI stocks")
    assert data["deconstructed"]["certainty"] == "EXTREME"
    assert len(data["evidence_stack"]) >= 4
    assert "grounded_summary" in data
    assert "uncomfortable_truth" in data

def test_portfolio_and_order(client):
    # Get portfolio
    res = client.get("/api/v1/portfolio")
    assert res.status_code == 200
    initial_cash = res.json()["cash_balance"]

    # Place BUY order
    buy_res = client.post(
        "/api/v1/portfolio/orders",
        json={"ticker": "SPY", "side": "BUY", "quantity": 5.0}
    )
    assert buy_res.status_code == 200
    updated = buy_res.json()
    assert updated["cash_balance"] < initial_cash
    assert any(h["ticker"] == "SPY" for h in updated["holdings"])
