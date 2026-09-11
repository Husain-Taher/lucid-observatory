"use client";

import React, { useState } from "react";
import { CapitalTrailGraph as CapitalTrailGraphType } from "@/lib/api";
import { CheckCircle, AlertTriangle, XCircle, ChevronRight, Building } from "lucide-react";

interface CapitalTrailGraphProps {
  trail: CapitalTrailGraphType | null;
  isLoading?: boolean;
}

export const CapitalTrailGraph: React.FC<CapitalTrailGraphProps> = ({ trail, isLoading }) => {
  const [selectedStageId, setSelectedStageId] = useState<string>("BUSINESS_SEGMENTS");

  if (isLoading) {
    return (
      <div className="p-8 rounded-2xl bg-[#090D15] border border-[#162235] text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#00F5A0] border-t-transparent animate-spin mx-auto" />
        <p className="font-mono text-xs text-gray-400">Auditing corporate capital lineage and legal entities...</p>
      </div>
    );
  }

  if (!trail || !trail.stages || trail.stages.length === 0) {
    return null;
  }

  const selectedStage = trail.stages.find((s) => s.stage_id === selectedStageId) || trail.stages[2];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "INPUT":
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-500/30">ORIGIN</span>;
      case "PASSED":
      case "ELIGIBLE":
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/40 text-[#00F5A0] border border-emerald-500/30 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> VERIFIED</span>;
      case "CONTAINS_EXPOSURE":
      case "TIGHTENING":
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-900/40 text-amber-300 border border-amber-500/30 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> EXPOSURE DISCOVERED</span>;
      case "RESTRICTED":
      case "NON_COMPLIANT":
      case "EXCEEDS_THRESHOLD":
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-900/40 text-rose-300 border border-rose-500/30 flex items-center gap-1"><XCircle className="w-3 h-3" /> RESTRICTED</span>;
      default:
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-300">{status}</span>;
    }
  };

  return (
    <div className="rounded-2xl bg-[#090D15] border border-[#162235] p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1A2538] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00F5A0] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#00F5A0] font-bold">
              FLAGSHIP · THE CAPITAL TRAIL
            </span>
          </div>
          <h2 className="text-xl font-serif font-bold text-white tracking-wide">
            Where Your Capital Actually Travels in {trail.company_name} ({trail.symbol})
          </h2>
          <p className="text-xs text-gray-400 font-sans max-w-2xl leading-relaxed">
            Follow your investment dollar step-by-step from equity allocation through consolidated corporate parentage, operational segments, legally distinct subsidiaries, balance sheet leverage, and final integrity verdict.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-gray-400 bg-[#0F1624] px-3.5 py-2 rounded-xl border border-[#1E2C42]">
          <Building className="w-4 h-4 text-[#D4AF37]" />
          <span>Parent: <strong className="text-white">{trail.symbol}</strong></span>
        </div>
      </div>

      {/* Interactive Linear Stage Pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {trail.stages.map((stage, idx) => {
          const isSelected = stage.stage_id === selectedStageId;
          return (
            <button
              key={stage.stage_id}
              onClick={() => setSelectedStageId(stage.stage_id)}
              className={`text-left p-3 rounded-xl border transition-all relative flex flex-col justify-between ${
                isSelected
                  ? "bg-[#131E30] border-[#00F5A0] shadow-[0_0_18px_rgba(0,245,160,0.2)]"
                  : "bg-[#0B101A] border-[#18253B] hover:border-gray-600 opacity-80 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-mono text-[10px] text-gray-400 uppercase font-bold">
                  STAGE 0{idx + 1}
                </span>
                {idx < trail.stages.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-gray-500 hidden lg:block" />
                )}
              </div>
              <span className={`text-xs font-sans font-bold line-clamp-1 ${isSelected ? "text-[#00F5A0]" : "text-white"}`}>
                {stage.title}
              </span>
              <div className="mt-2 pt-2 border-t border-[#1C2C45] flex items-center justify-between">
                {getStatusBadge(stage.status)}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Drill-Down Visual Inspector */}
      <div className="rounded-xl bg-[#06090F] border border-[#18253B] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#141F33] pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-serif font-bold text-white">
                {selectedStage.title}
              </h3>
              {getStatusBadge(selectedStage.status)}
            </div>
            <p className="text-xs text-gray-400 font-sans">
              {selectedStage.description}
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#D4AF37] px-2.5 py-1 rounded bg-[#182333] border border-[#D4AF37]/30 self-start sm:self-auto">
            {selectedStage.nodes.length} Verified Component{selectedStage.nodes.length === 1 ? "" : "s"}
          </span>
        </div>

        {/* Node Grid for Selected Stage */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {selectedStage.nodes.map((node) => (
            <div
              key={node.id}
              className="p-4 rounded-xl bg-[#0B101A] border border-[#19273D] hover:border-[#00F5A0]/40 transition-colors space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-sans text-xs font-semibold text-white">
                  {node.label || node.id}
                </span>
                {node.is_restricted !== undefined && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      node.is_restricted
                        ? "bg-rose-950/60 text-rose-300 border border-rose-600/40"
                        : "bg-emerald-950/60 text-[#00F5A0] border border-emerald-600/40"
                    }`}
                  >
                    {node.is_restricted ? "RESTRICTED" : "PERMISSIBLE"}
                  </span>
                )}
                {node.passed !== undefined && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      node.passed
                        ? "bg-emerald-950/60 text-[#00F5A0] border border-emerald-600/40"
                        : "bg-rose-950/60 text-rose-300 border border-rose-600/40"
                    }`}
                  >
                    {node.passed ? "WITHIN LIMIT" : "EXCEEDS LIMIT"}
                  </span>
                )}
                {node.verdict && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      node.verdict === "ELIGIBLE"
                        ? "bg-emerald-950/60 text-[#00F5A0] border border-emerald-600/40"
                        : "bg-rose-950/60 text-rose-300 border border-rose-600/40"
                    }`}
                  >
                    {node.verdict}
                  </span>
                )}
              </div>

              {/* Progress Bar for Percentage if available */}
              {node.percentage !== undefined && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-gray-400">
                    <span>Revenue Share</span>
                    <span className="text-white font-bold">{node.percentage}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#162235] overflow-hidden">
                    <div
                      className={`h-full ${node.is_restricted ? "bg-rose-500" : "bg-[#00F5A0]"}`}
                      style={{ width: `${Math.min(100, node.percentage)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Ratio vs Threshold */}
              {node.ratio !== undefined && node.threshold !== undefined && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-gray-400">
                    <span>Balance Sheet Ratio</span>
                    <span className={`font-bold ${node.passed ? "text-[#00F5A0]" : "text-rose-400"}`}>
                      {node.ratio}% / {node.threshold}% max
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#162235] overflow-hidden">
                    <div
                      className={`h-full ${node.passed ? "bg-[#00F5A0]" : "bg-rose-500"}`}
                      style={{ width: `${Math.min(100, (node.ratio / node.threshold) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Meta details */}
              <div className="space-y-1 text-[11px] font-mono text-gray-400 pt-1 border-t border-[#142033]">
                {node.category && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Category</span>
                    <span className="text-gray-200">{node.category}</span>
                  </div>
                )}
                {node.relationship && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Relationship</span>
                    <span className="text-gray-200">{node.relationship}</span>
                  </div>
                )}
                {node.activity && (
                  <div className="text-[11px] text-gray-300 font-sans leading-snug">
                    <span className="text-gray-500 font-mono">Activity: </span>
                    {node.activity}
                  </div>
                )}
                {node.exposure_pct !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Capital Exposure</span>
                    <span className="text-white font-bold">{node.exposure_pct}%</span>
                  </div>
                )}
                {node.integrity_score !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Integrity Index</span>
                    <span className="text-[#00F5A0] font-bold">{node.integrity_score} / 100</span>
                  </div>
                )}
                {node.note && (
                  <div className="mt-1 p-2 rounded bg-[#070B12] text-[10px] font-sans text-gray-400 border border-[#141E30] leading-relaxed">
                    <strong className="text-gray-300 font-mono">SEC Edgar Audit Note: </strong>
                    {node.note}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
