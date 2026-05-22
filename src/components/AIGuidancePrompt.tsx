import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { guidancePrompts } from "../data/caseData";

interface AIGuidancePromptProps {
  visible: boolean;
  onDismiss: () => void;
  onHighlight: (nodeIds: string[]) => void;
}

export function AIGuidancePrompt({
  visible,
  onDismiss,
  onHighlight,
}: AIGuidancePromptProps) {
  const prompt = guidancePrompts[0];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 340, damping: 26 }}
          className="absolute bottom-5 right-5 z-20 w-88"
          style={{ width: "22rem" }}
        >
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-xl bg-[#3b82f6]/10 blur-xl -z-10" />
          <div className="rounded-xl border border-[#3b82f6]/50 bg-[#0d0d1a]/95 shadow-2xl shadow-[#3b82f6]/20 backdrop-blur-md overflow-hidden">
            {/* Top accent bar */}
            <div className="h-0.5 w-full bg-gradient-to-r from-[#3b82f6]/0 via-[#3b82f6] to-[#3b82f6]/0" />
            <div className="p-4">
              {/* Header row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#3b82f6]/20 border border-[#3b82f6]/40 flex items-center justify-center">
                    <Sparkles size={12} className="text-[#3b82f6]" />
                  </div>
                  <span className="text-[11px] uppercase tracking-widest text-[#3b82f6] font-semibold">
                    AI Insight
                  </span>
                </div>
                <button
                  onClick={onDismiss}
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label="Dismiss"
                >
                  <X size={15} />
                </button>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed mb-4">{prompt.text}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onHighlight(prompt.nodeIds);
                    onDismiss();
                  }}
                  className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold bg-[#3b82f6]/25 text-[#93c5fd] border border-[#3b82f6]/50 hover:bg-[#3b82f6]/40 hover:border-[#3b82f6]/70 transition-all"
                >
                  Highlight nodes
                </button>
                <button
                  onClick={onDismiss}
                  className="px-3 py-2 rounded-lg text-xs text-slate-400 border border-slate-700 hover:text-slate-200 hover:border-slate-500 transition-all"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
