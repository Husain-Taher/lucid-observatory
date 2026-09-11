"use client";

import React from "react";
import { ScreeningMethodology } from "@/lib/api";
import { Check, Shield, Layers } from "lucide-react";

interface MethodologySelectorProps {
  methodologies: Record<string, ScreeningMethodology>;
  activeMethodology: string;
  onSelectMethodology: (key: string) => void;
}

export const MethodologySelector: React.FC<MethodologySelectorProps> = ({
  methodologies,
  activeMethodology,
  onSelectMethodology,
}) => {
  const current = methodologies[activeMethodology] || {
    name: "AAOIFI Standard No. 21",
    full_name: "Accounting & Auditing Organization for Islamic Financial Institutions",
    denominator: "Market Capitalization",
    debt_threshold: 30.0,
    cash_threshold: 30.0,
    interest_income_threshold: 5.0,
    impermissible_revenue_threshold: 5.0,
    description: "Standard benchmark. Ratios evaluated against market capitalization.",
  };

  return (
    <div className="rounded-2xl bg-[#0B0F17] border border-[#1A2333] p-5 shadow-xl space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#00F5A0]" />
            <span className="text-xs font-mono tracking-widest text-[#00F5A0] uppercase font-bold">
              PLURALISTIC SCREENING METHODOLOGY
            </span>
          </div>
          <h3 className="text-sm font-sans font-semibold text-white">
            Configurable Standards & Jurisdictional Benchmarks
          </h3>
        </div>
        <div className="text-[11px] font-mono text-gray-400 flex items-center gap-1.5 bg-[#111827] px-3 py-1.5 rounded-lg border border-[#1F2937]">
          <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Active Denominator: <strong className="text-white">{current.denominator}</strong></span>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {Object.entries(methodologies).map(([key, item]) => {
          const isSelected = key === activeMethodology;
          return (
            <button
              key={key}
              onClick={() => onSelectMethodology(key)}
              className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between ${
                isSelected
                  ? "bg-[#111C2B] border-[#00F5A0] shadow-[0_0_15px_rgba(0,245,160,0.15)]"
                  : "bg-[#0E1420] border-[#1E293B] hover:border-gray-600 text-gray-400 hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className={`font-mono text-xs font-bold ${isSelected ? "text-[#00F5A0]" : "text-gray-300"}`}>
                  {key}
                </span>
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-[#00F5A0]/20 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-[#00F5A0]" />
                  </span>
                )}
              </div>
              <span className="text-[11px] font-sans font-medium line-clamp-1 text-gray-200">
                {item.name}
              </span>
              <div className="mt-2 pt-2 border-t border-[#1F293D] flex items-center justify-between text-[10px] font-mono text-gray-400">
                <span>Debt Limit</span>
                <span className="text-white font-semibold">{item.debt_threshold}%</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Methodology Detail Banner */}
      <div className="p-3.5 rounded-xl bg-[#080D15] border border-[#162235] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-gray-300">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">{current.full_name}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#16253B] text-[#93C5FD] border border-[#2563EB]/30">
              {current.name}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed max-w-3xl">
            {current.description}
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0 font-mono text-[11px] border-t md:border-t-0 md:border-l border-[#1F293D] pt-2 md:pt-0 md:pl-4">
          <div className="text-center">
            <div className="text-gray-400 text-[9px] uppercase">Cash Limit</div>
            <div className="text-white font-bold">{current.cash_threshold}%</div>
          </div>
          <div className="w-px h-6 bg-[#1F293D]" />
          <div className="text-center">
            <div className="text-gray-400 text-[9px] uppercase">Impure Rev</div>
            <div className="text-white font-bold">{current.impermissible_revenue_threshold}%</div>
          </div>
          <div className="w-px h-6 bg-[#1F293D]" />
          <div className="text-center">
            <div className="text-gray-400 text-[9px] uppercase">Interest Inc</div>
            <div className="text-white font-bold">{current.interest_income_threshold}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};
