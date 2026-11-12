// Abide Companion — a local, offline question-answering engine over curated Catholic content.
// No network calls, no paid APIs. A replaceable `AssistantProvider` interface allows an optional
// external model to be plugged in later without changing the UI.
import { KB, CRISIS_RESPONSE, type KBEntry, type AnswerKind } from '@/content/assistant';
import { SAINTS } from '@/content/saints';
import { LEARN } from '@/content/learn';
import { PRAYERS } from '@/content/prayers';
import { DEVOTIONALS, TOPIC_LABELS, type Topic } from '@/content/devotionals';
import { TOPICAL_VERSES } from '@/content/verses';
import type { Profile } from './store';

export interface CompanionAnswer {
  id: string;
  title: string;
  kind: AnswerKind | 'crisis';
  text: string; // paragraphs; a paragraph of exactly {{Ref}} renders Scripture
  sources?: string[];
  links?: { label: string; to: string }[];
  followUps?: string[];
}

export interface AssistantProvider {
  name: string;
  offline: boolean;
  answer(question: string, ctx: { profile: Profile }): Promise<CompanionAnswer>;
}

const STOP = new Set(
  'a an the and or but of to in on for with about what whats how do does did is are am was be can could should would i me my we you your it this that there their they he she his her as at by from into than then so if not no yes please tell explain help want know say mean meaning'.split(' '),
);

const toAnswer = (e: KBEntry): CompanionAnswer => ({ id: e.id, title: e.title, kind: e.kind, text: e.answer, sources: e.sources, links: e.links, followUps: e.followUps });

const stem = (w: string) => w.replace(/(ies)$/, 'y').replace(/(ing|ed|es|s)$/, '');

export function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9'\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const tokens = (s: string) =>
  normalize(s)
    .split(/[\s-]+/)
    .filter((w) => w && !STOP.has(w))
    .map(stem);

function scoreEntry(q: string, qTokens: Set<string>, e: KBEntry): number {
  let score = 0;
  for (const k of e.keywords) {
    const nk = normalize(k);
    if (q.includes(nk)) score += 3 + nk.split(' ').length * 2;
    else {
      const kt = tokens(k);
      const hit = kt.filter((t) => qTokens.has(t)).length;
      if (hit) score += hit === kt.length ? 2 + hit : hit * 0.75;
    }
  }
  for (const t of tokens(e.title)) if (qTokens.has(t)) score += 1;
  return score;
}

