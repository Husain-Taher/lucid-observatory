"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles } from "lucide-react";

interface CalendarDayFlipProps {
  onDateChange?: (dateStr: string, year: number) => void;
}

export function CalendarDayFlip({ onDateChange }: CalendarDayFlipProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [dateIndex, setDateIndex] = useState(3); // Default to Today

  const dates = [
    {
      date: "2008-10-15",
      dayName: "WEDNESDAY",
      month: "OCTOBER",
      dayNum: "15",
      year: 2008,
      regime: "COMPRESSED",
      note: "Lehman liquidity contagion & VIX 69.2",
    },
    {
      date: "2020-03-23",
      dayName: "MONDAY",
      month: "MARCH",
      dayNum: "23",
      year: 2020,
      regime: "COMPRESSED",
      note: "COVID pandemic lockdown trough & Fed QE",
    },
    {
      date: "2024-07-15",
      dayName: "MONDAY",
      month: "JULY",
      dayNum: "15",
      year: 2024,
      regime: "EXPANSIVE",
      note: "Gold all-time high & AI infrastructure expansion",
    },
    {
      date: "2026-09-09",
      dayName: "WEDNESDAY",
      month: "SEPTEMBER",
      dayNum: "09",
      year: 2026,
      regime: "UNCERTAIN",
      note: "Current Market Observation · Three signals converging",
    },
  ];

  const current = dates[dateIndex];

  const handleStep = (newIndex: number) => {
    if (newIndex < 0 || newIndex >= dates.length) return;
    setIsFlipping(true);
    setTimeout(() => {
      setDateIndex(newIndex);
      setIsFlipping(false);
      const target = dates[newIndex];
      if (onDateChange) {
        onDateChange(target.date, target.year);
      }
    }, 180);
  };

  return (
    <div className="relative p-6 md:p-8 rounded-3xl bg-lucid-ash border border-lucid-border shadow-2xl overflow-hidden">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-lucid-border/50 text-xs font-mono text-lucid-stone">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-3.5 h-3.5 text-lucid-oxide" />
          <span className="tracking-widest uppercase">Archival Desk Calendar · Time Horizon</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-lucid-moss animate-pulse" />
          <span className="text-[11px] text-lucid-bone font-medium">
            {dateIndex === dates.length - 1 ? "LIVE MARKET SESSION" : "HISTORICAL OBSERVATION"}
          </span>
        </div>
      </div>

      {/* Main Flip Calendar Surface */}
      <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Vintage / Editorial Calendar Card */}
        <div className="relative w-48 h-56 rounded-2xl bg-lucid-ink border-2 border-lucid-border/80 flex flex-col overflow-hidden shadow-2xl">
          {/* Card Binder Top Rivets */}
          <div className="h-4 bg-lucid-stone/20 flex items-center justify-around px-4 border-b border-lucid-border/40">
            <span className="w-2 h-2 rounded-full bg-lucid-border shadow-inner" />
            <span className="w-2 h-2 rounded-full bg-lucid-border shadow-inner" />
          </div>

          {/* Month Banner */}
          <div className="py-1.5 bg-lucid-oxide/90 text-center font-mono text-[11px] font-bold text-lucid-ink tracking-widest uppercase">
            {current.month}
          </div>

          {/* Day Number with Flip Transition */}
          <div
            className={`flex-1 flex flex-col items-center justify-center transition-transform duration-200 ${
              isFlipping ? "scale-95 opacity-40 rotate-x-12" : "scale-100 opacity-100"
            }`}
          >
            <span className="font-editorial text-6xl text-lucid-bone font-normal leading-none">
              {current.dayNum}
            </span>
            <span className="font-mono text-[10px] text-lucid-stone uppercase tracking-widest mt-2 font-medium">
              {current.dayName} · {current.year}
            </span>
          </div>

          {/* Bottom Card Shadow Lip */}
          <div className="h-2 bg-lucid-ash/40 border-t border-lucid-border/30" />
        </div>

        {/* Center: Contextual Observation Note */}
        <div className="flex-1 space-y-3 text-left">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-wider bg-lucid-border text-lucid-bone">
              Atmosphere: {current.regime}
            </span>
            <span className="font-mono text-[11px] text-lucid-stone">{current.date}</span>
          </div>
          <p className="font-editorial text-2xl text-lucid-bone leading-snug">
            {current.note}
          </p>
          <p className="text-xs text-lucid-stone font-light leading-relaxed">
            Flipping dates adjusts the observatory. Notice how prices, credit spreads, and volatility signatures shift between euphoric expansions and liquidity crises.
          </p>
        </div>

        {/* Right: Controls & Stepper */}
        <div className="flex flex-col gap-2 min-w-[140px]">
          <span className="font-mono text-[10px] text-lucid-stone uppercase tracking-widest text-center">
            STEP DAY
          </span>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handleStep(dateIndex - 1)}
              disabled={dateIndex === 0}
              className="p-3 rounded-xl bg-lucid-ink border border-lucid-border text-lucid-bone hover:border-lucid-stone transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              title="Previous Historical Date"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleStep(dateIndex + 1)}
              disabled={dateIndex === dates.length - 1}
              className="p-3 rounded-xl bg-lucid-ink border border-lucid-border text-lucid-bone hover:border-lucid-stone transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              title="Next Historical Date"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => handleStep(dates.length - 1)}
            className={`mt-1 py-2 px-3 rounded-xl font-mono text-[11px] border transition-all flex items-center justify-center gap-1.5 ${
              dateIndex === dates.length - 1
                ? "bg-lucid-oxide text-lucid-ink font-bold border-lucid-oxide shadow-md"
                : "bg-lucid-ink border-lucid-border text-lucid-stone hover:text-lucid-bone"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Today (Live)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
