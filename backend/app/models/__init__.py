from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Date, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone, date
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

def utcnow():
    return datetime.now(timezone.utc).replace(tzinfo=None)

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=True)
    display_name = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=utcnow)
    
    literacy_profile = relationship("LiteracyProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    module_progress = relationship("ModuleProgress", back_populates="user", cascade="all, delete-orphan")
    portfolio = relationship("Portfolio", back_populates="user", uselist=False, cascade="all, delete-orphan")
    claims = relationship("Claim", back_populates="user", cascade="all, delete-orphan")
    decisions = relationship("Decision", back_populates="user", cascade="all, delete-orphan")

class LiteracyProfile(Base):
    __tablename__ = "literacy_profiles"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, unique=True)
    earning_score = Column(Integer, default=50)
    saving_score = Column(Integer, default=50)
    borrowing_score = Column(Integer, default=50)
    investing_score = Column(Integer, default=50)
    risk_score = Column(Integer, default=50)  # Primary focus area from P-Fin index
    last_assessed_at = Column(DateTime, default=utcnow)
    
    user = relationship("User", back_populates="literacy_profile")

class LearningModule(Base):
    __tablename__ = "learning_modules"
    
    id = Column(String(64), primary_key=True)  # e.g., "compounding", "risk-return", "diversification"
    domain = Column(String(64), nullable=False)
    title = Column(String(255), nullable=False)
    subtitle = Column(String(255), nullable=True)
    visualization_type = Column(String(64), nullable=False)
    metaphor = Column(String(255), nullable=True)
    content = Column(Text, nullable=True)
    order_index = Column(Integer, default=0)

class ModuleProgress(Base):
    __tablename__ = "module_progress"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    module_id = Column(String(64), ForeignKey("learning_modules.id"), nullable=False)
    interaction_count = Column(Integer, default=0)
    completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)
    
    user = relationship("User", back_populates="module_progress")
    module = relationship("LearningModule")

class SentimentSnapshot(Base):
    __tablename__ = "sentiment_snapshots"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    snapshot_date = Column(Date, unique=True, index=True, default=date.today)
    vix_value = Column(Float, nullable=True)
    credit_spread = Column(Float, nullable=True)
    put_call_ratio = Column(Float, nullable=True)
    safe_haven_spread = Column(Float, nullable=True)
    breadth_value = Column(Float, nullable=True)
    composite_score = Column(Float, nullable=False)  # 0 to 100
    atmosphere = Column(String(32), nullable=False)   # QUIET, EXPANSIVE, UNCERTAIN, TENSE, EUPHORIC
    narrative = Column(Text, nullable=False)
    components_detail = Column(Text, nullable=True)   # JSON string with calculation details
    created_at = Column(DateTime, default=utcnow)

class Claim(Base):
    __tablename__ = "claims"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    raw_input = Column(Text, nullable=False)
    asset_ticker = Column(String(32), nullable=True)
    claim_type = Column(String(64), nullable=True)     # e.g., "outperform", "crash", "skyrocket"
    predicted_change = Column(Float, nullable=True)
    time_horizon = Column(String(64), nullable=True)
    comparison_target = Column(String(64), nullable=True) # e.g., "S&P 500"
    certainty_level = Column(String(32), nullable=True)   # "EXTREME", "HIGH", "MODERATE", "LOW"
    hype_score = Column(Float, default=0.0)             # ML persuasion / FOMO score (0.0 to 1.0)
    submitted_at = Column(DateTime, default=utcnow)
    
    user = relationship("User", back_populates="claims")
    evidence_items = relationship("EvidenceItem", back_populates="claim", cascade="all, delete-orphan")
    risk_signals = relationship("RiskSignal", back_populates="claim", cascade="all, delete-orphan")
    decision = relationship("Decision", back_populates="claim", uselist=False)

