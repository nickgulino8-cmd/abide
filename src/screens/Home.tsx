import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, CheckCircle2, ChevronDown, Flame, HandHeart, Sparkles, Sun, Moon, Sunset, BookOpen, PenLine, Target, CircleDot, MessageCircleQuestion } from 'lucide-react';
import Companion from '@/components/Companion';
import { Card, Page, ProgressRing, Scripture, SectionHeader, cx, toast } from '@/components/ui';
import { useProgress } from '@/lib/hooks';
import { useStore } from '@/lib/store';
import { devotionalFor, prayerForNow, promptFor, saintFor } from '@/lib/daily';
import { formatLong, greeting } from '@/lib/dates';
import { seasonFor } from '@/lib/liturgical';
import { TOPIC_LABELS } from '@/content/devotionals';
import { ENCOURAGEMENTS, JOYFUL_LINES, RESTING_LINES } from '@/content/companion';
import { MYSTERIES, mysteriesForDate } from '@/content/rosary';
import { nextStreakMilestone } from '@/lib/progress';

const SEASON_DOT: Record<string, string> = { violet: '#7b5ea7', white: '#d9b15e', green: '#4f8d68', red: '#b4473b', rose: '#d48aa0' };

export default function Home() {
  const nav = useNavigate();
  const { today, stats, growth, flourishes, mood } = useProgress();
  const profile = useStore((s) => s.profile);
  const companion = useStore((s) => s.companion);
  const setCompanion = useStore((s) => s.setCompanion);
  const devotions = useStore((s) => s.devotions);
  const challenges = useStore((s) => s.challenges);
  const setChallenge = useStore((s) => s.setChallenge);
  const upsertJournal = useStore((s) => s.upsertJournal);

  const dev = useMemo(() => devotionalFor(today, profile.scripturePref), [today, profile.scripturePref]);
  const saint = useMemo(() => saintFor(today), [today]);
  const season = seasonFor(today);
  const { part, prayer } = prayerForNow();
  const prompt = promptFor(today);
  const doneToday = !!devotions[today];
  const mysterySet = MYSTERIES.find((m) => m.id === mysteriesForDate(new Date()))!;

  const [bubble, setBubble] = useState<string | null>(null);
  const [explain, setExplain] = useState(false);
  const [quick, setQuick] = useState('');

  const tapCompanion = () => {
    const pool = mood === 'resting' ? RESTING_LINES : mood === 'joyful' ? [...JOYFUL_LINES, ...ENCOURAGEMENTS] : ENCOURAGEMENTS;
    setBubble(pool[Math.floor(Math.random() * pool.length)]);
    setCompanion({ interactions: companion.interactions + 1 });
    clearTimeout((window as unknown as { __bt?: number }).__bt);
    (window as unknown as { __bt?: number }).__bt = window.setTimeout(() => setBubble(null), 3200);
  };

  const PartIcon = part === 'morning' ? Sun : part === 'afternoon' ? Sunset : Moon;
  const nextMs = nextStreakMilestone(stats.currentStreak);

  return (
    <Page>
      {/* ── Greeting ── */}
      <header className="px-1 pt-6">
        <div className="flex items-center justify-between">
          <p className="eyebrow">{formatLong(today)}</p>
          <span className="chip !py-1 !text-xs" title={season.note}>
            <span className="h-2 w-2 rounded-full" style={{ background: SEASON_DOT[season.color] }} />
            {season.label}
          </span>
        </div>
        <h1 className="display mt-3 text-[2.5rem] leading-[1.05]">
          {greeting()}
          {profile.name ? `, ${profile.name}` : ''}.
        </h1>
        <p className="mt-1.5 text-[1.05rem] text-ink-soft">Take another step toward Christ today.</p>
      </header>

      {/* ── Companion ── */}
      <section className="card relative mt-5 overflow-hidden !rounded-[2rem]">
        <div className="hero-gradient absolute inset-0 opacity-70" />
        <div className="relative">
          <div className="flex items-start justify-between px-5 pt-4">
            <div>
              <p className="display text-xl leading-tight">{companion.name}</p>
              <p className="text-xs text-ink-soft">
                Stage {growth.stage.n} · {growth.stage.name}
              </p>
            </div>
            <Link to="/journey" className="flex items-center gap-1.5 rounded-full bg-surface/80 px-3 py-1.5 text-sm font-semibold text-ink shadow-soft backdrop-blur">
              <Flame size={15} className="text-gold" />
              {stats.currentStreak} {stats.currentStreak === 1 ? 'day' : 'days'}
            </Link>
          </div>
          <div className="relative">
            <Companion stage={growth.stage.n} mood={mood} flourishes={flourishes} height={250} onTap={tapCompanion} ariaLabel={`${companion.name}, your companion. Tap to interact.`} />
            <AnimatePresence>
              {bubble && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="serif absolute left-1/2 top-2 max-w-[80%] -translate-x-1/2 rounded-2xl border border-line bg-surface/95 px-4 py-2 text-center text-[1.1rem] italic text-ink shadow-soft"
                  role="status"
                >
                  {bubble}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="px-5 pb-5">
            {mood === 'resting' ? (
              <p className="text-center text-sm text-ink-soft">{companion.name} is resting beside the dawn. A hard day doesn’t undo your journey.</p>
            ) : (
              <>
                <div className="mb-1.5 flex justify-between text-xs text-ink-faint">
                  <span>{growth.stage.line}</span>
                  {growth.next && <span>→ {growth.next.name}</span>}
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-line-strong">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-[#8fb89a] to-[#d9b15e]" initial={{ width: 0 }} animate={{ width: `${growth.progress * 100}%` }} transition={{ duration: 1 }} />
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Devotional CTA ── */}
      <button onClick={() => nav('/devotional')} className={cx('mt-4 flex w-full items-center gap-4 rounded-[1.75rem] p-5 text-left shadow-lift transition active:scale-[0.99]', doneToday ? 'card' : 'bg-forest text-on-forest')}>
        <span className={cx('grid h-12 w-12 shrink-0 place-items-center rounded-2xl', doneToday ? 'bg-sage-soft text-forest' : 'bg-white/15')}>
          {doneToday ? <CheckCircle2 size={24} /> : <BookOpen size={24} />}
        </span>
        <span className="flex-1">
          <span className="display block text-[1.45rem] leading-tight">{doneToday ? 'Devotional complete' : 'Begin Today’s Devotional'}</span>
          <span className={cx('block text-sm', doneToday ? 'text-ink-soft' : 'opacity-80')}>
            {doneToday ? 'Return to today’s reading any time' : `${dev.title} · about 7 minutes`}
          </span>
        </span>
        <ArrowRight size={20} />
      </button>

      {/* ── Check-in ── */}
      <Card className="mt-4">
        {stats.checkedInToday ? (
          <div className="flex items-center gap-4">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sage-soft text-forest">
              <Check size={20} />
            </span>
            <div className="flex-1">
              <p className="font-medium">
                {stats.todayStatus === 'committed' ? 'You stayed committed today.' : stats.todayStatus === 'setback' ? 'You were honest about today.' : 'You took time to reflect.'}
              </p>
              <p className="text-sm text-ink-soft">{stats.todayStatus === 'setback' ? 'Tomorrow is a new beginning. God is with you.' : 'Thank God for today’s grace.'}</p>
            </div>
            <Link to="/checkin" className="text-sm font-medium text-gold">
              Edit
            </Link>
          </div>
        ) : (
          <>
            <p className="display text-[1.35rem]">How did today go?</p>
            <div className="mt-3 grid gap-2">
              <Link to="/checkin?s=committed" className="btn-soft justify-start !rounded-2xl">
                <Check size={17} className="text-forest" /> I stayed committed to my goal
              </Link>
              <Link to="/checkin?s=setback" className="btn-soft justify-start !rounded-2xl">
                <HandHeart size={17} className="text-rose" /> I experienced a setback
              </Link>
              <Link to="/checkin?s=reflect" className="btn-soft justify-start !rounded-2xl">
                <PenLine size={17} className="text-gold" /> I want to reflect on today
              </Link>
            </div>
          </>
        )}
      </Card>

      {/* ── Today's Scripture ── */}
      <SectionHeader title="Today’s Scripture" action="Library" to="/faith/scripture" />
      <Card>
        <div className="mb-3 flex items-center gap-2">
          <span className="chip !py-1 !text-xs">{TOPIC_LABELS[dev.topic]}</span>
          <span className="text-xs text-ink-faint">{dev.title}</span>
        </div>
        <Scripture refId={dev.ref} />
        <button onClick={() => setExplain((e) => !e)} className="mt-4 flex w-full items-center justify-between rounded-2xl bg-surface-2 px-4 py-3 text-sm font-medium" aria-expanded={explain}>
          What does this mean?
          <ChevronDown size={18} className={cx('transition', explain && 'rotate-180')} />
        </button>
        <AnimatePresence initial={false}>
          {explain && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="space-y-3 px-1 pt-4 text-[0.97rem] text-ink-soft">
                <p>
                  <span className="eyebrow mb-1 block">Context</span>
                  {dev.context}
                </p>
                <p>
                  <span className="eyebrow mb-1 block">Meaning</span>
                  {dev.meaning}
                </p>
                <p>
                  <span className="eyebrow mb-1 block">For your life</span>
                  {dev.application}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* ── Daily challenge ── */}
      <Card className="mt-4">
        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold-soft text-gold">
            <Target size={20} />
          </span>
          <div className="flex-1">
            <p className="eyebrow">Today’s spiritual challenge</p>
            <p className="mt-1 text-[1.02rem] text-ink">{dev.challenge}</p>
            <button
              onClick={() => {
                setChallenge(today, !challenges[today]);
                if (!challenges[today]) toast('Challenge completed — well done.');
              }}
              className={cx('mt-3', challenges[today] ? 'btn-soft !py-2 text-forest' : 'btn-ghost !py-2')}
            >
              {challenges[today] ? (
                <>
                  <Check size={16} /> Completed
                </>
              ) : (
                'Mark complete'
              )}
            </button>
          </div>
        </div>
      </Card>

      {/* ── Today's prayer ── */}
      <SectionHeader title="Pray" action="All prayers" to="/faith/prayers" />
      <Card onClick={() => nav(`/faith/prayers/${prayer.id}`)}>
        <div className="flex items-center gap-3">
          <PartIcon size={18} className="text-gold" />
          <p className="eyebrow">{part === 'morning' ? 'Morning prayer' : part === 'afternoon' ? 'Midday prayer' : 'Evening prayer'}</p>
        </div>
        <p className="display mt-2 text-[1.4rem]">{prayer.title}</p>
        <p className="serif mt-1 line-clamp-3 text-[1.1rem] leading-relaxed text-ink-soft">{prayer.text.split('\n')[0]}</p>
        <p className="mt-3 flex items-center gap-1 text-sm font-medium text-gold">
          Pray now <ArrowRight size={15} />
        </p>
      </Card>
      <Link to={`/faith/rosary/pray/${mysterySet.id}`} className="card card-pad mt-3 flex items-center gap-4">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sage-soft text-forest">
          <CircleDot size={20} />
        </span>
        <span className="flex-1">
          <span className="block font-medium">Pray the Rosary</span>
          <span className="block text-sm text-ink-soft">Today: the {mysterySet.title}</span>
        </span>
        <ArrowRight size={18} className="text-ink-faint" />
      </Link>

      {/* ── Saint ── */}
      <SectionHeader title={saint.isFeast ? 'Feast of the day' : 'Saint for today'} action="All saints" to="/faith/saints" />
      <Card onClick={() => nav(`/faith/saints/${saint.saint.id}`)}>
        <div className="flex items-start gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-gold/40 bg-gold-soft">
            <Sparkles size={22} className="text-gold" />
          </span>
          <div>
            <p className="display text-[1.35rem] leading-tight">{saint.saint.name}</p>
            <p className="text-xs text-ink-faint">
              {saint.saint.title} · {saint.saint.years}
            </p>
            <p className="mt-2 line-clamp-3 text-[0.95rem] text-ink-soft">{saint.saint.lesson}</p>
          </div>
        </div>
      </Card>

      {/* ── Quick journal ── */}
      <SectionHeader title="Journal" action="Open journal" to="/journal" />
      <Card>
        <p className="serif text-[1.25rem] italic text-ink">{prompt}</p>
        <textarea value={quick} onChange={(e) => setQuick(e.target.value)} rows={3} placeholder="Write a few words…" className="field mt-3 resize-none" />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-ink-faint">Private · stored only on this device</span>
          <button
            disabled={!quick.trim()}
            className="btn-primary !py-2"
            onClick={() => {
              upsertJournal({ type: 'reflection', body: quick.trim(), prompt });
              setQuick('');
              toast('Saved to your journal');
            }}
          >
            Save
          </button>
        </div>
      </Card>

      {/* ── Progress overview ── */}
      <SectionHeader title="Your journey" action="Details" to="/journey" />
      <Card onClick={() => nav('/journey')}>
        <div className="flex items-center gap-5">
          <ProgressRing value={stats.consistency} size={112} stroke={9} label="Consistency">
            <div>
              <p className="display text-3xl leading-none">{Math.round(stats.consistency * 100)}%</p>
              <p className="text-[0.65rem] uppercase tracking-wider text-ink-faint">consistency</p>
            </div>
          </ProgressRing>
          <div className="grid flex-1 grid-cols-2 gap-3">
            <Stat label="Current streak" value={stats.currentStreak} />
            <Stat label="Longest" value={stats.longestStreak} />
            <Stat label="Faithful days" value={stats.totalCommitted} />
            <Stat label="Next milestone" value={nextMs ? `${nextMs}d` : '✓'} />
          </div>
        </div>
      </Card>

      <Link to="/faith/ask" className="card card-pad mt-4 flex items-center gap-4">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sage-soft text-forest">
          <MessageCircleQuestion size={20} />
        </span>
        <span className="flex-1">
          <span className="block font-medium">Ask Abide Companion</span>
          <span className="block text-sm text-ink-soft">Questions about Scripture, prayer and the faith</span>
        </span>
        <ArrowRight size={18} className="text-ink-faint" />
      </Link>

      <p className="serif mt-10 text-center text-[1.15rem] italic text-ink-faint">“Progress is not perfection. It is choosing to return to God, again and again.”</p>
    </Page>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <p className="display text-2xl leading-none">{value}</p>
      <p className="mt-1 text-[0.7rem] text-ink-faint">{label}</p>
    </div>
  );
}
