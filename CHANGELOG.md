# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.10.0] — 2026-06-08

### Added
- **🎙️ Neural narration with a 4-voice picker** — Story narration is delivered as **pre-generated Microsoft neural-voice MP3s**. A picker (🎙️ button in the audio controls) lets the listener choose among four voices; **each slot uses a different voice per language**, and the dropdown always names the voice actually playing:
  - `classic` — **حامد** (Hamed, Saudi MSA ♂) · **Guy** (US ♂)
  - `gentle` — **زارية** (Zariyah, Saudi MSA ♀) · **Aria** (US ♀)
  - `story` — **سلمى** (Salma, Egyptian ♀) · **Jenny** (US ♀)
  - `warm` — **شاكر** (Shakir, Egyptian ♂) · **Ryan** (UK ♂)
- **Pre-generated audio assets** under `audio/<slot>/<era>_<step>_<lang>.mp3` for all 72 steps × 4 voices × 2 languages, plus `audio/manifest.json`. Works fully offline / `file://` / GitHub Pages — no API key, no backend, no runtime dependency.
- **`tools/gen_tts.py`** — dev-only generator (uses the free `edge-tts` neural endpoint). Idempotent; re-run to regenerate after editing narration text. Never loaded by the site.
- **📖 Real Quran recitation for verse mode** — verses stream genuine reciter audio from **everyayah.com** (ayah-by-ayah MP3, played in sequence for multi-ayah refs). The surah/ayah is parsed from each step's `ayahRefEn` (both `(10), verse 1` and `— 96:1` citation styles supported). The 🎙️ picker is **context-aware**: in verse mode it lists **reciters** (Mishary Alafasy ·default·, Al-Husary, Abdul Basit, Al-Minshawy, As-Sudais — persisted to `localStorage['sera.reciter']`); in narrate mode it lists the four narration voices.
- **⏹ Play button doubles as Stop** — while audio plays, the button shows a stop glyph (`⏹`) with a bilingual "Stop / إيقاف" label; clicking it halts playback. Returns to `▶` / "Play" when idle.

### Changed
- **Audio is pre-recorded only** — the live Web Speech / Google `translate_tts` engines were **removed entirely**; they sounded robotic in both Arabic and English and (being a single system voice) ignored the chosen narration voice, so the dropdown selection didn't match what played. Narration now plays its slot's MP3, verses play real recitation, and a missing source shows a brief "audio not available" notice instead of a robotic fallback.
- **Default TTS mode is now `narrate`** (was `verse`) — new visitors get the story narration immediately. Quranic verses, when chosen, play real recitation rather than synthetic TTS.

### Fixed
- **Dropdown didn't reflect the voice playing** — in English mode the picker still showed the Arabic voice names while a different English voice played; and with the old live fallback every slot played the *same* system voice. Both fixed: labels are now per-language-accurate and each slot plays its own neural clip.
- **Mode-toggle label clobbered by `applyLanguage()`** (B3b-class bug) — the `#btn-mode` span carried `data-ar`/`data-en`, so every language toggle / mount reset its text to "Verse" regardless of the actual mode. Removed the static attributes; `updateModeUI()` is now the single source of truth and is called on init, click, and language toggle.
- **Narration cut off at 30 s** — the playback stuck-state timeout (30 s) was shorter than many narration clips (e.g. Hijra step 1 is 28 s; longer steps exceed 30 s). Raised to a 180 s backstop and guarded with a play-token so a stale timer can never stop a newer playback.

## [2.11.0] — 2026-06-08

### Fixed
- **Imam play button played the wrong (Seerah) narration** — `narrationURL()` used the global Seerah `EVT` regardless of mode, so pressing play on an imam step requested a real Seerah clip (e.g. `audio/classic/hijra_0_ar.mp3`) and played Hijra narration under an imam page. In imam mode the key is now `imam-<id>`; since imam audio isn't generated, that 404s and the player correctly shows "audio not available."

