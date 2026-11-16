import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "./db";
import { SESSION_COOKIE, cookieOptions, signSession, verifySession, type SessionPayload } from "./session-token";

export async function getSettings() {
  return db.appSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
}

/** Full check for API routes: valid signature, not expired, and not revoked. */
export async function getSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const payload = await verifySession(token);
  if (!payload) return null;
  const settings = await getSettings();
  if (!settings.pinHash || payload.v !== settings.sessionVersion) return null;
  return payload;
}

/** Use at the top of every protected API route. */
export async function requireSession(): Promise<NextResponse | null> {
  const s = await getSession();
  return s ? null : NextResponse.json({ error: "locked" }, { status: 401 });
}

export async function startSession(res: NextResponse, secure: boolean) {
  const s = await getSettings();
  const idle = s.idleLockMinutes;
  const token = await signSession({ v: s.sessionVersion, idle, exp: Date.now() + idle * 60_000 });
  res.cookies.set(SESSION_COOKIE, token, cookieOptions(secure, idle * 60));
}

export function endSession(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
}
