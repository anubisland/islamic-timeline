# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.4.3] — 2026-06-07

### Fixed
- **CRITICAL: Timeline strip (numbered dots + per-step labels) was missing on initial page load.** `buildTimeline()` was only called from `switchEv()`, so on first load the `#tl-nodes` container was empty — only the track + footer counter were visible. The user has reported this missing-strip issue repeatedly; the root cause was that navigating to a step via prev/next buttons does NOT rebuild the timeline (it should have been built once on mount and rebuilt on event switch). `init()` now calls `buildTimeline()` before `applyLanguage()`, and `applyLanguage()` also calls it so language toggles refresh the label text.
- **CRITICAL: `mapFocus` coordinates were wrong for many steps across all four maps**, so the focus pulse on the map appeared at a different visual position than the step it represented (the most visible symptom: the gold ring would appear near the wrong landmark). This was the underlying cause of every "the map and the narration don't match" report. Every one of the 36 `mapFocus` values has been re-anchored to the actual SVG node centers, verified against `index.html`:
  - **hijra (all 6 steps)**: e.g. step 0 (night of departure) was `(290, 320)` — now `(350, 480)` to sit on the Makkah node; step 4 (Suraqah) was `(370, 240)` — now `(300, 120)` to sit on the Suraqah node; step 5 (Madinah) was `(560, 110)` — now `(560, 80)`.
  - **meccan (steps 2, 7, 8, 10, 13 corrected)**: e.g. step 2 (shaq al-sadr at Hira) and step 7 (ʿibāda in Hira) now correctly point to the Mount Hira group at `(440, 200)` instead of the Makkah center; step 8 (Waraqa) now points to Makkah instead of Hira.
  - **badr (step 1)**: now `(350, 175)` to sit on the main well (`#b-cistern`) instead of `(350, 200)`.
  - **medinan (step 1)**: market area adjusted to `(430, 230)`.
- **Timeline strip visibility strengthened**:
  - The default for `.tl-lbl` is now `display: block` (was `display: none` with a `min-width: 520px` media query that suppressed labels on smaller screens — confusingly inconsistent with the visible footer counter).
  - `.tl-foot` padding increased (`.65rem 1rem .85rem`), `.tl-wrap` `min-height: 56px`, `.tl-nodes` `min-height: 50px` to ensure the strip has enough vertical space even when the labels are two lines.
  - Dot border switched to gold `rgba(197, 160, 89, .55)` for higher contrast against the dark footer background; dot text colour brightened to `#94a3b8`; a subtle `box-shadow` added for separation.
  - Label default color brightened to `#cbd5e1` (was `#334155` which was nearly invisible on the dark footer).
  - New small-screen rule (`max-width: 480px`) trims labels to 64 px and hides the `.tl-lbl-sub` second line.

## [2.4.4] — 2026-06-07

### Changed
- **Repeating 8-point Islamic star pattern as a full-page watermark** (the green star tile background visible behind content). The tile is composed in `style.css` as the `--star-8` variable and applied via `body { background: ..., var(--star-8) 0 0 / 120px 120px, radial-gradient(...) }` with `background-attachment: fixed` so the pattern stays in place while the user scrolls. Each 120×120 tile contains:
  - One large 8-point gold star (fill-opacity 0.10, stroke-opacity 0.18)
  - One smaller 8-point emerald star nested inside
  - One centre dot
  - Four corner mini-stars (tessellating across tile boundaries)
  - Four edge-midpoint circles + four corner dots (filling the grid)
  Together this produces a rich green star-pattern backdrop like the reference image the user supplied.
- **Timeline strip and event-switch buttons tightened for tablet portrait (≤ 720 px)**:
  - `.tl-nd` now uses `flex: 1 1 0` and `min-width: 0` so all six timeline nodes share the row width evenly and never overflow.
  - `.tl-lbl` `width: 100%`, `min-width: 0`, font 0.58 rem so every node's label fits on a 720 px viewport without truncation.
  - `.ev-btn` on ≤ 720 px is `flex: 1 1 0` (no longer `50%`) so the four event buttons stay on a single row.
  - New `(min-width: 721px) and (max-width: 980px)` media query shrinks the event buttons for small laptops so the row never wraps to two lines.

## [2.4.2] — 2026-06-07

