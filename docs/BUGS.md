# Bugs Encountered & Lessons Learned

> A living catalogue of every bug hit while building `madani-era-timeline-app` (v2.0 → v2.4.5), with the **root cause**, the **fix**, and the **rule** to follow so the same mistake does not happen again. Read this **before** touching the code.

> For architecture, see [`ARCHITECTURE.md`](ARCHITECTURE.md).
> For data shape, see [`DATA_SCHEMA.md`](DATA_SCHEMA.md).
> For Islamic sourcing rules, see [`SOURCES.md`](SOURCES.md).

---

## A. Map ↔ Step ↔ Audio sync (the most-reported bug class)

The user reported "the map and the narration don't match" **five times** in a row. Each report was treated as a new bug. They were all the same root cause (or close cousins). **Read this section before changing `applyMapFocus`, `playVerse`, or the timeline strip.**

### A1. `mapFocus` coordinates did not match the actual SVG node positions (root cause of every desync report)

- **Symptom**: the gold-ring focus pulse appeared near the *wrong* landmark for many steps (e.g. the pulse for "Suraqah's chase" appeared near Madinah, not near Suraqah).
- **Root cause**: the `mapFocus: { x, y }` values in `data.js` were hand-estimated from screenshots, never verified against the actual `<g id="hnode-X">` / `<g id="bnode-X">` / `<g id="mnode-X">` / `<g id="mednode-X">` `transform="translate(x,y)"` values in `index.html`. Several were off by 30–160 px.
- **Fix (v2.4.3)**: re-anchored **all 36** `mapFocus` values to the actual SVG node centers. The corrected values are listed in `CHANGELOG.md` v2.4.3.
- **Rule — must-follow**:
  - Whenever you add a new step, the step's `mapFocus.x` / `mapFocus.y` **must be copied verbatim from the SVG node's `transform="translate(?, ?)"` attribute in `index.html`**. Do not eyeball it. Do not write "close enough".
  - Whenever you move a node in the SVG (change its `transform`), you **must** update the corresponding `mapFocus` for every step that points to it.
  - Add a quick check script under `C:\Users\melwa\AppData\Local\Temp\opencode\` that prints the diff between `mapFocus` and `transform` for review.
  - This bug-class is the #1 reason the project has so many "desync" reports in CHANGELOG.

### A2. `buildTimeline()` was never called on initial page load

- **Symptom**: the timeline strip (numbered dots + per-step labels) appeared on later visits but was missing on the first load. The user has reported this at least three times.
- **Root cause**: `buildTimeline()` was only called from inside `switchEv()`. On first load, `init()` set the static `#tl-counter` and never populated `#tl-nodes`, so the strip was empty until the user clicked any prev/next button (which doesn't rebuild the strip — only `switchEv` does).
- **Fix (v2.4.3)**: `init()` now calls `buildTimeline()` before `applyLanguage()`. `applyLanguage()` also calls it so language toggles refresh the label text.
- **Rule — must-follow**:
  - Anything that depends on `EVT` or `STEP` and is normally rebuilt on `switchEv`/`goTo` must also be called from `init()`. The "is built only on switch" assumption is the most expensive footgun in this codebase.
  - A `goTo(i)` call from `init()` (because the URL hash says "step 3") would be a worse variant of this bug.

### A3. TTS silent-failure detection used a broken `Date.now()` heuristic

- **Symptom**: pressing the play button produced *zero* audio. No error in the console. No diag banner. The user reported "I press play and nothing happens" repeatedly.
- **Root cause**: the old code did
  ```js
  window.__ttsStart = Date.now();
  // ...
  u.onend = () => {
    if (Date.now() - window.__ttsStart < 600) { /* silent failure */ }
  };
  ```
  But `__ttsStart` was set *only inside `onstart`*, not before `speak()`. On silent failure, `onstart` never fires, so `__ttsStart` stays `0` and the delta is `Date.now() - 0 ≈ 1.7 × 10¹²` — never under 600. The fallback to Google TTS **never** ran.
