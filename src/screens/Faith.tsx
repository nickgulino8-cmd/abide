import { Link } from 'react-router-dom';
import { type LucideIcon, BookOpen, HandHeart, CircleDot, Sparkles, Bookmark, MessageCircleQuestion, Cross, Users, Mountain, Shield, Church, ChevronRight } from 'lucide-react';
import { Card, Page, SectionHeader } from '@/components/ui';
import { LEARN } from '@/content/learn';
import { useStore } from '@/lib/store';
import { seasonFor } from '@/lib/liturgical';
import { useToday } from '@/lib/hooks';
import { devotionalFor } from '@/lib/daily';
import { formatRef } from '@/lib/bible';
import { MYSTERIES, mysteriesForDate } from '@/content/rosary';

const ICONS: Record<string, LucideIcon> = { Cross, Users, Mountain, Sparkles, Shield, Church };

export default function Faith() {
  const today = useToday();
  const learnRead = useStore((s) => s.learnRead);
  const pref = useStore((s) => s.profile.scripturePref);
  const bibleLast = useStore((s) => s.bibleLast);
  const season = seasonFor(today);
  const dev = devotionalFor(today, pref);
  const mysteries = MYSTERIES.find((m) => m.id === mysteriesForDate(new Date()))!;

  const tiles = [
    { to: bibleLast ? `/faith/bible/${bibleLast.book}/${bibleLast.chapter}` : '/faith/bible', icon: BookOpen, title: 'Holy Bible', text: bibleLast ? 'Continue reading' : 'Douay-Rheims, offline' },
    { to: '/faith/prayers', icon: HandHeart, title: 'Prayers', text: 'Morning, evening & more' },
    { to: '/faith/rosary', icon: CircleDot, title: 'Rosary', text: mysteries.title },
    { to: '/faith/saints', icon: Sparkles, title: 'Saints', text: 'Lives & lessons' },
    { to: '/faith/scripture', icon: Bookmark, title: 'My Scripture', text: 'Saved, history, search' },
    { to: '/faith/ask', icon: MessageCircleQuestion, title: 'Ask', text: 'Abide Companion' },
  ];

  return (
    <Page>
      <header className="px-1 pt-6">
        <p className="eyebrow">Faith</p>
        <h1 className="display mt-2 text-[2.4rem] leading-tight">Grow in Faith</h1>
        <p className="text-ink-soft">Scripture, prayer, and the riches of the Church.</p>
      </header>

      <Link to="/devotional" className="card card-pad mt-5 block !rounded-[2rem] bg-forest !text-on-forest" style={{ background: 'linear-gradient(135deg, #1f3d2f, #2e5641)' }}>
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#e9d7a7]">Today’s reading · {season.label}</p>
        <p className="display mt-2 text-[1.7rem] leading-tight text-[#f7f2e8]">{dev.title}</p>
        <p className="text-sm text-[#d8e2d6]">{formatRef(dev.ref)}</p>
      </Link>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {tiles.map(({ to, icon: Icon, title, text }) => (
          <Link key={title} to={to} className="card flex flex-col gap-3 !rounded-3xl p-4 transition active:scale-[0.98]">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-sage-soft text-forest">
              <Icon size={19} />
            </span>
            <span>
              <span className="block font-medium">{title}</span>
              <span className="block truncate text-xs text-ink-soft">{text}</span>
            </span>
          </Link>
        ))}
      </div>

      <SectionHeader title="Learn" />
      <div className="space-y-3">
        {LEARN.map((c) => {
          const Icon = ICONS[c.icon] ?? BookOpen;
          const read = c.articles.filter((a) => learnRead[a.id]).length;
          return (
            <Link key={c.id} to={`/faith/learn/${c.id}`} className="card flex items-center gap-4 !rounded-3xl p-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold-soft text-gold">
                <Icon size={21} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="display block text-[1.3rem] leading-tight">{c.title}</span>
                <span className="block truncate text-sm text-ink-soft">{c.subtitle}</span>
                <span className="mt-2 block h-1 overflow-hidden rounded-full bg-line-strong">
                  <span className="block h-full rounded-full bg-sage" style={{ width: `${(read / c.articles.length) * 100}%` }} />
                </span>
              </span>
              <ChevronRight size={18} className="text-ink-faint" />
            </Link>
          );
        })}
        <Link to="/faith/saints" className="card flex items-center gap-4 !rounded-3xl p-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold-soft text-gold">
            <Sparkles size={21} />
          </span>
          <span className="flex-1">
            <span className="display block text-[1.3rem] leading-tight">Catholic Saints</span>
            <span className="block text-sm text-ink-soft">Their struggles, virtues and prayers</span>
          </span>
          <ChevronRight size={18} className="text-ink-faint" />
        </Link>
      </div>

      <Card className="mt-6">
        <p className="eyebrow">The liturgical season</p>
        <p className="display mt-1 text-2xl">{season.label}</p>
        <p className="text-sm text-ink-soft">{season.note}</p>
        <Link to="/faith/learn/traditions/tradition-feasts" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-gold">
          About the Church year <ChevronRight size={15} />
        </Link>
      </Card>
    </Page>
  );
}
