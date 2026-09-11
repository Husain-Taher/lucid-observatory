"use client";

import React, { useState } from "react";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LucidRail } from "@/components/navigation/LucidRail";
import { CommandPalette } from "@/components/navigation/CommandPalette";
import { TourProvider } from "@/context/TourContext";
import { WalkaroundGuide } from "@/components/guide/WalkaroundGuide";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes cache
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <title>LUCID — See the Market Clearly</title>
        <meta
          name="description"
          content="An interactive financial observatory. Understand the market, not just the price."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-[#11110F] text-[#E9E5DA] selection:bg-lucid-oxide/30 selection:text-white min-h-screen">
        <QueryClientProvider client={queryClient}>
          <TourProvider>
            <LucidRail onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />
            <CommandPalette
              isOpen={isCommandPaletteOpen}
              onClose={() => setIsCommandPaletteOpen(false)}
            />
            <WalkaroundGuide />
            <main className="min-h-screen pl-16 md:pl-20 pr-4 md:pr-10 py-12 transition-all flex flex-col justify-between">
              <div>{children}</div>

            {/* MANDATORY FRED® API NOTICE & COMPLIANCE FOOTER */}
            <footer className="mt-24 pt-8 border-t border-lucid-border/40 text-center space-y-2.5">
              <p className="font-mono text-xs text-lucid-stone/90 tracking-wide">
                This product uses the FRED® API but is not endorsed or certified by the Federal Reserve Bank of St. Louis.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-mono text-[11px] text-lucid-stone/60">
                <a
                  href="/terms"
                  className="hover:text-lucid-bone underline decoration-lucid-border underline-offset-4 transition-colors"
                >
                  Terms of Use &amp; FRED® Terms
                </a>
                <span>·</span>
                <a
                  href="/privacy"
                  className="hover:text-lucid-bone underline decoration-lucid-border underline-offset-4 transition-colors"
                >
                  Privacy Policy
                </a>
                <span>·</span>
                <a
                  href="https://fred.stlouisfed.org/docs/api/terms_of_use.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-lucid-oxide underline decoration-lucid-border underline-offset-4 transition-colors"
                >
                  FRED® API Terms of Use ↗
                </a>
              </div>
            </footer>
          </main>
          </TourProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