### Added
- **Four Imams data module** (`data_imams.js`) — `window.FOUR_IMAMS_DB` with 4 imams × 5 phases = 20 stages in Sera's parallel-field format. Covers Abu Hanifa, Malik, Al-Shafi'i, and Ahmad ibn Hanbal.
- **Imam selection splash** (`#imam-screen`) — 4 colored cards (gold/green/burgundy/purple) with gradient backgrounds, icons, names, titles, and dates. Responsive 2×2 grid (stacks at ≤720px).
- **Imam step viewer** — full story panel with title, description, characters, lesson, sources, and timeline dots. Reuses existing `.wrap`/`.story-panel`/`.tl-foot` DOM with dispatch in `render()`/`buildTimeline()`.
- **Imam map card** (`#imam-map`) — decorative card in the map panel showing imam name, titles, lifespan, birthplace, and intro text.
- **MODE-based dispatch** — `app.js` `render()`, `buildTimeline()`, `goTo()`, `playVerse()` all dispatch to imam-specific handlers when `MODE === 'imams'`. Header back button returns to imam splash.
- **`IDB` (Imam DB) routing** — `IMAM` state with localStorage persistence; `showImamScreen()`/`hideImamScreen()`/`goToImamSplash()`/`selectImam()`/`updateImamMapCard()`.

## [2.10.1] — 2026-06-08

### Added
- **Master launcher homepage** — New abstract splash (`#home-screen`) with 2 tiled cards: "السيرة والخلافة" (Seerah & Caliphate) and "الأئمة الأربعة" (The Four Imams). Clicking Sera navigates to the existing era selection splash; clicking Imams is a placeholder for the next phase.
- **MODE state routing** (`'home' | 'sera' | 'imams'`) in `app.js` with `showHome()`, `goToHome()`, `goToSera()`, `goToImams()` functions.
- **Splash back button** (`#splash-back`) — returns to the master launcher from the era selection screen.
- **Responsive 1-column stack** for home cards at ≤720px.

### Changed
- `init()` now shows `showHome()` instead of `showSplash()`.
- `showSplash()` and `hideSplash()` now also toggle the home screen visibility.
- Header 🏠 button goes to splash (era selection); splash "← الرئيسية" goes to home.
- **Launcher title renamed** from "The Imams / الأئمة" to **"Islamic Timeline / الخط الزمني الإسلامي"** — the master launcher hosts both the Seerah timeline and the Four Imams, so "The Imams" was a misnomer.

### Fixed
- **Homepage corruption — era UI + footer leaked beneath the launcher** — the CSS safety-net that force-hides `.wrap` (4000px+ of maps/story) and `.tl-foot` was keyed only to `#splash:not(.hidden)`. The new home screen sets `#splash` to `.hidden`, so the rule stopped firing and the entire era UI + footer rendered in flow below the fixed `#home-screen` overlay, producing a ~4700px scrollable, broken page. Extended the rule to also cover `#home-screen:not(.home-hidden) ~ .wrap, ~ .tl-foot`. (Also corrects a duplicate `## [2.10.0]` changelog heading — this homepage work is now `2.10.1`.)
- **"Explore Imams" jumped to the wrong page** — `goToImams()` hid the home screen but, with no Four Imams view to show, that revealed the Seerah era view (default Hijra map) underneath — looking like a broken redirect. It now keeps the user on the launcher and shows a bilingual "coming soon" notice instead.
- **🟢 "Green strip" regression on the home launcher** — the `#focus-diag` developer badge (`position: fixed; z-index: 9999`, dark-emerald) reappeared on the homepage. `applyMapFocus()` showed it whenever the splash was hidden, but the new home screen also hides the splash. Now it shows only in a true era view (splash **and** home both hidden), and `showHome()` hides it as a safety net (see docs/BUGS.md §I).

## [2.9.1] — 2026-06-08

### Fixed
- **Map zoom controls reversed** — The `+` button (zoom in) was shrinking the viewBox (actually zooming out) and the `−` button (zoom out) was expanding the viewBox (actually zooming in). Root cause: the click handlers in `app.js` had the arrow directions swapped (`zoomIdx--` on zIn, `zoomIdx++` on zOut). Fixed by swapping the directions in the click handlers and correcting the comments.

## [2.9.0] — 2026-06-08

