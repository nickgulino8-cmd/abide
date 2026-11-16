// Creates your private .env file with freshly generated secrets.
// Safe to run more than once: it never overwrites an existing value.
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const path = new URL("../.env", import.meta.url);
const template = readFileSync(new URL("../.env.example", import.meta.url), "utf8");
const current = existsSync(path) ? readFileSync(path, "utf8") : template;

const generated = {
  ENCRYPTION_KEY: randomBytes(32).toString("base64"),
  SESSION_SECRET: randomBytes(48).toString("base64url"),
};

let out = current;
for (const [key, value] of Object.entries(generated)) {
  const re = new RegExp(`^${key}=(.*)$`, "m");
  const m = out.match(re);
  if (!m) out += `\n${key}="${value}"\n`;
  else if (m[1].replace(/"/g, "").trim() === "") out = out.replace(re, `${key}="${value}"`);
}
writeFileSync(path, out, { mode: 0o600 });
console.log(existsSync(path) ? "✔ .env is ready (secrets generated where missing)" : "");
