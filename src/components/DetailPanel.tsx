import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  Database,
  Lightbulb,
  MapPin,
  Radio,
  Shield,
  Bot,
  Link2,
} from "lucide-react";
import type { ActivityCard, CardDetail, TelecomEdge, EntityType } from "../types";
import { ExplainPopover } from "./ExplainPopover";
import { InteractionCoachFlash } from "./InteractionCoach";

type Tab = "raw" | "insights" | "timeline";

interface DetailPanelProps {
  card: ActivityCard | null;
  detail: CardDetail | null;
  allCards?: ActivityCard[];
  edges?: TelecomEdge[];
  coachMessage?: string | null;
}

const edgeTypeLabel: Record<string, string> = {
  call: "Voice Call",
  sms: "SMS",
  data: "Data Session",
  tower_ping: "Tower Ping",
  ip_route: "IP Route",
};

const edgeTypeColor: Record<string, string> = {
  call: "#3b82f6",
  sms: "#34d399",
  data: "#a78bfa",
  tower_ping: "#10b981",
  ip_route: "#8b5cf6",
};

const typeIconColor: Record<EntityType, string> = {
  phone: "#60a5fa",
  ip: "#a78bfa",
  person: "#f472b6",
  tower: "#34d399",
  device: "#fbbf24",
  event: "#fb923c",
};