### Fixed
- **Hijra step 0/1 Quranic verse swap (asbāb al-nuzul error from v2.4.1)**: ʿĀt-Tawbah 9:40 ("إِذْ يَقُولُ لِصَاحِبِهِ لَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا") was incorrectly assigned to the **night of departure** (هجرة:0). This verse was revealed about the **cave of Thawr** (the Prophet ﷺ speaking to Abū Bakr رضي الله عنه), so it has been moved to hijra:1. The night of departure (هجرة:0) now carries **Al-Anfal 8:30** — the verse that directly describes Quraysh's conspiracy at the Prophet's house ("وَإِذْ يَمْكُرُ بِكَ الَّذِينَ كَفَرُوا لِيُثْبِتُوكَ أَوْ يَقْتُلُوكَ أَوْ يُخْرِجُوكَ ۚ وَيَمْكُرُونَ وَيَمْكُرُ اللَّهُ"), which is the literal night of hijra's start. Sahih International EN translation cross-checked.
- **Audio (TTS) silent-failure detection**: the previous heuristic (`Date.now() - __ttsStart < 600ms`) was never triggered when Web Speech failed silently — because `__ttsStart` was only set inside `onstart`, and on silent failure `onstart` never fires (so `__ttsStart` stays `0` and the delta is the current epoch in ms, not 600). Replaced with a boolean `__ttsStarted` flag: if `onend` fires without `onstart` having fired, we now correctly detect silent failure and try the Google TTS fallback. This is the most common cause of "I press play and nothing happens" on Windows Chrome, where no Arabic voice is installed.
- **English voice fallback**: added `pickEnglishVoice()` (Microsoft Zira / David / Google US English / any `en-*` lang) so the English narration path has the same resilience as the Arabic path. Previously, English narration could also fail silently on systems with no matching voice.
- **User-gesture warm-up**: first click on the play button now issues a zero-volume `SpeechSynthesisUtterance(' ')` inside the click handler. This unlocks Chrome's TTS engine on configurations that otherwise ignore the very first `speak()` call (a known Chromium quirk on cold start).
- **Map ↔ step ↔ audio sync diagnostics**:
  - The active focus `<circle>` now carries `data-step` and `data-evt` attributes so it can be inspected in DevTools.
  - A small live readout (`#focus-diag`) in the bottom-left shows the current `Step N — title (x, y)` so the user can verify at a glance that the pulse and the timeline step agree.
  - A bilingual diagnostic banner (`#diag`) surfaces Web Speech status, the picked voice name, and the fallback path. It will explicitly say "No Arabic voice installed on this system" if that is the cause, with the actionable hint to install the Arabic language pack in Windows Settings.
  - All focus changes and TTS transitions are logged to the browser console (`[focus] …`, `[TTS] …`) for easier diagnosis.

## [2.4.1] — 2026-06-06

### Fixed
- **Quranic verses now match the event/occasion (asbāb al-nuzul & theme)**:
  Reviewed all 36 ayahs and replaced 6 whose previous pairing was a general-purpose verse rather than one directly tied to the step's event. Each replacement keeps the original Arabic text, an accurate Sahih-International-style English translation, and a precise surah/verse reference.

  | Step | Event | Old (general) | New (event-fit) | Why it fits |
  |---|---|---|---|---|
  | meccan:4 | Abu Talib's guardianship of the orphan | An-Nisāʾ 4:1 (unity of mankind) | **Ad-Ḍuḥā 93:9 — "So as for the orphan, do not oppress him"** | Direct command about caring for the orphan — exactly Muhammad's status after his grandfather's death |
  | meccan:5 | Trip to Syria & Bahīra the monk | Al-Aʿlā 87:6 (preservation of the Qurʾān) | **Al-Aʿrāf 7:157 — "Those who follow the Messenger, the unlettered Prophet, whom they find written in what they have of the Torah and the Gospel…"** | The prophecy of the unlettered Prophet in the Torah and the Gospel — what Bahīra the Christian monk recognized in his books |
  | meccan:6 | Trade trip & marriage to Khadījah | Al-Munāfiqūn 63:10 (oaths) | **An-Nisāʾ 4:29 — "…do not consume one another's wealth unjustly, but only [in lawful] business by mutual consent"** | The Qurʾānic basis for lawful trade by mutual consent — exactly how Khadījah hired Muḥammad ﷺ and proposed to him |
  | meccan:9 | Secret daʿwah in Dār al-Arqam | Hūd 11:3 (seek forgiveness) | **An-Naḥl 16:125 — "Invite to the way of your Lord with wisdom and good instruction, and argue with them in a way that is best"** | The foundational verse of daʿwah methodology — directly about the wisdom-first approach that began the secret call |
  | meccan:15 | Two Pledges of ʿAqabah | Āl ʿImrān 3:81 (covenant of prophets) | **Al-Fatḥ 48:10 — "Indeed, those who pledge allegiance to you, [O Muḥammad] — they are actually pledging allegiance to Allah. The hand of Allah is over their hands"** | Revealed about the bayaʿah (pledge) at Hudaybiyyah, in the same series as the ʿAqabah pledges — both are bayaʿah in the cause of Allah |
  | hijra:2 | Coastal road, expert guide | Al-Anbiyāʾ 21:30 (water and life) | **At-Ṭalāq 65:3 — "And whoever relies upon Allah — then He is sufficient for him"** | The verse of tawakkul (reliance on Allah) — exactly the spiritual anchor needed for the dangerous coastal journey with no clear route |

  All translations were cross-checked against the Sahih International English translation (the standard modern English reference widely used in Sunni scholarship).

