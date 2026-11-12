import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import { get as idbGet, set as idbSet, del as idbDel } from 'idb-keyval';
import { dateKey } from './dates';
import type { Topic } from '@/content/devotionals';

// ───────────────────────── Types ─────────────────────────

export type CheckStatus = 'committed' | 'setback' | 'reflect';
export type ScripturePref = 'mixed' | 'gospels' | 'psalms' | 'letters' | 'prophets';
export type ThemePref = 'system' | 'light' | 'dark';

export interface Reflection {
  challenge: string;
  help: string;
  positive: string;
}

export interface CheckIn {
  date: string;
  status: CheckStatus;
  at: number;
  note?: string;
  reflection?: Reflection;
}

export interface Journey {
  id: string;
  startedAt: string;
  endedAt?: string;
}

export type JournalType = 'reflection' | 'gratitude' | 'intention' | 'scripture' | 'milestone' | 'free';

export interface JournalEntry {
  id: string;
  type: JournalType;
  date: string;
  title?: string;
  body: string;
  prompt?: string;
  ref?: string;
  answered?: boolean; // prayer intentions
  createdAt: number;
  updatedAt: number;
}

export interface SavedPassage {
  ref: string;
  text?: string; // stored for verses saved from the Bible reader
  display?: string;
  savedAt: number;
  note?: string;
  favorite?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'companion';
  text: string;
  answerId?: string;
  at: number;
}

export interface ReminderSetting {
  on: boolean;
  time: string; // HH:MM
}

export interface Reminders {
  morning: ReminderSetting;
  afternoon: ReminderSetting;
  evening: ReminderSetting;
  checkin: ReminderSetting;
  prayer: ReminderSetting;
  lastFired: Record<string, string>;
}

export interface Profile {
  name: string;
  goals: string[];
  customGoal: string;
  progressMeaning: string;
  focus: Topic;
  prayerTime: string;
  scripturePref: ScripturePref;
  createdAt: string;
}

export interface LockSettings {
  enabled: boolean;
  salt?: string;
  hash?: string;
}

export interface AbideState {
  onboarded: boolean;
  profile: Profile;
  theme: ThemePref;
  textScale: number;
  checkins: Record<string, CheckIn>;
  journeys: Journey[];
  devotions: Record<string, { id: string; at: number }>;
  challenges: Record<string, boolean>;
  rosaries: Record<string, number>;
  saved: SavedPassage[];
  readRefs: Record<string, string>;
  journal: JournalEntry[];
  learnRead: Record<string, string>;
  quizBest: Record<string, number>;
  chat: ChatMessage[];
  milestones: Record<string, string>;
  companion: { name: string; interactions: number; lastStageSeen: number };
  reminders: Reminders;
  lock: LockSettings;
  bibleLast?: { book: string; chapter: number };

  // actions
  completeOnboarding: (p: Partial<Profile>, reminders: Partial<Reminders>) => void;
  updateProfile: (p: Partial<Profile>) => void;
  setTheme: (t: ThemePref) => void;
  setTextScale: (n: number) => void;
  checkIn: (c: Omit<CheckIn, 'at'>) => void;
  removeCheckIn: (date: string) => void;
  restartJourney: () => void;
  completeDevotion: (date: string, id: string) => void;
  setChallenge: (date: string, done: boolean) => void;
  logRosary: (date: string) => void;
  toggleSaved: (ref: string) => void;
  saveVerse: (ref: string, display: string, text: string) => void;
  updateSaved: (ref: string, patch: Partial<SavedPassage>) => void;
  markRead: (ref: string) => void;
  upsertJournal: (e: Partial<JournalEntry> & { type: JournalType; body: string }) => string;
  deleteJournal: (id: string) => void;
  markLearnRead: (id: string) => void;
  setQuizBest: (cat: string, score: number) => void;
  addChat: (m: Omit<ChatMessage, 'id' | 'at'>) => void;
  clearChat: () => void;
  awardMilestone: (id: string, date: string) => void;
  setCompanion: (p: Partial<AbideState['companion']>) => void;
  setReminders: (r: Partial<Reminders>) => void;
  setLock: (l: LockSettings) => void;
  setBibleLast: (book: string, chapter: number) => void;
  importState: (s: Partial<AbideState>) => void;
  resetAll: () => void;
}

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const defaultReminders: Reminders = {
  morning: { on: true, time: '07:00' },
  afternoon: { on: false, time: '13:00' },
  evening: { on: true, time: '21:00' },
  checkin: { on: true, time: '21:30' },
  prayer: { on: false, time: '12:00' },
  lastFired: {},
};

const initialData = () => ({
  onboarded: false,
  profile: {
    name: '',
    goals: [],
    customGoal: '',
    progressMeaning: '',
    focus: 'self-control' as Topic,
    prayerTime: 'morning',
    scripturePref: 'mixed' as ScripturePref,
    createdAt: dateKey(),
  },
  theme: 'system' as ThemePref,
  textScale: 1,
  checkins: {},
  journeys: [{ id: uid(), startedAt: dateKey() }],
  devotions: {},
  challenges: {},
  rosaries: {},
  saved: [],
  readRefs: {},
  journal: [],
  learnRead: {},
  quizBest: {},
  chat: [],
  milestones: {},
  companion: { name: 'Sage', interactions: 0, lastStageSeen: 1 },
  reminders: defaultReminders,
  lock: { enabled: false },
  bibleLast: undefined,
});

