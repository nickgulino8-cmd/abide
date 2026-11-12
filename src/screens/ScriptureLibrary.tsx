import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, History, Search, Trash2, NotebookPen, BookOpen } from 'lucide-react';
import { Empty, Page, Scripture, Sheet, TopBar, cx, toast } from '@/components/ui';
import { useStore } from '@/lib/store';
import { DEVOTIONALS, TOPIC_LABELS, type Topic } from '@/content/devotionals';
import { TOPICAL_VERSES } from '@/content/verses';
import { getPassage } from '@/lib/scripture';
import { BOOKS, TRANSLATION, parseRef } from '@/lib/bible';
import { devotionalById } from '@/lib/daily';
import { formatShort } from '@/lib/dates';

type Tab = 'saved' | 'history' | 'browse';

export default function ScriptureLibrary() {
  const [tab, setTab] = useState<Tab>('saved');
  return (
    <Page>
      <TopBar title="My Scripture" subtitle={TRANSLATION.name} />
      <div className="grid grid-cols-3 gap-1 rounded-full bg-surface-2 p-1">
        {(
          [
            ['saved', 'Saved', Bookmark],
            ['history', 'History', History],
            ['browse', 'Browse', Search],
          ] as const
        ).map(([k, l, Icon]) => (
          <button key={k} onClick={() => setTab(k)} className={cx('flex items-center justify-center gap-1.5 rounded-full py-2 text-sm font-medium transition', tab === k ? 'bg-surface text-ink shadow-soft' : 'text-ink-soft')}>
            <Icon size={15} /> {l}
          </button>
        ))}
      </div>
      <div className="mt-5">
        {tab === 'saved' && <Saved />}
        {tab === 'history' && <HistoryTab />}
        {tab === 'browse' && <Browse />}
      </div>
    </Page>
  );
}

function SavedCard({ refId, text, display, note, onNote, onRemove }: { refId: string; text?: string; display?: string; note?: string; onNote: () => void; onRemove: () => void }) {
  const known = !!getPassage(refId);
  return (
    <div className="card card-pad">
      {known ? (
        <Scripture refId={refId} size="sm" />
      ) : (
        <figure>
          <blockquote className="scripture !text-[1.08rem]">{text}</blockquote>
          <figcaption className="mt-3 text-sm font-semibold text-forest">
            {display ?? refId} <span className="text-xs font-normal text-ink-faint">· {TRANSLATION.short}</span>
          </figcaption>
        </figure>
      )}
      {note && <p className="mt-3 rounded-2xl bg-surface-2 p-3 text-sm text-ink-soft">{note}</p>}
      <div className="mt-3 flex gap-2">
        <button className="btn-soft !px-3 !py-1.5 text-sm" onClick={onNote}>
          <NotebookPen size={15} /> {note ? 'Edit note' : 'Add note'}
        </button>
        <button className="btn-soft !px-3 !py-1.5 text-sm" onClick={onRemove} aria-label="Remove from saved">
          <Trash2 size={15} /> Remove
        </button>
      </div>
    </div>
  );
}

function Saved() {
  const saved = useStore((s) => s.saved);
  const updateSaved = useStore((s) => s.updateSaved);
  const toggleSaved = useStore((s) => s.toggleSaved);
  const [editing, setEditing] = useState<string | null>(null);
  const [note, setNote] = useState('');
  if (!saved.length)
    return (
      <Empty
        icon={<Bookmark size={22} />}
        title="No saved Scripture yet"
        text="Tap the bookmark on any passage — in your devotional, the Bible, or here in Browse — to keep it close."
        action={
          <Link to="/faith/bible" className="btn-primary">
            Open the Bible
          </Link>
        }
      />
    );
  return (
    <div className="space-y-3">
      {saved.map((s) => (
        <SavedCard
          key={s.ref}
          refId={s.ref}
          text={s.text}
          display={s.display}
          note={s.note}
          onNote={() => {
            setEditing(s.ref);
            setNote(s.note ?? '');
          }}
          onRemove={() => {
            toggleSaved(s.ref);
            toast('Removed');
          }}
        />
      ))}
      <Sheet open={!!editing} onClose={() => setEditing(null)} title="Your note">
        <textarea rows={5} className="field resize-none" value={note} onChange={(e) => setNote(e.target.value)} placeholder="What is God saying to you in this passage?" />
        <button
          className="btn-primary mt-3 w-full"
          onClick={() => {
            if (editing) updateSaved(editing, { note: note.trim() || undefined });
            setEditing(null);
            toast('Note saved');
          }}
        >
          Save
        </button>
      </Sheet>
    </div>
  );
}

