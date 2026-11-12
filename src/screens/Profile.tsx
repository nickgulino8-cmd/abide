import { useEffect, useRef, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Bell, Shield, Target, Palette, Info, CalendarPlus, Download, Upload, Trash2, Lock, Check, Moon, Sun, Monitor, Wifi, HardDrive, Send } from 'lucide-react';
import Companion from '@/components/Companion';
import { Card, Page, RowLink, SectionHeader, Sheet, Toggle, TopBar, cx, toast } from '@/components/ui';
import { exportableState, useStore, type ScripturePref, type ThemePref } from '@/lib/store';
import { useProgress } from '@/lib/hooks';
import { REMINDER_COPY, REMINDER_KEYS, buildICS, download, notificationsSupported, requestPermission, showNotification } from '@/lib/reminders';
import { hashPin, makeBackup, readBackup, type BackupFile } from '@/lib/security';
import { GOALS } from './Onboarding';
import { TOPIC_LABELS, type Topic } from '@/content/devotionals';
import { TRANSLATION } from '@/lib/bible';
import { formatShort } from '@/lib/dates';

export default function Profile() {
  return (
    <Routes>
      <Route index element={<ProfileHome />} />
      <Route path="reminders" element={<Reminders />} />
      <Route path="privacy" element={<Privacy />} />
      <Route path="goals" element={<Goals />} />
      <Route path="appearance" element={<Appearance />} />
      <Route path="about" element={<About />} />
    </Routes>
  );
}

function ProfileHome() {
  const profile = useStore((s) => s.profile);
  const companion = useStore((s) => s.companion);
  const { growth, flourishes, mood, stats } = useProgress();
  return (
    <Page>
      <header className="px-1 pt-6">
        <p className="eyebrow">Profile</p>
        <h1 className="display mt-2 text-[2.4rem] leading-tight">{profile.name || 'Your profile'}</h1>
        <p className="text-ink-soft">Walking with Abide since {formatShort(profile.createdAt)}</p>
      </header>
      <Card className="mt-5 flex items-center gap-3 !p-3">
        <div className="w-28 shrink-0">
          <Companion stage={growth.stage.n} mood={mood} flourishes={flourishes} height={100} animated={false} />
        </div>
        <div>
          <p className="font-medium">{companion.name}</p>
          <p className="text-sm text-ink-soft">
            {growth.stage.name} · {stats.totalCommitted} faithful days
          </p>
        </div>
      </Card>
      <SectionHeader title="Settings" />
      <div className="card divide-y divide-line !rounded-3xl px-4">
        <RowLink to="/profile/goals" icon={<Target size={19} />} title="Goals & preferences" subtitle="Your focus and Scripture reading" />
        <RowLink to="/profile/reminders" icon={<Bell size={19} />} title="Reminders" subtitle="Morning, evening, check-in" />
        <RowLink to="/profile/appearance" icon={<Palette size={19} />} title="Appearance" subtitle="Light, dark, text size" />
        <RowLink to="/profile/privacy" icon={<Shield size={19} />} title="Privacy & data" subtitle="App lock, backup, delete" />
        <RowLink to="/profile/about" icon={<Info size={19} />} title="About Abide" subtitle="Sources, translation, version" />
      </div>
      <p className="serif mt-10 text-center text-[1.15rem] italic text-ink-faint">“Abide in me, and I in you.” — John 15:4</p>
    </Page>
  );
}

