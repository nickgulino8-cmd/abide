// Chooses today's content deterministically from the date (and the user's preferences).
import { DEVOTIONALS, type Devotional } from '@/content/devotionals';
import { SAINTS, type Saint } from '@/content/saints';
import { parseRef } from './bible';
import { dayIndex, hash, parseKey, seededShuffle, partOfDay } from './dates';
import type { ScripturePref } from './store';
import { prayerById } from '@/content/prayers';

function prefGroup(d: Devotional): ScripturePref {
  const g = parseRef(d.ref).book.group;
  if (g === 'Gospels') return 'gospels';
  if (g === 'Wisdom') return 'psalms';
  if (g === 'Prophets' || g === 'Pentateuch' || g === 'Historical') return 'prophets';
  return 'letters';
}

/**
 * A fixed yearly ordering, so consecutive days never repeat and every devotional is visited.
 * With a reading preference, two of every three days come from the preferred part of Scripture.
 */
function orderFor(year: number, pref: ScripturePref): Devotional[] {
  const shuffled = seededShuffle(DEVOTIONALS, hash(`abide-${year}`));
  // Always start the cycle with "Abide in Me".
  const first = shuffled.findIndex((d) => d.id === 'abide-in-the-vine');
  if (first > 0) shuffled.unshift(...shuffled.splice(first, 1));
  if (pref === 'mixed') return shuffled;
  const preferred = shuffled.filter((d) => prefGroup(d) === pref);
  const other = shuffled.filter((d) => prefGroup(d) !== pref);
  if (!preferred.length) return shuffled;
  if (!other.length) return preferred;
  const out: Devotional[] = [];
  let i = 0;
  for (const o of other) out.push(preferred[i++ % preferred.length], preferred[i++ % preferred.length], o);
  return out;
}

export function devotionalFor(key: string, pref: ScripturePref = 'mixed'): Devotional {
  const year = Number(key.slice(0, 4));
  const order = orderFor(year, pref);
  const jan1 = dayIndex(`${year}-01-01`);
  return order[(dayIndex(key) - jan1) % order.length];
}

export function devotionalById(id: string) {
  return DEVOTIONALS.find((d) => d.id === id);
}

export interface SaintOfDay {
  saint: Saint;
  isFeast: boolean;
}

export function saintFor(key: string): SaintOfDay {
  const d = parseKey(key);
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const feast = SAINTS.filter((s) => s.feast?.m === m && s.feast.d === day);
  if (feast.length) return { saint: feast[dayIndex(key) % feast.length], isFeast: true };
  const rotation = seededShuffle(SAINTS, hash(`saints-${key.slice(0, 4)}`));
  return { saint: rotation[dayIndex(key) % rotation.length], isFeast: false };
}

export function prayerForNow(now = new Date()) {
  const part = partOfDay(now);
  const id = part === 'morning' ? 'morning-prayer-abide' : part === 'afternoon' ? 'angelus' : 'evening-prayer-abide';
  return { part, prayer: prayerById(id)! };
}

export const JOURNAL_PROMPTS = [
  'What am I grateful for today?',
  "What did I learn from today's Scripture?",
  'What do I want to improve tomorrow?',
  'How can I become more Christlike this week?',
  "What do I need God's help with right now?",
  'Where did I see God working in my life today?',
  'What is one thing I need to surrender to God?',
  'What is distracting me from my relationship with Christ?',
  'How can I show more love to the people around me?',
  'When did I feel most at peace today, and why?',
  'What would I like to say to Jesus right now?',
  'Which virtue do I most want to grow in this month?',
  'Who do I need to forgive, or ask forgiveness from?',
  'What small victory can I thank God for today?',
];

export function promptFor(key: string): string {
  return JOURNAL_PROMPTS[dayIndex(key) % JOURNAL_PROMPTS.length];
}
