"use client";
import { useEffect, useRef } from "react";

/**
 * Auto-lock: if you don't touch the app for `minutes`, or it sits in the
 * background that long, we end the session and show the lock screen.
 */
export function IdleLock({ minutes }: { minutes: number }) {
  const last = useRef(0);

  useEffect(() => {
    const limit = minutes * 60_000;
    last.current = Date.now();
    const lock = () => {
      fetch("/api/auth/logout", { method: "POST" }).finally(() => window.location.replace("/lock"));
    };
    const bump = () => { last.current = Date.now(); };
    const check = () => { if (Date.now() - last.current > limit) lock(); };
    const onVisible = () => { if (document.visibilityState === "visible") check(); };

    const events = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }));
    document.addEventListener("visibilitychange", onVisible);
    const t = setInterval(check, 15_000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, bump));
      document.removeEventListener("visibilitychange", onVisible);
      clearInterval(t);
    };
  }, [minutes]);

  return null;
}