function Reminders() {
  const reminders = useStore((s) => s.reminders);
  const setReminders = useStore((s) => s.setReminders);
  const [perm, setPerm] = useState<string>(notificationsSupported() ? Notification.permission : 'unsupported');
  return (
    <Page>
      <TopBar title="Reminders" back="/profile" />
      <p className="px-1 text-ink-soft">All reminders are optional. Choose the ones that help you.</p>

      <Card className="mt-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-medium">Notifications on this device</p>
            <p className="text-sm text-ink-soft">
              {perm === 'granted' ? 'Allowed' : perm === 'denied' ? 'Blocked in your browser settings' : perm === 'unsupported' ? 'Not supported by this browser' : 'Not yet allowed'}
            </p>
          </div>
          {perm === 'granted' ? (
            <button
              className="btn-soft !py-2 text-sm"
              onClick={async () => {
                const ok = await showNotification('morning');
                toast(ok ? 'Test notification sent' : 'Could not show a notification');
              }}
            >
              <Send size={15} /> Test
            </button>
          ) : (
            perm !== 'unsupported' &&
            perm !== 'denied' && (
              <button className="btn-primary !py-2 text-sm" onClick={async () => setPerm(await requestPermission())}>
                Allow
              </button>
            )
          )}
        </div>
      </Card>

      <div className="card mt-4 divide-y divide-line !rounded-3xl px-4">
        {REMINDER_KEYS.map((k) => {
          const r = reminders[k];
          return (
            <div key={k} className="flex items-center gap-3 py-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium">{REMINDER_COPY[k].label}</p>
                <p className="truncate text-sm text-ink-soft">“{REMINDER_COPY[k].title}. {REMINDER_COPY[k].body}”</p>
              </div>
              <input
                type="time"
                aria-label={`${REMINDER_COPY[k].label} time`}
                value={r.time}
                disabled={!r.on}
                onChange={(e) => setReminders({ [k]: { ...r, time: e.target.value } })}
                className="rounded-xl border border-line-strong bg-surface-2 px-2 py-1.5 text-sm disabled:opacity-40"
              />
              <Toggle label={REMINDER_COPY[k].label} checked={r.on} onChange={(on) => setReminders({ [k]: { ...r, on } })} />
            </div>
          );
        })}
      </div>

      <SectionHeader title="Reliable reminders" />
      <Card>
        <p className="text-sm leading-relaxed text-ink-soft">
          Web apps can only show notifications while Abide is open or was recently used — browsers don’t let a free, offline app wake itself at a set time. For reminders that arrive even when Abide is closed, add them to your phone’s calendar. The calendar file contains daily repeating alarms and works fully offline, with no account.
        </p>
        <button
          className="btn-gold mt-4 w-full"
          onClick={() => {
            download('abide-reminders.ics', buildICS(reminders), 'text/calendar');
            toast('Calendar file downloaded — open it to add your reminders');
          }}
        >
          <CalendarPlus size={17} /> Add reminders to my calendar
        </button>
      </Card>
    </Page>
  );
}

