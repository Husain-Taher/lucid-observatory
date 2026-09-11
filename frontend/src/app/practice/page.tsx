"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { api, ClaimInvestigation, CounterfactualData } from "@/lib/api";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";

export default function PracticePage() {
  const [claimInput, setClaimInput] = useState("AI stocks and physical gold are guaranteed to outperform all assets over the next 5 years.");
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [investigation, setInvestigation] = useState<ClaimInvestigation | null>(null);
  const [showUncomfortable, setShowUncomfortable] = useState(false);

  // Thesis Editor State
  const [actionChoice, setActionChoice] = useState<"BUY" | "WAIT" | "PASS" | null>(null);
  const [thesisText, setThesisText] = useState("");
  const [falsificationText, setFalsificationText] = useState("");
  const [confidence, setConfidence] = useState<"UNSURE" | "SOMEWHAT" | "CONFIDENT">("SOMEWHAT");
  const [simulationStep, setSimulationStep] = useState<"input" | "thesis" | "simulated">("input");
  const [timelineDay, setTimelineDay] = useState<number>(14);

  // Fetch Counterfactual Trajectory
  const { data: counterfactualData } = useQuery<CounterfactualData>({
    queryKey: ["counterfactual", actionChoice],
    queryFn: () => api.getCounterfactualTrajectory(actionChoice || "BUY", "SPY"),
    enabled: !!actionChoice && simulationStep === "simulated",
  });

  const handleInvestigate = async () => {
    if (!claimInput.trim()) return;
    setIsInvestigating(true);
    try {
      const res = await api.submitClaim(claimInput);
      setInvestigation(res);
      setSimulationStep("input");
    } catch (e) {
      console.error(e);
    } finally {
      setIsInvestigating(false);
    }
  };

  const handleLogThesisAndSimulate = async () => {
    if (!actionChoice || !thesisText || !falsificationText) return;
    try {
      await api.submitDecision({
        claim_id: investigation?.claim_id,
        ticker: investigation?.deconstructed.subject.replace("$", "") || "SPY",
        action: actionChoice,
        thesis: thesisText,
        falsification_criteria: falsificationText,
        confidence_level: confidence,
        time_horizon: "30d",
      });
      setSimulationStep("simulated");
    } catch (e) {
      console.error(e);
    }
  };

  const activePoint = counterfactualData?.trajectory.find((p) => p.day === timelineDay) || {
    day: timelineDay,
    user_return_pct: actionChoice === "WAIT" ? 0.0 : -3.5,
    fomo_chaser_pct: -6.3,
    benchmark_pct: 1.2,
    reflection: "Under trailing market variance, waiting bypassed the initial drawdown dip.",
  };

  return (
    <div className="max-w-4xl mx-auto pt-6 pb-28 px-4">
      <Breadcrumb
        section="PRACTICE"
        observation="Claim Investigation & Paper Trade"
        stepIndex="03 / 04"
        lessonNarrative="Investigate the claim. Review real live publisher news. Test what you believe with zero capital risk."
      />

      {/* Header */}
      <section className="mt-8 mb-10">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-lucid-stone">
          Pillar 03 · Epistemological Practice Loop
        </span>
        <h1 className="font-editorial text-4xl md:text-5xl text-lucid-bone font-normal mt-2">
          I Saw Something.
        </h1>
        <p className="text-sm md:text-base text-lucid-stone font-light max-w-xl mt-2">
          Paste a financial claim you encountered online. We&apos;ll deconstruct its rhetoric and cross-reference real verified news before you decide what to believe.
        </p>
      </section>

      {/* CLAIM INPUT SURFACE */}
      <div className="p-6 md:p-8 rounded-3xl bg-lucid-ash border border-lucid-border shadow-2xl mb-12">
        <textarea
          rows={3}
          value={claimInput}
          onChange={(e) => setClaimInput(e.target.value)}
          placeholder="e.g. AI stocks and physical gold are guaranteed to double your net worth within 2 years..."
          className="w-full bg-transparent text-lg md:text-xl font-editorial text-lucid-bone placeholder:text-lucid-stone/40 border-none focus:outline-none resize-none"
        />

        <div className="flex items-center justify-between pt-4 border-t border-lucid-border/50 flex-wrap gap-4">
          <span className="text-[11px] font-mono text-lucid-stone">
            Syntactic Decomposition + Fact-vs-Hype ML + Real Verified News Context
          </span>
          <button
            onClick={handleInvestigate}
            disabled={isInvestigating}
            className="px-6 py-2.5 rounded-full bg-lucid-oxide text-lucid-ink hover:bg-[#D47952] transition-colors font-mono text-xs uppercase tracking-widest font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isInvestigating ? (
              <span>CROSS-REFERENCING...</span>
            ) : (
              <>
                <span>Investigate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* DECONSTRUCTION & REAL NEWS EVIDENCE */}
      {investigation && (
        <div className="space-y-12 animate-in fade-in duration-500">
          {/* Syntactic Pills */}
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-lucid-stone block mb-4">
              01 · SYNTACTIC DECONSTRUCTION
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-lucid-ash border border-lucid-border">
                <span className="text-[10px] text-lucid-stone block">SUBJECT</span>
                <span className="text-lucid-bone font-medium">{investigation.deconstructed.subject}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-lucid-ash border border-lucid-border">
                <span className="text-[10px] text-lucid-stone block">TRAJECTORY</span>
                <span className="text-lucid-bone font-medium">{investigation.deconstructed.claim_type}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-lucid-ash border border-lucid-border">
                <span className="text-[10px] text-lucid-stone block">HORIZON</span>
                <span className="text-lucid-bone font-medium">{investigation.deconstructed.time_horizon}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-lucid-ash border border-lucid-border">
                <span className="text-[10px] text-lucid-stone block">BENCHMARK</span>
                <span className="text-lucid-bone font-medium">{investigation.deconstructed.comparison}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-lucid-ash border border-lucid-border">
                <span className="text-[10px] text-lucid-stone block">CERTAINTY</span>
                <span className={`font-semibold ${investigation.deconstructed.certainty === "HIGH" || investigation.deconstructed.certainty === "EXTREME" ? "text-lucid-ember" : "text-lucid-bone"}`}>
                  {investigation.deconstructed.certainty}
                </span>
              </div>
            </div>
          </div>

          {/* GROUND-TRUTH & WHAT THE NEWS ACTUALLY MEANS */}
          <div className="p-6 md:p-8 rounded-3xl bg-lucid-ink border border-lucid-border/80 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-lucid-oxide" />
                <span className="font-mono text-xs text-lucid-bone uppercase tracking-widest font-semibold">
                  Ground-Truth Reality Scanner
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-lucid-stone">Grounding Rigor:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-lucid-ash border border-lucid-border text-lucid-moss font-bold">
                  {investigation.grounding_score || 75}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-[10px] text-lucid-stone uppercase tracking-wider block">
                WHAT THE CLAIM ACTUALLY MEANS (STRIPPING THE HYPE)
              </span>
              <p className="font-editorial text-xl md:text-2xl text-lucid-bone leading-snug">
                {investigation.what_it_actually_means ||
                  "The claim asserts guaranteed outperformance. In liquid financial markets, expected return is accompanied by an expanded volatility envelope."}
              </p>
            </div>
          </div>

          {/* REAL LIVE NEWS FEED (ZERO FAKE DATA) */}
          {investigation.real_news_context && investigation.real_news_context.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-lucid-stone block">
                  02 · VERIFIED LIVE NEWS ARTICLES (ZERO FAKE DATA)
                </span>
                <span className="text-[10px] font-mono text-lucid-stone/70">
                  Direct Live Ingestion via Yahoo Finance
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {investigation.real_news_context.map((art, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-lucid-ash border border-lucid-border/80 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono text-lucid-stone">
                        <span className="font-semibold text-lucid-bone">{art.publisher}</span>
                        <span className={`px-2 py-0.5 rounded ${art.classification === "OBJECTIVE_EVENT" ? "bg-lucid-moss/20 text-lucid-moss" : "bg-lucid-ember/20 text-lucid-ember"}`}>
                          {art.classification.replace("_", " ")}
                        </span>
                      </div>
                      <h4 className="font-editorial text-lg text-lucid-bone leading-snug">
                        {art.title}
                      </h4>
                      {art.summary && (
                        <p className="text-xs text-lucid-stone font-light line-clamp-2">
                          {art.summary}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-lucid-border/40 flex items-center justify-between text-xs font-mono">
                      <span className="text-[10px] text-lucid-stone">Substance: {art.substance_score}%</span>
                      {art.url && (
                        <a
                          href={art.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-lucid-oxide hover:underline text-[11px]"
                        >
                          <span>Read Source</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EVIDENCE STACK */}
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-lucid-stone block">
              03 · PROGRESSIVE EVIDENCE STACK
            </span>
            <div className="space-y-3 font-mono text-xs">
              {investigation.evidence_stack.map((layer, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-lucid-ash border border-lucid-border flex items-start gap-4">
                  <span className="w-2 h-2 rounded-full bg-lucid-oxide mt-1.5 flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-lucid-stone">
                      <span>{layer.factor_name}</span>
                      <span className="text-lucid-bone font-bold">{layer.strength} STRENGTH</span>
                    </div>
                    <p className="text-lucid-bone font-medium">{layer.factor_finding}</p>
                    <p className="text-lucid-stone text-[11px] font-light leading-relaxed">{layer.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* UNCOMFORTABLE TRUTH DRAWER */}
          <div className="p-6 rounded-2xl bg-lucid-ink border border-lucid-border/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-lucid-stone">
                UNCOMFORTABLE TRUTH
              </span>
              <button
                onClick={() => setShowUncomfortable(!showUncomfortable)}
                className="text-xs font-mono text-lucid-oxide hover:underline cursor-pointer"
              >
                {showUncomfortable ? "Hide" : "Show me the uncomfortable part"}
              </button>
            </div>
            {showUncomfortable && (
              <p className="font-editorial text-lg text-lucid-bone leading-relaxed animate-in fade-in">
                {investigation.uncomfortable_truth}
              </p>
            )}
          </div>

          {/* DECISION LOOP: EQUAL WEIGHTING (BUY / WAIT / PASS) */}
          <div className="p-8 rounded-3xl bg-lucid-ash border border-lucid-border space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-lucid-stone block">
              04 · THE DECISION LOOP (EQUAL WEIGHTING)
            </span>
            <h2 className="font-editorial text-3xl text-lucid-bone font-normal">
              You&apos;ve investigated the claim. What would you do?
            </h2>

            <div className="grid grid-cols-3 gap-4">
              {(["BUY", "WAIT", "PASS"] as const).map((action) => (
                <button
                  key={action}
                  onClick={() => {
                    setActionChoice(action);
                    setSimulationStep("thesis");
                  }}
                  className={`py-4 rounded-2xl font-mono text-sm uppercase tracking-widest border transition-all ${
                    actionChoice === action
                      ? "bg-lucid-oxide text-lucid-ink font-bold border-lucid-oxide shadow-lg"
                      : "bg-lucid-ink border-lucid-border text-lucid-bone hover:border-lucid-stone"
                  }`}
                >
                  {action}
                </button>
              ))}
            </div>

            {/* THESIS EDITOR */}
            {simulationStep === "thesis" && (
              <div className="pt-6 border-t border-lucid-border/50 space-y-4 animate-in fade-in">
                <div>
                  <label className="block text-xs font-mono text-lucid-stone uppercase tracking-widest mb-1">
                    WHY? In your own words, what makes you believe this decision is reasonable?
                  </label>
                  <textarea
                    rows={2}
                    value={thesisText}
                    onChange={(e) => setThesisText(e.target.value)}
                    placeholder="e.g. Current credit spreads are elevated and historical drawdowns suggest patience..."
                    className="w-full bg-lucid-ink p-3 rounded-xl border border-lucid-border text-sm text-lucid-bone focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-lucid-stone uppercase tracking-widest mb-1">
                    FALSIFICATION: What observable evidence would prove you wrong?
                  </label>
                  <input
                    value={falsificationText}
                    onChange={(e) => setFalsificationText(e.target.value)}
                    placeholder="e.g. If credit spreads compress below 3.5% alongside expanding breadth..."
                    className="w-full bg-lucid-ink p-3 rounded-xl border border-lucid-border text-sm text-lucid-bone focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 flex-wrap gap-4">
                  <div className="flex items-center gap-4 text-xs font-mono text-lucid-stone">
                    <span>CONFIDENCE:</span>
                    {(["UNSURE", "SOMEWHAT", "CONFIDENT"] as const).map((c) => (
                      <button
                        key={c}
                        onClick={() => setConfidence(c)}
                        className={`px-3 py-1 rounded-full border text-[10px] ${
                          confidence === c
                            ? "bg-lucid-bone text-lucid-ink font-bold border-lucid-bone"
                            : "border-lucid-border text-lucid-stone"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleLogThesisAndSimulate}
                    className="px-6 py-2.5 rounded-full bg-lucid-bone text-lucid-ink hover:bg-white transition-colors font-mono text-xs uppercase tracking-widest font-semibold"
                  >
                    Simulate & Advance Time →
                  </button>
                </div>
              </div>
            )}

            {/* 90-DAY INTERACTIVE COUNTERFACTUAL REPLAY */}
            {simulationStep === "simulated" && (
              <div className="p-6 md:p-8 rounded-2xl bg-lucid-ink border border-lucid-border/80 space-y-6 animate-in fade-in">
                <div className="flex items-center justify-between text-xs font-mono text-lucid-stone">
                  <span className="text-lucid-moss font-bold">✓ IMMUTABLE THESIS LOGGED</span>
                  <span>DECISION: {actionChoice}</span>
                </div>

                <div className="p-4 rounded-xl bg-lucid-ash border border-lucid-border/50">
                  <span className="text-[10px] font-mono text-lucid-stone block">YOUR STATED THESIS</span>
                  <p className="font-editorial text-lg text-lucid-bone">&ldquo;{thesisText}&rdquo;</p>
                </div>

                {/* Day Stepper */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono text-lucid-stone">
                    <span>ADVANCE COUNTERFACTUAL TIME</span>
                    <span className="text-lucid-oxide font-bold">DAY {timelineDay} OF 90</span>
                  </div>
                  <div className="flex gap-2 font-mono text-xs">
                    {[1, 7, 14, 30, 60, 90].map((d) => (
                      <button
                        key={d}
                        onClick={() => setTimelineDay(d)}
                        className={`flex-1 py-2 rounded-lg border transition-all ${
                          timelineDay === d
                            ? "bg-lucid-oxide text-lucid-ink font-bold border-lucid-oxide"
                            : "bg-lucid-ash border-lucid-border text-lucid-stone"
                        }`}
                      >
                        Day {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Multi-Path Outcome SVG Chart */}
                <div className="py-4">
                  <svg viewBox="0 0 800 180" className="w-full h-44 overflow-visible">
                    <line x1="0" y1="90" x2="800" y2="90" stroke="#71808A" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

                    {/* FOMO Chaser Path (Red dashed line) */}
                    <path
                      d="M 0 90 Q 200 150 400 140 T 800 120"
                      fill="none"
                      stroke="#B84C45"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />

                    {/* Benchmark Path (Gray solid line) */}
                    <path
                      d="M 0 90 Q 300 80 500 75 T 800 65"
                      fill="none"
                      stroke="#9A988F"
                      strokeWidth="1.5"
                    />

                    {/* User Path */}
                    <path
                      d={
                        actionChoice === "WAIT"
                          ? "M 0 90 L 200 90 Q 400 70 800 55"
                          : actionChoice === "PASS"
                          ? "M 0 90 L 800 90"
                          : "M 0 90 Q 200 135 400 120 T 800 100"
                      }
                      fill="none"
                      stroke={actionChoice === "PASS" ? "#E9E5DA" : "#89956A"}
                      strokeWidth="3"
                    />

                    {/* Current Scrubber Dot */}
                    {(() => {
                      const x = (timelineDay / 90) * 800;
                      const y = 90 - (activePoint.user_return_pct * 8);
                      return (
                        <circle cx={x} cy={Math.max(15, Math.min(165, y))} r="6" fill="#89956A" className="animate-pulse" />
                      );
                    })()}
                  </svg>

                  <div className="flex justify-between items-center text-[10px] font-mono text-lucid-stone pt-2">
                    <span className="text-lucid-moss font-bold">● Your Path ({activePoint.user_return_pct >= 0 ? `+${activePoint.user_return_pct}%` : `${activePoint.user_return_pct}%`})</span>
                    <span className="text-lucid-ember">--- Peak FOMO Chaser ({activePoint.fomo_chaser_pct}%)</span>
                    <span>— Market Benchmark (+{activePoint.benchmark_pct}%)</span>
                  </div>
                </div>

                {/* Counterfactual Insight */}
                <div className="p-4 rounded-xl bg-lucid-ash border border-lucid-border/50 text-xs text-lucid-stone leading-relaxed space-y-1">
                  <span className="font-mono text-lucid-bone block font-bold">
                    DAY {timelineDay} OBSERVATION:
                  </span>
                  <p>{activePoint.reflection}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
