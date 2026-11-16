import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, cookieOptions, isHttps, signSession, verifySession } from "@/lib/session-token";

// Runs before every request. If you're not unlocked, pages redirect to /lock
// and API calls get 401. While you're active the session slides forward;
// after `idle` minutes with no requests it expires (auto-lock).
const PUBLIC = ["/lock", "/api/auth/", "/manifest.webmanifest", "/sw.js", "/icons/", "/favicon"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = securityHeaders(NextResponse.next());
  if (PUBLIC.some((p) => pathname.startsWith(p))) return res;

  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!session) {
    if (pathname.startsWith("/api/")) return securityHeaders(NextResponse.json({ error: "locked" }, { status: 401 }));
    const url = req.nextUrl.clone();
    url.pathname = "/lock";
    url.search = "";
    return securityHeaders(NextResponse.redirect(url));
  }

  // Background polling shouldn't keep the app unlocked forever.
  if (req.headers.get("x-ledger-passive") !== "1") {
    const token = await signSession({ ...session, exp: Date.now() + session.idle * 60_000 });
    res.cookies.set(SESSION_COOKIE, token, cookieOptions(isHttps(req), session.idle * 60));
  }
  return res;
}

function securityHeaders(res: NextResponse) {
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "no-referrer");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.headers.set("Cache-Control", "no-store"); // don't cache financial data
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
