import { AnimatePresence, motion } from "framer-motion";
import { Radio, Terminal } from "lucide-react";

interface AIActivityLogProps {
  messages: string[];
  isBuilding: boolean;
  narrationEnabled?: boolean;
}

export function AIActivityLog({ messages, isBuilding, narrationEnabled = false }: AIActivityLogProps) {
  return (
    <div className="absolute bottom-4 left-4 z-20 w-80 max-h-36 pointer-events-none">
      <div className="glass-card rounded-lg border border-[#1e1e2e] overflow-hidden pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 border-b border-[#1e1e2e] bg-[#0d0d14]/60">
          {narrationEnabled ? (
            <Radio size={11} className="text-[#3b82f6]" />
          ) : (
            <Terminal size={11} className="text-[#3b82f6]" />
          )}
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
            {narrationEnabled ? "AI Narration" : "AI Activity"}
          </span>
          {narrationEnabled && (
            <span className="ml-0.5 text-[9px] text-[#3b82f6]/50 font-medium">ON</span>
          )}
          {isBuilding && (
            <span className="ml-auto flex gap-0.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1 h-1 rounded-full bg-[#3b82f6] animate-pulse"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
            </span>
          )}
        </div>
        <div className="px-3 py-2 max-h-24 overflow-y-auto scrollbar-thin">
          <AnimatePresence mode="popLayout">
            {messages.slice(-5).map((msg, i) => (
              <motion.p
                key={`${msg}-${i}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-[10px] font-mono leading-relaxed mb-1 last:mb-0 ${
                  narrationEnabled ? "text-slate-300" : "text-slate-400"
                }`}
              >
                <span
                  className={`mr-1.5 ${narrationEnabled ? "text-[#3b82f6]/80" : "text-[#3b82f6]/60"}`}
                >
                  {narrationEnabled ? "▸" : "›"}
                </span>
                {msg}
              </motion.p>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
