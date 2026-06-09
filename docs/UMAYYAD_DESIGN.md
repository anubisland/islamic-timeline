# Umayyad Caliphate Module — Design Document

> **Status:** Design approved ✓ — awaiting implementation.
> **Sources (exclusive):** الطبري (تاريخ الأمم والملوك), ابن الأثير (الكامل في التاريخ), د. الصلابي (الدولة الأموية), د. عبد الشافي (موسوعته)
> **Total steps:** 24 across 4 phases (6+8+5+5), inserted chronologically after `hasan` in `window.SEERAH_DB`.
> **Map:** 1000×560 viewBox (wider than existing 700×560 to cover Umayyad extent).
> **Special treatment — Phase 3 (Umar II):** New `amb-reform` CSS class with golden-amber gradient on map.

---

## 1. Content Structure: Four Phases, One Era

The Umayyad period (41–132 AH / 661–750 CE) is added as a **single era key `umawi`** in `data.js`'s `SEERAH_DB`, between `hasan` and any future module. The four phases are logical groupings within the flat `steps[]` array — no sub-eras or UI nesting.

```
SEERAH_DB (data.js) — chronological order:
  preb → meccan → hijra → badr → medinan → abubakr → umar → uthman → ali → hasan → umawi (NEW)
```

| Phase | Title (Ar) | Title (En) | AH Range | Steps | Emphasis |
|-------|-----------|-----------|----------|-------|----------|
| 1 | التأسيس والاستقرار | Foundation & State-Building | 41–64 | 6 | Year of Unity, Qayrawan, early crises |
| 2 | المروانيون والفتوحات الكبرى | Marwanids & Great Conquests | 65–99 | 8 | Abd al-Malik's reforms, Transoxiana, Sindh, Andalusia |
| 3 | الإصلاح الراشدي — عمر بن عبد العزيز | Rightly-Guided Reform — Umar II | 99–101 | 5 | Core of the lecture, justice, hadith compilation |
| 4 | الهبوط وسقوط الدولة | Decline & Fall | 101–132 | 5 | Tribal strife, last strong caliphs, fall |

**Total: ~24 steps** (largest single era, reflecting the 91-year span).

---

### 1.1 Phase 1 — التأسيس والاستقرار (41–64 AH) — 6 steps

Based on الطبري وابن الأثير (annals), analysed by د. الصلابي on national unity.

| Step | Key Event | Figures | Sources |
|------|-----------|---------|---------|
| 0 | **عام الجماعة (41 هـ):** تنازل الحسن بن علي بالخلافة لمعاوية بن أبي سفيان، وحقن دماء المسلمين | الحسن بن علي، معاوية بن أبي سفيان | الطبري، ابن الأثير |
| 1 | **بناء الدولة وعهد معاوية:** السياسة والإدارة الأموية، شعرة معاوية | معاوية بن أبي سفيان | الصلابي |
| 2 | **تأسيس القيروان (50 هـ):** قاعدة عسكرية للمسلمين في المغرب العربي | عقبة بن نافع الفهري | ابن الأثير، الطبري |
| 3 | **حصار القسطنطينية الأول (54–60 هـ):** الحملات البحرية والبرية الكبرى، وفاة أبي أيوب الأنصاري | يزيد بن معاوية، أبو أيوب الأنصاري | الطبري، ابن الأثير |
| 4 | **وفاة معاوية (60 هـ):** بداية عهد يزيد، مقتل الحسين في كربلاء | يزيد بن معاوية، الحسين بن علي | الطبري (بالإسناد)، الصلابي |
| 5 | **وقعة الحرة والاضطرابات (63–64 هـ):** الأحداث السياسية في المدينة | عبد الله بن الزبير | الطبري، الصلابي (منظور سني منصف) |

### 1.2 Phase 2 — المروانيون والفتوحات الكبرى (65–99 AH) — 8 steps

وثقها د. عبد الشافي في موسوعته كمرحلة البناء المؤسسي الفعلي.

