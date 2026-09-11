import os
import re
import joblib
import numpy as np
from typing import Dict, Any, List, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, f1_score
from app.core.config import settings

# Labeled Seed Training Dataset for Financial Hype / FOMO Detection
# (1 = Manipulative Hype / FOMO / Guarantee, 0 = Objective / Analytical / Measured)
SEED_TRAINING_DATA: List[Tuple[str, int]] = [
    # Class 1: Hype / FOMO / False Certainty
    ("AI stocks are guaranteed to 10x your net worth by the end of this year, act now!", 1),
    ("Don't miss the biggest crypto breakout in history, buy before it moons tomorrow!", 1),
    ("This small cap stock is an absolute lock for 500% gains, guaranteed profits with zero risk.", 1),
    ("Everyone is buying NVDA calls, you are losing money every second you wait!", 1),
    ("Guaranteed returns: 100% risk-free strategy that hedge funds don't want you to know about.", 1),
    ("Huge announcement coming tomorrow, load up on shares immediately before the rocket takes off!", 1),
    ("Tech stocks will NEVER crash again, this is a new paradigm of infinite growth!", 1),
    ("Emergency alert: Buy this dip right now or regret it for the rest of your life!", 1),
    ("Double your portfolio in 30 days with this secret automated options hack!", 1),
    ("Literally can't go tits up, buy the rumor and become a millionaire next month.", 1),
    ("Last chance to get in at this price before the stock explodes 1000%!", 1),
    ("Follow my trade signals for guaranteed 95% win rate every single week!", 1),
    ("Massive short squeeze incoming, hold the line and buy more before we hit the moon!", 1),
    ("This stock is poised to skyrocket 50x, put your entire savings in today!", 1),
    ("Free money glitch: easy 300% returns with no downside risk whatsoever.", 1),
    
    # Class 0: Measured / Objective / Analytical
    ("The company reported quarterly revenue growth of 12% year-over-year, beating analyst consensus.", 0),
    ("Historically, higher expected returns are accompanied by wider dispersion and greater downside risk.", 0),
    ("Treasury yield spreads inverted slightly, indicating increased macroeconomic uncertainty in the credit market.", 0),
    ("The price-to-earnings ratio currently stands at 24.5, which is elevated relative to its 10-year historical median.", 0),
    ("Diversification across uncorrelated asset classes can reduce overall portfolio volatility over extended horizons.", 0),
    ("Inflation adjusted purchasing power has declined by 2.8% annually across the measured basket of consumer goods.", 0),
    ("The Federal Reserve held benchmark interest rates unchanged at 5.25%, noting persistent services inflation.", 0),
    ("Market breadth narrowed as fewer individual equities participated in the index advance this quarter.", 0),
    ("Dollar cost averaging involves allocating fixed sums at regular intervals regardless of short-term price fluctuations.", 0),
    ("Past performance of technology equities does not guarantee future capital appreciation or dividend safety.", 0),
    ("Options implied volatility rose to 22.4 ahead of the scheduled economic policy release.", 0),
    ("Credit default swap spreads on high yield corporate debt widened by 15 basis points week-over-week.", 0),
    ("Drawdowns of 10% to 20% occur with regular frequency throughout secular bull market cycles.", 0),
    ("The company disclosed lower gross margins due to supply chain component inflation in its 10-K filing.", 0),
    ("Investors should consider their time horizon and liquidity requirements prior to allocating capital.", 0),
]

class PersuasionDetector:
    """
    Conventional Machine Learning Classifier for Financial Manipulation,
    Hype, and FOMO (Fear-Of-Missing-Out) language.
    """
    def __init__(self):
        self.model_dir = settings.MODELS_DIR
        os.makedirs(self.model_dir, exist_ok=True)
        self.model_path = os.path.join(self.model_dir, "fomo_persuasion_model.joblib")
        self.pipeline: Optional[Pipeline] = None
        self._load_or_train()

    def _extract_linguistic_cues(self, text: str) -> List[str]:
        cues = []
        lower = text.lower()
        if re.search(r"\b(guarantee|guaranteed|risk-?free|100%|sure thing|lock(ed)? in)\b", lower):
            cues.append("False Certainty Claim")
        if re.search(r"\b(now|immediately|act fast|last chance|emergency|before it's too late)\b", lower):
            cues.append("Manufactured Urgency / FOMO")
        if re.search(r"\b(moon|skyrocket|10x|1000%|millionaire|multibagger|explode)\b", lower):
            cues.append("Hyperbolic Gain Promise")
        if text.count("!") >= 2 or re.search(r"[A-Z]{4,}", text):
            cues.append("Sensational Punctuation / Capitalization")
        return cues

    def train(self) -> Dict[str, Any]:
        texts = [x[0] for x in SEED_TRAINING_DATA]
        labels = [x[1] for x in SEED_TRAINING_DATA]

        pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True, min_df=1)),
            ("clf", LogisticRegression(C=1.5, class_weight="balanced", random_state=42))
        ])

        pipeline.fit(texts, labels)
        preds = pipeline.predict(texts)
        score = f1_score(labels, preds)

        joblib.dump(pipeline, self.model_path)
        self.pipeline = pipeline
        
        return {
            "status": "trained",
            "samples_count": len(texts),
            "train_f1_score": float(score),
            "model_path": self.model_path
        }

    def _load_or_train(self):
        if os.path.exists(self.model_path):
            try:
                self.pipeline = joblib.load(self.model_path)
                return
            except Exception:
                pass
        # Train if not found or load failed
        self.train()

    def predict(self, text: str) -> Dict[str, Any]:
        if self.pipeline is None:
            self._load_or_train()

        # ML Probability of Hype
        probs = self.pipeline.predict_proba([text])[0]
        ml_hype_prob = float(probs[1])

        # Rule-based linguistic cues
        cues = self._extract_linguistic_cues(text)
        
        # Ensembled Hype Score: combine statistical model with rule cues
        rule_boost = len(cues) * 0.15
        final_score = min(1.0, max(0.0, ml_hype_prob * 0.7 + rule_boost))

        urgency_level = "HIGH" if final_score >= 0.7 else ("MEDIUM" if final_score >= 0.35 else "LOW")

        return {
            "hype_score": round(final_score, 3),
            "is_hype": final_score >= 0.5,
            "urgency_level": urgency_level,
            "linguistic_cues": cues,
            "ml_probability": round(ml_hype_prob, 3)
        }

persuasion_detector = PersuasionDetector()