## [2.4.0] — 2026-06-06

### Fixed
- **Maps fully contained in their frame**: `applyMapFocus()` no longer applies a CSS scale to the `map-pan` group (which was pushing content outside the viewBox). The map is now always shown fully and the focus indicator (pulse + 8-point star) simply re-positions to the step's `(focus.x, focus.y)`. This eliminates the "cut off" / "clipped" appearance that happened when `scale > 1`.
- **Audio (TTS) reliability**: `playVerse()` now tries the browser's built-in **Web Speech API** first (no CORS, no network, no rate limits), with a 30s safety timeout. If `onend` fires within 600 ms of `onstart` (i.e. the engine failed silently) the playback automatically falls back to Google Translate TTS. The previous version led with Google TTS which is often blocked or fails CORS, leaving the user with no audio.
- **All 13 previously-missing Quranic verses** (ayahs) are now populated: 12 in the Meccan era (Birth / Year of the Elephant, Breastfeeding, Shedding of the Chest, Mother's death, Grandfather's death, Trade-trip to Syria, Trade & marriage to Khadijah, Waraqa confirms prophethood, Secret da'wah in Dar al-Arqam, First migration to Abyssinia, Year of Sorrow, Two Pledges of Aqabah) and 1 in the Medinan era (Founding of Madinah's market). Each has both Arabic + English + reference, all from Ahl al-Sunnah-canonical sources.
- **`preserveAspectRatio="xMidYMid meet"`** explicitly set on all four SVG maps (was missing on the meccan, badr and medinan SVGs), preventing any aspect-ratio distortion.

### Added
- **Step ↔ narration sync (auto-narrate toggle)**: a new `🔁` button in the nav bar toggles `AUTO_NARRATE` mode. When on, navigating to a new step (via the timeline dots, prev/next, or map node clicks) automatically plays the audio for that step after a short delay (850 ms — synced with the map pulse animation). State is persisted in `localStorage`.
- **TTS mode toggle (verse ↔ narration)**: a new `آية / Narr.` button switches between playing the Quran ayah (default) and the full step description. State is persisted in `localStorage`.
- **Map Islamic ornament library** (shared `<symbol>` defs): added `#sym-arabesque` (corner arabesque), `#sym-pendant` (mihrab drop), `#sym-star8-lg` (large ornamental 8-point star), `#sym-crescent` (Islamic crescent + star), and `#sym-arch` (mihrab arched gate). All four maps are now populated with: corner arabesques, pendants, large 8-point stars, and crescents (with corner-positioned duplicates to mirror the design).
- **Arabic voice selection**: `pickArabicVoice()` automatically picks the best available Arabic voice from `speechSynthesis.getVoices()` (cached after first selection); on `onvoiceschanged` it re-picks. The selected voice is applied to every `SpeechSynthesisUtterance` for clearer, more natural Arabic recitation.
- **Timeline label visibility on mobile**: `.tl-lbl` is now always shown for the current step on small screens (`< 520px`), with `min-width: 60px` / `max-width: 130px` and `overflow-wrap: break-word` so labels never overflow the dot.
- **New `.n-mode` and `.n-auto` button styles** in `style.css` (44 px tap targets; auto-narrate button shows a green "on" ring when active).
- **Tests**: new `validate_v24.js` (26 checks) covers: file parse integrity, all 36 steps have ayahs, `applyMapFocus` no longer transforms the pan group, Web-Speech-First TTS flow, new buttons in HTML & CSS, `preserveAspectRatio` on all 4 SVGs, per-map ornament usage, and `data-ar`/`data-en` parity (68/68).

