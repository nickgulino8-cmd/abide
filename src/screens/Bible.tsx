import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, Bookmark, BookmarkCheck, NotebookPen, Loader2, X } from 'lucide-react';
import { Page, Sheet, TopBar, cx, toast } from '@/components/ui';
import { BOOKS, TRANSLATION, chapterLabel, findBook, hebrewPsalm } from '@/lib/bible';
import { chapterCount, loadBook, searchBible, type SearchHit } from '@/lib/scripture';
import { useStore } from '@/lib/store';

export default function Bible() {
  const { book, chapter } = useParams();
  if (book && chapter) return <ChapterView slug={book} chapter={Number(chapter)} />;
  return <BookPicker />;
}

function BookPicker() {
  const nav = useNavigate();
  const [testament, setTestament] = useState<'OT' | 'NT'>('NT');
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<SearchHit[] | null>(null);
  const [progress, setProgress] = useState(0);
  const [searching, setSearching] = useState(false);
  const [pick, setPick] = useState<string | null>(null);
  const groups = useMemo(() => {
    const g = new Map<string, typeof BOOKS>();
    for (const b of BOOKS.filter((b) => b.testament === testament)) g.set(b.group, [...(g.get(b.group) ?? []), b]);
    return [...g.entries()];
  }, [testament]);

  const run = async () => {
    if (query.trim().length < 3) return toast('Type at least 3 letters to search');
    setSearching(true);
    setHits(null);
    try {
      setHits(await searchBible(query, 100, setProgress));
    } catch {
      toast('Search is unavailable right now.');
    }
    setSearching(false);
  };

  const pickBook = pick ? findBook(pick)! : null;

  return (
    <Page>
      <TopBar title="Holy Bible" subtitle={TRANSLATION.name} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run();
        }}
        className="relative"
      >
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input className="field !pl-11 !pr-10" placeholder="Search the whole Bible (e.g. “mercy”)" value={query} onChange={(e) => setQuery(e.target.value)} enterKeyHint="search" />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery('');
              setHits(null);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint"
          >
            <X size={17} />
          </button>
        )}
      </form>

      {searching && (
        <div className="mt-4 flex items-center gap-3 text-sm text-ink-soft">
          <Loader2 size={16} className="animate-spin" /> Searching… {Math.round(progress * 100)}%
        </div>
      )}

      {hits ? (
        <div className="mt-4">
          <p className="mb-2 text-sm text-ink-soft">
            {hits.length} {hits.length === 1 ? 'verse' : 'verses'}
            {hits.length >= 100 ? ' (first 100)' : ''}
          </p>
          <div className="space-y-2">
            {hits.map((h) => (
              <Link key={`${h.slug}${h.chapter}:${h.verse}`} to={`/faith/bible/${h.slug}/${h.chapter}#v${h.verse}`} className="card block !rounded-2xl p-4">
                <p className="text-xs font-semibold text-forest">
                  {chapterLabel(findBook(h.slug)!, h.chapter)}:{h.verse}
                </p>
                <p className="serif mt-1 text-[1.1rem] leading-snug">{h.text}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-2 gap-1 rounded-full bg-surface-2 p-1">
            {(['OT', 'NT'] as const).map((t) => (
              <button key={t} onClick={() => setTestament(t)} className={cx('rounded-full py-2 text-sm font-medium transition', testament === t ? 'bg-surface text-ink shadow-soft' : 'text-ink-soft')}>
                {t === 'OT' ? 'Old Testament' : 'New Testament'}
              </button>
            ))}
          </div>
          {groups.map(([group, books]) => (
            <section key={group} className="mt-6">
              <p className="eyebrow mb-2 px-1">{group}</p>
              <div className="card divide-y divide-line !rounded-3xl px-4">
                {books.map((b) => (
                  <button key={b.slug} onClick={() => (chapterCount(b.slug) === 1 ? nav(`/faith/bible/${b.slug}/1`) : setPick(b.slug))} className="flex w-full items-center justify-between py-3.5 text-left">
                    <span>
                      <span className="font-medium">{b.name}</span>
                      {b.douay && <span className="ml-2 text-xs text-ink-faint">Douay: {b.douay}</span>}
                    </span>
                    <span className="flex items-center gap-2 text-xs text-ink-faint">
                      {chapterCount(b.slug)} <ChevronRight size={16} />
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ))}
          <p className="mt-6 px-1 text-xs leading-relaxed text-ink-faint">{TRANSLATION.note}</p>
        </>
      )}

      <Sheet open={!!pick} onClose={() => setPick(null)} title={pickBook?.name}>
        {pickBook && (
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: chapterCount(pickBook.slug) }, (_, i) => i + 1).map((c) => (
              <button key={c} onClick={() => nav(`/faith/bible/${pickBook.slug}/${c}`)} className="aspect-square rounded-xl bg-surface-2 text-sm font-medium hover:bg-sage-soft">
                {c}
              </button>
            ))}
          </div>
        )}
      </Sheet>
    </Page>
  );
}

function ChapterView({ slug, chapter }: { slug: string; chapter: number }) {
  const nav = useNavigate();
  const meta = findBook(slug);
  const [verses, setVerses] = useState<string[] | null>(null);
  const [error, setError] = useState(false);
  const [sel, setSel] = useState<number[]>([]);
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState('');
  const saved = useStore((s) => s.saved);
  const saveVerse = useStore((s) => s.saveVerse);
  const updateSaved = useStore((s) => s.updateSaved);
  const toggleSaved = useStore((s) => s.toggleSaved);
  const setBibleLast = useStore((s) => s.setBibleLast);
  const markRead = useStore((s) => s.markRead);
  const upsertJournal = useStore((s) => s.upsertJournal);
  const total = chapterCount(slug);

  useEffect(() => {
    if (!meta) return;
    setVerses(null);
    setSel([]);
    setError(false);
    loadBook(slug)
      .then((chs) => {
        setVerses(chs[chapter - 1] ?? []);
        setBibleLast(slug, chapter);
        markRead(`${meta.name} ${chapter}`);
        const hash = location.hash.match(/^#v(\d+)$/);
        if (hash) setTimeout(() => document.getElementById(`v${hash[1]}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 50);
      })
      .catch(() => setError(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, chapter]);

  if (!meta) return <Page><TopBar title="Not found" /></Page>;

  const sorted = [...sel].sort((a, b) => a - b);
  const contiguous = sorted.every((v, i) => i === 0 || v === sorted[i - 1] + 1);
  const range = sorted.length ? (sorted.length === 1 ? `${sorted[0]}` : `${sorted[0]}-${sorted[sorted.length - 1]}`) : '';
  const ref = sorted.length ? `${meta.name} ${chapter}:${range}` : '';
  const display = sorted.length ? `${chapterLabel(meta, chapter).replace(/ \(.+\)$/, '')}:${range.replace('-', '–')}${meta.slug === 'psalms' && hebrewPsalm(chapter) !== String(chapter) ? ` (${hebrewPsalm(chapter)})` : ''}` : '';
  const selText = verses ? sorted.map((v) => verses[v - 1]).join(' ') : '';
  const isSaved = saved.some((x) => x.ref === ref);

  return (
    <Page>
      <TopBar title={chapterLabel(meta, chapter)} subtitle={meta.douay ? `Douay: ${meta.douay} · ${TRANSLATION.short}` : TRANSLATION.short} back="/faith/bible" />
      {error && <p className="card card-pad text-ink-soft">This book could not be loaded. If you are offline, open Abide once while online so the Bible can be saved for offline reading.</p>}
      {!verses && !error && (
        <div className="grid place-items-center py-20 text-ink-faint">
          <Loader2 className="animate-spin" />
        </div>
      )}
      {verses && (
        <article className="card card-pad !p-6">
          <h2 className="display mb-4 text-center text-3xl">{chapterLabel(meta, chapter)}</h2>
          <p className="scripture !text-[1.22rem]">
            {verses.map((t, i) => {
              const v = i + 1;
              const on = sel.includes(v);
              return (
                <span
                  id={`v${v}`}
                  key={v}
                  onClick={() => setSel((s) => (on ? s.filter((x) => x !== v) : [...s, v]))}
                  className={cx('cursor-pointer rounded transition', on ? 'bg-gold-soft underline decoration-gold decoration-2 underline-offset-4' : 'hover:bg-surface-2')}
                >
                  <sup className="verse-num">{v}</sup>
                  {t}{' '}
                </span>
              );
            })}
          </p>
          <p className="mt-6 text-center text-xs text-ink-faint">Tap a verse to save it or write a note.</p>
        </article>
      )}

      <div className="mt-5 flex items-center justify-between">
        <button disabled={chapter <= 1} onClick={() => nav(`/faith/bible/${slug}/${chapter - 1}`)} className="btn-ghost !py-2.5">
          <ChevronLeft size={17} /> Previous
        </button>
        <span className="text-xs text-ink-faint">
          {chapter} / {total}
        </span>
        <button disabled={chapter >= total} onClick={() => nav(`/faith/bible/${slug}/${chapter + 1}`)} className="btn-ghost !py-2.5">
          Next <ChevronRight size={17} />
        </button>
      </div>

      {sel.length > 0 && (
        <div className="pb-safe fixed inset-x-0 bottom-20 z-30 mx-auto w-[calc(100%-2rem)] max-w-xl">
          <div className="card flex items-center gap-2 !rounded-full px-3 py-2 shadow-lift">
            <span className="flex-1 truncate pl-2 text-sm font-medium">{contiguous ? display : 'Select adjacent verses'}</span>
            <button
              disabled={!contiguous}
              aria-label="Save selected verses"
              onClick={() => {
                if (isSaved) toggleSaved(ref);
                else saveVerse(ref, display, selText);
                toast(isSaved ? 'Removed from saved' : 'Saved to My Scripture');
              }}
              className="grid h-10 w-10 place-items-center rounded-full text-gold hover:bg-surface-2 disabled:opacity-40"
            >
              {isSaved ? <BookmarkCheck size={19} /> : <Bookmark size={19} />}
            </button>
            <button disabled={!contiguous} aria-label="Write a note" onClick={() => setNoteOpen(true)} className="grid h-10 w-10 place-items-center rounded-full text-forest hover:bg-surface-2 disabled:opacity-40">
              <NotebookPen size={19} />
            </button>
            <button aria-label="Clear selection" onClick={() => setSel([])} className="grid h-10 w-10 place-items-center rounded-full text-ink-faint hover:bg-surface-2">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <Sheet open={noteOpen} onClose={() => setNoteOpen(false)} title={display}>
        <p className="serif text-[1.15rem] leading-relaxed">{selText}</p>
        <textarea rows={4} className="field mt-4 resize-none" placeholder="Your note on this passage…" value={note} onChange={(e) => setNote(e.target.value)} />
        <button
          className="btn-primary mt-3 w-full"
          disabled={!note.trim()}
          onClick={() => {
            saveVerse(ref, display, selText);
            updateSaved(ref, { note: note.trim() });
            upsertJournal({ type: 'scripture', body: note.trim(), ref, title: display, prompt: selText });
            setNote('');
            setNoteOpen(false);
            setSel([]);
            toast('Note saved to My Scripture and your journal');
          }}
        >
          Save note
        </button>
      </Sheet>
    </Page>
  );
}
