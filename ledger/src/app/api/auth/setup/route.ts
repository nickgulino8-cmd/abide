import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSettings, startSession } from "@/lib/auth";
import { hashPin } from "@/lib/crypto";
import { isHttps } from "@/lib/session-token";
import { pinSchema } from "@/lib/validate";
import { seedDefaults } from "@/lib/categories";

// First-run only: create your PIN. Refuses if a PIN already exists.
export async function POST(req: Request) {
  const parsed = z.object({ pin: pinSchema }).safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const s = await getSettings();
  if (s.pinHash) return NextResponse.json({ error: "PIN already set" }, { status: 409 });

  await db.appSettings.update({
    where: { id: 1 },
    data: { pinHash: await hashPin(parsed.data.pin), failedAttempts: 0, lockedUntil: null },
  });
  await seedDefaults(db);
  const res = NextResponse.json({ ok: true });
  await startSession(res, isHttps(req));
  return res;
}
