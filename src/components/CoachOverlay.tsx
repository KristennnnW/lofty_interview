import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, X } from "lucide-react";

const MESSAGES = [
  "I'm pulling all telecom activity connected to your starting point.",
  "Cards closer to the center are higher priority — severity is shown by the colored dot.",
  "Severity is determined by call frequency, timing anomalies, and cross-case matches.",
  "Click any card to see raw telecom data, AI analysis, and officer field notes.",
];

interface CoachOverlayProps {
  visible: boolean;
  onDismiss: () => void;
}

export function CoachOverlay({ visible, onDismiss }: CoachOverlayProps) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (!visible) { setMsgIndex(0); return; }

    const interval = setInterval(() => {
      setMsgIndex((i) => {
        if (i >= MESSAGES.length - 1) { clearInterval(interval); return i; }
        return i + 1;
      });
    }, 2200);

    const autoClose = setTimeout(onDismiss, 10000);

    return () => { clearInterval(interval); clearTimeout(autoClose); };
  }, [visible, onDismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0d0d14]/96 backdrop-blur-sm cursor-pointer"
          onClick={onDismiss}
        >
          <button
            onClick={(e) => { e.stopPropagation(); onDismiss(); }}
            className="absolute top-4 right-4 text-slate-600 hover:text-slate-400 transition-colors"
          >
            <X size={14} />
          </button>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 25 }}
            className="w-14 h-14 rounded-2xl bg-[#3b82f6]/12 border border-[#3b82f6]/25 flex items-center justify-center mb-6"
          >
            <Bot size={26} className="text-[#3b82f6]" strokeWidth={1.5} />
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.p
              key={msgIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center text-[13px] text-slate-300 leading-relaxed max-w-[230px] mb-8 px-4"
            >
              {MESSAGES[msgIndex]}
            </motion.p>
          </AnimatePresence>

          {/* Progress dots */}
          <div className="flex gap-2 mb-6">
            {MESSAGES.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === msgIndex
                    ? "w-4 h-1.5 bg-[#3b82f6]"
                    : i < msgIndex
                    ? "w-1.5 h-1.5 bg-[#3b82f6]/40"
                    : "w-1.5 h-1.5 bg-[#1e1e2e]"
                }`}
              />
            ))}
          </div>

          <p className="text-[10px] text-slate-600">Click anywhere to dismiss</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