### Fixed
- **🟢 Green strip — ROOT CAUSE FOUND: `.focus-diag` diagnostic badge** — After weeks of false leads, the culprit was finally identified via systematic binary-search debugging. The `.focus-diag` element (`position: fixed; z-index: 9999; background: rgba(6, 53, 41, 0.85)`) was rendering a dark-green badge at the bottom of EVERY page, including the splash screen. Even without text content, its padding + green background + border created a visible "green strip."

  **Fix**: `display: none` on `.focus-diag` by default. `applyMapFocus()` now explicitly sets `display: block` only during era mode (splash is hidden). `showSplash()` hides it as a safety net. The diagnostic badge is only useful in era mode — no reason for it to exist on the splash.

### Removed
- All debug/test CSS rules from `index.html` inline `<style>`.
- All previous footer dynamic creation/deletion code (v2.7.5 → v2.8.0 → v2.8.1 → v2.8.3) — none of which addressed the real cause.

## [2.8.3] — 2026-06-08

### Fixed
- **🟢 Green strip — critical CSS inline in `<head>` + body overflow hidden** — CSS safety net (`#splash:not(.hidden) ~ .tl-foot { display: none !important; }`) is now inlined directly in `index.html`'s `<head>` so it applies BEFORE the browser renders anything. External `style.css` loading order is irrelevant. Also sets `html { background: #060b0f !important; }` and `body { background: #060b0f !important; }` inline.
- **Body overflow locked during splash** — `showSplash()` sets `document.body.style.overflow = 'hidden'` to prevent any body scrolling behind the fixed splash. Reverted to `''` in `hideSplash()`.

## [2.8.1] — 2026-06-08

## [2.8.0] — 2026-06-08

### Fixed
- **🟢 Green strip — ROOT CAUSE eliminated** — Replaced the entire dynamic-footer-in-JS approach with a **CSS-only** solution. The `.tl-foot` is back in `index.html` permanently. A CSS rule (`#splash:not(.hidden) ~ .tl-foot { display: none !important; }`) hides it when the splash is visible, and lets it display normally when the splash is hidden. No JavaScript creation/destruction of DOM elements, no timing races, no failure modes.
- **Removed `ensureFooter()` / `removeFooter()`** — These functions and their calls are deleted. Footer visibility is now 100% controlled by CSS.

### Changed
- `hideSplash()` and `showSplash()` no longer manipulate `.wrap` or `.tl-foot` display — CSS handles both via sibling combinators.
- Mobile splash further compacted (≤480px and new ≤360px breakpoint).

## [2.7.6] — 2026-06-08

## [2.7.4] — 2026-06-07 `hideSplash()` uses `style.removeProperty('display')`. This guarantees the footer is hidden regardless of CSS cascade or specificity issues.
- **📱 Splash too compact/tiny** — Increased all splash sizes: title `1.8rem` (was `1.5rem`), era-card padding `10px 18px` (was `8px 14px`), rashidun-box padding `14px 18px` (was `10px 14px`), inner gap `10px` (was `6px`). Splash padding `16px` (was `10px`). Frame/corner sizes also increased. Media queries at 720px and 480px adjusted to match.
- **🧹 Removed `.splash-hidden` CSS class entirely** — No longer needed; footer visibility controlled exclusively by JS.

## [2.7.3] — 2026-06-07

### Fixed
- **🟢 Green strip still visible on splash** — Added `style="display:none"` inline to the footer HTML as a second hiding mechanism alongside the CSS class. `showSplash()` now sets `element.style.display = 'none'` and `hideSplash()` clears it to `''`, providing a bulletproof guarantee that the footer is hidden during splash regardless of CSS cascade issues.

## [2.7.2] — 2026-06-07

