// Local security helpers using the browser's built-in Web Crypto API (no external services).

const enc = new TextEncoder();
const dec = new TextDecoder();
const b64 = (buf: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(buf as ArrayBuffer)));
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function pbkdf2(secret: string, salt: Uint8Array, usage: 'bits' | 'key') {
  const base = await crypto.subtle.importKey('raw', enc.encode(secret), 'PBKDF2', false, ['deriveBits', 'deriveKey']);
  const params = { name: 'PBKDF2', salt: salt as BufferSource, iterations: 250_000, hash: 'SHA-256' };
  if (usage === 'bits') return crypto.subtle.deriveBits(params, base, 256);
  return crypto.subtle.deriveKey(params, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}

/** Hash a passcode for the optional app lock. */
export async function hashPin(pin: string, saltB64?: string) {
  const salt = saltB64 ? unb64(saltB64) : crypto.getRandomValues(new Uint8Array(16));
  const bits = (await pbkdf2(pin, salt, 'bits')) as ArrayBuffer;
  return { salt: b64(salt), hash: b64(bits) };
}

export async function verifyPin(pin: string, saltB64: string, hashB64: string) {
  const { hash } = await hashPin(pin, saltB64);
  return hash === hashB64;
}

export interface BackupFile {
  app: 'abide';
  version: 1;
  createdAt: string;
  encrypted: boolean;
  salt?: string;
  iv?: string;
  data: string; // JSON (plain) or base64 ciphertext
}

export async function makeBackup(state: unknown, passphrase?: string): Promise<BackupFile> {
  const json = JSON.stringify(state);
  const base = { app: 'abide' as const, version: 1 as const, createdAt: new Date().toISOString() };
  if (!passphrase) return { ...base, encrypted: false, data: json };
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = (await pbkdf2(passphrase, salt, 'key')) as CryptoKey;
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(json));
  return { ...base, encrypted: true, salt: b64(salt), iv: b64(iv), data: b64(ct) };
}

export async function readBackup(file: BackupFile, passphrase?: string): Promise<Record<string, unknown>> {
  if (file.app !== 'abide') throw new Error('This file is not an Abide backup.');
  if (!file.encrypted) return JSON.parse(file.data);
  if (!passphrase) throw new Error('This backup is encrypted. Enter its passphrase.');
  try {
    const key = (await pbkdf2(passphrase, unb64(file.salt!), 'key')) as CryptoKey;
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(file.iv!) as BufferSource }, key, unb64(file.data) as BufferSource);
    return JSON.parse(dec.decode(pt));
  } catch {
    throw new Error('Incorrect passphrase, or the file is damaged.');
  }
}
