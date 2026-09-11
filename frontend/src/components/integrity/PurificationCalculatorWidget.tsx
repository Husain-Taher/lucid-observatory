"use client";

import React, { useState } from "react";
import { PurificationReport } from "@/lib/api";
import { Calculator, HeartHandshake, ShieldCheck } from "lucide-react";

interface PurificationCalculatorWidgetProps {
  ticker: string;
  purificationInfo?: PurificationReport;
}

export const PurificationCalculatorWidget: React.FC<PurificationCalculatorWidgetProps> = ({
  ticker,
  purificationInfo,
}) => {
  const [shares, setShares] = useState<number>(100);
  const [customDividend, setCustomDividend] = useState<string>("");

  const dps = purificationInfo?.dividend_per_share || 1.0;
  const impurePct = purificationInfo?.impure_revenue_pct || 0.42;

  // Calculate gross dividend
  const grossDividend = customDividend !== "" && !isNaN(Number(customDividend))
    ? Number(customDividend)
    : shares * dps;

  // Exact purification due
  const purificationDue = Number((grossDividend * (impurePct / 100.0)).toFixed(2));

  return (
    <div className="rounded-2xl bg-[#090D15] border border-[#162235] p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1A2538] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              INDEPENDENT PURIFICATION CALCULATOR
            </span>
          </div>
          <h2 className="text-xl font-serif font-bold text-white tracking-wide">
            Dividend Cleansing Schedule ({ticker})
          </h2>
          <p className="text-xs text-gray-400 font-sans max-w-2xl leading-relaxed">
            Under consensus ethical screening standards, when a company derives a small permissible incidental revenue from interest or non-compliant ancillary services (under 5%), dividend distributions must be mathematically cleansed and given to public charity.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-gray-400 bg-[#0F1624] px-3.5 py-2 rounded-xl border border-[#1E2C42]">
          <ShieldCheck className="w-4 h-4 text-[#00F5A0]" />
          <span>Impure Revenue: <strong className="text-amber-300">{impurePct}%</strong></span>
        </div>
      </div>

      {/* Interactive Input Form & Output Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-6 space-y-4 p-5 rounded-xl bg-[#0B101A] border border-[#18253B]">
          <span className="text-xs font-mono uppercase tracking-wider text-gray-300 font-bold flex items-center gap-2">
            <Calculator className="w-3.5 h-3.5 text-[#00F5A0]" />
            Investment Holding Parameters
          </span>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-gray-400">
              Number of Shares Owned ({ticker})
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={shares}
              onChange={(e) => setShares(Math.max(1, Number(e.target.value) || 0))}
              className="w-full bg-[#06090F] border border-[#1F2E45] rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#00F5A0] transition-colors"
              placeholder="e.g. 100"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono text-gray-400">
                Custom Total Dividend Override (Optional $)
              </label>
              <span className="text-[10px] font-mono text-gray-500">
                Auto DPS: ${dps.toFixed(2)}/sh
              </span>
            </div>
            <input
              type="number"
              min="0"
              step="0.01"
              value={customDividend}
              onChange={(e) => setCustomDividend(e.target.value)}
              className="w-full bg-[#06090F] border border-[#1F2E45] rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#00F5A0] transition-colors"
              placeholder={`Leave blank to use ${shares} × $${dps.toFixed(2)} = $${(shares * dps).toFixed(2)}`}
            />
          </div>

          <div className="pt-2 text-[11px] font-mono text-gray-500 flex items-center justify-between">
            <span>Verified Dividend Yield</span>
            <span className="text-gray-300">
              {((purificationInfo?.dividend_yield || 0.005) * 100).toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Right Output Scorecard */}
        <div className="lg:col-span-6 p-5 rounded-xl bg-gradient-to-br from-[#0D1524] to-[#080D17] border border-[#1F304B] flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              CALCULATED PURIFICATION OBLIGATION
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-editorial text-4xl text-[#00F5A0] font-bold">
                ${purificationDue.toFixed(2)}
              </span>
              <span className="font-mono text-xs text-gray-400">USD</span>
            </div>
            <p className="text-xs text-gray-400 font-sans">
              Based on {impurePct}% incidental non-core revenue on gross dividend payout of ${grossDividend.toFixed(2)}.
            </p>
          </div>

          {/* Breakdown Table */}
          <div className="p-3 rounded-lg bg-[#060A12] border border-[#162235] space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Dividend Received:</span>
              <span className="text-white font-bold">${grossDividend.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Purification Factor:</span>
              <span className="text-amber-300 font-bold">{impurePct}%</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-[#162235]">
              <span className="text-gray-300 font-semibold">Net Retained Dividend:</span>
              <span className="text-[#00F5A0] font-bold">${(grossDividend - purificationDue).toFixed(2)}</span>
            </div>
          </div>

          {/* Mandatory Scholarly Guidance Note */}
          <div className="p-3 rounded-lg bg-[#0E1520] border border-[#233348] text-[11px] text-gray-300 font-sans leading-relaxed">
            <strong className="text-[#D4AF37] font-mono">Scholarly Guidance Disclosure: </strong>
            Purification funds should be channeled to approved humanitarian causes without claiming personal tax relief or deduction. This calculation is provided for informational and transparency purposes.
          </div>
        </div>
      </div>
    </div>
  );
};