### Fixed
- **⚡ Flash of timeline content before splash** — Added `splash-hidden` class directly to `.wrap` and `.tl-foot` in the raw HTML so they are hidden before JavaScript runs. Previously the main grid and green footer strip were visible during the split-second before `app.js` executed.
- **✂️ Title cut off at top of splash** — Moved lang toggle button OUTSIDE the splash section (as a sibling) to avoid clipping. Removed `overflow: hidden` issue on `.splash` that caused `align-items: center` to clip top content. Overrode the `@media (max-width: 720px)` and `480px` queries that had LARGER padding/font values than the compact base styles — they now use even tighter values (e.g., era-card padding 4–6px, h1 1.0–1.2rem).
- **🔤 Language toggle always visible** — Button now uses plain `position: fixed; top: 16px; right: 16px; z-index: 200` (not `inset-inline-end` for broader browser compat). Hidden via `.hidden` class toggled by `showSplash()`/`hideSplash()` JS.
- **📱 Splash fits 100vh without scrolling** — Base splash padding reduced to 10px, inner gap to 6px, era-card padding to 8px, caliph-card padding to 5px. Responsive breakpoints further reduce sizes on small screens.

## [2.7.1] — 2026-06-07

### Fixed
- **Splash always shows first on load** — Removed saved-EVT auto-navigation in `init()` so the splash landing page is always the entry point.
- **Language toggle now visible on splash screen** — Added `#splash-lang-toggle` button, synced with header toggle.
- **Splash fits in one viewport (no scroll)** — Compacted spacing, padding, and font sizes.
- **Green footer strip no longer appears on splash**.

## [2.7.0] — 2026-06-07

### Added
- **Splash landing page** — Full-screen splash (`#splash`) replaces the header event-switch as the home screen. Features Islamic frame with corner ornaments, dark emerald/gold theme, 5 main era cards (Pre-Prophethood, Meccan, Hijra, Badr, Medinan) and 5 Rashidun caliph cards (Abu Bakr, Umar, Uthman, Ali, Hasan). Clicking any card calls `switchEv(eraKey)` to hide splash and show the timeline UI.
- **Header redesigned** — Back-to-splash button (🏠) in `.hdr-left`, era label in `.hdr-center`, language toggle in `.hdr-actions`. Header hides on splash and shows era name when viewing a timeline.
- **5 Rashidun Caliph eras** (25 stages total):
  - **Abu Bakr al-Siddiq** (5 steps): مولده ونشأته → بيعة السقيفة → حروب الردة → جمع القرآن → فتوحات العراق والشام ووفاته
  - **Umar ibn al-Khattab** (5 steps): إسلامه وهجرته → خلافته وفتح القدس → الفتوحات الكبرى → نظام الدولة → استشهاده
  - **Uthman ibn Affan** (5 steps): إسلامه وذو النورين → سخاؤه وخلافته → جمع القرآن → الفتوحات والأسطول → استشهاده
  - **Ali ibn Abi Talib** (5 steps): نشأته وإسلامه → شجاعته → خلافته ومعركة الجمل → صفين والتحكيم → استشهاده
  - **Al-Hasan ibn Ali** (5 steps): سبط النبي ﷺ → خلافته → صلحه العظيم → عام الجماعة → وفاته
- **5 new SVG maps**: `svg-abubakr`, `svg-umar`, `svg-uthman`, `svg-ali`, `svg-hasan` — each with campaign arrows, city nodes, era badges, compass, and focus pulse layer.
- **Arabic-Indic numerals** on splash dates (`٥٣ ق.هـ`, `٥٧١ م`, etc.) with `<bdi>` wrappers for correct RTL/LTR rendering.
- **`hideSplash()` / `showSplash()` / `goToSplash()`** functions in `app.js` — splash shown on init, hidden on era select, toggled by back button.
- **`env(safe-area-inset-bottom)`** footer padding for Android system nav bar.

### Changed
- `switchEv()` now toggles all 10 SVGs via array loop, calls `hideSplash()`, and updates header era label.
- `MAP_VB` extended with all 10 era keys.
- `applyZoom()` handles all 10 SVGs.
- `buildTimeline()` builds dots for all eras in background (splash-independent).
- Total steps: 11 + 16 + 6 + 3 + 11 + 5×5 = **72 stages** across 10 eras.

## [2.6.0] — 2026-06-07

