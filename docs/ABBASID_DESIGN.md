# Abbasid Caliphate Module — Design Document

> **Status:** Design reviewed ✅ — ready for implementation.
> **Sources (exclusive):** الطبري (تاريخ الأمم والملوك), ابن الأثير (الكامل في التاريخ), ابن كثير (البداية والنهاية), د. الصلابي (الدولة العباسية), د. طقوش (تاريخ الدولة العباسية)
> **Total steps:** 28 across 4 phases (9+7+9+3), inserted chronologically after `umawi` in `window.SEERAH_DB`.
> **Map:** 1000×560 viewBox (matching Umayyad extent, Baghdad-centered).
> **Special treatments:**
>   - Phase 1 (golden age): New `amb-golden` CSS class with radiant gold gradient for المأمون/الرشيد era
>   - Phase 4 (sack): New `amb-sack` CSS class with dark crimson/ash gradient for Mongol destruction

---

## 1. Content Structure: Four Phases, One Era

The Abbasid period (132–656 AH / 750–1258 CE) is added as a **single era key `abassi`** in `data.js`'s `SEERAH_DB`, between `umawi` and any future module. The four phases are logical groupings within the flat `steps[]` array — no sub-eras or UI nesting.

```
SEERAH_DB (data.js) — chronological order:
  preb → meccan → hijra → badr → medinan → abubakr → umar → uthman → ali → hasan → umawi → abassi (NEW)
```

| Phase | Title (Ar) | Title (En) | AH Range | Steps | Emphasis |
|-------|-----------|-----------|----------|-------|----------|
| 1 | النشأة والقوة والازدهار | Foundation, Power & Golden Age | 132–232 | 9 | Abbasid revolution, Baghdad, Harun al-Rashid, translation movement, Mihna, Amorium |
| 2 | النفوذ التركي والصحوة السنية | Turkish Influence & Sunni Revival | 232–334 | 7 | Mutawakkil's reforms, Samarra turmoil, Zanj rebellion, Qarmatians, Buyid takeover |
| 3 | الدويلات والنفوذ الخارجي | Dynasties & External Domination | 334–656 | 9 | Buyids, Seljuks, Nizamiyya, Crusades, al-Nasir's revival, Mongol threat |
| 4 | الاجتياح وسقوط بغداد | The Mongol Catastrophe | 656 | 3 | Siege of Baghdad, fall, Cairo revival |

**Total: ~28 steps** (largest single era, reflecting the 524-year span).

---

### 1.1 Phase 1 — النشأة والقوة والازدهار (132–232 AH) — 9 steps

Based on الطبري وابن الأثير (annals), analysed by د. الصلابي and د. طقوش.

| Step | Key Event | Figures | Sources |
|------|-----------|---------|---------|
| 0 | **قيام الدولة العباسية (132 هـ):** إعلان الخلافة في الكوفة، مبايعة أبي العباس عبد الله بن محمد "السفاح"، القضاء على الأمويين، بداية عصر جديد | أبو العباس السفاح، عبد الله بن علي، أبو مسلم الخراساني | الطبري، ابن الأثير، د. الصلابي |
| 1 | **أبو جعفر المنصور — المؤسس الحقيقي (136–158 هـ):** بناء مدينة بغداد المدورة (145 هـ)، عاصمة الخلافة الجديدة، ضبط أموال الدولة، القضاء على الثورات (النفس الزكية)، تأسيس الإدارة العباسية | أبو جعفر المنصور، أبو مسلم الخراساني، محمد بن عبد الله (النفس الزكية) | الطبري، ابن الأثير، د. طقوش |
| 2 | **بيت الحكمة وازدهار العلم (150–200 هـ):** بداية حركة الترجمة في بيت الحكمة، ترجمة الفلسفة اليونانية والفارسية والهندية إلى العربية، ظهور أعلام الفقه والتفسير | جعفر بن يحيى البرمكي، ابن المقفع، الإمام أبو حنيفة، الإمام مالك | الطبري، د. الصلابي |
| 3 | **عصر هارون الرشيد الذهبي (170–193 هـ):** ذروة القوة العباسية، الاتساع الجغرافي، الازدهار الاقتصادي، صوائف وشواتي ضد البيزنطيين، أيام الإسلام الحافلة بالجهاد والعدل والعلم | هارون الرشيد، الخيزران بنت عطاء، يحيى البرمكي، الإمام الشافعي | الطبري، ابن الأثير، ابن كثير |
| 4 | **صورة هارون الرشيد الحقيقية (تصحيح تاريخي):** ملكٌ قائدٌ مجتهد — لم يكن لهواً كما صورته كتب الأدب — كان يحج عاماً ويغزو عاماً، وضرب الجزية على نقفور إمبراطور الروم، وأقام شرع الله في دولته | هارون الرشيد، نقفور الأول، الإمام أبو يوسف | ابن كثير (البداية والنهاية)، د. الصلابي |
| 5 | **الفتنة العظمى — الأمين والمأمون (193–198 هـ):** الصراع المدمر بين الأخوين على الخلافة، حصار بغداد، مقتل الأمين، بداية تغير طبيعة الدولة العباسية | الأمين، المأمون، طاهر بن الحسين، هرثمة بن أعين | الطبري، ابن الأثير |
| 6 | **عهد المأمون والمحنة (198–218 هـ):** ازدهار بيت الحكمة في عهد المأمون، ذروة حركة الترجمة، لكن — صعود فكر المعتزلة، فرض محنة خلق القرآن على العلماء | المأمون، الإمام أحمد بن حنبل، بشر بن غياث المريسي، يحيى بن أكثم | ابن كثير، د. الصلابي (موقف السنة) |
| 7 | **المعتصم وعمورية (218–227 هـ):** الاعتماد على الجند الأتراك، نقل العاصمة إلى سامراء، فتح عمورية (223 هـ) بعد استغاثة المرأة، بداية تغيير الجيش العباسي | المعتصم بالله، الأفشين، عجيف بن عنبسة | ابن الأثير، الطبري |
| 8 | **ترسيخ الحضارة الإسلامية (عبر المرحلة):** إنجازات العصر الذهبي في الطب (الرازي)، الرياضيات (الخوارزمي)، الفلك، الأدب (أبو تمام، المتنبي)، الفلسفة (الكندي) | الخوارزمي، أبو بكر الرازي، أبو تمام، الكندي | د. طقوش، د. الصلابي |

### 1.2 Phase 2 — النفوذ التركي والصحوة السنية (232–334 AH) — 7 steps

وثقها ابن الأثير والطبري بتفصيل دقيق عن صراع الخلفاء مع القادة الأتراك.

