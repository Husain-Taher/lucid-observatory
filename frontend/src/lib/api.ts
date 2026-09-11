const API_BASE = "/api/v1";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`API error ${res.status}: ${errorBody}`);
  }
  return res.json();
}

export interface SignalNode {
  name: string;
  current_value: number;
  direction: string;
  historical_percentile: number;
  source: string;
  date_observed: string;
  contribution: string;
  coverage: string;
  calculation_details: string;
}

export interface SentimentSnapshot {
  snapshot_date: string;
  composite_score: number;
  atmosphere: string;
  headline: string;
  narrative: string;
  signals: SignalNode[];
  data_verified_at: string;
  attribution_notice?: string;
  terms_url?: string;
}

export interface LearningModule {
  id: string;
  domain: string;
  title: string;
  subtitle?: string;
  visualization_type: string;
  metaphor?: string;
  content?: string;
  order_index: number;
  completed: boolean;
}

export interface DeconstructedClaim {
  subject: string;
  claim_type: string;
  time_horizon: string;
  comparison: string;
  certainty: string;
  hype_score: number;
  urgency_level: string;
}

export interface EvidenceLayer {
  factor_name: string;
  factor_finding: string;
  strength: string;
  details: string;
  source_name?: string;
  source_url?: string;
}

export interface RealNewsArticle {
  title: string;
  summary: string;
  publisher: string;
  published_at: string;
  url: string;
  classification: "OBJECTIVE_EVENT" | "SENSATIONAL_NARRATIVE" | "MIXED_COMMENTARY";
  substance_score: number;
  hype_score: number;
  reasoning: string;
  what_it_actually_means: string;
}

export interface ClaimInvestigation {
  claim_id: string;
  raw_input: string;
  deconstructed: DeconstructedClaim;
  evidence_stack: EvidenceLayer[];
  grounded_summary: string;
  uncomfortable_truth: string;
  grounding_score?: number;
  real_news_context?: RealNewsArticle[];
  what_it_actually_means?: string;
}

export interface CommodityQuote {
  symbol: string;
  name: string;
  price: number;
  previous_close: number;
  change_pct: number;
  currency: string;
  last_updated: string;
}

export interface CommoditiesData {
  quotes: {
    gold: CommodityQuote;
    silver: CommodityQuote;
    platinum: CommodityQuote;
    sp500: CommodityQuote;
    yield_10y: CommodityQuote;
  };
  gold_silver_ratio: {
    ratio: number;
    regime: string;
    insight: string;
    gold_implied_oz: number;
    silver_implied_oz: number;
  };
  metals_regime: {
    current_regime: string;
    description: string;
  };
  source: string;
  attribution_notice: string;
}

export interface PurchasingPowerPoint {
  year: number;
  cash_value: number;
  cash_real_purchasing_power: number;
  gold_price_per_oz: number;
  silver_price_per_oz: number;
  goods_purchased_by_gold_1oz: string;
  goods_purchased_by_cash_1000: string;
}

export interface PurchasingPowerData {
  timeline: PurchasingPowerPoint[];
  insight: string;
  source: string;
}

export interface CounterfactualPoint {
  day: number;
  user_return_pct: number;
  fomo_chaser_pct: number;
  benchmark_pct: number;
  reflection: string;
}

export interface CounterfactualData {
  action: string;
  ticker?: string;
  trajectory: CounterfactualPoint[];
  learning_takeaway: string;
}

export interface PortfolioData {
  trading_account_id: string;
  cash_balance: number;
  portfolio_value: number;
  holdings: Array<{
    ticker: string;
    quantity: number;
    avg_cost: number;
    current_price: number;
    market_value: number;
    unrealized_pl: number;
    unrealized_pl_pct: number;
  }>;
}

export interface DecisionRecord {
  id: string;
  ticker?: string;
  action: string;
  thesis: string;
  falsification_criteria: string;
  confidence_level: string;
  entry_price?: number;
  entry_sentiment_score?: number;
  entry_atmosphere?: string;
  time_horizon: string;
  created_at: string;
  outcome?: {
    actual_change: number;
    thesis_held: boolean;
    reflection_notes?: string;
    counterfactual?: string;
  };
}

export interface BehavioralMirrorData {
  trace_points: Array<{
    date: string;
    asset_price: number;
    sentiment_composite: number;
    atmosphere: string;
    user_action?: string;
    user_thesis?: string;
  }>;
  behavioral_flags: Array<{
    pattern_type: string;
    observation: string;
    frequency: string;
    severity: string;
  }>;
  decisions_count: number;
  learning_path_nodes: Array<{
    module_id: string;
    title: string;
    unlocked: boolean;
  }>;
  rolling_emotional_beta?: number;
  patience_ratio?: number;
  fomo_chasing_ratio?: number;
}

