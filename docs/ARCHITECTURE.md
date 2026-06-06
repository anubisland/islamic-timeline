# Architecture

This document explains how the Madani Era Timeline app is put together — for developers who want to extend it, debug it, or port it to another platform.

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
| `index.html` | Document structure. Loads fonts, CSS, `data.js`, then `app.js`. Inlines two `<svg>` maps. Holds the bilingual `data-ar` / `data-en` attributes for every user-facing string in the chrome. |
| `style.css`  | All visual styling, organised by component: header → wrap → map panel → story panel → timeline footer. |
| `data.js`    | The content of the app. Exposes a single global `window.SEERAH_DB` with two events (`hijra`, `badr`) and their step arrays. |
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
let EVT  = 'hijra' | 'badr';   // current event
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

This works for HTML elements *and* SVG elements, since both implement the `dataset` property in modern browsers. The two SVG maps therefore fully translate on the same click that translates the story panel.

Dynamic content (steps, characters, lessons) lives in `data.js` and is read with the helper:

```js
const t = (key) => (LANG === 'AR' ? key + 'Ar' : key + 'En');
// s[t('title')], s[t('desc')], s[t('chars')], …
```

## 7. Audio system

The app uses **Google Translate TTS** for the Quranic verse recitation:

```
https://translate.google.com/translate_tts?ie=UTF-8&q=…&tl=ar&client=tw-ob
```

Pros
- Works on iOS, Android, and desktop browsers with no extra install.
- Excellent Arabic pronunciation, including Tajweed.

Cons
- Requires an internet connection.
- The `q` parameter is silently truncated to ~200 characters — long verses are clipped.
- The endpoint is unofficial and may rate-limit or be retired.

**Fallback path**: if `new Audio(url).play()` rejects, the app calls `window.speechSynthesis.speak()` with `lang = 'ar-SA'` and a slower rate. This uses the OS-bundled voice (good on Windows + Edge, often missing on Linux Chrome).

The audio engine is intentionally minimal:
- No karaoke word highlighting.
- No waveform visualizer.
- No voice picker modal.
- No "pre-roll" banner.

These were dropped from the v7 reference implementation to keep the public site lightweight and focused. The trade-off is a smaller bundle and fewer moving parts, at the cost of a less theatrical audio experience.

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

- `index.html` is ~25 KB, `style.css` ~18 KB, `app.js` ~12 KB, `data.js` ~32 KB. Total ~88 KB uncompressed.
- The two SVG maps account for ~13 KB of the HTML.
- All assets are static and cacheable. GitHub Pages serves them with `Cache-Control: public, max-age=600`.
- The Google TTS request is the only external network call (and only fires on user gesture).
- A local serve (`npx serve .`) handles ~200 concurrent clients in testing on a single core.

## 12. Browser support

Tested on:
- Chrome / Edge 120+ (Windows, macOS, Android)
- Firefox 121+
- Safari 17+ (macOS, iOS)

The app uses:
- `localStorage` (universal).
- `Audio` (universal).
- `speechSynthesis` (universal; Arabic voice quality varies by OS).
- SVG with `data-*` attributes (universal).

There is no IE support, no transpilation, no polyfills.

---

حسنة جارية — اللهم اجعله في ميزان حسناتنا
