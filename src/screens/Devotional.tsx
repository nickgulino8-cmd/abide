import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import Companion from '@/components/Companion';
import { Scripture, cx, toast } from '@/components/ui';
import { useProgress, useToday } from '@/lib/hooks';
import { useStore } from '@/lib/store';
import { devotionalById, devotionalFor } from '@/lib/daily';
import { formatLong } from '@/lib/dates';
import { TOPIC_LABELS } from '@/content/devotionals';
import { stageFor, growthPoints } from '@/lib/progress';

const STEPS = ['Stillness', 'Scripture', 'Understanding', 'Reflection', 'Prayer', 'Question', 'Challenge', 'Amen'];

export default function Devotional() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const today = useToday();
  const pref = useStore((s) => s.profile.scripturePref);
  const dev = useMemo(() => devotionalById(params.get('id') ?? '') ?? devotionalFor(today, pref), [params, today, pref]);
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState('');
  const [accepted, setAccepted] = useState(false);
  const { growth, flourishes } = useProgress();
  const completeDevotion = useStore((s) => s.completeDevotion);
  const markRead = useStore((s) => s.markRead);
  const upsertJournal = useStore((s) => s.upsertJournal);
  const setChallenge = useStore((s) => s.setChallenge);
  const alreadyDone = useStore((s) => !!s.devotions[today]);
  const [beforeStage] = useState(growth.stage.n);

  const last = STEPS.length - 1;
  const go = (n: number) => {
    setStep(n);
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    if (step === last) {
      completeDevotion(today, dev.id);
      markRead(dev.ref);
      if (answer.trim()) upsertJournal({ type: 'scripture', body: answer.trim(), prompt: dev.question, ref: dev.ref, title: dev.title });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const s = useStore.getState();
  const after = stageFor(growthPoints({ checkins: s.checkins, devotions: s.devotions, rosaries: s.rosaries, challenges: s.challenges }));

  return (
    <div className="min-h-dvh bg-bg">
      <div className="sticky top-0 z-20 bg-bg/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-xl items-center gap-3 px-4 pb-3 pt-safe">
          <button onClick={() => nav('/')} aria-label="Close devotional" className="mt-3 grid h-10 w-10 place-items-center rounded-full text-ink-soft hover:bg-surface-2">
            <X size={20} />
          </button>
          <div className="mt-3 flex flex-1 gap-1">
            {STEPS.map((_, i) => (
              <span key={i} className={cx('h-1 flex-1 rounded-full transition-all duration-500', i <= step ? 'bg-gold' : 'bg-line-strong')} />
            ))}
          </div>
          <span className="mt-3 w-14 text-right text-xs text-ink-faint">
            {step + 1}/{STEPS.length}
          </span>
        </div>
      </div>

      <main className="mx-auto max-w-xl px-5 pb-40">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
            <p className="eyebrow mt-6">{STEPS[step]}</p>

            {step === 0 && (
              <div className="pt-4 text-center">
                <p className="text-sm text-ink-faint">{formatLong(today)}</p>
                <h1 className="display mt-2 text-[2.6rem] leading-tight">{dev.title}</h1>
                <span className="chip mt-3">{TOPIC_LABELS[dev.topic]}</span>
                <Breath />
                <p className="serif mx-auto max-w-sm text-[1.35rem] italic leading-relaxed text-ink-soft">
                  In the name of the Father, and of the Son, and of the Holy Spirit. Come, Holy Spirit — open my heart to your word.
                </p>
              </div>
            )}

            {step === 1 && (
              <div className="pt-3">
                <h2 className="display text-[2rem]">Listen to the Word</h2>
                <p className="mb-6 mt-1 text-sm text-ink-soft">Read slowly. Then read it once more, noticing the word or phrase that stays with you.</p>
                <div className="card card-pad !p-6">
                  <Scripture refId={dev.ref} size="lg" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 pt-3">
                <h2 className="display text-[2rem]">Understanding the passage</h2>
                <Section title="Historical context" text={dev.context} />
                <Section title="What it means" text={dev.meaning} />
                <Section title="For your everyday life" text={dev.application} accent />
              </div>
            )}

            {step === 3 && (
              <div className="pt-3">
                <h2 className="display text-[2rem]">Reflection</h2>
                <p className="mb-5 mt-1 text-sm text-ink-soft">On {TOPIC_LABELS[dev.topic].toLowerCase()}</p>
                <div className="space-y-4 text-[1.08rem] leading-[1.75] text-ink">
                  {dev.reflection.map((p, i) => (
                    <p key={i} className={i === 0 ? 'first-letter:serif first-letter:float-left first-letter:mr-2 first-letter:text-[3.4rem] first-letter:leading-[0.9] first-letter:text-gold' : ''}>
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="pt-3">
                <h2 className="display text-[2rem]">Pray</h2>
                <p className="mb-5 mt-1 text-sm text-ink-soft">Pray these words slowly, or speak to God in your own.</p>
                <div className="card card-pad !p-6">
                  <p className="serif text-[1.4rem] leading-[1.6] text-ink">{dev.prayer}</p>
                </div>
                <p className="mt-5 text-sm text-ink-soft">Then pray the prayer Jesus taught us:</p>
                <p className="serif mt-2 text-[1.15rem] italic leading-relaxed text-ink-soft">
                  Our Father, who art in heaven, hallowed be thy name; thy kingdom come, thy will be done on earth as it is in heaven. Give us this day our daily bread, and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.
                </p>
              </div>
            )}

            {step === 5 && (
              <div className="pt-3">
                <h2 className="display text-[2rem]">A question for your heart</h2>
                <p className="serif mt-5 text-[1.6rem] italic leading-snug text-forest">{dev.question}</p>
                <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={6} placeholder="Write freely. This is private, saved only on this device." className="field mt-6 resize-none text-[1.02rem]" />
                <p className="mt-2 text-xs text-ink-faint">Optional. If you write something, it will be saved to your journal.</p>
              </div>
            )}

            {step === 6 && (
              <div className="pt-3">
                <h2 className="display text-[2rem]">Today’s challenge</h2>
                <div className="card card-pad mt-5 !p-6">
                  <p className="text-[1.15rem] leading-relaxed">{dev.challenge}</p>
                </div>
                <button
                  onClick={() => {
                    setAccepted(true);
                    toast('Challenge accepted. Mark it complete on Home when done.');
                  }}
                  className={cx('mt-5 w-full', accepted ? 'btn-soft text-forest' : 'btn-gold')}
                >
                  {accepted ? (
                    <>
                      <Check size={17} /> Accepted
                    </>
                  ) : (
                    'I accept today’s challenge'
                  )}
                </button>
                <button onClick={() => setChallenge(today, true)} className="mt-2 w-full py-2 text-sm text-ink-faint">
                  I’ve already done it today
                </button>
              </div>
            )}

            {step === 7 && (
              <div className="pt-2 text-center">
                <div className="-mx-5">
                  <Companion stage={after.stage.n} mood="joyful" flourishes={flourishes} height={250} />
                </div>
                <h2 className="display text-[2.4rem] leading-tight">Go in peace.</h2>
                <p className="mx-auto mt-2 max-w-sm text-ink-soft">
                  {alreadyDone ? 'Thank you for spending time with God’s word.' : 'You gave the first moments of your day to God. Carry this word with you.'}
                </p>
                {after.stage.n > beforeStage && (
                  <div className="card card-pad mx-auto mt-5 max-w-sm border-gold/40">
                    <p className="eyebrow text-gold">Your companion has grown</p>
                    <p className="display mt-1 text-2xl">{after.stage.name}</p>
                    <p className="text-sm text-ink-soft">{after.stage.line}</p>
                  </div>
                )}
                <div className="card card-pad mx-auto mt-5 max-w-sm text-left">
                  <p className="eyebrow">Carry this word</p>
                  <div className="mt-2">
                    <Scripture refId={dev.ref} size="sm" />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <div className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-xl gap-3 px-5 py-4">
          {step > 0 && step < last && (
            <button className="btn-ghost" onClick={() => go(step - 1)} aria-label="Previous step">
              <ArrowLeft size={18} />
            </button>
          )}
          {step < last ? (
            <button className="btn-primary flex-1 !py-3.5" onClick={() => go(step + 1)}>
              {step === 0 ? 'I am ready' : step === last - 1 ? 'Finish' : 'Continue'} <ArrowRight size={18} />
            </button>
          ) : (
            <>
              <button className="btn-ghost flex-1" onClick={() => nav('/journal')}>
                Journal
              </button>
              <button className="btn-primary flex-1" onClick={() => nav('/')}>
                Home
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, text, accent }: { title: string; text: string; accent?: boolean }) {
  return (
    <div className={cx('card card-pad', accent && '!border-gold/40 !bg-gold-soft/40')}>
      <p className="eyebrow">{title}</p>
      <p className="mt-2 text-[1.04rem] leading-relaxed text-ink">{text}</p>
    </div>
  );
}

function Breath() {
  return (
    <div className="my-10 flex flex-col items-center">
      <motion.div
        className="h-28 w-28 rounded-full"
        style={{ background: 'radial-gradient(circle at 40% 35%, #f6e5b9, #d9b15e 55%, rgba(217,177,94,0.15) 75%)' }}
        animate={{ scale: [0.75, 1.05, 0.75], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <p className="mt-5 text-sm text-ink-faint">Breathe in… and out. Take three slow breaths.</p>
    </div>
  );
}
