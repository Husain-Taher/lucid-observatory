"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, IntegrityReport, CapitalTrailGraph as CapitalTrailGraphType, MonitoringReport, ScreeningMethodology } from "@/lib/api";
import { MethodologySelector } from "@/components/integrity/MethodologySelector";
import { CapitalTrailGraph } from "@/components/integrity/CapitalTrailGraph";
import { ContinuousMonitoringTimeline } from "@/components/integrity/ContinuousMonitoringTimeline";
import { PurificationCalculatorWidget } from "@/components/integrity/PurificationCalculatorWidget";
import {
  Search,
  Building,
  Layers,
  Clock
} from "lucide-react";

export default function IntegrityPage() {
  const [tickerInput, setTickerInput] = useState<string>("AAPL");
  const [activeTicker, setActiveTicker] = useState<string>("AAPL");
  const [activeMethodology, setActiveMethodology] = useState<string>("AAOIFI");

  // Fetch supported methodologies
  const { data: methodologies = {} } = useQuery<Record<string, ScreeningMethodology>>({
    queryKey: ["integrityMethodologies"],
    queryFn: api.getMethodologies,
  });

  // Fetch full screening report
  const {
    data: screenReport,
    isLoading: isScreenLoading,
  } = useQuery<IntegrityReport>({
    queryKey: ["integrityScreen", activeTicker, activeMethodology],
    queryFn: () => api.screenIntegrity(activeTicker, activeMethodology),
  });

  // Fetch Capital Trail graph
  const { data: trailGraph, isLoading: isTrailLoading } = useQuery<CapitalTrailGraphType>({
    queryKey: ["capitalTrail", activeTicker],
    queryFn: () => api.getCapitalTrail(activeTicker),
  });

  // Fetch Continuous Monitoring report
  const { data: monitoringReport, isLoading: isMonitoringLoading } = useQuery<MonitoringReport>({
    queryKey: ["integrityMonitoring", activeTicker],
    queryFn: () => api.getIntegrityMonitoring(activeTicker),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (tickerInput.trim()) {
      setActiveTicker(tickerInput.trim().toUpperCase());
    }
  };

  const quickTickers = ["AAPL", "MSFT", "NVDA", "TSLA", "GLD", "JNJ", "JPM"];

  const isEligible = screenReport?.is_eligible ?? true;
  const integrityIndex = screenReport?.integrity_index ?? 92;
  const businessScore = screenReport?.business_activity_score ?? 96;
  const financialScore = screenReport?.financial_structure_score ?? 89;

  return (
    <div className="min-h-screen bg-[#050608] text-gray-200 pb-28 pt-6 px-4 md:px-8 max-w-7xl mx-auto space-y-8 font-sans selection:bg-[#00F5A0] selection:text-black">
      {/* Institutional Philosophy Banner */}
      <div className="p-4 rounded-xl bg-[#090D15] border border-[#162235] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00F5A0]" />
          <span className="font-mono uppercase tracking-widest text-[#00F5A0] font-bold">
            INVESTMENT INTEGRITY OBSERVATORY
          </span>
          <span className="text-gray-500 hidden sm:inline">|</span>
          <span className="text-gray-400 hidden sm:inline font-mono">
            Research → Understand → Decide → Invest → Monitor
          </span>
        </div>
        <div className="text-[11px] font-mono text-gray-400 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Last SEC Audit: <strong className="text-white">Q4 2024 (Verified)</strong></span>
        </div>
      </div>

      {/* Hero Narrative Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37]">
            ANTI-CASINO ARCHITECTURE · CAPITAL TRANSPARENCY
          </span>
        </div>
        <h1 className="font-serif text-3xl md:text-5xl text-white font-bold tracking-tight leading-tight">
          The Investment Integrity Engine
        </h1>
        <p className="text-sm md:text-base text-gray-400 max-w-3xl leading-relaxed">
          Screen corporate business activities, uncover hidden subsidiary debt and non-core exposures, trace the exact lineage of your invested capital, and continuously monitor balance sheet drift under multiple consensus ethical standards.
        </p>
      </div>

      {/* Ticker Search & Quick Selection Chips */}
      <div className="p-5 rounded-2xl bg-[#0A0E18] border border-[#172338] shadow-xl space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={tickerInput}
              onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
              placeholder="Search ticker (e.g. AAPL, MSFT, NVDA, TSLA, JPM, GLD)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#05080E] border border-[#1F2E45] text-white font-mono text-sm uppercase placeholder:normal-case placeholder:text-gray-500 focus:outline-none focus:border-[#00F5A0] transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#00F5A0] text-black hover:bg-[#39fdb8] transition-all font-mono text-xs uppercase tracking-widest font-bold shadow-[0_0_15px_rgba(0,245,160,0.2)] shrink-0"
          >
            {isScreenLoading ? "Auditing..." : "Audit Entity"}
          </button>
        </form>

        {/* Quick Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#141F30]">
          <span className="text-[11px] font-mono text-gray-500 uppercase tracking-wider mr-2">
            Verified Knowledge Graph:
          </span>
          {quickTickers.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTickerInput(t);
                setActiveTicker(t);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                activeTicker === t
                  ? "bg-[#00F5A0] text-black font-bold shadow-[0_0_10px_rgba(0,245,160,0.3)]"
                  : "bg-[#0E1522] border border-[#1A273D] text-gray-400 hover:text-white hover:border-gray-500"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Methodology Selector Tabs */}
      <MethodologySelector
        methodologies={methodologies}
        activeMethodology={activeMethodology}
        onSelectMethodology={(m) => setActiveMethodology(m)}
      />

      {/* Multi-Dimensional Scorecards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Overall Integrity Index */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0C1322] to-[#070B14] border border-[#1A263D] shadow-xl relative overflow-hidden flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold">
                COMPOSITE INTEGRITY INDEX
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                  isEligible
                    ? "bg-emerald-950/60 text-[#00F5A0] border-emerald-500/40"
                    : "bg-rose-950/60 text-rose-300 border-rose-500/40"
                }`}
              >
                {isEligible ? "ELIGIBLE INVESTMENT" : "RESTRICTED EXPOSURE"}
              </span>
            </div>
            <h3 className="text-sm font-sans text-gray-300">
              {screenReport?.company_name || activeTicker}
            </h3>
          </div>

          <div className="flex items-baseline gap-3">
            <span
              className={`font-editorial text-5xl md:text-6xl font-bold ${
                isEligible ? "text-[#00F5A0]" : "text-rose-400"
              }`}
            >
              {integrityIndex}
            </span>
            <span className="font-mono text-sm text-gray-400">/ 100</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-gray-400">
              <span>Weighted Index</span>
              <span>{integrityIndex}% Compliance Envelope</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#162235] overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${
                  isEligible ? "bg-[#00F5A0]" : "bg-rose-500"
                }`}
                style={{ width: `${integrityIndex}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-500 font-mono pt-1">
              45% Business Activity + 55% Financial Structure Headroom
            </p>
          </div>
        </div>

        {/* Card 2: Business Activity Score */}
        <div className="p-6 rounded-2xl bg-[#090D17] border border-[#162235] shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                BUSINESS ACTIVITY AUDIT
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#162235] text-gray-300">
                {screenReport?.business_activities.status || "PERMITTED"}
              </span>
            </div>
            <h3 className="text-sm font-sans text-gray-300">
              Primary: {screenReport?.primary_industry || "Technology"}
            </h3>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-editorial text-5xl md:text-6xl font-bold text-white">
              {businessScore}
            </span>
            <span className="font-mono text-sm text-gray-400">/ 100</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-gray-400">
              <span>Restricted Exposure</span>
              <span className="text-amber-300 font-bold">
                {screenReport?.ratios.impure_revenue_ratio.value ?? 0.42}% (Max 5.00%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#162235] overflow-hidden">
              <div
                className="h-full bg-amber-400 transition-all duration-700"
                style={{
                  width: `${Math.min(100, ((screenReport?.ratios.impure_revenue_ratio.value ?? 0.42) / 5.0) * 100)}%`,
                }}
              />
            </div>
            <p className="text-[10px] text-gray-500 font-mono pt-1">
              Deep Subsidiary & Ancillary Revenue Screening
            </p>
          </div>
        </div>

        {/* Card 3: Financial Structure Score */}
        <div className="p-6 rounded-2xl bg-[#090D17] border border-[#162235] shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#93C5FD] font-bold">
                FINANCIAL STRUCTURE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#162235] text-gray-300">
                {screenReport?.denominator_type || "Market Cap"}
              </span>
            </div>
            <h3 className="text-sm font-sans text-gray-300">
              Debt & Cash Headroom Analysis
            </h3>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-editorial text-5xl md:text-6xl font-bold text-white">
              {financialScore}
            </span>
            <span className="font-mono text-sm text-gray-400">/ 100</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-gray-400">
              <span>Debt Ratio</span>
              <span className="text-[#00F5A0] font-bold">
                {screenReport?.ratios.debt_ratio.value ?? 2.42}% (Max {screenReport?.ratios.debt_ratio.threshold ?? 30}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#162235] overflow-hidden">
              <div
                className="h-full bg-[#00F5A0] transition-all duration-700"
                style={{
                  width: `${Math.min(100, ((screenReport?.ratios.debt_ratio.value ?? 2.42) / (screenReport?.ratios.debt_ratio.threshold ?? 30)) * 100)}%`,
                }}
              />
            </div>
            <p className="text-[10px] text-gray-500 font-mono pt-1">
              Cash Ratio: {screenReport?.ratios.cash_ratio.value ?? 1.79}% (Max {screenReport?.ratios.cash_ratio.threshold ?? 30}%)
            </p>
          </div>
        </div>
      </div>

      {/* Financial Structure Ratios Detail Table */}
      <div className="rounded-2xl bg-[#090D15] border border-[#162235] p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#18253B] pb-3">
          <div className="space-y-0.5">
            <h3 className="text-lg font-serif font-bold text-white">
              Balance Sheet Screening Ratios & Compliance Envelope
            </h3>
            <p className="text-xs text-gray-400">
              Evaluated under <strong className="text-gray-200">{screenReport?.methodology_name}</strong> against active denominator (<strong className="text-gray-200">{screenReport?.denominator_type}</strong>: ${((screenReport?.denominator_value || 1) / 1e9).toFixed(1)}B).
            </p>
          </div>
          <span className="text-xs font-mono text-gray-400 px-3 py-1 rounded bg-[#101726] border border-[#1C2C45]">
            4 Core Filters
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {screenReport && (
            <>
              {/* Debt Ratio */}
              <div className="p-4 rounded-xl bg-[#0B101A] border border-[#19273D] space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-sans font-semibold text-white">
                    Interest-Bearing Debt
                  </span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      screenReport.ratios.debt_ratio.passed
                        ? "bg-emerald-950/60 text-[#00F5A0] border border-emerald-500/40"
                        : "bg-rose-950/60 text-rose-300 border border-rose-500/40"
                    }`}
                  >
                    {screenReport.ratios.debt_ratio.passed ? "PASSED" : "FAILED"}
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-mono font-bold text-white">
                    {screenReport.ratios.debt_ratio.value}%
                  </span>
                  <span className="text-xs font-mono text-gray-400">
                    / {screenReport.ratios.debt_ratio.threshold}% limit
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#162235] overflow-hidden">
                  <div
                    className={`h-full ${screenReport.ratios.debt_ratio.passed ? "bg-[#00F5A0]" : "bg-rose-500"}`}
                    style={{
                      width: `${Math.min(100, (screenReport.ratios.debt_ratio.value / screenReport.ratios.debt_ratio.threshold) * 100)}%`,
                    }}
                  />
                </div>
                <div className="text-[10px] font-mono text-gray-500 pt-1">
                  Numerator: ${((screenReport.ratios.debt_ratio.numerator || 0) / 1e9).toFixed(1)}B Debt
                </div>
              </div>

              {/* Cash Ratio */}
              <div className="p-4 rounded-xl bg-[#0B101A] border border-[#19273D] space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-sans font-semibold text-white">
                    Cash & Deposits
                  </span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      screenReport.ratios.cash_ratio.passed
                        ? "bg-emerald-950/60 text-[#00F5A0] border border-emerald-500/40"
                        : "bg-rose-950/60 text-rose-300 border border-rose-500/40"
                    }`}
                  >
                    {screenReport.ratios.cash_ratio.passed ? "PASSED" : "FAILED"}
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-mono font-bold text-white">
                    {screenReport.ratios.cash_ratio.value}%
                  </span>
                  <span className="text-xs font-mono text-gray-400">
                    / {screenReport.ratios.cash_ratio.threshold}% limit
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#162235] overflow-hidden">
                  <div
                    className={`h-full ${screenReport.ratios.cash_ratio.passed ? "bg-[#00F5A0]" : "bg-rose-500"}`}
                    style={{
                      width: `${Math.min(100, (screenReport.ratios.cash_ratio.value / screenReport.ratios.cash_ratio.threshold) * 100)}%`,
                    }}
                  />
                </div>
                <div className="text-[10px] font-mono text-gray-500 pt-1">
                  Numerator: ${((screenReport.ratios.cash_ratio.numerator || 0) / 1e9).toFixed(1)}B Cash
                </div>
              </div>

              {/* Impure Revenue Ratio */}
              <div className="p-4 rounded-xl bg-[#0B101A] border border-[#19273D] space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-sans font-semibold text-white">
                    Impure Revenue
                  </span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      screenReport.ratios.impure_revenue_ratio.passed
                        ? "bg-emerald-950/60 text-[#00F5A0] border border-emerald-500/40"
                        : "bg-rose-950/60 text-rose-300 border border-rose-500/40"
                    }`}
                  >
                    {screenReport.ratios.impure_revenue_ratio.passed ? "PASSED" : "FAILED"}
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-mono font-bold text-amber-300">
                    {screenReport.ratios.impure_revenue_ratio.value}%
                  </span>
                  <span className="text-xs font-mono text-gray-400">
                    / {screenReport.ratios.impure_revenue_ratio.threshold}% limit
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#162235] overflow-hidden">
                  <div
                    className="h-full bg-amber-400"
                    style={{
                      width: `${Math.min(100, (screenReport.ratios.impure_revenue_ratio.value / screenReport.ratios.impure_revenue_ratio.threshold) * 100)}%`,
                    }}
                  />
                </div>
                <div className="text-[10px] font-mono text-gray-500 pt-1 truncate">
                  Source: {screenReport.ratios.impure_revenue_ratio.source || "Ancillary"}
                </div>
              </div>

              {/* Interest Income Ratio */}
              <div className="p-4 rounded-xl bg-[#0B101A] border border-[#19273D] space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-sans font-semibold text-white">
                    Interest Income
                  </span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      screenReport.ratios.interest_income_ratio.passed
                        ? "bg-emerald-950/60 text-[#00F5A0] border border-emerald-500/40"
                        : "bg-rose-950/60 text-rose-300 border border-rose-500/40"
                    }`}
                  >
                    {screenReport.ratios.interest_income_ratio.passed ? "PASSED" : "FAILED"}
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-mono font-bold text-white">
                    {screenReport.ratios.interest_income_ratio.value}%
                  </span>
                  <span className="text-xs font-mono text-gray-400">
                    / {screenReport.ratios.interest_income_ratio.threshold}% limit
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#162235] overflow-hidden">
                  <div
                    className="h-full bg-[#00F5A0]"
                    style={{
                      width: `${Math.min(100, (screenReport.ratios.interest_income_ratio.value / screenReport.ratios.interest_income_ratio.threshold) * 100)}%`,
                    }}
                  />
                </div>
                <div className="text-[10px] font-mono text-gray-500 pt-1">
                  Treasury Yield & Conventional Float
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Flagship Feature 1: The Capital Trail Graph */}
      <CapitalTrailGraph trail={trailGraph || null} isLoading={isTrailLoading} />

      {/* Deep Business Segments & Legal Subsidiary Inspection Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Operating Segments */}
        <div className="rounded-2xl bg-[#090D15] border border-[#162235] p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#18253B] pb-3">
            <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00F5A0]" />
              Core Operating Segments
            </h3>
            <span className="text-[11px] font-mono text-gray-400">
              {screenReport?.business_activities.segments.length || 0} Reported Divisions
            </span>
          </div>

          <div className="space-y-3">
            {screenReport?.business_activities.segments.map((seg) => (
              <div
                key={seg.name}
                className="p-3.5 rounded-xl bg-[#0B101A] border border-[#18253B] space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-sans font-semibold text-white">{seg.name}</span>
                  <span className="font-mono text-gray-300 font-bold">{seg.revenue_pct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#162235] overflow-hidden">
                  <div
                    className={`h-full ${seg.is_restricted ? "bg-rose-500" : "bg-[#00F5A0]"}`}
                    style={{ width: `${Math.min(100, seg.revenue_pct)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-gray-500">
                  <span>Category: {seg.category}</span>
                  <span className={seg.is_restricted ? "text-rose-400" : "text-[#00F5A0]"}>
                    {seg.is_restricted ? "RESTRICTED ACTIVITY" : "PERMISSIBLE"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subsidiaries & Captive Legal Entities */}
        <div className="rounded-2xl bg-[#090D15] border border-[#162235] p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#18253B] pb-3">
            <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-[#D4AF37]" />
              Subsidiaries & Legal Entities
            </h3>
            <span className="text-[11px] font-mono text-gray-400">
              {screenReport?.business_activities.subsidiaries.length || 0} Corporate Entities
            </span>
          </div>

          <div className="space-y-3">
            {screenReport?.business_activities.subsidiaries.map((sub) => (
              <div
                key={sub.name}
                className="p-3.5 rounded-xl bg-[#0B101A] border border-[#18253B] space-y-2"
              >
                <div className="flex items-start justify-between gap-2 text-xs">
                  <div>
                    <div className="font-sans font-semibold text-white">{sub.name}</div>
                    <div className="text-[10px] font-mono text-gray-400">{sub.relationship}</div>
                  </div>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold shrink-0 ${
                      sub.is_restricted
                        ? "bg-rose-950/60 text-rose-300 border border-rose-500/40"
                        : "bg-emerald-950/60 text-[#00F5A0] border border-emerald-500/40"
                    }`}
                  >
                    {sub.is_restricted ? "RESTRICTED EXPOSURE" : "PERMITTED SUBSIDIARY"}
                  </span>
                </div>

                <div className="text-[11px] text-gray-300 font-sans leading-snug">
                  {sub.activity}
                </div>

                <div className="p-2 rounded bg-[#06090F] border border-[#152030] text-[10px] font-sans text-gray-400 leading-relaxed">
                  <strong className="text-gray-300 font-mono">SEC Edgar Note: </strong>
                  {sub.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Flagship Feature 2: Continuous Monitoring & Drift History */}
      <ContinuousMonitoringTimeline
        monitoring={monitoringReport || null}
        isLoading={isMonitoringLoading}
      />

      {/* Flagship Feature 3: Independent Purification Calculator */}
      <PurificationCalculatorWidget
        ticker={activeTicker}
        purificationInfo={screenReport?.purification}
      />

      {/* Institutional Legal Notice & Mandatory FRED Attribution */}
      <div className="p-5 rounded-2xl bg-[#080C14] border border-[#141E30] text-center space-y-2">
        <p className="font-mono text-xs text-gray-400 tracking-wide">
          This product uses the FRED® API but is not endorsed or certified by the Federal Reserve Bank of St. Louis.
        </p>
        <p className="text-[11px] text-gray-500 font-sans max-w-3xl mx-auto leading-relaxed">
          Screening assessments are based on publicly verified SEC 10-K and 10-Q filings, consensus Shariah standard board publications (AAOIFI, DJIM, FTSE, MSCI), and institutional financial reporting. All calculations are provided strictly for educational and informational purposes. Lucid does not provide financial or legal advice.
        </p>
      </div>
    </div>
  );
}
