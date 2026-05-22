import { useCallback, useEffect, useMemo, useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { CASE_NAME, getDefaultDetail, narrationMessages, summaryPills } from "./data/caseData";
import { useColdStart } from "./hooks/useColdStart";
import { useInactivity } from "./hooks/useInactivity";
import { useInteractionCoach } from "./components/InteractionCoach";
import type { Severity } from "./types";
import { TopBar } from "./components/TopBar";
import { AISummaryStrip } from "./components/AISummaryStrip";
import { MindMapCanvas } from "./components/MindMapCanvas";
import { AIActivityLog } from "./components/AIActivityLog";
import { AIGuidancePrompt } from "./components/AIGuidancePrompt";
import { DetailPanel } from "./components/DetailPanel";
import { OnboardingCard } from "./components/OnboardingCard";
import { CoachOverlay } from "./components/CoachOverlay";
import { SuggestedNextSteps } from "./components/SuggestedNextSteps";
import { EmptyStateNudge } from "./components/EmptyStateNudge";

function App() {
  const {
    visibleCards,
    visibleEdges,
    isBuilding,
    logMessages,
    logIndex,
    aiStatus,
  } = useColdStart();

  // Guidance layer state
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showCoach, setShowCoach] = useState(false);
  const [narrationEnabled, setNarrationEnabled] = useState(true);

  // Map interaction state
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [highlightIds, setHighlightIds] = useState<string[]>([]);
  const [pillCount, setPillCount] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Interaction coaching
  const { activeMessage, trigger } = useInteractionCoach();

  // Inactivity guidance — only after onboarding + build complete
  const { showGuidance, dismiss } = useInactivity(15000, !isBuilding && !showOnboarding);

  // Derived state
  const selectedCard = visibleCards.find((c) => c.id === selectedId) ?? null;
  const detail = selectedId ? getDefaultDetail(selectedId) : null;

  // Messages to show in the log
  const displayMessages = useMemo(
    () =>
      narrationEnabled
        ? narrationMessages.slice(0, logIndex + 1)
        : logMessages,
    [narrationEnabled, logIndex, logMessages]
  );

  const severityCounts = useMemo(() => {
    const counts: Record<Severity, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };
    visibleCards.forEach((c) => counts[c.severity]++);
    return counts;
  }, [visibleCards]);

  // Handlers
  const handleStartInvestigation = useCallback(() => {
    setShowOnboarding(false);
    setShowCoach(true);
  }, []);

  const handleSelectCard = useCallback(
    (id: string | null) => {
      setSelectedId(id);
      if (id) {
        setHasInteracted(true);
        setShowCoach(false);
        trigger("card_select");
      }
    },
    [trigger]
  );

  const handlePillClick = useCallback((nodeIds: string[]) => {
    setHighlightIds(nodeIds);
    setHasInteracted(true);
    const zoom = (window as unknown as { nexusZoomTo?: (ids: string[]) => void }).nexusZoomTo;
    zoom?.(nodeIds);
    setTimeout(() => setHighlightIds([]), 4000);
  }, []);

  const handleHighlight = useCallback((nodeIds: string[]) => {
    setHighlightIds(nodeIds);
    setHasInteracted(true);
    const zoom = (window as unknown as { nexusZoomTo?: (ids: string[]) => void }).nexusZoomTo;
    zoom?.(nodeIds);
    setTimeout(() => setHighlightIds([]), 5000);
  }, []);

  // Pill animation
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    summaryPills.forEach((_, i) => {
      timers.push(setTimeout(() => setPillCount(i + 1), 2000 + i * 800));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f]">
      <TopBar
        caseName={CASE_NAME}
        severityCounts={severityCounts}
        aiStatus={aiStatus}
        isBuilding={isBuilding}
        narrationEnabled={narrationEnabled}
        onToggleNarration={() => setNarrationEnabled((n) => !n)}
      />
      <AISummaryStrip
        pills={summaryPills}
        visibleCount={isBuilding ? pillCount : summaryPills.length}
        onPillClick={handlePillClick}
      />

      <div className="flex-1 flex min-h-0">
        {/* Left sidebar — Suggested Next Steps */}
        <SuggestedNextSteps
          onZoom={handlePillClick}
          onSelectCard={(id) => handleSelectCard(id)}
          isBuilding={isBuilding || showOnboarding}
        />

        {/* Main canvas */}
        <main className="flex-1 relative min-w-0">
          <ReactFlowProvider>
            <MindMapCanvas
              cards={visibleCards}
              edges={visibleEdges}
              selectedId={selectedId}
              onSelect={handleSelectCard}
              isBuilding={isBuilding}
              highlightIds={highlightIds}
            />
          </ReactFlowProvider>

          {/* Onboarding overlay */}
          {showOnboarding && <OnboardingCard onStart={handleStartInvestigation} />}

          <AIActivityLog
            messages={displayMessages}
            isBuilding={isBuilding}
            narrationEnabled={narrationEnabled}
          />

          {/* Guidance prompt — gated behind onboarding + no empty nudge */}
          <AIGuidancePrompt
            visible={showGuidance && !showOnboarding}
            onDismiss={dismiss}
            onHighlight={handleHighlight}
          />

          {/* Empty state nudge — gated behind guidance prompt visibility */}
          <EmptyStateNudge
            isBuilding={isBuilding || showOnboarding}
            hasInteracted={hasInteracted || showGuidance}
          />
        </main>

        {/* Right panel — Detail + Coach overlay */}
        <div className="relative w-[30%] min-w-[320px] flex-shrink-0">
          <CoachOverlay
            visible={showCoach && !selectedId}
            onDismiss={() => setShowCoach(false)}
          />
          <DetailPanel
            card={selectedCard}
            detail={detail}
            allCards={visibleCards}
            edges={visibleEdges}
            coachMessage={activeMessage}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
