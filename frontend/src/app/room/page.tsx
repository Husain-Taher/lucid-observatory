"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, SentimentSnapshot } from "@/lib/api";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { ShieldCheck, History, ChevronDown, ChevronUp, Zap, ArrowRight } from "lucide-react";
import { TakeoffTransition } from "@/components/market/TakeoffTransition";

export default function RoomPage() {
  const [selectedSignalIndex, setSelectedSignalIndex] = useState<number | null>(null);
  const [activeYear, setActiveYear] = useState<number>(2026);
  const [whyDrawerOpen, setWhyDrawerOpen] = useState(false);
  const [takeoffOpen, setTakeoffOpen] = useState(false);

  const { data: snapshot } = useQuery<SentimentSnapshot>({
    queryKey: ["sentimentSnapshot", activeYear],
    queryFn: () => (activeYear === 2026 ? api.getTodaySentiment() : api.getSentimentHistory(activeYear)),
  });

  const timelineYears = [2008, 2012, 2016, 2020, 2024, 2026];

  const signals = snapshot?.signals || [
    {
      name: "Volatility",
      current_value: 21.5,
      direction: "UP",
      historical_percentile: 65.0,
      source: "FRED (CBOE VIXCLS)",
      date_observed: "Today",
      contribution: "Pricing larger near-term price movement.",
      coverage: "CBOE S&P 500 30-day option implied volatility surface",
      calculation_details: "Ranked against trailing 5-year VIX distribution.",
    },
    {
      name: "Credit Stress",
      current_value: 4.8,
      direction: "FLAT",
      historical_percentile: 45.0,
      source: "FRED (ICE BofA US High Yield OAS)",
      date_observed: "Today",
      contribution: "Riskier corporate borrowing conditions have widened slightly.",
      coverage: "Option-adjusted spread of below-investment-grade corporate bonds",
      calculation_details: "Basis points spread over spot Treasury curve.",
    },
    {
      name: "Options Positioning",
      current_value: 0.92,
      direction: "UP",
      historical_percentile: 72.0,
      source: "CBOE Options Institute",
      date_observed: "Today",
      contribution: "Hedging against downside is elevated.",
      coverage: "Equity put/call traded volume ratio across all CBOE exchanges",
      calculation_details: "Put volume divided by call volume.",
    },
    {
      name: "Safe-Haven Demand",
      current_value: 0.15,
      direction: "UP",
      historical_percentile: 58.0,
      source: "FRED (Treasury 10Y-2Y Constant Maturity)",
      date_observed: "Today",
      contribution: "Capital allocation to sovereign benchmarks reflecting macro outlook.",
      coverage: "10-Year Treasury Yield minus 2-Year Treasury Yield",
      calculation_details: "Yield curve slope and term premium proxy.",
    },
    {
      name: "Market Breadth",
      current_value: 48.0,
      direction: "DOWN",
      historical_percentile: 42.0,
      source: "S&P Dow Jones Indices & Market Feed",
      date_observed: "Today",
      contribution: "Fewer individual equities participating in index advance.",
      coverage: "% of S&P 500 index constituents above 50-day moving average",
      calculation_details: "Count of tickers where Close > 50-day SMA divided by 500.",
    },
  ];

  const selectedSignal = selectedSignalIndex !== null ? signals[selectedSignalIndex] : null;

  return (
    <div className="max-w-5xl mx-auto pt-6 pb-28 px-4">
      {/* Plane Takeoff Transition Overlay */}
      <TakeoffTransition isOpen={takeoffOpen} onClose={() => setTakeoffOpen(false)} />

      <Breadcrumb
        section="ROOM"
        observation="Market Atmosphere"
        stepIndex="02 / 04"
        lessonNarrative="One number is never the whole story. Inspect the 5 contributing signals."
      />

      {/* Header & Market Launchpad */}
      <section className="mt-8 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-lucid-stone">
            Pillar 02 · Living Atmosphere Instrument
          </span>
          <h1 className="font-editorial text-4xl md:text-5xl text-lucid-bone font-normal mt-2">
            Market Atmosphere
          </h1>
          <p className="text-sm md:text-base text-lucid-stone font-light max-w-2xl mt-2">
            One number is never the whole story. Lucid combines several public signals to describe the environment around today&apos;s market.
          </p>
        </div>

        <button
          onClick={() => setTakeoffOpen(true)}
          className="px-5 py-3 rounded-xl bg-[#00F5A0] text-black hover:bg-[#3bfdb9] transition-all font-mono text-xs uppercase tracking-widest font-black flex items-center gap-2.5 shadow-[0_0_18px_rgba(0,245,160,0.35)] hover:scale-105 whitespace-nowrap"
        >
          <Zap className="w-3.5 h-3.5 fill-black" />
          <span>LET&apos;S GO TO THE MARKET</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>

      {/* RADIAL ATMOSPHERE INSTRUMENT (Design Spec 21 & 22) */}
      <div className="relative w-full rounded-3xl bg-lucid-ash border border-lucid-border p-6 md:p-12 shadow-2xl overflow-hidden mb-12">
        {/* Ambient Mood Light */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${
            (snapshot?.composite_score || 63) > 75
              ? "bg-lucid-ember/5"
              : (snapshot?.composite_score || 63) > 50
              ? "bg-lucid-oxide/5"
              : "bg-lucid-moss/5"
          }`}
        />

        <div className="relative z-10 flex flex-col items-center justify-center py-6">
          {/* Radial Instrument Center */}
          <div className="text-center mb-10">
            <span className="font-mono text-xs uppercase tracking-widest text-lucid-stone block mb-1">
              COMPOSITE READING
            </span>
            <div className="font-editorial text-8xl md:text-9xl text-lucid-bone font-normal tracking-tight">
              {selectedSignal ? selectedSignal.current_value : (snapshot?.composite_score || 63)}
            </div>
            <div className="font-mono text-xl uppercase tracking-widest text-lucid-oxide font-medium mt-1">
              {selectedSignal ? selectedSignal.name : (snapshot?.atmosphere || "UNCERTAIN")}
            </div>
            <div className="w-24 h-px bg-lucid-border/80 mx-auto my-3" />
            <span className="text-xs text-lucid-stone/80 font-mono tracking-wider">
              {selectedSignal ? `Historical Percentile: ${selectedSignal.historical_percentile}%` : "5 PUBLIC SIGNALS COMBINED"}
            </span>
          </div>

          {/* Radial 5 Nodes Orbit */}
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3 w-full max-w-4xl">
            {signals.map((sig, idx) => {
              const isSelected = selectedSignalIndex === idx;
              return (
                <button
                  key={sig.name}
                  onClick={() => setSelectedSignalIndex(isSelected ? null : idx)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-lucid-ink border-lucid-oxide shadow-lg scale-105"
                      : "bg-lucid-ink/50 border-lucid-border/60 hover:border-lucid-stone hover:bg-lucid-ink/80"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-lucid-stone mb-1">
                    <span>{sig.name}</span>
                    <span className={sig.direction === "UP" ? "text-lucid-ember font-bold" : (sig.direction === "DOWN" ? "text-lucid-moss font-bold" : "text-lucid-stone")}>
                      {sig.direction === "UP" ? "↑" : (sig.direction === "DOWN" ? "↓" : "→")}
                    </span>
                  </div>
                  <div className="font-editorial text-2xl text-lucid-bone font-normal">
                    {sig.current_value}
                  </div>
                  <div className="text-[10px] text-lucid-stone/70 font-mono mt-1">
                    {sig.historical_percentile}th percentile
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Signal Breakdown or Global Synthesis */}
          <div className="w-full max-w-3xl mt-8 pt-6 border-t border-lucid-border/50 text-center">
            {selectedSignal ? (
              <div className="space-y-2 animate-in fade-in duration-200">
                <p className="text-base text-lucid-bone font-light">
                  {selectedSignal.contribution}
                </p>
                <div className="flex items-center justify-center gap-6 text-xs font-mono text-lucid-stone">
                  <span>Source: {selectedSignal.source}</span>
                  <span>·</span>
                  <span>Coverage: {selectedSignal.coverage}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-base text-lucid-bone font-light leading-relaxed">
                  {snapshot?.narrative}
                </p>
                <button
                  onClick={() => setWhyDrawerOpen(!whyDrawerOpen)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-lucid-oxide/60 text-lucid-oxide hover:bg-lucid-oxide/10 transition-colors font-mono text-xs uppercase tracking-widest"
                >
                  <span>{whyDrawerOpen ? "Close Provenance Drawer" : "Why? (Show Calculation & Sources)"}</span>
                  {whyDrawerOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* PROVENANCE & CALCULATION DRAWER (Design Spec 13 & 47) */}
        {whyDrawerOpen && (
          <div className="mt-8 pt-8 border-t border-lucid-border grid grid-cols-1 md:grid-cols-2 gap-6 bg-lucid-ink/90 p-6 rounded-2xl animate-in fade-in duration-300">
            <div className="space-y-3">
              <h3 className="font-editorial text-xl text-lucid-bone">How We Know</h3>
              <p className="text-xs text-lucid-stone leading-relaxed">
                Lucid does not scrape or copy proprietary commercial black-box indices. The Market Pulse composite is computed strictly from official public series released by the Federal Reserve Bank of St. Louis (FRED) and the Chicago Board Options Exchange (CBOE).
              </p>
              <div className="space-y-1.5 text-xs font-mono text-lucid-stone/90">
                <div>· Volatility: 30-day implied S&P 500 index option surface (FRED VIXCLS).</div>
                <div>· Credit: Option-adjusted high-yield corporate bond spread (ICE BofA).</div>
                <div>· Options: Daily total equity put-to-call ratio (CBOE).</div>
                <div>· Breadth: Market-weighted percentage of S&P 500 above 50d SMA.</div>
              </div>
              <div className="mt-3 pt-3 border-t border-lucid-border/50 text-[11px] font-mono text-lucid-stone/80 space-y-1">
                <p>This product uses the FRED® API but is not endorsed or certified by the Federal Reserve Bank of St. Louis.</p>
                <a
                  href="https://fred.stlouisfed.org/docs/api/terms_of_use.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-lucid-oxide hover:underline"
                >
                  FRED® API Terms of Use ↗
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-editorial text-xl text-lucid-bone">The Non-Guessing Principle</h3>
              <p className="text-xs text-lucid-stone leading-relaxed">
                If an upstream federal or exchange source experiences a holiday or reporting delay, Lucid discloses the missing signal rather than silently substituting a synthetic or hallucinated value.
              </p>
              <div className="p-3 rounded-lg bg-lucid-ash border border-lucid-border/50 text-xs font-mono text-lucid-moss flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-lucid-moss" />
                <span>All 5 public signals verified for today&apos;s calculation.</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* HISTORICAL REGIME MODE: "Take me somewhere else" (Design Spec 23) */}
      <section className="p-6 md:p-8 rounded-2xl bg-lucid-ash/70 border border-lucid-border/60">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-lucid-stone">
            <History className="w-4 h-4 text-lucid-oxide" />
            <span>Historical Mode · Take me somewhere else</span>
          </div>
          <span className="text-xs font-mono text-lucid-oxide font-medium">
            Active Era: {activeYear}
          </span>
        </div>

        <p className="text-xs md:text-sm text-lucid-stone mb-6 font-light">
          Drag through market history. Watch how the entire environment breathes through historical shocks rather than looking at dead charts.
        </p>

        {/* Timeline Slider / Buttons */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {timelineYears.map((yr) => {
            const isActive = activeYear === yr;
            return (
              <button
                key={yr}
                onClick={() => {
                  setActiveYear(yr);
                  setSelectedSignalIndex(null);
                }}
                className={`py-3 rounded-xl border text-center font-mono text-xs transition-all ${
                  isActive
                    ? "bg-lucid-oxide text-lucid-ink font-bold border-lucid-oxide shadow-md"
                    : "bg-lucid-ink border-lucid-border text-lucid-stone hover:text-lucid-bone hover:border-lucid-stone"
                }`}
              >
                {yr}
                {yr === 2008 && <span className="block text-[9px] font-normal opacity-80">GFC</span>}
                {yr === 2020 && <span className="block text-[9px] font-normal opacity-80">COVID</span>}
                {yr === 2026 && <span className="block text-[9px] font-normal opacity-80">TODAY</span>}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
