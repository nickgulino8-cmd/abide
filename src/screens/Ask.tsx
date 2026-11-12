import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, Trash2, Info, BookOpen, ArrowUpRight, LifeBuoy } from 'lucide-react';
import { Page, Scripture, TopBar, cx } from '@/components/ui';
import { useStore } from '@/lib/store';
import { provider, type CompanionAnswer } from '@/lib/assistant';
import { KIND_LABEL, SUGGESTED_QUESTIONS } from '@/content/assistant';

export default function Ask() {
  const chat = useStore((s) => s.chat);
  const addChat = useStore((s) => s.addChat);
  const clearChat = useStore((s) => s.clearChat);
  const profile = useStore((s) => s.profile);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [params, setParams] = useSearchParams();
  const endRef = useRef<HTMLDivElement>(null);

  const ask = async (q: string) => {
    const question = q.trim();
    if (!question || thinking) return;
    setInput('');
    addChat({ role: 'user', text: question });
    setThinking(true);
    const answer = await provider.answer(question, { profile });
    await new Promise((r) => setTimeout(r, 450)); // a brief, calm pause
    addChat({ role: 'companion', text: JSON.stringify(answer), answerId: answer.id });
    setThinking(false);
  };

  useEffect(() => {
    const q = params.get('q');
    if (q) {
      setParams({}, { replace: true });
      void ask(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [chat.length, thinking]);

  return (
    <Page className="!pb-48">
      <TopBar
        title="Abide Companion"
        subtitle="Offline · answers from a curated Catholic library"
        right={
          chat.length > 0 && (
            <button onClick={clearChat} aria-label="Clear conversation" className="grid h-10 w-10 place-items-center rounded-full text-ink-faint hover:bg-surface-2">
              <Trash2 size={18} />
            </button>
          )
        }
      />

      <div className="flex gap-3 rounded-2xl bg-sage-soft/70 p-4 text-[0.85rem] leading-relaxed text-ink-soft">
        <Info size={18} className="mt-0.5 shrink-0 text-forest" />
        <p>
          I’m a learning tool, not a priest or spiritual director, and I don’t speak for God. Answers are labelled as Church teaching, pastoral guidance, practical help or theological reflection. For serious questions, please talk with a priest you trust.
        </p>
      </div>

      {chat.length === 0 && (
        <div className="mt-6">
          <p className="display px-1 text-2xl">What’s on your heart?</p>
          <div className="mt-3 flex flex-col gap-2">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button key={q} onClick={() => ask(q)} className="card !rounded-2xl px-4 py-3 text-left text-[0.95rem] transition active:scale-[0.99]">
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 space-y-5">
        {chat.map((m) =>
          m.role === 'user' ? (
            <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="ml-auto w-fit max-w-[85%] rounded-3xl rounded-br-lg bg-forest px-4 py-3 text-on-forest">
              {m.text}
            </motion.div>
          ) : (
            <AnswerCard key={m.id} answer={safeParse(m.text)} onAsk={ask} />
          ),
        )}
        {thinking && (
          <div className="flex gap-1.5 px-2" aria-label="Thinking">
            {[0, 1, 2].map((i) => (
              <motion.span key={i} className="h-2 w-2 rounded-full bg-gold" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void ask(input);
        }}
        className="pb-safe fixed inset-x-0 bottom-[4.6rem] z-30 mx-auto w-full max-w-xl px-4"
      >
        <div className="card flex items-center gap-2 !rounded-full py-1.5 pl-5 pr-1.5 shadow-lift">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about Scripture, prayer, the faith…" className="min-w-0 flex-1 bg-transparent py-2 outline-none placeholder:text-ink-faint" aria-label="Your question" />
          <button disabled={!input.trim() || thinking} aria-label="Send" className="grid h-10 w-10 place-items-center rounded-full bg-forest text-on-forest disabled:opacity-40">
            <Send size={17} />
          </button>
        </div>
      </form>
    </Page>
  );
}

function safeParse(t: string): CompanionAnswer {
  try {
    return JSON.parse(t);
  } catch {
    return { id: 'text', title: '', kind: 'practical', text: t };
  }
}

function AnswerCard({ answer, onAsk }: { answer: CompanionAnswer; onAsk: (q: string) => void }) {
  const crisis = answer.kind === 'crisis';
  return (
    <motion.article initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={cx('card card-pad !rounded-3xl !rounded-bl-lg', crisis && '!border-rose/50')}>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className={cx('rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wider', crisis ? 'bg-rose/15 text-rose' : answer.kind === 'teaching' ? 'bg-sage-soft text-forest' : answer.kind === 'opinion' ? 'bg-surface-2 text-ink-soft' : 'bg-gold-soft text-gold')}>
          {crisis ? (
            <span className="flex items-center gap-1">
              <LifeBuoy size={12} /> Support
            </span>
          ) : (
            KIND_LABEL[answer.kind as Exclude<typeof answer.kind, 'crisis'>]
          )}
        </span>
      </div>
      {answer.title && <h3 className="display text-[1.45rem] leading-tight">{answer.title}</h3>}
      <div className="mt-3 space-y-3 text-[0.98rem] leading-relaxed">
        {answer.text.split(/\n\n+/).map((para, i) => {
          const m = para.trim().match(/^\{\{(.+)\}\}$/);
          if (m)
            return (
              <div key={i} className="rounded-2xl bg-surface-2 p-4">
                <Scripture refId={m[1]} size="sm" />
              </div>
            );
          return (
            <p key={i} className="whitespace-pre-line">
              {para}
            </p>
          );
        })}
      </div>
      {answer.sources && answer.sources.length > 0 && (
        <p className="mt-4 flex items-center gap-1.5 text-xs text-ink-faint">
          <BookOpen size={13} /> Catechism of the Catholic Church: {answer.sources.join('; ')}
        </p>
      )}
      {answer.links && answer.links.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {answer.links.map((l) => (
            <Link key={l.to + l.label} to={l.to} className="chip !text-ink">
              {l.label} <ArrowUpRight size={13} />
            </Link>
          ))}
        </div>
      )}
      {answer.followUps && (
        <div className="mt-4 border-t border-line pt-3">
          <p className="mb-2 text-xs text-ink-faint">You might also ask</p>
          <div className="flex flex-wrap gap-2">
            {answer.followUps.map((f) => (
              <button key={f} onClick={() => onAsk(f)} className="chip">
                {f}
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.article>
  );
}
