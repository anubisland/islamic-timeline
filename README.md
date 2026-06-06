# Madani Era Timeline (الخط الزمني للعهد المدني)

A **bilingual (Arabic / English) interactive website** that walks through the key events of the **Madani Era** in Islamic history: the **Hijra** (٦ مراحل) and the **Battle of Badr** (٣ مراحل). Each step presents a unique Quranic verse, the historical narrative, key figures, leadership lessons, and authoritative sources from the classical Seerah literature.

> Pure HTML / CSS / vanilla JavaScript. **No build step.** Open `index.html` in a browser, or serve the folder with any static server.

## Live Demo

**https://anubisland.github.io/madani-era-timeline-app/**

## Features

- 🟢 **Emerald + gold** Islamic visual identity (`#063529` / `#C5A059`)
- 🗺️ **Two interactive SVG maps** — the Hijra route and the tactical Badr battlefield — with animated route drawing
- 🌐 **Full bilingual UI** — Arabic (RTL) and English (LTR) toggle, persists in `localStorage`
- 📖 **Per-step Quranic verse** in Arabic + English translation, with Surah reference
- 🔊 **Audio recitation** — Google TTS reads each verse aloud (Arabic), with `speechSynthesis` fallback
- 🎯 **9 chronological stages** across 2 events (6 Hijra + 3 Badr)
- 👥 **Key figures** for each stage — names, roles, historical context
- 💡 **Leadership lessons** drawn from each event
- 📚 **Authoritative sources** — Sahih al-Bukhari, Sahih Muslim, Ibn Hisham's *Sirah*, *Al-Rahiq Al-Makhtum*, *Zad al-Maad*, *Dala'il al-Nubuwwah*
- 🗺️ **GeoJSON dataset** of all 9 event locations (ready for any map library)
- ⌨️ **Keyboard shortcuts** — arrow keys, space (play), L (language)
- 📱 **Fully responsive** — mobile / tablet / desktop

## Project Structure

```
Sera/
├── index.html              # Main app entry point
├── style.css               # All styling (emerald + gold theme)
├── app.js                  # State, render, navigation, audio, language toggle
├── data.js                 # Bilingual data module (window.SEERAH_DB)
├── timeline_data.geojson   # 9 event locations with coordinates
├── package.json            # Optional, for `npm start` (uses npx serve)
├── .gitignore
└── README.md
```

## Getting Started

### Option 1 — Open directly
Double-click `index.html`. The site works fully from the `file://` protocol.

### Option 2 — Local static server (recommended for audio)
```bash
npm start
# or
npx serve .
```
Then open the printed URL (usually http://localhost:3000).

> A static server is recommended so Google TTS requests aren't blocked by some browser file:// policies.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` / `→` | Previous / Next step (auto-flips with RTL) |
| `↑` / `↓` | Previous / Next step |
| `Space` | Play / pause verse recitation |
| `L` | Toggle language (AR ↔ EN) |

## Data Schema

### `data.js` — `window.SEERAH_DB`
```js
SEERAH_DB = {
  hijra: {
    labelAr, labelEn,
    mapLabelAr, mapLabelEn,
    offsets: [1400, 1150, 820, 500, 220, 0],   // SVG route dashoffset per step
    steps: [
      {
        ayah, ayahRef,         // Arabic Quranic verse + Surah ref
        ayahEn, ayahRefEn,     // English translation + ref
        titleAr, titleEn,
        descAr, descEn,
        dateAr, dateEn,
        charsAr, charsEn,      // [{i, n, r}]  icon, name, role
        lessonAr, lessonEn,
        mtAr, mtEn,            // map card title
        mdAr, mdEn,            // map card description
        amb,                   // 'night' | 'dawn' | 'day'
        timeAr, timeEn,
        distAr, distEn,
        srcs: []               // sources (same both languages)
      }
    ]
  },
  badr: { /* same structure, 3 steps */ }
}
```

### `timeline_data.geojson`
Standard GeoJSON `FeatureCollection`. Each feature has:

| Field            | Description                            |
|------------------|----------------------------------------|
| `id`             | Unique location identifier             |
| `event_id`       | Links to a step (e.g. `hijra_0`, `badr_2`) |
| `name_ar`        | Arabic location name                   |
| `name_en`        | English location name                  |
| `year_ah`        | Hijri year                             |
| `event_title_ar` | Arabic event title                     |
| `event_title_en` | English event title                    |
| `coordinates`    | `[longitude, latitude]`                |

## Roadmap

- [ ] Add a Leaflet map layer that reads `timeline_data.geojson`
- [ ] Add more events: Uhud, Khandaq, Hudaybiyah, Conquest of Makkah
- [ ] PWA manifest + service worker for offline use
- [ ] Print / PDF export of a single step
- [ ] Share button (copy link with `?event=badr&step=2`)

## License

Content (verses, narratives, lessons) is in the public domain — derived from classical Islamic sources.
Code is open-source; feel free to fork, modify, and re-publish with attribution.

---

حسنة جارية — اللهم اجعله في ميزان حسناتنا
