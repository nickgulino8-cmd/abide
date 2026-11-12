import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { Page, Scripture, Sheet, TopBar, cx, toast } from '@/components/ui';
import { useStore, type JournalType } from '@/lib/store';
import { getPassage } from '@/lib/scripture';
import { formatLong } from '@/lib/dates';
import { useToday } from '@/lib/hooks';
import { TYPE_META } from './Journal';
import { JOURNAL_PROMPTS } from '@/lib/daily';

const EDITABLE: JournalType[] = ['reflection', 'gratitude', 'intention', 'scripture', 'free'];
const PLACEHOLDER: Record<JournalType, string> = {
  reflection: 'What is God showing you?',
  gratitude: 'Three things I am grateful for today…',
  intention: 'Lord, I bring before you…',
  scripture: 'What does this passage mean for me?',
  milestone: '',
  free: 'Write freely…',
};

export default function JournalEditor() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const nav = useNavigate();
  const today = useToday();
  const existing = useStore((s) => s.journal.find((j) => j.id === id));
  const upsert = useStore((s) => s.upsertJournal);
  const del = useStore((s) => s.deleteJournal);
  const [type, setType] = useState<JournalType>(existing?.type ?? ((params.get('type') as JournalType) || 'reflection'));
  const [title, setTitle] = useState(existing?.title ?? '');
  const [body, setBody] = useState(existing?.body ?? '');
  const [prompt, setPrompt] = useState(existing?.prompt ?? params.get('prompt') ?? '');
  const [confirm, setConfirm] = useState(false);
  const ref = existing?.ref;

  const save = () => {
    if (!body.trim()) return toast('Write a few words first');
    upsert({ id: existing?.id, type, title: title.trim() || undefined, body: body.trim(), prompt: prompt || undefined, ref, date: existing?.date ?? today });
    toast('Saved');
    nav('/journal');
  };

  return (
    <Page>
      <TopBar
        title={existing ? 'Edit entry' : 'New entry'}
        subtitle={formatLong(existing?.date ?? today)}
        back="/journal"
        right={
          <button className="btn-primary !px-4 !py-2" onClick={save}>
            Save
          </button>
        }
      />
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {EDITABLE.map((t) => (
          <button key={t} onClick={() => setType(t)} className={cx('chip shrink-0', type === t && 'chip-active')}>
            {TYPE_META[t].label}
          </button>
        ))}
      </div>

      {ref && getPassage(ref) && (
        <div className="card card-pad mt-4">
          <Scripture refId={ref} size="sm" />
        </div>
      )}
      {prompt ? (
        <p className="serif mt-5 px-1 text-[1.5rem] italic leading-snug text-forest">{prompt}</p>
      ) : (
        type !== 'intention' && (
          <button className="mt-4 px-1 text-sm text-gold" onClick={() => setPrompt(JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)])}>
            Give me a prompt
          </button>
        )
      )}
      <input className="mt-4 w-full bg-transparent px-1 text-xl font-medium outline-none placeholder:text-ink-faint" placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} />
      <textarea
        autoFocus={!existing}
        className="serif mt-3 min-h-[50dvh] w-full resize-none bg-transparent px-1 text-[1.3rem] leading-[1.7] outline-none placeholder:text-ink-faint"
        placeholder={PLACEHOLDER[type]}
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      {existing && (
        <button className="btn-ghost mt-4 text-rose" onClick={() => setConfirm(true)}>
          <Trash2 size={16} /> Delete entry
        </button>
      )}
      <Sheet open={confirm} onClose={() => setConfirm(false)} title="Delete this entry?">
        <p className="text-ink-soft">This cannot be undone.</p>
        <div className="mt-5 flex gap-3">
          <button className="btn-ghost flex-1" onClick={() => setConfirm(false)}>
            Cancel
          </button>
          <button
            className="btn-primary flex-1"
            onClick={() => {
              del(existing!.id);
              toast('Entry deleted');
              nav('/journal');
            }}
          >
            Delete
          </button>
        </div>
      </Sheet>
    </Page>
  );
}
