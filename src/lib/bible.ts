// Book metadata and reference parsing for the Douay-Rheims (Challoner) Bible.
// Shared by the build script (scripts/build-scripture.ts) and the app.

export type Testament = 'OT' | 'NT';
export interface BookMeta {
  slug: string;
  name: string; // familiar modern name
  douay?: string; // traditional Douay-Rheims name, when different
  src: string; // name in the source dataset
  testament: Testament;
  group: string;
  aliases?: string[];
}

const B = (
  slug: string,
  name: string,
  src: string,
  testament: Testament,
  group: string,
  douay?: string,
  aliases: string[] = [],
): BookMeta => ({ slug, name, src, testament, group, douay, aliases });

export const BOOKS: BookMeta[] = [
  B('genesis', 'Genesis', 'Genesis', 'OT', 'Pentateuch'),
  B('exodus', 'Exodus', 'Exodus', 'OT', 'Pentateuch'),
  B('leviticus', 'Leviticus', 'Leviticus', 'OT', 'Pentateuch'),
  B('numbers', 'Numbers', 'Numbers', 'OT', 'Pentateuch'),
  B('deuteronomy', 'Deuteronomy', 'Deuteronomy', 'OT', 'Pentateuch'),
  B('joshua', 'Joshua', 'Joshua', 'OT', 'Historical', 'Josue'),
  B('judges', 'Judges', 'Judges', 'OT', 'Historical'),
  B('ruth', 'Ruth', 'Ruth', 'OT', 'Historical'),
  B('1-samuel', '1 Samuel', 'I Samuel', 'OT', 'Historical', '1 Kings'),
  B('2-samuel', '2 Samuel', 'II Samuel', 'OT', 'Historical', '2 Kings'),
  B('1-kings', '1 Kings', 'I Kings', 'OT', 'Historical', '3 Kings'),
  B('2-kings', '2 Kings', 'II Kings', 'OT', 'Historical', '4 Kings'),
  B('1-chronicles', '1 Chronicles', 'I Chronicles', 'OT', 'Historical', '1 Paralipomenon'),
  B('2-chronicles', '2 Chronicles', 'II Chronicles', 'OT', 'Historical', '2 Paralipomenon'),
  B('ezra', 'Ezra', 'Ezra', 'OT', 'Historical', '1 Esdras'),
  B('nehemiah', 'Nehemiah', 'Nehemiah', 'OT', 'Historical', '2 Esdras'),
  B('tobit', 'Tobit', 'Tobit', 'OT', 'Historical', 'Tobias'),
  B('judith', 'Judith', 'Judith', 'OT', 'Historical'),
  B('esther', 'Esther', 'Esther', 'OT', 'Historical'),
  B('1-maccabees', '1 Maccabees', 'I Maccabees', 'OT', 'Historical', '1 Machabees'),
  B('2-maccabees', '2 Maccabees', 'II Maccabees', 'OT', 'Historical', '2 Machabees'),
  B('job', 'Job', 'Job', 'OT', 'Wisdom'),
  B('psalms', 'Psalms', 'Psalms', 'OT', 'Wisdom', undefined, ['psalm', 'ps']),
  B('proverbs', 'Proverbs', 'Proverbs', 'OT', 'Wisdom'),
  B('ecclesiastes', 'Ecclesiastes', 'Ecclesiastes', 'OT', 'Wisdom'),
  B('song-of-songs', 'Song of Songs', 'Song of Solomon', 'OT', 'Wisdom', 'Canticle of Canticles', ['song of solomon']),
  B('wisdom', 'Wisdom', 'Wisdom', 'OT', 'Wisdom'),
  B('sirach', 'Sirach', 'Sirach', 'OT', 'Wisdom', 'Ecclesiasticus'),
  B('isaiah', 'Isaiah', 'Isaiah', 'OT', 'Prophets', 'Isaias'),
  B('jeremiah', 'Jeremiah', 'Jeremiah', 'OT', 'Prophets', 'Jeremias'),
  B('lamentations', 'Lamentations', 'Lamentations', 'OT', 'Prophets'),
  B('baruch', 'Baruch', 'Baruch', 'OT', 'Prophets'),
  B('ezekiel', 'Ezekiel', 'Ezekiel', 'OT', 'Prophets', 'Ezechiel'),
  B('daniel', 'Daniel', 'Daniel', 'OT', 'Prophets'),
  B('hosea', 'Hosea', 'Hosea', 'OT', 'Prophets', 'Osee'),
  B('joel', 'Joel', 'Joel', 'OT', 'Prophets'),
  B('amos', 'Amos', 'Amos', 'OT', 'Prophets'),
  B('obadiah', 'Obadiah', 'Obadiah', 'OT', 'Prophets', 'Abdias'),
  B('jonah', 'Jonah', 'Jonah', 'OT', 'Prophets', 'Jonas'),
  B('micah', 'Micah', 'Micah', 'OT', 'Prophets', 'Micheas'),
  B('nahum', 'Nahum', 'Nahum', 'OT', 'Prophets'),
  B('habakkuk', 'Habakkuk', 'Habakkuk', 'OT', 'Prophets', 'Habacuc'),
  B('zephaniah', 'Zephaniah', 'Zephaniah', 'OT', 'Prophets', 'Sophonias'),
  B('haggai', 'Haggai', 'Haggai', 'OT', 'Prophets', 'Aggeus'),
  B('zechariah', 'Zechariah', 'Zechariah', 'OT', 'Prophets', 'Zacharias'),
  B('malachi', 'Malachi', 'Malachi', 'OT', 'Prophets', 'Malachias'),
  B('matthew', 'Matthew', 'Matthew', 'NT', 'Gospels', undefined, ['matt', 'mt']),
  B('mark', 'Mark', 'Mark', 'NT', 'Gospels', undefined, ['mk']),
  B('luke', 'Luke', 'Luke', 'NT', 'Gospels', undefined, ['lk']),
  B('john', 'John', 'John', 'NT', 'Gospels', undefined, ['jn']),
  B('acts', 'Acts', 'Acts', 'NT', 'Acts'),
  B('romans', 'Romans', 'Romans', 'NT', 'Letters of Paul'),
  B('1-corinthians', '1 Corinthians', 'I Corinthians', 'NT', 'Letters of Paul'),
  B('2-corinthians', '2 Corinthians', 'II Corinthians', 'NT', 'Letters of Paul'),
  B('galatians', 'Galatians', 'Galatians', 'NT', 'Letters of Paul'),
  B('ephesians', 'Ephesians', 'Ephesians', 'NT', 'Letters of Paul'),
  B('philippians', 'Philippians', 'Philippians', 'NT', 'Letters of Paul'),
  B('colossians', 'Colossians', 'Colossians', 'NT', 'Letters of Paul'),
  B('1-thessalonians', '1 Thessalonians', 'I Thessalonians', 'NT', 'Letters of Paul'),
  B('2-thessalonians', '2 Thessalonians', 'II Thessalonians', 'NT', 'Letters of Paul'),
  B('1-timothy', '1 Timothy', 'I Timothy', 'NT', 'Letters of Paul'),
  B('2-timothy', '2 Timothy', 'II Timothy', 'NT', 'Letters of Paul'),
  B('titus', 'Titus', 'Titus', 'NT', 'Letters of Paul'),
  B('philemon', 'Philemon', 'Philemon', 'NT', 'Letters of Paul'),
  B('hebrews', 'Hebrews', 'Hebrews', 'NT', 'Letters of Paul'),
  B('james', 'James', 'James', 'NT', 'Catholic Letters'),
  B('1-peter', '1 Peter', 'I Peter', 'NT', 'Catholic Letters'),
  B('2-peter', '2 Peter', 'II Peter', 'NT', 'Catholic Letters'),
  B('1-john', '1 John', 'I John', 'NT', 'Catholic Letters'),
  B('2-john', '2 John', 'II John', 'NT', 'Catholic Letters'),
  B('3-john', '3 John', 'III John', 'NT', 'Catholic Letters'),
  B('jude', 'Jude', 'Jude', 'NT', 'Catholic Letters'),
  B('revelation', 'Revelation', 'Revelation of John', 'NT', 'Revelation', 'Apocalypse', ['apocalypse', 'rev']),
];

