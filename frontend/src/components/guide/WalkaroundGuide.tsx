"use client";

import React, { useState, useEffect } from "react";
import { useTour } from "@/context/TourContext";
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle,
  Sparkles,
  Layers,
  FastForward
} from "lucide-react";

export const WalkaroundGuide: React.FC = () => {
  const {
    isOpen,
    currentStep,
    showInitialPrompt,
    startTour,
    closeTour,
    nextStep,
    prevStep,
    goToStep,
    dismissInitialPrompt,
    tourChapters,
  } = useTour();

  const chapter = tourChapters[currentStep];

  // Typewriter effect state
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!isOpen || !chapter) return;

    setDisplayedText("");
    setIsTyping(true);

    const fullText = chapter.explanation;
    let charIndex = 0;

    const timer = setInterval(() => {
      if (charIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, charIndex + 1));
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isOpen, currentStep, chapter]);

  const handleSkipTyping = () => {
    if (chapter) {
      setDisplayedText(chapter.explanation);
      setIsTyping(false);
    }
  };

  // 1. Initial Launch Invitation Modal
  if (showInitialPrompt && !isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 max-w-md w-full p-5 rounded-2xl bg-[#0B0F19]/95 backdrop-blur-xl border-2 border-[#00F5A0]/50 shadow-[0_15px_45px_rgba(0,0,0,0.8)] space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-300">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00F5A0] animate-ping" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#00F5A0] font-bold">
              OBSERVATORY ORIENTATION
            </span>
          </div>
          <button
            onClick={dismissInitialPrompt}
            className="text-gray-400 hover:text-white transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1.5">
          <h3 className="font-serif text-lg text-white font-bold tracking-wide">
            Welcome to LUCID Observatory
          </h3>
          <p className="text-xs text-gray-300 font-sans leading-relaxed">
            Would you like an interactive walkaround tour? We will guide you visually through the Observatory Atmosphere, Living Market Floor, Investment Integrity Engine, and Practice Arena with animated commentary.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={() => startTour(0)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#00F5A0] text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#3bfdb9] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,245,160,0.3)]"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Start Guided Tour</span>
          </button>
          <button
            onClick={dismissInitialPrompt}
            className="px-4 py-2.5 rounded-xl bg-[#141B28] text-gray-400 font-mono text-xs hover:text-white hover:bg-[#1A2436] transition-colors border border-[#202C40]"
          >
            Explore Alone
          </button>
        </div>
      </div>
    );
  }

  // 2. Main Interactive Walkaround Guide Deck
  if (!isOpen || !chapter) return null;

  const isLast = currentStep === tourChapters.length - 1;

  return (
    <div className="fixed inset-x-4 bottom-6 md:inset-x-auto md:right-8 md:bottom-8 z-50 md:max-w-2xl w-full">
      <div className="rounded-2xl bg-[#080D16]/95 backdrop-blur-2xl border-2 border-[#00F5A0]/60 shadow-[0_20px_60px_rgba(0,0,0,0.9)] p-6 space-y-5">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between gap-3 border-b border-[#18263D] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00F5A0] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#00F5A0] font-bold">
              CHAPTER {chapter.number} / 06
            </span>
            <span className="text-gray-500">·</span>
            <span className="text-[11px] font-mono text-[#D4AF37] px-2 py-0.5 rounded bg-[#1A2536] border border-[#D4AF37]/30">
              {chapter.tag}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gray-400 bg-[#0F1827] px-2.5 py-1 rounded border border-[#1E2D44]">
              Viewing: <strong className="text-white">{chapter.route}</strong>
            </span>
            <button
              onClick={closeTour}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#162235] transition-colors"
              title="Exit Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feature Title & Subtitle */}
        <div className="space-y-1">
          <h2 className="text-xl font-serif font-bold text-white tracking-wide">
            {chapter.title}
          </h2>
          <p className="text-xs font-mono text-[#00F5A0]">
            Feature: {chapter.featureName}
          </p>
        </div>

        {/* Animated Typewriter Explanation Box */}
        <div className="relative p-4 rounded-xl bg-[#04070D] border border-[#141F33] space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 uppercase">
            <span>OBSERVATORY TRANSMISSION</span>
            {isTyping && (
              <button
                onClick={handleSkipTyping}
                className="text-[#00F5A0] hover:underline flex items-center gap-1"
              >
                <FastForward className="w-3 h-3" />
                <span>Skip Typing</span>
              </button>
            )}
          </div>
          <p className="text-xs md:text-sm text-gray-200 font-sans leading-relaxed min-h-[64px]">
            {displayedText}
            {isTyping && (
              <span className="inline-block w-1.5 h-4 bg-[#00F5A0] ml-1 animate-pulse align-middle" />
            )}
          </p>
        </div>

        {/* How to Use This Feature (Actionable Checklist) */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400 font-bold flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-[#D4AF37]" />
            How to Use This Inside LUCID:
          </span>
          <div className="space-y-1.5">
            {chapter.howToUse.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-gray-300 font-sans">
                <CheckCircle className="w-3.5 h-3.5 text-[#00F5A0] mt-0.5 shrink-0" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Educational Takeaway */}
        <div className="p-3 rounded-xl bg-[#0A1322] border border-[#1A2E4C] flex items-start gap-2.5 text-xs text-[#93C5FD]">
          <Sparkles className="w-4 h-4 text-[#00F5A0] shrink-0 mt-0.5" />
          <p className="font-sans leading-relaxed">
            <strong className="text-white font-mono uppercase text-[11px]">Core Philosophy: </strong>
            {chapter.takeaway}
          </p>
        </div>

        {/* Chapter Quick Jump Tabs */}
        <div className="grid grid-cols-6 gap-1.5 pt-1 border-t border-[#16243A]">
          {tourChapters.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => goToStep(idx)}
              className={`py-1.5 rounded-lg text-center font-mono text-[10px] transition-all ${
                currentStep === idx
                  ? "bg-[#00F5A0] text-black font-bold shadow-[0_0_10px_rgba(0,245,160,0.3)]"
                  : "bg-[#0B111D] text-gray-400 hover:text-white border border-[#172439]"
              }`}
            >
              CH 0{idx + 1}
            </button>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
              currentStep === 0
                ? "text-gray-600 bg-[#0B101A] border border-[#151F30] cursor-not-allowed"
                : "text-gray-300 bg-[#101726] border border-[#1D2B42] hover:bg-[#172238] hover:text-white"
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            onClick={nextStep}
            className="px-6 py-2.5 rounded-xl bg-[#00F5A0] text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#3bfdb9] transition-all flex items-center gap-2 shadow-[0_0_18px_rgba(0,245,160,0.35)]"
          >
            <span>{isLast ? "Complete Tour" : "Next Chapter"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