### Added
- **New era: "ما قبل البعثة" (Pre-Prophethood) — 11 stages**. The user requested a new tab covering the state of the Arabian Peninsula before the Prophet's mission, based on a provided reference text. The new era sits at the top of the timeline (chronologically first) and includes:
  1. **نظرة على الجزيرة العربية** — Overview of the peninsula (geography, regions, climate)
  2. **عبادة الأصنام وانتشار الشرك** — Idol worship and polytheism (360 idols in the Ka'bah, Hubal, al-Lat, al-Uzza, Manat)
  3. **أديان الأقلية والحنفاء** — Minority religions and the Hanifs (Jews, Christians, Zoroastrians, Waraqah, Zayd ibn Amr)
  4. **النظام القبلي وانعدام الدولة** — The tribal system and absence of a central state
  5. **حروب الجاهلية الكبرى** — Major wars of the Jahiliyyah (Dahis & al-Ghabra, al-Fijar)
  6. **النفوذ الأجنبي** — Foreign influence (Lakhmids, Ghassanids, Abyssinians, Persians)
  7. **المرأة في الجاهلية** — Women in the Jahiliyyah (inheritance, wa'd, marriage)
  8. **الرق والطبقية** — Slavery and class in Jahili society
  9. **التجارة وأسواق الجزيرة** — Trade and markets (Quraysh's two journeys, Ukaz, Majanna, Dhu al-Majaz)
  10. **الشعر والخطابة والمعلقات** — Poetry, oratory, and the Mu'allaqat
  11. **الحاجة إلى بزوغ فجر جديد** — The need for a new dawn (antecedents of the mission)
- **New SVG map: `svg-preb`** — A simplified map of the Arabian Peninsula with:
  - The peninsula outline (dashed emerald border)
  - Major cities: مكة (Mecca, gold), يثرب (Yathrib, blue), الطائف (Taif, purple), نجران (Najran, green), اليمن (Yemen, orange), الحيرة (al-Hirah, red), غسان (Ghassan, blue), البحرين (Bahrain, purple), عُمان (Oman, green), نجد (Najd, gray)
  - Markets: عكاظ (Ukaz), مجنة (Majanna), ذو المجاز (Dhu al-Majaz)
  - Three trade routes (summer to Syria, winter to Yemen, eastern to Bahrain/Iraq) as dashed gold/green arrows
  - Three seas: Red Sea, Persian Gulf, Arabian Sea
  - Era badge "نحو ٥٠٠ - ٥٧٠ م" with "العصر الجاهلي" subtitle
  - Compass, sand dunes, decorative Islamic ornaments
  - Focus pulse + 8-point star wake at the active step's coordinates
- **New event button** in the header switcher: `🏜️ ما قبل البعثة` (Arabic) / `🏜️ Pre-Prophethood` (English), inserted as the first button.
- `app.js`: Added `preb` to `MAP_VB` and to `switchEv()` (mirrors the 4 existing eras with the same `classList.toggle('hidden', key !== 'preb')` pattern). Added `svg-preb` to the `applyZoom()` list so the zoom controls work on the new map.
- Total stages: 11 (preb) + 16 (meccan) + 6 (hijra) + 3 (badr) + 11 (medinan) = **47 stages** (was 36).

### Sources (Ahl al-Sunnah wal-Jama'ah canon)
- البخاري · مسلم · الترمذي · ابن ماجه
- ابن هشام (السيرة النبوية)
- الطبري (تاريخ الأمم والملوك)
- ابن كثير (البداية والنهاية)
- المباركفوري (الرحيق المختوم)
- ابن رشيق (العمدة في صناعة الشعر ونقده)
- ابن عبد ربه (العقد الفريد)

### Minor version bump (2.5.3 → 2.6.0)
- New user-facing content (a new era with 11 stages and a new map).
- Backward compatible: all existing data, all 36 existing stages, all 4 existing maps, and all existing CSS rules are unchanged.

## [2.5.3] — 2026-06-07

### Fixed
- **Dots still hidden behind Android system nav bar** (follow-up to v2.5.2). The previous fix made the strip more compact, but on phones with a system navigation bar (gesture pill or 3-button nav), the bottom of the footer was still being clipped. Fix:
  - Added `env(safe-area-inset-bottom)` to the footer's bottom padding (both desktop `.65rem 1rem .85rem` → `.65rem 1rem calc(.85rem + env(safe-area-inset-bottom))` and mobile `.35rem .55rem .4rem` → `.35rem .55rem calc(.4rem + env(safe-area-inset-bottom))`).
  - **Reordered the footer**: dots row is now FIRST (top of footer), green title strip is SECOND (bottom of footer). The strip is now a "you are here" indicator at the very bottom, just above the system nav bar. The dots are the primary navigation and are now always fully visible.
  - Strip `margin-bottom: .5rem` → `margin-top: .35rem` (now sits below the dots, not above).
  - Removed the dashed border-top on `.tl-wrap` (no longer needed since the strip is clearly below).
- **Google TTS fallback was unreliable** (user: "الصوت صار لا يعمل"). The `googleTTS` function only tried one URL (`translate.google.com` with `client=tw-ob`). If that URL was rate-limited or blocked, audio failed silently and showed the "No voice available" banner. Now tries two endpoints in sequence: `translate.google.com` → `translate.googleapis.com`. If both fail, shows the banner with instructions.

## [2.5.2] — 2026-06-07

### Fixed
- **Green `.tl-name-strip` was still covering the dots on mobile** (follow-up to v2.5.1). Even after moving the track and shrinking the wrap, the strip's `padding: .32rem .55rem` + 1 px border + the wrap's `padding: .55rem 0 .5rem` were pushing the dots out of the visible viewport on small phones. The user reported: "الترقيم خلف الشريط الاخضر ... ارجو تنزيل الشريط الاخضر قليلا ورفع الرقيم قليلا حتى يظهر" (the numbering is hidden behind the green strip — please lower the strip and raise the numbering a little so they show). Fixes:
  - Strip is now visually distinct from the dots: added `border-top: 1px dashed rgba(110, 231, 183, .25)` on `.tl-wrap` to create a hairline separator.
  - Strip is more compact: padding `.32rem .55rem` → `.22rem .5rem`; line-height `1.1`; gap `.55rem` → `.5rem`; title font `.72rem` → `.68rem`; counter font `.66rem` → `.6rem`; counter padding `.15rem .5rem` → `.08rem .42rem`; border-radius `8px` → `6px`.
  - Strip is pushed up further: `margin-bottom: .25rem` → `.5rem` (desktop) and `.2rem` → `.45rem` (mobile); mobile title `.65rem` → `.62rem`; mobile counter `.58rem` → `.54rem`.
  - Wrap is shorter: padding `.55rem 0 .5rem` → `.3rem 0 .55rem`; min-height `32px` → `28px`; `display: flex; align-items: flex-end;` so the dots anchor to the bottom of the wrap. Track is at `bottom: 4px` (was `2px`) with explicit `z-index: 1` so the dots (z-index: 2) always sit above it.
  - Dots are smaller and clearer: 26×26 → 24×24 (desktop), 20×20 (mobile), 18×18 (≤480 px). Nodes now `align-items: flex-end` with `padding: 0 4px; margin-bottom: 2px` so the bottom edge of the dot is always 4 px above the footer's bottom padding.

## [2.5.1] — 2026-06-07

### Fixed
- **Double tā' marbūṭa in "التجارةة"** (introduced by v2.5.0). The v2.5.0 fix replaced Cyrillic "торговл" (7 chars) with Arabic "التجارة" (7 chars), but the original `d8 a9` ة that was already after the Cyrillic was preserved, producing "التجارةة". The text was: `data-ar="↑ رحلتي التجارةة إلى الشام"`. Fixed in 2 places (data-ar attribute + textContent). Correct word is now "التجارة" (single ة).
- **Timeline dots still partially hidden on mobile** (follow-up to v2.5.0). The track was repositioned below the dots in v2.5.0, but the wrap was still too tall, pushing the dots off the bottom of the visible viewport on small phones. Now: `.tl-wrap` padding `1rem .85rem` → `.55rem .5rem` (desktop) and `.35rem .35rem` (mobile); min-height `50px` → `32px` (desktop) and `26px` (mobile). `.tl-nodes` now `align-items: flex-start` with `padding-top: 2px` so the dots sit at the top of the wrap. Dot size reduced to 18×18 (≤480 px) and 20×20 (mobile) to fit more comfortably on small screens.

## [2.5.0] — 2026-06-07

### Fixed
- **Cyrillic text "торговл" in the Meccan map** (long-standing bug from v2.1.0). The Arabic word "التجارة" (al-Tijāra = "trade") was corrupted to Russian "торговл" in `data-ar="↑ رحلتي торговлة إلى الشام"` and the corresponding `textContent`. The byte sequence was `d1 82 d0 be d1 80 d0 b3 d0 be d0 b2 d0 bb` (Cyrillic Торговл) where it should have been `d8 a7 d9 84 d8 aa d8 ac d8 a7 d8 b1` (Arabic التجارة). Fixed in 2 places (data-ar attribute + textContent). **Bumped minor version (2.5.0)** because this is user-visible text corruption.
- **Timeline track was hiding part of the dots.** The track was positioned at `top: 50%` of `.tl-wrap`, which on the new tighter footer (28-38 px min-height) put the 2 px green line through the *middle* of the 22 px dots. The user reported "بعضها جزء منها غير ظاهر" (part of the numbers not visible). Moved the track to `bottom: 4px` (below the dots) and increased `.tl-wrap` min-height to 50 px (desktop) / 38 px (mobile) so there is clear vertical separation.

## [2.4.9] — 2026-06-07

### Added
- **Green title strip in the footer** (per user feedback: "الشريط الاخضر بعنوان الرقم الحالى"). A new `.tl-name-strip` element sits at the top of the footer, styled as a green gradient band (linear-gradient(90deg, rgba(6,78,59,.85), rgba(16,185,129,.35))) with an emerald border. It contains:
  - The current step's **title** (`.tl-name`, white-mint colour `#d1fae5`, `max-width: 72%` so it ellipsises on long titles)
  - The **counter chip** (`.tl-counter`, gold gradient, pill-shaped, "١ / ٦")
- The strip is **physically separated from the dots row** (separate flex container with `margin-bottom: .25rem`), so it can no longer visually cover the numbered dots — the v2.4.8 duplication bug cannot recur.

## [2.4.8] — 2026-06-07

### Fixed
- **Removed title duplication at the bottom of the screen.** The step title was being shown in both `.ev-title` (story panel) and `.tl-name` (footer) — the footer's title with its `📍` prefix was visually covering the numbered dots. Removed the footer title entirely; the footer is now just the counter (`١ / ٦`) and the dots. The story panel's `.ev-title` remains the authoritative place to read the current step's name. `.tl-name` CSS class kept (hidden) in case a future design wants to re-introduce a small footer label.

### Changed
- **Footer counter re-styled** to be more visible: color brightened from `#334155` (near-invisible on dark) to `#cbd5e1`, font-weight 700, right-aligned with a small right padding. Was previously a faint grey; now reads as a clear "step X of Y" indicator.

## [2.4.7] — 2026-06-07

### Changed
- **Mobile sizing tightened further (per user feedback: "تأخذ حيز كبير")**:
  - Timeline dots: `28×28` → `22×22` (mobile) / `24×24` → `20×20` (very small)
  - Dot font: `.7rem` → `.62rem` (mobile) / `.65rem` → `.58rem` (very small)
  - Footer padding: `.55rem .8rem .65rem` → `.35rem .55rem .4rem` (mobile) — saves ~10 px vertical
  - `.tl-wrap` padding: `1.1rem .7rem` → `.55rem .35rem` (mobile)
  - `.tl-wrap` min-height: `38 px` → `28 px` (mobile)
  - `.tl-name` (current-step title): `.82rem` → `.74rem` (mobile)
  - `.tl-counter`: `.72rem` → `.62rem` (mobile)
  - Zoom buttons: `36×34` → `28×26` (mobile); reset button: `44px` → `36px` min-width
  - Zoom button font: `.68rem` → `.58rem` for reset (mobile)

## [2.4.6] — 2026-06-07

### Added
- **Map zoom controls** (− / 100% / +) in the map topbar. Changes the SVG `viewBox` of the currently visible map. Levels: 0.5× (zoom-in 2×), 0.75×, 1.0× (default), 1.5×, 2.0× (zoom-out, fits whole map in frame on small screens). On mobile portrait this is the difference between scrolling and seeing the whole map at a glance.

### Changed
- **Timeline strip simplified to numbering only** (per user feedback): the per-dot labels (`<span class="tl-lbl-main">`, `.tl-lbl-sub`) are now `display: none` on **all** screen sizes — they were wrapping into unreadable fragments on mobile and added visual clutter on desktop. The prominent `#tl-name` in the row above the strip already shows the current step's full title in both languages, so the per-dot labels were redundant. `.tl-wrap` vertical padding reduced to match (1.4 rem → 1 rem top, 0.9 rem → 0.55 rem bottom); `.tl-nodes` min-height reduced to 36 px.

## [2.4.5] — 2026-06-07

### Fixed
- **Wrong map title on Medinan / Meccan / Badr maps in any language (duplicate `#map-label` bug).** Two elements shared the id `map-label` in `index.html`: the first inside the proper `.map-topbar` (line 63) and a *second* one further down (the orphan in the page body). Because `document.getElementById('map-label')` returns the *first* match only, the second (hardcoded "خريطة رحلة الهجرة النبوية") was the one the user actually saw — regardless of the active era. Removed the duplicate. Only the first `#map-label` remains, and `switchEv()` now updates it through `data-ar` / `data-en` attributes (it also persists the active era to `localStorage` as `sera.evt`, so the user's last selected event is restored on next visit).
- **Map area was being cut off in some viewports.** `.svg-wrap` used `padding-top: 80%` (a width-based padding hack that interacts unpredictably with `aspect-ratio` on responsive containers). Replaced with `aspect-ratio: 700 / 560` and changed `.map-svg` from `overflow: hidden` to `overflow: visible` so the full map (including any node wake that extends past the viewBox edge) is always rendered unclipped.
- **`#map-label` not bilingual on initial mount.** The label was set by `switchEv()` only (which used `t('mapLabel')` at the moment of switch — but the LANG it picked was the *runtime* LANG, not the *saved* one). The label now carries `data-ar` / `data-en` attributes that are refreshed by `switchEv()` and re-translated by `applyLanguage()`, so the saved language is always reflected even on cold load.
- **English screens contained Arabic words inside the Medinan map SVG.** Five `<text>` elements (`🕋 مكة المكرمة`, `🪓 الخندق`, `⛰️ أحد`, `🕋 مكة`, `🕌 المدينة المنورة`) and their subtitles were hardcoded in Arabic without `data-ar` / `data-en` pairs — so they would have remained in Arabic even when the user toggled to English. All five now carry bilingual attribute pairs; their EN equivalents are: `🕋 Makkah Al-Mukarramah`, `🪓 The Trench`, `⛰️ Mount Uhud`, `🕋 Makkah`, `🕌 Madinah Al-Munawwarah`. Subtitles (e.g. `Battle of the Trench · 5 AH`) are now bilingual too. **Verified 79/79 `data-ar` ↔ `data-en` balance across `index.html`.**
- **Audio error banner was permanent.** When no Arabic voice was installed, the `#diag` banner would show "Google TTS blocked — install Arabic voice" and stay on screen indefinitely. The banner now **auto-dismisses after 5.5 seconds** and is **click-to-dismiss** (cursor pointer, click anywhere on the banner to hide it immediately). The error text is now also more actionable: "No voice available — install Arabic voice in Windows Settings → Time & Language → Language".
- **`init()` did not invoke `switchEv()` on mount.** As a result, the map-label kept its hardcoded Arabic initial value, the map focus pulse was not positioned, and the timeline-strip initial focus dot was missing. `init()` now calls `switchEv(EVT)` first (which sets the map label, switches the visible SVG, calls `buildTimeline()`, positions the focus pulse, and renders the step), then `buildTimeline()`, then `applyLanguage()`. This is also what made the duplicate-`#map-label` bug visible to the user.

### Changed
- **`EVT` is now persisted** to `localStorage` as `sera.evt`, alongside `LANG`, `TTS_MODE`, and `AUTO_NARRATE`. Reload now restores the user's last active event.
- **Diagnostic banner UX**: new auto-dismiss after 5.5s, click-to-dismiss, "stays put" only on sticky success states.

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
