# ABIDE

*A Catholic spiritual growth & habit recovery companion.*

> "Abide in me: and I in you." — John 15:4 (Douay-Rheims)
>
> **Don't just break a habit. Build a relationship with God.**

Abide is a private, offline-first Progressive Web App (PWA). It works on a phone or a computer, it needs no account, and it doesn't depend on any paid service.

---

## Features

| Area | What's included |
| --- | --- |
| **Home** | Greeting and liturgical season, the living companion, the "Begin Today's Devotional" button, check-in, today's Scripture with its explanation, the daily challenge, today's prayer, the Rosary of the day, the saint of the day, a quick journal entry, and a progress overview. |
| **Companion** | An original serpent coiled on a vine, rendered procedurally on `<canvas>`. It has 7 growth stages. It breathes, sways, blinks, follows your pointer, and reacts when tapped. Streak milestones unlock four flourishes: Embers, Vine Blossoms, Golden Halo and Radiance. On a setback day it rests peacefully beside a small dawn light. It never looks hurt or sad, and it never regresses. |
| **Accountability** | Daily check-in with three choices: committed, setback, or reflect. You can backfill the last 7 days. Tracks current and longest streak, faithful days, check-ins, 30-day and lifetime consistency, a circular gauge, a month calendar, milestones (7/30/60/90 days and more), and journey restarts. Lifetime achievements are always kept. |
| **Setback care** | A compassionate flow: an affirmation, a passage on mercy, the statement that "nothing you've built is lost", three gentle reflection questions, a prayer, and next steps (confession guide, prayer, practical help). Honest reflection counts as growth. |
| **Daily devotional** | 67 devotionals across 14 topics. Each has a verified passage, historical context, meaning, application, a reflection, a question, a challenge and a prayer. It's a guided 8-step experience of about 5–10 minutes, and the selection follows the date and your reading preference. |
| **Bible** | The complete Douay-Rheims (Challoner) Bible, all 73 books, offline. Includes a reader, full-text search, saving verses, and notes. |
| **Prayer** | Complete traditional prayers (Our Father, Hail Mary, Glory Be, both Creeds, Act of Contrition, St. Michael, Guardian Angel, Memorare, Come Holy Spirit, and more), morning and evening prayer, an examination of conscience, and 11 prayers for difficult moments. |
| **Rosary** | All four sets of mysteries, with Scripture, fruit and a meditation for each mystery. Guided bead-by-bead with counters; works offline. |
| **Grow in Faith** | Jesus Christ (6 articles), the Apostles (15), the Beatitudes (9), the Seven Virtues (8), the Seven Deadly Sins (8), and Catholic Traditions (8), with Catechism citations and a quiz for each category. Plus 44 saints and holy people with feast days, struggles, virtues, lessons and prayers, and the saint of the day. |
| **Journal** | Private entries: reflections, gratitude, prayer intentions (mark them answered), Scripture notes, free writing, and spiritual milestones. Daily prompts, search and filters. |
| **Abide Companion** | An offline question-and-answer assistant over a curated Catholic knowledge base, with no AI service. It labels every answer as Church teaching, pastoral guidance, practical help, or theological reflection. Scripture comes only from the verified passages. It recognizes crisis language and gives real support resources. |
| **Reminders** | Optional morning, afternoon, evening, check-in and prayer reminders, plus a calendar (.ics) export for reliable daily alarms. |
| **Privacy** | No account, no ads, no analytics, nothing leaves the device. Optional passcode lock, AES-256 encrypted backup and restore, and delete-everything. |

## Scripture integrity

No Bible text is typed by hand in this codebase. `npm run scripture`:

