import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  CheckCircle2,
  Circle,
  ArrowRight,
} from "lucide-react";
import { suggestedNextSteps, progressSteps } from "../data/caseData";

interface SuggestedNextStepsProps {
  onZoom: (nodeIds: string[]) => void;
  onSelectCard: (id: string) => void;
  isBuilding: boolean;
}

export function SuggestedNextSteps({
  onZoom,
  onSelectCard,
  isBuilding,
}: SuggestedNextStepsProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const activeSteps = suggestedNextSteps.filter((s) => !dismissed.has(s.id));
  const doneCount = progressSteps.filter((s) => s.done).length;
  const progressPct = (doneCount / progressSteps.length) * 100;

  const handleStep = (nodeIds: string[]) => {
    onZoom(nodeIds);
    if (nodeIds.length === 1) onSelectCard(nodeIds[0]);
  };

  return (
    <div
      className={`relative flex-shrink-0 border-r border-[#1e1e2e] bg-[#0d0d14]/90 flex flex-col transition-all duration-300 ${
        collapsed ? "w-9" : "w-60"
      }`}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-6 z-10 w-6 h-6 rounded-full bg-[#1a1a28] border border-[#1e1e2e] flex items-center justify-center text-slate-500 hover:text-slate-300 hover:border-slate-600 transition-colors"
      >
        {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
      </button>

      {/* Collapsed state */}
      {collapsed && (
        <div className="flex flex-col items-center pt-5 gap-2.5">
          <Compass size={13} className="text-[#3b82f6]/60" />
          {!isBuilding && activeSteps.length > 0 && (
            <span className="text-[9px] font-mono text-[#3b82f6]/50 font-medium">
              {activeSteps.length}
            </span>
          )}
        </div>
      )}

      {/* Expanded state */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="flex flex-col flex-1 min-h-0"
          >
            {/* Header */}
            <div className="flex items-center gap-2 px-3 py-3 border-b border-[#1e1e2e] flex-shrink-0">
              <Compass size={12} className="text-[#3b82f6]" />
              <span className="text-[11px] font-medium text-slate-300">Next Steps</span>
              {!isBuilding && activeSteps.length > 0 && (
                <span className="ml-auto text-[10px] font-mono bg-[#3b82f6]/15 text-[#93c5fd] px-1.5 py-0.5 rounded-full">
                  {activeSteps.length}
                </span>
              )}
            </div>

            {/* Steps list */}
            <div className="flex-1 overflow-y-auto scrollbar-thin p-2.5 space-y-2">
              {isBuilding ? (
                <>
                  {[80, 64, 72].map((_, i) => (
                    <div
                      key={i}
                      className="h-20 rounded-lg bg-[#1a1a28]/40 animate-pulse border border-[#1e1e2e]"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                  <p className="text-[10px] text-slate-700 text-center pt-1">
                    Analyzing case map...
                  </p>
                </>
              ) : activeSteps.length === 0 ? (
                <div className="pt-4 px-1 text-center">
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    All steps reviewed.
                  </p>
                  <p className="text-[10px] text-[#3b82f6]/40 mt-1 leading-relaxed">
                    New suggestions appear as the case develops.
                  </p>
                </div>
              ) : (
                activeSteps.map((step, i) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] p-2.5"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] font-mono text-[#3b82f6]/50 font-bold mt-0.5 flex-shrink-0 w-3">
                        {step.index}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-slate-200 leading-snug mb-1">
                          {step.title}
                        </p>
                        <p className="text-[10px] text-slate-500 leading-relaxed mb-2">
                          {step.description}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleStep(step.nodeIds)}
                            className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium text-[#93c5fd] bg-[#3b82f6]/15 border border-[#3b82f6]/25 hover:bg-[#3b82f6]/25 transition-colors"
                          >
                            {step.action}
                            <ArrowRight size={9} />
                          </button>
                          <button
                            onClick={() =>
                              setDismissed((d) => new Set([...d, step.id]))
                            }
                            className="text-[9px] text-slate-700 hover:text-slate-500 px-1 py-0.5 rounded transition-colors"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Progress section */}
            <div className="border-t border-[#1e1e2e] p-3 flex-shrink-0">
              <p className="text-[9px] uppercase tracking-wider text-slate-700 mb-2.5 font-medium">
                Investigation Progress
              </p>
              <div className="space-y-1.5 mb-3">
                {progressSteps.map((step) => (
                  <div key={step.id} className="flex items-center gap-2">
                    {step.done ? (
                      <CheckCircle2 size={10} className="text-emerald-500 flex-shrink-0" />
                    ) : (
                      <Circle size={10} className="text-slate-700 flex-shrink-0" />
                    )}
                    <span
                      className={`text-[10px] flex-1 ${
                        step.done ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {step.label}
                    </span>
                    {!step.done && (
                      <span className="text-[9px] text-slate-700">pending</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="h-1 bg-[#1e1e2e] rounded-full overflow-hidden mb-1.5">
                <motion.div
                  className="h-full bg-[#3b82f6] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <p className="text-[9px] text-slate-700">
                {doneCount}/{progressSteps.length} complete
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