| Step | Key Event | Figures | Sources |
|------|-----------|---------|---------|
| 6 | **تولية عبد الملك بن مروان (65 هـ):** بداية إنهاء الانقسامات | عبد الملك بن مروان | الطبري، د. عبد الشافي |
| 7 | **القضاء على الفتن:** القضاء على المختار الثقفي ثم ابن الزبير | عبد الملك بن مروان، الحجاج بن يوسف | الطبري، ابن الأثير |
| 8 | **تعريب الدواوين وسك العملة (73 هـ):** أول دينار إسلامي أموي خالص | عبد الملك بن مروان، الحجاج | د. عبد الشافي |
| 9 | **بناء قبة الصخرة (73 هـ):** رمز الدولة الأموية في القدس | عبد الملك بن مروان | الطبري |
| 10 | **العصر الذهبي للفتوحات — عهد الوليد (86–96 هـ):** فتح ما وراء النهر (قتيبة بن مسلم — بخارى وسمرقند) وفتح السند (محمد بن القاسم) | الوليد بن عبد الملك، قتيبة بن مسلم، محمد بن القاسم الثقفي | ابن الأثير، د. عبد الشافي |
| 11 | **فتح الأندلس (92–93 هـ):** معركة شذونة، بقيادة طارق بن زياد وموسى بن نصير | طارق بن زياد، موسى بن نصير | ابن الأثير، الصلابي |
| 12 | **عهد سليمان بن عبد الملك (96–99 هـ):** حصار القسطنطينية الثاني (98 هـ) بقيادة مسلمة، وتولية عمر بن عبد العزيز بناءً على نصيحة الرجاء بن حيوة | سليمان بن عبد الملك، مسلمة بن عبد الملك، الرجاء بن حيوة | ابن الأثير (بالتفصيل) |

### 1.3 Phase 3 — عهد عمر بن عبد العزيز (99–101 AH) — 5 steps (محور المحاضرة)

مستخلص من كتاب الصلابي بالتكامل مع روايات ابن الأثير والطبري. هذه المرحلة هي قلب المحاضرة.

| Step | Year | Reform Event | Figures | Sources |
|------|------|-------------|---------|---------|
| 13 | **99 هـ** | **تولي الخلافة ورد المظالم:** رفض الرفاهية الملكية، رد الأموال والإقطاعيات إلى بيت المال، بدأ بنفسه وزوجته فاطمة بنت عبد الملك | عمر بن عبد العزيز، فاطمة بنت عبد الملك | الصلابي، ابن الأثير |
| 14 | **99 هـ** | **تغيير السياسة العسكرية:** أمر مسلمة برفع حصار القسطنطينية فوراً، تغيير الاستراتيجية من التوسع إلى الدعوة | عمر بن عبد العزيز، مسلمة بن عبد الملك | الطبري |
| 15 | **100 هـ** | **تدوين الحديث النبوي:** أول أمر رسمي لجمع الحديث، كتب إلى أبي بكر بن حزم والزهري | عمر بن عبد العزيز، ابن شهاب الزهري، أبو بكر بن حزم | الصلابي، ابن الأثير |
| 16 | **100 هـ** | **الإصلاح الاقتصادي والاجتماعي:** إسقاط الجزية عمن أسلم، توزيع عادل للزكاة حتى عدم وجود فقراء | عمر بن عبد العزيز | الصلابي، الطبري |
| 17 | **101 هـ** | **وفاته رضي الله عنه:** استشهاد مسموماً في دير سمعان بالشام، عمر 40 سنة، خلافة سنتين وخمسة أشهر | عمر بن عبد العزيز | ابن الأثير، الطبري |

### 1.4 Phase 4 — الهبوط وسقوط الدولة (101–132 AH) — 5 steps

يركز د. عبد الشافي والصلابي على تداعيات الانهيار السلوكية والسياسية.

| Step | Key Event | Figures | Sources |
|------|-----------|---------|---------|
| 18 | **الخلفاء بعد عمر (101–105 هـ):** يزيد بن عبد الملك، تدهور الإصلاحات | يزيد بن عبد الملك | الطبري |
| 19 | **هشام بن عبد الملك (105–125 هـ):** آخر الخلفاء الأقوياء، تماسك الدولة | هشام بن عبد الملك | د. عبد الشافي |
| 20 | **بلاط الشهداء — تور (114 هـ):** معركة في فرنسا، استشهاد عبد الرحمن الغافقي وجيش كبير | عبد الرحمن الغافقي | ابن الأثير (بالتفصيل) |
| 21 | **الفتنة والصراع الداخلي (126–131 هـ):** مقتل الوليد بن يزيد، توالي الخلفاء الضعاف، اشتعال العصبية القبلية (المضرية واليمانية) | الوليد بن يزيد | الطبري |
| 22 | **معركة الزاب (132 هـ):** مروان بن محمد آخر الخلفاء، مقتله في مصر، سقوط الدولة الأموية في الشرق بعد 91 عاماً | مروان بن محمد | ابن الأثير، د. عبد الشافي |
| 23 | **خاتمة:** تحليل أسباب السقوط — غياب الشورى، العصبية القبلية، الترف — دروس للأمة | — | الصلابي، د. عبد الشافي |

