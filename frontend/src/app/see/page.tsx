"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { api, CommoditiesData, PurchasingPowerData } from "@/lib/api";
import { ArrowRight, Scale, History, RefreshCw } from "lucide-react";

function SeeContent() {
  const searchParams = useSearchParams();
  const initialConcept = searchParams.get("concept") || "compounding";
  const [activeConcept, setActiveConcept] = useState<string>(initialConcept);

  useEffect(() => {
    const c = searchParams.get("concept");
    if (c) setActiveConcept(c);
  }, [searchParams]);

  // Concept 1: Compounding State
  const [compYears, setCompYears] = useState<number>(20);

  // Concept 2: Risk & Return State
  const [expectedReturn, setExpectedReturn] = useState<number>(8.0);

  // Concept 3: Diversification State
  const [assetCount, setAssetCount] = useState<number>(3);

  // Concept 4: DCA State
  const [dcaMonthly, setDcaMonthly] = useState<number>(500);
  const [dcaScenario, setDcaScenario] = useState<"volatile" | "bear-rebound" | "calm">("volatile");

  // Concept 5: Inflation State
  const inflPrincipal = 10000;
  const [inflRate, setInflRate] = useState<number>(3.5);
  const [inflYears, setInflYears] = useState<number>(20);

  // Concept 6: Market Cycles State
  const [cycleIndex, setCycleIndex] = useState<number>(1); // 2008 default
  const [scrubPct, setScrubPct] = useState<number>(55); // 55% drawdown trough

  // Concept 7: Jewels, Gold & Silver State
  const [purchasingYear, setPurchasingYear] = useState<number>(2026);

  // Educational prediction step state
  const [predictionSelected, setPredictionSelected] = useState<string | null>(null);

  // Query live commodities & purchasing power for Studio 07
  const { data: commodities, isLoading: isCommLoading, refetch: refetchComm } = useQuery<CommoditiesData>({
    queryKey: ["liveCommodities"],
    queryFn: api.getLiveCommodities,
    enabled: activeConcept === "jewels-metals",
  });

  const { data: ppData } = useQuery<PurchasingPowerData>({
    queryKey: ["purchasingPowerTimeline"],
    queryFn: api.getPurchasingPowerTimeline,
    enabled: activeConcept === "jewels-metals",
  });

  const conceptsList = [
    { id: "compounding", title: "01 · COMPOUNDING", metaphor: "Organic Growth Curve", desc: "How time turns small additions into exponential curves." },
    { id: "risk-return", title: "02 · RISK / RETURN", metaphor: "Uncertainty Horizon", desc: "Why higher expected reward expands dispersion rather than certainty." },
    { id: "diversification", title: "03 · DIVERSIFICATION", metaphor: "Branching Threads", desc: "How independent paths combine into a calmer distribution." },
    { id: "dca", title: "04 · DOLLAR-COST AVERAGING", metaphor: "Rhythmic Anchors", desc: "Automating cadence to neutralize psychological drawdown panic." },
    { id: "inflation", title: "05 · INFLATION EROSION", metaphor: "Shrinking Basket", desc: "The invisible risk of cash: guaranteed decay of real goods." },
    { id: "market-cycles", title: "06 · MARKET CYCLES", metaphor: "Breathing Regimes", desc: "How economic environments expand and contract across historical shocks." },
    { id: "jewels-metals", title: "07 · JEWELS, GOLD & SILVER", metaphor: "The Mineral Vault", desc: "Tangible mineral wealth vs monetary debasement over 100 years." },
  ];

  const historicalCycles = [
    { name: "Dot-Com Bust (2000–2002)", maxDrawdown: -49.1, recoveryMonths: 56, trigger: "Speculative tech valuations with zero earnings detached from real cash flow." },
    { name: "Global Financial Crisis (2007–2009)", maxDrawdown: -56.8, recoveryMonths: 49, trigger: "Subprime mortgage CDO contagion and systemic banking liquidity seizure." },
    { name: "COVID-19 Lockdown (2020)", maxDrawdown: -33.9, recoveryMonths: 5, trigger: "Global pandemic shutdown followed by unprecedented fiscal stimulus." },
    { name: "Inflation Tightening (2022)", maxDrawdown: -25.4, recoveryMonths: 22, trigger: "Fastest Fed rate hike cycle in 40 years compressed equity multiples and bonds." },
  ];

  // Inflation calculations
  const realPurchasingPower = Math.round(inflPrincipal / Math.pow(1 + inflRate / 100, inflYears));
  const purchasingLossPct = Math.round(((inflPrincipal - realPurchasingPower) / inflPrincipal) * 100);

  // DCA calculations
  const dcaTotalInvested = dcaMonthly * 36;
  const dcaLumpSumReturn = dcaScenario === "bear-rebound" ? -12.5 : dcaScenario === "volatile" ? 8.2 : 24.0;
  const dcaCadenceReturn = dcaScenario === "bear-rebound" ? 18.4 : dcaScenario === "volatile" ? 14.6 : 19.5;

  return (
    <div className="max-w-5xl mx-auto pt-6 pb-28 px-4">
      <Breadcrumb
        section="SEE"
        observation={activeConcept.replace("-", " ").toUpperCase()}
        stepIndex={`0${conceptsList.findIndex((c) => c.id === activeConcept) + 1} / 07`}
        lessonNarrative="Prediction → Manipulation → Observation → Explanation."
      />

      {/* Header */}
      <section className="mt-8 mb-8">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-lucid-stone">
          Pillar 01 · The Interactive Concept Library
        </span>
        <h1 className="font-editorial text-4xl md:text-5xl text-lucid-bone font-normal mt-2">
          See the Mechanism
        </h1>
        <p className="text-sm md:text-base text-lucid-stone font-light max-w-2xl mt-2">
          Financial principles are not static formulas on card widgets. They are physical relationships. Manipulate them directly.
        </p>
      </section>

      {/* Concept Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-lucid-border/50 text-xs font-mono">
        {conceptsList.map((c) => {
          const isActive = activeConcept === c.id;
          return (
            <button
              key={c.id}
              onClick={() => {
                setActiveConcept(c.id);
                setPredictionSelected(null);
              }}
              className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                isActive
                  ? "bg-lucid-ash text-lucid-bone border border-lucid-oxide/80 font-semibold shadow-md"
                  : "text-lucid-stone hover:text-lucid-bone hover:bg-lucid-ash/40"
              }`}
            >
              {c.title}
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 01. COMPOUNDING STUDIO */}
      {/* ========================================================= */}
      {activeConcept === "compounding" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {!predictionSelected && (
            <div className="p-6 rounded-2xl bg-lucid-ash border border-lucid-border">
              <span className="font-mono text-xs text-lucid-oxide uppercase tracking-widest block mb-2">
                STEP 1 · YOUR PREDICTION
              </span>
              <p className="font-editorial text-2xl text-lucid-bone mb-4">
                Before we change anything: what creates the dramatic upward bend in a 20-year curve?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Adding more cash each month",
                  "Returns compounding on prior returns over time",
                  "Finding higher interest rates each year",
                  "Market volatility spikes",
                ].map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPredictionSelected(opt)}
                    className="p-4 rounded-xl text-left font-mono text-xs text-lucid-stone bg-lucid-ink border border-lucid-border hover:border-lucid-oxide transition-all"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-6 md:p-10 rounded-3xl bg-lucid-ash border border-lucid-border shadow-2xl relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-lucid-border/50">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-lucid-stone">
                  TIME HORIZON
                </span>
                <div className="font-editorial text-5xl text-lucid-bone mt-1">
                  {compYears} {compYears === 1 ? "Year" : "Years"}
                </div>
              </div>

              <div className="flex flex-col gap-2 min-w-[280px]">
                <div className="flex justify-between text-xs font-mono text-lucid-stone">
                  <span>DRAG TIME HORIZON</span>
                  <span className="text-lucid-oxide font-bold">{compYears} YRS</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="35"
                  step="1"
                  value={compYears}
                  onChange={(e) => setCompYears(Number(e.target.value))}
                  className="w-full accent-lucid-oxide cursor-pointer"
                />
              </div>
            </div>

            <div className="py-10 flex flex-col items-center">
              <svg viewBox="0 0 800 240" className="w-full h-56 overflow-visible">
                <line x1="0" y1="220" x2="800" y2="220" stroke="#71808A" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                <path
                  d={`M 0 220 Q 300 210 500 150 T 800 ${Math.max(15, 220 - compYears * 6.8)}`}
                  fill="none"
                  stroke="#C56A43"
                  strokeWidth="3.5"
                  className="transition-all duration-300 ease-out"
                />
                <circle cx="800" cy={Math.max(15, 220 - compYears * 6.8)} r="6" fill="#C56A43" className="animate-pulse" />
              </svg>
            </div>

            <div className="p-6 rounded-2xl bg-lucid-ink border border-lucid-border/60">
              <span className="font-mono text-xs text-lucid-stone uppercase tracking-widest block mb-1">
                LUCID OBSERVATION
              </span>
              <p className="font-editorial text-2xl md:text-3xl text-lucid-bone font-normal leading-snug">
                The surprising part isn&apos;t the first few years. It&apos;s what happens when time takes over.
              </p>
              <p className="text-xs md:text-sm text-lucid-stone font-light mt-3 leading-relaxed">
                Over {compYears} years, more than 60% of your total balance is created by returns compounding upon prior returns, dwarfing the initial principal.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 02. RISK & RETURN STUDIO */}
      {/* ========================================================= */}
      {activeConcept === "risk-return" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="p-6 md:p-10 rounded-3xl bg-lucid-ash border border-lucid-border shadow-2xl relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-lucid-border/50">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-lucid-stone">
                  EXPECTED RETURN TARGET
                </span>
                <div className="font-editorial text-5xl text-lucid-bone mt-1">{expectedReturn}%</div>
              </div>

              <div className="flex flex-col gap-2 min-w-[280px]">
                <div className="flex justify-between text-xs font-mono text-lucid-stone">
                  <span>DRAG EXPECTED RETURN</span>
                  <span className="text-lucid-oxide font-bold">↑ {expectedReturn}%</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="16"
                  step="0.5"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  className="w-full accent-lucid-oxide cursor-pointer"
                />
              </div>
            </div>

            <div className="py-12 flex flex-col items-center justify-center text-center relative">
              <span className="text-xs font-mono text-lucid-stone/80 uppercase tracking-widest mb-6">
                ANNUAL OUTCOME DISPERSION (UNCERTAINTY ENVELOPE)
              </span>

              <div className="relative w-full max-w-lg h-56 flex items-center justify-center">
                <div
                  style={{
                    width: `${Math.min(480, expectedReturn * 28 + 60)}px`,
                    height: `${Math.min(220, expectedReturn * 13 + 40)}px`,
                  }}
                  className="absolute rounded-full bg-lucid-ember/10 border border-lucid-ember/30 transition-all duration-300 blur-sm pointer-events-none"
                />
                <div
                  style={{
                    width: `${Math.min(320, expectedReturn * 18 + 40)}px`,
                    height: `${Math.min(140, expectedReturn * 9 + 25)}px`,
                  }}
                  className="absolute rounded-full bg-lucid-oxide/15 border border-lucid-oxide/50 transition-all duration-300"
                />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-lucid-bone border-2 border-lucid-oxide shadow-lg" />
                  <span className="font-mono text-xs text-lucid-bone mt-2 font-bold">{expectedReturn}% Expected</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-lucid-ink border border-lucid-border/60">
              <span className="font-mono text-xs text-lucid-stone uppercase tracking-widest block mb-1">
                LUCID OBSERVATION
              </span>
              <p className="font-editorial text-2xl md:text-3xl text-lucid-bone font-normal leading-snug">
                Higher expected return does not create certainty. It expands the cloud of possible futures.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 03. DIVERSIFICATION STUDIO */}
      {/* ========================================================= */}
      {activeConcept === "diversification" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="p-6 md:p-10 rounded-3xl bg-lucid-ash border border-lucid-border shadow-2xl relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-lucid-border/50">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-lucid-stone">
                  ACTIVE ASSET CLASSES
                </span>
                <div className="font-editorial text-5xl text-lucid-bone mt-1">{assetCount} Threads</div>
              </div>

              <div className="flex items-center gap-3">
                {[1, 2, 3, 5, 7].map((num) => (
                  <button
                    key={num}
                    onClick={() => setAssetCount(num)}
                    className={`px-4 py-2 rounded-xl font-mono text-xs border transition-all ${
                      assetCount === num
                        ? "bg-lucid-oxide text-lucid-ink font-bold border-lucid-oxide shadow-md"
                        : "bg-lucid-ink border-lucid-border text-lucid-stone hover:text-lucid-bone"
                    }`}
                  >
                    {num} {num === 1 ? "Asset" : "Assets"}
                  </button>
                ))}
              </div>
            </div>

            <div className="py-10 flex flex-col items-center">
              <svg viewBox="0 0 800 200" className="w-full h-48 overflow-visible">
                <line x1="0" y1="100" x2="160" y2="100" stroke="#C56A43" strokeWidth="2.5" />
                <circle cx="160" cy="100" r="5" fill="#C56A43" />
                {Array.from({ length: assetCount }).map((_, idx) => {
                  const spread = (idx - (assetCount - 1) / 2) * (140 / Math.max(1, assetCount));
                  const targetY = 100 + spread;
                  return (
                    <g key={idx}>
                      <path d={`M 160 100 C 300 100, 360 ${targetY}, 500 ${targetY}`} fill="none" stroke={idx === 0 ? "#C56A43" : "#71808A"} strokeWidth="1.8" opacity={0.8} />
                      <circle cx="500" cy={targetY} r="3.5" fill="#E9E5DA" />
                      <path d={`M 500 ${targetY} C 620 ${targetY}, 680 100, 800 100`} fill="none" stroke="#89956A" strokeWidth="2" opacity={0.6} />
                    </g>
                  );
                })}
                <circle cx="800" cy="100" r="6" fill="#89956A" />
              </svg>
            </div>

            <div className="p-6 rounded-2xl bg-lucid-ink border border-lucid-border/60">
              <span className="font-mono text-xs text-lucid-stone uppercase tracking-widest block mb-1">
                LUCID OBSERVATION
              </span>
              <p className="font-editorial text-2xl md:text-3xl text-lucid-bone font-normal leading-snug">
                The thread branched, but the portfolio calmed.
              </p>
              <p className="text-xs md:text-sm text-lucid-stone font-light mt-3 leading-relaxed">
                With {assetCount} independent asset classes, portfolio volatility drops from 22% down to {(22 / Math.sqrt(assetCount)).toFixed(1)}%. Diversification is the only mathematical mechanism that reduces variance without sacrificing expected return.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 04. DOLLAR-COST AVERAGING (RHYTHMIC ANCHORS) */}
      {/* ========================================================= */}
      {activeConcept === "dca" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="p-6 md:p-10 rounded-3xl bg-lucid-ash border border-lucid-border shadow-2xl relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-lucid-border/50">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-lucid-stone">
                  MONTHLY ALLOCATION CADENCE
                </span>
                <div className="font-editorial text-5xl text-lucid-bone mt-1">${dcaMonthly} / mo</div>
              </div>

              <div className="flex flex-col gap-2 min-w-[280px]">
                <div className="flex justify-between text-xs font-mono text-lucid-stone">
                  <span>DRAG MONTHLY AMOUNT</span>
                  <span className="text-lucid-oxide font-bold">${dcaMonthly}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="100"
                  value={dcaMonthly}
                  onChange={(e) => setDcaMonthly(Number(e.target.value))}
                  className="w-full accent-lucid-oxide cursor-pointer"
                />
              </div>
            </div>

            {/* Scenario Selector */}
            <div className="pt-4 flex items-center justify-between flex-wrap gap-3">
              <span className="text-xs font-mono text-lucid-stone uppercase tracking-widest">
                MARKET REGIME SCENARIO:
              </span>
              <div className="flex gap-2">
                {(["volatile", "bear-rebound", "calm"] as const).map((sc) => (
                  <button
                    key={sc}
                    onClick={() => setDcaScenario(sc)}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs border uppercase transition-all ${
                      dcaScenario === sc
                        ? "bg-lucid-bone text-lucid-ink font-bold border-lucid-bone"
                        : "bg-lucid-ink border-lucid-border text-lucid-stone"
                    }`}
                  >
                    {sc.replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Rhythmic Wave & Purchase Points SVG */}
            <div className="py-8">
              <svg viewBox="0 0 800 200" className="w-full h-48 overflow-visible">
                {/* Benchmark Volatility Curve */}
                <path
                  d={
                    dcaScenario === "bear-rebound"
                      ? "M 0 60 Q 200 170 400 175 T 800 50"
                      : dcaScenario === "volatile"
                      ? "M 0 100 Q 150 40 300 130 T 600 70 T 800 95"
                      : "M 0 140 Q 300 120 500 80 T 800 40"
                  }
                  fill="none"
                  stroke="#71808A"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  opacity="0.6"
                />

                {/* DCA Purchase Anchor Points */}
                {[50, 150, 250, 350, 450, 550, 650, 750].map((x, idx) => {
                  let y = 100;
                  if (dcaScenario === "bear-rebound") {
                    y = x < 400 ? 60 + (x / 400) * 115 : 175 - ((x - 400) / 400) * 125;
                  } else if (dcaScenario === "volatile") {
                    y = 100 + Math.sin(x / 45) * 38;
                  } else {
                    y = 140 - (x / 800) * 95;
                  }
                  const isDip = y > 115;
                  return (
                    <g key={idx}>
                      <circle cx={x} cy={y} r={isDip ? 6 : 4} fill={isDip ? "#89956A" : "#C56A43"} />
                      <line x1={x} y1={y} x2={x} y2={185} stroke="#71808A" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.4" />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Comparison Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-lucid-ink border border-lucid-border">
                <span className="text-[10px] text-lucid-stone block uppercase">3-YEAR TOTAL INVESTED</span>
                <span className="text-xl font-editorial text-lucid-bone mt-1 block">${dcaTotalInvested.toLocaleString()}</span>
              </div>
              <div className="p-4 rounded-xl bg-lucid-ink border border-lucid-border">
                <span className="text-[10px] text-lucid-stone block uppercase">LUMP SUM RETURN</span>
                <span className={`text-xl font-editorial mt-1 block ${dcaLumpSumReturn >= 0 ? "text-lucid-moss" : "text-lucid-ember"}`}>
                  {dcaLumpSumReturn >= 0 ? `+${dcaLumpSumReturn}%` : `${dcaLumpSumReturn}%`}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-lucid-ink border border-lucid-border">
                <span className="text-[10px] text-lucid-stone block uppercase">DCA CADENCE RETURN</span>
                <span className="text-xl font-editorial text-lucid-moss mt-1 block">+{dcaCadenceReturn}%</span>
              </div>
            </div>

            {/* Editorial Insight */}
            <div className="mt-6 p-6 rounded-2xl bg-lucid-ink border border-lucid-border/60">
              <span className="font-mono text-xs text-lucid-stone uppercase tracking-widest block mb-1">
                LUCID OBSERVATION
              </span>
              <p className="font-editorial text-2xl md:text-3xl text-lucid-bone font-normal leading-snug">
                When prices dip, you don&apos;t lose. You accumulate inventory on sale.
              </p>
              <p className="text-xs md:text-sm text-lucid-stone font-light mt-2 leading-relaxed">
                Notice the green dots during the price drawdown. Fixed dollar amounts bought more shares at lower cost, smoothing the average acquisition price and eliminating timing paralysis.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 05. INFLATION EROSION (THE SHRINKING BASKET) */}
      {/* ========================================================= */}
      {activeConcept === "inflation" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="p-6 md:p-10 rounded-3xl bg-lucid-ash border border-lucid-border shadow-2xl relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-lucid-border/50">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-lucid-stone">
                  NOMINAL CASH PRINCIPAL
                </span>
                <div className="font-editorial text-5xl text-lucid-bone mt-1">${inflPrincipal.toLocaleString()}</div>
              </div>

              <div className="flex flex-col gap-4 min-w-[280px]">
                <div>
                  <div className="flex justify-between text-xs font-mono text-lucid-stone">
                    <span>INFLATION RATE</span>
                    <span className="text-lucid-oxide font-bold">{inflRate}% ANNUALLY</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={inflRate}
                    onChange={(e) => setInflRate(Number(e.target.value))}
                    className="w-full accent-lucid-oxide cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-mono text-lucid-stone">
                    <span>HOLDING DURATION</span>
                    <span className="text-lucid-bone font-bold">{inflYears} YEARS</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="35"
                    step="1"
                    value={inflYears}
                    onChange={(e) => setInflYears(Number(e.target.value))}
                    className="w-full accent-lucid-bone cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Shrinking Goods Basket Visual Metaphor */}
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-mono text-lucid-stone uppercase tracking-widest mb-6">
                REAL PURCHASING BASKET EROSION
              </span>

              <div className="flex items-center justify-center gap-8 md:gap-16">
                {/* Original Basket Year 0 */}
                <div className="flex flex-col items-center">
                  <div className="w-28 h-28 rounded-3xl bg-lucid-ink border-2 border-lucid-moss flex flex-col items-center justify-center p-3 shadow-xl">
                    <span className="text-2xl">🧺</span>
                    <span className="font-mono text-xs text-lucid-bone mt-1 font-bold">100% Goods</span>
                    <span className="text-[10px] font-mono text-lucid-stone">Year 0</span>
                  </div>
                  <span className="font-mono text-xs text-lucid-stone mt-2">${inflPrincipal.toLocaleString()} Value</span>
                </div>

                <ArrowRight className="w-6 h-6 text-lucid-stone" />

                {/* Shrunken Basket at Target Year */}
                <div className="flex flex-col items-center">
                  <div
                    style={{
                      transform: `scale(${Math.max(0.35, 1 - purchasingLossPct / 120)})`,
                      transition: "transform 0.3s ease-out",
                    }}
                    className="w-28 h-28 rounded-3xl bg-lucid-ink border-2 border-lucid-ember flex flex-col items-center justify-center p-3 shadow-xl"
                  >
                    <span className="text-xl">🍞</span>
                    <span className="font-mono text-[11px] text-lucid-ember mt-1 font-bold">
                      {100 - purchasingLossPct}% Goods
                    </span>
                    <span className="text-[9px] font-mono text-lucid-stone">Year {inflYears}</span>
                  </div>
                  <span className="font-mono text-xs text-lucid-ember mt-2 font-bold">
                    ${realPurchasingPower.toLocaleString()} Real Power
                  </span>
                </div>
              </div>
            </div>

            {/* Editorial Insight */}
            <div className="p-6 rounded-2xl bg-lucid-ink border border-lucid-border/60">
              <span className="font-mono text-xs text-lucid-stone uppercase tracking-widest block mb-1">
                LUCID OBSERVATION
              </span>
              <p className="font-editorial text-2xl md:text-3xl text-lucid-bone font-normal leading-snug">
                Holding cash carries its own invisible risk: guaranteed decay of real purchasing power.
              </p>
              <p className="text-xs md:text-sm text-lucid-stone font-light mt-3 leading-relaxed">
                While your bank statement preserves the nominal ${inflPrincipal.toLocaleString()} digit, over {inflYears} years at {inflRate}% inflation, your purchasing capacity shrinks by {purchasingLossPct}%. Cash guarantees a permanent loss in living standards unless deployed into productive compounding assets.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 06. MARKET CYCLES (BREATHING REGIMES) */}
      {/* ========================================================= */}
      {activeConcept === "market-cycles" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="p-6 md:p-10 rounded-3xl bg-lucid-ash border border-lucid-border shadow-2xl relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-lucid-border/50">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-lucid-stone">
                  HISTORICAL CRASH & RECOVERY
                </span>
                <div className="font-editorial text-3xl md:text-4xl text-lucid-bone mt-1">
                  {historicalCycles[cycleIndex].name}
                </div>
              </div>

              {/* Cycle Selector */}
              <div className="flex gap-2 overflow-x-auto pb-2 font-mono text-xs">
                {historicalCycles.map((cyc, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCycleIndex(idx);
                      setScrubPct(55);
                    }}
                    className={`px-3 py-2 rounded-xl whitespace-nowrap border transition-all ${
                      cycleIndex === idx
                        ? "bg-lucid-oxide text-lucid-ink font-bold border-lucid-oxide shadow-md"
                        : "bg-lucid-ink border-lucid-border text-lucid-stone hover:text-lucid-bone"
                    }`}
                  >
                    {cyc.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Peak-to-Trough Drawdown Scrubber */}
            <div className="pt-6 space-y-4">
              <div className="flex justify-between text-xs font-mono text-lucid-stone">
                <span>SCRUB CYCLE PHASE:</span>
                <span className="text-lucid-oxide font-bold">
                  {scrubPct < 25 ? "EUPHORIA / PEAK" : scrubPct < 65 ? "PANIC / CAPITULATION" : "RECOVERY & EXPANSION"}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={scrubPct}
                onChange={(e) => setScrubPct(Number(e.target.value))}
                className="w-full accent-lucid-oxide cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-lucid-stone/60">
                <span>Peak (0%)</span>
                <span>Max Drawdown ({historicalCycles[cycleIndex].maxDrawdown}%)</span>
                <span>Full Recovery (100%)</span>
              </div>
            </div>

            {/* Cycle Curve SVG */}
            <div className="py-8">
              <svg viewBox="0 0 800 200" className="w-full h-48 overflow-visible">
                <path d="M 0 40 Q 300 200 450 180 T 800 40" fill="none" stroke="#71808A" strokeWidth="2.5" />
                {/* Active Scrubber Point */}
                {(() => {
                  const x = (scrubPct / 100) * 800;
                  const y = scrubPct < 55 ? 40 + (scrubPct / 55) * 140 : 180 - ((scrubPct - 55) / 45) * 140;
                  return (
                    <g>
                      <circle cx={x} cy={y} r="8" fill="#C56A43" className="animate-pulse" />
                      <line x1={x} y1={0} x2={x} y2={200} stroke="#C56A43" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
                    </g>
                  );
                })()}
              </svg>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-lucid-ink border border-lucid-border">
                <span className="text-[10px] text-lucid-stone block uppercase">MAXIMUM PEAK DRAWDOWN</span>
                <span className="text-xl font-editorial text-lucid-ember mt-1 block">
                  {historicalCycles[cycleIndex].maxDrawdown}%
                </span>
              </div>
              <div className="p-4 rounded-xl bg-lucid-ink border border-lucid-border">
                <span className="text-[10px] text-lucid-stone block uppercase">RECOVERY DURATION</span>
                <span className="text-xl font-editorial text-lucid-bone mt-1 block">
                  {historicalCycles[cycleIndex].recoveryMonths} Months
                </span>
              </div>
              <div className="p-4 rounded-xl bg-lucid-ink border border-lucid-border">
                <span className="text-[10px] text-lucid-stone block uppercase">CATALYST / TRIGGER</span>
                <span className="text-xs font-sans text-lucid-stone mt-1 block leading-tight">
                  {historicalCycles[cycleIndex].trigger}
                </span>
              </div>
            </div>

            {/* Editorial Insight */}
            <div className="mt-6 p-6 rounded-2xl bg-lucid-ink border border-lucid-border/60">
              <span className="font-mono text-xs text-lucid-stone uppercase tracking-widest block mb-1">
                LUCID OBSERVATION
              </span>
              <p className="font-editorial text-2xl md:text-3xl text-lucid-bone font-normal leading-snug">
                Every market crash felt like the permanent end while happening.
              </p>
              <p className="text-xs md:text-sm text-lucid-stone font-light mt-2 leading-relaxed">
                Drawdowns are not accidents in capitalism; they are the price of admission. Selling during capitulation locks in permanent impairment, whereas enduring the cycle allows subsequent multi-year expansions to compound unimpeded.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 07. JEWELS, GOLD & SILVER (THE MINERAL VAULT) */}
      {/* ========================================================= */}
      {activeConcept === "jewels-metals" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="p-6 md:p-10 rounded-3xl bg-lucid-ash border border-lucid-border shadow-2xl relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-lucid-border/50">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-lucid-stone">
                  THE TANGIBLE MINERAL VAULT
                </span>
                <div className="font-editorial text-4xl md:text-5xl text-lucid-bone mt-1">
                  Jewels, Gold & Silver
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => refetchComm()}
                  className="px-4 py-2 rounded-xl bg-lucid-ink border border-lucid-border text-lucid-bone hover:border-lucid-stone font-mono text-xs flex items-center gap-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isCommLoading ? "animate-spin" : ""}`} />
                  <span>Refresh Spot Proxies</span>
                </button>
              </div>
            </div>

            {/* Live Real-Time Ticker Strip */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-lucid-ink border border-lucid-border/80">
                <div className="flex justify-between items-center text-lucid-stone text-[10px]">
                  <span>GOLD (GLD)</span>
                  <span className={(commodities?.quotes.gold.change_pct || 0) >= 0 ? "text-lucid-moss" : "text-lucid-ember"}>
                    {(commodities?.quotes.gold.change_pct || 0) >= 0 ? `+${commodities?.quotes.gold.change_pct}%` : `${commodities?.quotes.gold.change_pct}%`}
                  </span>
                </div>
                <div className="font-editorial text-2xl text-lucid-bone mt-1">
                  ${commodities?.quotes.gold.price || "248.50"}
                </div>
                <span className="text-[10px] text-lucid-stone/70 block mt-1">
                  ~${commodities?.gold_silver_ratio.gold_implied_oz || "2,650"}/oz implied
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-lucid-ink border border-lucid-border/80">
                <div className="flex justify-between items-center text-lucid-stone text-[10px]">
                  <span>SILVER (SLV)</span>
                  <span className={(commodities?.quotes.silver.change_pct || 0) >= 0 ? "text-lucid-moss" : "text-lucid-ember"}>
                    {(commodities?.quotes.silver.change_pct || 0) >= 0 ? `+${commodities?.quotes.silver.change_pct}%` : `${commodities?.quotes.silver.change_pct}%`}
                  </span>
                </div>
                <div className="font-editorial text-2xl text-lucid-bone mt-1">
                  ${commodities?.quotes.silver.price || "28.40"}
                </div>
                <span className="text-[10px] text-lucid-stone/70 block mt-1">
                  ~${commodities?.gold_silver_ratio.silver_implied_oz || "31.20"}/oz implied
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-lucid-ink border border-lucid-border/80">
                <div className="flex justify-between items-center text-lucid-stone text-[10px]">
                  <span>PLATINUM & JEWELS (PPLT)</span>
                  <span className={(commodities?.quotes.platinum.change_pct || 0) >= 0 ? "text-lucid-moss" : "text-lucid-ember"}>
                    {(commodities?.quotes.platinum.change_pct || 0) >= 0 ? `+${commodities?.quotes.platinum.change_pct}%` : `${commodities?.quotes.platinum.change_pct}%`}
                  </span>
                </div>
                <div className="font-editorial text-2xl text-lucid-bone mt-1">
                  ${commodities?.quotes.platinum.price || "87.20"}
                </div>
                <span className="text-[10px] text-lucid-stone/70 block mt-1">Industrial + Jewelry Store</span>
              </div>

              <div className="p-4 rounded-2xl bg-lucid-ink border border-lucid-border/80">
                <div className="flex justify-between items-center text-lucid-stone text-[10px]">
                  <span>S&P 500 (SPY)</span>
                  <span className={(commodities?.quotes.sp500.change_pct || 0) >= 0 ? "text-lucid-moss" : "text-lucid-ember"}>
                    {(commodities?.quotes.sp500.change_pct || 0) >= 0 ? `+${commodities?.quotes.sp500.change_pct}%` : `${commodities?.quotes.sp500.change_pct}%`}
                  </span>
                </div>
                <div className="font-editorial text-2xl text-lucid-bone mt-1">
                  ${commodities?.quotes.sp500.price || "558.20"}
                </div>
                <span className="text-[10px] text-lucid-stone/70 block mt-1">Paper Equity Benchmark</span>
              </div>
            </div>

            {/* Gold/Silver Ratio Dial & Regime Indicator */}
            <div className="mt-8 p-6 rounded-2xl bg-lucid-ink border border-lucid-border/70 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-lucid-oxide" />
                  <span className="font-mono text-xs text-lucid-bone uppercase tracking-widest font-semibold">
                    Gold / Silver Ratio (GSR): {commodities?.gold_silver_ratio.ratio || 84.5}
                  </span>
                </div>
                <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-lucid-ash text-lucid-oxide border border-lucid-border">
                  REGIME: {commodities?.gold_silver_ratio.regime || "DEFENSIVE_PANIC"}
                </span>
              </div>

              <p className="text-xs text-lucid-stone leading-relaxed">
                {commodities?.gold_silver_ratio.insight ||
                  "The Gold/Silver ratio reflects relative risk appetite. Readings above 80 indicate extreme defensive monetary anxiety, where gold outperforms industrial silver."}
              </p>

              {/* Gauge Track */}
              <div className="space-y-1">
                <div className="h-3 w-full bg-lucid-ash rounded-full overflow-hidden flex">
                  <div className="w-1/3 bg-lucid-moss/40" title="<60: Industrial Expansion" />
                  <div className="w-1/3 bg-lucid-stone/30" title="60-80: Equilibrium" />
                  <div className="w-1/3 bg-lucid-ember/40" title=">80: Defensive Flight" />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-lucid-stone/60">
                  <span>50 (Industrial Bull)</span>
                  <span>70 (Historical Equilibrium)</span>
                  <span>90+ (Defensive Panic)</span>
                </div>
              </div>
            </div>

            {/* 100-Year Purchasing Power Time Lens */}
            <div className="mt-8 p-6 rounded-2xl bg-lucid-ink border border-lucid-border/70 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-lucid-bone" />
                  <span className="font-mono text-xs text-lucid-bone uppercase tracking-widest font-semibold">
                    100-Year Purchasing Power Lens (1925–2026)
                  </span>
                </div>

                <div className="flex gap-2 font-mono text-xs">
                  {[1925, 1950, 1975, 2000, 2026].map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setPurchasingYear(yr)}
                      className={`px-3 py-1.5 rounded-lg border transition-all ${
                        purchasingYear === yr
                          ? "bg-lucid-bone text-lucid-ink font-bold border-lucid-bone"
                          : "bg-lucid-ash border-lucid-border text-lucid-stone"
                      }`}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year Snapshot Breakdown */}
              {(() => {
                const pt = ppData?.timeline.find((t) => t.year === purchasingYear) || {
                  year: purchasingYear,
                  gold_price_per_oz: purchasingYear === 1925 ? 20.67 : 2680.0,
                  cash_real_purchasing_power: purchasingYear === 1925 ? 1000 : 18,
                  goods_purchased_by_gold_1oz:
                    purchasingYear === 1925
                      ? "A bespoke three-piece tailored wool suit"
                      : "A premier Savile Row bespoke suit with fine accessories",
                  goods_purchased_by_cash_1000:
                    purchasingYear === 1925
                      ? "A brand-new Ford Model T automobile ($260) with $740 left over"
                      : "A single week of family groceries and a tank of fuel",
                };
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-lucid-ash border border-lucid-border space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-lucid-oxide font-bold">1 OZ PHYSICAL GOLD (${pt.gold_price_per_oz}/oz)</span>
                        <span className="text-lucid-moss">Stores Human Labor</span>
                      </div>
                      <p className="font-editorial text-lg text-lucid-bone leading-snug">
                        {pt.goods_purchased_by_gold_1oz}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-lucid-ash border border-lucid-border space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-lucid-ember font-bold">$1,000 USD NOMINAL CASH</span>
                        <span className="text-lucid-ember">Real Value: ${pt.cash_real_purchasing_power}</span>
                      </div>
                      <p className="font-editorial text-lg text-lucid-stone leading-snug">
                        {pt.goods_purchased_by_cash_1000}
                      </p>
                    </div>
                  </div>
                );
              })()}

              <p className="text-xs text-lucid-stone font-light leading-relaxed border-t border-lucid-border/40 pt-4">
                {ppData?.insight ||
                  "Over 100 years, $1,000 in nominal cash lost over 98% of its real purchasing power. In contrast, 1 ounce of gold bought a bespoke tailored suit in 1925 ($20.67) and still buys a bespoke tailored suit in 2026 ($2,680+). Tangible mineral assets store real human energy across centuries."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SeePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto pt-24 px-4 text-center">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-lucid-stone animate-pulse">
            Loading Concept Studio...
          </span>
        </div>
      }
    >
      <SeeContent />
    </Suspense>
  );
}
