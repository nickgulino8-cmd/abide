// Signed session tokens. Uses Web Crypto so it works both in the proxy
// (which runs before every request) and in API routes.

export const SESSION_COOKIE = "ledger_session";

export type SessionPayload = {
  v: number;    // session version (bumped to log out everywhere)
  idle: number; // idle lock minutes
  exp: number;  // unix ms; slides forward while you use the app
};

const enc = new TextEncoder();

function b64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromB64url(s: string): Uint8Array {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function hmacKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("SESSION_SECRET missing/short. Run `npm run setup`.");
  return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  const body = b64url(enc.encode(JSON.stringify(payload)));
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", await hmacKey(), enc.encode(body)));
  return `${body}.${b64url(sig)}`;
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  try {
    const ok = await crypto.subtle.verify("HMAC", await hmacKey(), fromB64url(sig) as BufferSource, enc.encode(body));
    if (!ok) return null;
    const payload = JSON.parse(new TextDecoder().decode(fromB64url(body))) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function cookieOptions(secure: boolean, maxAgeSec: number) {
  return {
    httpOnly: true,      // JavaScript in the page can't read it
    sameSite: "strict" as const,
    secure,              // HTTPS-only in production
    path: "/",
    maxAge: maxAgeSec,
  };
}

/** True when the request arrived over HTTPS (directly or via Vercel's proxy). */
export function isHttps(req: Request): boolean {
  const proto = req.headers.get("x-forwarded-proto");
  return (proto ?? new URL(req.url).protocol.replace(":", "")) === "https";
}
