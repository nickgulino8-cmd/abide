import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, HandHeart, PenLine, X, Church, MessageCircleQuestion, ShieldCheck } from 'lucide-react';
import Companion from '@/components/Companion';
import { Scripture, cx, toast, Paragraphs } from '@/components/ui';
import { useProgress } from '@/lib/hooks';
import { useStore, type CheckStatus } from '@/lib/store';
import { addDays, dayIndex, formatLong } from '@/lib/dates';
import { computeStats, MILESTONES } from '@/lib/progress';
import { prayerById } from '@/content/prayers';

const MERCY_REFS = ['Luke 15:20', 'Psalms 33:19', 'Micah 7:8', 'Proverbs 24:16', 'Lamentations 3:22-23', 'Isaiah 41:10', '2 Corinthians 12:9'];

const QUESTIONS: Record<'setback' | 'reflect', [string, string, string]> = {
  setback: ['What made today challenging?', 'What could help you tomorrow?', 'What is one positive thing you can do right now?'],
  reflect: ['What stood out to you today?', 'Where did you notice God today?', 'What would you like to carry into tomorrow?'],
};

export default function CheckIn() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const { today, growth, flourishes, stats } = useProgress();
  const checkins = useStore((s) => s.checkins);
  const journeys = useStore((s) => s.journeys);
  const saveCheckIn = useStore((s) => s.checkIn);
  const removeCheckIn = useStore((s) => s.removeCheckIn);
  const profile = useStore((s) => s.profile);
  const companionName = useStore((s) => s.companion.name);

  const [date, setDate] = useState(params.get('date') ?? today);
  const existing = checkins[date];
  const [status, setStatus] = useState<CheckStatus | null>((params.get('s') as CheckStatus) ?? null);
  const [phase, setPhase] = useState(0);
  const [note, setNote] = useState(existing?.note ?? '');
  const [answers, setAnswers] = useState<[string, string, string]>([
    existing?.reflection?.challenge ?? '',
    existing?.reflection?.help ?? '',
    existing?.reflection?.positive ?? '',
  ]);
  const mercyRef = MERCY_REFS[dayIndex(date) % MERCY_REFS.length];
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(today, -i)), [today]);

  const save = (s: CheckStatus) => {
    const hasReflection = s !== 'committed' && answers.some((a) => a.trim());
    saveCheckIn({
      date,
      status: s,
      note: note.trim() || undefined,
      reflection: hasReflection ? { challenge: answers[0].trim(), help: answers[1].trim(), positive: answers[2].trim() } : undefined,
    });
  };

  const choose = (s: CheckStatus) => {
    setStatus(s);
    setPhase(0);
    if (s === 'committed') save('committed');
  };

  // Arriving via Home's "I stayed committed" link saves immediately.
  useEffect(() => {
    if (status === 'committed' && checkins[date]?.status !== 'committed') save('committed');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, date]);

  const after = computeStats({ ...checkins }, journeys, today);
  const reached = MILESTONES.find((m) => m.kind === 'streak' && after.currentStreak === m.threshold && status === 'committed');

  return (
    <div className="min-h-dvh bg-bg">
      <div className="mx-auto max-w-xl px-5 pb-16 pt-safe">
        <div className="flex h-16 items-center justify-between">
          <button onClick={() => nav(-1)} aria-label="Close" className="grid h-10 w-10 place-items-center rounded-full text-ink-soft hover:bg-surface-2">
            <X size={20} />
          </button>
          <select
            aria-label="Day to check in for"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setStatus(null);
            }}
            className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm"
          >
            {days.map((d) => (
              <option key={d} value={d}>
                {d === today ? 'Today' : d === addDays(today, -1) ? 'Yesterday' : formatLong(d)}
                {checkins[d] ? ' ✓' : ''}
              </option>
            ))}
          </select>
          <span className="w-10" />
        </div>

        <AnimatePresence mode="wait">
          {/* ── Choose ── */}
          {!status && (
            <motion.div key="choose" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h1 className="display mt-6 text-[2.6rem] leading-tight">How did {date === today ? 'today' : 'that day'} go?</h1>
              <p className="mt-2 text-ink-soft">{profile.progressMeaning ? `Your goal: “${profile.progressMeaning}”` : 'There is no wrong answer. Honesty is the beginning of growth.'}</p>
              <div className="mt-8 space-y-3">
                <Option icon={<Check />} tone="forest" title="I stayed committed to my goal" text="Give thanks for today’s grace." onClick={() => choose('committed')} />
                <Option icon={<HandHeart />} tone="rose" title="I experienced a setback" text="You are still loved. Let’s begin again." onClick={() => choose('setback')} />
                <Option icon={<PenLine />} tone="gold" title="I want to reflect on today" text="A few quiet questions." onClick={() => choose('reflect')} />
              </div>
              {existing && (
                <button
                  className="mt-6 w-full py-2 text-sm text-ink-faint underline-offset-4 hover:underline"
                  onClick={() => {
                    removeCheckIn(date);
                    toast('Check-in removed');
                  }}
                >
                  Clear this day’s check-in
                </button>
              )}
              <p className="mt-8 text-center text-xs text-ink-faint">You never need to describe details. This stays on your device.</p>
            </motion.div>
          )}

          {/* ── Committed ── */}
          {status === 'committed' && (
            <motion.div key="committed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center">
              <div className="-mx-5">
                <Companion stage={growth.stage.n} mood="joyful" flourishes={flourishes} height={250} />
              </div>
              <h1 className="display text-[2.4rem] leading-tight">Thanks be to God.</h1>
              <p className="mx-auto mt-2 max-w-sm text-ink-soft">You stayed faithful {date === today ? 'today' : 'that day'}. Every faithful day is a gift you offer back to him.</p>
              <div className="mt-6 flex justify-center gap-8">
                <div>
                  <p className="display text-4xl">{after.currentStreak}</p>
                  <p className="text-xs text-ink-faint">day streak</p>
                </div>
                <div>
                  <p className="display text-4xl">{after.totalCommitted}</p>
                  <p className="text-xs text-ink-faint">faithful days</p>
                </div>
              </div>
              {reached && (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }} className="card card-pad mx-auto mt-6 max-w-sm !border-gold/50">
                  <p className="eyebrow text-gold">Milestone reached</p>
                  <p className="display mt-1 text-2xl">{reached.title}</p>
                  {reached.reward && <p className="mt-1 text-sm text-ink-soft">{reached.reward}</p>}
                </motion.div>
              )}
              <label className="mt-6 block text-left">
                <span className="mb-2 block text-sm text-ink-soft">What helped you today? (optional)</span>
                <textarea rows={2} className="field resize-none" value={note} onChange={(e) => setNote(e.target.value)} placeholder="A prayer, a friend, a walk…" />
              </label>
              <button
                className="btn-primary mt-4 w-full"
                onClick={() => {
                  save('committed');
                  nav('/');
                }}
              >
                Done
              </button>
            </motion.div>
          )}

          {/* ── Setback & Reflect ── */}
          {(status === 'setback' || status === 'reflect') && (
            <motion.div key={`${status}-${phase}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {status === 'setback' && phase === 0 && (
                <div className="text-center">
                  <div className="-mx-5">
                    <Companion stage={growth.stage.n} mood="resting" flourishes={flourishes} height={230} />
                  </div>
                  <h1 className="display text-[2.3rem] leading-tight">Thank you for your honesty.</h1>
                  <p className="mx-auto mt-3 max-w-md text-[1.05rem] text-ink-soft">
                    A setback is not the end of your story, and it does not change how God sees you. He has not abandoned you — he is closer to the broken-hearted than you know.
                  </p>
                  <div className="card card-pad mt-6 text-left">
                    <Scripture refId={mercyRef} size="sm" />
                  </div>
                  <div className="mt-4 rounded-2xl bg-sage-soft p-4 text-left text-sm text-ink">
                    <p className="flex items-center gap-2 font-medium">
                      <ShieldCheck size={16} className="text-forest" /> Nothing you’ve built is lost.
                    </p>
                    <p className="mt-1 text-ink-soft">
                      Your {stats.totalCommitted} faithful days, your longest streak of {stats.longestStreak}, your milestones and {companionName}’s growth are all kept. {companionName} is resting, not hurt — waiting to rise with you.
                    </p>
                  </div>
                </div>
              )}

              {phase === (status === 'setback' ? 1 : 0) && (
                <div>
                  <h1 className="display mt-4 text-[2.2rem] leading-tight">{status === 'setback' ? 'Let’s reflect, gently.' : 'Reflect on your day'}</h1>
                  <p className="mt-2 text-ink-soft">Three short questions. Answer as much or as little as you like.</p>
                  <div className="mt-6 space-y-5">
                    {QUESTIONS[status].map((q, i) => (
                      <label key={q} className="block">
                        <span className="serif mb-2 block text-[1.3rem] italic text-ink">{q}</span>
                        <textarea
                          rows={2}
                          className="field resize-none"
                          value={answers[i]}
                          onChange={(e) => setAnswers((a) => a.map((x, k) => (k === i ? e.target.value : x)) as [string, string, string])}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {phase === (status === 'setback' ? 2 : 1) && (
                <div>
                  {status === 'setback' ? (
                    <>
                      <h1 className="display mt-4 text-[2.2rem] leading-tight">Begin again, now.</h1>
                      <div className="card card-pad mt-5">
                        <p className="eyebrow">{prayerById('difficult-after-setback')!.title}</p>
                        <Paragraphs text={prayerById('difficult-after-setback')!.text} className="serif mt-3 text-[1.2rem] leading-relaxed" />
                      </div>
                      <p className="mt-6 text-sm font-medium text-ink">Helpful next steps</p>
                      <div className="mt-2 grid gap-2">
                        <Link to="/faith/learn/traditions/tradition-confession" className="btn-soft justify-start !rounded-2xl">
                          <Church size={17} className="text-forest" /> How to go to confession
                        </Link>
                        <Link to="/faith/prayers/difficult-temptation" className="btn-soft justify-start !rounded-2xl">
                          <HandHeart size={17} className="text-rose" /> A prayer for moments of temptation
                        </Link>
                        <Link to="/faith/ask?q=How%20do%20I%20start%20again%20after%20a%20setback" className="btn-soft justify-start !rounded-2xl">
                          <MessageCircleQuestion size={17} className="text-gold" /> Practical help for starting again
                        </Link>
                      </div>
                      <p className="mt-5 text-xs leading-relaxed text-ink-faint">
                        If you are struggling, you don’t have to carry it alone. A priest, a trusted friend, or a counsellor can walk with you.
                      </p>
                    </>
                  ) : (
                    <>
                      <h1 className="display mt-4 text-[2.2rem] leading-tight">Rest in God’s peace.</h1>
                      <div className="-mx-5">
                        <Companion stage={growth.stage.n} mood="calm" flourishes={flourishes} height={220} />
                      </div>
                      <p className="text-center text-ink-soft">Thank you for taking time to notice your day with God.</p>
                    </>
                  )}
                </div>
              )}

              <div className="mt-8 flex gap-3">
                {phase > 0 && (
                  <button className="btn-ghost" onClick={() => setPhase((p) => p - 1)}>
                    Back
                  </button>
                )}
                {phase < (status === 'setback' ? 2 : 1) ? (
                  <button className="btn-primary flex-1" onClick={() => setPhase((p) => p + 1)}>
                    Continue <ArrowRight size={17} />
                  </button>
                ) : (
                  <button
                    className="btn-gold flex-1"
                    onClick={() => {
                      save(status);
                      toast(status === 'setback' ? 'Recommitted. Tomorrow is a new day with God.' : 'Reflection saved');
                      nav('/');
                    }}
                  >
                    {status === 'setback' ? 'Begin again with God' : 'Save reflection'}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Option({ icon, title, text, onClick, tone }: { icon: React.ReactNode; title: string; text: string; onClick: () => void; tone: 'forest' | 'rose' | 'gold' }) {
  return (
    <button onClick={onClick} className="card flex w-full items-center gap-4 !rounded-3xl p-5 text-left transition active:scale-[0.99]">
      <span className={cx('grid h-12 w-12 shrink-0 place-items-center rounded-2xl', tone === 'forest' && 'bg-sage-soft text-forest', tone === 'rose' && 'bg-rose/10 text-rose', tone === 'gold' && 'bg-gold-soft text-gold')}>{icon}</span>
      <span className="flex-1">
        <span className="block text-[1.05rem] font-medium">{title}</span>
        <span className="block text-sm text-ink-soft">{text}</span>
      </span>
      <ArrowRight size={18} className="text-ink-faint" />
    </button>
  );
}
