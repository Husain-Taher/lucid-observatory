"use client";

import React, { useState } from "react";
import { MagicNewsArticle } from "@/lib/api";

interface EnchantedNewspaperProps {
  articles: MagicNewsArticle[];
  selectedFilter: "ALL" | "GOLD_STRUCTURAL" | "CRIMSON_HYPE";
}

export const EnchantedNewspaper: React.FC<EnchantedNewspaperProps> = ({
  articles,
  selectedFilter,
}) => {
  const [activeArticle, setActiveArticle] = useState<MagicNewsArticle | null>(null);

  const filteredArticles = articles.filter((art) => {
    if (selectedFilter === "ALL") return true;
    return art.highlight_type === selectedFilter;
  });

  return (
    <div className="w-full relative">
      {/* Flying Papers Grid with 3D perspective */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-6"
        style={{ perspective: "1400px" }}
      >
        {filteredArticles.map((article, idx) => {
          const isStructural = article.highlight_type === "GOLD_STRUCTURAL";
          const isHype = article.highlight_type === "CRIMSON_HYPE";

          return (
            <div
              key={article.id || idx}
              onClick={() => setActiveArticle(article)}
              style={{
                transform: `rotateY(${article.float_rotation}deg) rotateZ(${article.float_rotation * 0.5}deg)`,
                animationDelay: `${article.levitation_delay}s`,
              }}
              className={`group relative cursor-pointer transition-all duration-500 hover:scale-105 hover:z-30 hover:rotate-0 animate-levitate rounded-lg p-6 flex flex-col justify-between select-none ${
                isStructural
                  ? "bg-gradient-to-b from-[#141812] to-[#0c100a] border-2 border-[#D4AF37]/70 shadow-[0_10px_35px_rgba(212,175,55,0.25)] hover:shadow-[0_15px_45px_rgba(212,175,55,0.45)]"
                  : isHype
                  ? "bg-gradient-to-b from-[#1c0e12] to-[#12070a] border-2 border-[#FF3366]/70 shadow-[0_10px_35px_rgba(255,51,102,0.25)] hover:shadow-[0_15px_45px_rgba(255,51,102,0.45)]"
                  : "bg-gradient-to-b from-[#181612] to-[#0f0e0c] border border-[#d97706]/50 shadow-[0_10px_30px_rgba(217,119,6,0.15)]"
              }`}
            >
              {/* Paper Corner Fold Effect */}
              <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden pointer-events-none">
                <div className="absolute transform rotate-45 bg-[#050608] w-12 h-12 -top-6 -right-6 border-b border-[#2d3748]" />
              </div>

              {/* Broadsheet Masthead */}
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex flex-col">
                    <span className="font-serif text-[11px] tracking-widest uppercase font-bold text-gray-300">
                      The Daily Financial Prophet
                    </span>
                    <span className="text-[9px] font-mono text-gray-500 uppercase">
                      Ministry of Market Grounding • {article.published_at.slice(0, 10)}
                    </span>
                  </div>

                  {/* Stamp / Seal Badge */}
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border ${
                      isStructural
                        ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#FFD700]"
                        : isHype
                        ? "bg-[#FF3366]/20 border-[#FF3366] text-[#FF3366] animate-pulse"
                        : "bg-[#f59e0b]/20 border-[#f59e0b] text-[#f59e0b]"
                    }`}
                  >
                    {article.importance_badge}
                  </span>
                </div>

                {/* Animated Moving Newspaper Photo Box */}
                <div className="relative w-full h-36 mb-4 rounded overflow-hidden bg-black border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors">
                  {/* Subtle Scanline / Film grain overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_51%)] bg-[length:100%_4px] opacity-40 pointer-events-none" />

                  {/* Animated Moving Newspaper Figure */}
                  <div className="relative z-10 flex flex-col items-center justify-center p-4 text-center">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 border transition-transform duration-700 group-hover:scale-110 ${
                        isStructural
                          ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#FFD700]"
                          : isHype
                          ? "border-[#FF3366] bg-[#FF3366]/10 text-[#FF3366]"
                          : "border-amber-400 bg-amber-400/10 text-amber-400"
                      }`}
                    >
                      {isStructural ? (
                        <svg className="w-8 h-8 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <circle cx="12" cy="12" r="9" strokeWidth="2" strokeDasharray="4 2" />
                          <path d="M12 7v5l3 3" strokeWidth="2" />
                        </svg>
                      ) : (
                        <svg className="w-8 h-8 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M12 9v4m0 4h.01M5 19h14a2 2 0 001.732-3L13.732 4a2 2 0 00-3.464 0L3.268 16A2 2 0 005 19z" strokeWidth="2" />
                        </svg>
                      )}
                    </div>
                    <span className="font-serif italic text-xs text-gray-300">
                      &ldquo;{article.publisher}&rdquo; Live Dispatch
                    </span>
                  </div>

                  {/* Moving shimmer light streak across photo */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                </div>

                {/* Headline */}
                <h3 className="font-serif text-lg font-bold text-white mb-2 leading-snug group-hover:text-amber-200 transition-colors">
                  {article.title}
                </h3>

                {/* Summary */}
                <p className="text-xs text-gray-400 font-sans line-clamp-3 mb-4 leading-relaxed">
                  {article.summary}
                </p>
              </div>

              {/* Wax Seal or Caution Stamp */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-serif text-[10px] font-black ${
                      isStructural
                        ? "bg-[#D4AF37] text-black shadow-[0_0_8px_#D4AF37]"
                        : "bg-[#FF3366] text-white shadow-[0_0_8px_#FF3366]"
                    }`}
                  >
                    {isStructural ? "§" : "!"}
                  </div>
                  <span className="text-[10px] font-mono uppercase text-gray-400 font-semibold tracking-wide">
                    {article.wax_seal}
                  </span>
                </div>

                <span className="text-[11px] font-mono text-[#D4AF37] group-hover:underline flex items-center gap-1">
                  Inspect Magic ↗
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Magical Reading Modal */}
      {activeArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveArticle(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-[#0d1017] border-2 border-[#D4AF37]/50 rounded-xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white font-mono text-sm px-2 py-1 rounded bg-[#161c28]"
            >
              ✕ ESC
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold tracking-wider uppercase border ${
                  activeArticle.highlight_type === "GOLD_STRUCTURAL"
                    ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#FFD700]"
                    : "bg-[#FF3366]/20 border-[#FF3366] text-[#FF3366]"
                }`}
              >
                {activeArticle.importance_badge}
              </span>
              <span className="text-xs font-mono text-gray-400">
                {activeArticle.publisher} • {activeArticle.published_at}
              </span>
            </div>

            <h2 className="font-serif text-2xl font-bold text-white mb-4 leading-tight">
              {activeArticle.title}
            </h2>

            <p className="text-sm text-gray-300 leading-relaxed mb-6 font-sans">
              {activeArticle.summary}
            </p>

            {/* Lucid Truth Deconstruction */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* What they want you to feel */}
              <div className="p-4 rounded-lg bg-[#FF3366]/10 border border-[#FF3366]/30">
                <div className="flex items-center gap-2 mb-2 text-[#FF3366]">
                  <span className="text-sm font-bold font-mono">⚡ WHAT THEY WANT YOU TO FEEL</span>
                </div>
                <p className="text-xs text-gray-300 font-sans leading-relaxed">
                  {activeArticle.what_they_want_you_to_feel}
                </p>
              </div>

              {/* What actually happened */}
              <div className="p-4 rounded-lg bg-[#00F5A0]/10 border border-[#00F5A0]/30">
                <div className="flex items-center gap-2 mb-2 text-[#00F5A0]">
                  <span className="text-sm font-bold font-mono">🔍 WHAT ACTUALLY HAPPENED</span>
                </div>
                <p className="text-xs text-gray-300 font-sans leading-relaxed">
                  {activeArticle.what_actually_happened}
                </p>
              </div>
            </div>

            {/* Scores & Footer */}
            <div className="flex items-center justify-between border-t border-[#1c222d] pt-4">
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-gray-400">
                  Substance:{" "}
                  <strong className="text-[#00F5A0]">{activeArticle.substance_score}/100</strong>
                </span>
                <span className="text-gray-400">
                  Hype:{" "}
                  <strong className="text-[#FF3366]">{activeArticle.hype_score}/100</strong>
                </span>
              </div>

              <a
                href={activeArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded font-mono text-xs font-bold bg-[#D4AF37] text-black hover:bg-[#ffe17d] transition-colors"
              >
                Read Original Source ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
