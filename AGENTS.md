# AGENTS.md — Project Briefing for AI Coding Agents

> **Repo:** `anubisland/madani-era-timeline-app` — public, GitHub Pages from `main`.
> **Live:** https://anubisland.github.io/madani-era-timeline-app/

## What this project is

A **single-page, no-build, vanilla-JS** bilingual (Arabic RTL / English LTR) timeline of the Prophet's biography. **4 eras / 36 stages**:

| Key | Era | Steps |
|---|---|---|
| `meccan` | Meccan Era (570 CE → eve of Hijra) | 16 |
| `hijra`  | The Hijra | 6 |
| `badr`   | Battle of Badr | 3 |
| `medinan`| Medinan Era (1 – 11 AH) | 11 |

## File map

```
Sera/
├── index.html              # Entry — UI + 4 inline SVG maps
├── style.css               # Emerald (#063529) + gold (#C5A059) design system
├── app.js                  # All behaviour: language toggle, switchEv, step nav, TTS
├── data.js                 # Bilingual data module — window.SEERAH_DB
├── timeline_data.geojson   # 24 geographic features (one per major location)
├── package.json            # version + npm start (npx serve)
├── README.md               # User-facing docs
├── CHANGELOG.md            # Keep-a-Changelog, semver
├── CONTRIBUTING.md         # How to add a step / era
├── LICENSE                 # MIT
├── docs/
│   ├── ARCHITECTURE.md
│   ├── BUGS.md               # Catalogue of bugs & lessons learned — READ FIRST
│   ├── DATA_SCHEMA.md
│   └── SOURCES.md
└── .editorconfig
```

## Hard rules (DO NOT violate)

1. **No build step, no framework, no npm runtime dependency.** The site must work from `file://` AND from any static host.
2. **No new files unless necessary.** Edit existing files; add files only when adding a new era/map with its own SVG.
3. **Every UI string has a `data-ar` and `data-en` pair.** Verify with a regex sweep after editing `index.html`.
4. **All content must be sourced from the Ahl al-Sunnah wal-Jama'ah canon.** This is non-negotiable. The accepted reference list (see `docs/SOURCES.md`) includes: the Six Books (Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i, Ibn Majah) + Musnad Ahmad + Muwatta Malik; classical Sirah (Ibn Hisham, Ibn Ishaq, al-Waqidi, al-Tabari, Ibn Kathir's al-Bidayah); later Sunni scholars (Ibn al-Qayyim's Zad al-Ma'ad, al-Bayhaqi's Dala'il al-Nubuwwah, al-Qadi Iyad's al-Shifa, Ibn Hajar, al-Nawawi); modern Sunni scholarship (Mubarakpuri's al-Rahiq al-Makhtum, Zurqani on al-Mawahib, Dr. Hamidullah). **Do not** introduce narrations that are weak (da'if) without grading, fabricated (mawdu'), or sourced from non-Sunni collections (e.g. al-Kafi, al-Sahifa al-Sajjadiyya, Bihar al-Anwar). If a hadith is graded weak, the source chip must note the grade.
5. **MIT license for code; classical Seerah content stays public domain with citations.** Never remove a `srcs[]` entry.
6. **Single state object** in `app.js`: `{ EVT, STEP, LANG }`. No new globals.
7. **Commit format: Conventional Commits.** `feat:` / `fix:` / `docs:` / `style:` / `refactor:`.
8. **Update `CHANGELOG.md` and bump `package.json` version** in the same commit that changes behaviour.
9. **Do not commit secrets, .env files, or `node_modules/`.**

## Adding a step (most common task)

1. Open `data.js` and find the event object (e.g. `meccan.steps[]`).
2. Append a step object with **all** these fields (string-empty `""` is fine for `ayah` / `ayahRef`):
   ```
   ayah, ayahRef, ayahEn, ayahRefEn,
   dateAr, dateEn,
   titleAr, titleEn,
   mtAr, mtEn, mdAr, mdEn,
   amb,                 // "day" | "dawn" | "noon" | "night" | "winter"
   timeAr, timeEn, distAr, distEn,
   descAr, descEn,
   charsAr[], charsEn[], // { i, n, r } per figure
   lessonAr, lessonEn,
   srcs[]                // ["البخاري (…)", "مسلم (…)", ...]
   ```
