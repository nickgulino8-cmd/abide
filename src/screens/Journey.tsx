import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Flame, Award, RotateCcw, Sprout, Check, Lock } from 'lucide-react';
import Companion from '@/components/Companion';
import { Card, Page, ProgressRing, SectionHeader, Sheet, cx, toast } from '@/components/ui';
import { useProgress } from '@/lib/hooks';
import { useStore } from '@/lib/store';
import { diffDays, formatLong, formatShort, monthMatrix, parseKey } from '@/lib/dates';
import { MILESTONES, nextStreakMilestone } from '@/lib/progress';
import { GOALS } from './Onboarding';
import { TOPIC_LABELS } from '@/content/devotionals';
import { devotionalById } from '@/lib/daily';

export default function Journey() {
  const nav = useNavigate();
  const { today, stats, growth, flourishes, mood } = useProgress();
  const checkins = useStore((s) => s.checkins);
  const devotions = useStore((s) => s.devotions);
  const milestones = useStore((s) => s.milestones);
  const journeys = useStore((s) => s.journeys);
  const profile = useStore((s) => s.profile);
  const companion = useStore((s) => s.companion);
  const restart = useStore((s) => s.restartJourney);
  const [month, setMonth] = useState(() => {
    const d = parseKey(today);
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmRestart, setConfirmRestart] = useState(false);
  const cells = useMemo(() => monthMatrix(month.y, month.m), [month]);
  const firstKey = Object.keys(checkins).sort()[0];
  const lifetime = firstKey ? stats.totalCommitted / Math.max(1, diffDays(firstKey, today) + 1) : 0;
  const nextMs = nextStreakMilestone(stats.currentStreak);
  const monthLabel = new Date(month.y, month.m, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const shift = (n: number) => setMonth(({ y, m }) => ({ y: m + n < 0 ? y - 1 : m + n > 11 ? y + 1 : y, m: (m + n + 12) % 12 }));
  const sel = selected ? checkins[selected] : undefined;

  return (
    <Page>
      <header className="px-1 pt-6">
        <p className="eyebrow">Your journey</p>
        <h1 className="display mt-2 text-[2.4rem] leading-tight">Walking with Christ</h1>
        <p className="text-ink-soft">Day {stats.daysOnJourney} of this journey</p>
      </header>

      {/* ── Gauge ── */}
      <Card className="mt-5 flex flex-col items-center !py-8">
        <ProgressRing value={stats.consistency} size={220} stroke={14} label={`Consistency ${Math.round(stats.consistency * 100)} percent`}>
          <div>
            <Flame className="mx-auto mb-1 text-gold" size={22} />
            <p className="display text-6xl leading-none">{stats.currentStreak}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.15em] text-ink-faint">day streak</p>
          </div>
        </ProgressRing>
        <p className="mt-5 text-center text-sm text-ink-soft">
          <span className="font-semibold text-ink">{Math.round(stats.consistency * 100)}%</span> consistency over the last {stats.windowDays} {stats.windowDays === 1 ? 'day' : 'days'}
        </p>
        {nextMs && <p className="mt-1 text-xs text-ink-faint">{nextMs - stats.currentStreak} more {nextMs - stats.currentStreak === 1 ? 'day' : 'days'} to your {nextMs}-day milestone</p>}
        {!stats.checkedInToday && (
          <Link to="/checkin" className="btn-primary mt-5">
            Check in for today
          </Link>
        )}
      </Card>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <StatCard label="Longest streak" value={stats.longestStreak} hint="Lifetime best" />
        <StatCard label="Faithful days" value={stats.totalCommitted} hint="All time" />
        <StatCard label="Check-ins" value={stats.totalCheckins} hint="Every honest moment counts" />
        <StatCard label="Overall consistency" value={`${Math.round(lifetime * 100)}%`} hint="Since your first check-in" />
      </div>

      {/* ── Calendar ── */}
      <SectionHeader title="Calendar" />
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <button onClick={() => shift(-1)} aria-label="Previous month" className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface-2">
            <ChevronLeft size={18} />
          </button>
          <p className="font-medium">{monthLabel}</p>
          <button onClick={() => shift(1)} aria-label="Next month" className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface-2">
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[0.68rem] font-medium text-ink-faint">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((k, i) => {
            if (!k) return <span key={i} />;
            const c = checkins[k];
            const future = k > today;
            return (
              <button
                key={k}
                disabled={future}
                onClick={() => setSelected(k)}
                aria-label={`${formatLong(k)}${c ? `: ${c.status}` : ''}`}
                className={cx(
                  'relative grid aspect-square place-items-center rounded-xl text-sm transition',
                  future && 'text-ink-faint/50',
                  !c && !future && 'hover:bg-surface-2',
                  c?.status === 'committed' && 'bg-forest font-semibold text-on-forest',
                  c?.status === 'setback' && 'border border-rose/40 bg-rose/10 text-ink',
                  c?.status === 'reflect' && 'bg-gold-soft text-ink',
                  k === today && !c && 'ring-2 ring-gold/60',
                )}
              >
                {Number(k.slice(8))}
                {devotions[k] && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-gold-bright" />}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft">
          <Legend className="bg-forest" label="Committed" />
          <Legend className="border border-rose/40 bg-rose/10" label="Hard day" />
          <Legend className="bg-gold-soft" label="Reflected" />
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-bright" /> Devotional
          </span>
        </div>
      </Card>

      {/* ── Companion ── */}
      <SectionHeader title="Your companion" action="Stages" to="/journey/companion" />
      <Card onClick={() => nav('/journey/companion')} className="overflow-hidden !p-0">
        <div className="flex items-center">
          <div className="w-1/2">
            <Companion stage={growth.stage.n} mood={mood} flourishes={flourishes} height={170} animated={false} />
          </div>
          <div className="flex-1 pr-5">
            <p className="display text-2xl leading-tight">{companion.name}</p>
            <p className="text-sm text-ink-soft">
              Stage {growth.stage.n}: {growth.stage.name}
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line-strong">
              <div className="h-full rounded-full bg-gradient-to-r from-[#8fb89a] to-[#d9b15e]" style={{ width: `${growth.progress * 100}%` }} />
            </div>
            <p className="mt-1.5 text-xs text-ink-faint">{growth.next ? `${growth.next.at - growth.points} growth to ${growth.next.name}` : 'Fully grown — abiding.'}</p>
          </div>
        </div>
      </Card>

      {/* ── Milestones ── */}
      <SectionHeader title="Milestones" />
      <div className="space-y-2">
        {MILESTONES.map((m) => {
          const got = milestones[m.id];
          const progress = m.kind === 'streak' ? Math.min(1, stats.longestStreak / m.threshold) : got ? 1 : 0;
          return (
            <div key={m.id} className={cx('card flex items-center gap-4 !rounded-2xl px-4 py-3', !got && 'opacity-80')}>
              <span className={cx('grid h-11 w-11 shrink-0 place-items-center rounded-full', got ? 'bg-gradient-to-br from-[#ecd08f] to-[#c49a45] text-[#3a2c10]' : 'bg-surface-2 text-ink-faint')}>
                {got ? <Award size={20} /> : <Lock size={16} />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{m.title}</p>
                <p className="text-xs text-ink-soft">{got ? `Earned ${formatShort(got)}` : m.description}</p>
                {m.reward && <p className="mt-0.5 text-xs text-gold">{m.reward}</p>}
                {!got && m.kind === 'streak' && (
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-line-strong">
                    <div className="h-full bg-sage" style={{ width: `${progress * 100}%` }} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Goals ── */}
      <SectionHeader title="What progress means to you" action="Edit" to="/profile/goals" />
      <Card>
        {profile.progressMeaning && <p className="serif mb-3 text-[1.25rem] italic">“{profile.progressMeaning}”</p>}
        <div className="flex flex-wrap gap-2">
          {profile.goals.map((g) => (
            <span key={g} className="chip">
              <Check size={14} className="text-forest" /> {GOALS.find((x) => x.id === g)?.label ?? g}
            </span>
          ))}
          {profile.customGoal && <span className="chip">{profile.customGoal}</span>}
          <span className="chip">
            <Sprout size={14} className="text-forest" /> Focus: {TOPIC_LABELS[profile.focus]}
          </span>
        </div>
      </Card>

      {/* ── Restart ── */}
      <SectionHeader title="Begin anew" />
      <Card>
        <p className="text-sm text-ink-soft">
          Want a fresh start — a new season, a new commitment? Restarting begins a new current streak. Your lifetime totals, longest streak, milestones and your companion’s growth are always kept.
        </p>
        <button className="btn-ghost mt-4" onClick={() => setConfirmRestart(true)}>
          <RotateCcw size={16} /> Restart my journey
        </button>
        {journeys.length > 1 && (
          <div className="mt-5 border-t border-line pt-4">
            <p className="eyebrow mb-2">Past journeys</p>
            {journeys
              .filter((j) => j.endedAt)
              .reverse()
              .map((j) => (
                <p key={j.id} className="text-sm text-ink-soft">
                  {formatShort(j.startedAt)} — {formatShort(j.endedAt!)} · {diffDays(j.startedAt, j.endedAt!) + 1} days
                </p>
              ))}
          </div>
        )}
      </Card>

      <Sheet open={!!selected} onClose={() => setSelected(null)} title={selected ? formatLong(selected) : ''}>
        {selected && (
          <div className="space-y-4">
            {sel ? (
              <>
                <p className="font-medium">{sel.status === 'committed' ? 'Stayed committed' : sel.status === 'setback' ? 'A hard day — and an honest one' : 'A day of reflection'}</p>
                {sel.note && <p className="text-ink-soft">{sel.note}</p>}
                {sel.reflection && (
                  <div className="space-y-2 text-sm">
                    {[sel.reflection.challenge, sel.reflection.help, sel.reflection.positive].filter(Boolean).map((a, i) => (
                      <p key={i} className="rounded-xl bg-surface-2 p-3">
                        {a}
                      </p>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-ink-soft">No check-in for this day.</p>
            )}
            {devotions[selected] && <p className="text-sm text-ink-soft">Devotional: {devotionalById(devotions[selected].id)?.title}</p>}
            {diffDays(selected, today) < 7 ? (
              <button className="btn-primary w-full" onClick={() => nav(`/checkin?date=${selected}`)}>
                {sel ? 'Edit check-in' : 'Check in for this day'}
              </button>
            ) : (
              <p className="text-xs text-ink-faint">Check-ins can be added or edited for the past 7 days.</p>
            )}
          </div>
        )}
      </Sheet>

      <Sheet open={confirmRestart} onClose={() => setConfirmRestart(false)} title="Restart your journey?">
        <p className="text-ink-soft">This begins a new current streak from today. Nothing else is erased: lifetime days, longest streak, milestones, journal and your companion all stay with you.</p>
        <div className="mt-5 flex gap-3">
          <button className="btn-ghost flex-1" onClick={() => setConfirmRestart(false)}>
            Cancel
          </button>
          <button
            className="btn-primary flex-1"
            onClick={() => {
              restart();
              setConfirmRestart(false);
              toast('A new journey begins today.');
            }}
          >
            Restart
          </button>
        </div>
      </Sheet>
    </Page>
  );
}

function StatCard({ label, value, hint }: { label: string; value: number | string; hint: string }) {
  return (
    <div className="card !rounded-3xl p-4">
      <p className="display text-[2.1rem] leading-none">{value}</p>
      <p className="mt-2 text-sm font-medium">{label}</p>
      <p className="text-xs text-ink-faint">{hint}</p>
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cx('h-3 w-3 rounded', className)} /> {label}
    </span>
  );
}
