"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  api,
  TapeItem,
  DetailedQuote,
  MagicNewsArticle,
} from "@/lib/api";
import { RunningTickerTape } from "@/components/market/RunningTickerTape";
import { RealBroadsheetPaper } from "@/components/market/RealBroadsheetPaper";
import { AdvancedTrendCrucible } from "@/components/market/AdvancedTrendCrucible";

export default function MarketFloorPage() {
  const [tapeItems, setTapeItems] = useState<TapeItem[]>([]);
  const [selectedTicker, setSelectedTicker] = useState<string>("GLD");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("1mo");
  const [searchTickerQuery, setSearchTickerQuery] = useState<string>("");

  const [newsQuery, setNewsQuery] = useState<string>("GLD");
  const [searchNewsInput, setSearchNewsInput] = useState<string>("");
  const [newsFilter, setNewsFilter] = useState<"ALL" | "GOLD_STRUCTURAL" | "CRIMSON_HYPE">("ALL");

  const [quote, setQuote] = useState<DetailedQuote | null>(null);
  const [newsArticles, setNewsArticles] = useState<MagicNewsArticle[]>([]);
  const [loadingQuote, setLoadingQuote] = useState<boolean>(true);
  const [loadingNews, setLoadingNews] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1. Initial Ticker Tape Streaming
  useEffect(() => {
    async function loadTape() {
      try {
        const tape = await api.getMarketTape();
        setTapeItems(tape);
      } catch (err) {
        console.error("Failed to load tape:", err);
      }
    }
    loadTape();
    const interval = setInterval(loadTape, 30000);
    return () => clearInterval(interval);
  }, []);

  // 2. Load Detailed Quote on Ticker or Period change
  useEffect(() => {
    let isCurrent = true;
    async function fetchQuote() {
      setLoadingQuote(true);
      setErrorMsg(null);
      try {
        const q = await api.getDetailedQuote(selectedTicker, selectedPeriod);
        if (isCurrent) setQuote(q);
      } catch (err) {
        if (isCurrent) {
          console.error("Quote fetch error:", err);
          setErrorMsg("Could not fetch real data for this symbol. Showing closest market proxy.");
        }
      } finally {
        if (isCurrent) setLoadingQuote(false);
      }
    }
    fetchQuote();
    return () => {
      isCurrent = false;
    };
  }, [selectedTicker, selectedPeriod]);

  // 3. Load News on newsQuery change
  useEffect(() => {
    let isCurrent = true;
    async function fetchNews() {
      setLoadingNews(true);
      try {
        const n = await api.getMagicNews(newsQuery);
        if (isCurrent) setNewsArticles(n);
      } catch (err) {
        if (isCurrent) console.error("News fetch error:", err);
      } finally {
        if (isCurrent) setLoadingNews(false);
      }
    }
    fetchNews();
    return () => {
      isCurrent = false;
    };
  }, [newsQuery]);

  const handleTickerSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTickerQuery.trim()) return;
    const clean = searchTickerQuery.trim().toUpperCase();
    setSelectedTicker(clean);
    setNewsQuery(clean);
    setSearchTickerQuery("");
  };

  const handleNewsSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchNewsInput.trim()) return;
    setNewsQuery(searchNewsInput.trim());
    setSearchNewsInput("");
  };

  const QUICK_TICKERS = [
    { ticker: "GLD", label: "Gold Bullion" },
    { ticker: "SLV", label: "Silver Trust" },
    { ticker: "PPLT", label: "Platinum & Jewels" },
    { ticker: "SPY", label: "S&P 500" },
    { ticker: "QQQ", label: "Nasdaq 100" },
    { ticker: "NVDA", label: "Nvidia AI" },
    { ticker: "TSLA", label: "Tesla" },
  ];

  const NEWS_TOPICS = [
    { query: "GLD", label: "Precious Metals & Gold" },
    { query: "semiconductors", label: "Semiconductors & AI" },
    { query: "fed", label: "Federal Reserve & Yields" },
    { query: "tech", label: "Megacap Technology" },
    { query: "oil", label: "Energy & Crude" },
    { query: "crypto", label: "Crypto & Bitcoin" },
    { query: "market", label: "General Index Wire" },
  ];

  return (
    <div className="min-h-screen bg-[#050608] text-gray-100 flex flex-col font-sans selection:bg-[#00F5A0]/30 selection:text-white">
      {/* Top Header Bar */}
      <header className="w-full bg-[#090c10] border-b border-[#1c222d] sticky top-0 z-40 px-3 sm:px-4 lg:px-8 py-2.5 sm:py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-4">
            <Link
              href="/room"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded text-xs font-mono border border-white/10 hover:border-[#00F5A0] hover:text-[#00F5A0] bg-[#12161f] transition-colors whitespace-nowrap"
            >
              <span>← <span className="hidden sm:inline">RETURN TO </span>OBSERVATORY</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00F5A0] animate-ping shrink-0" />
              <h1 className="font-mono text-[11px] sm:text-xs lg:text-sm tracking-widest uppercase font-bold text-white">
                THE LIVING MARKET FLOOR
              </h1>
              <span className="hidden sm:inline text-[10px] font-mono px-2 py-0.5 rounded bg-[#00F5A0]/10 border border-[#00F5A0]/30 text-[#00F5A0] font-bold">
                HIGH VELOCITY
              </span>
            </div>
          </div>

          {/* Mandatory Prominent FRED Attribution */}
          <div className="text-[10px] font-mono text-gray-400 max-w-md text-right hidden sm:block">
            This product uses the FRED® API but is not endorsed or certified by the Federal Reserve Bank of St. Louis.
          </div>
        </div>
      </header>

      {/* Dual Continuous Running Ticker Tape */}
      <RunningTickerTape
        items={tapeItems}
        onSelectTicker={(t) => {
          setSelectedTicker(t);
          setNewsQuery(t);
        }}
        selectedTicker={selectedTicker}
      />

      {/* Main Floor Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-4 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-12">
        {/* Symbol Search Bar & Focus Chips */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-4 p-3 sm:p-4 rounded-xl bg-[#090d14] border border-[#1a2230]">
          <form onSubmit={handleTickerSearch} className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search symbol (e.g. GLD, NVDA, TSLA)..."
                value={searchTickerQuery}
                onChange={(e) => setSearchTickerQuery(e.target.value)}
                className="w-full bg-[#050608] border border-[#232d3d] focus:border-[#00F5A0] rounded-lg px-3.5 py-2 text-xs font-mono uppercase text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#00F5A0]"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#00F5A0] text-black font-mono text-xs font-bold rounded-lg hover:bg-[#34fab3] transition-colors"
            >
              Analyze
            </button>
          </form>

          {/* Quick-select chips */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-mono text-gray-500 mr-1">Floor Focus:</span>
            {QUICK_TICKERS.map((chip) => {
              const isSelected = selectedTicker === chip.ticker;
              const isMetal = chip.ticker === "GLD" || chip.ticker === "SLV" || chip.ticker === "PPLT";

              return (
                <button
                  key={chip.ticker}
                  onClick={() => {
                    setSelectedTicker(chip.ticker);
                    setNewsQuery(chip.ticker);
                  }}
                  className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-all ${
                    isSelected
                      ? isMetal
                        ? "bg-[#D4AF37] text-black font-bold shadow-[0_0_12px_#D4AF37]"
                        : "bg-[#00F5A0] text-black font-bold shadow-[0_0_12px_#00F5A0]"
                      : "bg-[#10141d] text-gray-300 border border-[#1f2837] hover:border-gray-500"
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </section>

        {errorMsg && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono rounded-lg">
            {errorMsg}
          </div>
        )}

        {/* Section 1: The Multi-Timeframe Trend Crucible */}
        <section>
          <AdvancedTrendCrucible
            quote={quote}
            selectedPeriod={selectedPeriod}
            onSelectPeriod={(p) => setSelectedPeriod(p)}
            isLoading={loadingQuote}
          />
        </section>

        {/* Section 2: Authentic Broadsheet Wall & Custom News Search */}
        <section className="space-y-6 pt-6">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#1f2838] pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-mono tracking-widest uppercase font-bold text-[#D4AF37]">
                  [ ARCHIVAL BROADSHEET WALL ]
                </span>
              </div>
              <h2 className="font-serif text-3xl font-bold text-white">
                The Daily Financial Prophet
              </h2>
              <p className="text-xs text-gray-400 font-sans mt-1 max-w-xl">
                Authentic vintage broadsheets suspended in mid-air. Separating verified structural events from engineered emotional clickbait.
              </p>
            </div>

            {/* Classification Filter Tabs */}
            <div className="flex items-center gap-2 bg-[#0c1017] p-1.5 rounded-lg border border-[#1c2432]">
              <button
                onClick={() => setNewsFilter("ALL")}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition-colors ${
                  newsFilter === "ALL"
                    ? "bg-[#253142] text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                All Dispatches
              </button>
              <button
                onClick={() => setNewsFilter("GOLD_STRUCTURAL")}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition-colors ${
                  newsFilter === "GOLD_STRUCTURAL"
                    ? "bg-[#D4AF37] text-black shadow-[0_0_10px_#D4AF37]"
                    : "text-gray-400 hover:text-[#D4AF37]"
                }`}
              >
                [FACT] Structural Reality
              </button>
              <button
                onClick={() => setNewsFilter("CRIMSON_HYPE")}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition-colors ${
                  newsFilter === "CRIMSON_HYPE"
                    ? "bg-[#FF3366] text-white shadow-[0_0_10px_#FF3366]"
                    : "text-gray-400 hover:text-[#FF3366]"
                }`}
              >
                [HYPE] Speculative Magnets
              </button>
            </div>
          </div>

          {/* Custom Topic Search & Pre-Set Topic Chips */}
          <div className="p-4 rounded-xl bg-[#090d14] border border-[#192230] flex flex-col md:flex-row items-center justify-between gap-4">
            <form onSubmit={handleNewsSearch} className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  placeholder="Search topic (e.g. Semiconductors, Fed, Gold, Oil)..."
                  value={searchNewsInput}
                  onChange={(e) => setSearchNewsInput(e.target.value)}
                  className="w-full bg-[#050608] border border-[#222c3e] focus:border-[#D4AF37] rounded-lg px-3.5 py-2 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#D4AF37] text-black font-mono text-xs font-bold rounded-lg hover:bg-[#ebd083] transition-colors"
              >
                Search Wire
              </button>
            </form>

            {/* Topic Chips */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-mono text-gray-500 mr-1">Wire Topics:</span>
              {NEWS_TOPICS.map((tp) => {
                const isSelected = newsQuery.toLowerCase() === tp.query.toLowerCase();
                return (
                  <button
                    key={tp.query}
                    onClick={() => setNewsQuery(tp.query)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all ${
                      isSelected
                        ? "bg-[#D4AF37] text-black font-bold shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                        : "bg-[#10141d] text-gray-400 border border-[#1e2637] hover:border-gray-500 hover:text-white"
                    }`}
                  >
                    {tp.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Broadsheets Grid */}
          {loadingNews ? (
            <div className="py-24 flex flex-col items-center justify-center space-y-3 font-mono text-xs text-gray-400">
              <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
              <span>RETRIEVING & CLASSIFYING REAL YAHOO WIRE DISPATCHES...</span>
            </div>
          ) : (
            <RealBroadsheetPaper
              articles={newsArticles}
              selectedFilter={newsFilter}
            />
          )}
        </section>

        {/* Mandatory Prominent FRED Notice */}
        <footer className="w-full pt-8 pb-12 border-t border-[#19212d] text-center text-xs font-mono text-gray-400 space-y-2">
          <p className="font-semibold text-gray-300">
            This product uses the FRED® API but is not endorsed or certified by the Federal Reserve Bank of St. Louis.
          </p>
          <p className="text-[11px] text-gray-500">
            Lucid Institutional Market Floor · Sourced via Yahoo Finance & Federal Reserve Bank of St. Louis Open APIs
          </p>
        </footer>
      </main>
    </div>
  );
}