3. If the step has a new map location, append a feature to `timeline_data.geojson` with `event_id: "<era>_<stepIndex>"`.
4. Bump the event's `stepCount` description in CHANGELOG only if adding an era.

See `docs/DATA_SCHEMA.md` for the canonical field reference.

## Adding an era (rare)

1. Add a new key to `window.SEERAH_DB` in `data.js` (insert in chronological order: meccan → hijra → badr → medinan).
2. Add a `<button class="ev-btn" data-ev="<key>" ...>` to `index.html`'s `.event-switch`.
3. Add an inline `<svg id="svg-<key>" class="map-svg hidden" ...>` to `index.html` directly after `svg-badr`.
4. Extend `app.js` `switchEv()` to toggle the new SVG (mirror the existing 4 lines).
5. Bump `package.json` minor version. Add a CHANGELOG entry.

## Build / verify commands

```bash
# Serve locally
npm start                 # alias for: npx --yes serve .

# Quick JS validation (no build needed)
node -e "new Function(require('fs').readFileSync('data.js','utf8'))"

# GeoJSON validation
node -e "JSON.parse(require('fs').readFileSync('timeline_data.geojson','utf8'))"
```

There is **no test framework, no linter, no formatter** in this project. Visual verification is by opening `index.html` in a browser.

## Mobile checklist (verify before merging UI changes)

- [ ] Event switcher wraps to 2×2 grid on ≤720px screens
- [ ] All buttons have ≥44px tap target
- [ ] Map SVG height capped at 50vh on small screens (no horizontal scroll)
- [ ] Ayah box font scales: 1.05rem AR / 0.85rem EN on phones
- [ ] `data-ar` / `data-en` labels present in every new SVG `<text>` element

## Don'ts

- ❌ Don't add a bundler, transpiler, or framework (React, Vue, Alpine, etc.)
- ❌ Don't introduce a runtime npm dependency
- ❌ Don't replace inline SVGs with raster images (PNG/JPG) — keep vector for zoom
- ❌ Don't remove bilingual parallel fields when "refactoring" — they are the feature
- ❌ Don't commit the `node_modules/` from `npx serve` — use `npx --yes serve .` so it stays ephemeral
- ❌ Don't push directly to `main` if changes break the live site; the only reviewer is GitHub Pages itself

## Reference: `data-ar` / `data-en` sweep

After editing `index.html`, run this from a one-off Node session to confirm every `data-ar` has a `data-en`:

```js
const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');
const ar = (h.match(/data-ar=/g) || []).length;
const en = (h.match(/data-en=/g) || []).length;
console.log({ ar, en, ok: ar === en });
```

## 🐛 Catalogue of Fixed Bugs (Lessons Learned)

> **IMPORTANT**: Before debugging a visual bug, always check **`z-index`** and **`position: fixed`** elements first. The most persistent bug in this project was a `z-index: 9999` diagnostic badge.

### The "Green Strip" saga (v2.7.0 → v2.9.0) — 10+ false fixes

The green strip at the bottom of the splash screen was the single most expensive bug in this project. Here is the full chronology:

| Attempt | Fix | Result |
|---------|-----|--------|
| v2.7.1 | CSS `.splash-hidden` class | FAILED — strip visible |
| v2.7.2 | Inline `style="display:none"` on footer | FAILED |
| v2.7.3 | `element.style.display = 'none'` in JS | FAILED |
| v2.7.4 | `style.setProperty('display', 'none', 'important')` in JS | FAILED |
| v2.7.5 | Remove footer from HTML, create dynamically | FAILED |
| v2.8.0 | CSS-only: `#splash:not(.hidden) ~ .tl-foot` | FAILED |
| v2.8.1 | Body bg + theme-color match splash bg | FAILED |
| v2.8.2 | Critical CSS inlined in `<head>` | FAILED |
| v2.8.3 | `overflow: hidden` + `100dvh` on splash | FAILED |
| **v2.9.0** | **`.focus-diag { display: none }`** | **SOLVED** ✓ |

