import type {
  ActivityCard,
  CardDetail,
  SummaryPill,
  TelecomEdge,
} from "../types";

export const cardTooltips: Record<string, string> = {
  "seed-phone-1": "Primary suspect — 14 calls to a fresh burner in 48 hr, no prior CDR history in any case.",
  "seed-ip-1": "C2 endpoint — 847 sessions to the suspect device in 72 hr, 340% above regional baseline.",
  "phone-burner": "SIM activated 48 hr before the incident with zero prior history — classic burner signature.",
  "person-1": "Financial records link this POI directly to the burner activation via wire transfer 24 hr prior.",
  "device-imei": "Tower handoffs show 12 km covered in under 8 min — requires a vehicle, not on foot.",
  "tower-441": "All 3 suspect devices co-located here during the incident window. Coverage overlaps crime scene by 400 m.",
  "event-incident": "The 02:14–04:32 window aligns with every call, ping, and data session spike in this case.",
  "phone-assoc": "6 calls to the suspect in 48 hr with no prior CDR relationship — unexplained contact pattern.",
  "ip-vpn": "Known VPN exit node — C2 traffic is tunneling through here to obscure the true origin.",
  "tower-892": "Handoff destination from Tower #441 — 12 km away, reached in under 8 minutes.",
  "event-sms-burst": "47 messages in 12 minutes — consistent with a pre-planned coordination signal burst.",
  "phone-noise-1": "Toll-free number with no prior connections to case entities. Likely noise.",
  "phone-noise-2": "Business landline — no call history linking it to suspect numbers.",
  "ip-noise": "Google Public DNS resolver — standard network traffic, not case-relevant.",
  "tower-noise": "Routine ping from a non-suspect device outside the incident window.",
};

export const cardSeverityExplain: Record<string, string> = {
  "seed-phone-1": "Marked CRITICAL because it initiated 14 calls to a known burner and shares a tower ping window with 2 other suspect devices during the incident. It's the root node of the entire communication chain.",
  "seed-ip-1": "Marked CRITICAL because this endpoint has 847 sessions to the suspect device — 340% above baseline — and is registered to a shell company with no legitimate business presence.",
  "phone-burner": "Marked CRITICAL because this SIM was activated 48 hours before the incident with zero prior CDR history, was used exclusively during the incident window, then went dark — a textbook operational burner.",
  "person-1": "Marked HIGH because financial records tie this individual to the burner activation via wire transfer 24 hours prior. He has appeared in 2 prior linked cases.",
  "device-imei": "Marked HIGH because this IMEI is linked to the suspect account and its tower handoff pattern — 12 km in 8 minutes — is only possible in a vehicle, placing the suspect in active transit during the incident.",
  "tower-441": "Marked HIGH because all 3 suspect devices registered pings here during the incident window, and the tower coverage overlaps the reported crime scene location by 400 meters.",
  "event-incident": "Marked HIGH because this 2-hour window contains every anomalous call, data session, and SMS burst in the case. It is the temporal focal point of all suspect activity.",
  "phone-assoc": "Marked MEDIUM because 6 unexplained calls to the primary suspect in 48 hours is above normal contact frequency, but call volume is lower and it hasn't been co-located at the tower level.",
};

export const suggestedNextSteps = [
  {
    id: "s1",
    index: 1,
    title: "Examine the burner cluster",
    description: "+1 (773) 555-0891 connects to 3 entities with no prior case history — high-value subgraph worth drilling into.",
    action: "Zoom to cluster",
    nodeIds: ["phone-burner", "event-sms-burst", "person-1"],
  },
  {
    id: "s2",
    index: 2,
    title: "Timeline gap: 2:00–3:15am",
    description: "Device IMEI shows no activity for 75 min during the incident window — possible intentional shutdown.",
    action: "View timeline",
    nodeIds: ["device-imei"],
  },
  {
    id: "s3",
    index: 3,
    title: "Investigate the VPN route",
    description: "45.33.32.156 is a known VPN exit node — traffic from the C2 IP is tunneling through it to hide origin.",
    action: "View IP data",
    nodeIds: ["ip-vpn", "seed-ip-1"],
  },
  {
    id: "s4",
    index: 4,
    title: "Cross-reference Case #4412",
    description: "C2 endpoint and Tower #441 both appeared in Case #4412 — possible geographic and network overlap.",
    action: "Compare",
    nodeIds: ["seed-ip-1", "tower-441"],
  },
  {
    id: "s5",
    index: 5,
    title: "Validate Marcus V. Hale's role",
    description: "Financial records suggest direct funding of the burner 24 hr prior. A warrant may be appropriate.",
    action: "Review POI",
    nodeIds: ["person-1"],
  },
];