| Step | Key Event | Figures | Sources |
|------|-----------|---------|---------|
| 9 | **المتوكل على الله — ناصر السنة (232–247 هـ):** إنهاء محنة خلق القرآن، إكرام أهل الحديث، بناء جامع سامراء الكبير بمئذنته الملوية، ظهور السنة على المعتزلة، مقتله على يد الأتراك | المتوكل على الله، الإمام أحمد بن حنبل، المنتصر بالله (ابنه)، وصيف التركي | ابن كثير، الطبري |
| 10 | **اضطراب سامراء (247–256 هـ):** مقتل المتوكل، تنقل الخلفاء الضعاف تحت سيطرة القادة الأتراك، أصبح الخليفة يقتل ويخلع كيف شاء القادة — نهاية الهيبة العباسية فعلياً | المنتصر، المستعين، المعتز، المهتدي، وصيف، بغا الشرابي | الطبري، ابن الأثير |
| 11 | **الموفق بالله — القائد المنقذ (256–279 هـ):** تولي الموفق (أخو الخليفة المعتمد) إدارة الدولة، إخماد ثورة الزنج الأخطر في تاريخ الدولة الإسلامية، إعادة الاستقرار مؤقتاً | الموفق بالله، صاحب الزنج (علي بن محمد)، المعتمد على الله | ابن الأثير، الطبري |
| 12 | **النهضة العباسية الثانية (279–295 هـ):** عهد المعتضد بالله، استعادة قوة الخلافة مؤقتاً، محاولة إعادة هيبة الدولة، القضاء على الخوارج والثوار | المعتضد بالله، عمرو بن الليث الصفار، أحمد بن عبد العزيز | الطبري، د. طقوش |
| 13 | **القرامطة وفتن الباطنية (286–319 هـ):** ظهور الحركة القرامطية، هجماتهم على الحجاج، أخذ الحجر الأسود من مكة (317 هـ) واستعادته بعد 22 عاماً، تهديد الفكر الباطني للدولة | أبو سعيد الجنابي، أبو طاهر القرمطي، المقتدر بالله | ابن الأثير، ابن كثير |
| 14 | **تآكل السلطة المركزية (320–334 هـ):** ضعف الخلفاء المتأخرين قبل البويهيين، سيطرة الوزراء وقادة الجيش، ظهور الدويلات المستقلة (الإخشيديون، الحمدانيون، البويهيون) | الراضي بالله، المتقي لله، ابن رائق، محمد بن طغج الإخشيدي | ابن الأثير، د. طقوش |
| 15 | **دخول البويهيين بغداد (334 هـ):** سيطرة بني بويه (الشيعة) على بغداد، بداية عصر الحماية الأجنبية للخلافة، تهميش الخليفة وتحويله إلى رمز ديني لا سلطة له | معز الدولة البويهي، المستكفي بالله، المطيع لله | ابن الأثير، الطبري |

### 1.3 Phase 3 — عصر الدويلات والنفوذ الخارجي (334–656 AH) — 9 steps

توثيق معاصر لد. طقوش ود. الصلابي عن بقاء الرمزية العباسية رغم الضعف السياسي.

| Step | Key Event | Figures | Sources |
|------|-----------|---------|---------|
| 16 | **الهيمنة البويهية (334–447 هـ):** 113 عاماً من السيطرة البويهية على بغداد، تحول الخليفة إلى رمز شرعي بلا سلطة، ازدهار ثقافي رغم الضعف السياسي، ظهور الطوسي والشريف الرضي | عضد الدولة البويهي، المطيع لله، القادر بالله، الشريف الرضي | ابن الأثير، د. طقوش |
| 17 | **السلاجقة — النصر السني (447 هـ):** دخول طغرل بك إلى بغداد بطلب من الخليفة القائم بأمر الله، إنهاء النفوذ البويهي الشيعي، إعلاء المذهب السني، استعادة الخطبة للخلفاء | طغرل بك، القائم بأمر الله، ألب أرسلان | ابن الأثير، د. الصلابي |
| 18 | **نظام الملك والمدارس النظامية (459–485 هـ):** بناء المدارس النظامية في بغداد ونيسابور، نشر الفقه السني (الشافعي والأشعري)، مواجهة الفكر الباطني بالعلم، كتاب "سياسة نامه" في الحكم | نظام الملك (الحسن بن علي الطوسي)، ألب أرسلان، ملكشاه، الإمام الجويني، الإمام الغزالي | ابن الأثير، د. الصلابي |
| 19 | **ملاذكرد وفتح الأناضول (463 هـ):** معركة ملاذكرد الكبرى، هزيمة الإمبراطور البيزنطي رومانوس الرابع، فتح أبواب آسيا الصغرى أمام المسلمين، تأسيس سلاجقة الروم | ألب أرسلان، رومانوس الرابع، نظام الملك | ابن الأثير، د. طقوش |
| 20 | **التحدي الصليبي والجهاد الزنكي (490–569 هـ):** الحملات الصليبية واحتلال القدس (492 هـ)، صعود الدولة الزنكية بقيادة عماد الدين زنكي ثم نور الدين محمود، توحيد الجبهة السنية | عماد الدين زنكي، نور الدين محمود، المسترشد بالله، المقتفي لأمر الله | ابن الأثير (الكامل في التاريخ)، د. الصلابي |
| 21 | **صلاح الدين واستعادة بيت المقدس (564–589 هـ):** القضاء على الدولة الفاطمية، توحيد مصر والشام، معركة حطين (583 هـ) وفتح القدس، الجهاد تحت الراية الاسمية للخلافة العباسية | صلاح الدين الأيوبي، الناصر لدين الله، المستضيء بأمر الله | ابن الأثير، ابن كثير |
| 22 | **محاولة إحياء الخلافة — الناصر لدين الله (575–622 هـ):** آخر خلفاء بغداد الأقوياء، محاولة استعادة النفوذ الفعلي، إصلاح الفرسة والمروءات، مواجهة الخوارزميين، إعادة هيبة الخليفة مؤقتاً في العراق | الناصر لدين الله، الظاهر بأمر الله، جلال الدين الخوارزمي | ابن الأثير، د. طقوش |
| 23 | **تهديد المغول وانهيار الممالك الشرقية (616–655 هـ):** اجتياح التتار للمشرق الإسلامي، سقوط الدولة الخوارزمية، تدمير بخارى وسمرقند ونيسابور، تقدم المغول نحو العراق دون ردع حقيقي | جنكيز خان، جلال الدين منكبرتي، المستنصر بالله، المستعصم بالله | ابن الأثير (كارثة المغول)، د. طقوش |
| 24 | **السنوات الأخيرة — ضعف وتردد (655–656 هـ):** الخليفة المستعصم بالله، تقليص الجيش العباسي بناءً على مشورة الوزير ابن العلقمي، التردد في مقاومة المغول، تخاذل الإدارة | المستعصم بالله، ابن العلقمي، مجاهد الدين أيبك الدوادار | ابن كثير، الطبري، د. الصلابي |

