// Accountability & growth logic. Pure functions — no React, easy to test.
//
// Principles:
//  • A streak counts consecutive "committed" days. Today being un-recorded never breaks it.
//  • "Reflect" days are neutral: they neither add to nor break a streak.
//  • A setback ends the current streak — but lifetime totals, milestones and the companion's
//    growth are NEVER taken away. The companion never regresses.
import type { CheckIn, Journey } from './store';
import { addDays, dateKey, diffDays } from './dates';

export interface Stats {
  currentStreak: number;
  longestStreak: number;
  journeyStreakStart?: string;
  totalCommitted: number;
  totalCheckins: number;
  consistency: number; // 0..1 over the recent window
  windowDays: number;
  checkedInToday: boolean;
  todayStatus?: CheckIn['status'];
  daysOnJourney: number;
  setbacks: number;
}

export function computeStats(
  checkins: Record<string, CheckIn>,
  journeys: Journey[],
  today: string = dateKey(),
): Stats {
  const journey = journeys[journeys.length - 1];
  const start = journey?.startedAt ?? today;
  const keys = Object.keys(checkins).sort();
  const totalCommitted = keys.filter((k) => checkins[k].status === 'committed').length;
  const setbacks = keys.filter((k) => checkins[k].status === 'setback').length;

  // Current streak (within the current journey only).
  let current = 0;
  let cursor = today;
  if (!checkins[today]) cursor = addDays(today, -1); // today not yet recorded: don't break
  while (cursor >= start) {
    const c = checkins[cursor];
    if (!c || c.status === 'setback') break;
    if (c.status === 'committed') current++;
    cursor = addDays(cursor, -1);
  }

  // Longest streak (lifetime, across all journeys — achievements are kept forever).
  let longest = 0;
  let run = 0;
  let prev: string | null = null;
  const boundaries = new Set(journeys.slice(1).map((j) => j.startedAt));
  for (const k of keys) {
    const c = checkins[k];
    const contiguous = prev !== null && diffDays(prev, k) === 1 && !boundaries.has(k);
    if (!contiguous) run = 0;
    if (c.status === 'setback') run = 0;
    else if (c.status === 'committed') run++;
    longest = Math.max(longest, run);
    prev = k;
  }
  longest = Math.max(longest, current);

  // Consistency: committed days ÷ days in a recent window (up to 30 days, starting at first check-in).
  const first = keys[0] ?? today;
  const windowDays = Math.max(1, Math.min(30, diffDays(first, today) + 1));
  let committedInWindow = 0;
  for (let i = 0; i < windowDays; i++) {
    const c = checkins[addDays(today, -i)];
    if (c?.status === 'committed') committedInWindow++;
  }
  // Today unrecorded shouldn't count against you.
  const denom = checkins[today] ? windowDays : Math.max(1, windowDays - 1);
  const consistency = keys.length === 0 ? 0 : Math.min(1, committedInWindow / denom);

  return {
    currentStreak: current,
    longestStreak: longest,
    totalCommitted,
    totalCheckins: keys.length,
    consistency,
    windowDays,
    checkedInToday: !!checkins[today],
    todayStatus: checkins[today]?.status,
    daysOnJourney: diffDays(start, today) + 1,
    setbacks,
  };
}

// ───────────────────────── Companion growth ─────────────────────────

export interface GrowthInput {
  checkins: Record<string, CheckIn>;
  devotions: Record<string, unknown>;
  rosaries: Record<string, number>;
  challenges: Record<string, boolean>;
}

/**
 * Growth points accumulate and never decrease.
 *  committed check-in +2 · reflection after a hard day +1 (returning honestly is growth)
 *  devotional +1 · daily challenge +1 · rosary +1   (max 5 per day)
 */
export function growthPoints(g: GrowthInput): number {
  const days = new Set([...Object.keys(g.checkins), ...Object.keys(g.devotions), ...Object.keys(g.rosaries), ...Object.keys(g.challenges)]);
  let total = 0;
  for (const d of days) {
    let p = 0;
    const c = g.checkins[d];
    if (c?.status === 'committed') p += 2;
    if (c && c.status !== 'committed' && (c.reflection || c.note)) p += 1;
    if (g.devotions[d]) p += 1;
    if (g.challenges[d]) p += 1;
    if (g.rosaries[d]) p += 1;
    total += Math.min(5, p);
  }
  return total;
}