export const narrationMessages = [
  "Initializing case workspace for Operation Nightfall — loading subpoena data...",
  "Parsing 847 CDR records from Verizon carrier feed. Deduplicating entries...",
  "Placed seed: +1 (312) 555-0142 — primary suspect, account SUB-88421, active status.",
  "Placed seed: 198.51.100.47 — C2 endpoint, AS394695, 847 sessions to suspect device.",
  "Running call frequency analysis across 847 CDRs. Identifying statistical outliers...",
  "Ring 1: Surfaced +1 (773) 555-0891 as probable burner — activated 2 days prior, zero history.",
  "Ring 2: Incident window May 10, 02:14–04:32 confirmed — all suspect pings cluster here.",
  "Ring 3: Adding VPN exit 45.33.32.156 and SMS burst event (47 msgs in 12 min).",
  "Deprioritized 4 noise entities: toll-free, DNS resolver, business line, routine tower ping.",
  "Cross-referencing flagged numbers against prior case database — 2 matches found.",
  "Severity classification complete: 2 critical, 4 high, 4 medium, 4 low entities.",
  "Generating proactive insights for 8 priority entities — analyzing patterns and anomalies.",
  "Officer field notes integrated — Det. Rivera, Det. Kim, Det. Patel, Det. Morris, Det. Lee.",
  "Map build complete — 15 entities, 14 connections. 5 actionable anomalies flagged for review.",
];

export const progressSteps = [
  { id: "p1", label: "Data ingested", done: true },
  { id: "p2", label: "Key entities identified", done: true },
  { id: "p3", label: "Anomalies flagged", done: true },
  { id: "p4", label: "Cross-case references", done: false },
  { id: "p5", label: "Timeline analysis", done: false },
];

export const CASE_NAME = "Operation Nightfall — Case #NF-2024-0847";

