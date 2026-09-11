"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Eye, Activity, Target, History, Command, User as UserIcon, Zap, ShieldCheck, Compass } from "lucide-react";
import { useTour } from "@/context/TourContext";

interface LucidRailProps {
  onOpenCommandPalette: () => void;
}

export const LucidRail: React.FC<LucidRailProps> = ({ onOpenCommandPalette }) => {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const { startTour } = useTour();

  const navItems = [
    { label: "SEE", href: "/see", icon: Eye, desc: "Concept Studios" },
    { label: "ROOM", href: "/room", icon: Activity, desc: "Market Atmosphere" },
    { label: "MARKET", href: "/market", icon: Zap, desc: "Live Floor & Prophet" },
    { label: "INTEGRITY", href: "/integrity", icon: ShieldCheck, desc: "Ethical Screening & Trail" },
    { label: "PRACTICE", href: "/practice", icon: Target, desc: "Claim & Paper Trade" },
    { label: "TRACE", href: "/trace", icon: History, desc: "Behavioral Mirror" },
  ];

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed left-4 top-1/2 -translate-y-1/2 z-40 transition-all duration-300 ease-lucid-cinematic ${
        isHovered ? "w-52 bg-[#1A1A17]/90 backdrop-blur-md px-4 py-6 border border-lucid-border" : "w-14 bg-[#11110F]/80 px-2 py-4 border border-lucid-border/50"
      } rounded-2xl flex flex-col justify-between shadow-2xl`}
    >
      {/* Brand Node */}
      <div>
        <Link href="/" className="flex items-center gap-3 group px-2 py-2 mb-4">
          <div className="w-8 h-8 rounded-full border border-lucid-oxide/60 flex items-center justify-center text-lucid-bone font-serif text-lg font-bold group-hover:border-lucid-oxide transition-colors">
            L
          </div>
          {isHovered && (
            <div className="flex flex-col overflow-hidden">
              <span className="font-serif text-sm tracking-wider font-semibold text-lucid-bone">LUCID</span>
              <span className="text-[10px] text-lucid-stone uppercase tracking-widest">Observatory</span>
            </div>
          )}
        </Link>

        <div className="w-full h-px bg-lucid-border/40 my-3" />

        {/* Pillar Navigation Nodes */}
        <nav className="flex flex-col gap-1.5" aria-label="Observatory Navigation">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const IconComponent = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative flex items-center gap-3 px-2.5 py-2.5 rounded-lg transition-all text-xs tracking-wider ${
                  isActive
                    ? "bg-lucid-ash text-lucid-bone font-medium"
                    : "text-lucid-stone hover:text-lucid-bone hover:bg-lucid-ash/40"
                }`}
              >
                <div className="relative">
                  <IconComponent className={`w-4 h-4 ${isActive ? "text-lucid-oxide" : "text-lucid-stone"}`} />
                  {isActive && (
                    <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-lucid-oxide" />
                  )}
                </div>

                {isHovered && (
                  <div className="flex flex-col leading-tight">
                    <span className="font-medium text-xs text-lucid-bone">{item.label}</span>
                    <span className="text-[10px] text-lucid-stone font-normal">{item.desc}</span>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Utilities */}
      <div className="pt-4 border-t border-lucid-border/40 flex flex-col gap-2">
        <button
          onClick={() => startTour(0)}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[#00F5A0] hover:bg-emerald-950/40 text-xs transition-colors w-full group/tour"
          title="Guided Tour / Learn More (Start Walkaround)"
        >
          <Compass className="w-4 h-4 text-[#00F5A0] group-hover/tour:rotate-45 transition-transform" />
          {isHovered && <span className="text-[11px] font-bold text-[#00F5A0]">Take Guided Tour</span>}
        </button>

        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-lucid-stone hover:text-lucid-bone hover:bg-lucid-ash/40 text-xs transition-colors w-full"
          title="Command Palette (⌘K)"
        >
          <Command className="w-4 h-4 text-lucid-stone" />
          {isHovered && <span className="text-[11px] text-lucid-stone">Command Surface (⌘K)</span>}
        </button>

        <Link
          href="/trace"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-lucid-stone hover:text-lucid-bone hover:bg-lucid-ash/40 text-xs transition-colors"
        >
          <UserIcon className="w-4 h-4 text-lucid-stone" />
          {isHovered && <span className="text-[11px] text-lucid-stone">Observer Profile</span>}
        </Link>
      </div>
    </aside>
  );
};
