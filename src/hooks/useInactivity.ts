import { useEffect, useRef, useState } from "react";

export function useInactivity(timeoutMs: number, enabled: boolean) {
  const [showGuidance, setShowGuidance] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActivityRef = useRef(Date.now());

  const showGuidanceRef = useRef(false);

  const resetTimer = () => {
    lastActivityRef.current = Date.now();
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!enabled || dismissed) return;
    // Don't hide once visible — let the user dismiss it manually
    if (!showGuidanceRef.current) {
      timerRef.current = setTimeout(() => {
        showGuidanceRef.current = true;
        setShowGuidance(true);
      }, timeoutMs);
    }
  };

  const dismiss = () => {
    showGuidanceRef.current = false;
    setDismissed(true);
    setShowGuidance(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  useEffect(() => {
    if (!enabled || dismissed) return;

    const events = ["mousedown", "mousemove", "keydown", "wheel", "touchstart"];
    const handler = () => resetTimer();

    events.forEach((e) => window.addEventListener(e, handler));
    resetTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, handler));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [enabled, dismissed, timeoutMs]);

  return { showGuidance, dismiss, resetTimer };
}
