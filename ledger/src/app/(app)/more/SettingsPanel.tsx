"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Lock, Moon, Sun, Monitor, Trash2, KeyRound, Timer } from "lucide-react";
import { Card } from "@/components/ui";
import { api } from "@/lib/api";

type Theme = "system" | "light" | "dark";

const readTheme = (): Theme => {
  try { return (localStorage.getItem("theme") as Theme) || "system"; } catch { return "system"; }
};
const subscribeTheme = (cb: () => void) => {
  window.addEventListener("themechange", cb);
  return () => window.removeEventListener("themechange", cb);
};

export function SettingsPanel() {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => "system" as Theme);
  const [idle, setIdle] = useState(5);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api<{ idleLockMinutes: number }>("/api/settings").then((s) => setIdle(s.idleLockMinutes));
  }, []);

  const applyTheme = (t: Theme) => {
    try { localStorage.setItem("theme", t); } catch {}
    window.dispatchEvent(new Event("themechange"));
    const dark = t === "dark" || (t === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
  };

  const saveIdle = async (m: number) => {
    setIdle(m);
    await api("/api/settings", { method: "PATCH", json: { idleLockMinutes: m } });
    setMsg(`Auto-lock set to ${m} min`);
  };

  const lockNow = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.replace("/lock");
  };

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="mb-3 font-semibold">Appearance</h2>
        <div className="grid grid-cols-3 gap-2">
          {([["system", Monitor, "Auto"], ["light", Sun, "Light"], ["dark", Moon, "Dark"]] as const).map(([t, Icon, label]) => (
            <button key={t} onClick={() => applyTheme(t)}
              className={`flex flex-col items-center gap-1 rounded-xl py-3 text-sm ring-1 ${theme === t ? "bg-accent-soft font-semibold text-accent ring-accent" : "ring-line"}`}>
              <Icon size={20} />{label}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 flex items-center gap-2 font-semibold"><Timer size={18} /> Security</h2>
        <label className="flex items-center justify-between text-sm">
          Auto-lock after
          <select value={idle} onChange={(e) => saveIdle(Number(e.target.value))}
            className="rounded-lg bg-bg px-3 py-2 ring-1 ring-line">
            {[1, 2, 5, 10, 15, 30].map((m) => <option key={m} value={m}>{m} min</option>)}
          </select>
        </label>
        <ChangePin onDone={setMsg} />
        <button onClick={lockNow} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-bg py-3 font-medium ring-1 ring-line">
          <Lock size={18} /> Lock now
        </button>
        {msg && <p className="mt-3 text-center text-sm text-good">{msg}</p>}
      </Card>

      <DeleteAll />
      <p className="pb-4 text-center text-xs text-muted">Ledger · your data stays on your own server</p>
    </div>
  );
}

function ChangePin({ onDone }: { onDone: (m: string) => void }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [err, setErr] = useState("");
  if (!open) return (
    <button onClick={() => setOpen(true)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-bg py-3 font-medium ring-1 ring-line">
      <KeyRound size={18} /> Change PIN
    </button>
  );
  return (
    <form className="mt-3 space-y-2" onSubmit={async (e) => {
      e.preventDefault(); setErr("");
      try {
        await api("/api/settings", { method: "PATCH", json: { changePin: { current, next } } });
        setOpen(false); setCurrent(""); setNext(""); onDone("PIN changed");
      } catch (e) { setErr((e as Error).message); }
    }}>
      <PinInput placeholder="Current PIN" value={current} onChange={setCurrent} />
      <PinInput placeholder="New PIN (6–12 digits)" value={next} onChange={setNext} />
      {err && <p className="text-sm text-bad">{err}</p>}
      <button className="w-full rounded-xl bg-accent py-3 font-semibold text-white dark:text-zinc-900">Save new PIN</button>
    </form>
  );
}

function PinInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <input type="password" inputMode="numeric" pattern="\d*" autoComplete="off" maxLength={12}
      value={value} onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))} placeholder={placeholder}
      className="w-full rounded-xl bg-bg px-4 py-3 ring-1 ring-line outline-none focus:ring-accent" />
  );
}

function DeleteAll() {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <Card className="ring-bad/40">
      <h2 className="flex items-center gap-2 font-semibold text-bad"><Trash2 size={18} /> Danger zone</h2>
      <p className="mt-1 text-sm text-muted">
        Disconnects every bank from Plaid and permanently deletes all transactions, budgets, shifts, goals and your PIN. This can&apos;t be undone.
      </p>
      {!open ? (
        <button onClick={() => setOpen(true)} className="mt-3 w-full rounded-xl py-3 font-semibold text-bad ring-1 ring-bad/50">
          Disconnect bank &amp; delete all data
        </button>
      ) : (
        <form className="mt-3 space-y-2" onSubmit={async (e) => {
          e.preventDefault(); setErr(""); setBusy(true);
          try {
            await api("/api/data/delete-all", { method: "POST", json: { confirm, pin } });
            try { localStorage.clear(); } catch {}
            window.location.replace("/lock");
          } catch (e) { setErr((e as Error).message); setBusy(false); }
        }}>
          <input value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder='Type DELETE'
            autoCapitalize="characters" className="w-full rounded-xl bg-bg px-4 py-3 ring-1 ring-line outline-none" />
          <PinInput placeholder="Your PIN" value={pin} onChange={setPin} />
          {err && <p className="text-sm text-bad">{err}</p>}
          <div className="flex gap-2">
            <button type="button" onClick={() => setOpen(false)} className="flex-1 rounded-xl py-3 ring-1 ring-line">Cancel</button>
            <button disabled={confirm !== "DELETE" || pin.length < 4 || busy}
              className="flex-1 rounded-xl bg-bad py-3 font-semibold text-white disabled:opacity-40">
              {busy ? "Deleting…" : "Delete everything"}
            </button>
          </div>
        </form>
      )}
    </Card>
  );
}
