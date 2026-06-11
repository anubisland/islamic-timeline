# Ottoman Empire Module — Design Document

> **Status:** ✅ Design approved & reviewed — ready for implementation.
> **Sources (exclusive):** د. علي محمد الصلابي (الدولة العثمانية: عوامل النهوض وأسباب السقوط), محمد فريد بك المحامي (تاريخ الدولة العلية العثمانية), يلماز أوزتونا (تاريخ الدولة العثمانية), ابن إياس الحنفي (بدائع الزهور في وقائع الدهور), مرعي بن يوسف الكرمي الحنبلي (قلائد العقيان في فضائل آل عثمان), د. خليل إينالجيك (تاريخ الدولة العثمانية من التنظيمات إلى السقوط)
> **Total steps:** 28 across 4 phases (8+8+6+6), inserted chronologically after `abassi` in `window.SEERAH_DB`.
> **Map:** 1000×560 viewBox (matching Umayyad/Abbasid width, Istanbul-centered to cover the empire from Budapest to Baghdad, Crimea to Cairo).
> **Special treatments:**
>   - Phase 2 (golden age): Use existing `.amb-golden` CSS class (already defined for Abbasid golden age)
>   - Phase 4 (decline): New `.amb-dusk` CSS class with dark twilight gradient

---

## 1. Content Structure: Four Phases, One Era

The Ottoman period (c. 699–1342 AH / 1299–1924 CE) is added as a **single era key `uthmani`** in `data.js`'s `SEERAH_DB`, after `abassi`. The four phases are logical groupings within the flat `steps[]` array — no sub-eras or UI nesting.

```
SEERAH_DB (data.js) — chronological order:
  preb → meccan → hijra → badr → medinan → abubakr → umar → uthman → ali → hasan → umawi → abassi → uthmani (NEW)
```

| Phase | Title (Ar) | Title (En) | CE Range | Steps | Emphasis |
|-------|-----------|-----------|----------|-------|----------|
| 1 | التأسيس والنشوء | Foundation & Rise | 1299–1453 | 8 | Emergence from a small beylik, jihad creed, Orhan's army, Balkan foothold, recovery after Ankara |
| 2 | القوة والفتوحات الكبرى | Power & Great Conquests | 1453–1566 | 8 | Conquest of Constantinople, Selim's eastern unification, Suleiman's golden age, legal synthesis |
| 3 | الركود والاضطراب السياسي | Stagnation & Political Turmoil | 1566–1789 | 6 | Janissary domination, Murad IV's reform, Köprülü revival, Vienna 1683, capitulations |
| 4 | الضعف والإنهاء | Weakness & Termination | 1789–1924 | 6 | Mahmud II's reforms, Tanzimat, Abdul Hamid II's pan-Islamism, Young Turks, WWI collapse, abolition |

**Total: ~28 steps** (largest single era alongside Abbasid, reflecting the 625-year span).

---

### 1.1 Phase 1 — التأسيس والنشوء (1299–1453 CE) — 8 steps

Based on الصلابي (factors of rise), أوزتونا (annals), and محمد فريد بك (diplomatic history).

| Step | Key Event | Figures | Sources |
|------|-----------|---------|---------|
| 0 | **ظهور إمارة بني عثمان (c. 699 هـ):** خروج عثمان بن أرطغرل بإمارة صغيرة في شمال غرب الأناضول، إعلان الاستقلال عن سلاجقة الروم، تأسيس نواة الدولة على عقيدة الجهاد وتأمين ثغور المسلمين ضد البيزنطيين | عثمان الأول بن أرطغرل، الشيخ إدريس البتليسي | الصلابي، أوزتونا |
| 1 | **عثمان الأول — بناء الدولة والمؤسسات:** ترسيخ مفهوم "الغازي" (المجاهد) كهوية للدولة، تأسيس نظام الحكم والقضاء الشرعي، العدل والتسامح مع الرعايا غير المسلمين، توسيع الإمارة بالفتوحات التدريجية | عثمان الأول (المؤسس)، أخيه غندوز | الصلابي، محمد فريد بك |
| 2 | **أورخان غازي — الجيش النظامي والعاصمة الجديدة (726–761 هـ):** إنشاء الجيش الإنكشاري النظامي (قوات المشاة المدربة)، نقل العاصمة من سوغوت إلى بورصة (أول عاصمة إسلامية في الأناضول الغربية)، تنظيم الدولة وإصدار أول عملة عثمانية فضية (آقجه) | أورخان غازي، علاء الدين باشا (أخوه — أول وزير)، شهاب الدين عمر | الصلابي، أوزتونا |
| 3 | **التوسع في البلقان — معركتا ماريتسا وكوسوفو (763–791 هـ):** عبور الدردنيل إلى أوروبا بمساعدة القبائل البيزنطية، فتح أدرنة (العاصمة الجديدة)، معركة ماريتسا (1364) — أول نصر كبير في البلقان، معركة كوسوفو (1389) — استشهاد مراد الأول ونصر حاسم | مراد الأول (خداوندكار)، لالا شاهين باشا، بايزيد (ابن مراد)، صرب ميلوش (قاتل السلطان) | الصلابي، أوزتونا، ابن إياس |
| 4 | **بايزيد الصاعقة — معركة نيقوبوليس (798 هـ):** حصار القسطنطينية الأول (1394–1402)، النصر الساحق على الجيش الأوروبي الموحد (هنغاريا، فرنسا، ألمانيا) في نيقوبوليس (1396)، صولة الإسلام في قلب أوروبا، أسر الآلاف من الفرسان الأوروبيين | بايزيد الأول (الصاعقة)، الملك سيغيسموند هنغاريا، جون نيفيرز (كونت نيفير) | الصلابي، محمد فريد بك |
| 5 | **معركة أنقرة وفترة الفتنة (804–816 هـ):** هزيمة أنقرة المدمرة (1402) أمام تيمورلنك، أسر بايزيد ووفاته، فترة الفتنة بين أبناء بايزيد (عيسى، موسى، سليمان، محمد)، انقسام الإمارة | بايزيد الأول، تيمورلنك، سليمان جلبي، موسى جلبي، محمد جلبي | الصلابي، أوزتونا |
| 6 | **محمد الأول ومراد الثاني — التعافي والتوحيد (816–855 هـ):** توحيد محمد الأول للدولة بعد الفتنة، حكم قصير لكنه مؤسس للنهضة الثانية، مراد الثاني — توسع في البلقان (فتح سالونيك، معركة فارنا 1444)، إرساء أسس الجيش والنظام | محمد الأول، مراد الثاني، الصدر الأعظم خليل باشا (النجمي) | الصلابي، محمد فريد بك |
| 7 | **الاستعداد لفتح القسطنطينية — آق شمس الدين وتحقيق البشارة (855–857 هـ):** تولية محمد الثاني (21 سنة) رغم معارضة الصدر خليل باشا، توجيه شيخه آق شمس الدين الروحي، بناء قلعة روملي حصار على البوسفور (في 4 أشهر)، قطع خطوط إمداد القسطنطينية، التجهيز العسكري والنفسي للفتح العظيم | محمد الثاني (الفاتح)، الشيخ آق شمس الدين، الصدر خليل باشا | الصلابي، أوزتونا |

### 1.2 Phase 2 — القوة والفتوحات الكبرى (1453–1566 CE) — 8 steps

The "golden age" — the period Sunni traditional historians (مرعي الكرمي, ابن زيني دحلان) praise most for jihad, expansion, and service to the Haramayn.

