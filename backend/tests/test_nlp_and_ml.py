import pytest
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.nlp.claim_deconstructor import claim_deconstructor
from app.services.nlp.persuasion_detector import persuasion_detector
from app.services.ml.sentiment_regime import sentiment_engine
from app.services.ml.behavioral_mirror import behavioral_mirror
from app.services.narrative.grounder import narrative_grounder

def test_claim_deconstructor():
    claim = "NVDA is guaranteed to outperform the S&P 500 over the next 5 years"
    res = claim_deconstructor.deconstruct(claim)
    assert res["subject"] == "NVDA"
    assert res["claim_type"] == "Outperform"
    assert "Next 5 Years" in res["time_horizon"]
    assert "S&P 500" in res["comparison"]
    assert res["certainty"] == "EXTREME"

def test_persuasion_classifier_hype():
    hype_text = "Act now! Guaranteed 10x gains in 30 days before this AI stock moons to infinity!"
    res = persuasion_detector.predict(hype_text)
    assert res["is_hype"] is True
    assert res["hype_score"] >= 0.5
    assert len(res["linguistic_cues"]) > 0

def test_persuasion_classifier_objective():
    objective_text = "The company reported 8% revenue growth while gross margins compressed by 40 basis points."
    res = persuasion_detector.predict(objective_text)
    assert res["is_hype"] is False
    assert res["hype_score"] < 0.5

def test_sentiment_engine_calculation():
    res = sentiment_engine.compute_atmosphere(
        vix=35.0, credit_spread=7.5, put_call_ratio=1.2, safe_haven_spread=-0.5, breadth=20.0
    )
    assert res["composite_score"] >= 70.0
    assert res["atmosphere"] in ("TENSE", "COMPRESSED")
    assert len(res["signals"]) == 5
    for sig in res["signals"]:
        assert "current_value" in sig
        assert "historical_percentile" in sig
        assert "source" in sig

def test_behavioral_mirror_fomo_flag():
    decisions = [
        {"action": "BUY", "entry_sentiment_score": 78.0, "ticker": "NVDA"},
        {"action": "BUY", "entry_sentiment_score": 82.0, "ticker": "TSLA"},
    ]
    flags = behavioral_mirror.analyze_patterns(decisions, [])
    assert any(f["pattern_type"] == "SENTIMENT_CHASING" for f in flags)

def test_narrative_grounder_no_advice():
    text_with_advice = "The market is tense. You should buy gold immediately and put your money in Treasuries."
    cleaned = narrative_grounder.filter_advice(text_with_advice)
    assert "you should buy" not in cleaned.lower()
    assert "put your money in" not in cleaned.lower()
