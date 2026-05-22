# Nexus — Telecom Intelligence Platform

> AI-native investigation dashboard for law enforcement telecom analysis

Nexus is a B2B SaaS prototype that helps detectives and investigators make sense of large telecom datasets — CDRs, IP sessions, tower pings, and device records — by automatically building an interactive mind map, classifying entities by severity, and surfacing actionable AI insights in real time.

---

## Overview

Traditional telecom investigation tools dump raw CDR spreadsheets onto analysts and leave pattern recognition to humans. Nexus flips that model: given a case's subpoena data, it autonomously builds a visual entity graph, filters noise to the periphery, ranks connections by relevance, and proactively flags anomalies — so investigators can focus on decisions, not data wrangling.

The demo case, **Operation Nightfall (Case #NF-2024-0847)**, walks through a real investigation scenario: a primary suspect phone, a burner cluster, a C2 IP endpoint, co-located tower pings, and a VPN exit node — 15 entities, 14 connections, 5 flagged anomalies.

---

## Features

- **AI cold start** — Animated mind map builds progressively in concentric rings as the AI ingests CDR data, narrating each step in the activity log
- **Severity classification** — Entities auto-ranked as Critical / High / Medium / Low based on call frequency, timing correlation, and cross-case history
- **Interactive entity graph** — Pan, zoom, and click any node (phone, IP, person, tower, device, event) to open a contextual detail panel
- **Detail panel** — Three tabs per entity: Raw Data, AI Insights (with confidence scores + recommended actions), and Timeline; includes officer field notes
- **AI summary strip** — Clickable insight pills at the top; clicking zooms the canvas to the relevant node cluster
- **Suggested next steps** — Left sidebar surfaces the highest-value investigative leads ranked by anomaly score
- **AI guidance prompt** — Appears after inactivity, proactively highlighting patterns the investigator may have missed; stays visible until manually dismissed
- **Noise filtering** — Low-relevance entities (DNS resolvers, business landlines, routine tower pings) are automatically pushed to the outer ring and visually de-emphasized
- **Onboarding flow** — Case briefing card on load; guided coach tips during first interactions

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS v4 |
| Graph / canvas | React Flow (`@xyflow/react`) |
| Animation | Framer Motion |
| Icons | Lucide React |

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The case workspace loads automatically — wait a few seconds to watch the AI cold-start build the entity graph from scratch.

```bash
# Type-check + production build
npm run build

# Preview the production build locally
npm run preview

# Lint
npm run lint
```

---

## Project Structure

```
src/
├── components/
│   ├── MindMapCanvas.tsx      # React Flow graph — nodes, edges, zoom
│   ├── ActivityCardNode.tsx   # Custom node renderer (phone, IP, tower…)
│   ├── DetailPanel.tsx        # Right-side entity detail (raw data / insights / timeline)
│   ├── AISummaryStrip.tsx     # Top pill bar — AI-generated case summaries
│   ├── AIActivityLog.tsx      # Bottom-left build log / narration
│   ├── AIGuidancePrompt.tsx   # Inactivity-triggered insight popup
│   ├── SuggestedNextSteps.tsx # Left sidebar — ranked investigative leads
│   ├── TopBar.tsx             # Case header, severity counters, status
│   ├── OnboardingCard.tsx     # First-load case briefing overlay
│   ├── CoachOverlay.tsx       # Contextual interaction tips
│   ├── EmptyStateNudge.tsx    # Prompt when no card is selected
│   ├── ExplainPopover.tsx     # Inline AI explanation tooltips
│   └── InteractionCoach.tsx   # Hook + component for guided coaching
├── hooks/
│   ├── useColdStart.ts        # Orchestrates the animated entity build sequence
│   └── useInactivity.ts       # Triggers the AI guidance prompt after idle time
├── data/
│   └── caseData.ts            # All demo case data: cards, edges, CDRs, insights
├── types.ts                   # Shared TypeScript types
└── App.tsx                    # Root layout and state orchestration
```

---

## Demo Walkthrough

1. **Cold start** — Watch the AI parse 847 CDR records and place entities ring by ring
2. **Explore the graph** — Click any node to open its detail panel; check the AI Insights tab for confidence-scored findings
3. **Use the summary pills** — Click a pill in the top bar to zoom the canvas to that entity cluster
4. **Check suggested steps** — The left sidebar lists the five highest-priority investigative leads
5. **Wait for AI guidance** — Leave the canvas idle; the AI guidance prompt appears and offers to highlight anomalous overnight activity
