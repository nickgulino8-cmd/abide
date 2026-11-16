import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSettings, requireSession, startSession } from "@/lib/auth";
import { hashPin, verifyPin } from "@/lib/crypto";
import { isHttps } from "@/lib/session-token";
import { pinSchema } from "@/lib/validate";

export async function GET() {
  const denied = await requireSession();
  if (denied) return denied;
  const s = await getSettings();
  return NextResponse.json({
    idleLockMinutes: s.idleLockMinutes,
    lowBalanceCents: s.lowBalanceCents,
    largeTxnCents: s.largeTxnCents,
  });
}

const patchSchema = z.object({
  idleLockMinutes: z.number().int().min(1).max(60).optional(),
  lowBalanceCents: z.number().int().min(0).optional(),
  largeTxnCents: z.number().int().min(0).optional(),
  changePin: z.object({ current: z.string(), next: pinSchema }).optional(),
});

export async function PATCH(req: Request) {
  const denied = await requireSession();
  if (denied) return denied;
  const parsed = patchSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const { changePin, ...rest } = parsed.data;
  const s = await getSettings();

  const data: Record<string, unknown> = { ...rest };
  if (changePin) {
    if (!(await verifyPin(changePin.current, s.pinHash!))) {
      return NextResponse.json({ error: "Current PIN is wrong" }, { status: 401 });
    }
    data.pinHash = await hashPin(changePin.next);
    data.sessionVersion = s.sessionVersion + 1; // log out other devices
  }
  await db.appSettings.update({ where: { id: 1 }, data });
  const res = NextResponse.json({ ok: true });
  if (changePin || rest.idleLockMinutes) await startSession(res, isHttps(req));
  return res;
}