const CRISIS = /(suicid|kill myself|end my life|take my life|self[- ]?harm|hurt myself|want to die|no reason to live|don'?t want to live|better off dead)/;

const TOPIC_WORDS: [RegExp, Topic][] = [
  [/self[- ]?control|temperan|discipline/, 'self-control'],
  [/patien/, 'patience'],
  [/humil|pride/, 'humility'],
  [/forgiv/, 'forgiveness'],
  [/tempt/, 'temptation'],
  [/merc/, 'mercy'],
  [/faith|believ/, 'faith'],
  [/love|charity/, 'love'],
  [/pur(e|ity)|chast/, 'purity'],
  [/persever|endur|give up|keep going/, 'perseverance'],
  [/trust|worr|anxi/, 'trust'],
  [/pray/, 'prayer'],
  [/hope|despair|discourag/, 'hope'],
];

function topicAnswer(topic: Topic): CompanionAnswer {
  const refs = [...new Set([...TOPICAL_VERSES.filter((v) => v.topics.includes(topic)).map((v) => v.ref), ...DEVOTIONALS.filter((d) => d.topic === topic).map((d) => d.ref)])].slice(0, 4);
  const devs = DEVOTIONALS.filter((d) => d.topic === topic).slice(0, 3);
  return {
    id: `topic-${topic}`,
    title: `Scripture on ${TOPIC_LABELS[topic].toLowerCase()}`,
    kind: 'pastoral',
    text: [
      `Here are some passages from the Douay-Rheims Bible on ${TOPIC_LABELS[topic].toLowerCase()}. Read them slowly, and notice which word or phrase speaks to you.`,
      ...refs.map((r) => `{{${r}}}`),
      devs.length ? `For a deeper reflection, try one of the devotionals linked below.` : '',
    ]
      .filter(Boolean)
      .join('\n\n'),
    links: devs.map((d) => ({ label: `Devotional: ${d.title}`, to: `/devotional?id=${d.id}` })),
  };
}

function recommendAnswer(profile: Profile): CompanionAnswer {
  const topic = profile.focus;
  const dev = DEVOTIONALS.filter((d) => d.topic === topic);
  const prayers = PRAYERS.filter((p) => p.tags?.includes(topic) || p.category === 'difficult').slice(0, 3);
  const saint = SAINTS.find((s) => s.tags?.includes(topic)) ?? SAINTS[0];
  return {
    id: 'recommend',
    title: `Recommended for you`,
    kind: 'pastoral',
    text: [
      `Since your current focus is ${TOPIC_LABELS[topic].toLowerCase()}, here is a small plan for this week:`,
      `• Pray with ${dev.length} devotionals on ${TOPIC_LABELS[topic].toLowerCase()}, one each morning.\n• Keep a short prayer close for difficult moments.\n• Walk with ${saint.name}, who knew this struggle.\n• End each day with the examination of conscience.`,
      dev[0] ? `{{${dev[0].ref}}}` : '',
    ]
      .filter(Boolean)
      .join('\n\n'),
    links: [
      ...dev.slice(0, 3).map((d) => ({ label: `Devotional: ${d.title}`, to: `/devotional?id=${d.id}` })),
      ...prayers.map((p) => ({ label: p.title, to: `/faith/prayers/${p.id}` })),
      { label: saint.name, to: `/faith/saints/${saint.id}` },
      { label: 'Examination of conscience', to: '/faith/prayers/examen' },
    ],
  };
}

function saintAnswer(q: string): CompanionAnswer | null {
  const s = SAINTS.find((x) => {
    const parts = normalize(x.name)
      .replace(/^(saint|venerable) /, '')
      .split(' ')
      .filter((p) => p.length > 3 && !['saint', 'assisi', 'hippo', 'lisieux', 'calcutta'].includes(p));
    return parts.some((p) => new RegExp(`\\b${p}\\b`).test(q));
  });
  if (!s) return null;
  return {
    id: `saint-${s.id}`,
    title: `Learning from ${s.name}`,
    kind: 'pastoral',
    text: [...s.bio, `What they struggled with: ${s.struggles}`, `A lesson for us: ${s.lesson}`, s.quote ? `“${s.quote.text}” — ${s.quote.source}` : '', `A prayer: ${s.prayer}`].filter(Boolean).join('\n\n'),
    links: [{ label: `Full profile of ${s.name}`, to: `/faith/saints/${s.id}` }],
  };
}

function learnAnswer(q: string, qTokens: Set<string>): CompanionAnswer | null {
  let best: { score: number; cat: (typeof LEARN)[number]; art: (typeof LEARN)[number]['articles'][number] } | null = null;
  for (const cat of LEARN)
    for (const art of cat.articles) {
      const tt = tokens(art.title);
      let score = tt.filter((t) => qTokens.has(t)).length * 2;
      if (q.includes(normalize(art.title))) score += 4;
      if (score > (best?.score ?? 0)) best = { score, cat, art };
    }
  if (!best || best.score < 2) return null;
  const { cat, art } = best;
  const text = art.blocks
    .map((b) => {
      if (b.type === 'p' || b.type === 'h') return b.text;
      if (b.type === 'scripture') return `{{${b.ref}}}`;
      if (b.type === 'list') return b.items.map((i) => `• ${i}`).join('\n');
      if (b.type === 'callout') return `${b.title}: ${b.text}`;
      return `“${b.text}” (${b.source})`;
    })
    .join('\n\n');
  return {
    id: `learn-${art.id}`,
    title: art.title,
    kind: art.blocks.some((b) => b.type === 'teaching') ? 'teaching' : 'pastoral',
    text: `${art.summary}\n\n${text}`,
    links: [{ label: `${cat.title}: ${art.title}`, to: `/faith/learn/${cat.id}/${art.id}` }],
  };
}

function prayerAnswer(q: string): CompanionAnswer | null {
  const p = PRAYERS.find((x) => q.includes(normalize(x.title)) || (x.latinTitle && q.includes(normalize(x.latinTitle))));
  if (!p) return null;
  return { id: `prayer-${p.id}`, title: p.title, kind: 'pastoral', text: `${p.text}${p.note ? `\n\n${p.note}` : ''}`, links: [{ label: `Open “${p.title}”`, to: `/faith/prayers/${p.id}` }] };
}

const FALLBACK: CompanionAnswer = {
  id: 'fallback',
  title: 'Let’s look together',
  kind: 'practical',
  text: `I don't have a confident answer to that in my library, and I'd rather not guess about matters of faith.\n\nYou might try rephrasing, or explore the topics below. For questions about your own situation — or anything I can't answer — please ask a priest you trust. The Catechism of the Catholic Church is also an excellent, reliable resource.`,
  links: [
    { label: 'Grow in Faith library', to: '/faith' },
    { label: 'Prayers for difficult moments', to: '/faith/prayers' },
    { label: 'Search the Bible', to: '/faith/bible' },
  ],
  followUps: ['How do I develop a stronger relationship with Jesus?', 'How does confession work?', 'Help me build a daily spiritual routine'],
};

export const localProvider: AssistantProvider = {
  name: 'Abide local knowledge base',
  offline: true,
  async answer(question, { profile }) {
    const q = normalize(question);
    if (CRISIS.test(q)) return { id: 'crisis', title: 'You are not alone', kind: 'crisis', text: CRISIS_RESPONSE };
    const qTokens = new Set(tokens(q));

    if (/(recommend|suggest|what should i (pray|read)|plan for me|for me this week|personali)/.test(q)) return recommendAnswer(profile);

    let best: { e: KBEntry; s: number } | null = null;
    for (const e of KB) {
      const s = scoreEntry(q, qTokens, e);
      if (s > (best?.s ?? 0)) best = { e, s };
    }
    const saint = saintAnswer(q);
    // A named saint wins unless the knowledge base has a strong dedicated entry.
    if (saint && (!best || best.s < 8)) return saint;
    if (best && best.s >= 3) return toAnswer(best.e);

    const prayer = prayerAnswer(q);
    if (prayer) return prayer;

    if (/(bible|scripture|verse|passage|say about|says about)/.test(q) || qTokens.size <= 3) {
      const t = TOPIC_WORDS.find(([re]) => re.test(q));
      if (t) return topicAnswer(t[1]);
    }
    const learn = learnAnswer(q, qTokens);
    if (learn) return learn;
    const t = TOPIC_WORDS.find(([re]) => re.test(q));
    if (t) return topicAnswer(t[1]);
    if (best && best.s >= 1.5) return toAnswer(best.e);
    return FALLBACK;
  },
};

export const provider: AssistantProvider = localProvider;
