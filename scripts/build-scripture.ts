/**
 * Builds the offline Scripture data from the public-domain Douay-Rheims (Challoner) Bible.
 *
 *  1. Downloads the source (scrollmapper/bible_databases, DRC) once into scripts/.cache.
 *  2. Writes the full Bible as one JSON file per book into public/bible/ (precached for offline use).
 *  3. Scans all app content for Scripture references and writes the exact verse text for each
 *     into src/content/generated/passages.json. The build FAILS if any reference cannot be resolved,
 *     so no passage in the app is ever typed by hand.
 *
 * Usage: npm run scripture
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BOOKS, parseRef, formatRef, type Passage } from '../src/lib/bible';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const cacheDir = join(root, 'scripts/.cache');
const srcFile = join(cacheDir, 'DRC.json');
const SOURCE_URL = 'https://raw.githubusercontent.com/scrollmapper/bible_databases/master/formats/json/DRC.json';

interface SrcBook { name: string; chapters: { chapter: number; verses: { verse: number; text: string }[] }[] }

async function loadSource(): Promise<SrcBook[]> {
  if (!existsSync(srcFile)) {
    mkdirSync(cacheDir, { recursive: true });
    console.log('Downloading Douay-Rheims source…');
    const res = await fetch(SOURCE_URL);
    if (!res.ok) throw new Error(`Download failed: ${res.status}`);
    writeFileSync(srcFile, await res.text());
  }
  const data = JSON.parse(readFileSync(srcFile, 'utf8'));
  if (!String(data.translation).startsWith('DRC')) throw new Error('Unexpected source translation');
  return data.books;
}

const clean = (t: string) => t.replace(/\s+/g, ' ').replace(/ ([,;:.])/g, '$1').trim();

async function main() {
  const src = await loadSource();
  const byName = new Map(src.map((b) => [b.name, b]));

  // 1. Full Bible, one file per book: chapters[c-1][v-1] = text
  const outDir = join(root, 'public/bible');
  mkdirSync(outDir, { recursive: true });
  const index: Record<string, number> = {};
  const chapterData = new Map<string, string[][]>();
  for (const meta of BOOKS) {
    const b = byName.get(meta.src);
    if (!b) throw new Error(`Missing book in source: ${meta.src}`);
    const chapters: string[][] = [];
    for (const ch of b.chapters) {
      const verses: string[] = [];
      for (const v of ch.verses) {
        if (v.verse !== verses.length + 1) throw new Error(`Non-contiguous verse ${meta.name} ${ch.chapter}:${v.verse}`);
        verses.push(clean(v.text));
      }
      if (ch.chapter !== chapters.length + 1) throw new Error(`Non-contiguous chapter ${meta.name} ${ch.chapter}`);
      chapters.push(verses);
    }
    chapterData.set(meta.slug, chapters);
    index[meta.slug] = chapters.length;
    writeFileSync(join(outDir, `${meta.slug}.json`), JSON.stringify({ slug: meta.slug, chapters }));
  }

  // 2. Collect every reference used anywhere in the content.
  const contentDir = join(root, 'src/content');
  const scanDirs = [contentDir, join(root, 'src/screens'), join(root, 'src/components')];
  const refRe = /['"`]((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)? \d+:\d+(?:-\d+)?)['"`]|\{\{((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)? \d+:\d+(?:-\d+)?)\}\}/g;
  const refs = new Set<string>();
  for (const dir of scanDirs)
  for (const f of readdirSync(dir)) {
    if (!/\.tsx?$/.test(f)) continue;
    const text = readFileSync(join(dir, f), 'utf8');
    for (const m of text.matchAll(refRe)) refs.add((m[1] ?? m[2]).trim());
  }

  const passages: Record<string, Passage> = {};
  const problems: string[] = [];
  for (const ref of [...refs].sort()) {
    try {
      const p = parseRef(ref);
      const ch = chapterData.get(p.book.slug)?.[p.chapter - 1];
      if (!ch) throw new Error('chapter not found');
      if (p.end > ch.length || p.start < 1 || p.end < p.start) throw new Error(`verses out of range (chapter has ${ch.length})`);
      const verses = [];
      for (let v = p.start; v <= p.end; v++) verses.push({ v, t: ch[v - 1] });
      passages[ref] = { ref, display: formatRef(ref), verses };
    } catch (e) {
      problems.push(`${ref}: ${(e as Error).message}`);
    }
  }
  if (problems.length) {
    console.error('Unresolvable Scripture references:\n  ' + problems.join('\n  '));
    process.exit(1);
  }

  const genDir = join(contentDir, 'generated');
  mkdirSync(genDir, { recursive: true });
  writeFileSync(join(genDir, 'passages.json'), JSON.stringify(passages, null, 0));
  writeFileSync(join(genDir, 'bible-index.json'), JSON.stringify(index));
  console.log(`✓ ${BOOKS.length} books written to public/bible/`);
  console.log(`✓ ${Object.keys(passages).length} verified passages written to src/content/generated/passages.json`);
  if (process.argv.includes('--print')) {
    for (const p of Object.values(passages)) console.log(`\n## ${p.display}\n` + p.verses.map((v) => `[${v.v}] ${v.t}`).join(' '));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
