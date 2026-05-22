import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, HelpCircle } from "lucide-react";

interface ExplainPopoverProps {
  text: string;
  side?: "left" | "right" | "top";
  className?: string;
}

export function ExplainPopover({ text, side = "left", className = "" }: ExplainPopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const popoverPosition =
    side === "left"
      ? "right-full mr-2 top-0"
      : side === "right"
      ? "left-full ml-2 top-0"
      : "bottom-full mb-2 left-1/2 -translate-x-1/2";

  return (
    <div className={`relative inline-flex items-center flex-shrink-0 ${className}`} ref={ref}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
          open
            ? "text-[#93c5fd] bg-[#3b82f6]/20"
            : "text-slate-600 hover:text-slate-400 hover:bg-[#1e1e2e]"
        }`}
        title="Explain this"
      >
        <HelpCircle size={11} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.93 }}
            transition={{ duration: 0.14 }}
            className={`absolute z-50 w-60 ${popoverPosition}`}
          >
            <div className="glass-card rounded-lg border border-[#3b82f6]/25 p-3 shadow-2xl shadow-black/60">
              <div className="flex items-center gap-1.5 mb-2">
                <Bot size={11} className="text-[#3b82f6]" />
                <span className="text-[9px] uppercase tracking-wider text-[#3b82f6]/70 font-medium">
                  AI Explanation
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">{text}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
