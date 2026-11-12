// Liturgical season for a date (Roman Rite, approximate for regional variations).
import { addDays, dateKey } from './dates';

export type Season = 'advent' | 'christmas' | 'ordinary' | 'lent' | 'triduum' | 'easter';

export interface SeasonInfo {
  season: Season;
  label: string;
  color: 'violet' | 'white' | 'green' | 'red' | 'rose';
  note: string;
}

/** Gregorian Easter Sunday (Anonymous Gregorian algorithm). */
export function easter(year: number): string {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return dateKey(new Date(year, month - 1, day));
}

export function adventStart(year: number): string {
  // The Sunday falling between Nov 27 and Dec 3.
  const christmas = new Date(year, 11, 25);
  const dow = christmas.getDay(); // days back to the Sunday before Christmas
  const fourth = addDays(dateKey(christmas), -(dow === 0 ? 7 : dow));
  return addDays(fourth, -21);
}

function baptismOfLord(year: number): string {
  // Sunday after January 6 (approximation of the end of Christmastide).
  const jan6 = new Date(year, 0, 6);
  return addDays(dateKey(jan6), 7 - jan6.getDay());
}

export function seasonFor(k: string): SeasonInfo {
  const year = Number(k.slice(0, 4));
  const e = easter(year);
  const ash = addDays(e, -46);
  const holyThu = addDays(e, -3);
  const pentecost = addDays(e, 49);
  const adv = adventStart(year);
  const xmas = `${year}-12-25`;
  if (k >= adv && k < xmas) return { season: 'advent', label: 'Advent', color: 'violet', note: 'A season of hopeful waiting for the coming of Christ.' };
  if (k >= xmas || k <= baptismOfLord(year)) return { season: 'christmas', label: 'Christmas', color: 'white', note: 'The Word became flesh and dwelt among us.' };
  if (k >= ash && k < holyThu) return { season: 'lent', label: 'Lent', color: 'violet', note: 'Forty days of prayer, fasting, and almsgiving.' };
  if (k >= holyThu && k < e) return { season: 'triduum', label: 'Sacred Triduum', color: 'red', note: 'The Passion and death of the Lord.' };
  if (k >= e && k <= pentecost) return { season: 'easter', label: 'Easter', color: 'white', note: 'Christ is risen! Fifty days of rejoicing.' };
  return { season: 'ordinary', label: 'Ordinary Time', color: 'green', note: 'A season of growth in the life of Christ.' };
}
