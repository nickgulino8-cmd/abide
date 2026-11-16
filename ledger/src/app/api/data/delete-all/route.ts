import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { endSession, getSettings, requireSession } from "@/lib/auth";
import { verifyPin } from "@/lib/crypto";
import { disconnectAllBanks } from "@/lib/wipe";

// "Disconnect bank and delete all data". Requires your PIN again.
export async function POST(req: Request) {
  const denied = await requireSession();
  if (denied) return denied;
  const parsed = z.object({ pin: z.string(), confirm: z.literal("DELETE") }).safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: 'Type DELETE and enter your PIN' }, { status: 400 });

  const s = await getSettings();
  if (!(await verifyPin(parsed.data.pin, s.pinHash!))) {
    return NextResponse.json({ error: "Wrong PIN" }, { status: 401 });
  }

  const plaidErrors = await disconnectAllBanks();
  await wipeDatabase();

  const res = NextResponse.json({ ok: true, plaidErrors });
  endSession(res);
  return res;
}

async function wipeDatabase() {
  // Order matters only for readability; cascades handle children.
  await db.$transaction([
    db.transactionTag.deleteMany(),
    db.tag.deleteMany(),
    db.transactionSplit.deleteMany(),
    db.transaction.deleteMany(),
    db.account.deleteMany(),
    db.plaidItem.deleteMany(),
    db.rule.deleteMany(),
    db.merchantAlias.deleteMany(),
    db.budget.deleteMany(),
    db.recurringCharge.deleteMany(),
    db.category.deleteMany(),
    db.shift.deleteMany(),
    db.goalContribution.deleteMany(),
    db.goal.deleteMany(),
    db.investSettings.deleteMany(),
    db.pushSubscription.deleteMany(),
    db.alertLog.deleteMany(),
    // Remove your PIN (fresh start) and invalidate every old session cookie.
    db.appSettings.update({
      where: { id: 1 },
      data: { pinHash: null, failedAttempts: 0, lockedUntil: null, sessionVersion: { increment: 1 } },
    }),
  ]);
}
