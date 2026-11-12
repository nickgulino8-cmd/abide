import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ChevronRight, X } from 'lucide-react';
import { Page, Paragraphs, Scripture, TopBar, cx } from '@/components/ui';
import { MYSTERIES, ROSARY_CLOSING, buildRosarySteps, mysteriesForDate, type MysterySet } from '@/content/rosary';
import { prayerById } from '@/content/prayers';
import { useStore } from '@/lib/store';
import { useToday } from '@/lib/hooks';

export default function Rosary() {
  const { set } = useParams();
  if (set) return <PrayRosary setId={set as MysterySet} />;
  return <RosaryHome />;
}

function RosaryHome() {
  const todays = mysteriesForDate(new Date());
  const [open, setOpen] = useState<MysterySet>(todays);
  return (
    <Page>
      <TopBar title="The Holy Rosary" />
      <p className="px-1 text-ink-soft">
        The Rosary is a prayer of the Gospel: while praying the Our Father and Hail Mary, we meditate on the life of Jesus through the eyes of Mary. It takes about twenty minutes. Every step is guided — no beads or internet needed.
      </p>
      <div className="mt-5 space-y-3">
        {MYSTERIES.map((g) => (
          <div key={g.id} className={cx('card overflow-hidden !rounded-3xl', g.id === todays && '!border-gold/50')}>
            <button className="flex w-full items-center gap-4 p-5 text-left" onClick={() => setOpen(g.id)} aria-expanded={open === g.id}>
              <span className="flex-1">
                {g.id === todays && <span className="eyebrow text-gold">Today</span>}
                <span className="display block text-[1.5rem] leading-tight">{g.title}</span>
                <span className="block text-sm text-ink-soft">
                  {g.days} · {g.description}
                </span>
              </span>
              <ChevronRight size={18} className={cx('text-ink-faint transition', open === g.id && 'rotate-90')} />
            </button>
            {open === g.id && (
              <div className="border-t border-line px-5 pb-5 pt-3">
                <ol className="space-y-2">
                  {g.mysteries.map((m, i) => (
                    <li key={m.title} className="flex gap-3 text-[0.95rem]">
                      <span className="w-5 text-gold">{i + 1}.</span>
                      <span>
                        <span className="font-medium">{m.title}</span>
                        <span className="block text-xs text-ink-faint">Fruit: {m.fruit}</span>
                      </span>
                    </li>
                  ))}
                </ol>
                <Link to={`/faith/rosary/pray/${g.id}`} className="btn-primary mt-4 w-full">
                  Pray the {g.title}
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </Page>
  );
}

function PrayRosary({ setId }: { setId: MysterySet }) {
  const nav = useNavigate();
  const today = useToday();
  const group = MYSTERIES.find((m) => m.id === setId) ?? MYSTERIES[0];
  const steps = useMemo(() => buildRosarySteps(), []);
  const storageKey = `abide-rosary-${setId}-${today}`;
  const [i, setI] = useState(() => {
    try {
      return Math.min(steps.length, Number(sessionStorage.getItem(storageKey) ?? 0));
    } catch {
      return 0;
    }
  });
  const logRosary = useStore((s) => s.logRosary);
  const done = i >= steps.length;

  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, String(i));
    } catch {
      /* ignore */
    }
    if (i === steps.length) logRosary(today);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  const step = steps[Math.min(i, steps.length - 1)];
  const mystery = step.mysteryIndex !== undefined ? group.mysteries[step.mysteryIndex] : undefined;
  const prayer = step.prayerId === 'rosary-closing' ? ROSARY_CLOSING : step.prayerId ? prayerById(step.prayerId) : undefined;

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <div className="mx-auto flex w-full max-w-xl items-center gap-3 px-4 pt-safe">
        <button aria-label="Close" onClick={() => nav('/faith/rosary')} className="mt-3 grid h-10 w-10 place-items-center rounded-full text-ink-soft hover:bg-surface-2">
          <X size={20} />
        </button>
        <div className="mt-3 flex-1">
          <p className="text-center text-sm font-medium">{group.title}</p>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-line-strong">
            <div className="h-full rounded-full bg-gold transition-all duration-500" style={{ width: `${(i / steps.length) * 100}%` }} />
          </div>
        </div>
        <span className="mt-3 w-10" />
      </div>

      {done ? (
        <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="h-24 w-24 rounded-full" style={{ background: 'radial-gradient(circle at 40% 35%, #f6e5b9, #d9b15e 55%, rgba(217,177,94,0.1) 75%)' }} />
          <h1 className="display mt-6 text-[2.4rem]">Amen.</h1>
          <p className="mt-2 text-ink-soft">You have prayed the {group.title}. Mary, Mother of God, pray for us.</p>
          <div className="mt-8 flex w-full gap-3">
            <button
              className="btn-ghost flex-1"
              onClick={() => {
                setI(0);
              }}
            >
              Pray again
            </button>
            <button className="btn-primary flex-1" onClick={() => nav('/')}>
              Home
            </button>
          </div>
        </div>
      ) : (
        <>
          <main className="mx-auto w-full max-w-xl flex-1 px-5 pb-48 pt-4">
            {/* bead tracker */}
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((d) => (
                <span key={d} className={cx('h-2.5 rounded-full transition-all', step.decade === d ? 'w-8 bg-gold' : (step.decade ?? 0) > d || (step.decade === undefined && i > 10) ? 'w-2.5 bg-forest' : 'w-2.5 bg-line-strong')} />
              ))}
            </div>
            {step.totalBeads && (
              <div className="mt-4 flex justify-center gap-1.5" aria-label={`Bead ${step.bead} of ${step.totalBeads}`}>
                {Array.from({ length: step.totalBeads }).map((_, k) => (
                  <motion.span key={k} animate={{ scale: k + 1 === step.bead ? 1.35 : 1 }} className={cx('h-3.5 w-3.5 rounded-full border', k + 1 <= (step.bead ?? 0) ? 'border-gold bg-gold' : 'border-line-strong bg-surface')} />
                ))}
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}>
                {step.kind === 'mystery' && mystery ? (
                  <div className="mt-6">
                    <p className="eyebrow text-center">
                      {['First', 'Second', 'Third', 'Fourth', 'Fifth'][step.decade! - 1]} {group.title.replace(' Mysteries', '')} Mystery
                    </p>
                    <h1 className="display mt-2 text-center text-[2.3rem] leading-tight">{mystery.title}</h1>
                    <p className="mt-1 text-center text-sm text-gold">Fruit of the mystery: {mystery.fruit}</p>
                    <div className="card card-pad mt-6">
                      <Scripture refId={mystery.ref} size="sm" />
                    </div>
                    <p className="mt-4 text-[1.02rem] leading-relaxed text-ink-soft">{mystery.meditation}</p>
                  </div>
                ) : (
                  <div className="mt-6 text-center">
                    {mystery && <p className="text-sm text-ink-faint">{mystery.title}</p>}
                    <h1 className="display mt-1 text-[1.9rem]">{step.label}</h1>
                    {step.totalBeads && (
                      <p className="mt-1 text-sm text-gold">
                        {step.bead} of {step.totalBeads}
                      </p>
                    )}
                    {prayer && <Paragraphs text={prayer.text} className="serif mt-5 text-left text-[1.3rem] leading-[1.6]" />}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>

          <div className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/90 backdrop-blur-xl">
            <div className="mx-auto flex max-w-xl gap-3 px-5 py-4">
              <button className="btn-ghost" disabled={i === 0} onClick={() => setI((x) => Math.max(0, x - 1))} aria-label="Previous">
                <ArrowLeft size={18} />
              </button>
              <button className="btn-primary flex-1 !py-4 text-base" onClick={() => setI((x) => x + 1)}>
                {step.kind === 'mystery' ? 'Begin this decade' : i === steps.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
