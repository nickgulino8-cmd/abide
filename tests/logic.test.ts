import { describe, expect, it } from 'vitest';
import { computeStats, growthPoints, stageFor, earnedMilestones } from '../src/lib/progress';
import type { CheckIn, Journey } from '../src/lib/store';
import { addDays } from '../src/lib/dates';
import { easter, seasonFor, adventStart } from '../src/lib/liturgical';
import { devotionalFor, saintFor } from '../src/lib/daily';
import { DEVOTIONALS } from '../src/content/devotionals';
import { getPassage } from '../src/lib/scripture';
import { localProvider } from '../src/lib/assistant';
import { parseRef, formatRef } from '../src/lib/bible';

const T = '2026-11-12';
const j: Journey[] = [{ id: 'a', startedAt: '2026-01-01' }];
const days = (statuses: CheckIn['status'][], endOffset = 0) => {
  const out: Record<string, CheckIn> = {};
  statuses.forEach((s, i) => {
    const d = addDays(T, -(statuses.length - 1 - i) - endOffset);
    out[d] = { date: d, status: s, at: 0 };
  });
  return out;
};

describe('streaks', () => {
  it('counts consecutive committed days ending today', () => {
    expect(computeStats(days(['committed', 'committed', 'committed']), j, T).currentStreak).toBe(3);
  });
  it('does not break when today is not yet recorded', () => {
    expect(computeStats(days(['committed', 'committed'], 1), j, T).currentStreak).toBe(2);
  });
  it('a setback ends the current streak but keeps the longest and lifetime totals', () => {
    const s = computeStats(days(['committed', 'committed', 'committed', 'committed', 'setback']), j, T);
    expect(s.currentStreak).toBe(0);
    expect(s.longestStreak).toBe(4);
    expect(s.totalCommitted).toBe(4);
  });
  it('reflect days are neutral', () => {
    expect(computeStats(days(['committed', 'reflect', 'committed']), j, T).currentStreak).toBe(2);
  });
  it('a missed (unrecorded) past day breaks the current streak', () => {
    const c = days(['committed', 'committed']);
    delete c[addDays(T, -1)];
    expect(computeStats(c, j, T).currentStreak).toBe(1);
  });
  it('restarting a journey resets the current streak but not the lifetime best', () => {
    const c = days(['committed', 'committed', 'committed', 'committed']);
    const s = computeStats(c, [{ id: 'a', startedAt: '2026-01-01', endedAt: T }, { id: 'b', startedAt: T }], T);
    expect(s.currentStreak).toBe(1);
    expect(s.longestStreak).toBeGreaterThanOrEqual(3);
  });
  it('awards the 7-day milestone from the longest streak', () => {
    const s = computeStats(days(Array(7).fill('committed')), j, T);
    expect(earnedMilestones(s, { devotions: 0, rosaries: 0, reflectionsAfterSetback: 0 })).toContain('streak-7');
  });
});

describe('companion growth never regresses', () => {
  it('a setback day adds nothing negative', () => {
    const before = growthPoints({ checkins: days(['committed', 'committed']), devotions: {}, rosaries: {}, challenges: {} });
    const after = growthPoints({ checkins: { ...days(['committed', 'committed'], 1), [T]: { date: T, status: 'setback', at: 0 } }, devotions: {}, rosaries: {}, challenges: {} });
    expect(after).toBeGreaterThanOrEqual(before);
  });
  it('honest reflection after a hard day counts as growth', () => {
    const g = growthPoints({ checkins: { [T]: { date: T, status: 'setback', at: 0, reflection: { challenge: 'x', help: '', positive: '' } } }, devotions: {}, rosaries: {}, challenges: {} });
    expect(g).toBe(1);
  });
  it('stages advance with points', () => {
    expect(stageFor(0).stage.n).toBe(1);
    expect(stageFor(5).stage.n).toBe(2);
    expect(stageFor(170).stage.n).toBe(7);
  });
});