export const STAGES = [
  { n: 1, name: 'Beginning', at: 0, line: 'A quiet beginning. Every journey starts here.' },
  { n: 2, name: 'Awakening', at: 5, line: 'Colour returns. Something new is stirring.' },
  { n: 3, name: 'Growing', at: 15, line: 'Scales take shape, and a soft light begins.' },
  { n: 4, name: 'Strengthening', at: 35, line: 'Vibrant and steady, gaining confidence.' },
  { n: 5, name: 'Renewal', at: 65, line: 'Gold and green — renewal is taking hold.' },
  { n: 6, name: 'Flourishing', at: 110, line: 'Luminous and full of life.' },
  { n: 7, name: 'Abiding', at: 170, line: 'Rooted in the vine. Steady, radiant, at peace.' },
] as const;

export function stageFor(points: number) {
  let s: (typeof STAGES)[number] = STAGES[0];
  for (const st of STAGES) if (points >= st.at) s = st;
  const next = STAGES.find((x) => x.at > points);
  const progress = next ? (points - s.at) / (next.at - s.at) : 1;
  return { stage: s, next, progress, points };
}

// ───────────────────────── Milestones ─────────────────────────

export type Flourish = 'embers' | 'blossoms' | 'halo' | 'radiance';

export interface MilestoneDef {
  id: string;
  title: string;
  description: string;
  kind: 'streak' | 'lifetime' | 'practice';
  threshold: number;
  flourish?: Flourish;
  reward?: string;
}

export const MILESTONES: MilestoneDef[] = [
  { id: 'first-step', title: 'First Step', description: 'Your first check-in.', kind: 'lifetime', threshold: 1 },
  { id: 'streak-7', title: 'One Week', description: '7 days in a row.', kind: 'streak', threshold: 7, flourish: 'embers', reward: 'Unlocks Embers of Light — your companion scatters light when you tap it.' },
  { id: 'streak-30', title: 'One Month', description: '30 days in a row.', kind: 'streak', threshold: 30, flourish: 'blossoms', reward: 'Unlocks Vine Blossoms around your companion.' },
  { id: 'streak-60', title: 'Two Months', description: '60 days in a row.', kind: 'streak', threshold: 60, flourish: 'halo', reward: 'Unlocks the Golden Halo.' },
  { id: 'streak-90', title: 'Ninety Days', description: '90 days in a row.', kind: 'streak', threshold: 90, flourish: 'radiance', reward: 'Unlocks Radiance — rays of morning light.' },
  { id: 'total-50', title: 'Fifty Faithful Days', description: '50 committed days in total.', kind: 'lifetime', threshold: 50 },
  { id: 'total-100', title: 'One Hundred Faithful Days', description: '100 committed days in total.', kind: 'lifetime', threshold: 100 },
  { id: 'devotion-7', title: 'Seven Mornings', description: 'Completed 7 daily devotionals.', kind: 'practice', threshold: 7 },
  { id: 'devotion-30', title: 'Thirty Mornings', description: 'Completed 30 daily devotionals.', kind: 'practice', threshold: 30 },
  { id: 'rosary-1', title: 'First Rosary', description: 'Prayed a full Rosary.', kind: 'practice', threshold: 1 },
  { id: 'returned', title: 'Returned', description: 'Reflected honestly after a hard day and kept going.', kind: 'practice', threshold: 1 },
];

export function earnedMilestones(
  stats: Stats,
  counts: { devotions: number; rosaries: number; reflectionsAfterSetback: number },
): string[] {
  const out: string[] = [];
  for (const m of MILESTONES) {
    if (m.kind === 'streak' && stats.longestStreak >= m.threshold) out.push(m.id);
    if (m.kind === 'lifetime' && m.id === 'first-step' && stats.totalCheckins >= 1) out.push(m.id);
    if (m.kind === 'lifetime' && m.id.startsWith('total') && stats.totalCommitted >= m.threshold) out.push(m.id);
    if (m.id.startsWith('devotion') && counts.devotions >= m.threshold) out.push(m.id);
    if (m.id === 'rosary-1' && counts.rosaries >= 1) out.push(m.id);
    if (m.id === 'returned' && counts.reflectionsAfterSetback >= 1) out.push(m.id);
  }
  return out;
}

export function flourishesFrom(milestones: Record<string, string>): Flourish[] {
  return MILESTONES.filter((m) => m.flourish && milestones[m.id]).map((m) => m.flourish!);
}

export function nextStreakMilestone(streak: number) {
  return [7, 30, 60, 90].find((n) => n > streak) ?? null;
}
