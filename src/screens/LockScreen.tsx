import { useState } from 'react';
import { Lock, Delete } from 'lucide-react';
import { useStore } from '@/lib/store';
import { verifyPin } from '@/lib/security';
import { cx } from '@/components/ui';

export default function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const lock = useStore((s) => s.lock);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const tryPin = async (p: string) => {
    if (p.length < 4 || !lock.salt || !lock.hash) return;
    setBusy(true);
    const ok = await verifyPin(p, lock.salt, lock.hash);
    setBusy(false);
    if (ok) onUnlock();
    else if (p.length >= 8) {
      setError(true);
      setPin('');
    }
  };

  const press = (d: string) => {
    if (busy) return;
    setError(false);
    const next = (pin + d).slice(0, 8);
    setPin(next);
    void tryPin(next);
  };

  return (
    <div className="hero-gradient flex min-h-dvh flex-col items-center justify-center px-6">
      <Lock className="text-gold" size={28} />
      <p className="display mt-4 text-4xl tracking-[0.2em]">ABIDE</p>
      <p className="mt-2 text-ink-soft">Enter your passcode</p>
      <div className={cx('mt-6 flex h-4 gap-3', error && 'animate-[shake_0.3s]')}>
        {Array.from({ length: Math.max(4, pin.length) }).map((_, i) => (
          <span key={i} className={cx('h-3.5 w-3.5 rounded-full border border-forest', i < pin.length && 'bg-forest')} />
        ))}
      </div>
      {error && <p className="mt-3 text-sm text-rose">That passcode didn’t match.</p>}
      <div className="mt-8 grid grid-cols-3 gap-4">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((k) =>
          k === '' ? (
            <span key="blank" />
          ) : (
            <button
              key={k}
              aria-label={k === 'del' ? 'Delete' : k}
              onClick={() => (k === 'del' ? setPin((p) => p.slice(0, -1)) : press(k))}
              className="grid h-16 w-16 place-items-center rounded-full bg-surface/80 text-2xl font-medium shadow-soft transition active:scale-95"
            >
              {k === 'del' ? <Delete size={20} /> : k}
            </button>
          ),
        )}
      </div>
      <button
        className="mt-6 text-sm text-ink-faint"
        onClick={() => {
          setError(true);
          setPin('');
        }}
      >
        Clear
      </button>
      <p className="mt-6 max-w-xs text-center text-xs text-ink-faint">Forgot your passcode? Without it, the app cannot be unlocked. You can clear this site’s data in your browser settings to start over (this erases your data).</p>
    </div>
  );
}
