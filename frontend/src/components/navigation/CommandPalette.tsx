"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Eye, Activity, Target, History, X, Compass, Zap, ShieldCheck } from "lucide-react";
import { useTour } from "@/context/TourContext";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: "SEE" | "ROOM" | "PRACTICE" | "TRACE" | "FOUNDATION";
  href: string;
  icon: React.ElementType;
  isTour?: boolean;
}

const COMMAND_ITEMS: CommandItem[] = [
  { id: "tour", title: "Take Guided Walkaround Tour of LUCID (All Features)", category: "FOUNDATION", href: "/room", icon: Compass, isTour: true },
  { id: "market", title: "Living Market Floor & Daily Prophet Broadsheet", category: "ROOM", href: "/market", icon: Zap },
  { id: "integrity", title: "Investment Integrity Engine & Capital Trail", category: "PRACTICE", href: "/integrity", icon: ShieldCheck },
  { id: "atmo", title: "Explore Today's Atmosphere (Market Pulse)", category: "ROOM", href: "/room", icon: Activity },
  { id: "claim", title: "Investigate a Financial Claim", category: "PRACTICE", href: "/practice", icon: Target },
  { id: "practice", title: "Paper Trading & Thesis Simulation", category: "PRACTICE", href: "/practice", icon: Target },
  { id: "trace", title: "Review My Behavioral Mirror & Decision History", category: "TRACE", href: "/trace", icon: History },
  { id: "compounding", title: "Compounding — Exponential Time Studio", category: "SEE", href: "/see?concept=compounding", icon: Eye },
  { id: "risk", title: "Risk & Return — The Uncertainty Horizon", category: "SEE", href: "/see?concept=risk-return", icon: Eye },
  { id: "diversification", title: "Diversification — Branching Outcomes Studio", category: "SEE", href: "/see?concept=diversification", icon: Eye },
  { id: "dca", title: "Dollar-Cost Averaging — Cadence Studio", category: "SEE", href: "/see?concept=dca", icon: Eye },
  { id: "inflation", title: "Inflation Erosion — Real Purchasing Power", category: "SEE", href: "/see?concept=inflation", icon: Eye },
  { id: "cycles", title: "Market Cycles — Historical Breathing Regimes", category: "SEE", href: "/see?concept=market-cycles", icon: Eye },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { startTour } = useTour();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filtered = COMMAND_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        const selected = filtered[selectedIndex];
        if (selected.isTour) {
          startTour(0);
        } else {
          router.push(selected.href);
        }
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, router, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/70 backdrop-blur-sm p-4">
      <div
        className="w-full max-w-xl bg-lucid-ash border border-lucid-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-lucid-border/50 gap-3">
          <Search className="w-5 h-5 text-lucid-stone" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="What would you like to explore? (e.g. Risk, Atmosphere, Claim...)"
            className="w-full bg-transparent text-lucid-bone placeholder:text-lucid-stone/50 text-sm focus:outline-none"
          />
          <button onClick={onClose} className="text-lucid-stone hover:text-lucid-bone">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 flex flex-col gap-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-lucid-stone">No matching explorations found.</div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.isTour) {
                      startTour(0);
                    } else {
                      router.push(item.href);
                    }
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs transition-colors ${
                    isSelected ? "bg-lucid-ink text-lucid-bone border border-lucid-oxide/40" : "text-lucid-stone hover:text-lucid-bone"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isSelected ? "text-lucid-oxide" : "text-lucid-stone"}`} />
                    <span className="font-medium text-lucid-bone">{item.title}</span>
                  </div>
                  <span className="font-mono text-[10px] text-lucid-stone/70 border border-lucid-border/40 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-lucid-ink/40 border-t border-lucid-border/30 text-[11px] text-lucid-stone/60 font-mono">
          <span>Navigate with ↑ ↓ · Select with ↵</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
