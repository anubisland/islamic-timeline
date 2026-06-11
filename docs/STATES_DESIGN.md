# الدول والممالك المستقلة Module — Design Document

> **Status:** ✅ Design approved — ready for implementation.
> **Sources (exclusive):** ابن الأثير (الكامل في التاريخ), ابن كثير (البداية والنهاية), د. الصلابي (الدولة العباسية), د. طقوش (تاريخ الدولة العباسية), د. راغب السرجاني (قصة الأندلس, قصة صلاح الدين), د. شوقي أبو خليل (حطين, عين جالوت)
> **Total steps:** 3 stages in a single era key `muq` within `window.SEERAH_DB`.
> **Map:** 1000×560 viewBox (Levant-centered with peripheral callouts for Andalusia, Cairo, Baghdad).
> **Special treatment:** No phase-selection screen — home card leads directly into the 3-step timeline.

---

## 1. Content Structure: 3 Stages, One Era

The module covers three major historical themes that bridge the Abbasid decline and the rise of new Islamic powers. It is added as a **single era key `muq`** in `data.js`'s `SEERAH_DB`, inserted after `abassi` and before `uthmani`.

```
SEERAH_DB (data.js) — chronological order:
  preb → meccan → hijra → badr → medinan → abubakr → umar → uthman → ali → hasan → umawi → abassi → muq (NEW) → uthmani
```

| Step | Title (Ar) | Title (En) | Approx. Date | Emphasis |
|------|-----------|-----------|-------------|----------|
| 0 | الدول والممالك المستقلة والملامسة للحقب الكبرى | Independent States & Kingdoms Touching the Great Eras | 138–923 AH / 756–1517 CE | Reference overview of the Umayyads in Andalusia, Fatimids, Ayyubids, and Mamluks with timelines, major figures, geographic extent, and historical lessons |
| 1 | معركة حطين | Battle of Hattin | 25 Rabi' II 583 AH / 4 July 1187 CE | Detailed treatment of Saladin's strategic masterpiece — the dehydration trap, psychological warfare, encirclement, and the battle that led to the liberation of Jerusalem |
| 2 | معركة عين جالوت | Battle of Ain Jalut | 25 Ramadan 658 AH / 3 September 1260 CE | Detailed treatment of Qutuz and Baybars' victory that broke the Mongol myth of invincibility — the ambush at the valley, tactical feigned retreat, and the salvation of the Islamic world |

**Total: 3 steps** — concise but comprehensive, each step deserving of dedicated deep coverage.

---

### 1.1 Step 0 — الدول والممالك المستقلة والملامسة للحقب الكبرى

This is a **reference overview stage** (not a narrative of a single event). It presents a comparative table/summary of the four major independent states/kingdoms that arose during/alongside the Abbasid Caliphate:

#### المملكة 1: الدولة الأموية في الأندلس
- **Duration:** 138–422 AH / 756–1031 CE (275 years — longer than the Umayyad Caliphate in the East)
- **Founder:** عبد الرحمن الداخل (صقر قريش)
- **Peak:** عبد الرحمن الناصر — proclaimed himself Caliph (316 AH / 929 CE)
- **Extent:** Most of the Iberian Peninsula
- **Key Achievement:** A unique civilization that blended Arab, Berber, Iberian, and classical elements; cradle of European Renaissance
- **Lesson:** Internal fragmentation (ملوك الطوائف) destroyed what no external enemy could

#### المملكة 2: الدولة الفاطمية (العبيدية)
- **Duration:** 297–567 AH / 909–1171 CE (262 years)
- **Founder:** عبيد الله المهدي
- **Peak:** المعز لدين الله — founded Cairo (360 AH / 970 CE)
- **Extent:** North Africa, Egypt, Levant, Hejaz (competing with Abbasids)
- **Key Achievement:** Built Cairo and al-Azhar Mosque; a rival caliphate that forced the Abbasids to reform
- **Lesson:** Imposing a sectarian creed (Isma'ili Shi'ism) by force created a permanent legitimacy gap; reliance on viziers (especially Armenians) collapsed the state

#### المملكة 3: الدولة الأيوبية
- **Duration:** 569–648 AH / 1174–1250 CE (76 years)
- **Founder:** صلاح الدين الأيوبي
- **Peak:** Liberation of Jerusalem after the Battle of Hattin (583 AH / 1187 CE)
- **Extent:** Egypt, Syria, Hejaz, Yemen, Upper Mesopotamia
- **Key Achievement:** Reunified Egypt and Syria under Sunni rule, crushed the Fatimid caliphate, liberated Jerusalem
- **Lesson:** The strategic unity of Egypt and Syria is the bedrock that breaks all invasions of the Islamic world

