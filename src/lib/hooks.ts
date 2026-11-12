import { useEffect, useMemo, useState } from 'react';
import { useStore } from './store';
import { dateKey } from './dates';
import { computeStats, earnedMilestones, flourishesFrom, growthPoints, stageFor } from './progress';
import type { CompanionMood } from '@/components/Companion';

/** Today's date key; rolls over automatically at midnight and when the app is reopened. */
export function useToday(): string {
  const [k, setK] = useState(dateKey());
  useEffect(() => {
    const tick = () => setK(dateKey());
    const id = setInterval(tick, 30_000);
    document.addEventListener('visibilitychange', tick);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', tick);
    };
  }, []);
  return k;
}

export function useProgress() {
  const today = useToday();
  const checkins = useStore((s) => s.checkins);
  const journeys = useStore((s) => s.journeys);
  const devotions = useStore((s) => s.devotions);
  const rosaries = useStore((s) => s.rosaries);
  const challenges = useStore((s) => s.challenges);
  const milestones = useStore((s) => s.milestones);

  return useMemo(() => {
    const stats = computeStats(checkins, journeys, today);
    const points = growthPoints({ checkins, devotions, rosaries, challenges });
    const growth = stageFor(points);
    const flourishes = flourishesFrom(milestones);
    const t = checkins[today]?.status;
    const mood: CompanionMood = t === 'setback' ? 'resting' : t === 'committed' ? 'joyful' : 'calm';
    return { today, stats, growth, flourishes, mood };
  }, [today, checkins, journeys, devotions, rosaries, challenges, milestones]);
}

/** Awards milestones as they are earned (kept for life, even after a restart). */
export function useMilestoneWatcher() {
  const { stats, today } = useProgress();
  const devotions = useStore((s) => s.devotions);
  const rosaries = useStore((s) => s.rosaries);
  const checkins = useStore((s) => s.checkins);
  const milestones = useStore((s) => s.milestones);
  const award = useStore((s) => s.awardMilestone);
  useEffect(() => {
    const reflectionsAfterSetback = Object.values(checkins).filter((c) => c.status !== 'committed' && c.reflection).length;
    const ids = earnedMilestones(stats, {
      devotions: Object.keys(devotions).length,
      rosaries: Object.values(rosaries).reduce((a, b) => a + b, 0),
      reflectionsAfterSetback,
    });
    for (const id of ids) if (!milestones[id]) award(id, today);
  }, [stats, devotions, rosaries, checkins, milestones, award, today]);
}
