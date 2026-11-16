# Ledger 💵

Your private personal-finance app. Installs on your iPhone like a native app (PWA).

**Build progress**

- [x] Stage 1: Project setup, security basics, database schema
- [ ] Stage 2: Plaid (Sandbox) bank connection + transaction sync
- [ ] Stage 3: Categories, rules, review screen
- [ ] Stage 4: Budgets + dashboard
- [ ] Stage 5: Shift & tip tracking
- [ ] Stage 6: Insights, recurring charges, goals (+ markets & index-fund planner)
- [ ] Stage 7: Notifications, PWA install, deploy to Vercel
- [ ] Stage 8: Switch from Sandbox to your real banks

---

## First-time setup (on your computer)

You need **Node.js 22+** ([nodejs.org](https://nodejs.org), pick "LTS") and **Git**.

```bash
# 1. Get the code
git clone https://github.com/nickgulino8-cmd/abide.git
cd abide
git checkout claude/keen-fermat-c6bj0q
cd ledger

# 2. Install the libraries the app uses (takes a minute)
npm install

# 3. Create your private .env file with random secrets, build the
#    database, and load the default categories
npm run setup

# 4. Start the app
npm run dev
```

Open **http://localhost:3000** on your computer. You'll be asked to create a PIN.

### Open it on your iPhone (same Wi-Fi)

1. Find your computer's local IP address:
   - Mac: `ipconfig getifaddr en0`
   - Windows: `ipconfig` and look for "IPv4 Address"
2. On your iPhone, open Safari and go to `http://<that-ip>:3000` (e.g. `http://192.168.1.23:3000`).

## Security, in plain English

| What | How |
|---|---|
| Secrets (Plaid keys, encryption key) | Live only in `.env`, which `.gitignore` blocks from ever being committed |
| Your bank access tokens | Encrypted with AES-256-GCM before they touch the database |
| Your PIN | Stored only as a salted scrypt hash, never the PIN itself |
| Guessing attacks | 5 wrong PINs locks login for 15 minutes |
| Walking away | Auto-locks after 5 minutes of inactivity (change in **More**) |
| Session cookie | HttpOnly (page scripts can't read it), SameSite=Strict, HTTPS-only once deployed, signed so it can't be forged |
| Plaid calls | Only ever made from the server (API routes), never from your phone's browser |
| Nuclear option | **More → Disconnect bank & delete all data** wipes everything (asks for your PIN) |

> ⚠️ Never paste the contents of `.env` anywhere. If you lose `ENCRYPTION_KEY`, you'll just need to re-link your banks.

## Useful commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the app for development (reachable from your phone) |
| `npm test` | Run the security unit tests |
| `npm run db:studio` | Open a spreadsheet-like view of your database in the browser |
| `npm run build` | Check the production build compiles |

## Project layout

```
ledger/
├─ prisma/schema.prisma   ← database tables (money stored as integer cents)
├─ src/proxy.ts           ← runs before every request: locked? → /lock
├─ src/lib/crypto.ts      ← encryption + PIN hashing
├─ src/lib/auth.ts        ← session checks used by every API route
├─ src/app/lock/          ← PIN screen
├─ src/app/(app)/         ← the app screens (Home, Activity, Budget, Income, More)
└─ src/app/api/           ← backend API routes
```