### 1.4 Phase 4 — الاجتياح وسقوط بغداد (656 AH) — 3 steps

أخطر كارثة في تاريخ بغداد — توثيق دقيق من ابن كثير وابن الأثير.

| Step | Key Event | Figures | Sources |
|------|-----------|---------|---------|
| 25 | **حصار بغداد (محرم 656 هـ):** وصول جيوش المغول بقيادة هولاكو إلى أسوار بغداد، نصب المنجنيقات، خيانة ابن العلقمي بفتح الأبواب وتثبيط الخليفة عن المقاومة، انهيار الحصون بسرعة بسبب قلة الجيش | هولاكو، المستعصم بالله، ابن العلقمي، هبة الله بن التلميذ | ابن كثير (البداية والنهاية)، ابن الأثير |
| 26 | **سقوط بغداد واستباحتها (صفر 656 هـ):** دخول التتار بغداد، قتل الخليفة المستعصم بالله، استباحة المدينة 40 يوماً، حرق المكاتب والمساجد، قتل مئات الآلاف، إلقاء الكتب في نهر دجلة، نهاية الخلافة العباسية في العراق | هولاكو، المستعصم بالله، ابن العلقمي | ابن كثير، د. الصلابي، د. طقوش |
| 27 | **إحياء رمز الخلافة في القاهرة (659 هـ):** انتصار عين جالوت على المغول بقيادة قطز وبيبرس، إعلان الخليفة المستنصر بالله الثاني في القاهرة، بقاء الخلافة العباسية رمزاً شرعياً تحت رعاية المماليك لمدة 250 سنة أخرى | الظاهر بيبرس، سيف الدين قطز، المستنصر بالله الثاني، الحاكم بأمر الله الأول (الخليفة بالقاهرة) | ابن كثير، د. الصلابي |

---

### 1.5 Step-to-SVG City Mapping

| Step | Primary City | mapFocus {x, y} | Notes |
|------|-------------|-----------------|-------|
| 0 | الكوفة | 480, 300 | Proclamation of Abbasid caliphate |
| 1 | بغداد | 470, 280 | Capital — Round City foundation |
| 2 | بغداد | 470, 280 | Bayt al-Hikma |
| 3 | بغداد | 470, 280 | Golden age center |
| 4 | بغداد | 470, 280 | Harun's caliphal seat |
| 5 | بغداد | 470, 280 | Siege during civil war |
| 6 | بغداد | 470, 280 | Ma'mun's court |
| 7 | عمورية | 560, 60 | Callout: Amorium conquest |
| 8 | بغداد | 470, 280 | Cultural achievements |
| 9 | سامراء | 530, 250 | Mutawakkil's capital |
| 10 | سامراء | 530, 250 | Samarra turmoil |
| 11 | البصرة | 500, 350 | Zanj rebellion zone |
| 12 | بغداد | 470, 280 | Mu'tadid's restoration |
| 13 | مكة | 380, 400 | Qarmatian attack |
| 14 | بغداد | 470, 280 | Pre-Buyid decline |
| 15 | بغداد | 470, 280 | Buyid takeover |
| 16 | بغداد | 470, 280 | Buyid domination |
| 17 | بغداد | 470, 280 | Seljuk entry |
| 18 | بغداد | 470, 280 | Nizamiyya school |
| 19 | ملاذكرد | 620, 50 | Callout: Manzikert |
| 20 | الشام | 370, 250 | Zengid jihad |
| 21 | القدس | 400, 300 | Saladin's conquest |
| 22 | بغداد | 470, 280 | Nasir's revival |
| 23 | بخارى | 850, 110 | Callout: Mongol destruction |
| 24 | بغداد | 470, 280 | Final weakness |
| 25 | بغداد | 470, 280 | Siege of Baghdad |
| 26 | بغداد | 470, 280 | Fall and sack |
| 27 | القاهرة | 310, 390 | Cairo revival |

---

## 2. Data Schema

The era follows the exact `data.js` format (quoted JSON-style keys, matching existing eras):

```js
"abassi": {
    "labelAr": "الدولة العباسية",
    "labelEn": "Abbasid Caliphate",
    "mapLabelAr": "الدولة العباسية في أقصى اتساعها",
    "mapLabelEn": "Abbasid Caliphate at Its Greatest Extent",
    "stepCountAr": "مرحلة",
    "stepCountEn": "stages",
    "offsets": [],
    "steps": [
        {
            "ayah": "﴿ يَا أَيُّهَا الَّذِينَ آمَنُوا هَلْ أَدُلُّكُمْ عَلَى تِجَارَةٍ تُنجِيكُم مِّنْ عَذَابٍ أَلِيمٍ ﴾",
            "ayahRef": "سورة الصف — الآية ١٠",
            "ayahEn": "O you who have believed, shall I guide you to a transaction that will save you from a painful punishment?",
            "ayahRefEn": "Surah As-Saff (61), verse 10",
            "dateAr": "١٣٢ هـ / ٧٥٠ م",
            "dateEn": "132 AH / 750 CE",
            "titleAr": "قيام الدولة العباسية",
            "titleEn": "Establishment of the Abbasid Caliphate",
            "mtAr": "الكوفة — العراق",
            "mtEn": "Kufa — Iraq",
            "mdAr": "إعلان الخلافة العباسية — انقلاب تاريخي بدأ من خراسان",
            "mdEn": "Proclamation of Abbasid rule — a historic revolution from Khurasan",
            "amb": "dawn",
            "timeAr": "🌅 ربيع الأول ١٣٢ هـ",
            "timeEn": "🌅 Rabi' al-Awwal 132 AH",
            "distAr": "📍 من خراسان إلى الكوفة",
            "distEn": "📍 From Khurasan to Kufa",
            "descAr": "انطلقت الدعوة العباسية من خراسان بقيادة أبي مسلم الخراساني، وبلغت ذروتها عام 132 هـ عندما دخل الجيش العباسي الكوفة وأعلن أبو العباس عبد الله بن محمد بن علي بن عبد الله بن العباس خليفة للمسلمين. لُقب بالسفاح لكثرة ما سفك من دماء بني أمية ومن خالفهم. بهذا الحدث العظيم انتقلت الخلافة من بني أمية في دمشق إلى بني هاشم في العراق. بدأ عصر جديد في تاريخ الإسلام — عصر يمتد لأكثر من 500 سنة.",
            "descEn": "The Abbasid call (da'wah) was launched from Khurasan under Abu Muslim al-Khurasani, culminating in 132 AH when the Abbasid army entered Kufa and proclaimed Abu al-Abbas Abd Allah ibn Muhammad ibn Ali ibn Abd Allah ibn Abbas as caliph. He was given the title al-Saffah (the Blood-Shedder) for the many Umayyad blood he spilled. With this momentous event, the caliphate moved from the Umayyads in Damascus to the Banu Hashim in Iraq. A new chapter in Islamic history began — one that would last over 500 years.",
            "charsAr": [
                { "i": "👑", "n": "أبو العباس السفاح", "r": "أول الخلفاء العباسيين — مؤسس الدولة الجديدة" },
                { "i": "⚔️", "n": "أبو مسلم الخراساني", "r": "قائد الدعوة العباسية في خراسان — سيف الدولة" }
            ],
            "charsEn": [
                { "i": "👑", "n": "Abu al-Abbas al-Saffah", "r": "First Abbasid caliph — founder of the new state" },
                { "i": "⚔️", "n": "Abu Muslim al-Khurasani", "r": "Leader of the Abbasid call in Khurasan — sword of the state" }
            ],
            "lessonAr": "تتغير الدول وتتبدل، ولكن يبقى الإسلام — لم تمت الخلافة بسقوط الأمويين بل انتقلت إلى بني العباس بأمر الله وقدرته",
            "lessonEn": "States change and transform, but Islam remains — the caliphate did not die with the Umayyad fall, but passed to the Abbasids by Allah's decree",
            "srcs": ["الطبري (تاريخ الأمم والملوك)", "ابن الأثير (الكامل في التاريخ)", "د. الصلابي (الدولة العباسية)"],
            "mapFocus": { "x": 480, "y": 300, "scale": 1.0 }
        }
        // ... 27 more steps
    ]
}
```

