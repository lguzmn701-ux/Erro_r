import React, { useEffect, useState } from "react";
import { Terminal, ShieldAlert, Cpu, HardDrive } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);

  const lines = [
    "⚡ ERROR OS V2.06 BOOTING...",
    "🔑 LOAD KEYS: process.env.GEMINI_API_KEY... FOUND [ACTIVE]",
    "🧠 NEURAL DRIVER: initializing gemini-3.5-flash context...",
    "🎮 VECTOR ENGINES: loading glitch parameters & sorting.js...",
    "📉 CORE INTEGRITY: check system standard... FAIL [OK - CHAOS DETECTED]",
    "💾 BUFFER LOADED: Y2K buffer overflow simulator... ONLINE",
    "💀 ANTI-PERFECTIONISM MONITOR: active on all vectors",
    "⚠️ WARNING: This application converts standard rules into beautiful visual glitches.",
    "🚀 ERROR LAB UNLEASHED."
  ];

  useEffect(() => {
    // Stagger print boot log lines
    let lineIdx = 0;
    const logInterval = setInterval(() => {
      if (lineIdx < lines.length) {
        setBootLogs((prev) => [...prev, lines[lineIdx]]);
        lineIdx++;
      } else {
        clearInterval(logInterval);
      }
    }, 250);

    // Stagger progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          // Briefly flicker screen before completion
          setGlitchActive(true);
          setTimeout(() => {
            onComplete();
          }, 400);
          return 100;
        }
        // randomized jumps to look realistic
        const jump = Math.floor(Math.random() * 15) + 3;
        return Math.min(prev + jump, 100);
      });
    }, 150);

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className={`fixed inset-0 bg-[#050506] flex flex-col justify-between p-6 md:p-12 z-50 crt-effect font-mono overflow-hidden transition-all duration-300 ${glitchActive ? "bg-red-950 shake-active" : ""}`}>
      {/* Top Header info */}
      <div className="flex justify-between items-start text-xs border-b border-zinc-800 pb-3 text-zinc-500">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-raw-red" />
          <span>ERROR SYSTEM DIAGNOTICS - VER 2.06</span>
        </div>
        <div className="text-right">
          <span>PORT 3000 ACTIVE</span>
        </div>
      </div>

      {/* Main Terminal logs */}
      <div className="flex-1 my-8 max-w-2xl mx-auto w-full flex flex-col justify-center">
        {/* Massive flashing glitch title */}
        <div className="mb-8">
          <h1 className="text-7xl md:text-9xl font-bold font-display tracking-tighter transition-all hover:scale-95 cursor-pointer text-raw-red select-none">
            ERR_OR
          </h1>
          <p className="text-zinc-400 font-display mt-2 border-l border-zinc-800 pl-3">
            [LABORATORIO DE EXPERIMENTACIÓN VISUAL CONTRA EL BLOQUEO]
          </p>
        </div>

        {/* Bootlogs */}
        <div className="space-y-1.5 h-48 overflow-y-auto bg-black/60 p-4 border border-zinc-800 rounded text-xs select-none scrollbar-thin">
          {bootLogs.map((log, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-zinc-600 font-bold">[{i+1}]</span>
              <span className={(log && log.includes("FAIL")) ? "text-acid-yellow" : (log && log.includes("ACTIVE")) ? "text-neon-green" : "text-zinc-300"}>
                {log}
              </span>
            </div>
          ))}
          <div className="animate-pulse inline-block w-2 h-3 bg-neon-green ml-1" />
        </div>
      </div>

      {/* Footer loading progress bar */}
      <div className="max-w-2xl mx-auto w-full border-t border-zinc-800 pt-6">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-zinc-400">CARGANDO ALMA ARTÍSTICA CONTRA EL ORDEN CORPORATIVO</span>
          <span className="text-neon-green text-right font-bold">{progress}%</span>
        </div>
        <div className="w-full bg-zinc-900 h-2 border border-zinc-800 rounded-sm overflow-hidden relative">
          <div 
            className="bg-neon-green h-full transition-all duration-100 ease-out shadow-[0_0_10px_#00FF66]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-zinc-600 mt-2">
          <span>COGNITIVE LAYER CONFIGURED</span>
          <span>SYSTEM CHROME STABLE</span>
        </div>
      </div>
    </div>
  );
}
