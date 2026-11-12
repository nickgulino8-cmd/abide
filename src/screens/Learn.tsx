import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { CheckCircle2, ChevronRight, Circle, GraduationCap, ArrowRight, Check, X, Sparkles } from 'lucide-react';
import { Card, Page, Scripture, TopBar, cx } from '@/components/ui';
import { LEARN, type Block } from '@/content/learn';
import { useStore } from '@/lib/store';

export default function Learn() {
  const { cat, article } = useParams();
  const loc = useLocation();
  const category = LEARN.find((c) => c.id === cat);
  if (!cat) return <Navigate to="/faith" replace />;
  if (!category) return <Navigate to="/faith" replace />;
  if (loc.pathname.endsWith('/quiz')) return <Quiz catId={category.id} />;
  if (article) return <ArticleView catId={category.id} articleId={article} />;
  return <CategoryView catId={category.id} />;
}

function CategoryView({ catId }: { catId: string }) {
  const c = LEARN.find((x) => x.id === catId)!;
  const learnRead = useStore((s) => s.learnRead);
  const best = useStore((s) => s.quizBest[catId]);
  const read = c.articles.filter((a) => learnRead[a.id]).length;
  return (
    <Page>
      <TopBar title={c.title} back="/faith" />
      <header className="px-1">
        <h1 className="display text-[2.3rem] leading-tight">{c.title}</h1>
        <p className="text-ink-soft">{c.subtitle}</p>
        <p className="mt-2 text-sm text-ink-faint">
          {read} of {c.articles.length} read
        </p>
      </header>
      <div className="card mt-5 divide-y divide-line !rounded-3xl px-4">
        {c.articles.map((a) => (
          <Link key={a.id} to={`/faith/learn/${c.id}/${a.id}`} className="flex items-center gap-3 py-4">
            {learnRead[a.id] ? <CheckCircle2 size={20} className="shrink-0 text-forest" /> : <Circle size={20} className="shrink-0 text-line-strong" />}
            <span className="min-w-0 flex-1">
              <span className="block font-medium">{a.title}</span>
              <span className="block text-sm text-ink-soft">{a.summary}</span>
            </span>
            <ChevronRight size={17} className="shrink-0 text-ink-faint" />
          </Link>
        ))}
      </div>
      {c.quiz && (
        <Link to={`/faith/learn/${c.id}/quiz`} className="card mt-4 flex items-center gap-4 !rounded-3xl p-5">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-soft text-gold">
            <GraduationCap size={22} />
          </span>
          <span className="flex-1">
            <span className="block font-medium">Check your understanding</span>
            <span className="block text-sm text-ink-soft">
              {c.quiz.length} questions{best !== undefined ? ` · best ${best}/${c.quiz.length}` : ''}
            </span>
          </span>
          <ArrowRight size={18} className="text-ink-faint" />
        </Link>
      )}
    </Page>
  );
}

function ArticleView({ catId, articleId }: { catId: string; articleId: string }) {
  const c = LEARN.find((x) => x.id === catId)!;
  const idx = c.articles.findIndex((a) => a.id === articleId);
  const a = c.articles[idx];
  const markLearnRead = useStore((s) => s.markLearnRead);
  useEffect(() => {
    if (a) markLearnRead(a.id);
  }, [a, markLearnRead]);
  if (!a) return <Navigate to={`/faith/learn/${catId}`} replace />;
  const next = c.articles[idx + 1];
  return (
    <Page>
      <TopBar title={c.title} back={`/faith/learn/${catId}`} />
      <article>
        <p className="eyebrow px-1">
          {idx + 1} of {c.articles.length}
        </p>
        <h1 className="display mt-1 px-1 text-[2.4rem] leading-tight">{a.title}</h1>
        <p className="mt-1 px-1 text-[1.05rem] text-ink-soft">{a.summary}</p>
        <div className="mt-6 space-y-4">
          {a.blocks.map((b, i) => (
            <BlockView key={i} b={b} />
          ))}
        </div>
        {a.saintId && (
          <Link to={`/faith/saints/${a.saintId}`} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-gold">
            <Sparkles size={15} /> Read the full saint profile
          </Link>
        )}
      </article>
      <div className="mt-8">
        {next ? (
          <Link to={`/faith/learn/${catId}/${next.id}`} className="card flex items-center justify-between !rounded-3xl p-5">
            <span>
              <span className="eyebrow">Next</span>
              <span className="display block text-xl">{next.title}</span>
            </span>
            <ArrowRight size={18} />
          </Link>
        ) : c.quiz ? (
          <Link to={`/faith/learn/${catId}/quiz`} className="btn-gold w-full">
            Check your understanding <ArrowRight size={17} />
          </Link>
        ) : (
          <Link to="/faith" className="btn-primary w-full">
            Back to Faith
          </Link>
        )}
      </div>
    </Page>
  );
}

