import re
from typing import Dict, Any, Optional

class ClaimDeconstructor:
    """
    Syntactic & Semantic NLP Deconstructor for Financial Claims.
    Extracts:
      1. Subject (Ticker, Sector, or Entity)
      2. Trajectory / Action (e.g. Outperform, Crash, Moon, Grow)
      3. Time Horizon (e.g. Next 5 years, End of Year, 3 months)
      4. Comparison / Baseline (e.g. S&P 500, The Market, Cash)
      5. Certainty Level (EXTREME, HIGH, MODERATE, LOW)
    """

    CERTAINTY_PATTERNS = {
        "EXTREME": [
            r"\bguaranteed?\b", r"\b100%\b", r"\bcannot lose\b", r"\bcan't lose\b",
            r"\brisk-?free\b", r"\bsure thing\b", r"\block(ed)? in\b", r"\bdefinitely\b",
            r"\binevitable\b", r"\bzero risk\b", r"\bnever fail\b"
        ],
        "HIGH": [
            r"\bwill\b", r"\balways\b", r"\bpoised to\b", r"\bdestined\b",
            r"\beasy\b", r"\bobviously\b", r"\bundeniably\b"
        ],
        "MODERATE": [
            r"\blikely\b", r"\bshould\b", r"\bexpected to\b", r"\bprojected to\b",
            r"\bforecast(ed)?\b", r"\btrending\b", r"\bprobably\b"
        ],
        "LOW": [
            r"\bmight\b", r"\bcould\b", r"\bmay\b", r"\bpotential(ly)?\b",
            r"\bpossible\b", r"\bif\b", r"\bperhaps\b"
        ]
    }

    ACTION_PATTERNS = [
        (r"\boutperform\w*\b", "Outperform"),
        (r"\bbeat\w*\b", "Outperform"),
        (r"\bskyrocket\w*\b", "Rapid Surge"),
        (r"\bmoon\w*\b", "Extreme Surge"),
        (r"\bdouble\b|\b2x\b|\b3x\b|\b10x\b", "Multi-Bag Gain"),
        (r"\bcrash\w*\b|\bcollapse\w*\b|\btank\w*\b", "Severe Decline"),
        (r"\bdrop\w*\b|\bfall\w*\b|\bplunge\w*\b", "Decline"),
        (r"\brise\w*\b|\bgrow\w*\b|\bclimb\w*\b", "Appreciation"),
        (r"\bunderperform\w*\b", "Underperform"),
    ]

    TIME_HORIZON_PATTERNS = [
        (r"\b(in|over|for)?\s*(the\s+)?next\s+(\d+)\s*(days?|weeks?|months?|years?)\b", r"Next \3 \4"),
        (r"\bby\s+(end\s+of\s+year|eoy|202\d|q[1-4])\b", r"By \1"),
        (r"\bwithin\s+(\d+)\s*(days?|weeks?|months?|years?)\b", r"Within \1 \2"),
        (r"\bshort\s*term\b", "Short-term (<6 months)"),
        (r"\blong\s*term\b", "Long-term (>3 years)"),
        (r"\bthis\s+year\b", "This Year"),
        (r"\btomorrow\b", "1 Day"),
    ]

    COMPARISON_PATTERNS = [
        (r"\b(the\s+)?(s&p\s*500|sp500|spy)\b", "S&P 500 Index"),
        (r"\b(the\s+)?(nasdaq|qqq|tech\s+stocks?)\b", "Nasdaq 100 Index"),
        (r"\b(the\s+)?(dow(\s+jones)?|dia)\b", "Dow Jones Industrial Average"),
        (r"\b(the\s+)?market\b", "Broad Equity Market"),
        (r"\bcash\b|\bbonds?\b|\binflation\b", "Cash / Inflation Benchmark"),
        (r"\bcompetitors?\b|\bpeers?\b", "Industry Peers"),
    ]

    KNOWN_SUBJECTS = [
        ("AI stocks", r"\b(ai\s+stocks?|artificial\s+intelligence(\s+stocks?)?|generative\s+ai)\b"),
        ("NVDA", r"\b(nvidia|nvda)\b"),
        ("TSLA", r"\b(tesla|tsla)\b"),
        ("AAPL", r"\b(apple|aapl)\b"),
        ("MSFT", r"\b(microsoft|msft)\b"),
        ("Crypto / BTC", r"\b(bitcoin|btc|crypto|ethereum|eth)\b"),
        ("Clean Energy", r"\b(clean\s+energy|solar|ev\s+stocks?)\b"),
        ("Tech Sector", r"\b(tech\s+sector|big\s+tech|semiconductors?)\b"),
        ("Value Stocks", r"\b(value\s+stocks?|dividend\s+stocks?)\b"),
    ]

    def deconstruct(self, text: str) -> Dict[str, Any]:
        cleaned = text.strip()
        lower_text = cleaned.lower()

        # 1. Identify Certainty
        certainty = "MODERATE"
        for level, patterns in self.CERTAINTY_PATTERNS.items():
            matched = False
            for pat in patterns:
                if re.search(pat, lower_text):
                    certainty = level
                    matched = True
                    break
            if matched:
                break

        # 2. Identify Subject
        subject = "General Asset / Market"
        for subj_name, pattern in self.KNOWN_SUBJECTS:
            if re.search(pattern, lower_text):
                subject = subj_name
                break
        else:
            # Fallback: find capitalized acronym or noun phrase
            ticker_match = re.search(r"\b[A-Z]{2,5}\b", cleaned)
            if ticker_match and ticker_match.group(0) not in ("AI", "US", "USA", "ETF", "CEO"):
                subject = f"${ticker_match.group(0)}"
            else:
                words = cleaned.split()
                if len(words) >= 2:
                    subject = " ".join(words[:3]).title()

        # 3. Identify Claim / Trajectory
        claim_type = "Trajectory Movement"
        for pattern, action_name in self.ACTION_PATTERNS:
            if re.search(pattern, lower_text):
                claim_type = action_name
                break

        # 4. Identify Time Horizon
        time_horizon = "Unspecified"
        for pattern, repl in self.TIME_HORIZON_PATTERNS:
            match = re.search(pattern, lower_text)
            if match:
                time_horizon = re.sub(pattern, repl, match.group(0)).title()
                break

        # 5. Identify Comparison Baseline
        comparison = "None Stated"
        for pattern, comp_name in self.COMPARISON_PATTERNS:
            if re.search(pattern, lower_text):
                comparison = comp_name
                break

        # Urgency & Hype heuristic baseline
        urgency_level = "HIGH" if certainty in ("EXTREME", "HIGH") and time_horizon in ("Short-term (<6 months)", "1 Day", "This Year") else (
            "MEDIUM" if certainty in ("HIGH", "MODERATE") else "LOW"
        )

        return {
            "subject": subject,
            "claim_type": claim_type,
            "time_horizon": time_horizon,
            "comparison": comparison,
            "certainty": certainty,
            "urgency_level": urgency_level
        }

claim_deconstructor = ClaimDeconstructor()