---

### 1.5 Step-to-SVG City Mapping

| Step | Primary City | mapFocus {x, y} | Notes |
|------|-------------|-----------------|-------|
| 0 | دمشق | 500, 280 | Capital |
| 1 | دمشق | 500, 280 | Governance |
| 2 | القيروان | 140, 440 | Ifriqiya |
| 3 | القسطنطينية | 610, 50 | Callout: 1st siege |
| 4 | كربلاء | 570, 340 | Iraq |
| 5 | المدينة | 460, 450 | Hejaz |
| 6 | دمشق | 500, 280 | Capital |
| 7 | العراق | 570, 340 | Iraq |
| 8 | دمشق | 500, 280 | Coinage mint |
| 9 | بيت المقدس | 480, 310 | Dome of the Rock |
| 10 | سمرقند | 940, 240 | Transoxiana |
| 11 | قرطبة | 50, 500 | Callout: Andalusia |
| 12 | القسطنطينية | 610, 50 | Callout: 2nd siege |
| 13 | دمشق | 500, 280 | Umar II — reform era |
| 14 | دمشق | 500, 280 | Military policy |
| 15 | المدينة | 460, 450 | Hadith compilation |
| 16 | الشام | 500, 280 | Economic reform |
| 17 | دير سمعان | 480, 290 | Death place |
| 18 | دمشق | 500, 280 | Succession |
| 19 | دمشق | 500, 280 | Hisham |
| 20 | تور (فرنسا) | 140, 80 | Callout: NW |
| 21 | الشام | 500, 280 | Internal strife |
| 22 | الزاب | 610, 360 | Final battle |
| 23 | — | 500, 280 | Conclusion |

---

## 2. Data Schema

The era follows the exact `data.js` format (quoted JSON-style keys, matching existing eras):

```js
"umawi": {
    "labelAr": "الدولة الأموية",
    "labelEn": "Umayyad Caliphate",
    "mapLabelAr": "الدولة الأموية في أقصى اتساعها",
    "mapLabelEn": "Umayyad Caliphate at Its Greatest Extent",
    "stepCountAr": "مرحلة",
    "stepCountEn": "stages",
    "offsets": [],
    "steps": [
        {
            "ayah": "﴿ وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا وَلَا تَفَرَّقُوا ﴾",
            "ayahRef": "سورة آل عمران — الآية ١٠٣",
            "ayahEn": "And hold firmly to the rope of Allah all together and do not become divided",
            "ayahRefEn": "Surah Al-Imran (3), verse 103",
            "dateAr": "٤١ هـ / ٦٦١ م",
            "dateEn": "41 AH / 661 CE",
            "titleAr": "عام الجماعة — تنازل الحسن عن الخلافة",
            "titleEn": "The Year of Unity — Hasan's Abdication",
            "mtAr": "دمشق",
            "mtEn": "Damascus",
            "mdAr": "حقن الدماء وتوحيد الصف",
            "mdEn": "Bloodshed averted, ranks united",
            "amb": "day",
            "timeAr": "🌤️ نهاراً",
            "timeEn": "☀️ Daytime",
            "distAr": "📍 الشام",
            "distEn": "📍 Levant",
            "descAr": "في عام 41 هـ تنازل الحسن بن علي رضي الله عنهما عن الخلافة لمعاوية بن أبي سفيان رضي الله عنه،..."
            "descEn": "In 41 AH, al-Hasan ibn Ali (RA) abdicated the caliphate to Mu'awiyah ibn Abi Sufyan (RA)...",
            "charsAr": [
                { "i": "🤝", "n": "الحسن بن علي رضي الله عنهما", "r": "المتنازل عن الخلافة حقناً للدماء" },
                { "i": "👤", "n": "معاوية بن أبي سفيان رضي الله عنه", "r": "مؤسس الدولة الأموية" }
            ],
            "charsEn": [
                { "i": "🤝", "n": "Al-Hasan ibn Ali (RA)", "r": "Abdicated the caliphate to prevent bloodshed" },
                { "i": "👤", "n": "Mu'awiyah ibn Abi Sufyan (RA)", "r": "Founder of the Umayyad state" }
            ],
            "lessonAr": "الوحدة مقدمة على الحقوق الشخصية — تنازل الحسن يعلم الأمة أن حقن دماء المسلمين أعلى مقصداً من المناصب السياسية",
            "lessonEn": "Unity precedes personal rights — al-Hasan's abdication teaches that preserving Muslim lives is a higher objective than political office",
            "srcs": ["الطبري (تاريخ الأمم والملوك)", "ابن الأثير (الكامل في التاريخ)"],
            "mapFocus": { "x": 350, "y": 280, "scale": 1.0 }
        }
        // ... 23 more steps
    ]
}
```

