import { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useHydrated, useStore } from './lib/store';
import { useMilestoneWatcher } from './lib/hooks';
import { startReminderLoop } from './lib/reminders';
import TabBar from './components/TabBar';
import { ToastHost } from './components/ui';
import LockScreen from './screens/LockScreen';
import Onboarding from './screens/Onboarding';
import Home from './screens/Home';

const Devotional = lazy(() => import('./screens/Devotional'));
const CheckIn = lazy(() => import('./screens/CheckIn'));
const Journey = lazy(() => import('./screens/Journey'));
const CompanionPage = lazy(() => import('./screens/CompanionPage'));
const Faith = lazy(() => import('./screens/Faith'));
const Bible = lazy(() => import('./screens/Bible'));
const Prayers = lazy(() => import('./screens/Prayers'));
const PrayerDetail = lazy(() => import('./screens/PrayerDetail'));
const Rosary = lazy(() => import('./screens/Rosary'));
const Learn = lazy(() => import('./screens/Learn'));
const Saints = lazy(() => import('./screens/Saints'));
const ScriptureLibrary = lazy(() => import('./screens/ScriptureLibrary'));
const Ask = lazy(() => import('./screens/Ask'));
const Journal = lazy(() => import('./screens/Journal'));
const JournalEditor = lazy(() => import('./screens/JournalEditor'));
const Profile = lazy(() => import('./screens/Profile'));

const HIDE_TABS = ['/devotional', '/checkin', '/faith/rosary/pray', '/onboarding'];

function useThemeEffect() {
  const theme = useStore((s) => s.theme);
  const scale = useStore((s) => s.textScale);
  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && mq.matches);
      document.documentElement.classList.toggle('dark', dark);
      document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', dark ? '#121614' : '#f7f2e8'));
    };
    apply();
    try {
      localStorage.setItem('abide-theme', theme);
    } catch {
      /* ignore */
    }
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [theme]);
  useEffect(() => {
    document.documentElement.style.setProperty('--text-scale', String(scale));
  }, [scale]);
}

function Splash() {
  return (
    <div className="grid min-h-dvh place-items-center bg-bg">
      <p className="display gold-text animate-pulse text-4xl tracking-[0.3em]">ABIDE</p>
    </div>
  );
}

export default function App() {
  const hydrated = useHydrated();
  const onboarded = useStore((s) => s.onboarded);
  const lockEnabled = useStore((s) => s.lock.enabled);
  const [unlocked, setUnlocked] = useState(false);
  const loc = useLocation();
  useThemeEffect();
  useMilestoneWatcher();
  useEffect(() => {
    if (hydrated && onboarded) return startReminderLoop();
  }, [hydrated, onboarded]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [loc.pathname]);

  if (!hydrated) return <Splash />;
  if (lockEnabled && !unlocked) return <LockScreen onUnlock={() => setUnlocked(true)} />;
  if (!onboarded) return <Onboarding />;

  const hideTabs = HIDE_TABS.some((p) => loc.pathname.startsWith(p));
  return (
    <>
      <Suspense fallback={<Splash />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/devotional" element={<Devotional />} />
          <Route path="/checkin" element={<CheckIn />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/journey/companion" element={<CompanionPage />} />
          <Route path="/faith" element={<Faith />} />
          <Route path="/faith/bible" element={<Bible />} />
          <Route path="/faith/bible/:book/:chapter" element={<Bible />} />
          <Route path="/faith/prayers" element={<Prayers />} />
          <Route path="/faith/prayers/:id" element={<PrayerDetail />} />
          <Route path="/faith/rosary" element={<Rosary />} />
          <Route path="/faith/rosary/pray/:set" element={<Rosary />} />
          <Route path="/faith/learn" element={<Learn />} />
          <Route path="/faith/learn/:cat" element={<Learn />} />
          <Route path="/faith/learn/:cat/quiz" element={<Learn />} />
          <Route path="/faith/learn/:cat/:article" element={<Learn />} />
          <Route path="/faith/saints" element={<Saints />} />
          <Route path="/faith/saints/:id" element={<Saints />} />
          <Route path="/faith/scripture" element={<ScriptureLibrary />} />
          <Route path="/faith/ask" element={<Ask />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/journal/new" element={<JournalEditor />} />
          <Route path="/journal/:id" element={<JournalEditor />} />
          <Route path="/profile/*" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      {!hideTabs && <TabBar />}
      <ToastHost />
    </>
  );
}