export const cards: ActivityCard[] = [
  {
    id: "seed-phone-1",
    type: "phone",
    label: "+1 (312) 555-0142",
    sublabel: "Primary suspect",
    severity: "critical",
    relevance: 1,
    ring: 0,
    isSeed: true,
    position: { x: 0, y: 0 },
  },
  {
    id: "seed-ip-1",
    type: "ip",
    label: "198.51.100.47",
    sublabel: "Known C2 endpoint",
    severity: "critical",
    relevance: 1,
    ring: 0,
    isSeed: true,
    position: { x: 180, y: -40 },
  },
  {
    id: "phone-burner",
    type: "phone",
    label: "+1 (773) 555-0891",
    sublabel: "Suspected burner",
    severity: "critical",
    relevance: 0.92,
    ring: 1,
    position: { x: -200, y: 120 },
  },
  {
    id: "person-1",
    type: "person",
    label: "Marcus V. Hale",
    sublabel: "POI — financial records",
    severity: "high",
    relevance: 0.88,
    ring: 1,
    position: { x: 200, y: 140 },
  },
  {
    id: "device-imei",
    type: "device",
    label: "IMEI 352099001761481",
    sublabel: "Samsung Galaxy S22",
    severity: "high",
    relevance: 0.85,
    ring: 1,
    position: { x: -120, y: -160 },
  },
  {
    id: "tower-441",
    type: "tower",
    label: "Tower #441",
    sublabel: "Wacker Dr & Franklin",
    severity: "high",
    relevance: 0.82,
    ring: 2,
    position: { x: 320, y: -120 },
  },
  {
    id: "event-incident",
    type: "event",
    label: "Incident Window",
    sublabel: "May 10, 02:14–04:32",
    severity: "high",
    relevance: 0.8,
    ring: 2,
    position: { x: -280, y: -60 },
  },
  {
    id: "phone-assoc",
    type: "phone",
    label: "+1 (312) 555-0298",
    sublabel: "14 calls / 48hr",
    severity: "medium",
    relevance: 0.65,
    ring: 2,
    position: { x: 140, y: 280 },
  },
  {
    id: "ip-vpn",
    type: "ip",
    label: "45.33.32.156",
    sublabel: "VPN exit node",
    severity: "medium",
    relevance: 0.58,
    ring: 3,
    position: { x: 400, y: 200 },
  },
  {
    id: "tower-892",
    type: "tower",
    label: "Tower #892",
    sublabel: "I-55 corridor",
    severity: "medium",
    relevance: 0.52,
    ring: 3,
    position: { x: -380, y: 200 },
  },
  {
    id: "event-sms-burst",
    type: "event",
    label: "SMS Burst",
    sublabel: "47 messages / 12 min",
    severity: "medium",
    relevance: 0.48,
    ring: 3,
    position: { x: 60, y: -320 },
  },
  {
    id: "phone-noise-1",
    type: "phone",
    label: "+1 (800) 555-0199",
    sublabel: "Toll-free — low relevance",
    severity: "low",
    relevance: 0.15,
    ring: 4,
    isNoise: true,
    position: { x: 520, y: -80 },
  },
  {
    id: "phone-noise-2",
    type: "phone",
    label: "+1 (312) 555-0001",
    sublabel: "Business line",
    severity: "low",
    relevance: 0.12,
    ring: 4,
    isNoise: true,
    position: { x: -520, y: 80 },
  },
  {
    id: "ip-noise",
    type: "ip",
    label: "8.8.8.8",
    sublabel: "DNS resolver",
    severity: "low",
    relevance: 0.08,
    ring: 4,
    isNoise: true,
    position: { x: 480, y: 320 },
  },
  {
    id: "tower-noise",
    type: "tower",
    label: "Tower #102",
    sublabel: "Routine ping",
    severity: "low",
    relevance: 0.1,
    ring: 4,
    isNoise: true,
    position: { x: -480, y: -280 },
  },
];

export const edges: TelecomEdge[] = [
  { id: "e1", source: "seed-phone-1", target: "phone-burner", type: "call", label: "14 calls" },
  { id: "e2", source: "seed-phone-1", target: "device-imei", type: "tower_ping", label: "same IMEI" },
  { id: "e3", source: "seed-ip-1", target: "seed-phone-1", type: "data", label: "847 sessions" },
  { id: "e4", source: "phone-burner", target: "person-1", type: "sms", label: "23 SMS" },
  { id: "e5", source: "device-imei", target: "tower-441", type: "tower_ping", label: "3 pings" },
  { id: "e6", source: "tower-441", target: "event-incident", type: "tower_ping", label: "window match" },
  { id: "e7", source: "seed-phone-1", target: "phone-assoc", type: "call", label: "6 calls" },
  { id: "e8", source: "seed-ip-1", target: "ip-vpn", type: "ip_route", label: "tunneled" },
  { id: "e9", source: "device-imei", target: "tower-892", type: "tower_ping", label: "handoff" },
  { id: "e10", source: "phone-burner", target: "event-sms-burst", type: "sms", label: "47 msgs" },
  { id: "e11", source: "phone-assoc", target: "phone-noise-1", type: "call" },
  { id: "e12", source: "tower-441", target: "tower-noise", type: "tower_ping" },
  { id: "e13", source: "ip-vpn", target: "ip-noise", type: "ip_route" },
  { id: "e14", source: "person-1", target: "phone-noise-2", type: "call" },
];

export const summaryPills: SummaryPill[] = [
  {
    id: "pill-1",
    text: "2 potential burner phones detected",
    nodeIds: ["phone-burner", "phone-assoc"],
  },
  {
    id: "pill-2",
    text: "Activity spike: May 10, 2–4am",
    nodeIds: ["event-incident", "event-sms-burst"],
  },
  {
    id: "pill-3",
    text: "3 devices co-located at Tower #441 during incident",
    nodeIds: ["tower-441", "device-imei", "seed-phone-1"],
  },
  {
    id: "pill-4",
    text: "Unusual cluster: 3 numbers not in other cases",
    nodeIds: ["phone-burner", "phone-assoc", "seed-phone-1"],
  },
];

