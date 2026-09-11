"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { api, BehavioralMirrorData } from "@/lib/api";

export default function TracePage() {
  const { data: mirror } = useQuery<BehavioralMirrorData>({
    queryKey: ["behavioralMirror"],
    queryFn: api.getBehavioralPatterns,
  });

  const flags = mirror?.behavioral_flags || [
    {
      pattern_type: "SENTIMENT_CHASING",
      observation: "You entered after sentiment had already become highly optimistic.",
      frequency: "This is the second time you've entered during a strong optimism spike.",
      severity: "REFLECT",
    },
    {
      pattern_type: "PATIENT_FILTER",
      observation: "You exercised patience by choosing to WAIT or PASS after investigating evidence.",
      frequency: "2 of your last 3 investigations led to deliberate inaction.",
      severity: "NOTICE",
    },
  ];

  const emotionalBeta = mirror?.rolling_emotional_beta ?? 0.42;
  const patiencePct = Math.round((mirror?.patience_ratio ?? 0.67) * 100);
  const fomoPct = Math.round((mirror?.fomo_chasing_ratio ?? 0.25) * 100);

  return (
    <div className="max-w-4xl mx-auto pt-6 pb-28 px-4">
      <Breadcrumb
        section="TRACE"
        observation="Behavioral Mirror"
        stepIndex="04 / 04"
        lessonNarrative="No scores. No shame. Just observing your own decision patterns over time."
      />

      {/* Header */}
      <section className="mt-8 mb-10">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-lucid-stone">
          Pillar 04 · The Behavioral Mirror
        </span>
        <h1 className="font-editorial text-4xl md:text-5xl text-lucid-bone font-normal mt-2">
          Your Decision Thread
        </h1>
        <p className="text-sm md:text-base text-lucid-stone font-light max-w-xl mt-2">
          Lucid reflects your choices back to you against market atmosphere and price history. Learning is reflection, not judgment.
        </p>
      </section>

      {/* QUANTITATIVE BEHAVIORAL PROFILE GAUGES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        <div className="p-6 rounded-2xl bg-lucid-ash border border-lucid-border space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-lucid-stone">
            <span>ROLLING EMOTIONAL BETA</span>
            <span className="text-lucid-oxide font-bold">{emotionalBeta}</span>
          </div>
          <div className="h-2 w-full bg-lucid-ink rounded-full overflow-hidden">
            <div
              style={{ width: `${Math.min(100, emotionalBeta * 100)}%` }}
              className="h-full bg-lucid-oxide transition-all duration-500"
            />
          </div>
          <span className="text-[10px] font-mono text-lucid-stone block pt-1">
            {emotionalBeta < 0.4 ? "Contrarian / Disciplined entry" : "Moderately correlated with sentiment spikes"}
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-lucid-ash border border-lucid-border space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-lucid-stone">
            <span>PATIENCE FILTER RATIO</span>
            <span className="text-lucid-moss font-bold">{patiencePct}%</span>
          </div>
          <div className="h-2 w-full bg-lucid-ink rounded-full overflow-hidden">
            <div
              style={{ width: `${patiencePct}%` }}
              className="h-full bg-lucid-moss transition-all duration-500"
            />
          </div>
          <span className="text-[10px] font-mono text-lucid-stone block pt-1">
            Chose WAIT or PASS after investigating claims
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-lucid-ash border border-lucid-border space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-lucid-stone">
            <span>FOMO FREQUENCY</span>
            <span className="text-lucid-ember font-bold">{fomoPct}%</span>
          </div>
          <div className="h-2 w-full bg-lucid-ink rounded-full overflow-hidden">
            <div
              style={{ width: `${fomoPct}%` }}
              className="h-full bg-lucid-ember transition-all duration-500"
            />
          </div>
          <span className="text-[10px] font-mono text-lucid-stone block pt-1">
            Entries executed during elevated euphoria
          </span>
        </div>
      </div>

      {/* DECISION OVERLAY TIMELINE */}
      <div className="p-6 md:p-10 rounded-3xl bg-lucid-ash border border-lucid-border shadow-2xl mb-12">
        <div className="flex items-center justify-between pb-6 border-b border-lucid-border/50">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-lucid-stone">
              DECISION TIMING VS. MARKET ATMOSPHERE
            </span>
            <div className="font-editorial text-2xl text-lucid-bone mt-1">
              Historical Overlay
            </div>
          </div>
          <div className="text-xs font-mono text-lucid-stone">
            Trailing 30-Day Window
          </div>
        </div>

        {/* Timeline SVG */}
        <div className="py-8">
          <svg viewBox="0 0 800 200" className="w-full h-52 overflow-visible">
            <path
              d="M 0 140 C 150 160, 250 80, 400 60 C 550 40, 650 110, 800 90"
              fill="none"
              stroke="#E9E5DA"
              strokeWidth="2.5"
            />

            {/* Decision Marker Point */}
            <circle cx="400" cy="60" r="7" fill="#C56A43" />
            <circle cx="400" cy="60" r="14" fill="none" stroke="#C56A43" strokeWidth="1" strokeDasharray="3 3" />

            <text x="400" y="36" textAnchor="middle" fill="#C56A43" fontFamily="monospace" fontSize="11" fontWeight="bold">
              ● YOU ENTERED (BUY)
            </text>
            <line x1="400" y1="42" x2="400" y2="52" stroke="#C56A43" strokeWidth="1" />

            {/* Sentiment Atmosphere Bar at Bottom */}
            <rect x="0" y="180" width="280" height="12" fill="#71808A" opacity="0.4" rx="2" />
            <rect x="280" y="180" width="240" height="12" fill="#C56A43" opacity="0.6" rx="2" />
            <rect x="520" y="180" width="280" height="12" fill="#B84C45" opacity="0.5" rx="2" />

            <text x="140" y="174" textAnchor="middle" fill="#9A988F" fontFamily="monospace" fontSize="9">
              EXPANSIVE
            </text>
            <text x="400" y="174" textAnchor="middle" fill="#C56A43" fontFamily="monospace" fontSize="9" fontWeight="bold">
              EUPHORIC / OPTIMISM SPIKE
            </text>
            <text x="660" y="174" textAnchor="middle" fill="#B84C45" fontFamily="monospace" fontSize="9">
              COMPRESSED / TENSE
            </text>
          </svg>
        </div>

        {/* Narrative Reflection */}
        <div className="p-6 rounded-2xl bg-lucid-ink border border-lucid-border/60">
          <span className="font-mono text-xs text-lucid-stone uppercase tracking-widest block mb-1">
            BEHAVIORAL REFLECTION
          </span>
          <p className="font-editorial text-2xl text-lucid-bone font-normal leading-snug">
            You entered after sentiment had already become highly optimistic.
          </p>
          <p className="text-xs md:text-sm text-lucid-stone font-light mt-2 leading-relaxed">
            Notice that your trade execution coincided with the euphoric atmosphere window, prior to subsequent volatility compression. In professional risk comprehension, recognizing one&apos;s own tendency to act when sentiment peaks is the first step toward disciplined execution.
          </p>
        </div>
      </div>

      {/* BEHAVIORAL PATTERN FLAGS */}
      <section className="space-y-4">
        <h2 className="font-editorial text-2xl text-lucid-bone font-normal">
          Pattern Observations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {flags.map((f, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-lucid-ash border border-lucid-border/70 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-lucid-oxide font-bold">{f.pattern_type.replace("_", " ")}</span>
                <span className="text-lucid-stone text-[10px] border border-lucid-border px-2 py-0.5 rounded">
                  {f.severity}
                </span>
              </div>
              <p className="font-editorial text-lg text-lucid-bone">{f.observation}</p>
              <p className="text-xs text-lucid-stone font-mono">{f.frequency}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LEARNING MAP CONSTELLATION (ALL 7 STUDIOS) */}
      <section className="mt-12 p-8 rounded-3xl bg-lucid-ash border border-lucid-border">
        <span className="text-xs font-mono uppercase tracking-widest text-lucid-stone block mb-2">
          THE LEARNING MAP (NOT A LEADERBOARD)
        </span>
        <h3 className="font-editorial text-2xl text-lucid-bone mb-6">
          Encounters & Mastery
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 font-mono text-xs">
          {[
            { name: "Risk & Return", status: "Explored" },
            { name: "Compounding", status: "Explored" },
            { name: "Diversification", status: "Explored" },
            { name: "Dollar-Cost Averaging", status: "Unlocked" },
            { name: "Inflation Erosion", status: "Unlocked" },
            { name: "Market Cycles", status: "Unlocked" },
            { name: "Jewels, Gold & Silver", status: "Active Live" },
          ].map((node) => (
            <div key={node.name} className="p-4 rounded-xl bg-lucid-ink border border-lucid-border/50 flex flex-col justify-between h-24">
              <span className="text-lucid-bone font-medium leading-tight">{node.name}</span>
              <span className={`text-[10px] font-bold ${node.status === "Active Live" ? "text-lucid-oxide animate-pulse" : "text-lucid-moss"}`}>
                ● {node.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
