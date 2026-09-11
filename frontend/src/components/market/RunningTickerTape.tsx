"use client";

import React from "react";
import { TapeItem } from "@/lib/api";

interface RunningTickerTapeProps {
  items: TapeItem[];
  onSelectTicker?: (ticker: string) => void;
  selectedTicker?: string;
}

export const RunningTickerTape: React.FC<RunningTickerTapeProps> = ({
  items,
  onSelectTicker,
  selectedTicker,
}) => {
  if (!items || items.length === 0) return null;

  // Split into two rows for dual-track velocity
  const metalsAndIndices = items.filter(
    (it) => it.category === "metals" || it.category === "index" || it.category === "macro"
  );
  const techAndCrypto = items.filter(
    (it) => it.category === "tech" || it.category === "crypto"
  );

  const row1 = metalsAndIndices.length > 0 ? metalsAndIndices : items;
  const row2 = techAndCrypto.length > 0 ? techAndCrypto : items;

  // Duplicate arrays to create continuous infinite loops
  const duplicatedRow1 = [...row1, ...row1, ...row1];
  const duplicatedRow2 = [...row2, ...row2, ...row2];

  const renderTickerBadge = (item: TapeItem, index: number) => {
    const isGold = item.symbol === "GLD" || item.symbol === "SLV" || item.symbol === "PPLT";
    const isSelected = selectedTicker?.toUpperCase() === item.symbol.toUpperCase();

    return (
      <button
        key={`${item.symbol}-${index}`}
        onClick={() => onSelectTicker?.(item.symbol)}
        className={`inline-flex items-center gap-2 sm:gap-3 px-2.5 sm:px-4 py-1 sm:py-1.5 mx-1 sm:mx-2 rounded-sm border transition-all text-xs font-mono select-none cursor-pointer whitespace-nowrap ${
          isSelected
            ? "border-[#00F5A0] bg-[#00F5A0]/10 shadow-[0_0_15px_rgba(0,245,160,0.3)]"
            : isGold
            ? "border-[#D4AF37]/40 bg-[#D4AF37]/5 hover:border-[#D4AF37] hover:bg-[#D4AF37]/15"
            : "border-[#222731] bg-[#0d1117] hover:border-[#384252] hover:bg-[#161c24]"
        }`}
      >
        <div className="flex items-center gap-1.5">
          {isGold && <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse" />}
          <span
            className={`font-semibold tracking-wider ${
              isGold ? "text-[#FFD700]" : "text-white"
            }`}
          >
            {item.symbol}
          </span>
          <span className="text-[10px] text-gray-400 font-sans hidden xs:inline">{item.name}</span>
        </div>

        <span className="font-bold text-white">${item.price.toFixed(2)}</span>

        <span
          className={`flex items-center text-[11px] font-bold ${
            item.is_positive ? "text-[#00F5A0]" : "text-[#FF3366]"
          }`}
        >
          {item.is_positive ? "▲ +" : "▼ "}
          {item.change_pct.toFixed(2)}%
        </span>
      </button>
    );
  };

  return (
    <div className="w-full bg-[#050608] border-y border-[#1c222d] py-1.5 sm:py-2 overflow-hidden select-none relative group">
      {/* Visual edge gradient fade */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#050608] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#050608] to-transparent z-10 pointer-events-none" />

      {/* Row 1: Fast Marquee */}
      <div className="flex overflow-hidden py-1">
        <div className="flex animate-tape-scroll-left group-hover:[animation-play-state:paused] whitespace-nowrap">
          {duplicatedRow1.map((item, idx) => renderTickerBadge(item, idx))}
        </div>
      </div>

      {/* Row 2: Reverse Scroll */}
      <div className="flex overflow-hidden py-1 border-t border-[#131720]">
        <div className="flex animate-tape-scroll-right group-hover:[animation-play-state:paused] whitespace-nowrap">
          {duplicatedRow2.map((item, idx) => renderTickerBadge(item, idx))}
        </div>
      </div>
    </div>
  );
};
