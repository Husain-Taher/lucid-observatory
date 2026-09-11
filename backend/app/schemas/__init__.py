from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime, date

# ================= AUTH SCHEMAS =================
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    display_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
    display_name: Optional[str] = None

class UserOut(BaseModel):
    id: str
    email: str
    display_name: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# ================= LITERACY & ASSESSMENT SCHEMAS =================
class AssessmentAnswer(BaseModel):
    question_id: str
    selected_option: int

class AssessmentSubmission(BaseModel):
    answers: List[AssessmentAnswer]

class LiteracyProfileOut(BaseModel):
    earning_score: int
    saving_score: int
    borrowing_score: int
    investing_score: int
    risk_score: int
    weakest_dimension: str
    recommended_module_id: str
    last_assessed_at: datetime

# ================= LEARNING MODULE SCHEMAS =================
class LearningModuleOut(BaseModel):
    id: str
    domain: str
    title: str
    subtitle: Optional[str] = None
    visualization_type: str
    metaphor: Optional[str] = None
    content: Optional[str] = None
    order_index: int
    completed: bool = False

# ================= MARKET PULSE & ATMOSPHERE SCHEMAS =================
class SignalNode(BaseModel):
    name: str                           # "Volatility", "Credit", "Options", "Safe Haven", "Breadth"
    current_value: float
    direction: str                      # "UP", "DOWN", "FLAT"
    historical_percentile: float        # 0 to 100
    source: str                         # e.g., "FRED (VIXCLS)", "CBOE"
    date_observed: str
    contribution: str                   # Plain language contribution
    coverage: str                       # e.g., "100% of US Large Cap", "Investment Grade vs High Yield"
    calculation_details: str

class SentimentSnapshotOut(BaseModel):
    snapshot_date: date
    composite_score: float              # 0 to 100
    atmosphere: str                     # QUIET, EXPANSIVE, UNCERTAIN, TENSE, EUPHORIC
    headline: str                       # "The market feels tense."
    narrative: str                      # Plain language explanation
    signals: List[SignalNode]
    data_verified_at: str
    is_partial_data: bool = False
    missing_sources: List[str] = []
    attribution_notice: str = "This product uses the FRED® API but is not endorsed or certified by the Federal Reserve Bank of St. Louis."
    terms_url: str = "https://fred.stlouisfed.org/docs/api/terms_of_use.html"

# ================= CLAIM & EVIDENCE SCHEMAS =================
class ClaimSubmission(BaseModel):
    text: str = Field(min_length=5, max_length=1000)
    source_url: Optional[str] = None

class DeconstructedClaim(BaseModel):
    subject: str                        # e.g., "AI Stocks"
    claim_type: str                     # e.g., "Outperform"
    time_horizon: str                   # e.g., "5 Years" / "Unspecified"
    comparison: str                     # e.g., "S&P 500"
    certainty: str                      # e.g., "Guaranteed"
    hype_score: float                   # 0.0 to 1.0 (ML classifier score)
    urgency_level: str                  # "HIGH", "MEDIUM", "LOW"

class EvidenceLayer(BaseModel):
    factor_name: str                    # "CERTAINTY", "COMPARISON", "TIMEFRAME", "HISTORICAL EVIDENCE"
    factor_finding: str
    strength: str                       # "HIGH", "MODERATE", "LOW", "ABSENT"
    details: str
    source_name: Optional[str] = None
    source_url: Optional[str] = None

class ClaimInvestigationOut(BaseModel):
    claim_id: str
    raw_input: str
    deconstructed: DeconstructedClaim
    evidence_stack: List[EvidenceLayer]
    grounded_summary: str
    uncomfortable_truth: str             # "Show me the uncomfortable part" feature!
    grounding_score: Optional[int] = 75
    real_news_context: Optional[List[Dict[str, Any]]] = []
    what_it_actually_means: Optional[str] = None

# ================= PRACTICE & PAPER TRADING SCHEMAS =================
class OrderPlacement(BaseModel):
    ticker: str
    side: str                           # "BUY" or "SELL"
    quantity: float

class HoldingOut(BaseModel):
    ticker: str
    quantity: float
    avg_cost: float
    current_price: float
    market_value: float
    unrealized_pl: float
    unrealized_pl_pct: float

class PortfolioOut(BaseModel):
    trading_account_id: str
    cash_balance: float
    portfolio_value: float
    holdings: List[HoldingOut]

class DecisionSubmission(BaseModel):
    claim_id: Optional[str] = None
    ticker: Optional[str] = "SPY"
    action: str                         # "BUY", "WAIT", "PASS" (equal weighting!)
    quantity: Optional[float] = 10.0
    thesis: str = Field(min_length=10)   # "Why do you believe this decision is reasonable?"
    falsification_criteria: str = Field(min_length=10) # "What would prove you wrong?"
    confidence_level: str               # "UNSURE", "SOMEWHAT", "CONFIDENT"
    time_horizon: str = "30d"           # "7d", "30d", "90d"

class DecisionOut(BaseModel):
    id: str
    ticker: Optional[str]
    action: str
    thesis: str
    falsification_criteria: str
    confidence_level: str
    entry_price: Optional[float]
    entry_sentiment_score: Optional[float]
    entry_atmosphere: Optional[str]
    time_horizon: str
    created_at: datetime
    outcome: Optional[Dict[str, Any]] = None

# ================= TRACE & BEHAVIORAL MIRROR SCHEMAS =================
class BehavioralFlag(BaseModel):
    pattern_type: str                   # "SENTIMENT_CHASING", "PANIC_EXIT", "CALIBRATION_DRIFT", "CONCENTRATION_RISK"
    observation: str                    # Non-judgmental narrative (e.g. "You entered after sentiment had already become highly optimistic.")
    frequency: str                      # "This is the 3rd time you've entered during a strong optimism spike."
    severity: str                       # "NOTICE", "REFLECT"

class TimelineTracePoint(BaseModel):
    date: str
    asset_price: float
    sentiment_composite: float
    atmosphere: str
    user_action: Optional[str] = None   # "BUY", "WAIT", "PASS", or None
    user_thesis: Optional[str] = None

class BehavioralMirrorOut(BaseModel):
    trace_points: List[TimelineTracePoint]
    behavioral_flags: List[BehavioralFlag]
    decisions_count: int
    learning_path_nodes: List[Dict[str, Any]]
    rolling_emotional_beta: Optional[float] = 0.45
    patience_ratio: Optional[float] = 0.67
    fomo_chasing_ratio: Optional[float] = 0.25