| Step | Key Event | Figures | Sources |
|------|-----------|---------|---------|
| 8 | **فتح القسطنطينية (857 هـ/1453 م):** تحقيق البشارة النبوية الشريفة ("لتُفتحن القسطنطينية، فلنعم الأمير أميرها ولنعم الجيش ذلك الجيش")، حصار 53 يوماً، إدخال السفن براً عبر غلطة، فجر 20 جمادى الأولى فتحت المدينة، دخل محمد الفاتح مسجداً وأقام الصلاة في آيا صوفيا | محمد الفاتح، السلطان مراد الثاني (والده—مات قبل الفتح)، أوربان (صانع المدافع المجري)، قسطنطين الحادي عشر (آخر إمبراطور بيزنطي) | الصلابي، أوزتونا، ابن إياس |
| 9 | **بناء إسطنبول — عاصمة الخلافة الجديدة (857–886 هـ):** تحويل القسطنطينية إلى إسطنبول عاصمة الخلافة الإسلامية، بناء جامع الفاتح الكبير والمدرسة (أول جامعة إسلامية منظمة)، إعادة توطين المدينة (جلب المسلمين من جميع الأنحاء)، تنظيم الملل (الروم، الأرمن، اليهود) تحت نظام خاص، حماية حرية الأديان | محمد الفاتح، المعمار عثمان بن عبد الله، بطريرك الكنيسة الجديد (جيناديوس) | الصلابي، أوزتونا |
| 10 | **توسع محمد الفاتح — من بلغراد إلى القرم (857–886 هـ):** فتح صربيا، البوسنة، الهرسك، المورة (اليونان)، خانية القرم (تابعة عثمانية)، السيطرة على البحر الأسود (بحيرة عثمانية)، فتح إمارات الأناضول المتبقية، أحواز (إيالة) ألبانيا — أقصى توسع في القرن الخامس عشر | محمد الفاتح، إسكندر بك (ثم عاد تحت السيادة), الصدر محمود باشا | أوزتونا، محمد فريد بك |
| 11 | **سليم الأول — توحيد المشرق الإسلامي (918–926 هـ):** معركة جالديران (920 هـ/1514 م) ضد الشاه إسماعيل الصفوي — نصر حاسم أوقف المد الصفوي، ضم ديار بكر وشرق الأناضول، معركة مرج دابق (922 هـ) ضد المماليك — دخول حلب، معركة الريدانية (923 هـ) — دخول القاهرة | سليم الأول (ياووز)، الشاه إسماعيل الصفوي، طومان باي (آخر سلاطين المماليك)، خير بك (والى حلب) | الصلابي، ابن إياس (شهيد عيان)، أوزتونا |
| 12 | **الخلافة وحماية الحرمين (923–926 هـ):** ضم الحجاز — مكة والمدينة تحت السيادة العثمانية (تسليم مفتاح الكعبة لسليم الأول)، إعلان الخلافة العثمانية وانتقال الخلافة من بني العباس إلى بني عثمان، حماية طرق الحج، إرسال المحمل الشريف سنوياً — أصبحت الدولة العثمانية القوة السنية الرائدة عالمياً | سليم الأول، زين الدين زكريا (آخر خليفة عباسي بمصر—سلم الخلافة)، الشريف بركات (أمير مكة) | الصلابي، أوزتونا، مرعي الكرمي |
| 13 | **سليمان القانوني — العصر الذهبي (926–974 هـ):** أطول حكم وأزهى عصور الدولة، ازدهار الاقتصاد والعلم والعمارة، تنظيم القوانين تحت مظلة الشريعة (قانوننامه — قانون سليمان)، لقب "القانوني" لضبطه القوانين المدنية موافقة للشريعة، السلطان الشاعر والأديب | سليمان القانوني، المفتي أبو السعود أفندي، الصدر الأعظم إبراهيم باشا، السلطانة خرم (حُرَّم) | الصلابي، أوزتونا |
| 14 | **الفتوحات الأوروبية في عهد القانوني (926–974 هـ):** فتح بلغراد (1521)، فتح رودس (1522 — طرد فرسان الإسبتارية)، معركة موهاج (1526 — فتح بودابست والمجر)، حصار فيينا الأول (1529)، السيطرة على البحر المتوسط (خير الدين بربروس — معركة بروزة 1538)، فتح طرابلس الغرب | سليمان القانوني، خير الدين بربروس باشا، الصدر الأعظم صقللي محمد باشا، أندريا دوريا (الأدميرال الإسباني) | الصلابي، أوزتونا، محمد فريد بك |
| 15 | **الشريعة والقانون — أبو السعود أفندي (952–982 هـ):** دور المفتي أبو السعود أفندي في توحيد القوانين العثمانية مع الشريعة الحنفية، إصدار "قانوننامه" الذي نظم الأراضي والضرائب والجرائم موافقاً للفقه الحنفي، الظل الشرعي للسلطان — نموذج الحاكم الذي يستشير العلماء، ترسيخ المذهب الحنفي كمذهب رسمي للدولة | الشيخ أبو السعود أفندي (مفتي الدولة)، سليمان القانوني | الصلابي |

### 1.3 Phase 3 — الركود والاضطراب السياسي (1566–1789 CE) — 6 steps

وثقها المؤرخون (الصلابي, أوزتونا) كمرحلة تحول جذري من القوة إلى الضعف.

| Step | Key Event | Figures | Sources |
|------|-----------|---------|---------|
| 16 | **بداية الركود — من سليم الثاني إلى مراد الثالث (974–1003 هـ):** وفاة سليمان القانوني، ظهور "سلطنة النساء" وتأثير الحريم في السياسة (السلطانة نوربانو، صفية سلطان)، معركة ليبانتو البحرية (979 هـ/1571 م) — خسارة كبرى لكن أعيد بناء الأسطول في 6 أشهر، تغير طبيعة السلطنة من قائد جيش إلى حاكم قصر | سليم الثاني، صدر أعظم صقللي محمد باشا (الوصي الفعلي)، السلطانة نوربانو، دون خوان النمسا | الصلابي، أوزتونا |
| 17 | **تمرد الإنكشارية وتسلطهم على الدولة (1003–1094 هـ):** تحول الإنكشارية من نخبة عسكرية مجاهدة إلى قوة فاسدة تخلع السلاطين وتتحكم بالحكم، اغتيال عدة صدور عظام، الفوضى السياسية والتفكك الإداري، الدرس العظيم — خطورة ترك المؤسسة العسكرية دون رقابة شرعية وسياسية صارمة | السلطان عثمان الثاني (اغتيل 1622)، السلطان إبراهيم الأول (خلع 1648)، قادة الإنكشارية | الصلابي، أوزتونا |
| 18 | **مراد الرابع — إصلاح الهيبة والسيطرة (1032–1049 هـ):** تولية مراد الرابع (11 سنة) وسط الفوضى، القسوة الحازمة لإعادة الانضباط — إعدام المئات من المتمردين والفساق، منع الخمر والتدخين (قانون المنع الشهير)، استعادة بغداد (1048 هـ/1638 م) من الصفويين، إعادة هيبة الدولة مؤقتاً | مراد الرابع، الصدر الأعظم طيار محمد باشا (استشهد في بغداد)، الشاه صفي الصفوي | الصلابي، أوزتونا |
| 19 | **آل كوبريلي — إصلاحات مؤقتة تنقذ الدولة (1066–1122 هـ):** تولية محمد باشا كوبريلي (1066 هـ) — إصلاحات حازمة في الإدارة والمالية، القضاء على الفساد، إنعاش الجيش مؤقتاً، ثم ابنه أحمد باشا كوبريلي — حصار قندية (كانديا) في كريت وفتحها (1079 هـ/1669 م)، آخر ومضات القوة العثمانية | محمد باشا كوبريلي، أحمد باشا كوبريلي، فاضل مصطفى باشا كوبريلي | الصلابي، أوزتونا |
| 20 | **حصار فيينا الثاني (1094 هـ/1683 م) وبداية الانحسار الكبير:** قرار فتح فيينا — خطأ استراتيجي فادح، حصار 60 يوماً، وصول جيش النجدة البولندي بقيادة سوبياسكي، الهزيمة الساحقة، معاهدة كارلوفجة (1110 هـ/1699 م) — أول خسارة كبرى للأراضي (المجر، ترانسيلفانيا، بودابست)، بداية الانحسار المنهجي | الصدر الأعظم قرة مصطفى باشا، ملك بولندا يان سوبياسكي، السلطان محمد الرابع (عُزل بعد الهزيمة) | الصلابي، أوزتونا، محمد فريد بك |
| 21 | **عصر التنازلات وصعود النفوذ الأوروبي (1110–1203 هـ):** بداية "المسألة الشرقية" — التدخل الأوروبي المستمر، معاهدة بلطة ليمان وكوجوك قاينارجه (حق روسيا بحماية الأرثوذكس)، صعود النفوذ الفرنسي والبريطاني، بداية التفوق العسكري الأوروبي، تغلغل الأفكار الغربية والتنازلات التجارية — تحول الدولة من قوة مهيمنة إلى "رجل أوروبا المريض" | السلطان أحمد الثالث، السلطان مصطفى الثالث، كاترين الثانية (روسيا) | الصلابي، إينالجيك |

### 1.4 Phase 4 — الضعف والإنهاء (1789–1924 CE) — 6 steps

تركز المراجع السنية (الصلابي, محمد فريد بك) على محاولات الإنقاذ وأسباب السقوط النهائي.