function BlockView({ b }: { b: Block }) {
  switch (b.type) {
    case 'p':
      return <p className="px-1 text-[1.04rem] leading-[1.75]">{b.text}</p>;
    case 'h':
      return <h2 className="display px-1 pt-3 text-[1.6rem]">{b.text}</h2>;
    case 'scripture':
      return (
        <div className="card card-pad">
          <Scripture refId={b.ref} size="sm" />
        </div>
      );
    case 'list':
      return (
        <ul className="space-y-2 px-1">
          {b.items.map((it, i) => (
            <li key={i} className="flex gap-3 text-[1rem] leading-relaxed">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    case 'callout':
      return (
        <div className="rounded-3xl border border-gold/30 bg-gold-soft/50 p-5">
          <p className="font-semibold">{b.title}</p>
          <p className="mt-1 text-[0.98rem] leading-relaxed text-ink-soft">{b.text}</p>
        </div>
      );
    case 'teaching':
      return (
        <div className="rounded-3xl border-l-4 border-forest bg-sage-soft/60 p-5">
          <p className="eyebrow mb-1 !text-forest">Church teaching</p>
          <p className="serif text-[1.2rem] leading-snug">“{b.text}”</p>
          <p className="mt-2 text-xs text-ink-soft">— {b.source}</p>
        </div>
      );
  }
}

function Quiz({ catId }: { catId: string }) {
  const c = LEARN.find((x) => x.id === catId)!;
  const quiz = c.quiz ?? [];
  const setBest = useStore((s) => s.setQuizBest);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const finished = i >= quiz.length;
  useEffect(() => {
    if (finished) setBest(catId, score);
  }, [finished, score, catId, setBest]);
  const q = quiz[i];
  return (
    <Page>
      <TopBar title={`${c.title} · Quiz`} back={`/faith/learn/${catId}`} />
      {finished ? (
        <Card className="mt-6 text-center !py-10">
          <GraduationCap size={36} className="mx-auto text-gold" />
          <p className="display mt-3 text-4xl">
            {score} / {quiz.length}
          </p>
          <p className="mt-2 text-ink-soft">{score === quiz.length ? 'Wonderful — you know this well.' : 'Every question is a chance to learn. Keep going!'}</p>
          <div className="mt-6 flex gap-3">
            <button
              className="btn-ghost flex-1"
              onClick={() => {
                setI(0);
                setScore(0);
                setPicked(null);
              }}
            >
              Try again
            </button>
            <Link to={`/faith/learn/${catId}`} className="btn-primary flex-1">
              Done
            </Link>
          </div>
        </Card>
      ) : (
        <div className="mt-4">
          <p className="eyebrow px-1">
            Question {i + 1} of {quiz.length}
          </p>
          <h1 className="display mt-2 px-1 text-[1.9rem] leading-tight">{q.q}</h1>
          <div className="mt-5 space-y-2">
            {q.options.map((o, k) => {
              const state = picked === null ? 'idle' : k === q.answer ? 'right' : k === picked ? 'wrong' : 'idle';
              return (
                <button
                  key={k}
                  disabled={picked !== null}
                  onClick={() => {
                    setPicked(k);
                    if (k === q.answer) setScore((s) => s + 1);
                  }}
                  className={cx(
                    'card flex w-full items-center justify-between !rounded-2xl px-4 py-4 text-left transition',
                    state === 'right' && '!border-forest !bg-sage-soft',
                    state === 'wrong' && '!border-rose/50 !bg-rose/10',
                  )}
                >
                  {o}
                  {state === 'right' && <Check size={18} className="text-forest" />}
                  {state === 'wrong' && <X size={18} className="text-rose" />}
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <div className="mt-4 rounded-2xl bg-surface-2 p-4 text-sm text-ink-soft">
              {q.explain}
              <button
                className="btn-primary mt-4 w-full"
                onClick={() => {
                  setI((x) => x + 1);
                  setPicked(null);
                }}
              >
                {i === quiz.length - 1 ? 'See results' : 'Next question'}
              </button>
            </div>
          )}
        </div>
      )}
    </Page>
  );
}
