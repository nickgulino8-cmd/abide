import passagesJson from '@/content/generated/passages.json';
import bibleIndex from '@/content/generated/bible-index.json';
import { BOOKS, findBook, formatRef, type Passage } from './bible';

const passages = passagesJson as Record<string, Passage>;

export function getPassage(ref: string): Passage | undefined {
  return passages[ref];
}

export function passageText(ref: string): string {
  return getPassage(ref)?.verses.map((v) => v.t).join(' ') ?? '';
}

export function allPassages(): Passage[] {
  return Object.values(passages);
}

export function chapterCount(slug: string): number {
  return (bibleIndex as Record<string, number>)[slug] ?? 0;
}

const bookCache = new Map<string, Promise<string[][]>>();

/** Loads a whole book of the Douay-Rheims (served locally; precached for offline use). */
export function loadBook(slug: string): Promise<string[][]> {
  if (!bookCache.has(slug)) {
    const p = fetch(`/bible/${slug}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`Could not load ${slug}`);
        return r.json();
      })
      .then((j: { chapters: string[][] }) => j.chapters)
      .catch((e) => {
        bookCache.delete(slug);
        throw e;
      });
    bookCache.set(slug, p);
  }
  return bookCache.get(slug)!;
}

export interface SearchHit {
  slug: string;
  chapter: number;
  verse: number;
  text: string;
}

/** Full-text search across the entire Bible (loads books on demand). */
export async function searchBible(query: string, limit = 80, onProgress?: (n: number) => void): Promise<SearchHit[]> {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const hits: SearchHit[] = [];
  let done = 0;
  for (const b of BOOKS) {
    const chapters = await loadBook(b.slug);
    chapters.forEach((vs, ci) =>
      vs.forEach((t, vi) => {
        const lt = t.toLowerCase();
        if (hits.length < limit && words.every((w) => lt.includes(w))) hits.push({ slug: b.slug, chapter: ci + 1, verse: vi + 1, text: t });
      }),
    );
    onProgress?.(++done / BOOKS.length);
    if (hits.length >= limit) break;
  }
  return hits;
}

export function bookName(slug: string) {
  return findBook(slug)?.name ?? slug;
}

export { formatRef };