| Step | Key Event | Figures | Sources |
|------|-----------|---------|---------|
| 22 | **محمود الثاني — إلغاء الإنكشارية والواقعة الخيرية (1223–1255 هـ):** قرار إلغاء الإنكشارية بعد قرون من فسادهم، حصار ثكناتهم في آت ميداني وقتل الآلاف (1826) — "الواقعة الخيرية"، بداية عصر "التنظيمات" — محاولة تحديث الجيش والإدارة على النمط الغربي، إضعاف مكانة العلماء والمؤسسات الإسلامية التقليدية | محمود الثاني، محمد علي باشا (والي مصر — تحدي مستقل)، القائد الألمكني مولتكه (مستشار عسكري) | الصلابي، إينالجيك |
| 23 | **التنظيمات — الإصلاح بين الشريعة والتغريب (1255–1293 هـ):** إصدار خط گلخانه (1839) — إعلان المساواة القانونية بين المسلمين وغير المسلمين، الخط الهمايوني (1856)، تحديث القانون المدني (مجلة الأحكام العدلية)، تأسيس المدارس الحديثة والجامعة العثمانية، جدل الإصلاح — محاولة إنقاذ الدولة بمزج الشريعة بالقوانين الأوروبية، الدرس: التغريب الجزئي لم ينقذ الدولة بل زاد الانقسام | السلطان عبد المجيد الأول، مصطفى رشيد باشا (مهندس التنظيمات)، مدحت باشا | الصلابي، إينالجيك، محمد فريد بك |
| 24 | **عبد الحميد الثاني — الجامعة الإسلامية والمقاومة الأخيرة (1293–1327 هـ):** تولية عبد الحميد الثاني بعد عزل مراد الخامس، تعليق الدستور (1295 هـ/1878 م) لمواجهة الأزمات، إحياء فكرة "الجامعة الإسلامية" (الوحدة الإسلامية) لمواجهة التغلغل الأوروبي، بناء سكة حديد الحجاز (1318–1326 هـ) لخدمة الحجاج وتعزيز الوحدة، رفض التفريط في فلسطين (قضية التسويات الصهيونية)، النهضة العمرانية في إسطنبول (المدارس، المستشفيات، التلغراف) | عبد الحميد الثاني، مدحت باشا (أعدم نفياً)، ثيودور هرتزل (الصهيونية — قابله ورفض) | الصلابي، محمد فريد بك |
| 25 | **حركة الاتحاد والترقي — الانحراف عن المسار (1327–1337 هـ):** ثورة الاتحاد والترقي (1908) — إجبار السلطان على إعادة الدستور، عزل عبد الحميد الثاني (1909)، سيطرة جمعية الاتحاد والترقي (التنظيم السري)، توجه علماني متطرف — محاكاة كمالية للغرب، تهميش الشريعة والعلماء، الدرس المؤلم — الانبهار بالغرب والابتعاد عن الهوية الإسلامية عجّل بتفكيك الدولة | طلعت باشا، أنور باشا، جمال باشا، السلطان محمد رشاد الخامس | الصلابي، إينالجيك |
| 26 | **الحرب العالمية الأولى وسقوط الدولة (1332–1337 هـ/1914–1918 م):** الدخول في الحرب إلى جانب ألمانيا، الجهاد المقدس (فتوى الجهاد ضد الحلفاء)، فتح الجبهات (غاليبولي — نصر عظيم، القوقاز — كارثة، سيناء — خسارة)، خيانة بعض القيادات العربية (انضمام الشريف حسين إلى البريطانيين)، احتلال القدس وفقدان فلسطين، هدنة مودروس (1918) — نهاية الدولة فعلياً | أنور باشا، مصطفى كمال (بعدها — عدو الخلافة)، الشريف حسين بن علي (مكة)، اللنبي (بريطانيا) | الصلابي، إينالجيك |
| 27 | **إلغاء الخلافة (1342 هـ/1924 م) — النهاية والدروس الكبرى:** الاحتلال البريطاني لإسطنبول (1918–1923)، صعود الحركة القومية التركية بقيادة مصطفى كمال، معاهدة لوزان (1923)، إعلان الجمهورية التركية، إلغاء السلطنة (1922)، إلغاء الخلافة نهائياً في 3 مارس 1924، طرد آل عثمان، نهاية 625 عاماً من الخلافة الإسلامية — أعظم درس في سنن الله في تغيير الأمم | مصطفى كمال أتاتورك، عبد المجيد الثاني (آخر خليفة)، السلطان وحيد الدين (آخر سلطان)، إينونو | الصلابي، محمد فريد بك |

---

### 1.5 Step-to-SVG City Mapping

| Step | Primary City | mapFocus {x, y} | Notes |
|------|-------------|-----------------|-------|
| 0 | سوغوت | 420, 290 | Foundation beylik — NW Anatolia |
| 1 | سوغوت | 420, 290 | State building center |
| 2 | بورصة | 410, 310 | First capital (Orhan) |
| 3 | أدرنة | 370, 260 | Second capital — Balkan foothold |
| 4 | نيقوبوليس | 320, 120 | Callout: Danube — Nicopolis victory |
| 5 | أنقرة | 480, 310 | Battle of Ankara — disaster |
| 6 | أدرنة | 370, 260 | Recovery phase center |
| 7 | إسطنبول | 450, 280 | Preparation for conquest |
| 8 | إسطنبول | 450, 280 | Conquest of Constantinople |
| 9 | إسطنبول | 450, 280 | Building the new capital |
| 10 | إسطنبول | 450, 280 | Fatih's expansion |
| 11 | جالديران | 520, 300 | Callout: East — Chaldiran |
| 12 | القاهرة | 270, 410 | Caliphate transfer |
| 13 | إسطنبول | 450, 280 | Suleiman's golden age |
| 14 | بودابست | 210, 140 | Callout: Hungary — Mohács |
| 15 | إسطنبول | 450, 280 | Law and justice |
| 16 | إسطنبول | 450, 280 | Decline begins |
| 17 | إسطنبول | 450, 280 | Janissary rebellion |
| 18 | بغداد | 480, 370 | Callout: Murad IV — Baghdad |
| 19 | إسطنبول | 450, 280 | Köprülü reforms |
| 20 | فيينا | 140, 80 | Callout: NW — Vienna 1683 |
| 21 | إسطنبول | 450, 280 | Capitulations era |
| 22 | إسطنبول | 450, 280 | Mahmud II — Janissary abolition |
| 23 | إسطنبول | 450, 280 | Tanzimat reforms |
| 24 | إسطنبول | 450, 280 | Abdul Hamid II |
| 25 | إسطنبول | 450, 280 | Young Turks |
| 26 | إسطنبول | 450, 280 | WWI — collapse |
| 27 | إسطنبول | 450, 280 | End — abolition |
| — | — | 450, 280 | Conclusion embedded in step 27 |

---

## 2. Data Schema

The era follows the exact `data.js` format (quoted JSON-style keys, matching existing eras):

```js
"uthmani": {
    "labelAr": "الدولة العثمانية",
    "labelEn": "Ottoman Empire",
    "mapLabelAr": "الدولة العثمانية في أقصى اتساعها",
    "mapLabelEn": "Ottoman Empire at Its Greatest Extent",
    "stepCountAr": "مرحلة",
    "stepCountEn": "stages",
    "offsets": [],
    "steps": [
        {
            "ayah": "﴿ وَعَدَ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَعَمِلُوا الصَّالِحَاتِ لَيَسْتَخْلِفَنَّهُمْ فِي الْأَرْضِ ﴾",
            "ayahRef": "سورة النور — الآية ٥٥",
            "ayahEn": "Allah has promised those who have believed among you and done righteous deeds that He will surely grant them succession upon the earth",
            "ayahRefEn": "Surah An-Nur (24), verse 55",
            "dateAr": "ح. ٦٩٩ هـ / ١٢٩٩ م",
            "dateEn": "c. 699 AH / 1299 CE",
            "titleAr": "ظهور إمارة بني عثمان — بذرة الخلافة",
            "titleEn": "The Emergence of the Ottoman Beylik — Seed of the Caliphate",
            "mtAr": "سوغوت — شمال غرب الأناضول",
            "mtEn": "Söğüt — Northwestern Anatolia",
            "mdAr": "خروج إمارة صغيرة على ثغور المسلمين ستكون نواة لخلافة دامت ٦٢٥ عاماً",
            "mdEn": "A small border beylik emerges — the seed of a caliphate that would last 625 years",
            "amb": "dawn",
            "timeAr": "🌅 أواخر القرن السابع الهجري",
            "timeEn": "🌅 Late 7th century AH",
            "distAr": "📍 من سوغوت إلى العالم",
            "distEn": "📍 From Söğüt to the world",
            "descAr": "في أواخر القرن السابع الهجري، خرجت من شمال غرب الأناضول إمارة صغيرة بقيادة عثمان بن أرطغرل. كانت هذه الإمارة إحدى إمارات الثغور التي تعيش على الجهاد ضد البيزنطيين. لم يكن أحد يتصور أن هذه البذرة الصغيرة ستتحول خلال قرنين إلى دولة تمتد من بودابست إلى بغداد، ومن القرم إلى القاهرة والجزائر. قام عثمان الأول بتأسيس إمارته على أساس عقيدة الجهاد في سبيل الله وتأمين ثغور المسلمين، وأرسى مبدأ التسامح مع الرعايا غير المسلمين، وجذب المجاهدين من جميع أنحاء الأناضول للانضمام إلى رايته. كان عثمان رجلاً صالحاً عادلاً، يحترم العلماء ويستشيرهم، وكان شديد التمسك بالشريعة. بهذه القيم بدأت رحلة 625 عاماً من التاريخ الإسلامي.",
            "descEn": "In the late 7th century AH, a small beylik emerged from northwestern Anatolia led by Osman ibn Ertuğrul. This was one of many frontier emirates living on jihad against the Byzantines. No one imagined that this tiny seed would, within two centuries, become an empire stretching from Budapest to Baghdad, from Crimea to Cairo and Algiers. Osman I founded his principality on the creed of jihad for the sake of Allah and securing the frontiers of the Muslims, and established a principle of tolerance toward non-Muslim subjects, attracting fighters from all over Anatolia to his banner. Osman was a righteous, just man who respected scholars and consulted them, and was deeply committed to sharia. With these values, the 625-year journey of Islamic history began.",
            "charsAr": [
                { "i": "🗡️", "n": "عثمان الأول بن أرطغرل", "r": "مؤسس الدولة — الغازي الأول" },
                { "i": "📜", "n": "الشيخ إدريس البتليسي", "r": "عالِم أرشد عثمان وبارك مسيرته" }
            ],
            "charsEn": [
                { "i": "🗡️", "n": "Osman I ibn Ertuğrul", "r": "Founder of the state — the first ghazi" },
                { "i": "📜", "n": "Sheikh Idris al-Bitlisi", "r": "Scholar who guided and blessed Osman's path" }
            ],
            "lessonAr": "الإخلاص والوضوح في الهدف يحولان القبيلة الصغيرة إلى دولة — لم تقم الدولة العثمانية بالقوة وحدها بل بالإيمان والعدل والجهاد في سبيل الله",
            "lessonEn": "Sincerity and clarity of purpose can transform a small tribe into a state — the Ottoman state was built not by force alone but by faith, justice, and jihad for Allah's cause",
            "srcs": ["د. الصلابي (الدولة العثمانية: عوامل النهوض وأسباب السقوط)", "يلماز أوزتونا (تاريخ الدولة العثمانية)"],
            "mapFocus": { "x": 420, "y": 290, "scale": 1.0 }
        }
        // ... 27 more steps
    ]
}
```