export interface TapeItem {
  symbol: string;
  raw_symbol: string;
  name: string;
  category: string;
  price: number;
  change: number;
  change_pct: number;
  is_positive: boolean;
  last_updated: string;
}

export interface TrendPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sma20?: number | null;
}

export interface DetailedQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  change_pct: number;
  is_positive: boolean;
  open: number;
  day_high: number;
  day_low: number;
  volume: number;
  market_cap: number;
  year_high: number;
  year_low: number;
  sparkline: number[];
  history?: TrendPoint[];
  period?: string;
  last_updated: string;
  attribution: string;
}

export interface MagicNewsArticle {
  id: string;
  title: string;
  summary: string;
  publisher: string;
  published_at: string;
  url: string;
  classification: "OBJECTIVE_EVENT" | "SENSATIONAL_NARRATIVE" | "MIXED_COMMENTARY";
  substance_score: number;
  hype_score: number;
  highlight_type: "GOLD_STRUCTURAL" | "CRIMSON_HYPE" | "AMBER_COMMENTARY";
  importance_badge: string;
  wax_seal: string;
  theme_aura: string;
  float_rotation: number;
  levitation_delay: number;
  what_they_want_you_to_feel: string;
  what_actually_happened: string;
  byline?: string;
  issue_no?: string;
  search_query?: string;
  resolved_ticker?: string;
  source: string;
}

// Phase 7: Investment Integrity Engine Interfaces
export interface ScreeningMethodology {
  name: string;
  full_name: string;
  denominator: string;
  debt_threshold: number;
  cash_threshold: number;
  interest_income_threshold: number;
  impermissible_revenue_threshold: number;
  description: string;
}

export interface RatioDetail {
  value: number;
  threshold: number;
  passed: boolean;
  numerator?: number;
  numerator_label?: string;
  denominator?: number;
  denominator_label?: string;
  source?: string;
}

export interface SegmentExposure {
  name: string;
  revenue_pct: number;
  is_restricted: boolean;
  category: string;
}

export interface SubsidiaryExposure {
  name: string;
  relationship: string;
  activity: string;
  exposure_pct: number;
  is_restricted: boolean;
  note: string;
}

export interface BusinessActivitiesReport {
  status: string;
  is_passed: boolean;
  restricted_activities: string[];
  segments: SegmentExposure[];
  subsidiaries: SubsidiaryExposure[];
}

export interface PurificationReport {
  dividend_per_share: number;
  dividend_yield: number;
  impure_revenue_pct: number;
  purification_per_share: number;
  disclaimer: string;
}

export interface IntegrityReport {
  symbol: string;
  company_name: string;
  primary_industry: string;
  methodology: string;
  methodology_name: string;
  methodology_description: string;
  denominator_type: string;
  denominator_value: number;
  is_eligible: boolean;
  status_verdict: "ELIGIBLE" | "NON_COMPLIANT";
  integrity_index: number;
  business_activity_score: number;
  financial_structure_score: number;
  ratios: {
    debt_ratio: RatioDetail;
    cash_ratio: RatioDetail;
    impure_revenue_ratio: RatioDetail;
    interest_income_ratio: RatioDetail;
  };
  business_activities: BusinessActivitiesReport;
  purification: PurificationReport;
  last_audited: string;
  attribution: string;
}

export interface CapitalTrailNode {
  id: string;
  label?: string;
  type?: string;
  note?: string;
  industry?: string;
  integrity_score?: number;
  percentage?: number;
  category?: string;
  is_restricted?: boolean;
  relationship?: string;
  activity?: string;
  exposure_pct?: number;
  ratio?: number;
  threshold?: number;
  passed?: boolean;
  verdict?: string;
  impure_exposure?: number;
  is_eligible?: boolean;
}

export interface CapitalTrailStage {
  stage_id: string;
  title: string;
  description: string;
  status: string;
  nodes: CapitalTrailNode[];
}

export interface CapitalTrailGraph {
  symbol: string;
  company_name: string;
  stages: CapitalTrailStage[];
}

export interface MonitoringQuarter {
  quarter: string;
  filing_date: string;
  debt_ratio: number;
  cash_ratio: number;
  impure_revenue_pct: number;
  status: string;
  drift_note: string;
}

export interface MonitoringReport {
  symbol: string;
  company_name: string;
  monitoring_status: "STABLE" | "TIGHTENING" | "DRIFT_ALERT";
  active_verdict: string;
  methodology: string;
  quarters: MonitoringQuarter[];
  next_filing_estimate: string;
  attribution: string;
}

export interface PurificationRequest {
  ticker: string;
  shares: number;
  dividend_amount?: number;
}

export interface PurificationResult {
  symbol: string;
  company_name: string;
  shares_owned: number;
  dividend_per_share: number;
  total_dividend_received: number;
  impure_revenue_pct: number;
  purification_amount_due: number;
  currency: string;
  guidance_note: string;
  disclaimer: string;
}

