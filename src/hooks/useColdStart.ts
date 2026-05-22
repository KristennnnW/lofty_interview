import { useCallback, useEffect, useState } from "react";
import { aiLogMessages, cards, edges } from "../data/caseData";
import type { ActivityCard, TelecomEdge } from "../types";

const RING_DELAYS = [0, 1200, 2400, 3600, 4800];
const EDGE_DELAY_OFFSET = 400;

export function useColdStart() {
  const [visibleCardIds, setVisibleCardIds] = useState<Set<string>>(new Set());
  const [visibleEdgeIds, setVisibleEdgeIds] = useState<Set<string>>(new Set());
  const [isBuilding, setIsBuilding] = useState(true);
  const [logIndex, setLogIndex] = useState(0);
  const [aiStatus, setAiStatus] = useState("Initializing case workspace...");

  const visibleCards = cards.filter((c) => visibleCardIds.has(c.id));
  const visibleEdges = edges.filter((e) => visibleEdgeIds.has(e.id));

  const addLog = useCallback((index: number) => {
    if (index < aiLogMessages.length) {
      setLogIndex(index);
      setAiStatus(aiLogMessages[index]);
    }
  }, []);

  useEffect(() => {
    const seeds = cards.filter((c) => c.isSeed);
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(
      setTimeout(() => {
        setVisibleCardIds(new Set(seeds.map((s) => s.id)));
        addLog(2);
      }, 800)
    );

    for (let ring = 1; ring <= 4; ring++) {
      const ringCards = cards.filter((c) => c.ring === ring);
      const delay = RING_DELAYS[ring] ?? ring * 1200;

      timers.push(
        setTimeout(() => {
          setVisibleCardIds((prev) => {
            const next = new Set(prev);
            ringCards.forEach((c) => next.add(c.id));
            return next;
          });
          addLog(ring + 4);
        }, delay)
      );

      const ringEdges = edges.filter((e) => {
        const src = cards.find((c) => c.id === e.source);
        const tgt = cards.find((c) => c.id === e.target);
        return src && tgt && Math.max(src.ring, tgt.ring) <= ring;
      });

      timers.push(
        setTimeout(() => {
          setVisibleEdgeIds((prev) => {
            const next = new Set(prev);
            ringEdges.forEach((e) => next.add(e.id));
            return next;
          });
        }, delay + EDGE_DELAY_OFFSET)
      );
    }

    aiLogMessages.forEach((_, i) => {
      if (i < 2 || i > 11) return;
      timers.push(setTimeout(() => addLog(i), i * 450));
    });

    timers.push(
      setTimeout(() => {
        setIsBuilding(false);
        addLog(aiLogMessages.length - 1);
      }, 6200)
    );

    return () => timers.forEach(clearTimeout);
  }, [addLog]);

  return {
    visibleCards,
    visibleEdges,
    isBuilding,
    logMessages: aiLogMessages.slice(0, logIndex + 1),
    logIndex,
    aiStatus,
    allCards: cards as ActivityCard[],
    allEdges: edges as TelecomEdge[],
  };
}
