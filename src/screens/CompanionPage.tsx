import { useState } from 'react';
import { Check, Lock, Pencil } from 'lucide-react';
import Companion from '@/components/Companion';
import { Card, Page, Scripture, SectionHeader, TopBar, cx, toast } from '@/components/ui';
import { useProgress } from '@/lib/hooks';
import { useStore } from '@/lib/store';
import { MILESTONES, STAGES, type Flourish } from '@/lib/progress';
import { COMPANION_ABOUT } from '@/content/companion';

const FLOURISH_INFO: Record<Flourish, string> = {
  embers: 'Embers of Light',
  blossoms: 'Vine Blossoms',
  halo: 'Golden Halo',
  radiance: 'Radiance',
};

export default function CompanionPage() {
  const { growth, flourishes, mood } = useProgress();
  const companion = useStore((s) => s.companion);
  const setCompanion = useStore((s) => s.setCompanion);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(companion.name);
  const [preview, setPreview] = useState(growth.stage.n);

  return (
    <Page>
      <TopBar title="Your companion" />
      <Card className="overflow-hidden !p-0">
        <div className="hero-gradient">
          <Companion stage={growth.stage.n} mood={mood} flourishes={flourishes} height={300} onTap={() => setCompanion({ interactions: companion.interactions + 1 })} />
        </div>
        <div className="p-5">
          {editing ? (
            <div className="flex gap-2">
              <input className="field" value={name} onChange={(e) => setName(e.target.value)} maxLength={24} autoFocus />
              <button
                className="btn-primary"
                onClick={() => {
                  setCompanion({ name: name.trim() || 'Sage' });
                  setEditing(false);
                  toast('Name saved');
                }}
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="display text-3xl">{companion.name}</p>
                <p className="text-sm text-ink-soft">
                  Stage {growth.stage.n} · {growth.stage.name} · {growth.points} growth
                </p>
              </div>
              <button onClick={() => setEditing(true)} aria-label="Rename companion" className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface-2">
                <Pencil size={17} />
              </button>
            </div>
          )}
          <p className="mt-3 text-ink-soft">{growth.stage.line}</p>
        </div>
      </Card>

      <SectionHeader title="Seven stages" />
      <Card className="!p-3">
        <Companion stage={preview} height={230} animated={preview <= growth.stage.n} />
        <div className="mt-2 grid grid-cols-7 gap-1.5">
          {STAGES.map((s) => {
            const unlocked = s.n <= growth.stage.n;
            return (
              <button
                key={s.n}
                onClick={() => setPreview(s.n)}
                aria-label={`Preview stage ${s.n}, ${s.name}`}
                className={cx('flex flex-col items-center rounded-xl py-2 text-xs transition', preview === s.n ? 'bg-sage-soft text-forest' : 'text-ink-soft')}
              >
                <span className={cx('grid h-7 w-7 place-items-center rounded-full font-semibold', unlocked ? 'bg-forest text-on-forest' : 'bg-surface-2 text-ink-faint')}>{unlocked ? s.n : <Lock size={12} />}</span>
              </button>
            );
          })}
        </div>
        <div className="px-2 pb-2 pt-3">
          <p className="display text-2xl">{STAGES[preview - 1].name}</p>
          <p className="text-sm text-ink-soft">{STAGES[preview - 1].line}</p>
          <p className="mt-1 text-xs text-ink-faint">
            {preview <= growth.stage.n ? 'Reached' : `Unlocks at ${STAGES[preview - 1].at} growth — ${STAGES[preview - 1].at - growth.points} to go`}
          </p>
        </div>
      </Card>

      <SectionHeader title="Flourishes" />
      <div className="space-y-2">
        {MILESTONES.filter((m) => m.flourish).map((m) => {
          const got = flourishes.includes(m.flourish!);
          return (
            <div key={m.id} className="card flex items-center gap-4 !rounded-2xl px-4 py-3">
              <span className={cx('grid h-10 w-10 place-items-center rounded-full', got ? 'bg-gold-soft text-gold' : 'bg-surface-2 text-ink-faint')}>{got ? <Check size={18} /> : <Lock size={15} />}</span>
              <div>
                <p className="font-medium">{FLOURISH_INFO[m.flourish!]}</p>
                <p className="text-xs text-ink-soft">
                  {m.title} streak · {m.reward}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <SectionHeader title="How growth works" />
      <Card>
        <ul className="space-y-2 text-[0.95rem] text-ink-soft">
          <li>
            <b className="text-ink">+2</b> for a committed check-in
          </li>
          <li>
            <b className="text-ink">+1</b> for completing the daily devotional
          </li>
          <li>
            <b className="text-ink">+1</b> for completing the daily challenge
          </li>
          <li>
            <b className="text-ink">+1</b> for praying the Rosary
          </li>
          <li>
            <b className="text-ink">+1</b> for honestly reflecting on a hard day
          </li>
        </ul>
        <p className="mt-4 text-sm text-ink-soft">Growth is never taken away. A setback doesn’t shrink your companion — it rests beside a small dawn-light and waits to rise with you.</p>
      </Card>

      <SectionHeader title={COMPANION_ABOUT.title} />
      <Card>
        <div className="space-y-3 text-[0.98rem] leading-relaxed text-ink-soft">
          {COMPANION_ABOUT.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="mt-5 space-y-5 border-t border-line pt-5">
          {COMPANION_ABOUT.refs.map((r) => (
            <Scripture key={r} refId={r} size="sm" />
          ))}
        </div>
      </Card>
    </Page>
  );
}