export function DetailPanel({ card, detail, allCards = [], edges = [], coachMessage = null }: DetailPanelProps) {
  const [tab, setTab] = useState<Tab>("insights");

  if (!card || !detail) {
    return (
      <aside className="w-full border-l border-[#1e1e2e] bg-[#0d0d14]/90 flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-[240px]">
          <Database size={32} className="text-slate-700 mx-auto mb-3" />
          <p className="text-sm text-slate-500">
            Select an activity card to view raw telecom data, AI insights, and timeline.
          </p>
          <p className="text-[11px] text-slate-600 mt-2">
            Click any card on the map to begin.
          </p>
        </div>
      </aside>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof Database }[] = [
    { id: "raw", label: "Raw Data", icon: Database },
    { id: "insights", label: "Insights", icon: Lightbulb },
    { id: "timeline", label: "Timeline", icon: Clock },
  ];

  // Compute connected entities for this card
  const connectedEdges = edges.filter(
    (e) => e.source === card.id || e.target === card.id
  );
  const connections = connectedEdges
    .map((e) => {
      const otherId = e.source === card.id ? e.target : e.source;
      const direction = e.source === card.id ? "out" : "in";
      const other = allCards.find((c) => c.id === otherId);
      return other ? { card: other, edge: e, direction } : null;
    })
    .filter(Boolean) as { card: ActivityCard; edge: TelecomEdge; direction: "in" | "out" }[];

  return (
    <aside className="w-full border-l border-[#1e1e2e] bg-[#0d0d14]/90 flex flex-col">
      {/* Card header */}
      <div className="p-4 border-b border-[#1e1e2e]">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`w-2 h-2 rounded-full ${
              card.severity === "critical"
                ? "bg-red-500"
                : card.severity === "high"
                  ? "bg-orange-500"
                  : card.severity === "medium"
                    ? "bg-yellow-500"
                    : "bg-slate-500"
            }`}
          />
          <span className="text-[10px] uppercase tracking-wider text-slate-500">
            {card.type}
          </span>
        </div>
        <h2 className="font-mono text-sm text-slate-100">{card.label}</h2>
        {card.sublabel && (
          <p className="text-xs text-slate-500 mt-0.5">{card.sublabel}</p>
        )}
      </div>

      {/* Interaction coach flash */}
      <InteractionCoachFlash message={coachMessage} />

      {/* Connected entities strip */}
      {connections.length > 0 && (
        <div className="px-4 py-3 border-b border-[#1e1e2e] bg-[#0a0a0f]/50">
          <div className="flex items-center gap-1.5 mb-2">
            <Link2 size={10} className="text-slate-500" />
            <span className="text-[10px] uppercase tracking-wider text-slate-500">
              {connections.length} connection{connections.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {connections.map(({ card: other, edge }) => {
              const color = edgeTypeColor[edge.type] ?? "#475569";
              const entityColor = typeIconColor[other.type] ?? "#64748b";
              return (
                <div
                  key={edge.id}
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-mono border"
                  style={{
                    borderColor: `${color}40`,
                    background: `${color}0d`,
                    color: "#94a3b8",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: entityColor }}
                  />
                  <span
                    className="font-medium truncate max-w-[90px]"
                    style={{ color: entityColor }}
                    title={other.label}
                  >
                    {other.label}
                  </span>
                  <span className="text-slate-600 mx-0.5">·</span>
                  <span style={{ color }}>{edgeTypeLabel[edge.type] ?? edge.type}</span>
                  {edge.label && (
                    <>
                      <span className="text-slate-600 mx-0.5">·</span>
                      <span className="text-slate-500">{edge.label}</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex border-b border-[#1e1e2e]">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-medium transition-colors ${
              tab === t.id
                ? "text-[#93c5fd] border-b-2 border-[#3b82f6] bg-[#3b82f6]/5"
                : "text-slate-500 hover:text-slate-300 border-b-2 border-transparent"
            }`}
          >
            <t.icon size={12} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        {tab === "raw" && <RawDataTab card={card} detail={detail} />}
        {tab === "insights" && <InsightsTab detail={detail} />}
        {tab === "timeline" && <TimelineTab detail={detail} />}
      </div>
    </aside>
  );
}

function RawDataTab({ card, detail }: { card: ActivityCard; detail: CardDetail }) {
  if (card.type === "phone" && detail.cdrs) {
    return (
      <div>
        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-3">
          Recent CDRs
        </p>
        <div className="space-y-2">
          {detail.cdrs.map((cdr, i) => (
            <div
              key={i}
              className="glass-card rounded p-2.5 border border-[#1e1e2e] text-[11px]"
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                    cdr.direction === "out"
                      ? "bg-orange-500/15 text-orange-400"
                      : "bg-emerald-500/15 text-emerald-400"
                  }`}
                >
                  {cdr.direction === "out" ? "OUT" : "IN"}
                </span>
                <span className="font-mono text-slate-500">{cdr.time}</span>
              </div>
              <p className="font-mono text-slate-200">{cdr.number}</p>
              <div className="flex gap-3 mt-1 text-slate-500">
                <span>{cdr.duration}</span>
                <span>Tower {cdr.tower}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (card.type === "tower") {
    return (
      <div>
        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-3">
          Coverage Area
        </p>
        <div className="glass-card rounded-lg border border-[#1e1e2e] h-40 relative overflow-hidden mb-3">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(#1e1e2e 1px, transparent 1px),
                linear-gradient(90deg, #1e1e2e 1px, transparent 1px)
              `,
              backgroundSize: "16px 16px",
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-24 h-24 rounded-full border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center">
              <Radio size={20} className="text-emerald-400" />
            </div>
          </div>
          <MapPin
            size={12}
            className="absolute top-3 right-3 text-slate-500"
          />
          <span className="absolute bottom-2 left-2 font-mono text-[10px] text-slate-500">
            {String(detail.rawData.lat)}, {String(detail.rawData.lng)}
          </span>
        </div>
        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">
          Suspect Pings
        </p>
        <ul className="space-y-1.5 text-[11px]">
          <li className="flex justify-between text-slate-400">
            <span className="font-mono">+1 (312) 555-0142</span>
            <span>May 10 02:14</span>
          </li>
          <li className="flex justify-between text-slate-400">
            <span className="font-mono">IMEI 352099...</span>
            <span>May 10 02:18</span>
          </li>
          <li className="flex justify-between text-slate-400">
            <span className="font-mono">+1 (773) 555-0891</span>
            <span>May 10 02:41</span>
          </li>
        </ul>
      </div>
    );
  }

  if (card.type === "ip") {
    return (
      <div>
        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-3">
          Traffic Logs
        </p>
        <div className="space-y-1 font-mono text-[11px]">
          {[
            { time: "02:20:14", bytes: "14.2 KB", proto: "TLS 1.3" },
            { time: "02:35:02", bytes: "892 KB", proto: "TLS 1.3" },
            { time: "03:12:44", bytes: "2.1 MB", proto: "TLS 1.3" },
            { time: "04:28:01", bytes: "48 KB", proto: "TLS 1.3" },
          ].map((log, i) => (
            <div
              key={i}
              className="flex justify-between py-1.5 border-b border-[#1e1e2e]/50 text-slate-400"
            >
              <span className="text-slate-500">{log.time}</span>
              <span className="text-slate-300">{log.bytes}</span>
              <span className="text-[#93c5fd]">{log.proto}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-2.5 glass-card rounded text-[11px]">
          {Object.entries(detail.rawData).map(([k, v]) => (
            <div key={k} className="flex justify-between py-0.5">
              <span className="text-slate-500 capitalize">{k.replace("_", " ")}</span>
              <span className="font-mono text-slate-300">{String(v)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {Object.entries(detail.rawData).map(([k, v]) => (
        <div
          key={k}
          className="flex justify-between py-2 border-b border-[#1e1e2e]/50 text-[11px]"
        >
          <span className="text-slate-500 capitalize">{k.replace("_", " ")}</span>
          <span className="font-mono text-slate-300">{String(v)}</span>
        </div>
      ))}
    </div>
  );
}

function InsightsTab({ detail }: { detail: CardDetail }) {
  const hasOfficerInsights = detail.officerInsights && detail.officerInsights.length > 0;

  return (
    <div className="space-y-5">
      {/* Officer Insights */}
      {hasOfficerInsights && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Shield size={11} className="text-amber-400" />
            <span className="text-[10px] uppercase tracking-wider text-amber-500/80 font-medium">
              Officer Notes
            </span>
          </div>
          <div className="space-y-3">
            {detail.officerInsights!.map((insight, i) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-lg p-3 border border-amber-500/20 bg-amber-500/5"
              >
                <p className="text-[11px] text-slate-300 leading-relaxed">{insight.text}</p>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-amber-500/15">
                  <div className="flex items-center gap-1.5">
                    <Shield size={10} className="text-amber-500/70" />
                    <span className="text-[10px] text-amber-400/80 font-medium">
                      {insight.officer}
                    </span>
                    <span className="font-mono text-[9px] text-slate-600">{insight.badge}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-600">{insight.timestamp}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Bot size={11} className="text-[#93c5fd]" />
          <span className="text-[10px] uppercase tracking-wider text-[#93c5fd]/70 font-medium">
            AI Analysis
          </span>
        </div>
        <div className="space-y-3">
          {detail.insights.map((insight, i) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (hasOfficerInsights ? (detail.officerInsights!.length * 0.08) : 0) + i * 0.1 }}
              className="glass-card rounded-lg p-3 border border-[#1e1e2e]"
            >
              <p className="text-[11px] text-slate-300 leading-relaxed">{insight.text}</p>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#1e1e2e]/50">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-16 bg-[#1e1e2e] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#3b82f6] rounded-full"
                      style={{ width: `${insight.confidence}%` }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">
                    {insight.confidence}%
                  </span>
                  {insight.explain && (
                    <ExplainPopover text={insight.explain} side="right" />
                  )}
                </div>
                <button className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium text-[#93c5fd] bg-[#3b82f6]/15 border border-[#3b82f6]/25 hover:bg-[#3b82f6]/25 transition-colors">
                  {insight.action}
                  <ArrowRight size={10} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TimelineTab({ detail }: { detail: CardDetail }) {
  return (
    <div className="relative pl-4">
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#1e1e2e]" />
      {detail.timeline.map((item, i) => (
        <div key={i} className="relative mb-4 last:mb-0">
          <div className="absolute -left-4 top-1 w-2 h-2 rounded-full bg-[#3b82f6] border-2 border-[#0d0d14]" />
          <p className="font-mono text-[10px] text-[#93c5fd]">{item.time}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{item.event}</p>
        </div>
      ))}
    </div>
  );
}