class EvidenceItem(Base):
    __tablename__ = "evidence_items"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    claim_id = Column(String(36), ForeignKey("claims.id"), nullable=False)
    source_type = Column(String(64), nullable=False)  # "MARKET_DATA", "SEC_EDGAR", "NEWS", "HISTORICAL"
    source_title = Column(String(255), nullable=True)
    source_url = Column(String(512), nullable=True)
    stance = Column(String(32), nullable=False)       # "SUPPORTS", "CONTRADICTS", "INCONCLUSIVE"
    excerpt = Column(Text, nullable=False)
    evidence_factor = Column(String(64), nullable=True) # "CERTAINTY", "COMPARISON", "TIMEFRAME", "EVIDENCE"
    retrieved_at = Column(DateTime, default=utcnow)
    
    claim = relationship("Claim", back_populates="evidence_items")

class RiskSignal(Base):
    __tablename__ = "risk_signals"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    claim_id = Column(String(36), ForeignKey("claims.id"), nullable=False)
    signal_type = Column(String(64), nullable=False)   # "URGENCY", "ABSOLUTE_GUARANTEE", "LACK_OF_TIMEFRAME", "PUMP_PATTERN"
    evidence_excerpt = Column(Text, nullable=False)
    confidence = Column(Float, default=0.8)
    
    claim = relationship("Claim", back_populates="risk_signals")

class Portfolio(Base):
    __tablename__ = "portfolios"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, unique=True)
    trading_account_id = Column(String(64), default=generate_uuid)
    cash_balance = Column(Float, default=100000.0)      # Default $100,000 risk-free paper cash
    
    user = relationship("User", back_populates="portfolio")
    holdings = relationship("Holding", back_populates="portfolio", cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="portfolio", cascade="all, delete-orphan")

class Holding(Base):
    __tablename__ = "holdings"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    portfolio_id = Column(String(36), ForeignKey("portfolios.id"), nullable=False)
    ticker = Column(String(32), nullable=False)
    quantity = Column(Float, nullable=False)
    avg_cost = Column(Float, nullable=False)
    
    portfolio = relationship("Portfolio", back_populates="holdings")

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    portfolio_id = Column(String(36), ForeignKey("portfolios.id"), nullable=False)
    ticker = Column(String(32), nullable=False)
    side = Column(String(8), nullable=False)          # "BUY" or "SELL"
    quantity = Column(Float, nullable=False)
    price = Column(Float, nullable=False)
    sentiment_snapshot_date = Column(Date, nullable=True) # Connects trade to sentiment environment!
    executed_at = Column(DateTime, default=utcnow)
    
    portfolio = relationship("Portfolio", back_populates="transactions")

class Decision(Base):
    __tablename__ = "decisions"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    claim_id = Column(String(36), ForeignKey("claims.id"), nullable=True)
    action = Column(String(16), nullable=False)        # "BUY", "WAIT", "PASS" (equal weighting!)
    ticker = Column(String(32), nullable=True)
    thesis = Column(Text, nullable=False)             # "Why do you believe this is reasonable?"
    falsification_criteria = Column(Text, nullable=False) # "What would prove you wrong?"
    confidence_level = Column(String(16), nullable=False) # "UNSURE", "SOMEWHAT", "CONFIDENT"
    time_horizon = Column(String(32), default="30d")   # "7d", "30d", "90d"
    entry_price = Column(Float, nullable=True)
    entry_sentiment_score = Column(Float, nullable=True)
    entry_atmosphere = Column(String(32), nullable=True)
    created_at = Column(DateTime, default=utcnow)
    
    user = relationship("User", back_populates="decisions")
    claim = relationship("Claim", back_populates="decision")
    outcome = relationship("DecisionOutcome", back_populates="decision", uselist=False, cascade="all, delete-orphan")

class DecisionOutcome(Base):
    __tablename__ = "decision_outcomes"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    decision_id = Column(String(36), ForeignKey("decisions.id"), nullable=False, unique=True)
    expected_change = Column(Float, nullable=True)
    actual_change = Column(Float, nullable=False)
    thesis_held = Column(Boolean, nullable=False)
    reflection_notes = Column(Text, nullable=True)
    counterfactual_notes = Column(Text, nullable=True) # "What would have happened if you had entered/waited?"
    evaluated_at = Column(DateTime, default=utcnow)
    
    decision = relationship("Decision", back_populates="outcome")
