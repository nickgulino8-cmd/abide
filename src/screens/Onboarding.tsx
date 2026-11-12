import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, Lock, Check } from 'lucide-react';
import Companion from '@/components/Companion';
import { Scripture, cx } from '@/components/ui';
import { useStore, type ScripturePref } from '@/lib/store';
import { TOPIC_LABELS, type Topic } from '@/content/devotionals';
import { requestPermission } from '@/lib/reminders';

export const GOALS = [
  { id: 'prayer', label: 'Build a daily prayer life' },
  { id: 'habit', label: 'Overcome an unwanted habit' },
  { id: 'self-control', label: 'Grow in self-control' },
  { id: 'scripture', label: 'Read Scripture every day' },
  { id: 'jesus', label: 'Deepen my relationship with Jesus' },
  { id: 'peace', label: 'Find peace and less anxiety' },
  { id: 'sacraments', label: 'Return to the sacraments' },
  { id: 'purpose', label: 'Live with purpose and discipline' },
];

const FOCI: Topic[] = ['self-control', 'purity', 'patience', 'trust', 'perseverance', 'humility', 'faith', 'love', 'forgiveness', 'hope'];

const PREFS: { id: ScripturePref; label: string; hint: string }[] = [
  { id: 'mixed', label: 'A bit of everything', hint: 'The whole sweep of Scripture' },
  { id: 'gospels', label: 'The Gospels', hint: 'The words and life of Jesus' },
  { id: 'psalms', label: 'Psalms & Wisdom', hint: 'Prayerful, poetic, practical' },
  { id: 'letters', label: 'The Letters', hint: 'Paul, Peter, James and John' },
  { id: 'prophets', label: 'Prophets & Old Testament', hint: 'Promises of hope and renewal' },
];

const TIMES = [
  { id: 'morning', label: 'Morning' },
  { id: 'midday', label: 'Midday' },
  { id: 'evening', label: 'Evening' },
  { id: 'night', label: 'Before sleep' },
];

