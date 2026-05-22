import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { SummaryPill } from "../types";

interface AISummaryStripProps {
  pills: SummaryPill[];
  visibleCount: number;
  onPillClick: (nodeIds: string[]) => void;
}

export function AISummaryStrip({
  pills,
  visibleCount,
  onPillClick,
}: AISummaryStripProps) {
  const visible = pills.slice(0, Math.min(visibleCount, pills.length));

  return (
    <div className="h-9 flex items-center gap-2 px-4 border-b border-[#1e1e2e] bg-[#0d0d14]/80 flex-shrink-0 overflow-x-auto scrollbar-thin">
      <Sparkles size={12} className="text-[#3b82f6] flex-shrink-0" />
      <span className="text-[10px] uppercase tracking-wider text-slate-500 flex-shrink-0 mr-1">
        AI Summary
      </span>
      {visible.map((pill, i) => (
        <motion.button
          key={pill.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.3 }}
          onClick={() => onPillClick(pill.nodeIds)}
          className="flex-shrink-0 px-3 py-1 rounded-full text-[11px] text-slate-300 bg-[#1a1a28] border border-[#2a2a3e] hover:border-[#3b82f6]/50 hover:text-[#93c5fd] transition-colors cursor-pointer"
        >
          {pill.text}
        </motion.button>
      ))}
      {visibleCount < pills.length && (
        <span className="text-[10px] text-slate-600 animate-pulse flex-shrink-0">
          Analyzing...
        </span>
      )}
    </div>
  );
}
