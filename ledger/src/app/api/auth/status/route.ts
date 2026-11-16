import { NextResponse } from "next/server";
import { getSession, getSettings } from "@/lib/auth";

export async function GET() {
  const s = await getSettings();
  const session = await getSession();
  return NextResponse.json({
    hasPin: !!s.pinHash,
    unlocked: !!session,
    lockedUntil: s.lockedUntil && s.lockedUntil > new Date() ? s.lockedUntil : null,
    idleLockMinutes: s.idleLockMinutes,
  });
}