- **Fix (v2.4.2)**: replaced with a boolean `__ttsStarted` flag. Set `true` inside `onstart`, checked inside `onend`. If `onend` fires without `onstart` having fired → silent failure → try Google TTS fallback.
- **Rule — must-follow**:
  - **Never** use `Date.now()` deltas to detect a flag that should be a boolean. Use a boolean.
  - Whenever you call `speak()` and want to know whether the engine actually started, listen to `onstart` and set a flag, then check that flag in `onend` or a timeout. The `Date.now()` delta pattern is a trap on every browser.
  - **Always** have a fallback. Web Speech on Windows Chrome has no Arabic voice installed by default. The fallback path (`googleTTS`) is not optional — it's the only thing that produces sound for most users.

### A4. English voice fallback was missing

- **Symptom**: TTS worked in Arabic, failed silently in English (or vice-versa) depending on the system. User assumed "the play button is broken".
- **Root cause**: only `pickArabicVoice()` existed. English had no equivalent `pickEnglishVoice()`.
- **Fix (v2.4.2)**: added `pickEnglishVoice()` (Microsoft Zira / David / Google US English / any `en-*` lang), mirror of the Arabic picker.
- **Rule — must-follow**:
  - Every new language picker must be a mirror of `pickArabicVoice()` — match by lang code first, then by substring of voice name as a backup.

### A5. User-gesture warm-up for the very first `speak()` call

- **Symptom**: even after fixing the silent-failure detection, the very first click on play produced no sound on some Chrome configurations.
- **Root cause**: a Chromium quirk — the first `speak()` inside a user-gesture handler is sometimes swallowed on cold start (engine not yet "unlocked").
- **Fix (v2.4.2)**: in the play-button click handler, issue a zero-volume `SpeechSynthesisUtterance(' ')` *before* the real utterance. Acts as a warm-up.
- **Rule — must-follow**:
  - Do not remove the warm-up. It is the only thing that makes TTS work on first-click for ~10% of users.
  - The warm-up must be inside the user-gesture handler (click), not async/deferred.

---

## B. Map / SVG bugs

### B1. Duplicate `id="map-label"` element

- **Symptom**: every era showed "خريطة رحلة الهجرة النبوية" as the map title, regardless of the active event. Switching to Medinan Era, Badr, or Meccan still showed the hijra title.
- **Root cause**: `index.html` had **two** elements with `id="map-label"`: one inside the proper `.map-topbar` (line 63) and an orphan further down in the page body. `document.getElementById('map-label')` returns the *first* match, so `switchEv()` updated the invisible first one; the user saw the hardcoded second one.
- **Fix (v2.4.5)**: removed the duplicate. Only the first `#map-label` remains, and `switchEv()` updates it via `data-ar` / `data-en` attributes (refreshed on every event switch, re-translated by `applyLanguage()`).
- **Rule — must-follow**:
  - **`id` attributes must be unique across the entire HTML document, including SVG**. The browser does not warn about duplicate IDs but only `getElementById` will pick the first match. This bug is invisible to the developer and very visible to the user.
  - Before adding any new element, run `grep -n 'id="X"' index.html` to confirm the id is unique.
  - For text content that depends on the active era/event, prefer `data-ar` / `data-en` attribute pairs (so `applyLanguage()` handles the language toggle) over setting `textContent` from JS in one function only.

### B2. Hardcoded Arabic inside SVG `<text>` elements (bilingual breakage)

