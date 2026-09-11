"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  section: string;
  sectionHref?: string;
  observation?: string;
  stepIndex?: string; // e.g. "01 / 06"
  lessonNarrative?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  section,
  sectionHref,
  observation,
  stepIndex,
  lessonNarrative,
}) => {
  return (
    <>
      {/* Top Subtle Breadcrumb */}
      <header className="fixed top-6 left-24 z-30 flex items-center gap-2 text-xs tracking-widest uppercase font-mono text-lucid-stone/80 select-none">
        <Link href="/" className="hover:text-lucid-bone transition-colors">
          LUCID
        </Link>
        <ChevronRight className="w-3 h-3 text-lucid-stone/40" />
        {sectionHref ? (
          <Link href={sectionHref} className="hover:text-lucid-bone transition-colors">
            {section}
          </Link>
        ) : (
          <span>{section}</span>
        )}
        {observation && (
          <>
            <ChevronRight className="w-3 h-3 text-lucid-stone/40" />
            <span className="text-lucid-bone font-medium">{observation}</span>
          </>
        )}
      </header>

      {/* Bottom Orientation Bar */}
      {stepIndex && (
        <footer className="fixed bottom-6 left-24 right-8 z-30 flex items-center justify-between text-xs text-lucid-stone pointer-events-none select-none">
          <div className="flex items-center gap-3 bg-lucid-ash/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-lucid-border/40 pointer-events-auto">
            <span className="font-mono text-lucid-oxide text-[11px] font-semibold">{stepIndex}</span>
            <span className="text-lucid-stone/50">|</span>
            <span className="text-lucid-bone text-[11px]">{lessonNarrative}</span>
          </div>

          <div className="text-[11px] text-lucid-stone/60 font-mono">
            PRESS <kbd className="px-1.5 py-0.5 rounded bg-lucid-ash border border-lucid-border/50 text-[10px]">⌘K</kbd> FOR COMMANDS
          </div>
        </footer>
      )}
    </>
  );
};
