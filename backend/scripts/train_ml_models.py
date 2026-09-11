import os
import sys

# Ensure backend directory is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.nlp.persuasion_detector import persuasion_detector
from app.services.ml.sentiment_regime import sentiment_engine
from app.services.nlp.claim_deconstructor import claim_deconstructor

def main():
    print("==========================================================")
    print("  LUCID — Conventional NLP & Machine Learning Training   ")
    print("==========================================================")

    # 1. Train Hype & FOMO Persuasion Classifier
    print("\n[1/3] Training Financial Hype & FOMO Persuasion Classifier...")
    train_res = persuasion_detector.train()
    print(f"  -> Model trained successfully on {train_res['samples_count']} samples.")
    print(f"  -> Train F1-Score: {train_res['train_f1_score']:.4f}")
    print(f"  -> Serialized to: {train_res['model_path']}")

    # Test persuasion detector inference
    test_claim = "AI stocks are guaranteed to 10x by next month, buy now or regret it forever!"
    pred = persuasion_detector.predict(test_claim)
    print(f"  -> Test Inference: '{test_claim}'")
    print(f"     Score: {pred['hype_score']}, Is Hype: {pred['is_hype']}, Cues: {pred['linguistic_cues']}")

    # 2. Train Market Regime Clustering (GMM)
    print("\n[2/3] Training Gaussian Mixture Market Atmosphere Model...")
    sentiment_engine._init_or_train()
    print(f"  -> GMM Model saved to: {sentiment_engine.model_path}")
    
    # Test atmosphere inference
    atmo_res = sentiment_engine.compute_atmosphere(
        vix=23.5, credit_spread=4.9, put_call_ratio=0.98, safe_haven_spread=0.10, breadth=42.0
    )
    print(f"  -> Test Atmosphere Inference:")
    print(f"     Composite Score: {atmo_res['composite_score']}")
    print(f"     Atmosphere: {atmo_res['atmosphere']}")
    print(f"     Headline: {atmo_res['headline']}")

    # 3. Test Syntactic Claim Deconstructor
    print("\n[3/3] Testing Syntactic NLP Claim Deconstructor...")
    decomp = claim_deconstructor.deconstruct("NVDA is guaranteed to outperform the S&P 500 over the next 5 years")
    print("  -> Deconstructed Components:")
    for k, v in decomp.items():
        print(f"     {k.upper()}: {v}")

    print("\n==========================================================")
    print("  All ML and NLP models trained and verified successfully!  ")
    print("==========================================================")

if __name__ == "__main__":
    main()