- **Symptom**: when the user toggled to English, **most** map labels translated but a handful stayed in Arabic — e.g. "🕋 مكة المكرمة" instead of "🕋 Makkah", "🪓 الخندق" instead of "🪓 The Trench", "⛰️ أحد" instead of "⛰️ Mount Uhud", "🕌 المدينة المنورة" instead of "🕌 Madinah". Only the Medinan map was affected (5 nodes); the other three maps were correctly translated.
- **Root cause**: those five `<text>` elements were added late in development *without* `data-ar` / `data-en` pairs. The HTML parser keeps the textContent as Arabic (or whatever was in the source). `applyLanguage()` uses `document.querySelectorAll('[data-ar][data-en]')`, which does not match elements that lack one of the two attributes — so the textContent is never overwritten.
- **Fix (v2.4.5)**: added `data-ar="…"` and `data-en="…"` to all five. Verified the 79/79 balance across `index.html`.
- **Rule — must-follow**:
  - **Every** element with user-visible text needs `data-ar` *and* `data-en`. No exceptions, no shortcuts, no "I'll add it later". If you add an SVG `<text>` with Arabic content, add both attributes **in the same commit**.
  - After editing `index.html`, run the data-ar / data-en balance check from `AGENTS.md`. Run a *second* check that looks for `<text>…</text>` with Arabic content but no `data-ar=` attribute — this is the bug pattern. Code at `C:\Users\melwa\AppData\Local\Temp\opencode\check_html.js`.

### B3. `init()` did not call `switchEv()`