export const api = {
  getTodaySentiment: () => fetchJson<SentimentSnapshot>(`${API_BASE}/sentiment/today`),
  getSentimentHistory: (year?: number) =>
    fetchJson<any>(`${API_BASE}/sentiment/history${year ? `?year=${year}` : ""}`),

  getModules: () => fetchJson<LearningModule[]>(`${API_BASE}/modules`),
  getModuleData: (id: string, params?: Record<string, any>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return fetchJson<any>(`${API_BASE}/modules/${id}/data${qs}`);
  },
  completeModule: (id: string) =>
    fetchJson<{ status: string; completed: boolean }>(`${API_BASE}/modules/${id}/complete`, {
      method: "POST",
    }),

  submitClaim: (text: string, sourceUrl?: string) =>
    fetchJson<ClaimInvestigation>(`${API_BASE}/claims`, {
      method: "POST",
      body: JSON.stringify({ text, source_url: sourceUrl }),
    }),

  getPortfolio: () => fetchJson<PortfolioData>(`${API_BASE}/portfolio`),
  placeOrder: (ticker: string, side: string, quantity: number) =>
    fetchJson<PortfolioData>(`${API_BASE}/portfolio/orders`, {
      method: "POST",
      body: JSON.stringify({ ticker, side, quantity }),
    }),

  submitDecision: (data: {
    claim_id?: string;
    ticker?: string;
    action: string;
    thesis: string;
    falsification_criteria: string;
    confidence_level: string;
    time_horizon?: string;
    quantity?: number;
  }) =>
    fetchJson<DecisionRecord>(`${API_BASE}/decisions`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  listDecisions: () => fetchJson<DecisionRecord[]>(`${API_BASE}/decisions`),

  getBehavioralPatterns: () => fetchJson<BehavioralMirrorData>(`${API_BASE}/insights/patterns`),

  getAssessmentQuestions: () => fetchJson<any[]>(`${API_BASE}/assessment/questions`),
  submitAssessment: (answers: Array<{ question_id: string; selected_option: number }>) =>
    fetchJson<any>(`${API_BASE}/assessment`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    }),

  // Phase 2 & 3: Commodities, Real News & Counterfactuals
  getLiveCommodities: () => fetchJson<CommoditiesData>(`${API_BASE}/commodities/live`),
  getPurchasingPowerTimeline: () => fetchJson<PurchasingPowerData>(`${API_BASE}/commodities/purchasing-power`),
  getLiveNews: (ticker: string = "GLD") =>
    fetchJson<RealNewsArticle[]>(`${API_BASE}/news/live?ticker=${encodeURIComponent(ticker)}`),
  getCounterfactualTrajectory: (action: string, ticker: string = "SPY") =>
    fetchJson<CounterfactualData>(
      `${API_BASE}/decisions/counterfactual?action=${encodeURIComponent(action)}&ticker=${encodeURIComponent(ticker)}`
    ),
  syncSentiment: () => fetchJson<any>(`${API_BASE}/sentiment/sync`),

  // Phase 4 & 5 & 6: Living Market Floor & Multi-Timeframe Daily Prophet
  getMarketTape: () => fetchJson<TapeItem[]>(`${API_BASE}/market/tape`),
  getDetailedQuote: (ticker: string = "GLD", period: string = "1mo") =>
    fetchJson<DetailedQuote>(
      `${API_BASE}/market/quote?ticker=${encodeURIComponent(ticker)}&period=${encodeURIComponent(period)}`
    ),
  getMagicNews: (query: string = "GLD") =>
    fetchJson<MagicNewsArticle[]>(
      `${API_BASE}/market/magic-news?query=${encodeURIComponent(query)}`
    ),

  // Phase 7: Investment Integrity Engine
  getMethodologies: () =>
    fetchJson<Record<string, ScreeningMethodology>>(`${API_BASE}/integrity/methodologies`),
  screenIntegrity: (ticker: string = "AAPL", methodology: string = "AAOIFI") =>
    fetchJson<IntegrityReport>(
      `${API_BASE}/integrity/screen?ticker=${encodeURIComponent(ticker)}&methodology=${encodeURIComponent(methodology)}`
    ),
  getCapitalTrail: (ticker: string = "AAPL") =>
    fetchJson<CapitalTrailGraph>(
      `${API_BASE}/integrity/capital-trail?ticker=${encodeURIComponent(ticker)}`
    ),
  getIntegrityMonitoring: (ticker: string = "AAPL") =>
    fetchJson<MonitoringReport>(
      `${API_BASE}/integrity/monitoring?ticker=${encodeURIComponent(ticker)}`
    ),
  calculatePurification: (payload: PurificationRequest) =>
    fetchJson<PurificationResult>(`${API_BASE}/integrity/purify`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