// IndexedDB storage adapter (local-first, survives app restarts; far larger than localStorage).
const idbStorage: StateStorage = {
  getItem: async (name) => (await idbGet<string>(name)) ?? null,
  setItem: async (name, value) => idbSet(name, value),
  removeItem: async (name) => idbDel(name),
};

export const useStore = create<AbideState>()(
  persist(
    (set, get) => ({
      ...initialData(),

      completeOnboarding: (p, reminders) =>
        set((s) => ({
          onboarded: true,
          profile: { ...s.profile, ...p, createdAt: dateKey() },
          reminders: { ...s.reminders, ...reminders },
          journeys: [{ id: uid(), startedAt: dateKey() }],
        })),
      updateProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
      setTheme: (theme) => {
        try {
          localStorage.setItem('abide-theme', theme);
        } catch {
          /* ignore */
        }
        set({ theme });
      },
      setTextScale: (textScale) => set({ textScale }),

      checkIn: (c) => set((s) => ({ checkins: { ...s.checkins, [c.date]: { ...c, at: Date.now() } } })),
      removeCheckIn: (date) =>
        set((s) => {
          const next = { ...s.checkins };
          delete next[date];
          return { checkins: next };
        }),
      restartJourney: () =>
        set((s) => {
          const today = dateKey();
          const journeys = s.journeys.map((j) => (j.endedAt ? j : { ...j, endedAt: today }));
          return { journeys: [...journeys, { id: uid(), startedAt: today }] };
        }),

      completeDevotion: (date, id) => set((s) => ({ devotions: { ...s.devotions, [date]: { id, at: Date.now() } } })),
      setChallenge: (date, done) => set((s) => ({ challenges: { ...s.challenges, [date]: done } })),
      logRosary: (date) => set((s) => ({ rosaries: { ...s.rosaries, [date]: (s.rosaries[date] ?? 0) + 1 } })),

      toggleSaved: (ref) =>
        set((s) =>
          s.saved.some((x) => x.ref === ref)
            ? { saved: s.saved.filter((x) => x.ref !== ref) }
            : { saved: [{ ref, savedAt: Date.now(), favorite: true }, ...s.saved] },
        ),
      saveVerse: (ref, display, text) =>
        set((s) => (s.saved.some((x) => x.ref === ref) ? s : { saved: [{ ref, display, text, savedAt: Date.now(), favorite: true }, ...s.saved] })),
      updateSaved: (ref, patch) => set((s) => ({ saved: s.saved.map((x) => (x.ref === ref ? { ...x, ...patch } : x)) })),
      markRead: (ref) => set((s) => ({ readRefs: { ...s.readRefs, [ref]: dateKey() } })),

      upsertJournal: (e) => {
        const id = e.id ?? uid();
        const now = Date.now();
        set((s) => {
          const existing = s.journal.find((j) => j.id === id);
          const entry: JournalEntry = existing
            ? { ...existing, ...e, id, updatedAt: now }
            : { date: dateKey(), createdAt: now, updatedAt: now, ...e, id };
          return { journal: existing ? s.journal.map((j) => (j.id === id ? entry : j)) : [entry, ...s.journal] };
        });
        return id;
      },
      deleteJournal: (id) => set((s) => ({ journal: s.journal.filter((j) => j.id !== id) })),

      markLearnRead: (id) => set((s) => (s.learnRead[id] ? s : { learnRead: { ...s.learnRead, [id]: dateKey() } })),
      setQuizBest: (cat, score) => set((s) => ({ quizBest: { ...s.quizBest, [cat]: Math.max(score, s.quizBest[cat] ?? 0) } })),

      addChat: (m) => set((s) => ({ chat: [...s.chat, { ...m, id: uid(), at: Date.now() }].slice(-200) })),
      clearChat: () => set({ chat: [] }),

      awardMilestone: (id, date) => set((s) => (s.milestones[id] ? s : { milestones: { ...s.milestones, [id]: date } })),
      setCompanion: (p) => set((s) => ({ companion: { ...s.companion, ...p } })),
      setReminders: (r) => set((s) => ({ reminders: { ...s.reminders, ...r } })),
      setLock: (lock) => set({ lock }),
      setBibleLast: (book, chapter) => set({ bibleLast: { book, chapter } }),

      importState: (incoming) => set(() => ({ ...initialData(), ...incoming })),
      resetAll: () => set(() => ({ ...initialData() })),
    }),
    {
      name: 'abide-state',
      version: 1,
      storage: createJSONStorage(() => idbStorage),
      partialize: (s) => {
        // Persist data only (functions are recreated).
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(s)) if (typeof v !== 'function') out[k] = v;
        return out as Partial<AbideState>;
      },
    },
  ),
);

export const DATA_KEYS = Object.keys(initialData()) as (keyof ReturnType<typeof initialData>)[];

export function exportableState(): Record<string, unknown> {
  const s = useStore.getState();
  const out: Record<string, unknown> = {};
  for (const k of DATA_KEYS) out[k] = s[k];
  return out;
}

export function useHydrated(): boolean {
  const [h, setH] = useState(useStore.persist.hasHydrated());
  useEffect(() => {
    const unsub = useStore.persist.onFinishHydration(() => setH(true));
    if (useStore.persist.hasHydrated()) setH(true);
    return unsub;
  }, []);
  return h;
}

