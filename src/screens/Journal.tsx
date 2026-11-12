import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { type LucideIcon, Plus, Search, Lock, Heart, HandHeart, BookOpen, PenLine, Award, Feather, Check } from 'lucide-react';
import { Card, Empty, Page, cx } from '@/components/ui';
import { useStore, type JournalType } from '@/lib/store';
import { useToday } from '@/lib/hooks';
import { promptFor, JOURNAL_PROMPTS } from '@/lib/daily';
import { formatShort, parseKey } from '@/lib/dates';
import { MILESTONES } from '@/lib/progress';

export const TYPE_META: Record<JournalType, { label: string; icon: LucideIcon; tone: string }> = {
  reflection: { label: 'Reflection', icon: PenLine, tone: 'bg-sage-soft text-forest' },
  gratitude: { label: 'Gratitude', icon: Heart, tone: 'bg-rose/10 text-rose' },
  intention: { label: 'Prayer intention', icon: HandHeart, tone: 'bg-gold-soft text-gold' },
  scripture: { label: 'Scripture note', icon: BookOpen, tone: 'bg-sage-soft text-forest' },
  milestone: { label: 'Milestone', icon: Award, tone: 'bg-gold-soft text-gold' },
  free: { label: 'Free writing', icon: Feather, tone: 'bg-surface-2 text-ink-soft' },
};

const FILTERS: (JournalType | 'all')[] = ['all', 'reflection', 'gratitude', 'intention', 'scripture', 'milestone', 'free'];

interface Item {
  id: string;
  type: JournalType;
  date: string;
  title?: string;
  body: string;
  prompt?: string;
  answered?: boolean;
  virtual?: boolean;
}

export default function Journal() {
  const nav = useNavigate();
  const today = useToday();
  const journal = useStore((s) => s.journal);
  const milestones = useStore((s) => s.milestones);
  const upsert = useStore((s) => s.upsertJournal);
  const [filter, setFilter] = useState<JournalType | 'all'>('all');
  const [q, setQ] = useState('');
  const prompt = promptFor(today);

  const items = useMemo<Item[]>(() => {
    const virtual: Item[] = Object.entries(milestones).map(([id, date]) => {
      const m = MILESTONES.find((x) => x.id === id);
      return { id: `m-${id}`, type: 'milestone', date, title: m?.title ?? id, body: m?.description ?? '', virtual: true };
    });
    const all = [...journal, ...virtual].sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? 1 : -1));
    const query = q.trim().toLowerCase();
    return all.filter((e) => (filter === 'all' || e.type === filter) && (!query || `${e.title ?? ''} ${e.body} ${e.prompt ?? ''}`.toLowerCase().includes(query)));
  }, [journal, milestones, filter, q]);

  const groups = useMemo(() => {
    const g = new Map<string, Item[]>();
    for (const e of items) {
      const k = parseKey(e.date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
      g.set(k, [...(g.get(k) ?? []), e]);
    }
    return [...g.entries()];
  }, [items]);

  const openIntentions = journal.filter((j) => j.type === 'intention' && !j.answered).length;

  return (
    <Page>
      <header className="flex items-end justify-between px-1 pt-6">
        <div>
          <p className="eyebrow flex items-center gap-1.5">
            <Lock size={11} /> Private journal
          </p>
          <h1 className="display mt-2 text-[2.4rem] leading-tight">Journal</h1>
        </div>
        <Link to="/journal/new" className="btn-primary !px-4" aria-label="New entry">
          <Plus size={18} /> New
        </Link>
      </header>

      <Card className="mt-5 !border-gold/30" onClick={() => nav(`/journal/new?type=reflection&prompt=${encodeURIComponent(prompt)}`)}>
        <p className="eyebrow text-gold">Today’s prompt</p>
        <p className="serif mt-1 text-[1.45rem] italic leading-snug">{prompt}</p>
        <p className="mt-2 text-sm text-ink-soft">Tap to write</p>
      </Card>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {(
          [
            ['gratitude', 'Gratitude', Heart],
            ['intention', 'Intention', HandHeart],
            ['free', 'Free write', Feather],
          ] as const
        ).map(([t, l, Icon]) => (
          <Link key={t} to={`/journal/new?type=${t}`} className="card flex flex-col items-center gap-1.5 !rounded-2xl py-3 text-sm">
            <Icon size={18} className="text-gold" /> {l}
          </Link>
        ))}
      </div>

      {openIntentions > 0 && <p className="mt-3 px-1 text-sm text-ink-soft">{openIntentions} prayer {openIntentions === 1 ? 'intention' : 'intentions'} you are carrying to God.</p>}

      <div className="relative mt-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input className="field !pl-11" placeholder="Search your journal" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cx('chip shrink-0', filter === f && 'chip-active')}>
            {f === 'all' ? 'All' : TYPE_META[f].label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {!items.length ? (
          <Empty
            icon={<Feather size={22} />}
            title={q || filter !== 'all' ? 'Nothing found' : 'A place for your heart'}
            text={q || filter !== 'all' ? 'Try another search or filter.' : `Write freely — gratitude, prayers, what God is showing you. Try: “${JOURNAL_PROMPTS[0]}”`}
          />
        ) : (
          groups.map(([month, list]) => (
            <section key={month} className="mb-6">
              <p className="eyebrow mb-2 px-1">{month}</p>
              <div className="space-y-2">
                {list.map((e) => {
                  const M = TYPE_META[e.type];
                  const inner = (
                    <>
                      <span className={cx('grid h-10 w-10 shrink-0 place-items-center rounded-2xl', M.tone)}>
                        <M.icon size={18} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2 text-xs text-ink-faint">
                          {M.label} · {formatShort(e.date)}
                          {e.type === 'intention' && e.answered && (
                            <span className="flex items-center gap-0.5 text-forest">
                              <Check size={12} /> answered
                            </span>
                          )}
                        </span>
                        {e.title && <span className="block font-medium">{e.title}</span>}
                        {e.prompt && !e.title && <span className="serif block italic text-ink-soft">{e.prompt.length > 90 ? e.prompt.slice(0, 90) + '…' : e.prompt}</span>}
                        <span className="line-clamp-2 block text-[0.95rem] text-ink">{e.body}</span>
                      </span>
                    </>
                  );
                  return e.virtual ? (
                    <div key={e.id} className="card flex gap-3 !rounded-2xl p-4">
                      {inner}
                    </div>
                  ) : (
                    <div key={e.id} className="card flex gap-3 !rounded-2xl p-4">
                      <Link to={`/journal/${e.id}`} className="flex min-w-0 flex-1 gap-3">
                        {inner}
                      </Link>
                      {e.type === 'intention' && (
                        <button
                          onClick={() => upsert({ id: e.id, type: 'intention', body: e.body, answered: !e.answered })}
                          aria-label={e.answered ? 'Mark as still praying' : 'Mark as answered'}
                          className={cx('h-8 shrink-0 self-center rounded-full border px-3 text-xs', e.answered ? 'border-forest bg-sage-soft text-forest' : 'border-line-strong text-ink-soft')}
                        >
                          {e.answered ? 'Answered' : 'Praying'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>
    </Page>
  );
}