export default function Onboarding() {
  const complete = useStore((s) => s.completeOnboarding);
  const setCompanion = useStore((s) => s.setCompanion);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [goals, setGoals] = useState<string[]>([]);
  const [customGoal, setCustomGoal] = useState('');
  const [focus, setFocus] = useState<Topic>('self-control');
  const [meaning, setMeaning] = useState('');
  const [prayerTime, setPrayerTime] = useState('morning');
  const [morning, setMorning] = useState('07:00');
  const [evening, setEvening] = useState('21:00');
  const [notify, setNotify] = useState(false);
  const [pref, setPref] = useState<ScripturePref>('mixed');
  const [companionName, setCompanionName] = useState('Sage');

  const total = 7;
  const next = () => setStep((s) => Math.min(total - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const finish = async () => {
    if (notify) await requestPermission();
    setCompanion({ name: companionName.trim() || 'Sage' });
    window.scrollTo(0, 0);
    complete(
      { name: name.trim(), goals, customGoal: customGoal.trim(), focus, progressMeaning: meaning.trim(), prayerTime, scripturePref: pref },
      { morning: { on: true, time: morning }, evening: { on: true, time: evening }, checkin: { on: true, time: evening } },
    );
  };

  return (
    <div className="hero-gradient min-h-dvh">
      <div className="mx-auto flex min-h-dvh max-w-xl flex-col px-5 pb-8 pt-safe">
        <div className="flex h-14 items-center gap-3">
          {step > 0 ? (
            <button onClick={back} aria-label="Back" className="grid h-10 w-10 place-items-center rounded-full text-ink-soft hover:bg-surface-2">
              <ChevronLeft size={22} />
            </button>
          ) : (
            <span className="w-10" />
          )}
          <div className="flex flex-1 gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
              <span key={i} className={cx('h-1 flex-1 rounded-full transition-all', i <= step ? 'bg-gold' : 'bg-line-strong')} />
            ))}
          </div>
          <span className="w-10" />
        </div>

        <AnimatePresence mode="wait">
          <motion.section
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-1 flex-col"
          >
            {step === 0 && (
              <div className="flex flex-1 flex-col justify-center text-center">
                <p className="eyebrow mb-4">John 15:4</p>
                <h1 className="display text-[3.2rem] leading-[1.05]">Welcome to Abide.</h1>
                <p className="mx-auto mt-4 max-w-sm text-lg text-ink-soft">
                  An opportunity to grow stronger, live intentionally, and walk closer with Christ.
                </p>
                <div className="my-6">
                  <Companion stage={3} height={210} />
                </div>
                <Scripture refId="John 15:4" center size="sm" showSave={false} />
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-ink-faint">
                  <Lock size={13} /> Private by design. No account. Everything stays on this device.
                </div>
              </div>
            )}

            {step === 1 && (
              <Step title="What should we call you?" text="Optional. Your name never leaves this device.">
                <input className="field text-lg" placeholder="Your first name" value={name} onChange={(e) => setName(e.target.value)} autoFocus maxLength={40} />
              </Step>
            )}

            {step === 2 && (
              <Step title="What would you like to grow in?" text="Choose any that fit. You never need to describe a habit in detail — this is between you and God.">
                <div className="flex flex-wrap gap-2">
                  {GOALS.map((g) => {
                    const on = goals.includes(g.id);
                    return (
                      <button key={g.id} onClick={() => setGoals((x) => (on ? x.filter((y) => y !== g.id) : [...x, g.id]))} className={cx('chip !py-2.5 !text-[0.95rem]', on && 'chip-active')}>
                        {on && <Check size={15} />} {g.label}
                      </button>
                    );
                  })}
                </div>
                <label className="mt-6 block">
                  <span className="mb-2 block text-sm text-ink-soft">In your own words (optional)</span>
                  <input className="field" placeholder="e.g. Become more present to my family" value={customGoal} onChange={(e) => setCustomGoal(e.target.value)} maxLength={120} />
                </label>
              </Step>
            )}

            {step === 3 && (
              <Step title="Choose a starting virtue" text="A focus for your first weeks. You can change it any time.">
                <div className="grid grid-cols-2 gap-2">
                  {FOCI.map((f) => (
                    <button key={f} onClick={() => setFocus(f)} className={cx('card !rounded-2xl px-4 py-3 text-left transition', focus === f && '!border-forest ring-2 ring-forest/20')}>
                      <span className="display text-lg">{TOPIC_LABELS[f]}</span>
                    </button>
                  ))}
                </div>
                <label className="mt-6 block">
                  <span className="mb-2 block text-sm text-ink-soft">What does a faithful day mean to you? (optional)</span>
                  <input className="field" placeholder="e.g. I kept my commitment and prayed" value={meaning} onChange={(e) => setMeaning(e.target.value)} maxLength={120} />
                </label>
              </Step>
            )}

            {step === 4 && (
              <Step title="Your daily rhythm" text="When would you most like to pray?">
                <div className="grid grid-cols-2 gap-2">
                  {TIMES.map((t) => (
                    <button key={t.id} onClick={() => setPrayerTime(t.id)} className={cx('chip justify-center !py-3 !text-[0.95rem]', prayerTime === t.id && 'chip-active')}>
                      {t.label}
                    </button>
                  ))}
                </div>
                <div className="card card-pad mt-6 space-y-4">
                  <TimeRow label="Morning devotional reminder" value={morning} onChange={setMorning} />
                  <TimeRow label="Evening reflection reminder" value={evening} onChange={setEvening} />
                  <label className="flex items-center justify-between gap-4 pt-1">
                    <span className="text-sm text-ink-soft">Allow notifications on this device</span>
                    <input type="checkbox" className="h-5 w-5 accent-[var(--forest)]" checked={notify} onChange={(e) => setNotify(e.target.checked)} />
                  </label>
                </div>
                <p className="mt-3 text-xs text-ink-faint">Reminders are optional and can be changed or turned off in Profile.</p>
              </Step>
            )}

            {step === 5 && (
              <Step title="How would you like to read Scripture?" text="Every morning brings a new passage from the Douay-Rheims Bible.">
                <div className="space-y-2">
                  {PREFS.map((p) => (
                    <button key={p.id} onClick={() => setPref(p.id)} className={cx('card flex w-full items-center justify-between !rounded-2xl px-4 py-3.5 text-left transition', pref === p.id && '!border-forest ring-2 ring-forest/20')}>
                      <span>
                        <span className="block font-medium">{p.label}</span>
                        <span className="block text-sm text-ink-soft">{p.hint}</span>
                      </span>
                      {pref === p.id && <Check size={18} className="text-forest" />}
                    </button>
                  ))}
                </div>
              </Step>
            )}

            {step === 6 && (
              <div className="flex flex-1 flex-col">
                <h2 className="display mt-4 text-[2.2rem] leading-tight">Meet your companion</h2>
                <p className="mt-2 text-ink-soft">
                  A serpent — the ancient sign of wisdom and renewal, coiled on the vine. It grows as you stay faithful, through seven stages. On hard days it simply rests and waits for you. It never suffers, and it never measures your worth.
                </p>
                <div className="card my-5 overflow-hidden">
                  <Companion stage={1} height={230} />
                </div>
                <label className="block">
                  <span className="mb-2 block text-sm text-ink-soft">Give your companion a name</span>
                  <input className="field text-lg" value={companionName} onChange={(e) => setCompanionName(e.target.value)} maxLength={24} />
                </label>
              </div>
            )}
          </motion.section>
        </AnimatePresence>

        <div className="pt-6">
          {step < total - 1 ? (
            <button className="btn-primary w-full !py-4 text-base" onClick={next}>
              {step === 0 ? 'Begin' : 'Continue'} <ArrowRight size={18} />
            </button>
          ) : (
            <button className="btn-gold w-full !py-4 text-base" onClick={finish}>
              Begin my journey <ArrowRight size={18} />
            </button>
          )}
          {step > 0 && step < total - 1 && (
            <button className="mt-2 w-full py-2 text-sm text-ink-faint" onClick={next}>
              Skip for now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Step({ title, text, children }: { title: string; text: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col pt-6">
      <h2 className="display text-[2.2rem] leading-tight">{title}</h2>
      <p className="mb-6 mt-2 text-ink-soft">{text}</p>
      {children}
    </div>
  );
}

function TimeRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center justify-between gap-4">
      <span className="text-sm text-ink-soft">{label}</span>
      <input type="time" value={value} onChange={(e) => onChange(e.target.value)} className="rounded-xl border border-line-strong bg-surface-2 px-3 py-2 text-ink" />
    </label>
  );
}