### Suggested Verses by Phase

- **Phase 1 (foundation & rise):**
  - Step 0 (emergence): النور 24:55 (استخلاف المؤمنين)
  - Step 1 (state building): الشورى 42:38 (شورى المؤمنين)
  - Step 2 (army): الأنفال 8:60 (أعدوا لهم ما استطعتم من قوة)
  - Step 3 (Balkan conquests): الحج 22:39-40 (أذن للذين يقاتلون)
  - Step 4 (Nicopolis): الأنفال 8:17 (فلم تقتلوهم ولكن الله قتلهم)
  - Step 5 (Ankara): آل عمران 3:140 (وتلك الأيام نداولها بين الناس)
  - Step 6 (recovery): الشرح 94:5-6 (إن مع العسر يسراً)
  - Step 7 (preparation for conquest): الإسراء 17:1 (سبحان الذي أسرى بعبده — الفتح الموعود)

- **Phase 2 (golden age):**
  - Step 8 (Conquest): الفتح 48:1-3 (إنا فتحنا لك فتحاً مبيناً)
  - Step 9 (Building): الملك 67:15 (هو الذي جعل لكم الأرض ذلولاً)
  - Step 10 (Expansion): الحج 22:40-41 (الذين إن مكناهم في الأرض)
  - Step 11 (Selim): النصر 110:1-3 (إذا جاء نصر الله والفتح)
  - Step 12 (Caliphate): النور 24:55 (ليستخلفنهم في الأرض)
  - Step 13 (Suleiman): سبأ 34:15 (بلدة طيبة ورب غفور)
  - Step 14 (European conquests): التوبة 9:33 (ليظهره على الدين كله)
  - Step 15 (Justice): المائدة 5:8 (اعدلوا هو أقرب للتقوى)

- **Phase 3 (stagnation):**
  - Step 16 (decline begins): الأنفال 8:53 (إن الله لم يغير نعمة حتى يغيروا ما بأنفسهم)
  - Step 17 (Janissaries): الحشر 59:2 (فاعتبروا يا أولي الأبصار)
  - Step 18 (Murad IV): الشورى 42:30 (وما أصابكم من مصيبة فبما كسبت أيديكم)
  - Step 19 (Köprülü): الرعد 13:11 (إن الله لا يغير ما بقوم حتى يغيروا ما بأنفسهم)
  - Step 20 (Vienna 1683): آل عمران 3:140 (وتلك الأيام نداولها بين الناس)
  - Step 21 (capitulations): الكهف 18:28 (ولا تطع من أغفلنا قلبه عن ذكرنا)

- **Phase 4 (decline & end):**
  - Step 22 (Mahmud II): الشورى 42:42 (إنما السبيل على الذين يظلمون الناس)
  - Step 23 (Tanzimat): البقرة 2:120 (ولن ترضى عنك اليهود ولا النصارى حتى تتبع ملتهم)
  - Step 24 (Abdul Hamid II): آل عمران 3:103 (واعتصموا بحبل الله جميعاً)
  - Step 25 (Young Turks): الحشر 59:2-5 (فاعتبروا يا أولي الأبصار)
  - Step 26 (WWI): الحاقة 69:1-4 (الحاقة ما الحاقة)
  - Step 27 (abolition): البقرة 2:156 (إنا لله وإنا إليه راجعون)
  - Step 27 (abolition — conclusion): النور 24:55, آل عمران 3:26 (قل اللهم مالك الملك)

### Field Notes

- **`srcs[]`**: Every step references ≥2 of the approved sources.
  - Phase 1 heavily uses الصلابي (analysis of rise factors) + أوزتونا (detailed annals) + محمد فريد بك (diplomatic context).
  - Phase 2 anchors in الصلابي + أوزتونا for the golden age, with ابن إياس for the Selim I/Egypt conquest.
  - Phase 3 uses الصلابي + أوزتونا + إينالجيك (for institutional decline analysis).
  - Phase 4 draws on الصلابي (decline factors) + إينالجيك (Tanzimat/sultanate analysis) + محمد فريد بك.