1. downloads the public-domain **Douay-Rheims Bible, Challoner Revision** (from [scrollmapper/bible_databases](https://github.com/scrollmapper/bible_databases)),
2. writes the full Bible to `public/bible/*.json` (precached for offline reading), and
3. scans every content and screen file for Scripture references and writes their **exact verse text** to `src/content/generated/passages.json`.

**The build fails if any reference doesn't resolve.** Psalms use the Douay (Vulgate) numbering; the app also shows the common Hebrew number, e.g. "Psalm 50:12 (51)".

## Tech stack (all free)

- **Vite + React 18 + TypeScript.** A static single-page PWA: no server, and easy to maintain.
- **Tailwind CSS v4** with design tokens for light and dark mode.
- **Zustand** state, persisted to **IndexedDB** (`idb-keyval`). Local-first.
- **vite-plugin-pwa / Workbox** precaches the whole app and Bible (~6.5 MB), so it works fully offline after the first visit.
- **Framer Motion** for transitions, **Lucide** icons, and the self-hosted fonts **Cormorant Garamond** and **Inter**.
- **Web Crypto** for passcode hashing (PBKDF2) and encrypted backups (AES-GCM).
- **Vitest** unit tests and a **Playwright** end-to-end test.

## Getting started

```bash
npm install
npm run scripture   # build verified Scripture data (already committed; re-run after content edits)
npm run dev         # http://localhost:5173
```

Production build and preview:

```bash
npm run build
npm run preview     # http://localhost:4173
```

Tests:

```bash
npm test                                   # unit tests
NODE_PATH=$(npm root -g) node scripts/e2e.mjs http://localhost:4173   # end-to-end, against `npm run preview`
```

### Install on your phone

Deploy the `dist/` folder to any free static host (see below), open it on your phone, and then:

- **iPhone (Safari):** Share → *Add to Home Screen*.
- **Android (Chrome):** menu → *Install app*.

Abide then opens full-screen like a native app and works offline.

### Free hosting

`dist/` is static, so any of these free tiers works:

- **Cloudflare Pages / Netlify:** build command `npm run build`, output `dist`. `public/_redirects` handles routing.
- **Vercel:** `vercel.json` is included.
- **GitHub Pages:** works, but Pages doesn't support SPA rewrites. Copy `dist/index.html` to `dist/404.html` before publishing.

Free-tier limits (bandwidth and build minutes) are far above what a personal app uses. No database, functions, or paid add-ons are required.

## Honest limitations

- **Notifications when the app is closed.** A web app can't schedule local notifications for a time when it isn't running, unless it uses a push server (a hosted dependency, deliberately avoided here). Abide shows notifications while it's open or recently used. For reliable alarms when it's closed, **Profile → Reminders → "Add reminders to my calendar"** exports a calendar file with daily repeating alarms that your phone's calendar delivers offline. iOS only allows web notifications for apps installed to the Home Screen (iOS 16.4+).
- **Data lives on one device.** It isn't synced across devices. Use encrypted **Export / Restore** to move or back up your data; the file goes wherever you choose.
- **The app lock is a privacy screen, not disk encryption.** It deters casual access on a shared device.
- **Abide Companion is retrieval, not generative AI.** It answers from a curated library, and when it isn't confident it says so instead of guessing.

### Optional AI integration (not enabled)

`src/lib/assistant.ts` defines an `AssistantProvider` interface. The default `localProvider` is offline and free. If you ever plug in an external model, you would add a second provider; it would need the user's own API key, which **costs money per request and sends questions to a third party**. Disclose that clearly and keep the local provider as the default.

## Content notes

- Devotionals, reflections, saint biographies and learning articles are original to Abide. They follow the *Catechism of the Catholic Church*, cited by paragraph, but they are not official Church documents.
- Traditional prayers are in their common English forms. The Nicene Creed uses the English translation of the Roman Missal © 2010 ICEL.
- Saint quotations are given only where the source is well established, and are marked "attributed" where traditional wording varies.
- Abide encourages, but never replaces, a priest, confessor, spiritual director or counsellor.

## Project structure

```
src/
  components/   Companion (canvas), TabBar, UI kit (Scripture, ProgressRing, Sheet…)
  content/      devotionals, prayers, rosary, saints, learn, assistant KB, verses
  content/generated/  verified passages + Bible index (built by npm run scripture)
  lib/          store (IndexedDB), progress/streaks, daily selection, liturgical calendar,
                scripture loader, assistant engine, reminders/ICS, security (crypto)
  screens/      Home, Devotional, CheckIn, Journey, CompanionPage, Faith, Bible, Prayers,
                Rosary, Learn, Saints, ScriptureLibrary, Ask, Journal, Profile, Onboarding
scripts/        build-scripture.ts, build-icons.mjs, e2e.mjs
tests/          logic.test.ts
```

---

*"Progress is not perfection. It is choosing to return to God, again and again."*
