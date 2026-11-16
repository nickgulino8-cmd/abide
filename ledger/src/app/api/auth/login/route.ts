import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSettings, startSession } from "@/lib/auth";
import { verifyPin } from "@/lib/crypto";
import { isHttps } from "@/lib/session-token";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

export async function POST(req: Request) {
  const parsed = z.object({ pin: z.string().max(12) }).safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const s = await getSettings();
  if (!s.pinHash) return NextResponse.json({ error: "No PIN set" }, { status: 400 });
  if (s.lockedUntil && s.lockedUntil > new Date()) {
    return NextResponse.json({ error: "Too many attempts. Try again later.", lockedUntil: s.lockedUntil }, { status: 429 });
  }

  if (!(await verifyPin(parsed.data.pin, s.pinHash))) {
    const attempts = s.failedAttempts + 1;
    const lock = attempts >= MAX_ATTEMPTS;
    await db.appSettings.update({
      where: { id: 1 },
      data: {
        failedAttempts: lock ? 0 : attempts,
        lockedUntil: lock ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000) : null,
      },
    });
    return NextResponse.json(
      { error: lock ? `Too many attempts. Locked for ${LOCKOUT_MINUTES} minutes.` : "Wrong PIN", remaining: lock ? 0 : MAX_ATTEMPTS - attempts },
      { status: 401 },
    );
  }

  await db.appSettings.update({ where: { id: 1 }, data: { failedAttempts: 0, lockedUntil: null } });
  const res = NextResponse.json({ ok: true });
  await startSession(res, isHttps(req));
  return res;
}
