"use client";

import React, { useState } from "react";
import { MagicNewsArticle } from "@/lib/api";

interface RealBroadsheetPaperProps {
  articles: MagicNewsArticle[];
  selectedFilter: "ALL" | "GOLD_STRUCTURAL" | "CRIMSON_HYPE";
}

export const RealBroadsheetPaper: React.FC<RealBroadsheetPaperProps> = ({
  articles,
  selectedFilter,
}) => {
  const [activeArticle, setActiveArticle] = useState<MagicNewsArticle | null>(null);

  const filteredArticles = articles.filter((art) => {
    if (selectedFilter === "ALL") return true;
    return art.highlight_type === selectedFilter;
  });

  return (
    <div className="w-full relative overflow-x-hidden md:overflow-x-visible">
      {/* 3D Broadsheet Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 py-4"
        style={{ perspective: "1500px" }}
      >
        {filteredArticles.map((article, idx) => {
          const isStructural = article.highlight_type === "GOLD_STRUCTURAL";
          const isHype = article.highlight_type === "CRIMSON_HYPE";

          // Extract first letter for dropped capital
          const cleanTitle = article.title.trim();
          const firstLetter = cleanTitle.charAt(0);
          const restTitle = cleanTitle.slice(1);

          return (
            <article
              key={article.id || idx}
              onClick={() => setActiveArticle(article)}
              style={{
                transform: `rotateY(${article.float_rotation}deg) rotateZ(${article.float_rotation * 0.4}deg)`,
                animationDelay: `${article.levitation_delay}s`,
              }}
              className={`group relative cursor-pointer transition-all duration-500 hover:scale-[1.03] hover:z-30 hover:rotate-0 animate-levitate rounded-none p-4 sm:p-6 flex flex-col justify-between select-none ${
                isStructural
                  ? "bg-[#161512] text-[#e8e2d4] border-2 border-[#D4AF37]/80 shadow-[0_12px_36px_rgba(212,175,55,0.2)] hover:shadow-[0_18px_48px_rgba(212,175,55,0.35)]"
                  : isHype
                  ? "bg-[#181214] text-[#ebdcd8] border-2 border-[#FF3366]/80 shadow-[0_12px_36px_rgba(255,51,102,0.2)] hover:shadow-[0_18px_48px_rgba(255,51,102,0.35)]"
                  : "bg-[#151413] text-[#ded8cc] border border-[#3e3931] shadow-[0_10px_30px_rgba(0,0,0,0.7)]"
              }`}
            >
              {/* Paper Texture Overlay (Halftone Fiber Pattern) */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

              {/* Physical Newspaper Horizontal Center Fold Line */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-black/5 via-black/40 to-black/5 pointer-events-none border-b border-white/5" />

              {/* Dog-eared top corner */}
              <div className="absolute top-0 right-0 w-6 h-6 overflow-hidden pointer-events-none">
                <div className="absolute transform rotate-45 bg-[#050608] w-10 h-10 -top-5 -right-5 border-b border-[#3b362c]" />
              </div>

              <div>
                {/* Masthead Header Banner */}
                <div className="border-b-2 border-[#3d362b] pb-2 mb-3">
                  <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-widest text-[#8a8070] pb-1 border-b border-[#2e2921]">
                    <span>{article.issue_no || "VOL. XCVII NO. 34,102"}</span>
                    <span>TWENTY-FIVE CENTS</span>
                    <span>{article.published_at.slice(0, 10)}</span>
                  </div>

                  <div className="pt-2 text-center">
                    <span className="font-serif text-base tracking-[0.2em] uppercase font-black text-[#d6cdbe] block">
                      The Financial Prophet
                    </span>
                    <span className="text-[8px] font-mono tracking-widest uppercase text-[#857b6b]">
                      Chronicle of Real Market Fact & Flow
                    </span>
                  </div>
                </div>

                {/* Classification Stamp Banner */}
                <div className="flex items-center justify-between my-2 pb-2 border-b border-[#2a251e]">
                  <span className="text-[10px] font-mono uppercase text-[#9e9484] tracking-wider">
                    {article.byline || "By Our Senior Wire Desk"}
                  </span>
                  
                  {/* Authentic Ink Stamp */}
                  <span
                    className={`px-2 py-0.5 font-mono text-[9px] font-black tracking-widest uppercase border ${
                      isStructural
                        ? "bg-[#D4AF37]/15 border-[#D4AF37] text-[#FFD700]"
                        : isHype
                        ? "bg-[#FF3366]/15 border-[#FF3366] text-[#FF3366]"
                        : "bg-[#71808A]/15 border-[#71808A] text-gray-300"
                    }`}
                  >
                    [{article.importance_badge}]
                  </span>
                </div>

                {/* Halftone Dot Matrix Wirephoto Box */}
                <div className="relative w-full h-32 my-3 rounded-none overflow-hidden bg-[#0d0c0a] border border-[#383227] flex flex-col justify-between p-2.5 group-hover:border-[#52493a] transition-colors">
                  {/* Halftone Screen Filter */}
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff18_1.5px,transparent_1.5px)] [background-size:6px_6px] pointer-events-none" />

                  {/* Wirephoto Transmission Label */}
                  <div className="relative z-10 flex items-center justify-between text-[8px] font-mono text-[#8a8070] uppercase">
                    <span>WIREPHOTO TRANSMISSION</span>
                    <span>SRC: {article.publisher}</span>
                  </div>

                  {/* Visual Silhouette & Line Art */}
                  <div className="relative z-10 my-auto flex items-center justify-center">
                    <div
                      className={`w-12 h-12 rounded-full border flex items-center justify-center ${
                        isStructural
                          ? "border-[#D4AF37]/60 bg-[#D4AF37]/10 text-[#FFD700]"
                          : isHype
                          ? "border-[#FF3366]/60 bg-[#FF3366]/10 text-[#FF3366]"
                          : "border-gray-500 bg-gray-500/10 text-gray-300"
                      }`}
                    >
                      <span className="font-serif font-black text-sm">
                        {isStructural ? "FACT" : isHype ? "HYPE" : "DATA"}
                      </span>
                    </div>
                  </div>

                  {/* Photo Caption */}
                  <div className="relative z-10 text-[9px] font-serif italic text-[#9c9180] border-t border-[#2a251e] pt-1">
                    Fig. Archive report on verified exchange movements.
                  </div>
                </div>

                {/* Headline with Dropped Capital on text */}
                <h3 className="font-serif text-lg font-bold leading-snug mb-3 group-hover:text-amber-100 transition-colors">
                  <span className="float-left text-3xl font-black leading-none pr-1.5 font-serif text-[#D4AF37]">
                    {firstLetter}
                  </span>
                  {restTitle}
                </h3>

                {/* Lead Summary Paragraph */}
                <p className="text-xs text-[#a69d8f] font-serif leading-relaxed line-clamp-3">
                  {article.summary}
                </p>
              </div>

              {/* Bottom Archival Seal & Action */}
              <div className="mt-4 pt-3 border-t-2 border-[#332e26] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Wax Seal Motif */}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center font-serif text-[9px] font-bold ${
                      isStructural
                        ? "bg-[#D4AF37] text-black shadow-[0_0_6px_#D4AF37]"
                        : "bg-[#FF3366] text-white shadow-[0_0_6px_#FF3366]"
                    }`}
                  >
                    P
                  </div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[#8a8070]">
                    {article.wax_seal}
                  </span>
                </div>

                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#D4AF37] group-hover:underline">
                  Examine Dispatch
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {/* Reading Deconstruction Modal */}
      {activeArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveArticle(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#141311] border-2 border-[#D4AF37]/80 rounded-none p-4 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.95)] text-[#e8e2d4] relative font-serif"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-4 right-4 text-xs font-mono uppercase tracking-widest px-2.5 py-1 border border-[#3e382d] hover:border-white text-gray-300 hover:text-white bg-[#1c1a17]"
            >
              [ CLOSE / ESC ]
            </button>

            {/* Header Stamp */}
            <div className="flex items-center gap-3 border-b border-[#363026] pb-3 mb-4 font-mono text-xs">
              <span
                className={`px-2 py-0.5 font-bold uppercase tracking-wider border ${
                  activeArticle.highlight_type === "GOLD_STRUCTURAL"
                    ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#FFD700]"
                    : "bg-[#FF3366]/20 border-[#FF3366] text-[#FF3366]"
                }`}
              >
                [{activeArticle.importance_badge}]
              </span>
              <span className="text-[#8a8070]">
                {activeArticle.publisher} · {activeArticle.published_at}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-bold mb-4 leading-tight text-white pr-20 sm:pr-0">
              {activeArticle.title}
            </h2>

            {/* Summary */}
            <p className="text-sm text-[#b8afa0] leading-relaxed mb-6 font-serif">
              {activeArticle.summary}
            </p>

            {/* Deconstruction Stack */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 font-sans">
              <div className="p-4 bg-[#211215] border border-[#FF3366]/40">
                <span className="text-[11px] font-mono font-bold text-[#FF3366] uppercase block mb-1">
                  [ EMOTIONAL LEVERAGE · WHAT THEY WANT YOU TO FEEL ]
                </span>
                <p className="text-xs text-[#ded1ce] leading-relaxed">
                  {activeArticle.what_they_want_you_to_feel}
                </p>
              </div>

              <div className="p-4 bg-[#111c16] border border-[#00F5A0]/40">
                <span className="text-[11px] font-mono font-bold text-[#00F5A0] uppercase block mb-1">
                  [ GROUNDED REALITY · WHAT ACTUALLY HAPPENED ]
                </span>
                <p className="text-xs text-[#cedfd4] leading-relaxed">
                  {activeArticle.what_actually_happened}
                </p>
              </div>
            </div>

            {/* Scoring & Outbound Link */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#363026] pt-4 font-mono text-xs">
              <div className="flex items-center gap-4">
                <span className="text-[#8a8070]">
                  Substance: <strong className="text-[#00F5A0]">{activeArticle.substance_score}/100</strong>
                </span>
                <span className="text-[#8a8070]">
                  Hype: <strong className="text-[#FF3366]">{activeArticle.hype_score}/100</strong>
                </span>
              </div>

              <a
                href={activeArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center px-4 py-2 bg-[#D4AF37] text-black font-bold uppercase tracking-wider hover:bg-[#ffe285] transition-colors"
              >
                Access Source Dispatch
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
