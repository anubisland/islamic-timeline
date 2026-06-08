# Islamic Timeline (الخط الزمني الإسلامي)

> **Interactive bilingual (Arabic / English) timeline of the Prophet's biography and the era that followed — 10 eras, 72 stages: Pre-Prophethood (11), Meccan (16), Hijra (6), Badr (3), Medinan (11), and the five Rightly-Guided Caliphs (5 each).**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-anubisland.github.io-0a6b58?style=for-the-badge&logo=github)](https://anubisland.github.io/islamic-timeline/)
[![License: MIT](https://img.shields.io/badge/License-MIT-C5A059?style=for-the-badge)](LICENSE)
[![Version](https://img.shields.io/badge/Version-2.1.0-063529?style=for-the-badge)](CHANGELOG.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge)](CONTRIBUTING.md)

A **single-page, no-build, vanilla-JS** website that walks through **72 chronological stages** across **10 eras**:

- 🌅 **Pre-Prophethood** — 11 stages (the Arabian Peninsula → birth → Year of the Elephant → his youth and character)
- 🕋 **Meccan Era** — 16 stages (First revelation → Public call → Boycott → Ta'if → Isra & Mi'raj → Eve of the Hijra)
- 🧭 **The Hijra** — 6 stages (Departure → Cave of Thawr → Coastal route → Qudayd → Suraqah's chase → Arrival in Madinah)
- ⚔️ **Battle of Badr** — 3 stages (Shura → March → The clash)
- 🏛️ **Medinan Era** — 11 stages (Mosque & state → Badr → Uhud → Khandaq → Hudaybiyyah → Conquest of Makkah → Farewell Hajj → Death)
- 🟢 **The Rightly-Guided Caliphs (Rashidun)** — 25 stages (Abu Bakr, Umar, Uthman, Ali, and al-Hasan — 5 each)

Each step presents a unique Quranic verse, the historical narrative, key figures, leadership lessons, and authoritative sources from the classical Seerah literature.

## ✨ Features

- 🟢 **Emerald + gold** Islamic visual identity (`#063529` / `#C5A059`).
- 🗺️ **Four interactive SVG maps** — Meccan context, animated Hijra route, tactical Badr battlefield, Medinan state expansion.
- 🌐 **Full bilingual UI** — Arabic (RTL) ↔ English (LTR) with `localStorage` persistence.
- 🔊 **Real audio, no robotic TTS** — story **narration** plays pre-generated neural-voice MP3s (a 4-voice picker, different voice per language), and **Quranic verses** play genuine reciter recitation (5 sheikhs) streamed from everyayah.com. The 🎙️ picker switches between narration voices and reciters with the mode.
- 📖 **20+ unique Quranic verses** in Arabic + English translation, with Surah references.
- 👥 **Key figures** with names, roles, and historical context.
- 💡 **Leadership lessons** drawn from each event.
- 📚 **Authoritative sources** — Sahih al-Bukhari, Sahih Muslim, Ibn Hisham, *Al-Rahiq Al-Makhtum*, *Zad al-Maad*, *Dala'il al-Nubuwwah*.
- ⌨️ **Keyboard shortcuts** — arrows, space, `L` for language.
- 📱 **Fully responsive** — event switcher wraps to 2×2 on mobile, 44px tap targets, font-scaled ayah boxes.
- 🌍 **GeoJSON dataset** of all 24 event locations (ready for any map library).

## 📑 Table of Contents

- [Live Demo](#-live-demo)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Keyboard Shortcuts](#-keyboard-shortcuts)
- [Project Structure](#-project-structure)
- [Documentation](#-documentation)
- [Data Schema](#-data-schema)
- [Sources](#-sources)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Quick Start

### Option 1 — Open directly
Double-click `index.html`. The site works fully from the `file://` protocol.

### Option 2 — Local static server (recommended for audio)
```bash
npm start
# or
npx serve .
```
Then open the printed URL (usually `http://localhost:3000`).

> A static server is recommended so Google TTS requests aren't blocked by some browser file:// policies.

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `←` / `→` | Previous / Next step (auto-flips for RTL) |
| `↑` / `↓` | Previous / Next step |
| `Space` | Play / pause verse recitation |
| `L` | Toggle language (AR ↔ EN) |

## 📁 Project Structure

```
Sera/
├── .editorconfig                # editor style consistency
├── .gitignore
├── CHANGELOG.md                 # version history
├── CONTRIBUTING.md              # how to contribute
├── LICENSE                      # MIT (code) + public domain (content)
├── README.md                    # ← you are here
├── index.html                   # main app entry (inlines 2 SVG maps)
├── style.css                    # all styling (emerald + gold theme)
├── app.js                       # state, render, nav, audio, language toggle
├── data.js                      # bilingual content module (window.SEERAH_DB)
├── timeline_data.geojson        # event locations with coordinates
├── audio/                       # pre-generated neural narration MP3s + manifest.json
├── tools/gen_tts.py             # dev-only narration generator (edge-tts; not shipped)
├── package.json                 # optional, for `npm start` (uses npx serve)
└── docs/
    ├── ARCHITECTURE.md          # how the app is put together
    ├── DATA_SCHEMA.md           # all data shapes
    └── SOURCES.md               # Islamic sources used
```

## 📖 Documentation

The project keeps deeper documentation in `docs/`:

| Document | Purpose |
|---|---|
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | How the app is built — file responsibilities, render pipeline, audio system, keyboard shortcuts, SVG map internals, performance notes. |
| [`docs/DATA_SCHEMA.md`](docs/DATA_SCHEMA.md) | All data shapes — `SEERAH_DB` step type, `timeline_data.geojson` features, `data-*` attribute conventions. |
| [`docs/SOURCES.md`](docs/SOURCES.md) | Islamic sources used in the app — Sahih al-Bukhari, Sahih Muslim, Ibn Hisham, *Al-Rahiq Al-Makhtum*, *Zad al-Maad*, *Dala'il al-Nubuwwah*, *Al-Mustadrak*, *Al-Shifa*. |

## 🗃️ Data Schema

Two data files are at the heart of the project:

### `data.js` — `window.SEERAH_DB`
```js
SEERAH_DB = {
  preb, meccan, hijra, badr, medinan,        // the Prophet's ﷺ biography
  abubakr, umar, uthman, ali, hasan          // the Rashidun caliphs
  // each: { labelAr, labelEn, mapLabelAr, mapLabelEn, steps: [Step, ...] }
}

Step = {
  ayah, ayahRef, ayahEn, ayahRefEn,    // verse (bilingual)
  dateAr, dateEn,                       // Hijri date
  titleAr, titleEn, descAr, descEn,     // title + narrative
  mtAr, mtEn, mdAr, mdEn,               // map card overlay
  timeAr, timeEn, distAr, distEn,       // time + distance badges
  amb: 'night' | 'dawn' | 'day',        // map ambient gradient
  charsAr, charsEn,                     // [{ i, n, r }, ...]
  lessonAr, lessonEn,                   // leadership insight
  srcs: [string, ...]                   // Arabic source citations
}
```

### `timeline_data.geojson`
Standard GeoJSON `FeatureCollection` of all 24 event locations with bilingual `name_ar` / `name_en` and `coordinates: [lng, lat]`.

> See [`docs/DATA_SCHEMA.md`](docs/DATA_SCHEMA.md) for the full type definitions and the meaning of `offsets[]`.

## 📚 Sources

Every claim in the app is anchored in classical Sunni sources — Bukhari, Muslim, Ibn Hisham, *Al-Rahiq Al-Makhtum*, *Zad al-Maad*, *Dala'il al-Nubuwwah*, *Al-Mustadrak*, and *Al-Shifa*. See [`docs/SOURCES.md`](docs/SOURCES.md) for a full bibliography and the citation methodology.

## 🛣️ Roadmap

- [ ] Add a Leaflet map layer that reads `timeline_data.geojson` and links each marker to its step.
- [ ] Add more events: Battle of Uhud, Battle of the Trench (Khandaq), Treaty of Hudaybiyah, Conquest of Makkah.
- [ ] PWA manifest + service worker for offline use.
- [ ] Print / PDF export of a single step.
- [ ] Share button — copy a link like `?event=badr&step=2`.
- [ ] URL routing (deep links) and back/forward navigation.

## 🤝 Contributing

PRs are welcome. Read [`CONTRIBUTING.md`](CONTRIBUTING.md) for the contribution guide, code style, and the recipe for adding a new event or a new language.

## 📜 License

This project is released under the **MIT License** for the code (see [`LICENSE`](LICENSE)).
The bilingual narrative content is derived from classical Islamic sources that are themselves in the public domain — see [`docs/SOURCES.md`](docs/SOURCES.md) for the full attribution.
Quranic verses are the word of Allah and are not subject to copyright.

---

حسنة جارية — اللهم اجعله في ميزان حسناتنا
