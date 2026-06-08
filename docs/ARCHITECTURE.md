# Architecture

This document explains how the Islamic Timeline app is put together — for developers who want to extend it, debug it, or port it to another platform.

> For data shapes, see [`DATA_SCHEMA.md`](DATA_SCHEMA.md).
> For the Islamic sources used, see [`SOURCES.md`](SOURCES.md).

## 1. High-level overview

The app is a **single-page, no-build, vanilla-JS** web app. It is intentionally simple:

- One `index.html` entry point.
- One `style.css` file with all styling.
- One `app.js` file with all behaviour.
- One `data.js` file with all bilingual content.
- One `timeline_data.geojson` file with the geographic dataset.

There is no bundler, no framework, no npm runtime dependency, no TypeScript. The only Node tool used is `npx serve` for local development.

## 2. File responsibilities

| File | Role |
|------|------|
| `index.html` | Document structure. Loads fonts, CSS, `data.js`, then `app.js`. Inlines ten `<svg>` maps (one per era). Holds the bilingual `data-ar` / `data-en` attributes for every user-facing string in the chrome. |
| `style.css`  | All visual styling, organised by component: header → wrap → map panel → story panel → timeline footer. |
| `data.js`    | The content of the app. Exposes a single global `window.SEERAH_DB` with ten events (`preb`, `meccan`, `hijra`, `badr`, `medinan`, `abubakr`, `umar`, `uthman`, `ali`, `hasan`) and their step arrays. |
| `app.js`     | All behaviour. State management, rendering, navigation, language toggle, and the Google TTS audio engine. |
| `timeline_data.geojson` | Pure spatial data, ready to be loaded by Leaflet / MapLibre / QGIS / Google Earth. |

## 3. Boot sequence

```
browser GETs index.html
   │
   ├─ loads fonts.googleapis.com (Amiri, Cairo, Inter)
   ├─ loads style.css
   └─ <script src="data.js">  →  window.SEERAH_DB is now defined
       <script src="app.js">   →  app.js IIFE starts
                                    │
                                    ├─ reads localStorage['sera.lang'] (or 'AR')
                                    ├─ init() wires DOM listeners
                                    └─ applyLanguage() repaints the page
```

`applyLanguage()` is the only function that touches the DOM. Every other operation funnels back into `render()`, which in turn reads the current state and re-paints the relevant slots.

## 4. State model

Three values, all module-local to the IIFE in `app.js`:

```js
let EVT  = 'preb' | 'meccan' | 'hijra' | 'badr' | 'medinan'
         | 'abubakr' | 'umar' | 'uthman' | 'ali' | 'hasan';   // current event
let STEP = 0..n;                // current step within that event
let LANG = 'AR' | 'EN';         // current language
```

`LANG` is persisted in `localStorage` under the key `sera.lang`. `EVT` and `STEP` are intentionally **not** persisted — the user should land on a fresh view of the first event.

When the user reloads, `LANG` is restored, `EVT` defaults to `'hijra'`, and `STEP` is `0`.

## 5. Render pipeline

`render()` is the only DOM-painting function. It:

1. Reads the current `EVT`, `STEP`, `LANG`.
2. Looks up the matching step in `DB[EVT].steps[STEP]`.
3. Fills in:
   - Ayah box (Arabic verse + Surah ref).
   - Stage badge and date chip.
   - Title and description (with a tiny re-flow animation).
   - Characters list (avatar + name + role).
   - Lesson box.
   - Sources list.
   - Map badges (time-of-day and distance).
   - Map card overlay.
   - Map ambient gradient (`amb-night` / `amb-dawn` / `amb-day`).
4. Updates the map state:
   - For **Hijra**: sets `stroke-dashoffset` on the animated route, and toggles `act` / `vis` classes on the six route nodes.
   - For **Badr**: shows/hides well blocks, the cistern, the battle clash icon, and the active camp marker.
5. Updates the timeline strip (`tl-fill` width, `tl-nodes` dot states).
6. Updates the prev/next button disabled states.

The render function is **idempotent** — calling it twice with the same state yields the same DOM. It does not accumulate side effects.

