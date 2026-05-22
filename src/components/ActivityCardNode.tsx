import { memo, useRef, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import {
  Activity,
  Globe,
  Radio,
  Smartphone,
  User,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { EntityType, Severity } from "../types";
import { cardTooltips, cardSeverityExplain } from "../data/caseData";
import { ExplainPopover } from "./ExplainPopover";

export interface CardNodeData {
  label: string;
  sublabel?: string;
  type: EntityType;
  severity: Severity;
  isNoise?: boolean;
  selected?: boolean;
  [key: string]: unknown;
}

const typeConfig: Record<
  EntityType,
  { icon: typeof Smartphone; color: string; border: string }
> = {
  phone: { icon: Smartphone, color: "#60a5fa", border: "rgba(96,165,250,0.35)" },
  ip: { icon: Globe, color: "#a78bfa", border: "rgba(167,139,250,0.35)" },
  person: { icon: User, color: "#f472b6", border: "rgba(244,114,182,0.35)" },
  tower: { icon: Radio, color: "#34d399", border: "rgba(52,211,153,0.35)" },
  device: { icon: Smartphone, color: "#fbbf24", border: "rgba(251,191,36,0.35)" },
  event: { icon: Activity, color: "#fb923c", border: "rgba(251,146,60,0.35)" },
};

const severityDot: Record<Severity, string> = {
  critical: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]",
  high: "bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.7)]",
  medium: "bg-yellow-500",
  low: "bg-slate-500",
};

const severityBorder: Record<Severity, string> = {
  critical: "severity-critical border-red-500/50",
  high: "severity-high border-orange-500/40",
  medium: "border-yellow-500/30",
  low: "border-slate-600/30",
};

function ActivityCardNodeComponent({ id, data, selected }: NodeProps) {
  const d = data as CardNodeData;
  const config = typeConfig[d.type];
  const Icon = config.icon;
  const isPromoted = d.severity === "critical" || d.severity === "high";
  const isMuted = d.isNoise || d.severity === "low";

  const [showTooltip, setShowTooltip] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tooltip = cardTooltips[id];
  const severityExplain = cardSeverityExplain[id];

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (tooltip) {
      hoverTimerRef.current = setTimeout(() => setShowTooltip(true), 1800);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setShowTooltip(false);
  };

  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-slate-600 !w-2 !h-2 !border-0" />

      {/* Hover tooltip */}
      <AnimatePresence>
        {showTooltip && tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 w-64 pointer-events-none"
          >
            <div className="glass-card rounded-lg border border-[#1e1e2e] px-3 py-2 shadow-xl shadow-black/60">
              <p className="text-[11px] text-slate-300 leading-relaxed">{tooltip}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`
          glass-card rounded-lg transition-all duration-500 cursor-pointer relative
          ${isPromoted ? "min-w-[200px] scale-105" : "min-w-[168px]"}
          ${isMuted ? "opacity-45 scale-90" : "opacity-100"}
          ${severityBorder[d.severity]}
          ${selected ? "ring-2 ring-[#3b82f6] ring-offset-1 ring-offset-[#0a0a0f]" : ""}
        `}
        style={{ borderColor: config.border }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-start gap-2.5 p-3">
          <div
            className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center"
            style={{ background: `${config.color}18`, color: config.color }}
          >
            <Icon size={16} strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${severityDot[d.severity]}`}
              />
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium flex-1 truncate">
                {d.type.replace("_", " ")}
              </span>
              {/* Severity "?" explain — only visible on hover */}
              {isHovered && severityExplain && (
                <ExplainPopover text={severityExplain} side="right" />
              )}
            </div>
            <p className="font-mono text-xs text-slate-100 truncate leading-tight">
              {d.label}
            </p>
            {d.sublabel && (
              <p className="text-[10px] text-slate-500 mt-0.5 truncate">{d.sublabel}</p>
            )}
          </div>
        </div>
        {d.severity === "critical" && (
          <div className="absolute -top-1 -right-1">
            <Zap size={12} className="text-red-400" fill="currentColor" />
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-slate-600 !w-2 !h-2 !border-0" />
    </>
  );
}

export const ActivityCardNode = memo(ActivityCardNodeComponent);