describe('liturgical calendar', () => {
  it('computes Easter', () => {
    expect(easter(2025)).toBe('2025-04-20');
    expect(easter(2026)).toBe('2026-04-05');
    expect(easter(2027)).toBe('2027-03-28');
  });
  it('computes Advent', () => {
    expect(adventStart(2026)).toBe('2026-11-29');
    expect(adventStart(2025)).toBe('2025-11-30');
  });
  it('labels seasons', () => {
    expect(seasonFor('2026-11-12').season).toBe('ordinary');
    expect(seasonFor('2026-12-01').season).toBe('advent');
    expect(seasonFor('2026-12-26').season).toBe('christmas');
    expect(seasonFor('2026-02-20').season).toBe('lent');
    expect(seasonFor('2026-04-10').season).toBe('easter');
  });
});

describe('daily content', () => {
  it('changes with the date and never repeats on consecutive days', () => {
    for (const pref of ['mixed', 'gospels', 'psalms', 'letters', 'prophets'] as const) {
      let prev = '';
      for (let i = 0; i < 120; i++) {
        const d = devotionalFor(addDays('2026-01-01', i), pref);
        expect(d).toBeTruthy();
        expect(d.id).not.toBe(prev);
        prev = d.id;
      }
    }
  });
  it('visits every devotional across the year (mixed)', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 365; i++) seen.add(devotionalFor(addDays('2026-01-01', i)).id);
    expect(seen.size).toBe(DEVOTIONALS.length);
  });
  it('shows the saint whose feast it is', () => {
    expect(saintFor('2026-11-12').saint.id).toBe('josaphat');
    expect(saintFor('2026-10-04').saint.id).toBe('francis-of-assisi');
    expect(saintFor('2026-10-04').isFeast).toBe(true);
  });
});

describe('scripture integrity', () => {
  it('every devotional passage resolves to verified Douay-Rheims text', () => {
    for (const d of DEVOTIONALS) expect(getPassage(d.ref)?.verses.length, d.ref).toBeGreaterThan(0);
  });
  it('uses Douay-Rheims wording', () => {
    expect(getPassage('John 15:4')!.verses[0].t).toBe('Abide in me: and I in you. As the branch cannot bear fruit of itself, unless it abide in the vine, so neither can you, unless you abide in me.');
    expect(formatRef('Psalms 50:12')).toBe('Psalm 50:12 (51)');
    expect(parseRef('1 Corinthians 10:13').book.slug).toBe('1-corinthians');
  });
});

describe('Abide Companion', () => {
  const profile = { name: '', goals: [], customGoal: '', progressMeaning: '', focus: 'self-control' as const, prayerTime: 'morning', scripturePref: 'mixed' as const, createdAt: T };
  const ask = (q: string) => localProvider.answer(q, { profile });
  it.each([
    ['What does the Bible say about self-control?', 'self-control'],
    ['How do I develop a stronger relationship with Jesus?', 'relationship-jesus'],
    ['What is the meaning of the Beatitudes?', 'beatitudes'],
    ["How do I pray when I don't know what to say?", 'pray-no-words'],
    ['How does confession work?', 'confession'],
    ['What can I learn from Saint Augustine?', 'augustine'],
    ['I relapsed again, how do I start again?', 'setback'],
    ['Is it a sin to be tempted?', 'temptation-not-sin'],
  ])('answers “%s”', async (q, id) => {
    const a = await ask(q);
    expect(a.id).toBe(id);
    expect(a.text.length).toBeGreaterThan(50);
  });
  it('responds to crisis language with support resources', async () => {
    const a = await ask('I want to end my life');
    expect(a.kind).toBe('crisis');
    expect(a.text).toContain('988');
  });
  it('answers about saints from the library', async () => {
    expect((await ask('Tell me about Carlo Acutis')).id).toBe('saint-carlo-acutis');
  });
  it('every scripture marker in answers resolves', async () => {
    const { KB } = await import('../src/content/assistant');
    for (const e of KB) for (const m of e.answer.matchAll(/\{\{(.+?)\}\}/g)) expect(getPassage(m[1]), m[1]).toBeTruthy();
  });
  it('falls back honestly instead of guessing', async () => {
    const a = await ask('xylophone quantum taxes');
    expect(a.id).toBe('fallback');
  });
});
