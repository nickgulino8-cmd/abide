import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, CircleDot } from 'lucide-react';
import { Page, TopBar, cx } from '@/components/ui';
import { PRAYERS, PRAYER_CATEGORIES, type PrayerCategory } from '@/content/prayers';

export default function Prayers() {
  const [cat, setCat] = useState<PrayerCategory | 'all'>('all');
  const [q, setQ] = useState('');
  const query = q.trim().toLowerCase();
  const list = PRAYERS.filter((p) => (cat === 'all' || p.category === cat) && (!query || `${p.title} ${p.text} ${(p.tags ?? []).join(' ')}`.toLowerCase().includes(query)));

  return (
    <Page>
      <TopBar title="Prayers" subtitle="The prayer library of the Church" />
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input className="field !pl-11" placeholder="Search prayers" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4">
        <button onClick={() => setCat('all')} className={cx('chip shrink-0', cat === 'all' && 'chip-active')}>
          All
        </button>
        {PRAYER_CATEGORIES.map((c) => (
          <button key={c.id} onClick={() => setCat(c.id)} className={cx('chip shrink-0', cat === c.id && 'chip-active')}>
            {c.label}
          </button>
        ))}
      </div>

      {cat === 'difficult' && (
        <p className="mt-4 rounded-2xl bg-sage-soft p-4 text-sm text-ink">
          Whatever you are facing, you are not alone. Choose a prayer and pray it slowly. Then take one small, good action.
        </p>
      )}

      <Link to="/faith/rosary" className="card mt-5 flex items-center gap-4 !rounded-3xl p-4">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gold-soft text-gold">
          <CircleDot size={20} />
        </span>
        <span className="flex-1">
          <span className="block font-medium">The Holy Rosary</span>
          <span className="block text-sm text-ink-soft">Guided, with Scripture for every mystery</span>
        </span>
        <ChevronRight size={18} className="text-ink-faint" />
      </Link>

      {(cat === 'all' ? PRAYER_CATEGORIES : PRAYER_CATEGORIES.filter((c) => c.id === cat)).map((c) => {
        const items = list.filter((p) => p.category === c.id);
        if (!items.length) return null;
        return (
          <section key={c.id} className="mt-6">
            <p className="eyebrow mb-2 px-1">{c.label}</p>
            <div className="card divide-y divide-line !rounded-3xl px-4">
              {items.map((p) => (
                <Link key={p.id} to={`/faith/prayers/${p.id}`} className="flex items-center justify-between gap-3 py-3.5">
                  <span className="min-w-0">
                    <span className="block font-medium">{p.title}</span>
                    <span className="block truncate text-sm text-ink-soft">{p.subtitle ?? p.text.replace(/\n/g, ' ').slice(0, 70)}</span>
                  </span>
                  <ChevronRight size={17} className="shrink-0 text-ink-faint" />
                </Link>
              ))}
            </div>
          </section>
        );
      })}
      {!list.length && <p className="mt-8 text-center text-ink-soft">No prayers match “{q}”.</p>}
    </Page>
  );
}
