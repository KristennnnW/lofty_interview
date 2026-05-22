import { motion } from "framer-motion";
import { Brain, Radio, Shield, VolumeX } from "lucide-react";
import type { Severity } from "../types";

interface TopBarProps {
  caseName: string;
  severityCounts: Record<Severity, number>;
  aiStatus: string;
  isBuilding: boolean;
  narrationEnabled: boolean;
  onToggleNarration: () => void;
}

const severityColors: Record<Severity, string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-slate-500",
};

export function TopBar({
  caseName,
  severityCounts,
  aiStatus,
  isBuilding,
  narrationEnabled,
  onToggleNarration,
}: TopBarProps) {
  const total = Object.values(severityCounts).reduce((a, b) => a + b, 0);

  return (
    <header className="h-12 flex items-center justify-between px-4 border-b border-[#1e1e2e] bg-[#0a0a0f]/95 backdrop-blur-sm flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-[#3b82f6]" strokeWidth={1.75} />
          <span className="text-sm font-semibold tracking-tight text-slate-100">
            NEXUS
          </span>
        </div>
        <span className="text-slate-600">|</span>
        <span className="text-xs text-slate-400 font-medium truncate max-w-[360px]">
          {caseName}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Severity bar */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-wider text-slate-500">
            Severity
          </span>
          <div className="flex h-5 w-40 rounded overflow-hidden border border-[#1e1e2e]">
            {(["critical", "high", "medium", "low"] as Severity[]).map((s) => {
              const count = severityCounts[s];
              const pct = total > 0 ? (count / total) * 100 : 0;
              if (pct === 0) return null;
              return (
                <div
                  key={s}
                  className={`${severityColors[s]} flex items-center justify-center transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                  title={`${s}: ${count}`}
                >
                  {pct > 14 && (
                    <span className="text-[9px] font-mono font-medium text-black/70">
                      {count}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex gap-2 text-[10px] font-mono text-slate-500">
            {(["critical", "high", "medium", "low"] as Severity[]).map((s) => (
              <span key={s} className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${severityColors[s]}`} />
                {severityCounts[s]}
              </span>
            ))}
          </div>
        </div>

        {/* Narration toggle */}
        <button
          onClick={onToggleNarration}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[10px] font-medium transition-all ${
            narrationEnabled
              ? "border-[#3b82f6]/40 bg-[#3b82f6]/10 text-[#93c5fd]"
              : "border-[#1e1e2e] bg-transparent text-slate-600 hover:text-slate-400 hover:border-slate-600"
          }`}
          title={narrationEnabled ? "Disable AI narration" : "Enable AI narration"}
        >
          {narrationEnabled ? (
            <Radio size={11} className="text-[#3b82f6]" />
          ) : (
            <VolumeX size={11} />
          )}
          Narration
        </button>

        {/* AI status */}
        <div className="flex items-center gap-2 pl-4 border-l border-[#1e1e2e]">
          <motion.div
            animate={isBuilding ? { rotate: 360 } : { rotate: 0 }}
            transition={isBuilding ? { repeat: Infinity, duration: 3, ease: "linear" } : {}}
          >
            <Brain size={14} className="text-[#3b82f6]" />
          </motion.div>
          <span className="text-[11px] text-slate-400 max-w-[240px] truncate">
            {isBuilding && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse mr-1.5 align-middle" />
            )}
            {aiStatus}
          </span>
        </div>
      </div>
    </header>
  );
}
