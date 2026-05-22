import { useCallback, useEffect, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
  useReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import { motion } from "framer-motion";
import type { ActivityCard, EdgeType, TelecomEdge } from "../types";
import { ActivityCardNode } from "./ActivityCardNode";

const edgeColors: Record<EdgeType, string> = {
  call: "#3b82f6",
  sms: "#34d399",
  data: "#a78bfa",
  tower_ping: "#10b981",
  ip_route: "#8b5cf6",
};

const legendItems: { type: EdgeType; label: string }[] = [
  { type: "call", label: "Voice Call" },
  { type: "sms", label: "SMS" },
  { type: "data", label: "Data" },
  { type: "tower_ping", label: "Tower Ping" },
  { type: "ip_route", label: "IP Route" },
];

const nodeTypes = { activityCard: ActivityCardNode };

interface MindMapCanvasProps {
  cards: ActivityCard[];
  edges: TelecomEdge[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  isBuilding: boolean;
  highlightIds?: string[];
}

function FitViewOnBuild({ cardCount, isBuilding }: { cardCount: number; isBuilding: boolean }) {
  const { fitView } = useReactFlow();
  useEffect(() => {
    if (!isBuilding && cardCount > 0) {
      setTimeout(() => fitView({ padding: 0.2, duration: 600 }), 100);
    }
  }, [isBuilding, cardCount, fitView]);
  return null;
}

export function MindMapCanvas({
  cards,
  edges,
  selectedId,
  onSelect,
  isBuilding,
  highlightIds = [],
}: MindMapCanvasProps) {
  const { setCenter, fitView } = useReactFlow();

  const nodes: Node[] = useMemo(
    () =>
      cards.map((card) => ({
        id: card.id,
        type: "activityCard",
        position: card.position,
        data: {
          label: card.label,
          sublabel: card.sublabel,
          type: card.type,
          severity: card.severity,
          isNoise: card.isNoise,
          selected: selectedId === card.id,
        },
        style: {
          opacity: highlightIds.length > 0 && !highlightIds.includes(card.id) ? 0.25 : 1,
          transition: "opacity 0.4s",
        },
      })),
    [cards, selectedId, highlightIds]
  );

  const flowEdges: Edge[] = useMemo(
    () =>
      edges.map((e) => {
        const color = edgeColors[e.type] ?? "#475569";
        return {
          id: e.id,
          source: e.source,
          target: e.target,
          label: e.label,
          animated: isBuilding,
          labelStyle: { fill: color, fontSize: 9, fontFamily: "IBM Plex Mono", opacity: 0.85 },
          labelBgStyle: { fill: "#0a0a0f", fillOpacity: 0.85 },
          markerEnd: { type: MarkerType.ArrowClosed, color, width: 14, height: 14 },
          style: { stroke: color, strokeWidth: 1.5, opacity: 0.7 },
        };
      }),
    [edges, isBuilding]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onSelect(node.id === selectedId ? null : node.id);
    },
    [onSelect, selectedId]
  );

  const zoomToNodes = useCallback(
    (ids: string[]) => {
      const targetCards = cards.filter((c) => ids.includes(c.id));
      if (targetCards.length === 0) return;
      const cx =
        targetCards.reduce((s, c) => s + c.position.x, 0) / targetCards.length;
      const cy =
        targetCards.reduce((s, c) => s + c.position.y, 0) / targetCards.length;
      setCenter(cx, cy, { zoom: 1.2, duration: 800 });
    },
    [cards, setCenter]
  );

  useEffect(() => {
    (window as unknown as { nexusZoomTo?: (ids: string[]) => void }).nexusZoomTo =
      zoomToNodes;
    (window as unknown as { nexusFitView?: () => void }).nexusFitView = () =>
      fitView({ padding: 0.2, duration: 600 });
    return () => {
      delete (window as unknown as { nexusZoomTo?: unknown }).nexusZoomTo;
      delete (window as unknown as { nexusFitView?: unknown }).nexusFitView;
    };
  }, [zoomToNodes, fitView]);

  return (
    <div className="relative w-full h-full">
      {isBuilding && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.08) 0%, transparent 60%)",
              animation: "canvas-pulse 3s ease-in-out infinite",
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative w-32 h-32">
              <div
                className="absolute inset-0 rounded-full border border-[#3b82f6]/30"
                style={{ animation: "pulse-ring 2s ease-out infinite" }}
              />
              <div
                className="absolute inset-4 rounded-full border border-[#3b82f6]/20"
                style={{ animation: "pulse-ring 2s ease-out infinite 0.5s" }}
              />
            </div>
          </div>
        </motion.div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={() => onSelect(null)}
        fitView
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        className="bg-[#0a0a0f]"
      >
        <Background color="#1e1e2e" gap={24} size={1} />
        <Controls showInteractive={false} />
        <FitViewOnBuild cardCount={cards.length} isBuilding={isBuilding} />
      </ReactFlow>

      {/* Edge type legend */}
      <div className="absolute bottom-10 left-3 z-10 flex flex-col gap-1 bg-[#0a0a0f]/80 border border-[#1e1e2e] rounded-md px-3 py-2 backdrop-blur-sm">
        <p className="text-[9px] uppercase tracking-wider text-slate-600 mb-1">Connection Type</p>
        {legendItems.map(({ type, label }) => (
          <div key={type} className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <div className="w-5 h-px" style={{ background: edgeColors[type] }} />
              <div
                className="w-0 h-0"
                style={{
                  borderTop: "3px solid transparent",
                  borderBottom: "3px solid transparent",
                  borderLeft: `5px solid ${edgeColors[type]}`,
                }}
              />
            </div>
            <span className="text-[10px] text-slate-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
