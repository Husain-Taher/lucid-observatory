"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface TakeoffTransitionProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TakeoffTransition: React.FC<TakeoffTransitionProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [phase, setPhase] = useState<"IDLE" | "SPOOL" | "ROLL" | "ROTATE" | "WARP">("IDLE");
  const [knots, setKnots] = useState(0);
  const [altitude, setAltitude] = useState(0);
  const [thrust, setThrust] = useState(40);

  useEffect(() => {
    if (!isOpen) {
      setPhase("IDLE");
      setKnots(0);
      setAltitude(0);
      setThrust(40);
      return;
    }

    setPhase("SPOOL");
    const t1 = setTimeout(() => {
      setPhase("ROLL");
      setThrust(104);
    }, 600);

    const t2 = setTimeout(() => {
      setPhase("ROTATE");
    }, 1800);

    const t3 = setTimeout(() => {
      setPhase("WARP");
    }, 2700);

    const t4 = setTimeout(() => {
      onClose();
      router.push("/market");
    }, 3400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isOpen, router, onClose]);

  // Telemetry gauge ticker
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setKnots((prev) => {
        if (prev >= 240) return 240;
        return prev + (prev < 80 ? 4 : 8);
      });

      setAltitude((prev) => {
        if (knots < 140) return 0;
        return prev + 65;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [isOpen, knots]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#030406] flex flex-col items-center justify-center overflow-hidden select-none font-mono text-white">
      {/* Dynamic Runway Perspective Lines */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60">
        <div
          className={`w-full h-full relative overflow-hidden flex items-center justify-center transition-transform duration-700 ${
            phase === "ROTATE" || phase === "WARP" ? "scale-125 translate-y-12" : "scale-100"
          }`}
          style={{ perspective: "600px" }}
        >
          {/* Runway Surface */}
          <div
            className="w-[800px] h-[1200px] border-x-4 border-dashed border-[#00F5A0]/40 relative flex justify-center"
            style={{
              transform: "rotateX(72deg) translateY(-200px)",
              transformOrigin: "center bottom",
            }}
          >
            {/* Centerline Dash Strip */}
            <div className="w-4 h-full bg-gradient-to-b from-transparent via-white/80 to-transparent animate-pulse" />
            
            {/* Speed Run Streak Lines */}
            <div
              className={`absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent,transparent_40px,rgba(0,245,160,0.3)_41px,transparent_60px)] ${
                phase === "ROLL" ? "animate-tape-scroll-left" : phase === "ROTATE" || phase === "WARP" ? "animate-pulse" : ""
              }`}
            />
          </div>
        </div>
      </div>

      {/* Screen Vibration Shake on Roll & Rotate */}
      <div
        className={`relative z-20 flex flex-col items-center text-center p-8 max-w-2xl w-full transition-all duration-300 ${
          phase === "ROLL"
            ? "translate-x-0.5 -translate-y-0.5"
            : phase === "ROTATE"
            ? "-translate-x-1 translate-y-1 scale-105"
            : phase === "WARP"
            ? "scale-110 blur-[1px]"
            : ""
        }`}
      >
        {/* Status Callout Banner */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#00F5A0]/40 bg-[#00F5A0]/10 text-[#00F5A0] text-xs uppercase tracking-widest font-bold mb-6">
          <span className="w-2 h-2 rounded-full bg-[#00F5A0] animate-ping" />
          <span>
            {phase === "SPOOL" && "SPOOLING ENGINES · CLEARED RUNWAY 09L"}
            {phase === "ROLL" && "TAKEOFF ROLL · FULL POWER 104%"}
            {phase === "ROTATE" && "V1 · ROTATE · POSITIVE CLIMB"}
            {phase === "WARP" && "ENTERING HIGH-VELOCITY TRADING FLOOR"}
          </span>
        </div>

        {/* Large Mission Heading */}
        <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-wide text-white mb-2">
          ACCELERATING TO MARKET
        </h1>
        <p className="text-xs text-gray-400 font-sans max-w-md mb-8">
          Transitioning from calm archival contemplation to live multi-asset floor velocity. Real quotes and news wire streaming in real time.
        </p>

        {/* Cockpit HUD Gauges */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-lg p-4 bg-[#090d14]/90 border border-[#1b2332] rounded-xl shadow-[0_0_30px_rgba(0,245,160,0.15)]">
          {/* Airspeed Gauge */}
          <div className="flex flex-col items-center border-r border-[#1a2333] pr-2">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Airspeed</span>
            <span className="text-2xl font-black text-[#00F5A0]">{knots}</span>
            <span className="text-[9px] text-gray-500 font-mono">KIAS</span>
          </div>

          {/* Thrust N1 */}
          <div className="flex flex-col items-center border-r border-[#1a2333] px-2">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Thrust N1</span>
            <span className="text-2xl font-black text-[#FFD700]">{thrust}%</span>
            <span className="text-[9px] text-gray-500 font-mono">TAKEOFF</span>
          </div>

          {/* Altitude */}
          <div className="flex flex-col items-center pl-2">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Altitude</span>
            <span className="text-2xl font-black text-white">{altitude}</span>
            <span className="text-[9px] text-gray-500 font-mono">FEET MSL</span>
          </div>
        </div>

        {/* Runway Distance Progress Bar */}
        <div className="w-full max-w-lg mt-6 bg-[#121722] rounded-full h-1.5 overflow-hidden border border-[#1e2738]">
          <div
            className="bg-gradient-to-r from-[#00F5A0] via-[#FFD700] to-white h-full transition-all duration-300"
            style={{ width: `${Math.min(100, (knots / 240) * 100)}%` }}
          />
        </div>

        {/* Skip / Instant Entry Button */}
        <button
          onClick={() => {
            onClose();
            router.push("/market");
          }}
          className="mt-8 text-[11px] text-gray-500 hover:text-white uppercase tracking-widest border-b border-gray-700 hover:border-white transition-colors"
        >
          Skip Launch Sequence
        </button>
      </div>

      {/* Warp Flash Overlay */}
      {phase === "WARP" && (
        <div className="absolute inset-0 bg-white z-50 animate-ping pointer-events-none opacity-40" />
      )}
    </div>
  );
};
