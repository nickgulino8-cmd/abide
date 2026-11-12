// Reminders. A PWA cannot schedule notifications for when it is fully closed without a push
// server (a paid/hosted dependency we deliberately avoid). So Abide offers two free options:
//   1. In-app notifications delivered while Abide is open or recently in the background.
//   2. A calendar file (.ics) with daily repeating alarms — your phone's calendar delivers these
//      reliably even when Abide is closed, fully offline, with no account.
import type { Reminders, ReminderSetting } from './store';
import { useStore } from './store';
import { dateKey } from './dates';

export type ReminderKey = 'morning' | 'afternoon' | 'evening' | 'checkin' | 'prayer';

export const REMINDER_COPY: Record<ReminderKey, { label: string; title: string; body: string; url: string }> = {
  morning: { label: 'Morning devotional', title: 'Start your day with God', body: "Today's Scripture is waiting.", url: '/devotional' },
  afternoon: { label: 'Afternoon pause', title: 'Pause, pray, refocus', body: 'Take a moment to pause, pray, and refocus.', url: '/faith/prayers' },
  evening: { label: 'Evening prayer', title: 'Reflect and give thanks', body: 'Reflect on your day and give thanks.', url: '/faith/prayers/examen' },
  checkin: { label: 'Daily check-in', title: 'How did today go?', body: 'A quiet moment to check in with your journey.', url: '/checkin' },
  prayer: { label: 'Prayer reminder', title: 'Time to pray', body: 'Your chosen prayer time has arrived.', url: '/faith/prayers' },
};

export const REMINDER_KEYS = Object.keys(REMINDER_COPY) as ReminderKey[];

export function notificationsSupported() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export async function requestPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!notificationsSupported()) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  return Notification.requestPermission();
}

export async function showNotification(key: ReminderKey) {
  const c = REMINDER_COPY[key];
  if (!notificationsSupported() || Notification.permission !== 'granted') return false;
  const opts: NotificationOptions = { body: c.body, icon: '/pwa-192.png', badge: '/pwa-192.png', tag: `abide-${key}`, data: { url: c.url } };
  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg) await reg.showNotification(c.title, opts);
    else new Notification(c.title, opts);
    return true;
  } catch {
    return false;
  }
}

const minutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** Checks due reminders; fires each at most once per day, within two hours of its time. */
export function checkReminders(now = new Date()) {
  const { reminders, setReminders } = useStore.getState();
  const today = dateKey(now);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const fired = { ...reminders.lastFired };
  let changed = false;
  for (const key of REMINDER_KEYS) {
    const r = reminders[key] as ReminderSetting;
    if (!r.on || fired[key] === today) continue;
    const due = minutes(r.time);
    if (nowMin >= due && nowMin - due <= 120) {
      fired[key] = today;
      changed = true;
      void showNotification(key);
    }
  }
  if (changed) setReminders({ lastFired: fired });
}

export function startReminderLoop(): () => void {
  checkReminders();
  const id = setInterval(() => checkReminders(), 30_000);
  const vis = () => document.visibilityState === 'visible' && checkReminders();
  document.addEventListener('visibilitychange', vis);
  return () => {
    clearInterval(id);
    document.removeEventListener('visibilitychange', vis);
  };
}

/** Builds an .ics calendar with a daily repeating event + alarm for each enabled reminder. */
export function buildICS(reminders: Reminders, origin = location.origin): string {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  const start = dateKey().replace(/-/g, '');
  const esc = (s: string) => s.replace(/[,;\\]/g, (m) => '\\' + m);
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Abide//Reminders//EN', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:Abide'];
  for (const key of REMINDER_KEYS) {
    const r = reminders[key];
    if (!r.on) continue;
    const c = REMINDER_COPY[key];
    const [h, m] = r.time.split(':');
    lines.push(
      'BEGIN:VEVENT',
      `UID:abide-${key}@abide.local`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${start}T${h}${m}00`,
      'DURATION:PT10M',
      'RRULE:FREQ=DAILY',
      `SUMMARY:${esc(c.title)}`,
      `DESCRIPTION:${esc(c.body)} Open Abide: ${origin}${c.url}`,
      `URL:${origin}${c.url}`,
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${esc(c.title)}`,
      'TRIGGER:PT0M',
      'END:VALARM',
      'END:VEVENT',
    );
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function download(filename: string, content: string | Blob, type = 'text/plain') {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