- **Symptom**: on first page load, the wrong map was visible (the default `svg-hijra` was shown regardless of the user's last selected event), the map-label was the hardcoded Arabic initial value, the focus pulse was not positioned, and the timeline-strip's initial focus dot was missing.
- **Root cause**: `init()` only set up event listeners and called `buildTimeline()` + `applyLanguage()`. The "active event" state and its dependent DOM updates were not driven on mount — only on user interaction.
- **Fix (v2.4.5)**: `init()` now calls `switchEv(EVT)` first, then `buildTimeline()`, then `applyLanguage()`.
- **Rule — must-follow**:
  - The "initial mount" must invoke every public function that maps `state → DOM` and that is also called on user interaction. The public functions in this project are: `switchEv`, `goTo`, `applyLanguage`, `buildTimeline`, `applyMapFocus`, `render`. All five must run on mount at least once.
  - **Do not** rely on `render()` being called from one place and not another. If `render()` is what produces the correct DOM for state X, it must run on mount with state X.

### B3b. `switchEv()` set `data-ar` / `data-en` attributes on `#map-label` but did **not** update `textContent` (recurring variant of B1)

- **Symptom (reported again after v2.4.5)**: clicking the event-switch buttons (Meccan / Medinan / Badr / Hijra) updated the *map image* correctly but the **map title stayed as "خريطة رحلة الهجرة النبوية"** (or its English equivalent) for every event.
- **Root cause**: v2.4.5 changed `switchEv()` to set the `data-ar` and `data-en` attributes on `#map-label` so that `applyLanguage()` would translate the label. The assumption was that `applyLanguage()` would run. **It does not run on event switch — only on language toggle.** So the attributes were updated, but `textContent` was never re-derived, and the user saw the previous event's label (which on first switch from Hijra is always "خريطة رحلة الهجرة النبوية" because that is the hardcoded initial value).
- **Fix (v2.4.5 patch)**: `switchEv()` now sets `data-ar` / `data-en` **and** sets `textContent` directly, picking `mapLabelAr` or `mapLabelEn` based on the current `LANG`. This guarantees the label is correct on every event switch regardless of whether `applyLanguage()` runs.
- **Rule — must-follow**:
  - When changing an element's `data-ar` / `data-en` attributes, you have two choices:
    1. Call `applyLanguage()` immediately after, **OR**
    2. Set `textContent` directly in the same function.
  - Mixing the two is a footgun: setting attributes without `applyLanguage` leaves stale text; setting `textContent` directly without also setting attributes leaves the language toggle (which calls `applyLanguage`) working with stale data.
  - The current pattern in this project is option 2: set **both** the attributes and the `textContent` in `switchEv()`. Keep them in sync.
  - **Add this case to the mobile-visual review checklist**: click every event button, confirm the map title changes for both languages.

### B4. `.svg-wrap` used `padding-top: 80%` (clipping on small viewports)

- **Symptom**: the map appeared cut off at the top or bottom on some mobile / tablet portrait orientations. The full 700×560 viewBox was not rendered.
- **Root cause**: `padding-top: 80%` is a width-based padding hack that does not respect the actual `viewBox` aspect ratio. On narrow viewports the box height grew relative to the (small) width, so the SVG was squashed.
- **Fix (v2.4.5)**: replaced with `aspect-ratio: 700 / 560`; also changed `.map-svg` from `overflow: hidden` to `overflow: visible` so the focus pulse's halo (which extends past the node center) is not clipped.
- **Rule — must-follow**:
  - Use `aspect-ratio: <viewBoxW> / <viewBoxH>` for SVG containers. Do not use padding hacks for aspect ratio — they break on responsive layouts.
  - If the design has any element that is positioned *outside* the viewBox bounds (a halo, a wake, a focus pulse), the container must have `overflow: visible`. Preferable: keep the pulse inside the viewBox. If that's not possible, set `overflow: visible` and document the choice in a CSS comment.

### B5. `applyMapFocus()` applied a CSS `transform: scale()` on the map (v2.4.0)

- **Symptom (historical)**: when the user navigated to a step, the map zoomed in, pushing content outside the viewBox and cutting off landmarks at the edges. Reverse-navigating did not undo the zoom (no exit transition).
- **Root cause**: an earlier design tried to "zoom in on the active landmark". But the SVG uses `preserveAspectRatio="xMidYMid meet"`, so a CSS scale on the inner `<g>` would push content past the visible viewport on every step change.
- **Fix (v2.4.0)**: removed the `transform: scale()` from `applyMapFocus()`. The map now stays at 1:1 at all times; only the focus pulse + 8-point star wake reposition.
- **Rule — must-follow**:
  - **Do not** re-introduce `transform: scale()` on `.map-pan` or any map group. The full map must always be visible. If a future "zoom" feature is wanted, change `viewBox` (re-render with a new viewBox centered on the focus) — never use CSS transform.

### B6. Map coordinates with `cy` on the *parent* `<g>` and `cx` on the *child* `<circle>`

- **Symptom (v2.4.2 dev)**: focus pulse appeared at a half-offset position.
- **Root cause**: SVG nesting — a `<circle>` inside a `<g transform="translate(350,480)">` has its `cx` / `cy` relative to the parent. Setting `pulse.setAttribute('cx', 350)` set the circle's center at (350, 0) of the parent group, *plus* the translate.
- **Fix (v2.4.2)**: use absolute SVG coordinates — `pulse` lives in the SVG root, not inside the node group, so its `cx` / `cy` are absolute. `applyMapFocus()` writes `cx = focus.x`, `cy = focus.y` directly.
- **Rule — must-follow**:
  - The focus pulse `<circle>` is a *sibling* of the node groups, not a child. When computing its position, use the absolute `mapFocus.x` / `mapFocus.y` from `data.js`. Do not "add the node's translate" — the focus pulse is outside the node group.

---

## C. Quranic verse assignment (asbab al-nuzul errors)

> Asbab al-nuzul = the historical occasion of a verse's revelation. Misassigning a verse to the wrong event is a content-integrity bug, not just a UX bug. Treat it as severely as a citation error.

### C1. Six verses in v2.4.1 were assigned to the wrong event

- **Symptom**: a verse whose occasion was the *Battle of Badr* was shown on a *Meccan era* step, etc.
- **Root cause**: in v2.4.1, six ayahs were replaced en masse to "match event context", but the substitutions were made by skimming English summaries instead of checking the *cause* of revelation (asbab al-nuzul).
- **Fix (v2.4.1)**: replaced all six with versions whose asbab al-nuzul aligns with the step's event.
- **Fix (v2.4.2)**: discovered that two of those replacements (hijra:0 and hijra:1) were still swapped relative to each other, and swapped them back.
- **Rule — must-follow**:
  - **Every Quranic verse assignment in `data.js` must be verified against an asbab al-nuzul source** (al-Wahidi's *Asbab al-Nuzul*, Ibn al-Qayyim's *Zad al-Ma'ad*, al-Qadi 'Iyyad's *al-Shifa'*, or a modern Sunni tafsir like Ibn Kathir). Do not assign a verse by keyword search of the Arabic text.
  - When you change one verse, re-check the verses in the **immediately neighbouring** steps — context boundaries are where swap errors hide.
  - Sahih International is acceptable for the English translation, but the Arabic verse + reference must come from a Sunni canonical source (see `docs/SOURCES.md`).
  - After editing, run `list_all_verses.js` (under `C:\Users\melwa\AppData\Local\Temp\opencode\`) to print every verse and verify asbab al-nuzul one final time.

---

## D. UX / UI bugs

### D1. `#diag` banner was permanent

- **Symptom**: once an audio error showed the banner, it stayed on screen forever, partially blocking the bottom-right of the timeline strip.
- **Root cause**: `diag()` set `display: block` on the element and never reset it on success. There was no auto-dismiss.
- **Fix (v2.4.5)**: `diag(msg, kind, sticky)` now clears any previous timer and starts a 5.5-second auto-hide timer unless `sticky=true`. Also added a click-to-dismiss handler in `init()` (cursor: pointer; click anywhere on the banner to dismiss).
- **Rule — must-follow**:
  - Any user-visible banner / toast / notification in this app must (a) auto-dismiss after a reasonable timeout, (b) be click-to-dismiss, (c) never persist between page navigations. The `#diag` and `#focus-diag` elements are the only banners; future ones must follow the same UX.

### D2. Timeline-strip labels were nearly invisible

- **Symptom**: per-step labels under each numbered dot were `#334155` (very dark slate) on a dark emerald footer. Effectively invisible.
- **Root cause**: a colour picked for light backgrounds was used on a dark background.
- **Fix (v2.4.3)**: label color brightened to `#cbd5e1`. Dot border switched to gold `rgba(197, 160, 89, .55)`; dot text to `#94a3b8`. A subtle `box-shadow` added for separation.
- **Rule — must-follow**:
  - Always run any new colour against the *actual* background it will sit on. The CI/visual review must include a dark-mode pass.
  - The project has explicit dark-mode tokens in `style.css`; reuse them, do not invent new greys/blacks.

### D3. `.tl-lbl` had `display: none` on small screens (less than 520 px wide)

- **Symptom**: at < 520 px width the labels disappeared entirely, but the footer counter remained. Visually inconsistent.
- **Root cause**: a `min-width: 520px` media query suppressed labels on small screens — meant to reduce clutter, but contradicted the visible counter.
- **Fix (v2.4.3)**: `.tl-lbl` default is now `display: block`. On ≤ 480 px the labels are trimmed to 64 px and the second line is hidden, but they are always present.
- **Rule — must-follow**:
  - Do not "hide" an element that is conceptually part of the page state. Either show it small, or remove it. The halfway state of "label is empty but the dot is full" is the worst of both worlds.

### D4. `EVT` was not persisted to `localStorage`

- **Symptom**: the user always landed on the Hijra era on every visit, even if their last event was Medinan. Every fresh visit was jarring.
- **Root cause**: `EVT` was a `let` initialised to `'hijra'` and only updated by `switchEv()`. No localStorage round-trip.
- **Fix (v2.4.5)**: added `STORAGE.evt = 'sera.evt'`. `EVT` is now read from localStorage on init, and `switchEv()` writes back. `LANG`, `TTS_MODE`, and `AUTO_NARRATE` already had this pattern; `EVT` was the missing peer.
- **Rule — must-follow**:
  - **Every** piece of user-visible state that the user can change must be persisted. The persistable-state list in this app is: `EVT`, `STEP` (debated — has been intentionally *not* persisted to land on step 0 of the chosen era), `LANG`, `TTS_MODE`, `AUTO_NARRATE`. If a new toggle / option is added, add a `STORAGE.*` key in the same commit.

---

## E. Process / Sourcing rules

### E1. v2.3.0 — Sunni-only sourcing

- **Symptom (caught early)**: an early draft of the app included narrations from al-Kafi, Bihar al-Anwar, and al-Sahifa al-Sajjadiyya — all of which are not part of the Ahl al-Sunnah wal-Jama'ah canon.
- **Root cause**: a "broader Islamic perspective" framing that did not match the project's doctrinal scope. Shia hadith collections are not less valid; they simply are not the right source for *this* app, which is explicitly Sunni in orientation.
- **Fix (v2.3.0)**: codified the Ahl al-Sunnah hard rule in `AGENTS.md` rule #4, `CLAUDE.md` rule #4, and a banner at the top of `docs/SOURCES.md`. The accepted reference list is: Six Books (Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i, Ibn Majah) + Musnad Ahmad + Muwatta Malik; classical Sirah (Ibn Hisham, Ibn Ishaq, al-Waqidi, al-Tabari, Ibn Kathir's al-Bidayah); later Sunni scholars (Ibn al-Qayyim's Zad al-Ma'ad, al-Bayhaqi's Dala'il al-Nubuwwah, al-Qadi Iyad's al-Shifa, Ibn Hajar, al-Nawawi); modern Sunni scholarship (Mubarakpuri's al-Rahiq al-Makhtum, Zurqani on al-Mawahib, Dr. Hamidullah).
- **Rule — must-follow**:
  - **Do not** introduce a hadith, athar, or historical claim sourced from al-Kafi, Bihar al-Anwar, al-Sahifa al-Sajjadiyya, *Nahj al-Balagha*, or any non-Sunni collection.
  - If a hadith is graded *da'if* (weak) or *mawdu'* (fabricated), the source chip must say so. Never present a weak narration as sound.
  - When in doubt, the safe default is to omit the narration and pick a different one. Better to have fewer citations than one wrong one.
  - This rule is non-negotiable and is **AGENTS.md rule #4**.

### E2. Concurrency / no-coordination between map updates

- **Symptom (potential, observed in dev)**: if a fast double-click on "next" fires while a TTS utterance is still playing, the focus pulse and the audio can desync (pulse is on step N, audio is still finishing step N-1).
- **Root cause**: `playVerse()` does not cancel the in-flight utterance; it just starts a new one. Web Speech can queue.
- **Mitigation (current)**: the pulse and audio are tied to the same `STEP` value, so even if the audio overlaps, the visual stays in sync. The audio is "background" and the user reads the visible text.
- **Rule — must-follow**:
  - Do not introduce a state where the visible UI and the audio can disagree. The map focus, the timeline strip dot, the stage badge, the badges, and the title must *all* reflect the same `STEP` at every render.
  - If you add an "auto-advance" feature, it must update `STEP` *atomically* — never leave the audio "ahead" of the visible step.

---

## F. Diagnostic / developer-experience bugs

### F1. No way to see what `applyMapFocus` was actually doing

- **Symptom**: when the user reported "the focus is on the wrong landmark", the developer had to read `data.js` line by line, guess, and patch by eye. Every report took 30–60 minutes to triage.
- **Fix (v2.4.2)**: the active focus `<circle>` carries `data-step` and `data-evt` attributes. A small live readout `#focus-diag` in the bottom-left prints the current `Step N — title (x, y)`. All focus changes log `[focus] …` to the console. All TTS transitions log `[TTS] …`.
- **Rule — must-follow**:
  - For any future "the user says X is wrong but I can't see why" bug, **the first fix is to add a diagnostic readout** that prints the actual state. Do not add log statements to be removed later; keep them in production (cost: 2 lines of CSS + 1 line of JS). They pay for themselves the first time a desync report comes in.

### F2. No bilingual content on diagnostic banners

- **Symptom**: the diag banner said "No Arabic voice installed" — fine for an English user, confusing for an Arabic user who only reads Arabic.
- **Fix (v2.4.2)**: diag messages are bilingual via `data-ar` / `data-en` attribute lookup; the banner picks the right one based on `LANG`.
- **Rule — must-follow**:
  - Every user-facing diagnostic / error message must have an Arabic and English version. Use the same `data-ar` / `data-en` mechanism as the rest of the UI.

---

## G. Recurring patterns (meta-lessons)

These are the **patterns** that produced the most bugs in this project. If a new feature looks like one of these, slow down.

| Pattern | Why it bites | Mitigation |
|---|---|---|
| **Visual / audio / data are three views of the same state** | If any one of the three is updated by a *different* code path than the other two, they will desync. | Drive all three from a single `render(state)` function. Never have two functions that both update the map. |
| **The "first mount" path is different from the "user interaction" path** | `init()` did not call `switchEv`. The first-load DOM was a stale copy of the initial HTML. | The first-mount path must call every public `render`-style function. Treat `init()` like a "synthetic user click on the home button". |
| **JS `Date.now()` deltas to detect booleans** | `Date.now() - 0` is always huge. The flag fires never. | Use a boolean. |
| **CSS hacks for aspect ratio** | `padding-top: 80%` doesn't respect the viewBox. | Use `aspect-ratio: <W> / <H>`. |
| **Duplicate `id` attributes** | The browser returns the first match; the second is dead. | `id` is global. Always check uniqueness before adding. |
| **Hardcoded user-visible text without `data-ar` / `data-en`** | The text never translates. | Add both attributes in the *same* commit as the element. |
| **Ayah / hadith assigned by keyword search** | The verse's *occasion* (asbab al-nuzul) does not match the event. | Always cross-check with al-Wahidi, Ibn al-Qayyim, or Ibn Kathir. |
| **State persisted inconsistently (some keys, not others)** | The user lands on the wrong era on every visit. | Decide per state: persisted, or not? If yes, add a `STORAGE.*` key. If no, document why. |
| **Diagnostic output removed after the bug is "fixed"** | The next time the same bug shows up, we are blind again. | Leave diagnostic readouts (`#diag`, `#focus-diag`, console logs) in production. |
| **Visual-only fix for a content bug** | Pushed the wrong label by translating the wrong source. | Verify against primary sources for any claim about the Seerah, not just the UI. |

---

## H. Self-check before opening a PR

Run these in order; if any fails, **do not push**.

1. **JS validation**
   ```bash
   node -e "new Function(require('fs').readFileSync('app.js','utf8'))"
   node -e "new Function(require('fs').readFileSync('data.js','utf8'))"
   ```
2. **GeoJSON validation**
   ```bash
   node -e "JSON.parse(require('fs').readFileSync('timeline_data.geojson','utf8'))"
   ```
3. **data-ar / data-en balance in `index.html`** — both counts must be equal.
4. **No SVG `<text>` with Arabic content and no `data-ar` attribute** — see `check_html.js` under `C:\Users\melwa\AppData\Local\Temp\opencode\`.
5. **No duplicate `id` attributes** — `grep -oE 'id="[^"]+"' index.html | sort | uniq -d`.
6. **`mapFocus` for every step matches an actual SVG node's `transform="translate(?, ?)"`** — see the verification routine in `C:\Users\melwa\AppData\Local\Temp\opencode\verify_svg.js`.
7. **Mobile checklist (per `AGENTS.md`)**: event switcher wraps to 2×2 ≤720 px, ≥44 px tap targets, map ≤50 vh, `data-ar` / `data-en` in every new SVG `<text>`.
8. **CHANGELOG.md updated** and `package.json` version bumped (in the same commit).
9. **Sunni sourcing** (per `AGENTS.md` rule #4) — no narrations from al-Kafi, Bihar al-Anwar, al-Sahifa al-Sajjadiyya. Weak hadith graded.
10. **Open the live URL in a browser** and click through every event × every step × both languages. Confirm:
    - Map label matches the active era in both languages.
    - Focus pulse sits on the correct landmark for every step.
    - The TTS diag banner (if it shows) auto-dismisses within 6 seconds.
    - No console errors.

---

*This document is a living record. When you fix a new bug, add a row. When you discover a new pattern, add it to Section G. When you spot a recurring theme across two or more bugs, promote it to a hard rule in `AGENTS.md`.*