## 6. Language toggle mechanism

Every element that contains a user-facing string is tagged with `data-ar` and `data-en`:

```html
<h2 data-ar="الوصول — تأسيس الدولة والحضارة"
    data-en="The Arrival — Founding a Nation">…</h2>
```

`applyLanguage()` simply does:

```js
document.querySelectorAll('[data-ar][data-en]').forEach(el => {
  el.textContent = (LANG === 'AR') ? el.dataset.ar : el.dataset.en;
});
```

This works for HTML elements *and* SVG elements, since both implement the `dataset` property in modern browsers. All ten SVG maps therefore fully translate on the same click that translates the story panel.

Dynamic content (steps, characters, lessons) lives in `data.js` and is read with the helper:

```js
const t = (key) => (LANG === 'AR' ? key + 'Ar' : key + 'En');
// s[t('title')], s[t('desc')], s[t('chars')], …
```

## 7. Audio system

There are **two TTS modes** (toggled by `#btn-mode`): `narrate` (the story) and `verse` (the Quranic ayah). The default is `narrate`.

### 7a. Narration — pre-generated neural MP3s (the primary path)

Story narration plays **static MP3 files** generated offline with Microsoft's free neural voices (via `tools/gen_tts.py` → `edge-tts`). This is the quality anchor: every visitor, on every browser, hears the same warm voice — and it works fully offline, under `file://`, and on GitHub Pages with **no API key, no backend, no runtime dependency**.

- Files live at `audio/<slot>/<era>_<step>_<lang>.mp3` (e.g. `audio/classic/hijra_0_ar.mp3`).
- The listener picks one of **four voice slots** via the 🎙️ picker (`#btn-voice`), persisted to `localStorage['sera.voice']`:

  | Slot | Arabic voice | English voice |
  |---|---|---|
  | `classic` | ar-SA-HamedNeural | en-US-GuyNeural |
  | `gentle`  | ar-SA-ZariyahNeural | en-US-AriaNeural |
  | `story`   | ar-EG-SalmaNeural | en-US-JennyNeural |
  | `warm`    | ar-EG-ShakirNeural | en-GB-RyanNeural |

- `playVerse()` builds the URL via `narrationURL()` and tries it first. **A missing file fires `Audio.onerror`**, which is what drives the fallback — so the app degrades gracefully and audio can be rolled out incrementally. (We deliberately do *not* `fetch('audio/manifest.json')` at runtime, because `fetch` of a local file is blocked under `file://` in Chrome; `Audio` is not.)
- The `-8%` storytelling pace is baked into the files, so they play at `playbackRate = 1.0`.
- To regenerate after editing narration text: `python tools/gen_tts.py [--eras …] [--force]` (idempotent — skips existing files).

### 7b. Verse recitation — real reciter audio