### Field Notes

- **`ayah` / `ayahRefEn`**: Every step needs a relevant Quranic verse:
  - Phase 1 (unity): آل عمران 3:103, الأنفال 8:46, الحجرات 49:9
  - Phase 2 (conquest/justice): الحج 22:39-40, الفتح 48:1-3
  - Phase 3 (justice/zakat): المائدة 5:8, التوبة 9:60, الحديد 57:25, النحل 16:90
  - Phase 4 (decline): الأنفال 8:53, الرعد 13:11, الإسراء 17:15
- **`srcs[]`**: Every step references ≥2 of the four approved sources. Phase 1 heavily uses الطبري + ابن الأثير. Phase 3 (Umar II) is anchored in الصلابي + ابن الأثير. Phase 4 draws on د. عبد الشافي + الصلابي.
- **`amb`**: Default `"day"`. Battle steps: `"dawn"` (بلاط الشهداء), `"night"` (الفتنة الداخلية). Phase 3 (Umar II): **`"reform"`** — a new CSS ambient class with golden-amber gradient (see §3.2).
- **`chars[]`**: Maximum 4 per step. Key figures from the user's content.

---

## 3. SVG Map

### Approach: Wider Map (1000×560, Sham-centered with peripheral callouts)

The Umayyad empire spans from Cordoba to Samarkand — far beyond any existing era map. A `1000×560` viewBox provides room to show from Qayrawan to Samarkand within the frame, with Cordoba, Constantinople, and Sindh as edge callouts.

**Why 1000×560:**
- Shows the core Umayyad axis (Qayrawan → Damascus → Merv → Samarkand) in-frame
- Matches existing 560px height, so no layout changes needed to surrounding UI
- Al-Andalus (Cordoba), Constantinople, and Sindh (Debal) rendered as decorative callout labels with dotted connecting lines
- `MAP_VB` entry: `umawi: [1000, 560]`

### City Coordinates (1000×560 viewBox)

| City | x, y | Type | Notes |
|------|------|------|-------|
| Damascus (دمشق) | 500, 280 | Main node | Capital, most steps |
| Jerusalem (القدس) | 480, 310 | Node | Dome of the Rock |
| Fustat/Cairo (الفسطاط) | 360, 390 | Node | Egypt |
| Qayrawan (القيروان) | 140, 440 | Node | Ifriqiya, Phase 1 |
| Kufa (الكوفة) | 570, 340 | Node | Iraq |
| Madinah (المدينة) | 460, 450 | Node | Hejaz |
| Merv (مرو) | 860, 280 | Node | Khurasan |
| Samarkand (سمرقند) | 940, 240 | Node | Transoxiana |
| Dayr Sim'an (دير سمعان) | 480, 290 | Node | Near Damascus |
| Constantinople (القسطنطينية) | 610, 50 | Callout | Arrow from Damascus |
| Cordoba (قرطبة) | 50, 500 | Callout | Line via Tangier |
| Debal (الديبل) | 900, 420 | Callout | Sindh |
| Al-Zab (الزاب) | 610, 360 | Node | Iraq |

### SVG Elements

```
<svg id="svg-umawi" class="map-svg hidden" viewBox="0 0 1000 560" ...>
  <g class="map-frame" opacity=".55">
    <!-- 4 decorative star corners (matching existing) -->
  </g>
  <g class="map-pan" id="pan-umawi">
    <defs>
      <!-- Sea gradient: deep Mediterranean -->
      <!-- Land gradient: emerald → gold for desert -->
    </defs>
    <!-- Basemap: stylized Mediterranean coastline -->
    <!-- Callout lines: Cordoba, Constantinople, Debal (dotted) -->
    <!-- City nodes: circles + bilingual data-ar/data-en labels -->
    <!-- Focus layer: -->
    <g id="focus-umawi" style="display:none">
      <circle class="focus-pulse" cx="0" cy="0" r="8" fill="none" stroke="#C5A059" stroke-width="3"/>
      <polygon class="star-wake" points="0,-22 6,-6 22,0 6,6 0,22 -6,6 -22,0 -6,-6"/>
    </g>
  </g>
</svg>
```

