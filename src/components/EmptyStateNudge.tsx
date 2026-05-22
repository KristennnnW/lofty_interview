import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";

const NUDGES = [
  {
    id: "n1",
    text: "This number has 47 connections I haven't loaded yet. Want me to expand?",
    action: "Expand",
  },
  {
    id: "n2",
    text: "I can check if any of these numbers appear in other open cases. Want me to run that?",
    action: "Run check",
  },
];

interface EmptyStateNudgeProps {
  isBuilding: boolean;
  hasInteracted: boolean;
}

export function EmptyStateNudge({ isBuilding, hasInteracted }: EmptyStateNudgeProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isBuilding || hasInteracted) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setVisible(false);
      return;
    }
    timerRef.current = setTimeout(() => setVisible(true), 30000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isBuilding, hasInteracted]);

  const activeNudges = NUDGES.filter((n) => !dismissed.has(n.id));

  if (!visible || activeNudges.length === 0) return null;

  return (
    <div className="absolute bottom-40 left-1/2 -translate-x-1/2 z-10 flex flex-col gap-2.5 items-center pointer-events-none">
      <AnimatePresence>
        {activeNudges.map((nudge, i) => (
          <motion.div
            key={nudge.id}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ delay: i * 0.25, type: "spring", stiffness: 300, damping: 28 }}
            className="pointer-events-auto"
          >
            <div className="glass-card rounded-xl border border-[#3b82f6]/20 px-4 py-3 flex items-center gap-3 shadow-xl shadow-black/50 max-w-[300px]">
              <Sparkles size={13} className="text-[#3b82f6] flex-shrink-0" />
              <p className="text-[11px] text-slate-300 leading-relaxed flex-1">
                {nudge.text}
              </p>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => setDismissed((d) => new Set([...d, nudge.id]))}
                  className="px-2 py-0.5 rounded text-[10px] font-medium text-[#93c5fd] bg-[#3b82f6]/15 border border-[#3b82f6]/25 hover:bg-[#3b82f6]/25 transition-colors whitespace-nowrap"
                >
                  {nudge.action}
                </button>
                <button
                  onClick={() => setDismissed((d) => new Set([...d, nudge.id]))}
                  className="text-slate-600 hover:text-slate-400 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