- **`amb`**: Default `"day"`. Key exceptions:
  - Step 0 (emergence of the beylik): `"dawn"` — a new dawn for Islam
  - Step 5 (Battle of Ankara): `"night"` — darkness of defeat and civil war
  - Step 8 (Conquest of Constantinople): `"dawn"` — the dawn of a new era
  - Steps 11-14 (Selim I to Suleiman's golden age): **`"golden"`** — use existing `.amb-golden` CSS class
  - Step 15 (Law): `"day"` — stability and justice
  - Step 20 (Vienna 1683): `"night"` — the beginning of the end
  - Steps 25-26 (WWI/collapse): `"night"` — darkness of destruction
  - Steps 22-24, 27 (decline & end): **`"dusk"`** — new `.amb-dusk` CSS class (twilight/ash gradient)
- **`chars[]`**: Maximum 4 per step. Key figures from the content above.
- **`ayahRefEn`**: Every step MUST have a parseable Quran citation — either `"Surah <Name> (<num>), verse <n>"` / `"verses <n>-<m>"` or `"Surah <Name> — <surah>:<ayah>"`.

---

## 3. SVG Map

### Approach: Wider Map (1000×560, Istanbul-centered with peripheral callouts)

The Ottoman Empire spanned three continents — from Hungary to Hejaz, from Crimea to Algeria. A `1000×560` viewBox with Istanbul at center-left (~450, 280) provides room to show the core Balkans-Anatolia-Levant axis with callouts for Budapest, Vienna, Crimea, Baghdad, and Algiers.

**Why 1000×560:**
- Shows the core Ottoman axis (Istanbul ↔ Edirne ↔ Sofia ↔ Belgrade) in-frame
- Matches existing 560px height, so no layout changes needed to surrounding UI
- Istanbul at center (450, 280) with Bursa, Edirne, Ankara as supporting nodes
- Budapest, Vienna, and Baghdad rendered as decorative callout labels with dotted connecting lines
- Cairo/Makkah/Madinah appear as southern nodes for the caliphate/Haramayn era
- `MAP_VB` entry: `uthmani: [1000, 560]`

### City Coordinates (1000×560 viewBox)

| City | x, y | Type | Notes |
|------|------|------|-------|
| Istanbul (إسطنبول) | 450, 280 | Main node | Capital — most steps |
| Bursa (بورصة) | 410, 310 | Node | First Ottoman capital |
| Edirne (أدرنة) | 370, 260 | Node | Second capital |
| Ankara (أنقرة) | 480, 310 | Node | Battle of Ankara |
| Söğüt (سوغوت) | 420, 290 | Node | Founding site |
| Sofia (صوفيا) | 320, 220 | Node | Balkan center |
| Belgrade (بلغراد) | 260, 190 | Callout | Key conquest |
| Sarajevo (سراييفو) | 270, 210 | Callout | Bosnia |
| Budapest (بودابست) | 210, 140 | Callout | Hungary — Mohács |
| Vienna (فيينا) | 140, 80 | Callout | 1529 & 1683 sieges |
| Athens (أثينا) | 360, 340 | Callout | Greece |
| Cairo (القاهرة) | 270, 410 | Node | Egypt — caliphate transfer |
| Damascus (دمشق) | 310, 320 | Node | Levant |
| Jerusalem (القدس) | 330, 340 | Node | Palestine |
| Baghdad (بغداد) | 480, 370 | Callout | Iraq — Murad IV |
| Makkah (مكة) | 180, 480 | Node | Haramayn protection |
| Madinah (المدينة) | 220, 450 | Node | Haramayn protection |
| Tabriz (تبريز) | 530, 290 | Callout | East — Chaldiran |
| Crimea (القرم) | 370, 90 | Callout | Black Sea — Bakhchysarai |
| Algiers (الجزائر) | 30, 430 | Callout | North Africa |
| Tunis (تونس) | 110, 400 | Callout | North Africa |
| Tripoli (طرابلس) | 90, 360 | Callout | Libya |
| Chaldiran (جالديران) | 520, 300 | Callout | 1514 battle site |
| Nicopolis (نيقوبوليس) | 320, 120 | Callout | 1396 battle site |

### SVG Elements

The Ottoman map should incorporate distinct decorative elements reflecting Ottoman visual identity:

- **Iznik-inspired borders**: Blue/turquoise geometric patterns in corners
- **Tughra-style element**: A stylized calligraphic monogram near the era badge
- **Tulip motif**: The *lale* (لالة) — the quintessential Ottoman symbol
- **Ottoman dome silhouette**: Decorative arch/dome shapes
- **Pencil minarets**: Slender decorative minarets in frame corners

```html
<svg id="svg-uthmani" class="map-svg hidden" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
  <g class="map-frame" opacity=".55">
    <!-- Ottoman-style decorative corner elements -->
  </g>
  <g class="map-pan" id="pan-uthmani">
    <defs>
      <!-- Sea gradient: deep Mediterranean blue (Iznik-inspired) -->
      <radialGradient id="otbg" cx="45%" cy="50%" r="70%">
        <stop offset="0%" stop-color="#1a2e24" stop-opacity=".4"/>
        <stop offset="100%" stop-color="#060b0f" stop-opacity="1"/>
      </radialGradient>
      <!-- Land gradient: emerald with gold for desert -->
      <linearGradient id="otland" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#2d5a3d"/>
        <stop offset="50%" stop-color="#3a5a3a"/>
        <stop offset="100%" stop-color="#4a3a20"/>
      </linearGradient>
      <!-- Iznik-style tile gradient (blue/turquoise) -->
      <linearGradient id="otiznik" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#0ea5e9" stop-opacity=".3"/>
        <stop offset="50%" stop-color="#06b6d4" stop-opacity=".15"/>
        <stop offset="100%" stop-color="#0ea5e9" stop-opacity=".3"/>
      </linearGradient>
      <!-- Arrow marker -->
      <marker id="ot-ar1" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto">
        <polygon points="0,0 8,4 0,8" fill="#C5A059"/>
      </marker>
      <!-- Glow filter -->
      <filter id="ot-gf">
        <feGaussianBlur stdDeviation="1.2" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    <!-- Base terrain -->
    <rect width="1000" height="560" fill="url(#otland)"/>
    <rect width="1000" height="560" fill="url(#otbg)"/>

    <!-- Decorative Iznik-style border elements -->
    <!-- Top-left corner: stylized tulip + arabesque -->
    <g transform="translate(20, 20)" opacity=".4">
      <path d="M 0 20 Q 10 0 20 20 Q 30 40 0 50 Q -10 30 0 20" fill="#0ea5e9" opacity=".5"/>
      <circle cx="10" cy="25" r="4" fill="#C5A059" opacity=".6"/>
      <path d="M 10 25 Q 15 10 10 5" fill="none" stroke="#C5A059" stroke-width="1.5" opacity=".6"/>
    </g>

    <!-- Top-right corner: stylized minaret + dome -->
    <g transform="translate(940, 15)" opacity=".4">
      <path d="M 20 40 L 18 10 Q 20 0 22 10 L 20 40" fill="#0ea5e9" opacity=".5"/>
      <ellipse cx="20" cy="8" rx="8" ry="4" fill="#C5A059" opacity=".5"/>
      <line x1="20" y1="4" x2="20" y2="0" stroke="#C5A059" stroke-width="1" opacity=".6"/>
      <circle cx="20" cy="-1" r="1.5" fill="#C5A059" opacity=".7"/>
    </g>

    <!-- Bottom-left corner: Iznik medallion -->
    <g transform="translate(15, 500)" opacity=".4">
      <circle cx="25" cy="25" r="20" fill="none" stroke="#0ea5e9" stroke-width="1.5"/>
      <circle cx="25" cy="25" r="12" fill="none" stroke="#C5A059" stroke-width="1"/>
      <circle cx="25" cy="25" r="4" fill="#0ea5e9" opacity=".6"/>
      <!-- Floral petals -->
      <path d="M 25 9 Q 30 17 25 25 Q 20 17 25 9" fill="#C5A059" opacity=".4"/>
      <path d="M 25 41 Q 30 33 25 25 Q 20 33 25 41" fill="#C5A059" opacity=".4"/>
      <path d="M 9 25 Q 17 20 25 25 Q 17 30 9 25" fill="#C5A059" opacity=".4"/>
      <path d="M 41 25 Q 33 20 25 25 Q 33 30 41 25" fill="#C5A059" opacity=".4"/>
    </g>

    <!-- Bottom-right corner: Tughra-inspired calligraphic element -->
    <g transform="translate(880, 480)" opacity=".5">
      <!-- Simplified tughra outline -->
      <path d="M 40 30 Q 50 20 60 30 Q 70 40 55 45 Q 40 50 30 40 Q 20 30 40 30" fill="none" stroke="#C5A059" stroke-width="1.5"/>
      <path d="M 50 25 Q 60 15 70 20 Q 75 25 65 35 Q 55 30 50 25" fill="none" stroke="#C5A059" stroke-width="1"/>
      <text x="50" y="42" fill="#C5A059" font-size="6" text-anchor="middle" font-family="Cairo,serif" opacity=".6">طغراء</text>
    </g>

    <!-- Bosphorus / Dardanelles water (Çanakkale Boğazı) -->
    <path d="M 420 160 Q 435 220 450 280 Q 440 340 410 400"
          fill="none" stroke="url(#otiznik)" stroke-width="6" opacity=".35"/>
    <path d="M 400 180 Q 385 240 370 260 Q 380 300 390 360"
          fill="none" stroke="url(#otiznik)" stroke-width="4" opacity=".25"/>

    <!-- Danube River (symbolic) -->
    <path d="M 140 100 Q 180 120 220 140 Q 260 160 320 180 Q 350 190 370 200"
          fill="none" stroke="#0ea5e9" stroke-width="3" stroke-dasharray="8 4" opacity=".25"/>

    <!-- Expansion routes / conquest paths -->
    <!-- Westward (Balkans) -->
    <path d="M 450 280 Q 400 250 370 260 Q 340 240 320 220 Q 290 210 270 210 Q 240 200 260 190 Q 240 160 210 140 Q 170 110 140 80"
          fill="none" stroke="#C5A059" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#ot-ar1)" opacity=".6"/>
    <!-- Southward (Levant/Egypt) -->
    <path d="M 450 280 Q 380 300 330 320 Q 300 360 270 410"
          fill="none" stroke="#C5A059" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#ot-ar1)" opacity=".55"/>
    <!-- Eastward (Anatolia/Iraq) -->
    <path d="M 450 280 Q 480 310 520 300 Q 550 310 530 290"
          fill="none" stroke="#C5A059" stroke-width="1.5" stroke-dasharray="4 4" opacity=".45"/>
    <!-- Southeast (Haramayn) -->
    <path d="M 330 320 Q 280 380 220 450 Q 200 470 180 480"
          fill="none" stroke="#C5A059" stroke-width="1.5" stroke-dasharray="4 4" opacity=".4"/>
    <!-- Black Sea -->
    <path d="M 370 90 Q 390 60 450 160"
          fill="none" stroke="#C5A059" stroke-width="1.5" stroke-dasharray="4 4" opacity=".35"/>
    <!-- North Africa -->
    <path d="M 270 410 Q 180 400 110 400 Q 70 430 30 430"
          fill="none" stroke="#C5A059" stroke-width="1.5" stroke-dasharray="4 4" opacity=".35"/>

    <!-- Istanbul (capital, primary node) -->
    <g class="cdn" id="otnode-0" transform="translate(450, 280)">
      <circle class="pr" cx="0" cy="0" r="32"/>
      <circle cx="0" cy="0" r="14" fill="#C5A059" opacity=".3"/>
      <circle cx="0" cy="0" r="7" fill="#C5A059"/>
      <!-- Sultan dome silhouette behind label -->
      <path d="M -15 -25 Q 0 -35 15 -25 Q 20 -20 15 -15 Q 0 -20 -15 -15 Q -20 -20 -15 -25" fill="#C5A059" opacity=".15"/>
      <text y="-28" fill="#fde68a" font-size="13" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" filter="url(#ot-gf)" data-ar="إسطنبول" data-en="Istanbul">إسطنبول</text>
      <text y="40" fill="#fcd34d" font-size="9" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="عاصمة الخلافة — القسطنطينية سابقاً" data-en="Capital of the Caliphate — formerly Constantinople">عاصمة الخلافة</text>
    </g>

    <!-- Bursa (first capital) -->
    <g class="cdn" id="otnode-1" transform="translate(410, 310)">
      <circle class="pr" cx="0" cy="0" r="22"/>
      <rect x="-14" y="-14" width="28" height="28" rx="3" fill="rgba(197,160,89,.08)" stroke="#C5A059" stroke-width="1"/>
      <text y="-16" fill="#bae6fd" font-size="10" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="بورصة" data-en="Bursa">بورصة</text>
      <text y="28" fill="#7dd3fc" font-size="8" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="العاصمة الأولى (بورصة)" data-en="First capital">العاصمة الأولى</text>
    </g>

    <!-- Edirne (second capital) -->
    <g class="cdn" id="otnode-2" transform="translate(370, 260)">
      <circle class="pr" cx="0" cy="0" r="20"/>
      <text y="-15" fill="#bae6fd" font-size="9.5" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="أدرنة" data-en="Edirne">أدرنة</text>
      <text y="26" fill="#7dd3fc" font-size="7.5" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="العاصمة الثانية — أدرنة" data-en="Second capital">العاصمة الثانية</text>
    </g>

    <!-- Ankara -->
    <g class="cdn" id="otnode-3" transform="translate(480, 310)">
      <circle class="pr" cx="0" cy="0" r="16"/>
      <text y="-13" fill="#bae6fd" font-size="8.5" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="أنقرة" data-en="Ankara">أنقرة</text>
      <text y="22" fill="#7dd3fc" font-size="7" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="معركة ١٤٠٢" data-en="Battle 1402">أنقرة</text>
    </g>

    <!-- Söğüt (birthplace) -->
    <g class="cdn" id="otnode-4" transform="translate(420, 290)">
      <circle class="pr" cx="0" cy="0" r="14"/>
      <text y="-12" fill="#6ee7b7" font-size="8" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="سوغوت" data-en="Söğüt">سوغوت</text>
      <text y="20" fill="#34d399" font-size="6.5" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="منطلق الدولة" data-en="Birthplace">منطلق الدولة</text>
    </g>

    <!-- Sofia -->
    <g class="cdn" id="otnode-5" transform="translate(320, 220)">
      <circle class="pr" cx="0" cy="0" r="16"/>
      <text y="-13" fill="#bae6fd" font-size="8.5" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="صوفيا" data-en="Sofia">صوفيا</text>
      <text y="22" fill="#7dd3fc" font-size="7" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="الروملي" data-en="Rumelia">الروملي</text>
    </g>

    <!-- Belgrade -->
    <g class="cdn" id="otnode-6" transform="translate(260, 190)">
      <circle class="pr" cx="0" cy="0" r="16"/>
      <text y="-13" fill="#bae6fd" font-size="8.5" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="بلغراد" data-en="Belgrade">بلغراد</text>
      <text y="22" fill="#7dd3fc" font-size="7" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="باب أوروبا" data-en="Gateway to Europe">أوروبا</text>
    </g>

    <!-- Sarajevo -->
    <g class="cdn" id="otnode-7" transform="translate(270, 210)">
      <circle class="pr" cx="0" cy="0" r="14"/>
      <text y="-12" fill="#bae6fd" font-size="8" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="سراييفو" data-en="Sarajevo">سراييفو</text>
    </g>

    <!-- Cairo -->
    <g class="cdn" id="otnode-8" transform="translate(270, 410)">
      <circle class="pr" cx="0" cy="0" r="20"/>
      <text y="-16" fill="#fca5a5" font-size="9.5" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="القاهرة" data-en="Cairo">القاهرة</text>
      <text y="28" fill="#f87171" font-size="8" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="مصر — انتقال الخلافة" data-en="Egypt — Caliphate transfer">مصر</text>
    </g>

    <!-- Damascus -->
    <g class="cdn" id="otnode-9" transform="translate(310, 320)">
      <circle class="pr" cx="0" cy="0" r="18"/>
      <text y="-14" fill="#6ee7b7" font-size="9" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="دمشق" data-en="Damascus">دمشق</text>
      <text y="24" fill="#34d399" font-size="7.5" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="الشام" data-en="Levant">الشام</text>
    </g>

    <!-- Jerusalem -->
    <g class="cdn" id="otnode-10" transform="translate(330, 340)">
      <circle class="pr" cx="0" cy="0" r="16"/>
      <text y="-13" fill="#6ee7b7" font-size="8.5" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="القدس" data-en="Jerusalem">القدس</text>
      <text y="22" fill="#34d399" font-size="7" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="فلسطين" data-en="Palestine">فلسطين</text>
    </g>

    <!-- Makkah -->
    <g class="cdn" id="otnode-11" transform="translate(180, 480)">
      <circle class="pr" cx="0" cy="0" r="22"/>
      <text y="-18" fill="#fca5a5" font-size="10" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="مكة" data-en="Makkah">مكة</text>
      <text y="30" fill="#f87171" font-size="8" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="الحرمين الشريفين — تحت الحماية العثمانية" data-en="Haramayn — under Ottoman protection">الحرمين الشريفين</text>
    </g>

    <!-- Madinah -->
    <g class="cdn" id="otnode-12" transform="translate(220, 450)">
      <circle class="pr" cx="0" cy="0" r="18"/>
      <text y="-14" fill="#fca5a5" font-size="9" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="المدينة" data-en="Madinah">المدينة</text>
      <text y="24" fill="#f87171" font-size="7.5" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="طيبة — سكة حديد الحجاز" data-en="The Pure City — Hejaz Railway">طيبة</text>
    </g>

    <!-- Callout: Budapest -->
    <g class="cdn" id="otnode-callout-budapest" transform="translate(210, 140)">
      <circle class="pr" cx="0" cy="0" r="14"/>
      <text y="-12" fill="#fca5a5" font-size="8.5" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="بودابست" data-en="Budapest">بودابست</text>
      <text y="22" fill="#f87171" font-size="7" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="المجر — معركة موهاج" data-en="Hungary — Mohács">المجر</text>
    </g>

    <!-- Callout: Vienna -->
    <g class="cdn" id="otnode-callout-vienna" transform="translate(140, 80)">
      <circle class="pr" cx="0" cy="0" r="14"/>
      <text y="-12" fill="#fca5a5" font-size="8.5" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="فيينا" data-en="Vienna">فيينا</text>
      <text y="22" fill="#f87171" font-size="7" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="حصار ١٥٢٩ و١٦٨٣" data-en="Sieges 1529 & 1683">حصاران</text>
    </g>

    <!-- Callout: Nicopolis -->
    <g class="cdn" id="otnode-callout-nicopolis" transform="translate(320, 120)">
      <circle class="pr" cx="0" cy="0" r="12"/>
      <text y="-10" fill="#fca5a5" font-size="7.5" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="نيقوبوليس" data-en="Nicopolis">نيقوبوليس</text>
      <text y="18" fill="#f87171" font-size="6.5" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="نصر ١٣٩٦" data-en="Victory 1396">نصر 1396</text>
    </g>

    <!-- Callout: Chaldiran -->
    <g class="cdn" id="otnode-callout-chaldiran" transform="translate(520, 300)">
      <circle class="pr" cx="0" cy="0" r="14"/>
      <text y="-12" fill="#fca5a5" font-size="8" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="جالديران" data-en="Chaldiran">جالديران</text>
      <text y="20" fill="#f87171" font-size="6.5" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="نصر ١٥١٤" data-en="Victory 1514">نصر 1514</text>
    </g>

    <!-- Callout: Baghdad -->
    <g class="cdn" id="otnode-callout-baghdad" transform="translate(480, 370)">
      <circle class="pr" cx="0" cy="0" r="16"/>
      <text y="-13" fill="#bae6fd" font-size="8.5" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="بغداد" data-en="Baghdad">بغداد</text>
      <text y="22" fill="#7dd3fc" font-size="7" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="استعادة ١٦٣٨" data-en="Recaptured 1638">استعادة 1638</text>
    </g>

    <!-- Callout: Crimea -->
    <g class="cdn" id="otnode-callout-crimea" transform="translate(370, 90)">
      <circle class="pr" cx="0" cy="0" r="14"/>
      <text y="-12" fill="#bae6fd" font-size="8" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="القرم" data-en="Crimea">القرم</text>
      <text y="20" fill="#7dd3fc" font-size="7" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="البحر الأسود" data-en="Black Sea">البحر الأسود</text>
    </g>

    <!-- Callout: Tabriz -->
    <g class="cdn" id="otnode-callout-tabriz" transform="translate(540, 290)">
      <circle class="pr" cx="0" cy="0" r="14"/>
      <text y="-12" fill="#bae6fd" font-size="8" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="تبريز" data-en="Tabriz">تبريز</text>
      <text y="20" fill="#7dd3fc" font-size="7" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="أذربيجان" data-en="Azerbaijan">أذربيجان</text>
    </g>

    <!-- Callout: Algiers -->
    <g class="cdn" id="otnode-callout-algiers" transform="translate(30, 430)">
      <circle class="pr" cx="0" cy="0" r="14"/>
      <text y="-12" fill="#bae6fd" font-size="8" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="الجزائر" data-en="Algiers">الجزائر</text>
      <text y="20" fill="#7dd3fc" font-size="7" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="إيالة عثمانية" data-en="Ottoman province">الجزائر</text>
    </g>

    <!-- Callout: Tunis -->
    <g class="cdn" id="otnode-callout-tunis" transform="translate(110, 400)">
      <circle class="pr" cx="0" cy="0" r="12"/>
      <text y="-10" fill="#bae6fd" font-size="7.5" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="تونس" data-en="Tunis">تونس</text>
    </g>

    <!-- Callout: Athens -->
    <g class="cdn" id="otnode-callout-athens" transform="translate(360, 340)">
      <circle class="pr" cx="0" cy="0" r="12"/>
      <text y="-10" fill="#93c5fd" font-size="7" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif" data-ar="أثينا" data-en="Athens">أثينا</text>
    </g>

    <!-- Era badge -->
    <g transform="translate(860, 490)">
      <rect x="-65" y="-28" width="130" height="56" rx="8" fill="rgba(1,10,7,.85)" stroke="rgba(197,160,89,.4)" stroke-width="1"/>
      <text data-ar="الدولة العثمانية" data-en="Ottoman Empire" x="0" y="-7" fill="#C5A059" font-size="11" font-weight="bold" text-anchor="middle" font-family="Cairo,sans-serif">الدولة العثمانية</text>
      <text data-ar="ح. ٦٩٩ - ١٣٤٢ هـ" data-en="c. 699–1342 AH" x="0" y="12" fill="#94a3b8" font-size="10" text-anchor="middle" font-family="Cairo,sans-serif">ح. 699–1342 هـ</text>
      <text data-ar="١٢٩٩ - ١٩٢٤ م" data-en="1299–1924 CE" x="0" y="24" fill="#64748b" font-size="8" text-anchor="middle" font-family="Cairo,sans-serif">1299–1924 م</text>
    </g>

    <!-- Compass Rose -->
    <g transform="translate(948, 508)">
      <circle r="18" fill="rgba(6,78,59,.45)" stroke="rgba(197,160,89,.3)" stroke-width="1"/>
      <text data-ar="ش" data-en="N" y="5" text-anchor="middle" fill="#C5A059" font-size="12" font-family="Cairo,sans-serif" font-weight="bold">ش</text>
      <line x1="0" y1="-12" x2="0" y2="-6" stroke="#C5A059" stroke-width="1.5"/>
    </g>

    <!-- Focus layer -->
    <g id="focus-uthmani" style="display:none">
      <circle class="focus-pulse" cx="0" cy="0" r="8" fill="none" stroke="#C5A059" stroke-width="3"/>
      <polygon class="star-wake" points="0,-22 6,-6 22,0 6,6 0,22 -6,6 -22,0 -6,-6"/>
    </g>
  </g>
</svg>
```

### City Label Pattern

```html
<circle cx="450" cy="280" r="6" fill="#C5A059"/>
<text x="458" y="284"
      data-ar="إسطنبول"
      data-en="Istanbul"
      font-size="10" fill="#C5A059">إسطنبول</text>
```

---

## 3.2 Special Visual Indicators

### A. Phase 2 Golden Age — `amb-golden` (Already Defined)

Steps 11–15 (Selim I's unification through the Suleimanic legal synthesis) set `"amb": "golden"`. Steps 8 (Conquest) uses `"dawn"` as a distinct dawn-of-a-new-era event. The existing `.amb-golden` CSS class already defined in `style.css` applies a radiant gold gradient:

```css
.amb-golden { background: radial-gradient(ellipse at center, rgba(197, 160, 89, .2) 0%, rgba(197, 160, 89, .06) 50%, transparent 80%); }
```

JS already applies `amb-<value>` generically — no change needed.

For Phase 2 golden age steps, add a decorative icon in `mdAr`/`mdEn`:
```html
"mdAr": "🌟 العصر الذهبي — فتح القسطنطينية وازدهار الدولة",
"mdEn": "🌟 Golden Age — Conquest of Constantinople and imperial flourishing"
```

### B. Phase 4 Decline — New `amb-dusk` CSS Class

Steps 22–27 (Mahmud II through the abolition) set `"amb": "dusk"`. Add a dark twilight gradient to `style.css`:

```css
/* style.css — twilight/decline ambient for Ottoman Phase 4 */
.amb-dusk { background: radial-gradient(ellipse at center, rgba(140, 70, 20, .12) 0%, rgba(6, 10, 15, .88) 60%, transparent 100%); }
```

For Phase 4 decline steps, use a dramatic twilight icon:
```html
"mdAr": "🌆 عصر الأفول — محاولات الإصلاح وسقوط الخلافة",
"mdEn": "🌆 Twilight Era — Reform attempts and fall of the caliphate"
```

### C. Phase 1 Dawn — `amb-dawn` (Already Defined)

Step 0 (emergence of the beylik) uses the existing `amb-dawn` class (orange glow from bottom).

### D. Phase 1 Disaster — `amb-night` (Already Defined)

Step 5 (Battle of Ankara and civil war) uses the existing `amb-night` class (darkness).

### E. Phase 3 Crisis — `amb-night` (Already Defined)

Steps 17 (Janissary rebellion), 20 (Vienna 1683), and 25-26 (WWI) use `amb-night`.

### F. Golden Ribbon on Step Title

For Phase 2 golden age steps, add a decorative gold indicator:
```html
"mdAr": "🌟 فتح القسطنطينية — أعظم الفتوحات الإسلامية",
"mdEn": "🌟 Conquest of Constantinople — the greatest Islamic conquest"
```

For Phase 4 dusk steps:
```html
"mdAr": "🌆 إلغاء الإنكشارية — نهاية حقبة وبداية أخرى",
"mdEn": "🌆 Abolition of the Janissaries — end of an era, beginning of another"
```

---

## 4. Integration Points

### 4.1 `data.js` — Append `uthmani` Era

Insert after the `abassi` era closure (after line 5405 in current file). 28 step objects. Format matches existing eras exactly (quoted keys, `offsets: []`).

```js
"uthmani": {
    "labelAr": "الدولة العثمانية",
    "labelEn": "Ottoman Empire",
    "mapLabelAr": "الدولة العثمانية في أقصى اتساعها",
    "mapLabelEn": "Ottoman Empire at Its Greatest Extent",
    "stepCountAr": "مرحلة",
    "stepCountEn": "stages",
    "offsets": [],
    "steps": [
        // ... 28 step objects
    ]
}
```

### 4.2 `index.html` — Three Additions

**A. Home Card — Ottoman Empire**

Add after `#home-abassi` (after line ~145) inside `.home-cards`:

```html
<!-- الدولة العثمانية -->
<div class="home-card" id="home-uthmani" role="button" tabindex="0">
  <div class="hc-bg" style="background: linear-gradient(160deg, rgba(197,160,89,.18), rgba(6,20,35,.7))"></div>
  <div class="hc-content">
    <div class="hc-icon">☪️</div>
    <div class="hc-name" data-ar="الدولة العثمانية" data-en="Ottoman Empire">الدولة العثمانية</div>
    <div class="hc-desc" data-ar="آخر الخلافة الإسلامية الكبرى — من الإمارة إلى إلغاء الخلافة (٦٢٥ عاماً)" data-en="The last great Islamic caliphate — from beylik to abolition (625 years)">آخر الخلافة الإسلامية الكبرى</div>
    <div class="hc-stats">
      <span class="hc-stat"><bdi data-ar="٢٨ مرحلة" data-en="28 stages">٢٨ مرحلة</bdi></span>
      <span class="hc-dot">•</span>
      <span class="hc-stat"><bdi data-ar="ح. ٦٩٩ - ١٣٤٢ هـ" data-en="c. 699–1342 AH">ح. ٦٩٩ - ١٣٤٢ هـ</bdi></span>
    </div>
    <div class="hc-btn" data-ar="استكشف الدولة العثمانية" data-en="Explore the Ottomans">استكشف الدولة العثمانية</div>
  </div>
</div>
```

**B. Inline SVG Map** — After `svg-abassi`, before `svg-imam`.

**C. Bilingual Data-Attribute Sweep** — Run the regex check after adding SVG text.

### 4.3 `app.js` — Changes

| Location | Change |
|----------|--------|
| `MAP_VB` (line 62) | Add `uthmani: [1000, 560]` |
| `switchEv()` allSvgs (line ~600) | Add `'svg-uthmani'` |
| `init()` click handler (line ~1159) | Add `$('home-uthmani')` click → `goToUthmani()` |
| `init()` back handler (line ~1173) | Add `else if (EVT === 'uthmani') goToHome()` |
| New function `goToUthmani()` | Parallel to `goToUmawi()` / `goToAbbassi()` |
| `narrationURL()` (line ~694) | **No change** — `EVT` key routing works |
| `applyMapFocus()` (line ~593) | **No change** — `MODE` routing works |
| `setAudioPulse()` (line ~661) | **No change** — `MODE` routing works |

### 4.4 `tools/narration_ar.json`

Add 28 entries: `"uthmani_0"` through `"uthmani_27"`. Each must match the consonant skeleton of the corresponding `descAr`. Phase 2 (golden age) and Phase 4 (decline) must have fully diacritized mushakkal text for correct TTS.

### 4.5 `timeline_data.geojson`

Append features for each unique location: Söğüt, Bursa, Edirne, Ankara, Istanbul, Belgrade, Budapest, Sarajevo, Sofia, Cairo, Damascus, Jerusalem, Makkah, Madinah, Baghdad, Tabriz, Chaldiran, Nicopolis, Crimea, Algiers, Tunis, Tripoli, Athens, Vienna. Each `event_id` set to `"uthmani_<n>"`.

### 4.6 Audio Generation

```bash
python tools/gen_tts.py --eras uthmani
# 5 slots × 2 languages × 28 steps = 280 new MP3 clips
```

### 4.7 `style.css` — New Ambient Class

```css
/* style.css — add after existing .amb- classes */
.amb-dusk { background: radial-gradient(ellipse at center, rgba(140, 70, 20, .12) 0%, rgba(6, 10, 15, .88) 60%, transparent 100%); }
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
  - [ ] Update `index.html`: add `#home-uthmani` card to home screen
  - [ ] Add `svg#svg-uthmani` inline SVG (viewBox 1000×560) with Iznik-inspired decorations
  - [ ] `app.js`: `MAP_VB` (`uthmani: [1000, 560]`), `allSvgs`, click handler, back handler
  - [ ] Add `function goToUthmani()` to `app.js`
  - [ ] Add `.amb-dusk` CSS class to `style.css` (dark twilight gradient)
  - [ ] `data-ar`/`data-en` sweep
- [ ] **Phase 3 — Audio:**
  - [ ] `python tools/gen_tts.py --eras uthmani` (280 clips)
  - [ ] Verify `audio/*/uthmani_*_*.mp3` exist
  - [ ] Verify `audio/manifest.json` updated
- [ ] **Phase 4 — Verification:**
  - [ ] Open in browser, test all 28 steps
  - [ ] Test AR ↔ EN toggle
  - [ ] Test 5 voice slots
  - [ ] Test verse recitation per step
  - [ ] Test map focus positioning
  - [ ] Test mobile (360px, 720px)
  - [ ] Test back nav: Ottoman → home → imams → back
  - [ ] Test Phase 2 golden ambient (`amb-golden`)
  - [ ] Test Phase 4 dusk ambient (`amb-dusk`)
- [ ] **Phase 5 — Release:**
  - [ ] Update `CHANGELOG.md`
  - [ ] Bump `package.json` version
  - [ ] Update `AGENTS.md` / `CLAUDE.md`
  - [ ] Cache-bust: update `?v=` query on `data.js`, `app.js`, `style.css`, `data_imams.js` in `index.html`
  - [ ] Run `python tools/check_release.py` — exit 0 before committing
  - [ ] Push to `main`

---

## 6. Design Decisions

| # | Decision | Choice | Rationale |
|---|----------|--------|-----------|
| 1 | Era key | `uthmani` | Matches the Arabic nisba pattern (`umawi`, `abassi`, `uthmani`) |
| 2 | Step count | 28 | 8+8+6+6, reflecting the 625-year span across 4 distinct phases |
| 3 | Map dimensions | 1000×560 ✓ | Wider viewBox to show the Balkans-Anatolia-Levant axis in-frame with North African and European callouts |
| 4 | Home position | After Abbasid card, before Imams | Chronological order on the launcher |
| 5 | Map center | Istanbul (450, 280) | Unlike Umayyad (Damascus) or Abbasid (Baghdad), Ottoman power was centered on the straits |
| 6 | Phase 2 treatment | Use existing `.amb-golden` CSS class + 🌟 icon in `mdAr`/`mdEn` | The golden age of Suleiman matches the existing golden ambient pattern |
| 7 | Phase 4 treatment | New `.amb-dusk` CSS class + 🌆 icon in `mdAr`/`mdEn` | Twilight/ash gradient conveys the sunset of the caliphate |
| 8 | Source anchoring | الصلابي + أوزتونا for narrative analysis, محمد فريد بك for diplomatic history, إينالجيك for institutional analysis, ابن إياس for the Egyptian transition | Per the user's four-source methodology extended with Turkish and institutional historians |
| 9 | No splash section divider | Ottoman era accessible ONLY from home screen (like Umayyad and Abbasid) | Consistent with the existing pattern: post-Rashidun caliphates go on the home screen, not the Seerah splash |
| 10 | Decorative style | Iznik-inspired blue/turquoise corners + tulip motifs + tughra element | Reflects the Ottoman visual identity: Iznik tiles, tulip (lale), and calligraphic tughra are the most distinctive Ottoman art forms |
| 11 | Istanbul label | "إسطنبول" (not "القسطنطينية") for all steps except 7-8 (where the conquest is the focus) | The name change is historically significant — step 8 marks the transformation. Most steps post-conquest use "إسطنبول" |
| 12 | Inclusion of decline | Full 6-step treatment of the decline phase (1789–1924) | The user's sources (الصلابي specially) emphasize that the causes of decline are as important as the factors of rise |

---

## 7. Risks

- **Historical sensitivity**: The Ottoman narrative includes sensitive topics:
  - The sultanate's relationship with the Salafi/Najdi reform movement (مصادرة الدولة العثمانية مع دعوة الشيخ محمد بن عبد الوهاب)
  - The Armenian events of 1915 (controversial and must be handled with scholarly care)
  - The Arab Revolt and its portrayal
  - The abolition of the caliphate by Mustafa Kemal
  - Must maintain the balanced Ahl al-Sunnah perspective: acknowledge the state's Islamic legitimacy while also noting criticisms from the Salafi school regarding Sufi excesses and later secularisation
- **Step count**: 28 is tied with Abbasid as the largest era. The timeline strip handles arbitrary counts, but check mobile scroll carefully.
- **Map density**: 28 steps × mapFocus on ~15 unique coordinates. Istanbul covers 18+ steps; only Bursa, Edirne, Chaldiran, Budapest, Vienna, and Cairo shift the focus.
- **Source balance**: The user's sources span three different historiographic schools (Sunni traditionalist, Turkish nationalist, and Salafi critical). The data must present a *unified* Sunni perspective that integrates the valid insights from each without sectarian polemic.
- **Audio generation time**: ~280 clips × ~2s each = ~9-10 minutes for TTS generation. Run with `--eras uthmani` to avoid regenerating all eras.
- **Home screen overflow**: Adding a 5th card (the existing Seerah + Imams + Umayyads + Abbasids + Ottomans = 5 cards) may need layout adjustment on smaller screens.
- **Version update**: Cache-bust query strings in `index.html` must be updated.
- **Istanbul-centered map vs. Makkah/Madinah nodes**: The southern Hejaz nodes (Makkah ~180, 480; Madinah ~220, 450) are near the bottom edge of the 1000×560 viewBox. Steps focusing on the Haramayn (step 12) should use a zoom that includes these nodes comfortably. The `mapFocus{"scale": 0.9}` setting can pull the view back slightly.
- **Ottoman Turkish terms**: Some Ottoman terms (e.g., "الوقف الخيري", "قانوننامه", "طغراء") will appear in Arabic descriptions. These should be briefly glossed or contextually clear.
- **Tughra in SVG**: The decorative tughra element in the map is a simplified/stylized representation. It is NOT an actual sultan's tughra (which is a personal signature) — it is an ornamental motif to evoke the Ottoman calligraphic tradition. Ensure the design is clearlydecorative and not mistaken for a specific sultan's official seal.

---

## 8. Appendix: Visual Identity References

Based on the user's reference files, the Ottoman visual identity that should be reflected in the map design includes:

| Element | Description | Application in SVG |
|---------|-------------|-------------------|
| **Iznik tiles (بلاط إزنيك)** | Ceramic tiles with blue/turquoise/emerald glazes and tulip/carnation motifs | Corner decorative elements, border ornaments, water gradients |
| **Thuluth calligraphy (خط الثلث)** | The dominant calligraphic script for Quranic verses in mosques and domes | Era badge text, city labels (using Cairo font which complements Thuluth) |
| **Tughra (طغراء)** | Calligraphic royal monogram of the Sultan | Decorative corner element (bottom-right), simplified/stylized |
| **Tulip / Lale (لالة)** | The tulip is the quintessential Ottoman symbol, representing God's unity | Top-left corner decorative element |
| **Ottoman dome architecture** | Massive central domes surrounded by semi-domes, pencil minarets | Top-right corner decorative element (minaret silhouette) |
| **Arabesque / Rumî (الرقش/الرومي)** | Stylized geometric and floral patterns | Medallion designs in corners |

These decorative elements should be used subtly (opacity .3–.5) so they do not distract from the functional map data (city nodes, routes, callouts). They set the aesthetic tone while keeping the map readable at the 1000×560 scale.