### Suggested Verses by Phase

- **Phase 1 (establishment / power / golden age):**
  - Step 0 (revolution): الصف 61:10, الحج 22:39-40
  - Step 1 (Baghdad foundation): الملك 67:15 (He made the earth subservient)
  - Step 2 (knowledge): طه 20:114 (My Lord, increase me in knowledge), الزمر 39:9 (Are those who know equal...)
  - Step 3 (golden age): سبأ 34:15-16 (gratitude for blessings)
  - Step 4 (Harun's justice): الحديد 57:25 (We sent down the iron), المائدة 5:8 (Be just)
  - Step 5 (civil war): الأنفال 8:46 (Do not dispute lest you fail), الحجرات 49:9 (If two parties fight)
  - Step 6 (Mihna): البقرة 2:256 (No compulsion in religion), النحل 16:125 (Invite with wisdom)
  - Step 7 (Amorium): الروم 30:47 (We helped the believers), الحج 22:39-40
  - Step 8 (culture): العلق 96:1-5 (Read), الرحمن 55:33 (Penetrate the heavens)

- **Phase 2 (Turkish influence / Sunni revival):**
  - Step 9 (Mutawakkil): يونس 10:59-62, التوبة 9:71 (Believers protect each other)
  - Step 10 (Samarra): الشورى 42:30 (Whatever affliction befalls you...)
  - Step 11 (Zanj): الرعد 13:11, الأنفال 8:53
  - Step 12 (revival): النور 24:55 (Allah promised those who believe...)
  - Step 13 (Qarmatians): المائدة 5:32 (Killing an innocent soul), العنكبوت 29:69
  - Step 14 (decline): الأنعام 6:131-132
  - Step 15 (Buyids): آل عمران 3:103 (Hold to the rope of Allah)

- **Phase 3 (dynasties / Crusades / Seljuks):**
  - Step 16 (Buyids): النساء 4:59 (Obey those in authority)
  - Step 17 (Seljuks): النصر 110:1-3 (When the victory of Allah comes)
  - Step 18 (Nizamiyya): المجادلة 58:11 (Allah raises those who believe and have knowledge)
  - Step 19 (Manzikert): الأنفال 8:17 (You did not kill them, but Allah killed them)
  - Step 20 (Zengids): الحج 22:39-40, البقرة 2:190-193 (Fight those who fight you)
  - Step 21 (Saladin): الإسراء 17:1-7 (Praise to Allah who took His servant...), الفتح 48:1-3
  - Step 22 (al-Nasir): الرعد 13:11, آل عمران 3:26 (Say: O Allah, owner of sovereignty)
  - Step 23 (Mongols): الحج 22:31-32, الأنفال 8:25 (Fear a trial)
  - Step 24 (final weakness): الإسراء 17:15, الروم 30:41

- **Phase 4 (sack of Baghdad):**
  - Step 25 (siege): الحشر 59:2-5, الأنفال 8:53
  - Step 26 (fall): الحاقة 69:1-4, البقرة 2:155-156 (Surely to Allah we belong)
  - Step 27 (Cairo revival): النور 24:55, آل عمران 3:26

### Field Notes

- **`srcs[]`**: Every step references ≥2 of the approved sources.
  - Phase 1 heavily uses الطبري + ابن الأثير (annals) + د. الصلابي (analysis).
  - Phase 2 draws on ابن كثير (Mutawakkil narrative) + الطبري (Samarra annals).
  - Phase 3 uses ابن الأثير (Seljuk/Crusade coverage) + د. طقوش.
  - Phase 4 anchored in ابن كثير (detailed sack account) + د. الصلابي.
- **`amb`**: Default `"day"`. Key exceptions:
  - Step 0 (revolution/transition): `"dawn"` — a new era dawns
  - Step 5 (civil war): `"night"` — darkness of fraternal conflict
  - Step 7 (Amorium conquest): `"dawn"` — pre-battle dawn
  - Step 10 (Samarra turmoil): `"night"` — chaos and darkness
  - Steps 25-26 (Mongol sack): **`"sack"`** — new CSS class (dark crimson/ash gradient)
  - Step 27 (Cairo revival): `"dawn"` — hope after catastrophe
- **`chars[]`**: Maximum 4 per step. Key figures from the user's content.
- **`ayahRefEn`**: Every step MUST have a parseable Quran citation — either `"Surah <Name> (<num>), verse <n>"` / `"verses <n>-<m>"` or `"Surah <Name> — <surah>:<ayah>"`.

---

## 3. SVG Map

### Approach: Wider Map (1000×560, Baghdad-centered with peripheral callouts)

The Abbasid empire at its peak (Harun al-Rashid era) stretched from North Africa to Transoxiana — matching Umayyad extent but with an Iraq-centered axis. A `1000×560` viewBox provides room to show from Qayrawan to Samarkand within the frame, with Constantinople and Amorium as northern callouts.

**Why 1000×560:**
- Shows the core Abbasid axis (Qayrawan → Baghdad → Rayy → Samarkand) in-frame
- Matches existing 560px height, so no layout changes needed to surrounding UI
- Baghdad at center (~470, 280)
- Samarra as a second node (north of Baghdad) for Phase 2
- Constantinople and Amorium rendered as decorative callout labels with dotted connecting lines
- Cairo appears as a key node for Phase 3/4
- `MAP_VB` entry: `abassi: [1000, 560]`

### City Coordinates (1000×560 viewBox)

| City | x, y | Type | Notes |
|------|------|------|-------|
| Baghdad (بغداد) | 470, 280 | Main node | Capital — most steps |
| Kufa (الكوفة) | 480, 300 | Node | Early Abbasid center |
| Samarra (سامراء) | 530, 250 | Node | Second capital (Phase 2) |
| Basra (البصرة) | 500, 350 | Node | Zanj rebellion, trade hub |
| Makkah (مكة) | 380, 400 | Node | Qarmatian attack site |
| Madinah (المدينة) | 400, 380 | Node | Religious center |
| Damascus (دمشق) | 370, 250 | Node | Provincial capital |
| Cairo (القاهرة) | 310, 390 | Node | Phase 4 revival |
| Jerusalem (القدس) | 380, 305 | Node | Saladin's conquest |
| Rayy (الري) | 630, 250 | Node | Persia |
| Merv (مرو) | 800, 220 | Node | Khurasan (Abbasid revolution base) |
| Bukhara (بخارى) | 860, 130 | Node | Transoxiana — Mongol destruction |
| Nishapur (نيسابور) | 780, 180 | Node | Nizamiyya school |
| Constantinople (القسطنطينية) | 510, 40 | Callout | Byzantine frontier |
| Amorium (عمورية) | 560, 60 | Callout | Conquest of 223 AH |
| Manzikert (ملاذكرد) | 620, 50 | Callout | 463 AH battle |
| Mahdia (المهدية) | 110, 480 | Callout | Fatimid/Qarmatian region |
| Cordoba (قرطبة) | 20, 530 | Callout | Independent Umayyad Andalusia |

### SVG Elements

```html
<svg id="svg-abassi" class="map-svg hidden" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
  <g class="map-frame" opacity=".55">
    <!-- 4 decorative star corners (matching existing) -->
  </g>
  <g class="map-pan" id="pan-abassi">
    <defs>
      <radialGradient id="abbg" cx="50%" cy="50%" r="65%">
        <stop offset="0%" stop-color="#1a1408" stop-opacity=".4"/>
        <stop offset="100%" stop-color="#0a0e14" stop-opacity="1"/>
      </radialGradient>
      <linearGradient id="abdesert" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#5a4a32"/>
        <stop offset="100%" stop-color="#2a1e10"/>
      </linearGradient>
      <!-- Tigris and Euphrates river gradient -->
      <linearGradient id="abriver" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#2b6076" stop-opacity=".6"/>
        <stop offset="100%" stop-color="#1a3a4a" stop-opacity=".3"/>
      </linearGradient>
      <marker id="ab-ar1" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto">
        <polygon points="0,0 8,4 0,8" fill="#C5A059"/>
      </marker>
      <filter id="ab-gf">
        <feGaussianBlur stdDeviation="1.2" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <rect width="1000" height="560" fill="url(#abdesert)"/>
    <rect width="1000" height="560" fill="url(#abbg)"/>

    <!-- Decorative Islamic patterns -->
    <use href="#sym-arabesque" x="40" y="40" width="48" height="48" opacity=".5"/>
    <use href="#sym-star8-lg" x="400" y="150" width="200" height="200" opacity=".2"/>
    <use href="#sym-dune" x="400" y="400" width="200" height="44" opacity=".45"/>

    <!-- Rivers: Tigris & Euphrates -->
    <path d="M 410 60 Q 430 120 445 160 Q 460 200 470 280 Q 480 340 490 400 Q 500 460 510 530"
          fill="none" stroke="url(#abriver)" stroke-width="3" opacity=".5"/>
    <path d="M 380 80 Q 400 140 420 200 Q 440 260 460 320 Q 480 380 500 450"
          fill="none" stroke="url(#abriver)" stroke-width="2.5" opacity=".4"/>

    <!-- Expansion / trade routes -->
    <path d="M 470 280 Q 550 260 630 250 Q 720 220 800 220 Q 840 180 860 130"
          fill="none" stroke="#C5A059" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#ab-ar1)" opacity=".7"/>
    <path d="M 630 250 Q 720 220 780 180"
          fill="none" stroke="#C5A059" stroke-width="1.5" stroke-dasharray="4 4" opacity=".5"/>
    <path d="M 470 280 Q 400 340 380 400"
          fill="none" stroke="#C5A059" stroke-width="1.5" stroke-dasharray="4 4" opacity=".5"/>
    <path d="M 470 280 Q 420 320 400 380"
          fill="none" stroke="#C5A059" stroke-width="1.5" stroke-dasharray="4 4" opacity=".4"/>
    <path d="M 470 280 Q 430 290 370 250"
          fill="none" stroke="#C5A059" stroke-width="1.5" stroke-dasharray="4 4" opacity=".5"/>
    <path d="M 370 250 Q 340 300 310 390"
          fill="none" stroke="#C5A059" stroke-width="1.5" stroke-dasharray="4 4" opacity=".4"/>
    <path d="M 470 280 Q 510 50 560 60"
          fill="none" stroke="#C5A059" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#ab-ar1)" opacity=".6"/>
    <path d="M 560 60 Q 590 55 620 50"
          fill="none" stroke="#C5A059" stroke-width="1.5" stroke-dasharray="4 4" opacity=".5"/>
    <path d="M 630 250 Q 680 330 500 350"
          fill="none" stroke="#C5A059" stroke-width="1.5" stroke-dasharray="4 4" opacity=".4"/>

    <!-- Baghdad (capital, primary node) -->
    <g class="cdn" id="abnode-0" transform="translate(470, 280)">
      <circle class="pr" cx="0" cy="0" r="28"/>
      <circle cx="0" cy="0" r="12" fill="#C5A059" opacity=".3"/>
      <circle cx="0" cy="0" r="6" fill="#C5A059"/>
      <text y="-25" fill="#fde68a" font-size="12" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" filter="url(#ab-gf)" data-ar="بغداد" data-en="Baghdad">بغداد</text>
      <text y="36" fill="#fcd34d" font-size="9" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="عاصمة الخلافة العباسية" data-en="Abbasid capital">عاصمة الخلافة</text>
    </g>

    <!-- Kufa -->
    <g class="cdn" id="abnode-1" transform="translate(480, 300)">
      <circle class="pr" cx="0" cy="0" r="18"/>
      <text y="-15" fill="#bae6fd" font-size="9.5" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="الكوفة" data-en="Kufa">الكوفة</text>
      <text y="26" fill="#7dd3fc" font-size="7.5" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="العراق" data-en="Iraq">العراق</text>
    </g>

    <!-- Samarra -->
    <g class="cdn" id="abnode-2" transform="translate(530, 250)">
      <circle class="pr" cx="0" cy="0" r="22"/>
      <rect x="-12" y="-14" width="24" height="28" fill="rgba(197,160,89,.12)" stroke="#C5A059" stroke-width="1.5"/>
      <text y="-16" fill="#fde68a" font-size="9.5" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="سامراء" data-en="Samarra">سامراء</text>
      <text y="30" fill="#fcd34d" font-size="8" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="العاصمة الثانية (٢٢١-٢٧٩ هـ)" data-en="Second capital (221-279 AH)">عاصمة ثانية</text>
    </g>

    <!-- Basra -->
    <g class="cdn" id="abnode-3" transform="translate(500, 350)">
      <circle class="pr" cx="0" cy="0" r="18"/>
      <text y="-15" fill="#bae6fd" font-size="9" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="البصرة" data-en="Basra">البصرة</text>
      <text y="26" fill="#7dd3fc" font-size="7.5" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="ميناء ومركز علم" data-en="Port & learning center">ميناء وعلم</text>
    </g>

    <!-- Makkah -->
    <g class="cdn" id="abnode-4" transform="translate(380, 400)">
      <circle class="pr" cx="0" cy="0" r="20"/>
      <text y="-16" fill="#fca5a5" font-size="9.5" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="مكة" data-en="Makkah">مكة</text>
      <text y="28" fill="#f87171" font-size="8" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="الحجاز" data-en="Hejaz">الحجاز</text>
    </g>

    <!-- Madinah -->
    <g class="cdn" id="abnode-5" transform="translate(400, 380)">
      <circle class="pr" cx="0" cy="0" r="18"/>
      <text y="-15" fill="#6ee7b7" font-size="9" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="المدينة" data-en="Madinah">المدينة</text>
      <text y="26" fill="#34d399" font-size="7.5" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="طيبة الطيبة" data-en="The Pure City">طيبة</text>
    </g>

    <!-- Damascus -->
    <g class="cdn" id="abnode-6" transform="translate(370, 250)">
      <circle class="pr" cx="0" cy="0" r="18"/>
      <text y="-15" fill="#bae6fd" font-size="9" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="دمشق" data-en="Damascus">دمشق</text>
      <text y="26" fill="#7dd3fc" font-size="7.5" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="الشام" data-en="Levant">الشام</text>
    </g>

    <!-- Cairo / Fustat -->
    <g class="cdn" id="abnode-7" transform="translate(310, 390)">
      <circle class="pr" cx="0" cy="0" r="20"/>
      <text y="-16" fill="#bae6fd" font-size="9.5" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="القاهرة" data-en="Cairo">القاهرة</text>
      <text y="28" fill="#7dd3fc" font-size="8" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="مصر (الخلافة العباسية الثانية)" data-en="Egypt (2nd Abbasid caliphate)">مصر</text>
    </g>

    <!-- Jerusalem -->
    <g class="cdn" id="abnode-8" transform="translate(380, 305)">
      <circle class="pr" cx="0" cy="0" r="16"/>
      <text y="-13" fill="#6ee7b7" font-size="8.5" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="القدس" data-en="Jerusalem">القدس</text>
    </g>

    <!-- Rayy / Persia -->
    <g class="cdn" id="abnode-9" transform="translate(630, 250)">
      <circle class="pr" cx="0" cy="0" r="18"/>
      <text y="-15" fill="#bae6fd" font-size="9" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="الري" data-en="Rayy">الري</text>
      <text y="26" fill="#7dd3fc" font-size="7.5" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="فارس" data-en="Persia">فارس</text>
    </g>

    <!-- Merv / Khurasan -->
    <g class="cdn" id="abnode-10" transform="translate(800, 220)">
      <circle class="pr" cx="0" cy="0" r="20"/>
      <text y="-16" fill="#fde68a" font-size="9" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="مرو" data-en="Merv">مرو</text>
      <text y="28" fill="#fcd34d" font-size="8" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="خراسان — منطلق الدعوة" data-en="Khurasan — birthplace of revolution">خراسان</text>
    </g>

    <!-- Nishapur -->
    <g class="cdn" id="abnode-11" transform="translate(780, 180)">
      <circle class="pr" cx="0" cy="0" r="16"/>
      <text y="-13" fill="#bae6fd" font-size="8.5" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="نيسابور" data-en="Nishapur">نيسابور</text>
    </g>

    <!-- Bukhara -->
    <g class="cdn" id="abnode-12" transform="translate(860, 130)">
      <circle class="pr" cx="0" cy="0" r="18"/>
      <text y="-15" fill="#bae6fd" font-size="9" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="بخارى" data-en="Bukhara">بخارى</text>
      <text y="26" fill="#7dd3fc" font-size="7.5" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="بلاد ما وراء النهر" data-en="Transoxiana">ما وراء النهر</text>
    </g>

    <!-- Samarkand -->
    <g class="cdn" id="abnode-13" transform="translate(900, 110)">
      <circle class="pr" cx="0" cy="0" r="14"/>
      <text y="-12" fill="#bae6fd" font-size="8" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="سمرقند" data-en="Samarkand">سمرقند</text>
    </g>

    <!-- Callout: Constantinople -->
    <g class="cdn" id="abnode-callout-const" transform="translate(510, 40)">
      <circle class="pr" cx="0" cy="0" r="16"/>
      <text y="-13" fill="#fca5a5" font-size="9" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="القسطنطينية" data-en="Constantinople">القسطنطينية</text>
      <text y="24" fill="#f87171" font-size="7.5" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="العدو البيزنطي" data-en="Byzantine foe">الروم</text>
    </g>

    <!-- Callout: Amorium -->
    <g class="cdn" id="abnode-callout-amor" transform="translate(560, 60)">
      <circle class="pr" cx="0" cy="0" r="14"/>
      <text y="-12" fill="#fca5a5" font-size="8.5" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="عمورية" data-en="Amorium">عمورية</text>
      <text y="22" fill="#f87171" font-size="7" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="فتح ٢٢٣ هـ" data-en="Conquered 223 AH">فتح المعتصم</text>
    </g>

    <!-- Callout: Manzikert -->
    <g class="cdn" id="abnode-callout-manz" transform="translate(620, 50)">
      <circle class="pr" cx="0" cy="0" r="14"/>
      <text y="-12" fill="#fca5a5" font-size="8.5" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="ملاذكرد" data-en="Manzikert">ملاذكرد</text>
      <text y="22" fill="#f87171" font-size="7" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="٤٦٣ هـ — ألب أرسلان" data-en="463 AH — Alp Arslan">نصر المسلمين</text>
    </g>

    <!-- Cordoba / Andalusia (context note) -->
    <g class="cdn" id="abnode-andalusia" transform="translate(20, 530)" opacity=".7">
      <circle class="pr" cx="0" cy="0" r="12"/>
      <text y="-10" fill="#93c5fd" font-size="8" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="الأندلس" data-en="Andalusia">الأندلس</text>
      <text y="20" fill="#60a5fa" font-size="6.5" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="(دولة أموية مستقلة)" data-en="(Independent Umayyad emirate)">أموية مستقلة</text>
    </g>

    <!-- Era badge -->
    <g transform="translate(880, 490)">
      <rect x="-60" y="-24" width="120" height="48" rx="8" fill="rgba(1,10,7,.85)" stroke="rgba(197,160,89,.4)" stroke-width="1"/>
      <text data-ar="١٣٢ - ٦٥٦ هـ" data-en="132–656 AH" x="0" y="-3" fill="#C5A059" font-size="12" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif">١٣٢ - ٦٥٦ هـ</text>
      <text data-ar="الدولة العباسية" data-en="Abbasid Caliphate" x="0" y="16" fill="#94a3b8" font-size="10" text-anchor="middle" font-family="Cairo,sans-serif">الدولة العباسية</text>
    </g>

    <!-- Compass Rose -->
    <g transform="translate(948, 508)">
      <circle r="18" fill="rgba(6,78,59,.45)" stroke="rgba(197,160,89,.3)" stroke-width="1"/>
      <text data-ar="ش" data-en="N" y="5" text-anchor="middle" fill="#C5A059" font-size="12" font-family="Cairo,sans-serif" font-weight="bold">ش</text>
      <line x1="0" y1="-12" x2="0" y2="-6" stroke="#C5A059" stroke-width="1.5"/>
    </g>

    <!-- Focus layer -->
    <g id="focus-abassi" style="display:none">
      <circle class="focus-pulse" cx="0" cy="0" r="8" fill="none" stroke="#C5A059" stroke-width="3"/>
      <polygon class="star-wake" points="0,-22 6,-6 22,0 6,6 0,22 -6,6 -22,0 -6,-6"/>
    </g>
  </g>
</svg>
```

### City Label Pattern

```html
<circle cx="470" cy="280" r="6" fill="#C5A059"/>
<text x="478" y="284"
      data-ar="بغداد"
      data-en="Baghdad"
      font-size="10" fill="#C5A059">بغداد</text>
```

---

## 3.2 Special Visual Indicators

### A. Phase 1 Golden Age — `amb-golden`

Steps 3–4 and 6–8 (Harun al-Rashid through al-Mu'tasim, the golden age flourish) set `"amb": "golden"`. Add a radiant gold gradient CSS class:

```css
/* style.css — golden age ambient for Abbasid Phase 1 */
.amb-golden { background: radial-gradient(ellipse at center, rgba(197, 160, 89, .2) 0%, rgba(197, 160, 89, .06) 50%, transparent 80%); }
```

JS already applies `amb-<value>` generically — no change needed.

### B. Phase 4 Mongol Sack — `amb-sack`

Steps 25–26 (Mongol destruction) set `"amb": "sack"`. Add a dark fiery glow:

```css
/* style.css — destruction/sack ambient for Mongol invasion */
.amb-sack { background: radial-gradient(ellipse at center, rgba(180, 40, 20, .15) 0%, rgba(6, 10, 15, .85) 60%, transparent 100%); }
```

### C. Golden Ribbon on Step Title for Golden Age

For Phase 1 golden age steps, add a decorative gold bar above the step title via CSS when `amb="golden"` is set on a parent or via an icon in `mdAr`/`mdEn`:

```html
"mdAr": "🌟 عصر هارون الرشيد الذهبي — ازدهار العلم والجهاد",
"mdEn": "🌟 Golden Age of Harun al-Rashid — flourishing of knowledge and jihad"
```

### D. Sack Icon for Phase 4

For Mongol sack steps, use a dramatic icon:

```html
"mdAr": "💀 اجتياح التتار لبغداد — كارثة الخلافة",
"mdEn": "💀 Mongol conquest of Baghdad — catastrophe of the caliphate"
```

---

## 4. Integration Points

### 4.1 `data.js` — Append `abassi` Era

Insert after the `umawi` era closure (after line ~4468 in current file). 28 step objects. Format matches existing eras exactly (quoted keys, `offsets: []`).

### 4.2 `index.html` — Three Additions

**A. Home Card — Abbasid Caliphate**

Add after the Umayyad card (after `#home-umawi`) inside `.home-cards`:

```html
<!-- الدولة العباسية -->
<div class="home-card" id="home-abassi" role="button" tabindex="0">
  <div class="hc-bg" style="background: linear-gradient(160deg, rgba(197,160,89,.18), rgba(10,6,50,.6))"></div>
  <div class="hc-content">
    <div class="hc-icon">🏺</div>
    <div class="hc-name" data-ar="الدولة العباسية" data-en="Abbasid Caliphate">الدولة العباسية</div>
    <div class="hc-desc" data-ar="أطول دولة إسلامية — من بغداد الذهبية إلى سقوطها في أيدي المغول" data-en="The longest Islamic dynasty — from golden Baghdad to the Mongol sack">من بغداد الذهبية إلى السقوط</div>
    <div class="hc-stats">
      <span class="hc-stat"><bdi data-ar="٢٨ مرحلة" data-en="28 stages">٢٨ مرحلة</bdi></span>
      <span class="hc-dot">•</span>
      <span class="hc-stat"><bdi data-ar="١٣٢ - ٦٥٦ هـ" data-en="132–656 AH">١٣٢ - ٦٥٦ هـ</bdi></span>
    </div>
    <div class="hc-btn" data-ar="استكشف الدولة العباسية" data-en="Explore the Abbasids">استكشف الدولة العباسية</div>
  </div>
</div>
```

**B. Inline SVG Map** — After `svg-umawi`, before `svg-imam`.

**C. Bilingual Data-Attribute Sweep** — Run the regex check after adding SVG text.

### 4.3 `app.js` — Changes

| Location | Change |
|----------|--------|
| `MAP_VB` (line 62) | Add `abassi: [1000, 560]` |
| `switchEv()` allSvgs (line ~562) | Add `'svg-abassi'` |
| `init()` click handler (line ~1103) | Add `#home-abassi` to selector |
| `narrationURL()` (line ~694) | **No change** — `EVT` key routing works |
| `applyMapFocus()` (line ~593) | **No change** — `MODE` routing works |
| `setAudioPulse()` (line ~661) | **No change** — `MODE` routing works |
| `goToHome()` back handler | Must add special case: `EVT==='abassi'` → `goToHome()` (same pattern as `umawi`) |

### 4.4 `tools/narration_ar.json`

Add 28 entries: `"abassi_0"` through `"abassi_27"`. Each must match the consonant skeleton of the corresponding `descAr`. Phase 3 (dynasties) and Phase 4 (Mongol sack) must have fully diacritized mushakkal text for correct TTS.

### 4.5 `timeline_data.geojson`

Append features for each unique location: Baghdad, Kufa, Samarra, Basra, Makkah, Madinah, Damascus, Cairo, Jerusalem, Rayy, Merv, Nishapur, Bukhara, Samarkand, Constantinople, Amorium, Manzikert, Mahdia, Cordoba. Each `event_id` set to `"abassi_<n>"`.

### 4.6 Audio Generation

```bash
python tools/gen_tts.py --eras abassi
# 5 slots × 2 languages × 28 steps = 280 new MP3 clips
```

---

## 5. Implementation Checklist

- [ ] **Design approved** — confirm the step breakdown, map approach, and home screen layout
- [ ] **Phase 1 — Data:**
  - [ ] Write 28 step objects in `data.js`
  - [ ] Add `narration_ar.json` entries (mushakkal for all 28 steps)
  - [ ] `python tools/check_voc.py`
  - [ ] Add GeoJSON features
  - [ ] `node --check data.js`
  - [ ] `node -e "JSON.parse(fs.readFileSync('timeline_data.geojson'))"`
- [ ] **Phase 2 — UI:**
  - [ ] Update `index.html`: add `#home-abassi` card to home screen
  - [ ] Add `svg#svg-abassi` inline SVG (viewBox 1000×560)
  - [ ] `app.js`: `MAP_VB` (`abassi: [1000, 560]`), `allSvgs`, click handler, back handler
  - [ ] Add `.amb-golden` CSS class to `style.css` (radiant gold gradient)
  - [ ] Add `.amb-sack` CSS class to `style.css` (dark fiery crimson gradient)
  - [ ] `data-ar`/`data-en` sweep
- [ ] **Phase 3 — Audio:**
  - [ ] `python tools/gen_tts.py --eras abassi` (280 clips)
  - [ ] Verify `audio/*/abassi_*_*.mp3` exist
  - [ ] Verify `audio/manifest.json` updated
- [ ] **Phase 4 — Verification:**
  - [ ] Open in browser, test all 28 steps
  - [ ] Test AR ↔ EN toggle
  - [ ] Test 5 voice slots
  - [ ] Test verse recitation per step
  - [ ] Test map focus positioning
  - [ ] Test mobile (360px, 720px)
  - [ ] Test back nav: Abbasid → home → imams → back
  - [ ] Test Phase 1 golden ambient (`amb-golden`)
  - [ ] Test Phase 4 sack ambient (`amb-sack`)
- [ ] **Phase 5 — Release:**
  - [ ] Update `CHANGELOG.md`
  - [ ] Bump `package.json` to v3.3.0
  - [ ] Update `AGENTS.md` / `CLAUDE.md`
  - [ ] Push to `main`

---

## 6. Design Decisions

| # | Decision | Choice | Rationale |
|---|----------|--------|-----------|
| 1 | Era key | `abassi` | Matches the `umawi` pattern (Arabic short-form derived) |
| 2 | Step count | 28 | 9+7+9+3, reflecting the 524-year span |
| 3 | Map dimensions | 1000×560 ✓ | Wider viewBox to show Khurasan → Samarkand in-frame with Baghdad at center |
| 4 | Home position | After Umayyad card, before Imams | Chronological order on the launcher |
| 5 | Phase 1 treatment | `amb-golden` CSS class + 🌟 icon in `mdAr`/`mdEn` | Radiant gold gradient marks the golden age of Islamic civilization |
| 6 | Phase 4 treatment | `amb-sack` CSS class + 💀 icon in `mdAr`/`mdEn` | Dark and crimson gradient conveys the Mongol catastrophe |
| 7 | Source anchoring | الطبري + ابن الأثير for annals, ابن كثير for sack narrative, الصلابي + طقوش for analysis | Per the user's four-source methodology, extended with ابن كثير for the detailed sack account |
| 8 | Map center | Baghdad (470, 280) | Unlike Umayyad (Damascus-centered), Abbasid power was Iraq-centered |
| 9 | Samarra | Secondary node at (530, 250) | Second capital during the Turkish domination phase |
| 10 | No splash section divider | Abbasid era accessible ONLY from home screen (like Umayyad) | The Umayyad pattern already established: post-Rashidun caliphates go on the home screen, not the Seerah splash |

---

## 7. Risks

- **Step count**: 28 is the largest era (next largest: Umayyad with 24, Meccan with 16). The timeline strip handles arbitrary counts, but check mobile scroll carefully.
- **Historical sensitivity**: The Abbasid narrative includes sensitive topics:
  - The conflict between al-Amin and al-Ma'mun (civil war among the Abbasids)
  - The Mihna (inquisition) and al-Ma'mun's theological coercion
  - The role of Ibn al-Alqami and accusations of Shi'a collaboration with the Mongols
  - Must maintain *sunni* perspective (al-Mutawakkil as restorer, Ahmad ibn Hanbal as hero)
- **Map density**: 28 steps × mapFocus on ~18 unique coordinates. Baghdad covers 10+ steps; only Samarra, Kufa, and external callouts shift the focus.
- **Audio generation time**: ~280 clips × ~2s each = ~9-10 minutes for TTS generation. Run with `--eras abassi` to avoid regenerating all eras.
- **Home screen overflow**: Adding a 6th card (5th after Seerah, Imams, Umayyads) may need layout adjustment on smaller screens.
- **Version update**: Cache-bust query strings in `index.html` must be updated: `data.js?v=3.3.0`, `app.js?v=3.3.0`, `style.css?v=3.3.0`, `data_imams.js?v=3.3.0`.

---

## 8. Suggested Islamic Decorative Motifs for the Abbasid Era

The Abbasid era has a distinctive artistic identity that can be reflected in the map design:

| Motif | Description | Use in SVG |
|-------|-------------|-----------|
| **محراب مسجد** (Mihrab arch) | The classic Abbasid mihrab — horseshoe arch with geometric borders | Decorative element at top-center of map frame |
| **زخارف جصية** (Stucco arabesques) | Samarra's signature beveled (mushabbak) stucco patterns — abstract vegetal motifs | Background decorative overlay at 30% opacity |
| **ورقة عنب/رصاصية** (Sassanid-inspired leaf) | Lotus/palmette motif borrowed from Persian art, characteristic of Abbasid Samarra | Small repeating border pattern |
| **خط كوفي** (Kufic calligraphy) | Geometric Kufic script — the Abbasids standardized the cursive *naskh* but Kufic remained monumental | Era badge border or compass rose frame |
| **تقاسيم هندسية** (Geometric star patterns) | 8-pointed and 12-pointed stars — Abbasid geometry reached its peak in the Samarra mosques | Background star motif (reuse `sym-star8-lg`) |
| **نهر دجلة** (Tigris River motif) | Curving silver-blue line representing the Tigris, the lifeblood of Baghdad | River path in SVG (see §3) |

These motifs are already partially represented by the existing `sym-arabesque` and `sym-star8-lg` symbols. For the Abbasid map, the Tigris river should be more prominent (it's the geographical spine of the Abbasid state), and the compass/era badge could incorporate Kufic-inspired angular borders.