export const aiLogMessages = [
  "Initializing case workspace...",
  "Loading 847 CDR records from carrier subpoena...",
  "Placing seed entities: suspect number +1 (312) 555-0142...",
  "Placing seed entity: C2 IP 198.51.100.47...",
  "Analyzing call frequency patterns across 847 CDRs...",
  "Found 3 numbers with unusual call frequency (>10σ)...",
  "Clustering tower pings around 2 geographic locations...",
  "Ring 1: surfacing high-relevance connections (burner, IMEI)...",
  "Ring 2: mapping incident window + associated towers...",
  "Ring 3: adding VPN exit node and SMS burst event...",
  "Deprioritizing 4 low-relevance entities to periphery...",
  "Severity classification complete: 2 critical, 4 high, 4 medium, 4 low",
  "Generating proactive insights for 8 entities...",
  "Map build complete — 15 entities, 14 connections",
];

export const guidancePrompts = [
  {
    id: "g1",
    text: "I noticed 2 cards with unusual overnight activity patterns. Want me to highlight them?",
    nodeIds: ["event-incident", "event-sms-burst"],
  },
  {
    id: "g2",
    text: "There's a cluster of connections between these 3 numbers that doesn't appear in any other case — could be worth investigating.",
    nodeIds: ["phone-burner", "phone-assoc", "seed-phone-1"],
  },
];