**Root cause**: The `<div id="focus-diag" class="focus-diag">` diagnostic badge was created to debug map focus coordinates. It has:
- `position: fixed; bottom: 12px; z-index: 9999;`
- `background: rgba(6, 53, 41, 0.85)` — **dark emerald green**
- `padding: 6px 12px; border: 1px solid rgba(197, 160, 89, 0.4);`

Even **empty** (no text content), its padding + green background + border renders as a visible green rectangle at the bottom of EVERY page, including the splash. Its `z-index: 9999` places it **above** the splash (`z-index: 100`).

**Lesson**: Any `position: fixed` element with `z-index > 100` or `z-index: 9999` that has a colored background MUST have `display: none` by default. Show it only when needed.

### Other fixed bugs

| Bug | Root Cause | Fix |
|-----|-----------|-----|
| **Timeline dots missing on mobile** (v2.4.7–2.5.3) | Footer too tall, green strip covering dots | Reordered footer: dots first, strip second. Added `env(safe-area-inset-bottom)`. Tightened all padding. |
| **Audio (TTS) not working** (v2.4.2) | Web Speech silent failure not detected; Google TTS blocked by CORS | Web Speech API first with 30s timeout + boolean `__ttsStarted` flag. Google TTS fallback with 2 URL endpoints. |
| **Map focus at wrong position** (v2.4.3) | `mapFocus {x,y}` hardcoded incorrectly for 7+ steps | Re-anchored all 36 focus coordinates to SVG node centers |
| **Wrong map title** (v2.4.5) | Duplicate `#map-label` elements in HTML | Removed duplicate; only one `#map-label` remains |
| **Cyrillic text corruption** (v2.5.0) | UTF-8 byte sequence `d1 82 d0 be ...` instead of Arabic | Replaced corrupted bytes with correct Arabic UTF-8 |
| **Quranic verses wrong** (v2.4.1) | 6 ayahs paired generically, not by occasion | Replaced with event-matched ayahs (asbāb al-nuzul) |
| **Language not reflected in SVGs** (v2.4.5) | Hardcoded Arabic in `<text>` elements without `data-ar`/`data-en` | Added bilingual pairs to all 5 maps |
| **Splash content too tall** (v2.7.2) | 10 cards + header + footer in single column | Reduced padding/font at each breakpoint; hides subtitle/divider at ≤360px |
| **Timeline strip missing on load** (v2.4.3) | `buildTimeline()` not called from `init()` | Added call to `buildTimeline()` in `init()` before `applyLanguage()` |
| **Map zoom controls reversed** (v2.9.1) | Click handlers had `zoomIdx--` on zIn (+ button) and `zoomIdx++` on zOut (- button) — opposite of correct pan/zoom math | Swapped directions: `zoomIdx++` on zIn (smaller viewBox = zoom in), `zoomIdx--` on zOut (larger viewBox = zoom out) |

### Debugging methodology for future agents

1. **Isolate by elimination**: `#splash, #splash * { background: #060b0f !important; }` — if the bug disappears, it's INSIDE the splash. Remove rules one by one to find the specific element.
2. **Check z-index FIRST**: Any `z-index > 100` with `position: fixed` can render above the splash. Search for `z-index: 9` in CSS.
3. **Use `:not(.hidden)` for CSS-only visibility control**: The `~` sibling combinator only works for elements AFTER the reference in DOM order.
4. **Inline critical CSS in `<head>`**: External stylesheets (`style.css`) can be overridden by later rules, but inline `<style>` in `<head>` before `<link rel="stylesheet">` ensures it's available on first paint.
5. **Verify on the LIVE site**: Always `webfetch` the deployed HTML/CSS/JS to confirm the fix is actually pushed and deployed.
