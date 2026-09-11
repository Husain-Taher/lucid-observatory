"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Eye, Activity, Target, History, Command, User as UserIcon, Zap, ShieldCheck, Compass, Home } from "lucide-react";
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

  const mobileNavItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "See", href: "/see", icon: Eye },
    { label: "Room", href: "/room", icon: Activity },
    { label: "Market", href: "/market", icon: Zap },
    { label: "Integrity", href: "/integrity", icon: ShieldCheck },
    { label: "Practice", href: "/practice", icon: Target },
    { label: "Trace", href: "/trace", icon: History },
  ];

  return (
    <>
      {/* ============================================================ */}
      {/* MOBILE TOP BAR (< md screens) */}
      {/* ============================================================ */}
      <header className="fixed top-0 inset-x-0 z-40 bg-[#0c0e14]/95 backdrop-blur-md px-4 py-2.5 border-b border-lucid-border/50 flex md:hidden items-center justify-between shadow-lg">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full border border-lucid-oxide/70 flex items-center justify-center text-lucid-bone font-serif text-sm font-bold bg-[#151412]">
            L
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xs tracking-wider font-semibold text-lucid-bone">LUCID</span>
            <span className="text-[8px] text-lucid-stone uppercase tracking-widest -mt-0.5">Observatory</span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => startTour(0)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#00F5A0]/10 border border-[#00F5A0]/40 text-[#00F5A0] font-mono text-[10px] font-bold"
            title="Guided Tour"
          >
            <Compass className="w-3.5 h-3.5 text-[#00F5A0]" />
            <span>Tour</span>
          </button>

          <button
            onClick={onOpenCommandPalette}
            className="p-1.5 rounded-lg bg-[#141822] border border-lucid-border/60 text-lucid-stone hover:text-white"
            title="Search & Commands (⌘K)"
          >
            <Command className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ============================================================ */}
      {/* MOBILE BOTTOM NAVIGATION DOCK (< md screens) */}
      {/* ============================================================ */}
      <nav
        aria-label="Mobile Navigation Dock"
        className="fixed bottom-0 inset-x-0 z-40 bg-[#090b10]/95 backdrop-blur-xl border-t border-lucid-border/60 py-1.5 px-1 flex md:hidden items-center justify-around shadow-[0_-10px_25px_rgba(0,0,0,0.8)]"
      >
        {mobileNavItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const IconComponent = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-all text-center min-w-[44px] ${
                isActive
                  ? "text-lucid-bone font-semibold"
                  : "text-lucid-stone hover:text-lucid-bone"
              }`}
            >
              <div className="relative">
                <IconComponent
                  className={`w-4 h-4 ${
                    isActive
                      ? item.label === "Market" || item.label === "Integrity"
                        ? "text-[#00F5A0]"
                        : "text-lucid-oxide"
                      : "text-lucid-stone"
                  }`}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#00F5A0]" />
                )}
              </div>
              <span className={`text-[9px] font-mono tracking-wider mt-0.5 ${isActive ? "text-white font-bold" : "text-gray-400"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* ============================================================ */}
      {/* DESKTOP FLOATING SIDEBAR (>= md screens) */}
      {/* ============================================================ */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 z-40 transition-all duration-300 ease-lucid-cinematic ${
          isHovered ? "w-52 bg-[#1A1A17]/90 backdrop-blur-md px-4 py-6 border border-lucid-border" : "w-14 bg-[#11110F]/80 px-2 py-4 border border-lucid-border/50"
        } rounded-2xl flex-col justify-between shadow-2xl`}
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
    </>
  );
};