export const cardDetails: Record<string, CardDetail> = {
  "seed-phone-1": {
    rawData: { carrier: "Verizon", account: "SUB-88421", status: "Active" },
    cdrs: [
      { direction: "out", number: "+1 (773) 555-0891", time: "May 10 02:18", duration: "4:32", tower: "#441" },
      { direction: "out", number: "+1 (773) 555-0891", time: "May 10 02:41", duration: "12:07", tower: "#441" },
      { direction: "in", number: "+1 (312) 555-0298", time: "May 10 03:02", duration: "1:15", tower: "#441" },
      { direction: "out", number: "+1 (773) 555-0891", time: "May 10 03:44", duration: "8:21", tower: "#892" },
      { direction: "out", number: "+1 (773) 555-0891", time: "May 10 04:01", duration: "2:03", tower: "#892" },
    ],
    insights: [
      {
        id: "i1",
        text: "This number contacted the suspect burner +1 (773) 555-0891 fourteen times in 48 hours with no prior history in any linked case — strong burner phone indicator.",
        confidence: 94,
        action: "Flag for warrant review",
        explain: "A new contact appearing 14 times in 48 hours with zero prior history across all carrier data is statistically rare — this pattern appears in less than 0.3% of normal call graphs. Combined with the SIM activation timeline, it meets the threshold for a burner phone match in our detection model.",
      },
      {
        id: "i2",
        text: "All overnight calls routed through Tower #441 during the incident window, then handoff to Tower #892 within 8 minutes — movement inconsistent with pedestrian traffic.",
        confidence: 87,
        action: "Cross-reference with Case #4412",
        explain: "Tower #441 to Tower #892 covers 12 km. At walking speed that's a 2+ hour journey. The handoff happened in under 8 minutes — only possible in a vehicle. This places the suspect in active transit during the incident window, which significantly changes the threat profile.",
      },
    ],
    officerInsights: [
      {
        id: "oi1",
        text: "CI confirmed this number was actively used by a known associate during the incident window. The frequency of calls to the burner matches coordination behavior we've seen in two prior trafficking cases.",
        officer: "Det. Sarah Rivera",
        badge: "#4821",
        timestamp: "May 10, 08:32",
      },
      {
        id: "oi2",
        text: "Vehicle footage from the Tower #441 zone shows a gray sedan circling the block twice. Description matches witness report from Case #4399. Requested plate registry pull — awaiting response.",
        officer: "Sgt. James Kowalski",
        badge: "#3104",
        timestamp: "May 11, 14:15",
      },
    ],
    timeline: [
      { time: "May 10 02:14", event: "First tower ping — Tower #441" },
      { time: "May 10 02:18", event: "Outbound call to burner (4:32)" },
      { time: "May 10 04:32", event: "Last activity — Tower #892" },
    ],
  },
  "phone-burner": {
    rawData: { carrier: "T-Mobile MVNO", activated: "May 8, 2024", prepaid: true },
    cdrs: [
      { direction: "in", number: "+1 (312) 555-0142", time: "May 10 02:18", duration: "4:32", tower: "#441" },
      { direction: "out", number: "Marcus V. Hale", time: "May 10 02:55", duration: "0:45", tower: "#441" },
      { direction: "out", number: "+1 (312) 555-0142", time: "May 10 03:44", duration: "8:21", tower: "#892" },
    ],
    insights: [
      {
        id: "i3",
        text: "SIM activated 48 hours before incident. Zero prior CDR history. Classic burner phone signature.",
        confidence: 96,
        action: "Add to watchlist",
        explain: "A SIM with zero prior call records, activated 48 hours before a major incident, used exclusively during that window, then going dark — this matches the operational security pattern in 8 of our last 12 organized crime cases. The 48-hour lead time is consistent with preparation for a planned operation.",
      },
      {
        id: "i4",
        text: "SMS exchange with Marcus V. Hale (23 messages) occurred entirely within incident window.",
        confidence: 91,
        action: "Flag for warrant review",
        explain: "All 23 messages were exchanged within the 2:18–4:15am window — the same window as every other anomalous activity in this case. The timing correlation across phone, IP, and tower data is not coincidental. This is coordinated communication happening in real-time during the incident.",
      },
    ],
    officerInsights: [
      {
        id: "oi3",
        text: "MVNO activation traced to a prepaid kiosk on S. Michigan Ave — store camera footage has been requested. A 48-hour lead time on activation is consistent with operational security patterns documented in our field notes from 2023.",
        officer: "Det. Mi-Rae Kim",
        badge: "#5509",
        timestamp: "May 11, 09:47",
      },
    ],
    timeline: [
      { time: "May 8 14:22", event: "SIM activation — prepaid" },
      { time: "May 10 02:18", event: "First call from suspect number" },
      { time: "May 10 04:15", event: "SMS burst — 47 messages" },
    ],
  },
  "seed-ip-1": {
    rawData: { asn: "AS394695", country: "US", first_seen: "Apr 2, 2024", sessions: 847 },
    insights: [
      {
        id: "i5",
        text: "C2 endpoint registered to shell company. 847 data sessions to suspect device in 72-hour window — 340% above baseline.",
        confidence: 89,
        action: "Cross-reference with Case #4412",
        explain: "847 sessions in 72 hours is 340% above the regional baseline for this carrier and ASN combination. Shell company registration with no public-facing business, combined with the timing correlation to suspect device activity, is consistent with command-and-control infrastructure used in organized operations.",
      },
    ],
    officerInsights: [
      {
        id: "oi4",
        text: "ASN lookup points to a shell company registered in Nevada with no public-facing business. I'm cross-referencing with FinCEN SAR filings — a similar endpoint appeared in two other Chicago-area cases last quarter. Flagging for federal liaison review.",
        officer: "Det. Sarah Rivera",
        badge: "#4821",
        timestamp: "May 11, 13:22",
      },
    ],
    timeline: [
      { time: "Apr 2 08:00", event: "First observed connection" },
      { time: "May 10 02:20", event: "Peak traffic — 142 sessions/hr" },
      { time: "May 10 04:30", event: "Connection terminated" },
    ],
  },
  "tower-441": {
    rawData: { lat: "41.8868", lng: "-87.6353", range: "1.2 km", carrier: "Multi-tenant" },
    insights: [
      {
        id: "i6",
        text: "Three suspect devices co-located at this tower during incident window. Coverage overlaps with reported crime scene by 400m.",
        confidence: 92,
        action: "Add to watchlist",
        explain: "Three independent devices — the primary suspect phone, the burner, and the IMEI — all registered tower pings at this location within a 27-minute window. The probability of coincidental co-location at this traffic density is under 2%. Coverage overlap with the crime scene location makes this tower a confirmed activity anchor.",
      },
      {
        id: "i7",
        text: "Tower pings show device moved 12km south to Tower #892 within 8 minutes — inconsistent with normal traffic speed.",
        confidence: 85,
        action: "Flag for warrant review",
        explain: "12 km in 8 minutes requires a vehicle moving at highway speed. This eliminates foot travel and cycling as possibilities. I've cross-referenced this handoff time with the I-55 corridor (which Tower #892 serves) and it's consistent with southbound freeway travel, suggesting a planned exit route.",
      },
    ],
    officerInsights: [
      {
        id: "oi5",
        text: "I walked the Tower #441 coverage zone this morning. There's a parking structure on Wacker that fits the witness description of where the exchange occurred — two exits, camera blind spot on the east side. Recommending a physical site survey before we proceed with warrant.",
        officer: "Det. Priya Patel",
        badge: "#6213",
        timestamp: "May 12, 11:20",
      },
    ],
    timeline: [
      { time: "May 10 02:14", event: "Device 1 ping" },
      { time: "May 10 02:18", event: "Device 2 ping" },
      { time: "May 10 02:41", event: "Device 3 ping — handoff initiated" },
    ],
  },
  "device-imei": {
    rawData: { model: "Samsung Galaxy S22", os: "Android 14", last_seen: "May 10 04:32" },
    insights: [
      {
        id: "i8",
        text: "IMEI linked to suspect account. Tower handoff pattern suggests vehicle movement, not stationary use.",
        confidence: 88,
        action: "Cross-reference with Case #4412",
        explain: "This IMEI is registered to the suspect's Verizon account and its tower handoff sequence mirrors the primary phone's movement path exactly — same towers, same timing. These two devices moved together, which confirms the primary suspect was carrying both at the time of the incident.",
      },
    ],
    officerInsights: [
      {
        id: "oi6",
        text: "The 8-minute tower handoff for a 12km jump rules out walking or cycling entirely. I've flagged this to traffic division to pull I-55 toll records for the 02:00–05:00 window on May 10. Also checking rental car databases for the area.",
        officer: "Det. Jamie Lee",
        badge: "#4102",
        timestamp: "May 13, 10:05",
      },
    ],
    timeline: [
      { time: "May 10 02:14", event: "Tower #441 registration" },
      { time: "May 10 03:52", event: "Handoff to Tower #892" },
      { time: "May 10 04:32", event: "Last ping" },
    ],
  },
  "person-1": {
    rawData: { dob: "1987-03-14", ssn_partial: "***-42-8891", cases_linked: 2 },
    insights: [
      {
        id: "i9",
        text: "Financial records show wire transfer to prepaid MVNO provider 24 hours before burner activation.",
        confidence: 78,
        action: "Flag for warrant review",
        explain: "The wire transfer occurred 24 hours before the burner SIM was activated at a prepaid kiosk on S. Michigan Ave. This funding-to-activation timeline has appeared in 4 of our last 8 organized crime cases and is consistent with someone purchasing a communication asset for a planned operation rather than casual prepaid use.",
      },
    ],
    officerInsights: [
      {
        id: "oi7",
        text: "Hale appeared in Case #NF-2023-0312 as a peripheral contact — never charged but was interviewed twice. The wire transfer method is consistent with how he funded activity in that case. I know this guy; he doesn't do anything without direction from above. Recommend expanding the financial subpoena.",
        officer: "Det. Calvin Morris",
        badge: "#2887",
        timestamp: "May 12, 16:44",
      },
    ],
    timeline: [
      { time: "May 9 11:00", event: "Wire transfer flagged" },
      { time: "May 10 02:55", event: "SMS from burner number" },
    ],
  },
};

export function getDefaultDetail(cardId: string): CardDetail {
  const card = cards.find((c) => c.id === cardId);
  return (
    cardDetails[cardId] ?? {
      rawData: { type: card?.type, label: card?.label },
      insights: [
        {
          id: "default",
          text: "AI analysis pending for this entity. Select a higher-priority card for full insights.",
          confidence: 45,
          action: "Queue for analysis",
        },
      ],
      timeline: [{ time: "—", event: "No timeline data available" }],
    }
  );
}
