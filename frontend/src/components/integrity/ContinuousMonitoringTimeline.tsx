"use client";

import React from "react";
import { MonitoringReport } from "@/lib/api";
import { History, CheckCircle, AlertTriangle, AlertCircle, Clock, FileText } from "lucide-react";

interface ContinuousMonitoringTimelineProps {
  monitoring: MonitoringReport | null;
  isLoading?: boolean;
}

export const ContinuousMonitoringTimeline: React.FC<ContinuousMonitoringTimelineProps> = ({
  monitoring,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="p-8 rounded-2xl bg-[#090D15] border border-[#162235] text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#00F5A0] border-t-transparent animate-spin mx-auto" />
        <p className="font-mono text-xs text-gray-400">Loading quarterly balance sheet drift history...</p>
      </div>
    );
  }

  if (!monitoring || !monitoring.quarters || monitoring.quarters.length === 0) {
    return null;
  }

  const getStatusBadge = (status: "STABLE" | "TIGHTENING" | "DRIFT_ALERT") => {
    switch (status) {
      case "STABLE":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-950/60 text-[#00F5A0] border border-emerald-500/40 flex items-center gap-1.5 font-semibold">
            <CheckCircle className="w-3.5 h-3.5" /> STABLE ENVELOPE
          </span>
        );
      case "TIGHTENING":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-amber-950/60 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" /> TIGHTENING RATIOS
          </span>
        );
      case "DRIFT_ALERT":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-rose-950/60 text-rose-300 border border-rose-500/40 flex items-center gap-1.5 font-semibold">
            <AlertCircle className="w-3.5 h-3.5" /> DRIFT ALERT (BREACH)
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="rounded-2xl bg-[#090D15] border border-[#162235] p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1A2538] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#00F5A0]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#00F5A0] font-bold">
              CONTINUOUS MONITORING & DRIFT ALERTS
            </span>
          </div>
          <h2 className="text-xl font-serif font-bold text-white tracking-wide">
            4-Quarter Balance Sheet Drift Analysis ({monitoring.symbol})
          </h2>
          <p className="text-xs text-gray-400 font-sans max-w-2xl leading-relaxed">
            Corporate compliance is not a static stamp. Debt financing and cash levels fluctuate as companies issue corporate bonds, mature commercial paper, or conduct acquisitions. Lucid continuously monitors SEC 10-Q and 10-K quarterly filings.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {getStatusBadge(monitoring.monitoring_status)}
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-400 bg-[#0F1624] px-3 py-1.5 rounded-lg border border-[#1E2C42]">
            <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{monitoring.next_filing_estimate}</span>
          </div>
        </div>
      </div>

      {/* Timeline Progression Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
        {monitoring.quarters.map((q, idx) => {
          const isLatest = idx === monitoring.quarters.length - 1;
          return (
            <div
              key={q.quarter}
              className={`p-4 rounded-xl border relative transition-all ${
                isLatest
                  ? "bg-[#111B2C] border-[#00F5A0]/60 shadow-[0_0_20px_rgba(0,245,160,0.1)]"
                  : "bg-[#0B101A] border-[#18253B]"
              }`}
            >
              {isLatest && (
                <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-[#00F5A0] text-black text-[9px] font-mono font-bold tracking-wider uppercase">
                  LATEST AUDIT
                </div>
              )}

              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#00F5A0]" />
                  {q.quarter}
                </span>
                <span className="text-[10px] font-mono text-gray-500">
                  {q.filing_date}
                </span>
              </div>

              {/* Ratios in this quarter */}
              <div className="space-y-2 py-2 border-y border-[#18253B] my-2 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Debt Ratio</span>
                  <span className={`font-bold ${q.debt_ratio <= 30.0 ? "text-[#00F5A0]" : "text-rose-400"}`}>
                    {q.debt_ratio}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Cash Ratio</span>
                  <span className="font-bold text-gray-200">
                    {q.cash_ratio}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Impure Revenue</span>
                  <span className="font-bold text-amber-300">
                    {q.impure_revenue_pct}%
                  </span>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-gray-500">Quarter Verdict</span>
                  <span className={`font-bold ${q.status === "ELIGIBLE" ? "text-[#00F5A0]" : "text-rose-400"}`}>
                    {q.status}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                  {q.drift_note}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trajectory Explanation Note */}
      <div className="p-4 rounded-xl bg-[#06090F] border border-[#162235] flex items-start gap-3">
        <div className="w-2 h-2 rounded-full bg-[#00F5A0] mt-1.5 shrink-0" />
        <p className="text-xs text-gray-400 leading-relaxed font-sans">
          <strong className="text-white font-mono">Continuous Surveillance Protocol: </strong>
          If a holding drifts beyond the 30% debt threshold across two consecutive quarterly 10-Q filings, Lucid shifts the status from <span className="text-amber-300 font-mono">TIGHTENING</span> to <span className="text-rose-400 font-mono">DRIFT_ALERT</span>, triggering a disciplined 90-day rebalancing grace window rather than emotional panic trading.
        </p>
      </div>
    </div>
  );
};