## [2.3.0] — 2026-06-06

### Added
- **Ahl al-Sunnah wal-Jama'ah sourcing rule (HARD RULE)**:
  - Codified in `AGENTS.md` rule #4, `CLAUDE.md` rule #4, and a banner header on `docs/SOURCES.md`.
  - Accepted sources: the Six Books (Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i, Ibn Majah) + Musnad Ahmad + Muwatta Malik; classical Sirah (Ibn Hisham, Ibn Ishaq, al-Waqidi, al-Tabari, Ibn Kathir's *al-Bidayah*); later Sunni scholars (Ibn al-Qayyim's *Zad al-Ma'ad*, al-Bayhaqi's *Dala'il al-Nubuwwah*, al-Qadi Iyad's *al-Shifa*, Ibn Hajar, al-Nawawi); modern Sunni scholarship (Mubarakpuri's *al-Rahiq al-Makhtum*, Zurqani on *al-Mawahib*, Dr. Hamidullah).
  - **Forbidden:** Shi'a-only collections (e.g. *al-Kafi*, *al-Sahifa al-Sajjadiyya*, *Bihar al-Anwar*). Weak (da'if) hadith must be graded; fabricated (mawdu') narrations are not permitted.
- **Language-correct Quran display**:
  - The `.ayah-box` in `index.html` now contains two parallel blocks: `.ayah-content-ar` (Arabic ayah + reference) and `.ayah-content-en` (English translation + reference).
  - CSS uses `[lang="ar"] .ayah-content-en { display:none }` and `[lang="en"] .ayah-content-ar { display:none }` so only the active language's content is visible — no more mixed-script quotes.
  - New `.ayah-text-en` (italic Amiri/Crimson serif) and `.ayah-ref-en` (Inter) styles.
- **Edge ornaments & calligraphic watermark**:
  - Two new CSS tokens: `--edge-ornament` (vertical 8-point Islamic star strip) and `--bismillah-watermark` (Bismillah calligraphy, RTL).
  - `body::before` paints the Bismillah watermark as a fixed-position background layer (`pointer-events: none`).
  - `body::after` paints 8-point star strips on the left and right screen edges.
  - Both layers are hidden on screens ≤880px to preserve touch usability.
  - `.wrap` padded `60px` left/right so content never collides with the edge ornaments.
  - Brand logo replaced with an inline 8-point star SVG (emerald gradient + gold stroke + gold center dot); brand subtitle now enumerates all 4 eras in both languages.
- **Richer timeline labels**:
  - Each numbered timeline dot now carries a main title (`.tl-lbl-main`, ~22 chars) and a 1-line explanation subtitle (`.tl-lbl-sub`, ~28 chars, em-dash-split from the original long title).
  - `.tl-lbl` widened to 110px; new typography styles for main/sub with proper "now" and "done" state colours.
- **Desert map elements**:
  - New shared SVG `<symbol>` library at the top of the map panel: `#sym-tent` (Bedouin tent), `#sym-camel` (walking silhouette), `#sym-dune` (sand dune), `#sym-mountain` (ridge), `#sym-palm` (date palm), `#sym-stars` (8-point star cluster).
  - **Meccan map**: 2 sand dune groups in the foreground, a 2-camel trade caravan heading north toward Syria, 2 Bedouin tents at Bani Sa'd, 3 date palms in the Makkah oasis.
  - **Hijra map**: 3 sand dunes, a 3-camel caravan along the migration route, 2 Bedouin tents near Qudayd.
  - **Badr map**: 4 dune groups framing the battlefield, 5 enemy tents south (Quraysh), 4 Muslim tents north, 2 baggage camels on the flanks.
  - **Medinan map**: 3 dune groups, 4 date palms flanking Madinah (the "City of Date Palms"), 2 travel camels.

### Changed
- `app.js` `buildTimeline()` now emits `.tl-lbl-main` + `.tl-lbl-sub` for every dot; added `escHtml()` helper for safe insertion of step titles.
- `app.js` number rendering centralised through the `arNum()` helper for all user-facing counters (stage badge, `STEP / total` counter, timeline dot labels).
- 104 source citations audited and confirmed Sunni-classical.

### Tests
- New `validate_v23.js` (29 checks) covers: hard-rule language in all 3 docs, language-correct Quran blocks, CSS display toggles, `arNum` integration, `tl-lbl-main`/`tl-lbl-sub` rendering, watermark + edge-ornament CSS tokens + pseudo-elements, shared SVG `<symbol>` library, and per-map desert element usage.

## [2.2.0] — 2026-06-06

### Added
- **Islamic ornament system & extended palette**:
  - 4 new colour tokens: `--lapis` (Islamic tile blue), `--parchment` (manuscript cream), `--crimson` (Andalusian red), `--royal` (Fatimid purple).
  - 8-point Islamic star pattern as fixed background on `body` (low-opacity tile).
  - Arabesque corner ornaments on `.ornament-card`, `.story-panel`, and SVG map corners (`.map-frame`).
  - Parchment dashed inner border on the `.ayah-box`; second pseudo-element keeps the giant quote mark.
  - Section-title divider helper (`.ornament-title`) with gold gradient lines.
- **Map–step & audio–map synchronization**:
  - Every step in `data.js` now carries a `mapFocus: {x, y, scale}` (36/36 steps).
  - `applyMapFocus()` in `app.js` pans/zooms the active SVG to the step's focus point, with a 0.95s cubic-bezier transition.
  - Each SVG gained a `<g class="map-pan">` wrapper and a focus layer (`#focus-<era>`) with a circular pulse and 8-point star wake.
  - When audio starts, `.focus-pulse.speaking` is added → the pin pulses faster (1.1s); on end (or step change) it reverts to the slow 2.2s idle pulse.
- **Map enhancements**:
  - Compass rose upgraded to a proper 8-point Islamic star with NESW cardinal labels.
  - Decorative 8-point star corners added to all 4 maps (`.map-frame` group at SVG root).
- **Narration enrichment**:
  - Every step now has **at least 3 key characters** (was 1–4; min enforced at 3) with role blurbs.
  - Added figures to previously-thin steps: Bahira, Waraqa, Halimah, Khadijah, Abu Talib, the Angels, Arqam, Suraqah, Abu Dharr, Umm Mabad, Al-Hubab, Al-Mut'im, Al-Baqi' market, and more.
- **Tests**: new `validate_v22.js` smoke test covering all 4 map-pan, 4 focus layers, 4 star-wakes, ornament system classes, audio-pulse hooks, and `applyMapFocus` wiring.

### Changed
- `app.js` `render()` now schedules `applyMapFocus(true)` via `requestAnimationFrame` so the SVG pan runs after DOM reflow.
- `goTo()` calls `applyMapFocus(true)` so prev/next step syncs the map.
- `switchEv()` calls `applyMapFocus(false)` for an instant snap on era change.
- `playVerse()` now passes through a `finishPlayback()` closure that always clears the audio-pulse — preventing stuck "speaking" rings when the user changes steps mid-recitation.
- `stopAudio()` now also calls `setAudioPulse(false)`.

### Technical
- No new runtime dependencies. Pure static site.
- All `data-ar` / `data-en` bilingual pairs preserved.
- Maps use CSS `transition: transform 0.95s` on `.map-pan` for hardware-accelerated pan/zoom.
- Bumped version `2.1.0` → `2.2.0`.

---

## [2.1.0] — 2026-06-06

### Added
- **Meccan Era** (`meccan`) — 16 new stages covering Birth → Nursing in Bani Sa'd → Childhood → First revelation at Cave Hira → Public call → Dar al-Arqam → First Abyssinian migration → Second Abyssinian migration → Year of Sorrow → Boycott of Banu Hashim → Isra & Mi'raj → Boycott lifted → Hilf al-Fudul → Ta'if → Second pledge of Aqabah → the eve of the Hijra.
- **Medinan Era** (`medinan`) — 11 new stages: Building the Prophet's Mosque & founding the state → Al-Baqi' market → Change of Qiblah → Badr → Uhud → Khandaq (Battle of the Trench) → Hudaybiyyah treaty → Royal correspondence → Conquest of Makkah → Farewell Hajj → Death of the Prophet ﷺ and transfer of leadership.
- **Two new interactive SVG maps**:
  - Meccan map: Makkah center, Jabal Noor (Cave Hira), Bani Sa'd desert, Cave Thawr, Ta'if, plus directional arrows to Syria (trade) and Abyssinia (migration).
  - Medinan map: Madinah capital center, Badr SW, Mount Uhud N, Khandaq trench N, Hudaybiyyah W, Makkah S, Arafat SE — with campaign-arrows to each battle site.
- **Mobile-friendly UI**:
  - Event-switch wraps into a 2×2 grid on screens ≤ 720px (4 buttons total).
  - All interactive buttons enforce a 44px minimum touch target.
  - Map SVG capped at 50vh on small screens with auto-scaling.
  - Ayah box, lesson box, and map card paddings reduced for narrow viewports.
- **GeoJSON expansion** from 9 → 24 features covering all 36 stages.
- `data.js` header comment updated to reflect the new totals: `Meccan (16) + Hijra (6) + Badr (3) + Medinan (11) = 36 stages`.

### Changed
- Event switcher now hosts **four** buttons: 🕋 Meccan Era · 🧭 The Hijra · ⚔️ Battle of Badr · 🏛️ Medinan Era.
- `switchEv()` in `app.js` extended to toggle `svg-meccan` and `svg-medinan` alongside the existing two.
- `.event-switch` style now allows flex-wrap and a less aggressive border-radius to accommodate the extra buttons.
- README feature list and project description updated to mention all four eras and 36 stages.

### Technical
- No new runtime dependencies. Pure static site.
- All new Arabic content is parallel-English; every `data-ar` has a `data-en` pair (verified by review).
- `data.js` re-validated with Node: parses as valid JavaScript, exports `window.SEERAH_DB` with 4 keys totaling 36 steps.

---

## [2.0.0] — 2026-06-06

### Added
- Full **bilingual UI** (Arabic RTL / English LTR) with `localStorage` persistence.
- **9 chronological events** across two eras: the Hijra (6 stages) and the Battle of Badr (3 stages).
- **Two interactive SVG maps**:
  - Hijra route (Makkah → Cave of Thawr → Coastal route → Qudayd → Suraqah's chase → Madinah) with animated route drawing.
  - Badr tactical map with well-blocking, cistern and battle-clash overlays that unlock per step.
- **Google TTS** verse recitation with `speechSynthesis` fallback.
- **Keyboard shortcuts**: arrow keys (auto-flipped for RTL), `Space` to play, `L` to toggle language.
- **Documentation**: `docs/ARCHITECTURE.md`, `docs/DATA_SCHEMA.md`, `docs/SOURCES.md`.
- **Standard open-source files**: `LICENSE` (MIT), `CONTRIBUTING.md`, `.editorconfig`.

### Changed
- Rebuilt from a single-card mockup into a full single-page app with two-panel layout (map + story).
- Adopted emerald (`#063529`) + gold (`#C5A059`) design system across HTML, CSS and SVG.
- README restructured with badges, table of contents, and links to docs/.

### Technical
- Pure HTML / CSS / vanilla JavaScript. **No build step, no framework, no npm runtime dependency.**
- Single in-memory state object: `{ EVT, STEP, LANG }`.
- All map labels and UI strings carry `data-ar` / `data-en` attributes for O(1) language swap.

---

## [1.0.0] — 2026-06-06

### Added
- Initial bilingual static site.
- Single event card example (Building of Al-Masjid an-Nabawi) as a placeholder.
- Basic AR/EN toggle persisted in `localStorage`.
- GitHub Pages deployment on the `main` branch.

### Notes
- Based on the original Gemini export that was refined and converted from React Native to plain HTML/CSS/JS.
- Project skeleton: `index.html`, `style.css`, `app.js`, `package.json`, `timeline_data.geojson`.

[2.0.0]: #200--2026-06-06
[1.0.0]: #100--2026-06-06