function Privacy() {
  const lock = useStore((s) => s.lock);
  const setLock = useStore((s) => s.setLock);
  const clearChat = useStore((s) => s.clearChat);
  const resetAll = useStore((s) => s.resetAll);
  const importState = useStore((s) => s.importState);
  const [pinOpen, setPinOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [pin2, setPin2] = useState('');
  const [exportOpen, setExportOpen] = useState(false);
  const [pass, setPass] = useState('');
  const [importFile, setImportFile] = useState<BackupFile | null>(null);
  const [importPass, setImportPass] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [usage, setUsage] = useState<string>('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    navigator.storage?.estimate?.().then((e) => e.usage !== undefined && setUsage(`${(e.usage / 1024 / 1024).toFixed(1)} MB used on this device (including the offline Bible)`));
  }, []);

  return (
    <Page>
      <TopBar title="Privacy & data" back="/profile" />
      <Card className="!border-forest/30 !bg-sage-soft/50">
        <p className="display text-2xl">Your faith is private.</p>
        <ul className="mt-3 space-y-2 text-[0.95rem]">
          {['No account required — ever', 'No advertisements', 'No analytics or tracking', 'No selling or sharing of data', 'No public profiles or social comparison', 'Everything is stored only on this device'].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <Check size={16} className="text-forest" /> {t}
            </li>
          ))}
        </ul>
        {usage && (
          <p className="mt-4 flex items-center gap-2 text-xs text-ink-soft">
            <HardDrive size={13} /> {usage}
          </p>
        )}
      </Card>

      <SectionHeader title="App lock" />
      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-medium">Require a passcode</p>
            <p className="text-sm text-ink-soft">Keeps your journal and check-ins away from casual eyes on a shared device.</p>
          </div>
          <Toggle
            label="App lock"
            checked={lock.enabled}
            onChange={(on) => {
              if (on) setPinOpen(true);
              else {
                setLock({ enabled: false });
                toast('App lock turned off');
              }
            }}
          />
        </div>
        <p className="mt-3 text-xs text-ink-faint">The passcode is stored only as a salted hash. It deters casual access; anyone with full access to your unlocked device and browser tools could still reach local data.</p>
      </Card>

      <SectionHeader title="Backup" />
      <Card>
        <p className="text-sm text-ink-soft">Save a backup file you control — to your files, a USB drive, or your own cloud storage. Protect it with a passphrase to encrypt it (AES-256). Abide never uploads anything.</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button className="btn-primary" onClick={() => setExportOpen(true)}>
            <Download size={16} /> Export
          </button>
          <button className="btn-ghost" onClick={() => fileRef.current?.click()}>
            <Upload size={16} /> Restore
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json,.abide"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            e.target.value = '';
            if (!f) return;
            try {
              const parsed = JSON.parse(await f.text()) as BackupFile;
              if (parsed.app !== 'abide') throw new Error();
              setImportFile(parsed);
            } catch {
              toast('That file is not an Abide backup');
            }
          }}
        />
      </Card>

      <SectionHeader title="Delete data" />
      <Card>
        <button
          className="btn-soft w-full"
          onClick={() => {
            clearChat();
            toast('Companion conversation cleared');
          }}
        >
          Clear Abide Companion conversation
        </button>
        <button className="btn-ghost mt-2 w-full !border-rose/40 text-rose" onClick={() => setDeleteOpen(true)}>
          <Trash2 size={16} /> Delete all my data
        </button>
      </Card>

      <Sheet open={pinOpen} onClose={() => setPinOpen(false)} title="Set a passcode">
        <p className="text-sm text-ink-soft">4–8 digits.</p>
        <input className="field mt-3 text-center text-2xl tracking-[0.5em]" inputMode="numeric" type="password" maxLength={8} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} placeholder="••••" aria-label="Passcode" />
        <input className="field mt-2 text-center text-2xl tracking-[0.5em]" inputMode="numeric" type="password" maxLength={8} value={pin2} onChange={(e) => setPin2(e.target.value.replace(/\D/g, ''))} placeholder="confirm" aria-label="Confirm passcode" />
        <button
          className="btn-primary mt-4 w-full"
          disabled={pin.length < 4 || pin !== pin2}
          onClick={async () => {
            const h = await hashPin(pin);
            setLock({ enabled: true, ...h });
            setPin('');
            setPin2('');
            setPinOpen(false);
            toast('App lock is on');
          }}
        >
          <Lock size={16} /> Turn on app lock
        </button>
      </Sheet>

      <Sheet open={exportOpen} onClose={() => setExportOpen(false)} title="Export a backup">
        <label className="block">
          <span className="mb-2 block text-sm text-ink-soft">Passphrase (recommended)</span>
          <input className="field" type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Leave empty for an unencrypted file" />
        </label>
        <p className="mt-2 text-xs text-ink-faint">If you forget the passphrase, the backup cannot be opened. There is no recovery.</p>
        <button
          className="btn-primary mt-4 w-full"
          onClick={async () => {
            const file = await makeBackup(exportableState(), pass || undefined);
            download(`abide-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(file), 'application/json');
            setPass('');
            setExportOpen(false);
            toast(file.encrypted ? 'Encrypted backup saved' : 'Backup saved');
          }}
        >
          <Download size={16} /> Download backup
        </button>
      </Sheet>

      <Sheet open={!!importFile} onClose={() => setImportFile(null)} title="Restore backup">
        <p className="text-sm text-ink-soft">
          From {importFile && formatShort(importFile.createdAt.slice(0, 10))}. Restoring replaces the data currently on this device.
        </p>
        {importFile?.encrypted && <input className="field mt-3" type="password" placeholder="Backup passphrase" value={importPass} onChange={(e) => setImportPass(e.target.value)} />}
        <button
          className="btn-primary mt-4 w-full"
          onClick={async () => {
            try {
              const data = await readBackup(importFile!, importPass || undefined);
              importState(data);
              setImportFile(null);
              setImportPass('');
              toast('Backup restored');
            } catch (err) {
              toast((err as Error).message);
            }
          }}
        >
          Restore
        </button>
      </Sheet>

      <Sheet open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete everything?">
        <p className="text-ink-soft">This permanently erases your journal, check-ins, saved Scripture, companion progress and settings from this device. Consider exporting a backup first.</p>
        <input className="field mt-4" placeholder='Type "DELETE" to confirm' value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
        <button
          className="btn-primary mt-3 w-full !bg-rose"
          disabled={confirmText !== 'DELETE'}
          onClick={async () => {
            resetAll();
            await useStore.persist.clearStorage();
            try {
              localStorage.clear();
              sessionStorage.clear();
            } catch {
              /* ignore */
            }
            location.href = '/';
          }}
        >
          Permanently delete
        </button>
      </Sheet>
    </Page>
  );
}

function Goals() {
  const profile = useStore((s) => s.profile);
  const update = useStore((s) => s.updateProfile);
  const prefs: { id: ScripturePref; label: string }[] = [
    { id: 'mixed', label: 'A bit of everything' },
    { id: 'gospels', label: 'The Gospels' },
    { id: 'psalms', label: 'Psalms & Wisdom' },
    { id: 'letters', label: 'The Letters' },
    { id: 'prophets', label: 'Prophets & Old Testament' },
  ];
  return (
    <Page>
      <TopBar title="Goals & preferences" back="/profile" />
      <label className="block">
        <span className="mb-2 block px-1 text-sm text-ink-soft">Your name (optional)</span>
        <input className="field" value={profile.name} onChange={(e) => update({ name: e.target.value })} maxLength={40} />
      </label>
      <SectionHeader title="What you’re growing in" />
      <div className="flex flex-wrap gap-2">
        {GOALS.map((g) => {
          const on = profile.goals.includes(g.id);
          return (
            <button key={g.id} onClick={() => update({ goals: on ? profile.goals.filter((x) => x !== g.id) : [...profile.goals, g.id] })} className={cx('chip', on && 'chip-active')}>
              {on && <Check size={14} />} {g.label}
            </button>
          );
        })}
      </div>
      <input className="field mt-3" placeholder="In your own words (optional)" value={profile.customGoal} onChange={(e) => update({ customGoal: e.target.value })} maxLength={120} />
      <SectionHeader title="What a faithful day means to you" />
      <input className="field" placeholder="e.g. I kept my commitment and prayed" value={profile.progressMeaning} onChange={(e) => update({ progressMeaning: e.target.value })} maxLength={120} />
      <SectionHeader title="Current focus" />
      <div className="flex flex-wrap gap-2">
        {(Object.keys(TOPIC_LABELS) as Topic[]).map((t) => (
          <button key={t} onClick={() => update({ focus: t })} className={cx('chip', profile.focus === t && 'chip-active')}>
            {TOPIC_LABELS[t]}
          </button>
        ))}
      </div>
      <SectionHeader title="Daily Scripture" />
      <div className="space-y-2">
        {prefs.map((p) => (
          <button key={p.id} onClick={() => update({ scripturePref: p.id })} className={cx('card flex w-full items-center justify-between !rounded-2xl px-4 py-3 text-left', profile.scripturePref === p.id && '!border-forest')}>
            {p.label}
            {profile.scripturePref === p.id && <Check size={17} className="text-forest" />}
          </button>
        ))}
      </div>
      <p className="mt-3 px-1 text-xs text-ink-faint">Changes take effect from today’s devotional.</p>
    </Page>
  );
}

function Appearance() {
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  const scale = useStore((s) => s.textScale);
  const setScale = useStore((s) => s.setTextScale);
  const opts: { id: ThemePref; label: string; icon: React.ReactNode }[] = [
    { id: 'system', label: 'System', icon: <Monitor size={18} /> },
    { id: 'light', label: 'Light', icon: <Sun size={18} /> },
    { id: 'dark', label: 'Dark', icon: <Moon size={18} /> },
  ];
  return (
    <Page>
      <TopBar title="Appearance" back="/profile" />
      <div className="grid grid-cols-3 gap-2">
        {opts.map((o) => (
          <button key={o.id} onClick={() => setTheme(o.id)} className={cx('card flex flex-col items-center gap-2 !rounded-2xl py-5 text-sm', theme === o.id && '!border-forest ring-2 ring-forest/20')}>
            {o.icon} {o.label}
          </button>
        ))}
      </div>
      <SectionHeader title="Text size" />
      <Card>
        <input type="range" min={0.9} max={1.25} step={0.05} value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-full accent-[var(--forest)]" aria-label="Text size" />
        <p className="scripture mt-4">Abide in me: and I in you.</p>
      </Card>
    </Page>
  );
}

function About() {
  const online = typeof navigator !== 'undefined' ? navigator.onLine : true;
  return (
    <Page>
      <TopBar title="About Abide" back="/profile" />
      <div className="py-6 text-center">
        <p className="display gold-text text-5xl tracking-[0.25em]">ABIDE</p>
        <p className="serif mt-3 text-[1.3rem] italic text-ink-soft">Don’t just break a habit. Build a relationship with God.</p>
        <p className="mt-2 text-xs text-ink-faint">Version 1.0.0</p>
      </div>
      <Card>
        <p className="font-medium">Scripture</p>
        <p className="mt-1 text-sm text-ink-soft">
          {TRANSLATION.name}. Public domain. Every passage in Abide is taken word for word from this translation and verified at build time — nothing is paraphrased or generated. {TRANSLATION.note}
        </p>
      </Card>
      <Card className="mt-3">
        <p className="font-medium">Teaching & prayers</p>
        <p className="mt-1 text-sm text-ink-soft">
          Explanations follow the Catechism of the Catholic Church, cited by paragraph. Traditional prayers are given in their common English forms; the Nicene Creed uses the English translation of the Roman Missal © 2010 ICEL. Reflections and devotionals are original to Abide and are not official Church documents.
        </p>
      </Card>
      <Card className="mt-3">
        <p className="font-medium">Abide Companion</p>
        <p className="mt-1 text-sm text-ink-soft">Runs entirely on your device from a curated library. No AI service, no cost, no data leaves your phone. It does not replace a priest, confessor, spiritual director or counsellor.</p>
      </Card>
      <Card className="mt-3">
        <p className="flex items-center gap-2 font-medium">
          <Wifi size={16} /> Works offline
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          After your first visit, Abide — including the full Bible — is saved on this device and works without an internet connection. You are currently {online ? 'online' : 'offline'}.
        </p>
      </Card>
      <p className="serif mt-10 text-center text-[1.15rem] italic text-ink-faint">“Progress is not perfection. It is choosing to return to God, again and again.”</p>
    </Page>
  );
}
