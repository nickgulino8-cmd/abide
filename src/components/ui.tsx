import { useEffect, useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Bookmark, BookmarkCheck, X } from 'lucide-react';
import clsx from 'clsx';
import { getPassage } from '@/lib/scripture';
import { TRANSLATION } from '@/lib/bible';
import { useStore } from '@/lib/store';

export const cx = clsx;

export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cx('mx-auto w-full max-w-xl px-4 pb-32 pt-safe', className)}
    >
      {children}
    </motion.main>
  );
}

export function TopBar({ title, back = true, right, subtitle }: { title?: string; back?: boolean | string; right?: ReactNode; subtitle?: string }) {
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-20 -mx-4 mb-2 flex items-center gap-2 bg-bg/85 px-3 pb-2 pt-3 backdrop-blur-xl">
      {back ? (
        <button
          aria-label="Back"
          onClick={() => (typeof back === 'string' ? nav(back) : window.history.length > 1 ? nav(-1) : nav('/'))}
          className="grid h-10 w-10 place-items-center rounded-full text-ink-soft transition hover:bg-surface-2"
        >
          <ChevronLeft size={22} />
        </button>
      ) : (
        <span className="w-2" />
      )}
      <div className="min-w-0 flex-1">
        {title && <h1 className="truncate text-[1.05rem] font-semibold text-ink">{title}</h1>}
        {subtitle && <p className="truncate text-xs text-ink-faint">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}

export function SectionHeader({ title, action, to }: { title: string; action?: string; to?: string }) {
  return (
    <div className="mb-3 mt-8 flex items-end justify-between px-1">
      <h2 className="display text-[1.45rem] leading-none">{title}</h2>
      {action && to && (
        <Link to={to} className="text-sm font-medium text-gold">
          {action}
        </Link>
      )}
    </div>
  );
}

export function Card({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div onClick={onClick} className={cx('card card-pad', onClick && 'cursor-pointer transition active:scale-[0.99]', className)}>
      {children}
    </div>
  );
}

export function RowLink({ to, icon, title, subtitle, right }: { to: string; icon?: ReactNode; title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <Link to={to} className="row-link">
      {icon && <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sage-soft text-forest">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-ink">{title}</span>
        {subtitle && <span className="block truncate text-sm text-ink-soft">{subtitle}</span>}
      </span>
      {right ?? <ChevronRight size={18} className="text-ink-faint" />}
    </Link>
  );
}

/** Renders a verified Douay-Rheims passage by reference. */
export function Scripture({
  refId,
  size = 'md',
  showSave = true,
  className,
  center,
}: {
  refId: string;
  size?: 'sm' | 'md' | 'lg';
  showSave?: boolean;
  className?: string;
  center?: boolean;
}) {
  const p = getPassage(refId);
  const saved = useStore((s) => s.saved.some((x) => x.ref === refId));
  const toggle = useStore((s) => s.toggleSaved);
  if (!p) return <p className="text-sm text-rose">Passage unavailable: {refId}</p>;
  const multi = p.verses.length > 1;
  return (
    <figure className={className}>
      <blockquote
        className={cx(
          'scripture',
          size === 'sm' && '!text-[1.08rem]',
          size === 'lg' && '!text-[1.5rem] !leading-[1.55]',
          center && 'text-center',
        )}
      >
        {p.verses.map((v) => (
          <span key={v.v}>
            {multi && <sup className="verse-num">{v.v}</sup>}
            {v.t}{' '}
          </span>
        ))}
      </blockquote>
      <figcaption className={cx('mt-3 flex items-center gap-2', center && 'justify-center')}>
        <span className="text-sm font-semibold text-forest">{p.display}</span>
        <span className="text-xs text-ink-faint">· {TRANSLATION.short}</span>
        {showSave && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggle(refId);
            }}
            aria-label={saved ? 'Remove from saved Scripture' : 'Save this passage'}
            className={cx('ml-auto grid h-9 w-9 place-items-center rounded-full transition', saved ? 'text-gold' : 'text-ink-faint hover:bg-surface-2')}
          >
            {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>
        )}
      </figcaption>
    </figure>
  );
}

export function ProgressRing({
  value,
  size = 168,
  stroke = 12,
  children,
  label,
}: {
  value: number;
  size?: number;
  stroke?: number;
  children?: ReactNode;
  label?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, value));
  const id = `ring-${size}-${stroke}`;
  return (
    <div className="relative" style={{ width: size, height: size }} role="img" aria-label={label ?? `${Math.round(v * 100)} percent`}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8fb89a" />
            <stop offset="55%" stopColor="#4f8d68" />
            <stop offset="100%" stopColor="#d9b15e" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line-strong)" strokeWidth={stroke} />
        {/* tick marks */}
        {Array.from({ length: 30 }).map((_, i) => {
          const a = (i / 30) * Math.PI * 2;
          const r1 = r - stroke / 2 - 5;
          const r2 = r1 - 3;
          return (
            <line
              key={i}
              x1={size / 2 + Math.cos(a) * r1}
              y1={size / 2 + Math.sin(a) * r1}
              x2={size / 2 + Math.cos(a) * r2}
              y2={size / 2 + Math.sin(a) * r2}
              stroke="var(--line-strong)"
              strokeWidth={1}
            />
          );
        })}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - v) }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
}

export function Sheet({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: ReactNode; title?: string }) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative max-h-[88dvh] w-full max-w-xl overflow-y-auto rounded-t-[2rem] border border-line bg-surface p-5 pb-8 shadow-lift sm:rounded-[2rem]"
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line-strong sm:hidden" />
            {title && (
              <div className="mb-3 flex items-center justify-between">
                <h3 className="display text-2xl">{title}</h3>
                <button onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full text-ink-faint hover:bg-surface-2">
                  <X size={18} />
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

let toastSet: ((m: string | null) => void) | null = null;
export function toast(message: string) {
  toastSet?.(message);
}
export function ToastHost() {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    toastSet = setMsg;
    return () => {
      toastSet = null;
    };
  }, []);
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 2600);
    return () => clearTimeout(t);
  }, [msg]);
  return (
    <AnimatePresence>
      {msg && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="fixed inset-x-0 bottom-28 z-[60] mx-auto w-fit max-w-[90vw] rounded-full bg-forest px-5 py-3 text-sm font-medium text-on-forest shadow-lift"
          role="status"
        >
          {msg}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cx('relative h-7 w-12 shrink-0 rounded-full transition', checked ? 'bg-forest' : 'bg-line-strong')}
    >
      <span className={cx('absolute top-1 h-5 w-5 rounded-full bg-surface shadow transition-all', checked ? 'left-6' : 'left-1')} />
    </button>
  );
}

export function Empty({ icon, title, text, action }: { icon: ReactNode; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="card card-pad flex flex-col items-center py-10 text-center">
      <div className="mb-3 grid h-14 w-14 place-items-center rounded-full bg-sage-soft text-forest">{icon}</div>
      <p className="display text-xl">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-ink-soft">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Paragraphs({ text, className }: { text: string; className?: string }) {
  return (
    <div className={cx('space-y-3', className)}>
      {text.split(/\n\n+/).map((para, i) => (
        <p key={i} className="whitespace-pre-line">
          {para}
        </p>
      ))}
    </div>
  );
}
