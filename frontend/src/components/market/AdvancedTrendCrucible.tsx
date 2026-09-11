"use client";

import React, { useState } from "react";
import { DetailedQuote, TrendPoint } from "@/lib/api";

interface AdvancedTrendCrucibleProps {
  quote: DetailedQuote | null;
  selectedPeriod: string;
  onSelectPeriod: (p: string) => void;
  isLoading: boolean;
}

export const AdvancedTrendCrucible: React.FC<AdvancedTrendCrucibleProps> = ({
  quote,
  selectedPeriod,
  onSelectPeriod,
  isLoading,
}) => {
  const [showSMA, setShowSMA] = useState<boolean>(true);
  const [showVolume, setShowVolume] = useState<boolean>(true);
  const [hoveredPoint, setHoveredPoint] = useState<TrendPoint | null>(null);

  const PERIODS = [
    { label: "1D", value: "1d" },
    { label: "5D", value: "5d" },
    { label: "1M", value: "1mo" },
    { label: "6M", value: "6mo" },
    { label: "1Y", value: "1y" },
    { label: "5Y", value: "5y" },
    { label: "MAX", value: "max" },
  ];

  if (isLoading) {
    return (
      <div className="w-full h-96 bg-[#090d14] border border-[#1b2332] rounded-xl flex flex-col items-center justify-center space-y-3 font-mono text-xs text-gray-400">
        <div className="w-8 h-8 border-2 border-[#00F5A0] border-t-transparent rounded-full animate-spin" />
        <span>STREAMING MULTI-TIMEFRAME HISTORICAL BARS...</span>
      </div>
    );
  }

  if (!quote) return null;

  const history = quote.history || [];
  const closes = history.map((pt) => pt.close);
  const volumes = history.map((pt) => pt.volume);
  const minPrice = closes.length > 0 ? Math.min(...closes) : quote.day_low;
  const maxPrice = closes.length > 0 ? Math.max(...closes) : quote.day_high;
  const priceRange = maxPrice - minPrice || 1;
  const maxVolume = volumes.length > 0 ? Math.max(...volumes) : 1;

  // Active hover point or latest point
  const currentPoint = hoveredPoint || (history.length > 0 ? history[history.length - 1] : null);
  const startClose = history.length > 0 ? history[0].close : quote.open;
  const periodChange = currentPoint ? currentPoint.close - startClose : quote.change;
  const periodChangePct = startClose ? (periodChange / startClose) * 100 : quote.change_pct;

  return (
    <div className="w-full bg-[#090d14] border border-[#1b2332] rounded-xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.8)] font-sans text-white">
      {/* Top Header Row: Symbol, Price, Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#1b2332]">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="font-mono text-3xl font-black tracking-wider text-white">
              {quote.symbol}
            </h2>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-[#131923] border border-[#222c3d] text-gray-300">
              {quote.name}
            </span>
          </div>

          {/* Large Price Readout with Dynamic Period Delta */}
          <div className="flex flex-wrap items-baseline gap-2 sm:gap-4 mt-2">
            <span className="font-mono text-3xl sm:text-4xl lg:text-5xl font-black text-white">
              ${(currentPoint ? currentPoint.close : quote.price).toFixed(2)}
            </span>

            <div
              className={`flex items-center gap-1 font-mono text-xs sm:text-sm lg:text-base font-bold ${
                periodChange >= 0 ? "text-[#00F5A0]" : "text-[#FF3366]"
              }`}
            >
              <span>{periodChange >= 0 ? "▲ +" : "▼ "}</span>
              <span>${Math.abs(periodChange).toFixed(2)}</span>
              <span>({periodChange >= 0 ? "+" : ""}{periodChangePct.toFixed(2)}%)</span>
              <span className="text-[10px] text-gray-500 ml-1 uppercase font-normal">
                [{selectedPeriod.toUpperCase()}]
              </span>
            </div>
          </div>
        </div>

        {/* Timeframe Period Selector & Indicator Toggles */}
        <div className="flex flex-col items-start lg:items-end gap-3 w-full lg:w-auto">
          {/* Period Pills */}
          <div className="flex items-center gap-1 bg-[#050608] p-1 rounded-lg border border-[#1e2636] max-w-full overflow-x-auto pb-1 sm:pb-1 w-full sm:w-auto">
            {PERIODS.map((p) => {
              const isSelected = selectedPeriod === p.value;
              return (
                <button
                  key={p.value}
                  onClick={() => onSelectPeriod(p.value)}
                  className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                    isSelected
                      ? "bg-[#00F5A0] text-black shadow-[0_0_10px_rgba(0,245,160,0.4)]"
                      : "text-gray-400 hover:text-white hover:bg-[#121822]"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Indicator Toggles */}
          <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showSMA}
                onChange={(e) => setShowSMA(e.target.checked)}
                className="rounded border-[#263142] bg-[#0c1017] text-[#00F5A0] focus:ring-0"
              />
              <span className={showSMA ? "text-[#f59e0b]" : ""}>SMA (20)</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showVolume}
                onChange={(e) => setShowVolume(e.target.checked)}
                className="rounded border-[#263142] bg-[#0c1017] text-[#00F5A0] focus:ring-0"
              />
              <span className={showVolume ? "text-gray-200" : ""}>Volume</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main SVG Chart Canvas with Crosshair Interactivity */}
      <div className="relative w-full h-72 lg:h-80 bg-[#050608] rounded-xl border border-[#1b2332] mt-6 p-4 overflow-hidden select-none">
        {/* Horizontal Gridlines */}
        <div className="absolute inset-0 grid grid-rows-4 pointer-events-none opacity-20">
          <div className="border-b border-gray-600" />
          <div className="border-b border-gray-600" />
          <div className="border-b border-gray-600" />
        </div>

        {/* Hover Crosshair Info Tooltip */}
        {currentPoint && (
          <div className="absolute top-2 left-2 right-2 sm:right-auto sm:top-3 sm:left-4 z-20 font-mono text-[10px] sm:text-[11px] flex flex-wrap items-center gap-2 sm:gap-4 bg-[#090d14]/95 border border-[#212c3e] px-2.5 py-1 rounded shadow-lg pointer-events-none">
            <span className="text-gray-400">Date: <strong className="text-white">{currentPoint.date}</strong></span>
            <span className="text-gray-400">Close: <strong className="text-white">${currentPoint.close.toFixed(2)}</strong></span>
            <span className="text-gray-400 hidden sm:inline">Open: <strong className="text-white">${currentPoint.open.toFixed(2)}</strong></span>
            <span className="text-gray-400 hidden md:inline">Vol: <strong className="text-white">{currentPoint.volume.toLocaleString()}</strong></span>
            {showSMA && currentPoint.sma20 && (
              <span className="text-[#f59e0b]">SMA20: ${currentPoint.sma20.toFixed(2)}</span>
            )}
          </div>
        )}

        {/* SVG Drawing */}
        {history.length > 1 && (
          <svg
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={periodChange >= 0 ? "#00F5A0" : "#FF3366"} stopOpacity="0.35" />
                <stop offset="100%" stopColor={periodChange >= 0 ? "#00F5A0" : "#FF3366"} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Volume Bars */}
            {showVolume &&
              history.map((pt, idx) => {
                const x = (idx / (history.length - 1)) * 100;
                const barHeight = (pt.volume / maxVolume) * 22; // up to 22% of height
                const y = 98 - barHeight;
                const isUp = pt.close >= pt.open;

                return (
                  <rect
                    key={`vol-${idx}`}
                    x={x - 0.4}
                    y={y}
                    width={Math.max(0.8, 100 / history.length - 0.2)}
                    height={barHeight}
                    fill={isUp ? "#00F5A0" : "#FF3366"}
                    opacity="0.25"
                  />
                );
              })}

            {/* Area Fill */}
            {(() => {
              const pts = history
                .map((pt, idx) => {
                  const x = (idx / (history.length - 1)) * 100;
                  const y = 80 - ((pt.close - minPrice) / priceRange) * 65;
                  return `${x},${y}`;
                })
                .join(" ");
              const areaPts = `0,85 ${pts} 100,85`;

              return (
                <>
                  <polygon points={areaPts} fill="url(#chartGradient)" />
                  <polyline
                    fill="none"
                    stroke={periodChange >= 0 ? "#00F5A0" : "#FF3366"}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={pts}
                  />
                </>
              );
            })()}

            {/* SMA (20) Line */}
            {showSMA &&
              (() => {
                const validSmaPts = history
                  .map((pt, idx) => {
                    if (!pt.sma20) return null;
                    const x = (idx / (history.length - 1)) * 100;
                    const y = 80 - ((pt.sma20 - minPrice) / priceRange) * 65;
                    return `${x},${y}`;
                  })
                  .filter(Boolean)
                  .join(" ");

                if (!validSmaPts) return null;
                return (
                  <polyline
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.6"
                    strokeDasharray="3 2"
                    points={validSmaPts}
                  />
                );
              })()}

            {/* Invisible Hover Rectangles for Crosshair Snapping */}
            {history.map((pt, idx) => {
              const x = (idx / (history.length - 1)) * 100;
              const w = 100 / history.length;
              return (
                <rect
                  key={`hover-${idx}`}
                  x={x - w / 2}
                  y={0}
                  width={w}
                  height={100}
                  fill="transparent"
                  className="cursor-crosshair"
                  onMouseEnter={() => setHoveredPoint(pt)}
                />
              );
            })}
          </svg>
        )}
      </div>

      {/* Metrics Row: Dimensions & Bullion Physical Value */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mt-6 pt-6 border-t border-[#1a2333] font-mono text-xs">
        <div className="p-3 bg-[#050608] rounded border border-[#1a2333]">
          <span className="text-[10px] text-gray-400 block uppercase">Period High</span>
          <span className="font-bold text-white">${maxPrice.toFixed(2)}</span>
        </div>
        <div className="p-3 bg-[#050608] rounded border border-[#1a2333]">
          <span className="text-[10px] text-gray-400 block uppercase">Period Low</span>
          <span className="font-bold text-white">${minPrice.toFixed(2)}</span>
        </div>
        <div className="p-3 bg-[#050608] rounded border border-[#1a2333]">
          <span className="text-[10px] text-gray-400 block uppercase">52-Wk High</span>
          <span className="font-bold text-white">${quote.year_high.toFixed(2)}</span>
        </div>
        <div className="p-3 bg-[#050608] rounded border border-[#1a2333]">
          <span className="text-[10px] text-gray-400 block uppercase">52-Wk Low</span>
          <span className="font-bold text-white">${quote.year_low.toFixed(2)}</span>
        </div>
        <div className="p-3 bg-[#050608] rounded border border-[#1a2333]">
          <span className="text-[10px] text-gray-400 block uppercase">Volume</span>
          <span className="font-bold text-white">{quote.volume.toLocaleString()}</span>
        </div>
        <div className="p-3 bg-[#050608] rounded border border-[#1a2333]">
          <span className="text-[10px] text-gray-400 block uppercase">Market Cap</span>
          <span className="font-bold text-white">${(quote.market_cap / 1e9).toFixed(1)}B</span>
        </div>
      </div>

      {/* Special Bullion Valuation Calculator */}
      {(quote.symbol === "GLD" || quote.symbol === "SLV" || quote.symbol === "PPLT") && (
        <div className="mt-6 p-4 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/40 font-mono text-xs text-[#FFD700] space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold uppercase tracking-wider">
              [ MONETARY GROUNDING · 100-YEAR PURCHASING POWER ]
            </span>
            <span className="text-[10px] text-gray-300">REAL ASSET BENCHMARK</span>
          </div>
          <p className="text-gray-300 font-sans text-xs leading-relaxed">
            Unlike fiat claims subject to infinite sovereign expansion, physical bullion cannot be debased by central bank balance sheet expansion. 1 ounce of gold purchased a tailored gentleman&apos;s suit in 1926 and purchases the exact same suit today.
          </p>
        </div>
      )}
    </div>
  );
};
