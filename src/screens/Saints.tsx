import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Search, Sparkles, ChevronRight, CalendarDays, Quote } from 'lucide-react';
import { Card, Page, SectionHeader, TopBar, cx } from '@/components/ui';
import { SAINTS, saintById } from '@/content/saints';
import { saintFor } from '@/lib/daily';
import { useToday } from '@/lib/hooks';
import { parseKey } from '@/lib/dates';

const feastLabel = (m: number, d: number) => new Date(2000, m - 1, d).toLocaleDateString(undefined, { month: 'long', day: 'numeric' });

export default function Saints() {
  const { id } = useParams();
  if (id) return <SaintDetail id={id} />;
  return <SaintList />;
}

function SaintList() {
  const today = useToday();
  const sod = saintFor(today);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<'featured' | 'month' | 'all'>('featured');
  const month = parseKey(today).getMonth() + 1;
  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return SAINTS.filter((s) => {
      if (query) return `${s.name} ${s.title} ${s.patron ?? ''} ${(s.tags ?? []).join(' ')} ${s.virtues.join(' ')}`.toLowerCase().includes(query);
      if (filter === 'featured') return s.featured;
      if (filter === 'month') return s.feast?.m === month;
      return true;
    }).sort((a, b) => (filter === 'month' ? (a.feast?.d ?? 0) - (b.feast?.d ?? 0) : 0));
  }, [q, filter, month]);

  return (
    <Page>
      <TopBar title="Saints" subtitle="A great cloud of witnesses" />
      <Link to={`/faith/saints/${sod.saint.id}`} className="card block !rounded-[2rem] p-5" style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--surface))' }}>
        <p className="eyebrow text-gold">{sod.isFeast ? 'Feast today' : 'Saint for today'}</p>
        <p className="display mt-1 text-[1.8rem] leading-tight">{sod.saint.name}</p>
        <p className="text-sm text-ink-soft">{sod.saint.title}</p>
        <p className="mt-3 text-[0.97rem] text-ink">{sod.saint.lesson}</p>
      </Link>

      <div className="relative mt-5">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input className="field !pl-11" placeholder="Search by name, virtue, or patronage" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {!q && (
        <div className="mt-3 flex gap-2">
          {(
            [
              ['featured', 'Featured'],
              ['month', 'This month'],
              ['all', 'All saints'],
            ] as const
          ).map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)} className={cx('chip', filter === k && 'chip-active')}>
              {l}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 space-y-2">
        {list.map((s) => (
          <Link key={s.id} to={`/faith/saints/${s.id}`} className="card flex items-center gap-4 !rounded-2xl px-4 py-3.5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/40 bg-gold-soft">
              <Sparkles size={17} className="text-gold" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium">{s.name}</span>
              <span className="block truncate text-xs text-ink-soft">
                {s.feast ? feastLabel(s.feast.m, s.feast.d) : s.years} · {s.title}
              </span>
            </span>
            <ChevronRight size={17} className="text-ink-faint" />
          </Link>
        ))}
        {!list.length && <p className="py-8 text-center text-ink-soft">No saints found.</p>}
      </div>
    </Page>
  );
}

function SaintDetail({ id }: { id: string }) {
  const s = saintById(id);
  if (!s) return <Page><TopBar title="Saint not found" /></Page>;
  return (
    <Page>
      <TopBar title="Saints" back="/faith/saints" />
      <header className="px-1 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-gold/40 bg-gold-soft">
          <Sparkles size={30} className="text-gold" />
        </div>
        <h1 className="display mt-4 text-[2.3rem] leading-tight">{s.name}</h1>
        <p className="text-ink-soft">{s.title}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs">
          <span className="chip">{s.years}</span>
          {s.feast && (
            <span className="chip">
              <CalendarDays size={13} /> Feast: {feastLabel(s.feast.m, s.feast.d)}
            </span>
          )}
        </div>
        {s.feastNote && <p className="mt-2 text-xs text-ink-faint">{s.feastNote}</p>}
        {s.patron && <p className="mt-2 text-sm text-ink-soft">Patron of {s.patron.charAt(0).toLowerCase() + s.patron.slice(1)}</p>}
      </header>

      <SectionHeader title="Life" />
      <div className="space-y-3 px-1 text-[1.04rem] leading-[1.75]">
        {s.bio.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {s.quote && (
        <div className="card card-pad mt-6 text-center">
          <Quote size={20} className="mx-auto text-gold" />
          <p className="serif mt-2 text-[1.45rem] italic leading-snug">“{s.quote.text}”</p>
          <p className="mt-2 text-xs text-ink-faint">— {s.quote.source}</p>
        </div>
      )}

      <SectionHeader title="Struggles" />
      <Card>
        <p className="leading-relaxed text-ink-soft">{s.struggles}</p>
      </Card>

      <SectionHeader title="Virtues" />
      <div className="flex flex-wrap gap-2 px-1">
        {s.virtues.map((v) => (
          <span key={v} className="chip !border-gold/40 !bg-gold-soft/60 !text-ink">
            {v}
          </span>
        ))}
      </div>

      <SectionHeader title="A lesson for today" />
      <Card className="!border-forest/30 !bg-sage-soft/50">
        <p className="text-[1.04rem] leading-relaxed">{s.lesson}</p>
      </Card>

      <SectionHeader title="Ask for their prayers" />
      <Card>
        <p className="serif text-[1.3rem] leading-relaxed">{s.prayer}</p>
      </Card>
      <p className="mt-6 px-1 text-xs leading-relaxed text-ink-faint">
        Catholics ask the saints to pray for them, as we ask friends on earth to pray for us. The saints do not replace Christ; they point us to him.
      </p>
    </Page>
  );
}
