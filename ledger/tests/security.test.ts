import { describe, expect, it } from "vitest";
import { decrypt, encrypt, hashPin, verifyPin } from "@/lib/crypto";
import { signSession, verifySession } from "@/lib/session-token";

describe("token encryption", () => {
  it("round-trips and never stores plaintext", () => {
    const token = "access-sandbox-1234-secret";
    const enc = encrypt(token);
    expect(enc).not.toContain(token);
    expect(decrypt(enc)).toBe(token);
    expect(encrypt(token)).not.toBe(enc); // random IV each time
  });
  it("detects tampering", () => {
    const enc = encrypt("hello").split(":");
    enc[3] = Buffer.from("evil").toString("base64");
    expect(() => decrypt(enc.join(":"))).toThrow();
  });
});

describe("PIN hashing", () => {
  it("verifies the right PIN only", async () => {
    const h = await hashPin("482913");
    expect(h).not.toContain("482913");
    expect(await verifyPin("482913", h)).toBe(true);
    expect(await verifyPin("000000", h)).toBe(false);
  });
});

describe("session tokens", () => {
  it("accepts valid, rejects forged or expired", async () => {
    const t = await signSession({ v: 1, idle: 5, exp: Date.now() + 60_000 });
    expect(await verifySession(t)).toMatchObject({ v: 1 });
    const [body] = t.split(".");
    expect(await verifySession(`${body}.AAAA`)).toBeNull();
    expect(await verifySession(await signSession({ v: 1, idle: 5, exp: Date.now() - 1 }))).toBeNull();
  });
});