#### المملكة 4: دولة المماليك
- **Duration:** 648–923 AH / 1250–1517 CE (267 years)
- **Founder:** سيف الدين قطز (de facto), الظاهر بيبرس (builder)
- **Peak:** Victory at Ain Jalut (658 AH / 1260 CE), final expulsion of the Crusaders, protection of the Abbasid shadow caliphate
- **Extent:** Egypt, Syria, Hejaz, parts of Anatolia and North Africa
- **Key Achievement:** The only power that defeated both the Crusaders AND the Mongols; saved Islamic civilization from annihilation
- **Lesson:** Military competence + social justice in times of crisis can save a nation from certain destruction

| Figures | Sources |
|---------|---------|
| عبد الرحمن الداخل, عبد الرحمن الناصر, المنصور بن أبي عامر; عبيد الله المهدي, المعز لدين الله, بدر الجمالي; صلاح الدين الأيوبي, الملك العادل, الملك الكامل; سيف الدين قطز, الظاهر بيبرس, الأشرف خليل | ابن الأثير, د. راغب السرجاني, د. الصلابي |

---

### 1.2 Step 1 — معركة حطين (583 AH / 1187 CE)

Based on ابن الأثير (detailed battle account), د. راغب السرجاني (قصة صلاح الدين), د. شوقي أبو خليل.

#### Strategic Context
- Saladin spent 12+ years (1174–1186) uniting Egypt, Syria, and Mesopotamia into a single Sunni bloc
- Reynald de Châtillon (أرناط) violated the truce by attacking a wealthy Muslim caravan
- Saladin used this betrayal as a *casus belli* for a general jihad mobilization

