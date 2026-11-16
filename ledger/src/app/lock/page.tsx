"use client";
import { useCallback, useEffect, useState } from "react";
import { Delete, Lock } from "lucide-react";
import { api } from "@/lib/api";

type Status = { hasPin: boolean; unlocked: boolean; lockedUntil: string | null };
type Mode = "loading" | "enter" | "create" | "confirm";

export default function LockPage() {
  const [mode, setMode] = useState<Mode>("loading");
  const [pin, setPin] = useState("");
  const [firstPin, setFirstPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<Status>("/api/auth/status").then((s) => {
      if (s.unlocked) window.location.replace("/");
      else setMode(s.hasPin ? "enter" : "create");
      if (s.lockedUntil) setError("Too many attempts. Try again later.");
    });
  }, []);

  const submit = useCallback(async (value: string) => {
    setError("");
    if (mode === "create") {
      if (value.length < 6) return setError("Use at least 6 digits");
      setFirstPin(value); setPin(""); setMode("confirm");
      return;
    }
    setBusy(true);
    try {
      if (mode === "confirm") {
        if (value !== firstPin) { setPin(""); setMode("create"); setFirstPin(""); return setError("PINs didn't match. Try again."); }
        await api("/api/auth/setup", { method: "POST", json: { pin: value } });
      } else {
        await api("/api/auth/login", { method: "POST", json: { pin: value } });
      }
      window.location.replace("/");
    } catch (e) {
      const err = e as Error & { data?: { remaining?: number } };
      setError(err.data?.remaining ? `${err.message} · ${err.data.remaining} tries left` : err.message);
      setPin("");
      navigator.vibrate?.(200);
    } finally {
      setBusy(false);
    }
  }, [mode, firstPin]);

  const press = (d: string) => { if (!busy && pin.length < 12) setPin((p) => p + d); };

  // Hardware keyboard support (handy on a computer)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^\d$/.test(e.key)) press(e.key);
      else if (e.key === "Backspace") setPin((p) => p.slice(0, -1));
      else if (e.key === "Enter" && pin.length >= 4) submit(pin);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const title = { loading: "", enter: "Enter your PIN", create: "Create a PIN", confirm: "Confirm your PIN" }[mode];
  const hint = mode === "create" ? "6–12 digits. You'll use this to unlock Ledger." : mode === "confirm" ? "Type it once more" : "Ledger locks itself when you're away";

  return (
    <main className="pt-safe pb-safe mx-auto flex min-h-dvh max-w-sm flex-col items-center justify-between px-6">
      <div className="mt-16 flex flex-col items-center text-center">
        <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-accent text-white shadow-lg dark:text-zinc-900">
          <Lock size={28} />
        </div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-1 text-sm text-muted">{hint}</p>
        <div className="mt-8 flex h-4 gap-3" aria-label={`${pin.length} digits entered`}>
          {Array.from({ length: Math.max(6, pin.length) }).map((_, i) => (
            <span key={i} className={`h-3.5 w-3.5 rounded-full border-2 border-ink/40 transition ${i < pin.length ? "scale-110 bg-ink" : ""}`} />
          ))}
        </div>
        <p role="alert" className="mt-5 h-5 text-sm font-medium text-bad">{error}</p>
      </div>

      <div className="mb-6 grid w-full grid-cols-3 gap-4">
        {["1","2","3","4","5","6","7","8","9"].map((d) => <Key key={d} onClick={() => press(d)}>{d}</Key>)}
        <Key onClick={() => setPin((p) => p.slice(0, -1))} aria-label="Delete"><Delete size={22} /></Key>
        <Key onClick={() => press("0")}>0</Key>
        <button
          disabled={pin.length < 4 || busy}
          onClick={() => submit(pin)}
          className="h-16 rounded-full bg-accent text-base font-semibold text-white disabled:opacity-30 dark:text-zinc-900"
        >
          {busy ? "…" : mode === "create" ? "Next" : "OK"}
        </button>
      </div>
    </main>
  );
}

function Key(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="grid h-16 place-items-center rounded-full bg-card text-2xl font-medium shadow-sm ring-1 ring-line active:scale-95 active:bg-line"
    />
  );
}
