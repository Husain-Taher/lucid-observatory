from typing import List, Dict, Any, Optional
from datetime import datetime

class BehavioralMirrorEngine:
    """
    Algorithmic & Statistical Behavioral Profiler.
    Plots learner's simulated decisions against market atmosphere and price history,
    surfacing recurring patterns in compassionate, neutral, plain language.
    No scores. No shame. Just clear reflection.
    """

    def analyze_patterns(self, decisions: List[Dict[str, Any]], holdings: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        flags = []

        if not decisions:
            return [
                {
                    "pattern_type": "FIRST_OBSERVATION",
                    "observation": "Your journey is just beginning. As you log simulated decisions, your personal behavioral thread will appear here.",
                    "frequency": "0 decisions recorded so far.",
                    "severity": "NOTICE"
                }
            ]

        # 1. Check Sentiment Chasing (FOMO Buying)
        euphoria_buys = [
            d for d in decisions 
            if d.get("action") == "BUY" and (d.get("entry_sentiment_score") or 0) > 65
        ]
        if len(euphoria_buys) >= 2:
            flags.append({
                "pattern_type": "SENTIMENT_CHASING",
                "observation": "You entered after sentiment had already reached elevated optimism.",
                "frequency": f"This is the {len(euphoria_buys)}{self._ordinal_suffix(len(euphoria_buys))} time you've entered during a strong optimism spike.",
                "severity": "REFLECT"
            })
        elif len(euphoria_buys) == 1:
            flags.append({
                "pattern_type": "SENTIMENT_CHASING",
                "observation": "You entered this position when market sentiment was reading high optimism.",
                "frequency": "Noticed on your recent entry.",
                "severity": "NOTICE"
            })

        # 2. Check Decision Distribution
        actions = [d.get("action") for d in decisions]
        wait_count = actions.count("WAIT")
        pass_count = actions.count("PASS")
        buy_count = actions.count("BUY")

        if wait_count >= 1 or pass_count >= 1:
            flags.append({
                "pattern_type": "PATIENT_FILTER",
                "observation": "You frequently exercised restraint by choosing to WAIT or PASS after investigating evidence.",
                "frequency": f"{wait_count + pass_count} out of {len(decisions)} decisions reflected deliberate inaction.",
                "severity": "NOTICE"
            })

        # 3. Check Confidence Calibration
        high_conf_decisions = [d for d in decisions if d.get("confidence_level") == "CONFIDENT"]
        if len(high_conf_decisions) >= 3 and len(high_conf_decisions) / len(decisions) > 0.6:
            flags.append({
                "pattern_type": "CALIBRATION_DRIFT",
                "observation": "Your confidence level is consistently marked 'Confident' despite high environmental uncertainty.",
                "frequency": f"{len(high_conf_decisions)} of your {len(decisions)} decisions carried maximum confidence.",
                "severity": "REFLECT"
            })

        # 4. Check Portfolio Concentration (Herfindahl-Hirschman Index)
        if holdings and len(holdings) > 0:
            total_val = sum(h.get("quantity", 0) * h.get("current_price", h.get("avg_cost", 100)) for h in holdings)
            if total_val > 0:
                weights = [(h.get("quantity", 0) * h.get("current_price", h.get("avg_cost", 100))) / total_val for h in holdings]
                hhi = sum(w ** 2 for w in weights)
                max_weight = max(weights)
                if max_weight > 0.6:
                    top_ticker = max(holdings, key=lambda x: x.get("quantity", 0) * x.get("avg_cost", 0)).get("ticker", "one asset")
                    flags.append({
                        "pattern_type": "CONCENTRATION_RISK",
                        "observation": f"A single asset ({top_ticker}) accounts for {int(max_weight * 100)}% of your paper portfolio exposure.",
                        "frequency": "Recall the diversification thread: single points carry wider dispersion.",
                        "severity": "REFLECT"
                    })

        return flags

    def compute_metrics(self, decisions: List[Dict[str, Any]]) -> Dict[str, float]:
        if not decisions:
            return {
                "rolling_emotional_beta": 0.35,
                "patience_ratio": 0.50,
                "fomo_chasing_ratio": 0.20
            }

        total = len(decisions)
        actions = [d.get("action") for d in decisions]
        wait_count = actions.count("WAIT")
        pass_count = actions.count("PASS")
        patience_ratio = round((wait_count + pass_count) / total, 2)

        euphoria_buys = [
            d for d in decisions 
            if d.get("action") == "BUY" and (d.get("entry_sentiment_score") or 0) > 60
        ]
        fomo_ratio = round(len(euphoria_buys) / total, 2)

        scores = [d.get("entry_sentiment_score") or 50.0 for d in decisions]
        avg_score = sum(scores) / len(scores)
        emotional_beta = round(min(1.0, max(0.1, (avg_score / 100.0) * (1.0 + fomo_ratio * 0.5))), 2)

        return {
            "rolling_emotional_beta": emotional_beta,
            "patience_ratio": patience_ratio,
            "fomo_chasing_ratio": fomo_ratio
        }

    def _ordinal_suffix(self, n: int) -> str:
        if 11 <= (n % 100) <= 13:
            return "th"
        suffix_map = {1: "st", 2: "nd", 3: "rd"}
        return suffix_map.get(n % 10, "th")

behavioral_mirror = BehavioralMirrorEngine()
