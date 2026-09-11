"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api, SentimentSnapshot } from "@/lib/api";
import { ConstellationCanvas } from "@/components/canvas/ConstellationCanvas";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { CalendarDayFlip } from "@/components/calendar/CalendarDayFlip";
import { TakeoffTransition } from "@/components/market/TakeoffTransition";
import { ArrowRight, ChevronDown, ChevronUp, Zap, ShieldCheck, Compass } from "lucide-react";
import { useTour } from "@/context/TourContext";

export default function HomePage() {
  const [hasStarted, setHasStarted] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);
  const [takeoffOpen, setTakeoffOpen] = useState(false);
  const { startTour } = useTour();

  const { data: sentiment } = useQuery<SentimentSnapshot>({
    queryKey: ["todaySentiment"],
    queryFn: api.getTodaySentiment,
  });

  if (!hasStarted) {
    return <ConstellationCanvas onTransitionComplete={() => setHasStarted(true)} />;
  }

  const atmosphereScore = sentiment?.composite_score || 63;
  const atmosphereName = sentiment?.atmosphere || "UNCERTAIN";

  return (
    <div className="max-w-4xl mx-auto pt-6 pb-24 px-4">
      {/* Plane Takeoff Transition Overlay */}
      <TakeoffTransition isOpen={takeoffOpen} onClose={() => setTakeoffOpen(false)} />

      <Breadcrumb
        section="TODAY"
        observation="Atmosphere"
        stepIndex="01 / 04"
        lessonNarrative="Reading the environmental state of the market before acting."
      />

      {/* Narrative Opening */}
      <section className="mt-8 mb-12 space-y-4">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-lucid-stone">
          Good Evening · Observatory Status
        </span>
        <h1 className="font-editorial text-4xl md:text-6xl text-lucid-bone font-normal leading-tight">
          The market is unsettled.
        </h1>
        <p className="text-lg md:text-xl text-lucid-stone max-w-xl font-light">
          You don&apos;t need to act. <br />
          You can understand it first.
        </p>

        <div className="pt-4 flex flex-wrap items-center gap-2.5 sm:gap-4">
          <Link
            href="/room"
            className="w-full sm:w-auto text-center px-6 py-3 rounded-full bg-lucid-oxide text-lucid-ink hover:bg-[#D47952] transition-colors font-mono text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2"
          >
            <span>See Why</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => setTakeoffOpen(true)}
            className="w-full sm:w-auto text-center px-6 py-3 rounded-full bg-[#00F5A0] text-black hover:bg-[#3bfdb9] transition-all font-mono text-xs uppercase tracking-widest font-black flex items-center justify-center gap-2 shadow-[0_0_18px_rgba(0,245,160,0.35)] hover:scale-105"
          >
            <Zap className="w-3.5 h-3.5 fill-black" />
            <span>LET&apos;S GO TO THE MARKET</span>
          </button>

          <Link
            href="/see"
            className="flex-1 sm:flex-initial text-center px-5 py-3 rounded-full border border-lucid-border bg-lucid-ash text-lucid-bone hover:border-lucid-stone transition-colors font-mono text-xs uppercase tracking-widest"
          >
            Explore Concepts
          </Link>

          <button
            onClick={() => startTour(0)}
            className="flex-1 sm:flex-initial text-center px-5 py-3 rounded-full border border-[#00F5A0]/40 bg-[#0B1522] text-[#00F5A0] hover:bg-[#00F5A0] hover:text-black transition-all font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,245,160,0.15)]"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Guided Walkaround</span>
          </button>
        </div>
      </section>

      {/* THE PROMINENT MARKET FLOOR FLIGHT LAUNCHPAD */}
      <div className="mb-12 p-4 sm:p-6 md:p-8 rounded-2xl bg-gradient-to-r from-[#0c121d] via-[#080d16] to-[#05080f] border-2 border-[#00F5A0]/40 shadow-[0_10px_35px_rgba(0,245,160,0.12)] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden group">
        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00F5A0] animate-ping" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#00F5A0] font-bold">
              [ FLIGHT DECK ACTIVE · HIGH VELOCITY ]
            </span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-white font-bold">
            Takeoff to the Living Market Floor
          </h2>
          <p className="text-xs text-gray-400 font-sans max-w-xl leading-relaxed">
            Transition from the calm observatory into the cyber-terminal trading floor. Live dual-band ticker tapes, multi-timeframe candle envelopes, and authentic Daily Prophet broadsheet dispatches.
          </p>
        </div>

        <div className="relative z-10">
          <button
            onClick={() => setTakeoffOpen(true)}
            className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-[#00F5A0] text-black font-mono text-xs font-black uppercase tracking-widest hover:bg-[#3bfdb9] transition-all shadow-[0_0_20px_rgba(0,245,160,0.4)] hover:scale-105 flex items-center justify-center gap-3 select-none cursor-pointer"
          >
            <span>ACCELERATE TO FLOOR</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PHASE 7: THE INVESTMENT INTEGRITY ENGINE CARD */}
      <div className="mb-12 p-4 sm:p-6 md:p-8 rounded-2xl bg-gradient-to-r from-[#070D18] via-[#091222] to-[#060A14] border border-[#1E304B] shadow-[0_10px_35px_rgba(30,48,75,0.3)] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden group">
        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00F5A0]" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#00F5A0] font-bold">
              [ PHASE 7 ACTIVE · CAPITAL TRANSPARENCY ]
            </span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-white font-bold">
            The Investment Integrity Engine
          </h2>
          <p className="text-xs text-gray-400 font-sans max-w-xl leading-relaxed">
            Multi-tier business activity and subsidiary screening (AAOIFI, DJIM, FTSE, MSCI), the interactive Capital Trail graph, 4-quarter balance sheet drift monitoring, and independent dividend purification calculator.
          </p>
        </div>

        <div className="relative z-10">
          <Link
            href="/integrity"
            className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-[#132035] border border-[#00F5A0]/40 text-[#00F5A0] font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#00F5A0] hover:text-black transition-all shadow-[0_0_20px_rgba(0,245,160,0.15)] flex items-center justify-center gap-3"
          >
            <span>AUDIT CAPITAL TRAIL</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* TACTILE ARCHIVAL CALENDAR DAY-FLIPPER */}
      <div className="mb-12">
        <CalendarDayFlip />
      </div>

      {/* TODAY'S ATMOSPHERE CARD (Design Spec 01 & 10) */}
      <div className="w-full rounded-2xl bg-lucid-ash border border-lucid-border p-6 md:p-10 mb-16 shadow-2xl relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-lucid-oxide/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-lucid-border/50">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-lucid-stone">
              Today&apos;s Atmosphere
            </span>
            <div className="flex items-baseline gap-4 mt-2">
              <span className="font-editorial text-7xl md:text-8xl text-lucid-bone font-normal">
                {atmosphereScore}
              </span>
              <span className="font-mono text-xl uppercase tracking-widest text-lucid-oxide font-medium">
                {atmosphereName}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono text-lucid-stone max-w-xs">
            <div className="flex items-center justify-between border-b border-lucid-border/40 pb-1">
              <span>Volatility</span>
              <span className="text-lucid-ember font-bold">↑ 21.5</span>
            </div>
            <div className="flex items-center justify-between border-b border-lucid-border/40 pb-1">
              <span>Credit Stress</span>
              <span className="text-lucid-stone font-bold">→ 4.8%</span>
            </div>
            <div className="flex items-center justify-between border-b border-lucid-border/40 pb-1">
              <span>Breadth</span>
              <span className="text-lucid-ember font-bold">↓ 48%</span>
            </div>
            <div className="flex items-center justify-between border-b border-lucid-border/40 pb-1">
              <span>Safe-Haven</span>
              <span className="text-lucid-moss font-bold">↑ 0.15</span>
            </div>
          </div>
        </div>

        {/* Narrative Synthesis */}
        <div className="pt-6">
          <p className="text-sm md:text-base text-lucid-bone font-light leading-relaxed mb-6">
            {sentiment?.narrative ||
              "Volatility has risen without a matching collapse in market breadth. Three independent public signals are pulling together: options hedging is elevated, while high-yield credit conditions remain stable."}
          </p>

          <button
            onClick={() => setWhyOpen(!whyOpen)}
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-lucid-oxide hover:text-[#E2835C] transition-colors"
          >
            <span>{whyOpen ? "Hide Evidence Layers" : "Why does it feel tense? (3 Evidence Layers)"}</span>
            {whyOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Accordion Fold: 3 Evidence Layers (Design Spec 13) */}
        {whyOpen && (
          <div className="mt-6 pt-6 border-t border-lucid-border/60 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
            <div className="p-4 rounded-xl bg-lucid-ink/70 border border-lucid-border/40">
              <div className="flex items-center justify-between text-xs font-mono text-lucid-stone mb-2">
                <span>01 · VOLATILITY</span>
                <span className="text-lucid-ember font-bold">↑ 18%</span>
              </div>
              <p className="text-xs text-lucid-bone font-light leading-relaxed">
                Markets are pricing larger near-term price movement across S&P 500 options contracts.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-lucid-ink/70 border border-lucid-border/40">
              <div className="flex items-center justify-between text-xs font-mono text-lucid-stone mb-2">
                <span>02 · CREDIT</span>
                <span className="text-lucid-stone font-bold">→ STABLE</span>
              </div>
              <p className="text-xs text-lucid-bone font-light leading-relaxed">
                Riskier corporate borrowing conditions have widened slightly but show zero systemic contagion.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-lucid-ink/70 border border-lucid-border/40">
              <div className="flex items-center justify-between text-xs font-mono text-lucid-stone mb-2">
                <span>03 · BREADTH</span>
                <span className="text-lucid-ember font-bold">↓ 48%</span>
              </div>
              <p className="text-xs text-lucid-bone font-light leading-relaxed">
                Fewer individual stocks are participating in the market advance; index is held by mega-caps.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* THE THREE CORE QUESTIONS (Design Spec 10) */}
      <section className="space-y-12">
        <h2 className="font-editorial text-2xl md:text-3xl text-lucid-bone font-normal">
          Three questions for today
        </h2>

        {/* Question 1 */}
        <div className="p-6 md:p-8 rounded-2xl bg-lucid-ash/60 border border-lucid-border/60 hover:border-lucid-border transition-colors">
          <div className="flex items-center justify-between text-xs font-mono text-lucid-stone mb-2">
            <span>QUESTION 1</span>
            <span className="text-lucid-oxide">WHAT SHOULD I NOTICE?</span>
          </div>
          <p className="font-editorial text-2xl text-lucid-bone font-normal mb-2">
            Volatility has risen without a matching collapse in market breadth.
          </p>
          <p className="text-sm text-lucid-stone font-light max-w-2xl mb-6">
            When volatility spikes alone, it usually indicates transient headline fear. When it spikes alongside high-yield credit distress and severe breadth decay, systemic caution is warranted.
          </p>
          <Link
            href="/room"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-lucid-bone hover:text-lucid-oxide transition-colors"
          >
            <span>Explore The 5-Signal Radial Field</span>
            <span>→</span>
          </Link>
        </div>

        {/* Question 2 */}
        <div className="p-6 md:p-8 rounded-2xl bg-lucid-ash/60 border border-lucid-border/60 hover:border-lucid-border transition-colors">
          <div className="flex items-center justify-between text-xs font-mono text-lucid-stone mb-2">
            <span>QUESTION 2</span>
            <span className="text-lucid-moss">WHAT CAN I EXPLORE?</span>
          </div>
          <p className="font-editorial text-2xl text-lucid-bone font-normal mb-2">
            Your Thread: Risk & Return
          </p>
          <p className="text-sm text-lucid-stone font-light max-w-2xl mb-6">
            Last time, you observed that dragging expected return upward widened the outcome distribution into uncertainty. Continue your journey into Diversification to see how independent paths calm that dispersion.
          </p>
          <Link
            href="/see?concept=diversification"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-lucid-bone hover:text-lucid-moss transition-colors"
          >
            <span>Continue To Diversification Studio</span>
            <span>→</span>
          </Link>
        </div>

        {/* Question 3 */}
        <div className="p-6 md:p-8 rounded-2xl bg-lucid-ash/60 border border-lucid-border/60 hover:border-lucid-border transition-colors">
          <div className="flex items-center justify-between text-xs font-mono text-lucid-stone mb-2">
            <span>QUESTION 3</span>
            <span className="text-lucid-dust">WHAT DID I LEARN FROM MY LAST DECISION?</span>
          </div>
          <p className="font-editorial text-2xl text-lucid-bone font-normal mb-2">
            You entered after sentiment had already reached elevated optimism.
          </p>
          <p className="text-sm text-lucid-stone font-light max-w-2xl mb-6">
            In your Behavioral Mirror, simulated decisions plotted against historical market mood reveal that 2 of your entries occurred during euphoria peaks. No judgment — just an invitation to reflect.
          </p>
          <Link
            href="/trace"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-lucid-bone hover:text-lucid-dust transition-colors"
          >
            <span>Open Behavioral Mirror (Trace)</span>
            <span>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
