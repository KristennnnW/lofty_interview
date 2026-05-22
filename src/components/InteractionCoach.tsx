import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type CoachAction = "card_select" | "ai_act";

const COACH_MESSAGES: Record<CoachAction, string> = {
  card_select: "Card selected — showing all related telecom data, AI analysis, and officer notes.",
  ai_act: "Action queued — the flagged item has been added for follow-up review.",
};

const MAX_SHOWS = 3;
const STORAGE_KEY = "nexus_coach_v1";

function getCounts(): Partial<Record<CoachAction, number>> {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function incrementCount(action: CoachAction): number {
  const counts = getCounts();
  const next = (counts[action] ?? 0) + 1;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...counts, [action]: next }));
  return next;
}

export function useInteractionCoach() {
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  const trigger = useCallback((action: CoachAction) => {
    const count = incrementCount(action);
    if (count <= MAX_SHOWS) {
      setActiveMessage(COACH_MESSAGES[action]);
      setTimeout(() => setActiveMessage(null), 2800);
    }
  }, []);

  return { activeMessage, trigger };
}

export function InteractionCoachFlash({ message }: { message: string | null }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mx-4 mt-2 px-3 py-1.5 rounded text-[10px] text-[#93c5fd]/80 bg-[#3b82f6]/08 border border-[#3b82f6]/20"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