`verse` mode plays **genuine Qārī recitation** streamed from [everyayah.com](https://everyayah.com), not TTS. `verseAudioURLs(step, reciterId)` parses the surah number and ayah range out of `step.ayahRefEn` (reliably formatted `"Surah <Name> (<num>), verse(s) <n>[-<m>]"`) and builds one zero-padded `https://everyayah.com/data/<dir>/<sss><aaa>.mp3` per ayah. `playSequence()` plays them back-to-back (so a 2-ayah verse recites both), guarded by `isPlaying` + the play token so Stop / navigation cancels cleanly.

The 🎙️ picker is **context-aware** (`pickerList()` / `pickerCurrentId()`): in `verse` mode it offers **reciters** (`RECITERS`: Alafasy ·default·, Husary, Abdul Basit, Minshawy, Sudais — persisted to `sera.reciter`); in `narrate` mode it offers the four narration **voices** (`VOICE_SLOTS` — persisted to `sera.voice`).

### 7c. No live TTS

There is **no live text-to-speech fallback**. The old Web Speech (`speechSynthesis`) and Google `translate_tts` engines were removed: they sounded robotic in both languages and, being a single system voice, ignored the chosen narration voice — so the picker selection didn't match what played. When the primary source is unavailable (a narration MP3 not present, a non-Quran "verse" step, or the recitation CDN unreachable), `playVerse()` shows a brief bilingual "audio not available" `#diag` notice and stops — it never substitutes a synthetic voice.

### 7d. Robustness notes

- `playVerse()` is guarded by a monotonically increasing **play token**; a stale stuck-state timeout (180 s backstop) can never stop a newer playback.
- Each voice slot maps to a **different neural voice per language** (`labelAr`/`labelEn`), so the dropdown always names the voice actually playing — Arabic clip ≠ English clip within the same slot.

## 8. Keyboard shortcuts

| Key | Action |
|-----|--------|
| `ArrowRight` / `ArrowDown` | Next step (auto-flips for RTL — left arrow = "forward" in Arabic) |
| `ArrowLeft`  / `ArrowUp`   | Previous step |
| `Space` | Toggle verse playback |
| `L`     | Toggle language (AR ↔ EN) |

Shortcuts are global except when the focus is inside an `<input>`, `<select>`, or `<textarea>`.

## 9. SVG map system

Both maps are inlined in `index.html` rather than fetched. The trade-offs:

| Inlined | External |
|---|---|
| Works under `file://` (no CORS) | Requires a server |
| One fewer HTTP request | Cleaner separation of concerns |
| Slightly larger `index.html` | Smaller HTML, can be cached |

### Hijra map
- `viewBox="0 0 700 560"`, `direction: ltr` to keep route math intuitive.
- Two layered paths: `h-route-base` (faint baseline) and `h-route-anim` (animated with `stroke-dashoffset`).
- Six clickable nodes (`hnode-0` … `hnode-5`) plus a small Quba dot.
- Step-indexed `offsets[]` array in `data.js` controls how much of the route is drawn at each step:
  ```
  step 0 → 1400 (none visible)
  step 5 →    0 (fully drawn)
  ```

### Badr map
- `viewBox="0 0 700 500"`.
- Two wells (`bwell-1`, `bwell-2`) with overlay blocks (`bblock-1`, `bblock-2`) that appear from step 1 onwards.
- A cistern rectangle (`b-cistern`) appears from step 1.
- A battle-clash ring (`b-clash`) appears at step 2.
- The two march arrows thicken at step 2 to indicate contact.

## 10. Adding a new event

See [`../CONTRIBUTING.md`](../CONTRIBUTING.md#adding-a-new-event) for the step-by-step recipe. The short version:

1. Add a new key to `window.SEERAH_DB` in `data.js`.
2. Add a switcher `<button class="ev-btn" data-ev="…">` to `index.html`.
3. Add a new `<svg id="svg-…">` to `index.html` (or reuse an existing pattern).
4. Update `switchEv()` in `app.js` to toggle the new map.
5. Add a `Feature` to `timeline_data.geojson`.
6. Update `CHANGELOG.md`.

## 11. Performance notes

- `index.html` is ~113 KB, `style.css` ~43 KB, `app.js` ~33 KB, `data.js` ~278 KB. Total ~470 KB uncompressed for the core app.
- The ten inline SVG maps account for the bulk of the HTML.
- Pre-generated narration audio under `audio/` is ~140 MB total (~0.2 MB per clip); each clip is loaded only on demand when the user presses play.
- All assets are static and cacheable. GitHub Pages serves them with `Cache-Control: public, max-age=600`.
- The only external network call is the per-ayah Quran recitation from everyayah.com in verse mode (fired on user gesture); narration plays the committed local MP3s.
- A local serve (`npx serve .`) handles ~200 concurrent clients in testing on a single core.

## 12. Browser support

Tested on:
- Chrome / Edge 120+ (Windows, macOS, Android)
- Firefox 121+
- Safari 17+ (macOS, iOS)

The app uses:
- `localStorage` (universal).
- `Audio` (universal) — plays the pre-recorded MP3s / recitation.
- SVG with `data-*` attributes (universal).

There is no IE support, no transpilation, no polyfills.

---

حسنة جارية — اللهم اجعله في ميزان حسناتنا