function HistoryTab() {
  const devotions = useStore((s) => s.devotions);
  const entries = Object.entries(devotions).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  if (!entries.length)
    return (
      <Empty
        icon={<History size={22} />}
        title="Your reading history"
        text="Each devotional you complete appears here, so you can return to it."
        action={
          <Link to="/devotional" className="btn-primary">
            Begin today’s devotional
          </Link>
        }
      />
    );
  return (
    <div className="space-y-2">
      {entries.map(([date, d]) => {
        const dev = devotionalById(d.id);
        if (!dev) return null;
        return (
          <Link key={date} to={`/devotional?id=${dev.id}`} className="card block !rounded-2xl p-4">
            <p className="text-xs text-ink-faint">{formatShort(date)}</p>
            <p className="display text-xl">{dev.title}</p>
            <p className="text-sm text-forest">{getPassage(dev.ref)?.display}</p>
          </Link>
        );
      })}
    </div>
  );
}

function Browse() {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [book, setBook] = useState('');
  const [q, setQ] = useState('');
  const results = useMemo(() => {
    const refs = new Map<string, Set<Topic>>();
    for (const d of DEVOTIONALS) refs.set(d.ref, new Set([...(refs.get(d.ref) ?? []), d.topic]));
    for (const v of TOPICAL_VERSES) refs.set(v.ref, new Set([...(refs.get(v.ref) ?? []), ...v.topics]));
    const query = q.trim().toLowerCase();
    return [...refs.entries()]
      .filter(([ref, topics]) => {
        const p = getPassage(ref);
        if (!p) return false;
        if (topic && !topics.has(topic)) return false;
        if (book && parseRef(ref).book.slug !== book) return false;
        if (query && !p.verses.some((v) => v.t.toLowerCase().includes(query)) && !p.display.toLowerCase().includes(query)) return false;
        return true;
      })
      .map(([ref]) => ref);
  }, [topic, book, q]);
  const usedBooks = useMemo(() => {
    const s = new Set([...DEVOTIONALS.map((d) => parseRef(d.ref).book.slug), ...TOPICAL_VERSES.map((v) => parseRef(v.ref).book.slug)]);
    return BOOKS.filter((b) => s.has(b.slug));
  }, []);

  return (
    <div>
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input className="field !pl-11" placeholder="Search words in these passages" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <p className="eyebrow mb-2 mt-5 px-1">By topic</p>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(TOPIC_LABELS) as Topic[]).map((t) => (
          <button key={t} onClick={() => setTopic(topic === t ? null : t)} className={cx('chip', topic === t && 'chip-active')}>
            {TOPIC_LABELS[t]}
          </button>
        ))}
      </div>
      <p className="eyebrow mb-2 mt-5 px-1">By book</p>
      <select className="field" value={book} onChange={(e) => setBook(e.target.value)} aria-label="Filter by book">
        <option value="">All books</option>
        {usedBooks.map((b) => (
          <option key={b.slug} value={b.slug}>
            {b.name}
          </option>
        ))}
      </select>
      <p className="mb-3 mt-5 px-1 text-sm text-ink-soft">
        {results.length} {results.length === 1 ? 'passage' : 'passages'}
      </p>
      <div className="space-y-3">
        {results.map((r) => (
          <div key={r} className="card card-pad">
            <Scripture refId={r} size="sm" />
          </div>
        ))}
      </div>
      <Link to="/faith/bible" className="card mt-4 flex items-center gap-3 !rounded-2xl p-4 text-sm">
        <BookOpen size={18} className="text-forest" /> Search the entire Bible instead
      </Link>
    </div>
  );
}