#### The Trap
- Saladin attacked Tiberias (owned by Raymond III's wife), provoking the Crusader army to leave their fortified water-rich position at Saffuriya
- The Crusaders marched 27 km in July heat wearing full plate armor
- Saladin's light cavalry harassed them constantly; his army seized and fortified all water sources
- Night of 3–4 July: Saladin's troops set fire to dry brush around the Crusader camp — smoke + heat + thirst destroyed morale

#### The Battle
- Sunday 4 July 1187: the Muslim army completely encircled the Crusaders
- The infantry fled to the Twin Horns of Hattin, leaving the knights exposed
- Arrows rained like locusts, killing horses (the backbone of Crusader power)
- Saladin's tactics: open false gaps to let knights charge through, then close the gap and isolate them
- King Guy of Lusignan captured; Reynald executed personally by Saladin for oath-breaking
- The True Cross (carried into battle) captured — a psychological blow to Christendom

#### Strategic Result
- The entire Crusader field army was annihilated — not defeated, **annihilated**
- Within 3 months, Jerusalem fell (October 1187) after 88 years of occupation
- Most Crusader castles and cities surrendered or were taken

| Figures | Sources |
|---------|---------|
| صلاح الدين الأيوبي, غي دي لوزينيان (King Guy), رينو دي شاتيون (أرناط), ريموند الثالث أمير طرابلس, جيرار دي ريدفورت (قائد فرسان الهيكل), تقي الدين عمر (ابن أخ صلاح الدين), الملك العادل (أخو صلاح الدين) | ابن الأثير, د. راغب السرجاني, د. شوقي أبو خليل |

---

### 1.3 Step 2 — معركة عين جالوت (658 AH / 1260 CE)

Based on ابن كثير (detailed narrative), د. راغب السرجاني, د. شوقي أبو خليل.

#### Strategic Context
- The Mongols under Hulagu had sacked Baghdad (1258), ending the Abbasid Caliphate
- They then swept through Syria, taking Aleppo and Damascus without serious resistance
- Only Mamluk Egypt remained as the last bulwark of Islamic power
- Sultan Qutuz seized power from the child sultan al-Mansur Ali to lead decisively

#### Pre-Battle Strategy
- Qutuz liquidated wealthy amirs and Mamluks to finance the army before taxing the people — creating popular support
- He sent an embassy to the Crusaders at Acre, threatening annihilation if they cooperated with the Mongols; the Crusaders chose neutrality and even allowed the Mamluks to pass through their territory
- Qutuz advanced toward Syria rather than waiting for the Mongols to reach Egypt — taking the psychological initiative

#### The Battle (Valley of Ain Jalut)
- **Location:** The Valley of Ain Jalut (near Nazareth, in historic Palestine) — a valley surrounded by hills on three sides, neutralizing Mongol mobility
- **The Great Ambush:**
  - **Baibars' feigned retreat:** Baibars led the vanguard, engaged the Mongols under Kitbuqa, then performed a staged retreat deeper into the valley
  - **Kitbuqa took the bait:** The arrogant Mongol commander pursued, pulling his entire army into the trap
  - **Qutuz's hidden army:** The main Mamluk force, hidden behind the hills, descended upon the Mongols from all sides
- **The decisive moment:** When the Mongol left wing nearly broke through, Qutuz threw off his helmet, screamed "وا إسلاماه!" and personally led a desperate counter-charge that restored the lines
- **Kitbuqa killed:** Jamal al-Din Aqqush broke through and killed Kitbuqa personally; Mongol morale collapsed
- **Mamluk hand-cannons:** Some sources mention early gunpowder weapons used to frighten Mongol horses

#### Strategic Result
- **First open-field defeat of the Mongols** — broke the myth of invincibility
- Saved Egypt, North Africa, and potentially Europe from Mongol destruction
- Established the Mamluk Sultanate as the protector of the Islamic world
- Cairo became the new center of Islamic power (with the shadow Abbasid caliphate)
- Shifted the axis of Islamic civilization from Baghdad to Cairo for 250+ years

| Figures | Sources |
|---------|---------|
| سيف الدين قطز, الظاهر بيبرس, كتبغا (القائد المغولي), هولاكو خان, جمال الدين أقوش, ابن العلقمي (خائن بغداد — خلفية تاريخية) | ابن كثير (البداية والنهاية), د. راغب السرجاني, د. شوقي أبو خليل |

---

### 1.4 Step-to-SVG City Mapping

| Step | Primary Location | mapFocus {x, y} | Notes |
|------|-----------------|-----------------|-------|
| 0 | (overview) | 380, 300 | Center view — panoramic orientation |
| 1 | حطين — طبرية | 370, 300 | Valley of Hattin near Tiberias |
| 2 | عين جالوت — الناصرة | 390, 290 | Valley of Ain Jalut near Nazareth |

Context Callouts for Step 0:
| City | x, y | Note |
|------|------|------|
| قرطبة (الأندلس) | 20, 500 | Umayyad Andalusia |
| القاهرة | 190, 420 | Fatimid → Ayyubid → Mamluk center |
| بغداد | 470, 280 | Abbasid Caliphate (reference) |
| القدس | 330, 330 | Liberated 1187 |

---

## 2. Data Schema

```js
"muq": {
    "labelAr": "الدول والممالك المستقلة",
    "labelEn": "Independent States & Kingdoms",
    "mapLabelAr": "الدول والممالك المستقلة في العصر العباسي",
    "mapLabelEn": "Independent States in the Abbasid Era",
    "stepCountAr": "مرحلة",
    "stepCountEn": "stages",
    "offsets": [],
    "steps": [
        {
            "ayah": "﴿ وَتِلْكَ الْأَيَّامُ نُدَاوِلُهَا بَيْنَ النَّاسِ وَلِيَعْلَمَ اللَّهُ الَّذِينَ آمَنُوا ﴾",
            "ayahRef": "سورة آل عمران — الآية ١٤٠",
            "ayahEn": "And those days We alternate among the people so that Allah may make evident those who believe",
            "ayahRefEn": "Surah Al-Imran (3), verse 140",
            "dateAr": "ح. ١٣٨ - ٩٢٣ هـ / ٧٥٦ - ١٥١٧ م",
            "dateEn": "c. 138–923 AH / 756–1517 CE",
            "titleAr": "الدول والممالك المستقلة",
            "titleEn": "Independent States & Kingdoms",
            "mtAr": "من الأندلس إلى مصر والشام",
            "mtEn": "From Andalusia to Egypt and the Levant",
            "mdAr": "نظرة شاملة على الدول والممالك المستقلة التي نشأت في ظل الخلافة العباسية",
            "mdEn": "A comprehensive overview of the independent states that arose under the Abbasid Caliphate",
            "amb": "day",
            "timeAr": "🌤️ قرون من التاريخ",
            "timeEn": "🌤️ Centuries of history",
            "distAr": "📍 الأندلس · مصر · الشام · الحجاز",
            "distEn": "📍 Andalusia · Egypt · Levant · Hejaz",
            "descAr": "...", // Full description of the four independent states with timeline, key figures, geography, lessons
            "descEn": "...", // Full English parallel
            "charsAr": [
                { "i": "🏛️", "n": "الدولة الأموية في الأندلس", "r": "عبد الرحمن الداخل — عبد الرحمن الناصر — ٢٧٥ عاماً من الحضارة" },
                { "i": "🔯", "n": "الدولة الفاطمية (العبيدية)", "r": "المعز لدين الله — القاهرة — ٢٦٢ عاماً من المنافسة" },
                { "i": "⚔️", "n": "الدولة الأيوبية", "r": "صلاح الدين الأيوبي — تحرير القدس — وحدة مصر والشام" },
                { "i": "🛡️", "n": "دولة المماليك", "r": "قطز وبيبرس — عين جالوت — تصفية الوجود الصليبي" }
            ],
            "charsEn": [
                { "i": "🏛️", "n": "Umayyad State in Andalusia", "r": "Abd al-Rahman al-Dakhil — 275 years of civilization" },
                { "i": "🔯", "n": "Fatimid (Ubaydid) Caliphate", "r": "al-Mu'izz li-Din Allah — 262 years of rivalry" },
                { "i": "⚔️", "n": "Ayyubid Dynasty", "r": "Saladin — Liberation of Jerusalem — Unity of Egypt & Syria" },
                { "i": "🛡️", "n": "Mamluk Sultanate", "r": "Qutuz & Baybars — Ain Jalut — Crusader expulsion" }
            ],
            "lessonAr": "...",
            "lessonEn": "...",
            "srcs": ["ابن الأثير (الكامل في التاريخ)", "د. راغب السرجاني (قصة الأندلس)", "د. الصلابي (الدولة العباسية)"],
            "mapFocus": { "x": 380, "y": 300, "scale": 1.0 }
        }
        // Steps 1 and 2: Hattin and Ain Jalut
    ]
}
```

### Suggested Verses by Step

- **Step 0 (overview):** آل عمران 3:140 (تداول الأيام), النور 24:55 (استخلاف المؤمنين)
- **Step 1 (Hattin):** الحج 22:39-40 (أذن للذين يقاتلون), الأنفال 8:17 (فلم تقتلوهم ولكن الله قتلهم), الفتح 48:1-3 (الفتح المبين)
- **Step 2 (Ain Jalut):** الأنفال 8:30 (ويمكرون ويمكر الله والله خير الماكرين), آل عمران 3:126-127 (ليقطع طرفاً من الذين كفروا), النصر 110:1-3 (إذا جاء نصر الله والفتح)

### Field Notes

- **`srcs[]`**: Step 0 references ابن الأثير for annals + د. راغب السرجاني for Andalusia/Fatimid/Ayyubid analysis + د. الصلابي for Abbasid context. Steps 1-2 heavily use ابن الأثير and ابن كثير (battle narratives) + د. السرجاني and د. شوقي أبو خليل (military analysis).
- **`amb`**: Step 0: `"day"` (reference overview). Step 1: `"dawn"` (the dawn of liberation). Step 2: `"dawn"` (the dawn of salvation from the Mongols).
- **`chars[]`**: Step 0 has 4 figures (the four kingdoms). Steps 1-2 have the key commanders. Maximum 4 per step.

---

## 3. SVG Map

### Approach: Panoramic Map (1000×560, Levant-centered with callouts)

The module covers events spanning from Andalusia to the Levant, but the two major battles are in Palestine. The map therefore centers on the Levant (Hattin/Ain Jalut area) with decorative callouts to Cordoba, Cairo, and Baghdad for context.

**Why 1000×560:**
- Matches existing wider maps (Umayyad, Abbasid, Ottoman)
- Shows the Levant core (Hattin, Ain Jalut, Jerusalem, Damascus) at readable scale
- Callouts to Cordoba, Cairo, Baghdad provide geographic context for the independent states
- `MAP_VB` entry: `muq: [1000, 560]`

### City Coordinates (1000×560 viewBox)

| City | x, y | Type | Notes |
|------|------|------|-------|
| Jerusalem (القدس) | 330, 310 | Main node | Liberated after Hattin |
| Hattin (حطين) | 370, 300 | Node | Battle site — near Tiberias |
| Ain Jalut (عين جالوت) | 390, 290 | Node | Battle site — near Nazareth |
| Damascus (دمشق) | 370, 260 | Node | Ayyubid/Mamluk center |
| Cairo (القاهرة) | 190, 390 | Node | Fatimid/Ayyubid/Mamluk capital |
| Cordoba (قرطبة) | 20, 490 | Callout | Umayyad Andalusia |
| Baghdad (بغداد) | 470, 270 | Callout | Abbasid Caliphate (reference) |
| Makkah (مكة) | 140, 460 | Callout | Hejaz — spiritual center |
| Aleppo (حلب) | 400, 230 | Callout | Syria — major Mamluk center |
| Tiberias (طبرية) | 370, 310 | Node | Lake Tiberias — Hattin context |

### SVG Elements

```html
<svg id="svg-muq" class="map-svg hidden" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
  <g class="map-frame" opacity=".55">
    <!-- 4 decorative star corners (matching existing) -->
  </g>
  <g class="map-pan" id="pan-muq">
    <defs>
      <radialGradient id="mqbg" cx="50%" cy="50%" r="65%">
        <stop offset="0%" stop-color="#1a1408" stop-opacity=".4"/>
        <stop offset="100%" stop-color="#0a0e14" stop-opacity="1"/>
      </radialGradient>
      <linearGradient id="mqdesert" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#5a4a32"/>
        <stop offset="100%" stop-color="#2a1e10"/>
      </linearGradient>
      <marker id="mq-ar1" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto">
        <polygon points="0,0 8,4 0,8" fill="#C5A059"/>
      </marker>
      <filter id="mq-gf">
        <feGaussianBlur stdDeviation="1.2" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <rect width="1000" height="560" fill="url(#mqdesert)"/>
    <rect width="1000" height="560" fill="url(#mqbg)"/>

    <!-- Decorative Islamic patterns -->
    <use href="#sym-arabesque" x="40" y="40" width="48" height="48" opacity=".5"/>
    <use href="#sym-star8-lg" x="300" y="120" width="200" height="200" opacity=".2"/>
    <use href="#sym-dune" x="300" y="400" width="200" height="44" opacity=".45"/>

    <!-- Mediterranean Sea (stylized) -->
    <path d="M 0 100 Q 100 80 200 120 Q 250 150 300 200 Q 320 250 300 300 Q 280 350 250 400 Q 200 450 150 500 Q 80 520 0 540 Z"
          fill="#0a2a3a" opacity=".4" stroke="#1a4a6a" stroke-width="1.5"/>

    <!-- Expansion / trade / campaign routes -->
    <!-- Cordoba → Cairo route -->
    <path d="M 20 490 Q 100 440 190 390"
          fill="none" stroke="#C5A059" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#mq-ar1)" opacity=".6"/>
    <!-- Cairo → Damascus → Hattin -->
    <path d="M 190 390 Q 280 340 370 300 Q 380 280 370 260"
          fill="none" stroke="#C5A059" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#mq-ar1)" opacity=".7"/>
    <!-- Hattin → Jerusalem (liberation path) -->
    <path d="M 370 300 Q 350 310 330 310"
          fill="none" stroke="#C5A059" stroke-width="2.5" stroke-dasharray="4 4" marker-end="url(#mq-ar1)" opacity=".8"/>
    <!-- Baghdad → Damascus (Mongol path) -->
    <path d="M 470 270 Q 420 260 370 260"
          fill="none" stroke="#b91c1c" stroke-width="2" stroke-dasharray="6 4" stroke-dashoffset="3" opacity=".5"/>
    <!-- Damascus → Ain Jalut (Mamluk march) -->
    <path d="M 370 260 Q 380 280 390 290"
          fill="none" stroke="#C5A059" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#mq-ar1)" opacity=".7"/>

    <!-- Jerusalem (main node) -->
    <g class="cdn" id="mqnode-0" transform="translate(330, 310)">
      <circle class="pr" cx="0" cy="0" r="28"/>
      <circle cx="0" cy="0" r="12" fill="#C5A059" opacity=".3"/>
      <circle cx="0" cy="0" r="6" fill="#C5A059"/>
      <text y="-24" fill="#fde68a" font-size="12" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" filter="url(#mq-gf)" data-ar="القدس" data-en="Jerusalem">القدس</text>
      <text y="36" fill="#fcd34d" font-size="9" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="المدينة المقدسة — تحررت ٥٨٣ هـ" data-en="Holy City — Liberated 583 AH">المدينة المقدسة</text>
    </g>

    <!-- Hattin -->
    <g class="cdn" id="mqnode-1" transform="translate(370, 300)">
      <circle class="pr" cx="0" cy="0" r="22"/>
      <text y="-16" fill="#fca5a5" font-size="10" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="حطين" data-en="Hattin">حطين</text>
      <text y="28" fill="#f87171" font-size="8" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="معركة ٥٨٣ هـ" data-en="Battle 583 AH">معركة حطين</text>
    </g>

    <!-- Ain Jalut -->
    <g class="cdn" id="mqnode-2" transform="translate(390, 290)">
      <circle class="pr" cx="0" cy="0" r="22"/>
      <text y="-16" fill="#fca5a5" font-size="10" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="عين جالوت" data-en="Ain Jalut">عين جالوت</text>
      <text y="28" fill="#f87171" font-size="8" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="معركة ٦٥٨ هـ" data-en="Battle 658 AH">معركة عين جالوت</text>
    </g>

    <!-- Damascus -->
    <g class="cdn" id="mqnode-3" transform="translate(370, 260)">
      <circle class="pr" cx="0" cy="0" r="18"/>
      <text y="-14" fill="#bae6fd" font-size="9" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="دمشق" data-en="Damascus">دمشق</text>
      <text y="24" fill="#7dd3fc" font-size="7.5" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="الشام" data-en="Syria">الشام</text>
    </g>

    <!-- Cairo -->
    <g class="cdn" id="mqnode-4" transform="translate(190, 390)">
      <circle class="pr" cx="0" cy="0" r="22"/>
      <text y="-18" fill="#6ee7b7" font-size="10" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="القاهرة" data-en="Cairo">القاهرة</text>
      <text y="30" fill="#34d399" font-size="8" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="مصر — الفاطميون · الأيوبيون · المماليك" data-en="Egypt — Fatimids · Ayyubids · Mamluks">مصر — قلب الدول</text>
    </g>

    <!-- Cordoba (Andalusia callout) -->
    <g class="cdn" id="mqnode-callout-cordoba" transform="translate(20, 490)" opacity=".7">
      <circle class="pr" cx="0" cy="0" r="16"/>
      <text y="-14" fill="#fca5a5" font-size="9" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="قرطبة" data-en="Cordoba">قرطبة</text>
      <text y="24" fill="#f87171" font-size="7.5" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="الأندلس — الدولة الأموية" data-en="Andalusia — Umayyad State">الأندلس</text>
    </g>

    <!-- Baghdad callout -->
    <g class="cdn" id="mqnode-callout-baghdad" transform="translate(470, 270)" opacity=".6">
      <circle class="pr" cx="0" cy="0" r="16"/>
      <text y="-14" fill="#93c5fd" font-size="9" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="بغداد" data-en="Baghdad">بغداد</text>
      <text y="24" fill="#60a5fa" font-size="7.5" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="الخلافة العباسية" data-en="Abbasid Caliphate">الخلافة العباسية</text>
    </g>

    <!-- Makkah callout -->
    <g class="cdn" id="mqnode-callout-makkah" transform="translate(140, 460)" opacity=".6">
      <circle class="pr" cx="0" cy="0" r="14"/>
      <text y="-12" fill="#fca5a5" font-size="8.5" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="مكة" data-en="Makkah">مكة</text>
    </g>

    <!-- Era badge -->
    <g transform="translate(850, 490)">
      <rect x="-60" y="-24" width="120" height="48" rx="8" fill="rgba(1,10,7,.85)" stroke="rgba(197,160,89,.4)" stroke-width="1"/>
      <text data-ar="١٣٨ - ٩٢٣ هـ تقريباً" data-en="c. 138–923 AH" x="0" y="-3" fill="#C5A059" font-size="11" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif">١٣٨ - ٩٢٣ هـ</text>
      <text data-ar="ممالك مستقلة" data-en="Independent States" x="0" y="16" fill="#94a3b8" font-size="9.5" text-anchor="middle" font-family="Cairo,sans-serif">ممالك مستقلة</text>
    </g>

    <!-- Compass Rose -->
    <g transform="translate(948, 508)">
      <circle r="18" fill="rgba(6,78,59,.45)" stroke="rgba(197,160,89,.3)" stroke-width="1"/>
      <text data-ar="ش" data-en="N" y="5" text-anchor="middle" fill="#C5A059" font-size="12" font-family="Cairo,sans-serif" font-weight="bold">ش</text>
      <line x1="0" y1="-12" x2="0" y2="-6" stroke="#C5A059" stroke-width="1.5"/>
    </g>

    <!-- Focus layer -->
    <g id="focus-muq" style="display:none">
      <circle class="focus-pulse" cx="0" cy="0" r="8" fill="none" stroke="#C5A059" stroke-width="3"/>
      <polygon class="star-wake" points="0,-22 6,-6 22,0 6,6 0,22 -6,6 -22,0 -6,-6"/>
    </g>
  </g>
</svg>
```

### City Label Pattern

```html
<circle cx="330" cy="310" r="6" fill="#C5A059"/>
<text x="338" y="314"
      data-ar="القدس"
      data-en="Jerusalem"
      font-size="10" fill="#C5A059">القدس</text>
```

---

## 4. Integration Points

### 4.1 `data.js` — Append `muq` Era

Insert after the `abassi` era closure, before `uthmani`. 3 step objects. Format matches existing eras exactly (quoted keys, `offsets: []`).

### 4.2 `index.html` — Two Additions

**A. Home Card — الدول والممالك المستقلة**

Add after the Abbasid card (`#home-abassi`) inside `.home-cards`:

```html
<!-- الدول والممالك المستقلة -->
<div class="home-card" id="home-muq" role="button" tabindex="0">
  <div class="hc-bg" style="background: linear-gradient(160deg, rgba(197,160,89,.2), rgba(40,20,10,.65))"></div>
  <div class="hc-content">
    <div class="hc-icon">🗺️</div>
    <div class="hc-name" data-ar="الدول والممالك المستقلة" data-en="Independent States & Kingdoms">الدول والممالك المستقلة</div>
    <div class="hc-desc" data-ar="الأندلس، الفاطميون، الأيوبيون، المماليك — ومعركتا حطين وعين جالوت" data-en="Andalusia, Fatimids, Ayyubids, Mamluks — and the Battles of Hattin and Ain Jalut">ممالك مستقلة ومعارك فاصلة</div>
    <div class="hc-stats">
      <span class="hc-stat"><bdi data-ar="٣ مراحل" data-en="3 stages">٣ مراحل</bdi></span>
      <span class="hc-dot">•</span>
      <span class="hc-stat"><bdi data-ar="ح. ١٣٨ - ٩٢٣ هـ" data-en="c. 138–923 AH">ح. ١٣٨ - ٩٢٣ هـ</bdi></span>
    </div>
    <div class="hc-btn" data-ar="استكشف الممالك" data-en="Explore Kingdoms">استكشف الممالك</div>
  </div>
</div>
```

**B. Inline SVG Map** — After `svg-uthmani`, before `svg-imam`.

**C. Bilingual Data-Attribute Sweep** — Run the regex check after adding SVG text.

### 4.3 `app.js` — Changes

| Location | Change |
|----------|--------|
| `MAP_VB` (line ~62) | Add `muq: [1000, 560]` |
| `switchEv()` allSvgs (line ~798) | Add `'svg-muq'` |
| `init()` click handler (line ~1363) | Add `#home-muq` to selector: `const homeMuq = $('home-muq'); if (homeMuq) homeMuq.addEventListener('click', goToMuq);` |
| `narrationURL()` (line ~694) | **No change** — `EVT` key routing works |
| `applyMapFocus()` (line ~593) | **No change** — `MODE` routing works |
| `setAudioPulse()` (line ~661) | **No change** — `MODE` routing works |
| `goToHome()` back handler | Add special case: `else if (EVT === 'muq') goToHome()` — same pattern as `umawi`, `abassi`, `uthmani` |
| New function `goToMuq()` | Add after `goToUthmani()`: `function goToMuq() { if (!DB.muq) return; MODE = 'sera'; hideSplash(); switchEv('muq'); }` |

### New `goToMuq()` Function

```js
function goToMuq() {
  if (!DB.muq) {
    console.warn('SEERAH_DB.muq not loaded.');
    return;
  }
  MODE = 'sera';
  hideSplash();
  switchEv('muq');
}
```

### Back Button (Phase Names Map)

Add `muq` entry to the `phaseNames` map in `switchEv()` — no phases needed since all 3 steps are flat, but registered for consistency:

```js
'muq': { }
```

And in the `btn-splash` back handler (line ~1387):

```js
else if (EVT === 'muq') goToHome();
```

### 4.4 `tools/narration_ar.json`

Add 3 entries: `"muq_0"` through `"muq_2"`. Each must match the consonant skeleton of the corresponding `descAr`. All three require fully diacritized mushakkal text for correct TTS — especially the battle descriptions with foreign names (Kitbuqa, Guy de Lusignan, Reynald de Châtillon, etc.) rendered phonetically in Arabic.

### 4.5 `timeline_data.geojson`

Append features for each unique location: Jerusalem, Hattin, Ain Jalut, Damascus, Cairo, Cordoba, Baghdad. Each `event_id` set to `"muq_<n>"`.

### 4.6 Audio Generation

```bash
python tools/gen_tts.py --eras muq
# 5 slots × 2 languages × 3 steps = 30 new MP3 clips
```

---

## 5. Implementation Checklist

- [ ] **Design approved** — confirm the 3-stage breakdown, map approach, and home screen card
- [ ] **Phase 1 — Data:**
  - [ ] Write 3 step objects in `data.js`
  - [ ] Add `narration_ar.json` entries (mushakkal for all 3 steps)
  - [ ] `python tools/check_voc.py`
  - [ ] Add GeoJSON features
  - [ ] `node --check data.js`
  - [ ] `node -e "JSON.parse(fs.readFileSync('timeline_data.geojson'))"`
- [ ] **Phase 2 — UI:**
  - [ ] Update `index.html`: add `#home-muq` card to home screen (after `#home-abassi`)
  - [ ] Add `svg#svg-muq` inline SVG (viewBox 1000×560)
  - [ ] `app.js`: `MAP_VB` (`muq: [1000, 560]`), `allSvgs` (`'svg-muq'`), `goToMuq()`, click handler, back handler
  - [ ] `data-ar`/`data-en` sweep
- [ ] **Phase 3 — Audio:**
  - [ ] `python tools/gen_tts.py --eras muq` (30 clips)
  - [ ] Verify `audio/*/muq_*_*.mp3` exist
  - [ ] Verify `audio/manifest.json` updated
- [ ] **Phase 4 — Verification:**
  - [ ] Open in browser, test all 3 steps
  - [ ] Test AR ↔ EN toggle
  - [ ] Test 5 voice slots
  - [ ] Test verse recitation per step
  - [ ] Test map focus positioning
  - [ ] Test mobile (360px, 720px)
  - [ ] Test back nav: muq → home → imams → back
  - [ ] Test Hattin battle step — verify Saladin narrative accuracy
  - [ ] Test Ain Jalut battle step — verify Qutuz/Baybars narrative accuracy
- [ ] **Phase 5 — Release:**
  - [ ] Update `CHANGELOG.md`
  - [ ] Bump `package.json`
  - [ ] Update `AGENTS.md` / `CLAUDE.md`
  - [ ] Push to `main`

---

## 6. Design Decisions

| # | Decision | Choice | Rationale |
|---|----------|--------|-----------|
| 1 | Era key | `muq` | Short Arabic-derived key (ممالك مستقلة = muq), matches `umawi`/`abassi` pattern |
| 2 | Step count | 3 | One reference overview + two dedicated battle treatments |
| 3 | Map dimensions | 1000×560 ✓ | Matches existing wider maps, Levant-centered with Andalusia→Cairo→Baghdad callouts |
| 4 | Home position | After Abbasid card, before Ottoman | Chronologically: independent states arose during Abbasid era, continued through to Ottoman rise |
| 5 | Phase selection screen | **None** — direct entry | Only 3 steps, no need for phase selection. Click card → enter timeline directly. |
| 6 | Source anchoring | ابن الأثير + ابن كثير for battle narratives, د. راغب السرجاني + د. شوقي أبو خليل for analysis | Matches the project's Sunni historical methodology |
| 7 | Map center | Levant (330-390, 260-310) | Both Hattin and Ain Jalut are in Palestine; Jerusalem is the symbolic center |
| 8 | Special treatment | Overview step (Step 0) as a reference summary | Unlike other eras that narrate chronologically, Step 0 is a panoramic reference that contextualizes the two battles |
| 9 | No phase-specific CSS classes | Default `amb` values | 3 steps don't warrant custom ambients; existing `amb-dawn` for battle steps is sufficient |
| 10 | Battle step `amb` | `"dawn"` for both Hattin (liberation dawn) and Ain Jalut (salvation dawn) | Fits the existing semantic: dawn = new beginning after decisive victory |

---

## 7. Risks

- **Step 0 scope creep**: The overview of 4 independent states (Andalusia, Fatimids, Ayyubids, Mamluks) is very content-dense for a single step. The `descAr`/`descEn` fields will need careful editing to be comprehensive yet concise. Consider using the `lessonAr`/`lessonEn` field for the "historical lesson" of each kingdom.
- **Historical sensitivity**: The Fatimid (Ubaydid) caliphate is a sensitive topic in Sunni tradition — must maintain the Sunni perspective (referring to them as "العبيدية" with the acknowledgment that they were a rival caliphate, not recognized by mainstream Sunni scholarship).
- **Map density**: Only 3 steps but 10 SVG nodes. The mapFocus will shift between Hattin (step 1) and Ain Jalut (step 2), with step 0 showing the panoramic view. Ensure the zoom transitions are smooth.
- **Audio generation**: Only 30 clips (vs. 280 for Abbasid), so this is very fast. However, Step 0's `descAr` will be long and dense — the TTS must handle multiple kingdom names and dates correctly. Ensure the `narration_ar.json` entry is fully diacritized.
- **Naming collision**: Ensure `muq` doesn't conflict with any existing variable name, CSS class, or ID in the codebase.
- **Home screen overflow**: Adding a 7th card to the home screen grid may need layout adjustment at smaller viewports. Test at 360px breakpoint.