export const TRANSLATION = {
  id: 'DRC',
  name: 'Douay-Rheims Bible, Challoner Revision',
  short: 'Douay-Rheims',
  note:
    'Public domain. Psalms follow the traditional Vulgate (Greek) numbering used by the Douay-Rheims; the common Hebrew numbering is shown in parentheses.',
};

const norm = (s: string) => s.toLowerCase().replace(/\./g, '').replace(/\s+/g, ' ').trim();

const lookup = new Map<string, BookMeta>();
for (const b of BOOKS) {
  for (const k of [b.slug, b.name, b.src, b.douay, ...(b.aliases ?? [])]) if (k) lookup.set(norm(k), b);
}

export function findBook(name: string): BookMeta | undefined {
  return lookup.get(norm(name)) ?? lookup.get(norm(name.replace(/-/g, ' ')));
}

export interface ParsedRef {
  book: BookMeta;
  chapter: number;
  start: number;
  end: number;
}

/** Parse "John 15:4-5", "Psalms 50:3", "1 Corinthians 13:4-7". Single chapter references only. */
export function parseRef(ref: string): ParsedRef {
  const m = ref.trim().match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/);
  if (!m) throw new Error(`Bad scripture reference: ${ref}`);
  const book = findBook(m[1]);
  if (!book) throw new Error(`Unknown book in reference: ${ref}`);
  const start = Number(m[3]);
  return { book, chapter: Number(m[2]), start, end: m[4] ? Number(m[4]) : start };
}

/** Douay (Vulgate) psalm number -> common Hebrew numbering label. */
export function hebrewPsalm(dr: number): string {
  if (dr <= 8 || dr >= 148) return String(dr);
  if (dr === 9) return '9–10';
  if (dr <= 112) return String(dr + 1);
  if (dr === 113) return '114–115';
  if (dr <= 115) return '116';
  if (dr <= 145) return String(dr + 1);
  return '147';
}

export function chapterLabel(book: BookMeta, chapter: number): string {
  if (book.slug === 'psalms') {
    const h = hebrewPsalm(chapter);
    return h === String(chapter) ? `Psalm ${chapter}` : `Psalm ${chapter} (${h})`;
  }
  return `${book.name} ${chapter}`;
}

export function formatRef(ref: string): string {
  const p = parseRef(ref);
  const vs = p.start === p.end ? `${p.start}` : `${p.start}–${p.end}`;
  if (p.book.slug === 'psalms') {
    const h = hebrewPsalm(p.chapter);
    return `Psalm ${p.chapter}:${vs}` + (h === String(p.chapter) ? '' : ` (${h})`);
  }
  return `${p.book.name} ${p.chapter}:${vs}`;
}

export interface Verse {
  v: number;
  t: string;
}
export interface Passage {
  ref: string;
  display: string;
  verses: Verse[];
}
