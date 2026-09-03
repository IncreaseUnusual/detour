import { useEffect, useRef, useState } from 'react';

type RawSignal = {
  source: 'social' | 'reservation';
  cardId: string;
  confidence: number;
  freshnessMinutes: number;
};

const SOCIAL_FEED: RawSignal[] = [
  { source: 'social', cardId: 'rooftop', confidence: 0.81, freshnessMinutes: 14 },
];

const RESERVATION_FEED: RawSignal[] = [
  { source: 'reservation', cardId: 'belcanto', confidence: 0.94, freshnessMinutes: 1 },
];

export const scanSocialFeed = async () => SOCIAL_FEED;
export const pollReservationFeed = async () => RESERVATION_FEED;

/** Two controlled workers write signals, then triage/ranking selects one action. */
export async function runDemoPipeline() {
  const raw = (await Promise.all([scanSocialFeed(), pollReservationFeed()])).flat();
  const winner = raw
    .filter(signal => signal.confidence >= 0.85)
    .sort((a, b) => b.confidence - a.confidence || a.freshnessMinutes - b.freshnessMinutes)[0];
  if (__DEV__ && winner?.cardId !== 'belcanto') throw new Error('Demo pipeline must surface Belcanto');
  return winner?.cardId;
}

/**
 * Simulated agent runtime. The demo is scripted, but the shape is the real one:
 * every surfaced item is the output of parallel agents doing tool calls, then a
 * triage pass that ranks and drops, with provenance kept at each hop.
 */

export type Phase = 'observe' | 'tool' | 'reason' | 'triage' | 'act';

export type TraceStep = {
  id: string;
  agentId: string;           // keys into BY_ID from data.ts
  phase: Phase;
  /** The tool call, written the way an engineer would read it in a log. */
  call: string;
  /** What came back. */
  result: string;
  ms: number;                // latency
  at: string;                // wall clock label
  /** Set when this step fed a card the user can see. */
  producedCardId?: string;
};

export type MissionStage = 'alert' | 'discover' | 'verify' | 'call' | 'select' | 'act';

export type MissionStep = {
  id: string;
  stage: MissionStage;
  agentId: string;
  title: string;
  detail: string;
  at: string;
  status: 'warning' | 'working' | 'verified' | 'live' | 'winner' | 'done';
};

/** Scripted Kuala Lumpur rescue used by the Live Mission demo. */
export const LIVE_MISSION: MissionStep[] = [
  { id: 'm1', stage: 'alert', agentId: 'news', title: 'Storm detected', detail: 'Heavy rain will hit your rooftop dinner at 18:40.', at: '18:12', status: 'warning' },
  { id: 'm2', stage: 'discover', agentId: 'social', title: 'Hidden chef pop-up found', detail: 'Posted four minutes ago · indoors · two seats possible.', at: '18:13', status: 'working' },
  { id: 'm3', stage: 'discover', agentId: 'resv', title: 'Two counter seats found', detail: 'The venue can hold them until 19:05.', at: '18:13', status: 'working' },
  { id: 'm4', stage: 'verify', agentId: 'news', title: 'Dry route verified', detail: 'Covered walk · 11 minutes · no rain exposure.', at: '18:14', status: 'verified' },
  { id: 'm5', stage: 'verify', agentId: 'triage', title: 'Profile and budget verified', detail: '93% match · RM240 · inside your spontaneous limit.', at: '18:14', status: 'verified' },
  { id: 'm6', stage: 'call', agentId: 'resv', title: 'Calling the venue live', detail: 'Venue: “We can hold two counter seats.” · Detour: “Hold them under Dani.”', at: '18:15', status: 'live' },
  { id: 'm7', stage: 'select', agentId: 'triage', title: 'Best future selected', detail: 'Chef pop-up + covered walk + hidden cocktail lab.', at: '18:16', status: 'winner' },
  { id: 'm8', stage: 'act', agentId: 'triage', title: 'Your evening is rescued', detail: 'Table held · route checked · itinerary ready to update.', at: '18:16', status: 'done' },
];

export const PHASE_LABEL: Record<Phase, string> = {
  observe: 'OBSERVE',
  tool: 'TOOL CALL',
  reason: 'REASON',
  triage: 'ADVENTURE MATCH',
  act: 'ACT',
};

/** Phase accents, matching the agent palette in data.ts. */
export const PHASE_COLOR: Record<Phase, string> = {
  observe: '#3d8ee8',
  tool: '#3d8ee8',
  reason: '#2c4c74',
  triage: '#7c6fd0',
  act: '#4f9c4a',
};

/** The standing run: what the swarm did over the last few minutes. */
export const TRACE: TraceStep[] = [
  { id: 't1', agentId: 'resv', phase: 'tool', call: 'poll(belcanto.availability, seats>=2)', result: '1 delta: 20:00 seating opened', ms: 240, at: '20:04:12' },
  { id: 't2', agentId: 'resv', phase: 'observe', call: 'diff(prev_snapshot, current)', result: 'cancellation, not new inventory', ms: 18, at: '20:04:12' },
  { id: 't3', agentId: 'social', phase: 'tool', call: 'watch(instagram.stories, geo=lisbon, 41 accounts)', result: '3 new stories', ms: 890, at: '20:04:13' },
  { id: 't4', agentId: 'social', phase: 'reason', call: 'extract_event(story@tascadaalfama)', result: 'rooftop seating, 8 covers, conf 0.81', ms: 1120, at: '20:04:14' },
  { id: 't5', agentId: 'events', phase: 'tool', call: 'fetch(galeria_madragoa.mailing_list)', result: 'opening night, Fri 19:00', ms: 410, at: '20:04:14' },
  { id: 't6', agentId: 'news', phase: 'tool', call: 'scan(municipal_notices, lisbon)', result: 'film permit, Santa Catarina closed', ms: 300, at: '20:04:15' },
  { id: 't7', agentId: 'news', phase: 'reason', call: 'match_against_itinerary(sat_sunset)', result: 'conflict found, alternative proposed', ms: 260, at: '20:04:15' },
  { id: 't8', agentId: 'triage', phase: 'triage', call: 'dedupe + rank(candidates=17, profile=elena)', result: 'kept 4, dropped 13', ms: 620, at: '20:04:16' },
  { id: 't9', agentId: 'triage', phase: 'reason', call: 'score(belcanto, taste_profile, calendar, budget)', result: '0.92, above interrupt threshold 0.85', ms: 140, at: '20:04:16', producedCardId: 'belcanto' },
  { id: 't10', agentId: 'triage', phase: 'act', call: 'notify(user, priority=high, reason=perishable)', result: 'banner pushed, hold timer started', ms: 40, at: '20:04:16', producedCardId: 'belcanto' },
];

/**
 * Streams a scripted list in one item at a time, so the log looks like it is
 * being written rather than rendered. Loops so a demo can run unattended.
 */
export function useStream<T>(items: T[], everyMs = 900, loop = true) {
  const [n, setN] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timer.current = setInterval(() => {
      setN(prev => (prev >= items.length ? (loop ? 0 : prev) : prev + 1));
    }, everyMs);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [items.length, everyMs, loop]);

  return { shown: items.slice(0, n), done: n >= items.length, restart: () => setN(0) };
}

/** Live counters for the swarm header, nudged so the numbers are never static. */
export function useSwarmCounters(base = 1284) {
  const [scanned, setScanned] = useState(base);
  useEffect(() => {
    const id = setInterval(() => setScanned(s => s + 1 + Math.floor(Math.random() * 3)), 2200);
    return () => clearInterval(id);
  }, []);
  return { scanned, kept: 4 };
}
