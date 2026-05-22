export type EntityType =
  | "phone"
  | "ip"
  | "person"
  | "tower"
  | "device"
  | "event";

export type Severity = "critical" | "high" | "medium" | "low";

export type EdgeType = "call" | "sms" | "data" | "tower_ping" | "ip_route";

export interface ActivityCard {
  id: string;
  type: EntityType;
  label: string;
  sublabel?: string;
  severity: Severity;
  relevance: number;
  ring: number;
  isSeed?: boolean;
  isNoise?: boolean;
  position: { x: number; y: number };
}

export interface TelecomEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  label?: string;
}

export interface AIInsight {
  id: string;
  text: string;
  confidence: number;
  action: string;
  explain?: string;
}

export interface OfficerInsight {
  id: string;
  text: string;
  officer: string;
  badge: string;
  timestamp: string;
}

export interface SummaryPill {
  id: string;
  text: string;
  nodeIds: string[];
}

export interface CDRRecord {
  direction: "in" | "out";
  number: string;
  time: string;
  duration: string;
  tower: string;
}

export interface CardDetail {
  rawData: Record<string, unknown>;
  cdrs?: CDRRecord[];
  insights: AIInsight[];
  officerInsights?: OfficerInsight[];
  timeline: { time: string; event: string }[];
}