### City Label Pattern

```html
<circle cx="350" cy="280" r="4" fill="#C5A059"/>
<text x="358" y="284"
      data-ar="دمشق"
      data-en="Damascus"
      font-size="10" fill="#C5A059">دمشق</text>
```

---

## 3.2 Special Visual Indicator — Phase 3 (Umar II)

Phase 3 (steps 13–17, Umar ibn Abd al-Aziz, 99–101 AH) is the core of the lecture. Three visual treatments set it apart:

### A. New `amb-reform` CSS Class

The existing ambient system (`amb-night`, `amb-dawn`, `amb-day`) applies a gradient to the map overlay. Add a fourth class `amb-reform` with a warm golden-amber glow:

```css
/* style.css — new ambient for Umar II's reform era */
.amb-reform { background: radial-gradient(ellipse at center, rgba(197, 160, 89, .18) 0%, rgba(197, 160, 89, .04) 60%, transparent 80%); }
```

Phase 3 steps set `"amb": "reform"` in their step object. `app.js` already applies `amb-<value>` generically — no JS changes needed.

### B. Golden Ribbon on the Step Title

In `style.css`, when viewing a Phase 3 step, add a decorative gold bar above the step title:

```css
/* Phase 3 indicator — activated when the step has amb="reform" */
.amb-reform + .tl-story .tl-title::before {
  content: '';
  display: block;
  width: 60px;
  height: 3px;
  background: #C5A059;
  margin-bottom: 8px;
  border-radius: 2px;
}
```

However, this requires `amb-reform` to be on a parent element accessible via CSS sibling selectors. If that's not feasible, a simpler approach: add a gold ribbon emoji/icon in the `mdAr`/`mdEn` field for Phase 3 steps, e.g.:

```
"mdAr": "🌟 عهد الخليفة الراشدي الخامس",
"mdEn": "🌟 Era of the Fifth Rightly-Guided Caliph"
```

### C. Timeline Dot Accent (Optional)

Phase 3 timeline dots could be colored gold instead of the default gold-outline. This would need a minor change to `buildTimeline()` in `app.js` to add a class like `dot-reform` for steps 13–17. Low priority — Option B alone is sufficient for visual distinction.

**Recommendation:** Implement A (`amb-reform`) and B (gold ribbon icon in `mdAr`/`mdEn`) for Phase 3. These require minimal code and clearly mark the reform era.

---

## 4. Integration Points

### 4.1 `data.js` — Append `umawi` Era

Insert after the `hasan` era closure (~line 3678 in current file). 24 step objects. Format matches existing eras exactly (quoted keys, `offsets: []`).

### 4.2 `index.html` — Three Additions

**A. Splash Button — Section Header + Caliph Card**

The Umayyads are conceptually distinct from the Rashidun (*khulafā' rāshidūn*). Add a section divider between the Rashidun grid and the Umayyad card:

```html
<!-- داخل splash بعد rashidun-grid وقبل imams-section -->
<div class="splash-section-divider">
  <span class="ssd-line"></span>
  <span class="ssd-label" data-ar="الخلافة الأموية" data-en="Umayyad Caliphate">الخلافة الأموية</span>
  <span class="ssd-line"></span>
</div>
<div class="umawi-card" data-ev="umawi" role="button" tabindex="0">
  <span class="cc-icon">🏛️</span>
  <div class="cc-name">
    <span data-ar="الدولة الأموية" data-en="Umayyad Caliphate">الدولة الأموية</span>
  </div>
  <div class="cc-dates">
    <bdi>٤١ - ١٣٢ هـ</bdi>
    <span class="ec-sep">|</span>
    <bdi>٦٦١ - ٧٥٠ م</bdi>
  </div>
</div>
```

The CSS selector for click handling will need to include `.umawi-card`:
```js
document.querySelectorAll('.era-card, .caliph-card, .umawi-card').forEach(...)
```

**B. Inline SVG Map** — After `svg-hasan`, before `svg-imam`.

**C. Bilingual Data-Attribute Sweep** — Run the regex check after adding SVG text.

### 4.3 `app.js` — Changes

| Location | Change |
|----------|--------|
| `MAP_VB` (line 61) | Add `umawi: [1000, 560]` |
| `switchEv()` allSvgs (line 562) | Add `'svg-umawi'` |
| `init()` click handler (line 1103) | Add `.umawi-card` to selector |
| `narrationURL()` (line 694) | **No change** — `EVT` key routing works |
| `applyMapFocus()` (line 593) | **No change** — `MODE` routing works |
| `setAudioPulse()` (line 661) | **No change** — `MODE` routing works |

### 4.4 `tools/narration_ar.json`

Add 24 entries: `"umawi_0"` through `"umawi_23"`. Each must match the consonant skeleton of the corresponding `descAr`. The Umar II phase (steps 13–17) must have fully diacritized mushakkal text for correct TTS.

### 4.5 `timeline_data.geojson`

Append features for each unique location: Damascus, Qayrawan, Karbala, Constantinople, Kufa, Madinah, Jerusalem, Samarkand, Cordoba, Debal, Dayr Sim'an, Al-Zab. Each `event_id` set to `"umawi_<n>"`.

### 4.6 Audio Generation

```bash
python tools/gen_tts.py --eras umawi
# 4 slots × 2 languages × 24 steps = 192 new MP3 clips
```

---

## 5. Implementation Checklist

- [ ] **Design approved** — confirm the step breakdown, map approach, and splash layout
- [ ] **Phase 1 — Data:**
  - [ ] Write 24 step objects in `data.js`
  - [ ] Add `narration_ar.json` entries (mushakkal for all 24 steps)
  - [ ] `python tools/check_voc.py`
  - [ ] Add GeoJSON features
  - [ ] `node --check data.js`
  - [ ] `node -e "JSON.parse(fs.readFileSync('timeline_data.geojson'))"`
- [ ] **Phase 2 — UI:**
  - [ ] Update `index.html`: section divider + `.umawi-card`
  - [ ] Add `svg#svg-umawi` inline SVG (viewBox 1000×560)
  - [ ] `app.js`: `MAP_VB` (`umawi: [1000, 560]`), `allSvgs`, click handler
  - [ ] Add `.amb-reform` CSS class to `style.css` (golden-amber gradient)
  - [ ] Update `style.css` with Phase 3 golden ribbon styles
  - [ ] `data-ar`/`data-en` sweep
- [ ] **Phase 3 — Audio:**
  - [ ] `python tools/gen_tts.py --eras umawi` (192 clips)
  - [ ] Verify `audio/*/umawi_*_*.mp3` exist
  - [ ] Verify `audio/manifest.json` updated
- [ ] **Phase 4 — Verification:**
  - [ ] Open in browser, test all 24 steps
  - [ ] Test AR ↔ EN toggle
  - [ ] Test 4 voice slots
  - [ ] Test verse recitation per step
  - [ ] Test map focus positioning
  - [ ] Test mobile (360px, 720px)
  - [ ] Test back nav: Umayyad → splash → home → imams → back
- [ ] **Phase 5 — Release:**
  - [ ] Update `CHANGELOG.md`
  - [ ] Bump `package.json` to v2.13.0
  - [ ] Update `AGENTS.md` / `CLAUDE.md`
  - [ ] Push to `main`

---

## 6. Design Decisions

| # | Decision | Choice | Rationale |
|---|----------|--------|-----------|
| 1 | Era key | `umawi` | Single key, matches existing pattern |
| 2 | Step count | 24 | 6+8+5+5, reflecting the 91-year span |
| 3 | Map dimensions | 1000×560 ✓ | Wider viewBox to show Qayrawan → Samarkand in-frame |
| 4 | Splash position | After Rashidun grid, with section divider | Conceptually distinct from *khulafā' rāshidūn* |
| 5 | Phase 3 treatment | 5 detailed steps (محور المحاضرة) ✓ | Matches the user's 5-event table for Umar II |
| 6 | Source anchoring | الطبري + ابن الأثير for annals, الصلابي + عبد الشافي for analysis | Per user's four-source methodology |
| 7 | Phase 3 indicator | `amb-reform` CSS class + gold ribbon icon in `mdAr`/`mdEn` ✓ | New CSS gradient class + icon in data; no JS changes |

---

## 7. Risks

- **Map density**: 24 steps × mapFocus on ~15 unique coordinates is manageable. No map needs more than 3 focus shifts per city.
- **Step count**: 24 is the largest era (next largest: Meccan with 16). The timeline strip handles arbitrary counts, but check mobile scroll.
- **Audio generation time**: ~192 clips × ~2s each = ~6-7 minutes for TTS generation. Run with `--eras umawi` to avoid regenerating all eras.
- **Splash scroll**: Adding a sixth card + section divider + existing content may overflow on smaller devices. Monitor at 360px breakpoint.
