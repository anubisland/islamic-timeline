/* ============================================================
   Madani Era Timeline — Bilingual App Logic
   State + render + navigation + audio (Web Speech + Google TTS) + language
   ============================================================ */

(function () {
  'use strict';

  const DB = window.SEERAH_DB;
  if (!DB) {
    console.error('SEERAH_DB not loaded. Ensure data.js is included before app.js.');
    return;
  }

  // ── State ──────────────────────────────────────────────
  const STORAGE = { lang: 'sera.lang', ttsMode: 'sera.tts', auto: 'sera.auto', evt: 'sera.evt', voice: 'sera.voice', reciter: 'sera.reciter' };
  let MODE = 'home';   // 'home' | 'sera' | 'imams'
  let EVT = localStorage.getItem(STORAGE.evt) || 'hijra';
  let STEP = 0;
  let LANG = (localStorage.getItem(STORAGE.lang) || 'AR').toUpperCase();
  let currentAudio = null;
  let isPlaying = false;
  let playToken = 0;  // bumps each playVerse() so stale timeouts can't stop a newer play
  let TTS_MODE = localStorage.getItem(STORAGE.ttsMode) || 'narrate';
  let AUTO_NARRATE = localStorage.getItem(STORAGE.auto) === '1';

  // ── Narration voices ───────────────────────────────────
  // Four pre-generated neural voices (Microsoft, via tools/gen_tts.py). The
  // picker chooses a SLOT; the site loads audio/<slot>/<era>_<step>_<lang>.mp3.
  // labelAr/labelEn are the ACTUAL voice for each language (the AR clip and EN
  // clip use different voices), so the dropdown always names the voice playing.
  // Keep these slot ids + voices in sync with tools/gen_tts.py SLOTS.
  const VOICE_SLOTS = [
    { id: 'classic', labelAr: 'حامد',  labelEn: 'Guy',   descAr: 'فصيح',   descEn: 'Classic ♂' },
    { id: 'gentle',  labelAr: 'زارية', labelEn: 'Aria',  descAr: 'هادئ',   descEn: 'Gentle ♀' },
    { id: 'story',   labelAr: 'سلمى',  labelEn: 'Jenny', descAr: 'حكواتي', descEn: 'Storyteller ♀' },
    { id: 'warm',    labelAr: 'شاكر',  labelEn: 'Ryan',  descAr: 'ودود',   descEn: 'Warm ♂' }
  ];
  let VOICE = localStorage.getItem(STORAGE.voice) || 'classic';
  if (!VOICE_SLOTS.some((v) => v.id === VOICE)) VOICE = 'classic';
  const voiceSlot = (id) => VOICE_SLOTS.find((v) => v.id === (id || VOICE)) || VOICE_SLOTS[0];

  // ── Quran reciters (verse mode) ────────────────────────
  // Real recitation streamed from everyayah.com (per-ayah MP3, surah:ayah).
  // `dir` is the everyayah folder. The picker shows these in verse mode.
  const RECITERS = [
    { id: 'alafasy',   labelAr: 'العفاسي',  labelEn: 'Alafasy',     descAr: 'مشاري',   descEn: 'Mishary',     dir: 'Alafasy_128kbps' },
    { id: 'husary',    labelAr: 'الحصري',   labelEn: 'Al-Husary',   descAr: 'محمود',   descEn: 'Mahmoud',     dir: 'Husary_128kbps' },
    { id: 'abdulbasit',labelAr: 'عبد الباسط', labelEn: 'Abdul Basit', descAr: 'مرتل',   descEn: 'Murattal',    dir: 'Abdul_Basit_Murattal_192kbps' },
    { id: 'minshawy',  labelAr: 'المنشاوي', labelEn: 'Al-Minshawy', descAr: 'مرتل',    descEn: 'Murattal',    dir: 'Minshawy_Murattal_128kbps' },
    { id: 'sudais',    labelAr: 'السديس',   labelEn: 'As-Sudais',   descAr: 'عبد الرحمن', descEn: 'Abdurrahman', dir: 'Abdurrahmaan_As-Sudais_192kbps' }
  ];
  let RECITER = localStorage.getItem(STORAGE.reciter) || 'alafasy';
  if (!RECITERS.some((r) => r.id === RECITER)) RECITER = 'alafasy';
  const reciter = (id) => RECITERS.find((r) => r.id === (id || RECITER)) || RECITERS[0];

  // ── Map viewBoxes ──────────────────────────────────────
  const MAP_VB = { preb: [700, 560], hijra: [700, 560], badr: [700, 500], meccan: [700, 560], medinan: [700, 560], abubakr: [700, 560], umar: [700, 560], uthman: [700, 560], ali: [700, 560], hasan: [700, 560] };

  // ── Home screen (master launcher) ──────────────────────
  function showHome() {
    MODE = 'home';
    const home = $('home-screen');
    if (home) home.classList.remove('home-hidden');
    const splash = $('splash');
    if (splash) splash.classList.add('hidden');
    const hdr = $('site-header');
    if (hdr) hdr.classList.remove('visible');
    // Keep splash lang toggle visible on home screen
    const slb = $('splash-lang-toggle');
    if (slb) slb.classList.remove('hidden');
    document.body.style.background = '#060b0f';
    document.body.style.overflow = 'hidden';
    document.querySelector('meta[name=theme-color]').content = '#060b0f';
    // Hide the era-only diagnostic badge (the "green strip") on the launcher.
    const diag = $('focus-diag');
    if (diag) diag.style.display = 'none';
    stopAudio();
  }

  function goToHome() {
    STEP = 0;
    showHome();
  }

  function goToSera() {
    MODE = 'sera';
    const home = $('home-screen');
    if (home) home.classList.add('home-hidden');
    showSplash();
  }

  function goToImams() {
    // The Four Imams section isn't built yet. Do NOT hide the home screen —
    // doing so reveals the Seerah era view underneath (no #imams overlay exists),
    // which looks like a broken redirect. Stay on the launcher and notify.
    diag(LANG === 'AR'
      ? 'قسم الأئمة الأربعة قيد الإعداد — قريباً إن شاء الله'
      : 'The Four Imams section is coming soon, in shaa Allah', 'info');
    console.warn('Four Imams module not yet implemented');
  }

  // ── Splash navigation ──────────────────────────────────
  function hideSplash() {
    const home = $('home-screen');
    if (home) home.classList.add('home-hidden');
    const sp = $('splash');
    if (sp) sp.classList.add('hidden');
    const hdr = $('site-header');
    if (hdr) hdr.classList.add('visible');
    const slb = $('splash-lang-toggle');
    if (slb) slb.classList.add('hidden');
    // Era mode: body turns emerald, browser chrome matches
    document.body.style.background = '#063529';
    document.body.style.overflow = '';
    document.querySelector('meta[name=theme-color]').content = '#063529';
    // Footer is always in DOM; CSS hides it when splash is visible.
  }

  function showSplash() {
    MODE = 'sera';
    const home = $('home-screen');
    if (home) home.classList.add('home-hidden');
    const sp = $('splash');
    if (sp) sp.classList.remove('hidden');
    const hdr = $('site-header');
    if (hdr) hdr.classList.remove('visible');
    const slb = $('splash-lang-toggle');
    if (slb) slb.classList.remove('hidden');
    stopAudio();
    // Splash mode: body + browser chrome match the splash dark background
    document.body.style.background = '#060b0f';
    document.body.style.overflow = 'hidden';
    document.querySelector('meta[name=theme-color]').content = '#060b0f';
    // Hide diagnostic badge (shown only during era)
    const diag = $('focus-diag');
    if (diag) diag.style.display = 'none';
    // CSS hides footer automatically when splash is not hidden.
  }

  function goToSplash() {
    STEP = 0;
    showSplash();
  }

  // ── Helpers ─────────────────────────────────────────────
  const $ = (id) => document.getElementById(id);
  const arNum = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
  const t = (key) => (LANG === 'AR' ? key + 'Ar' : key + 'En');

  // ── Language toggle (HTML elements + SVG elements) ─────
  function applyLanguage() {
    const isAr = LANG === 'AR';
    document.documentElement.lang = isAr ? 'ar' : 'en';
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';

    // Update all data-ar / data-en elements (HTML + SVG)
    document.querySelectorAll('[data-ar][data-en]').forEach((el) => {
      el.textContent = isAr ? el.dataset.ar : el.dataset.en;
    });

    // Toggle the language button text (both header + splash)
    ['langToggle', 'splash-lang-toggle'].forEach((id) => {
      const btn = $(id);
      if (btn) {
        const span = btn.querySelector('span');
        if (span) span.textContent = isAr ? 'English' : 'العربية';
      }
    });

    localStorage.setItem(STORAGE.lang, LANG);
    if (typeof updateVoiceUI === 'function') updateVoiceUI();
    if (typeof updateModeUI === 'function') updateModeUI();
    buildTimeline();
    render();
  }

  // ── Build timeline strip ───────────────────────────────
  function buildTimeline() {
    const steps = DB[EVT].steps;
    const wrap = $('tl-nodes');
    if (!wrap) return;
    wrap.innerHTML = '';
    steps.forEach((s, i) => {
      const n = document.createElement('div');
      n.className = 'tl-nd';
      n.id = 'tn' + i;
      n.addEventListener('click', () => goTo(i));

      const dot = document.createElement('div');
      dot.className = 'tl-dot';
      dot.textContent = LANG === 'AR' ? arNum(i + 1) : (i + 1);

      const lbl = document.createElement('div');
      lbl.className = 'tl-lbl';
      // Full title (cleaned of em-dashes), with the "extra" half of "Title — Subtitle" as a separate line
      const rawTitle = s[t('title')] || '';
      const parts = rawTitle.split(/\s*[—–-]\s*/);
      const main = parts[0] || rawTitle;
      const sub = parts.slice(1).join(' — ');
      lbl.innerHTML = '<span class="tl-lbl-main">' + escHtml(main.slice(0, 22)) + '</span>'
                    + (sub ? '<span class="tl-lbl-sub">' + escHtml(sub.slice(0, 28)) + '</span>' : '');

      n.appendChild(dot);
      n.appendChild(lbl);
      wrap.appendChild(n);
    });
  }

  function escHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
  }

  // ── Switch event ───────────────────────────────────────
  function switchEv(key) {
    if (!DB[key]) return;
    EVT = key;
    localStorage.setItem(STORAGE.evt, key);
    STEP = 0;
    stopAudio();
    hideSplash();

    // Update era label in header
    const lbl = $('era-label');
    if (lbl) {
      lbl.textContent = LANG === 'AR' ? DB[key].labelAr : DB[key].labelEn;
    }

    // Toggle maps
    const allSvgs = ['svg-preb','svg-hijra','svg-badr','svg-meccan','svg-medinan',
                     'svg-abubakr','svg-umar','svg-uthman','svg-ali','svg-hasan'];
    allSvgs.forEach((id) => {
      const el = $(id);
      if (el) el.classList.toggle('hidden', id !== 'svg-' + key);
    });

    // Update map label — set BOTH data-ar and data-en so applyLanguage()
    // can pick the right one based on the current LANG, AND immediately
    // set textContent to the right language so it shows up now
    // (applyLanguage is not called on event switch, only on language toggle).
    const ml = $('map-label');
    if (ml) {
      const labelAr = DB[key].mapLabelAr;
      const labelEn = DB[key].mapLabelEn;
      ml.setAttribute('data-ar', labelAr);
      ml.setAttribute('data-en', labelEn);
      ml.textContent = LANG === 'AR' ? labelAr : labelEn;
    }

    buildTimeline();
    render();
    applyMapFocus(false);  // instant (no transition) on event switch
  }

  // ── Highlight the active step's focus point on the map ──
  // Strategy: the map stays fully visible at all times (no pan, no zoom).
  // We just position the focus pulse + 8-point star wake at the step's
  // (focus.x, focus.y) so the user can see which location is active.
  function applyMapFocus(animate = true) {
    const s = DB[EVT].steps[STEP];
    if (!s) return;
    const focus = s.mapFocus || { x: MAP_VB[EVT][0] / 2, y: MAP_VB[EVT][1] / 2, scale: 1.0 };

    // No transform on map-pan — the full map is always visible inside the frame
    const pan = $('pan-' + EVT);
    if (pan) {
      pan.style.transform = '';
      pan.style.transformOrigin = '';
    }

    // Show & position the focus layer (pulse + 8-point star wake) at (focus.x, focus.y)
    const focusLayer = $('focus-' + EVT);
    if (focusLayer) {
      focusLayer.style.display = '';
      const pulse = focusLayer.querySelector('.focus-pulse');
      const star = focusLayer.querySelector('.star-wake');
      if (pulse) {
        pulse.setAttribute('cx', focus.x);
        pulse.setAttribute('cy', focus.y);
        pulse.setAttribute('data-step', STEP);
        pulse.setAttribute('data-evt', EVT);
      }
      if (star) {
        const r = 22;
        const pts = [
          [focus.x, focus.y - r],
          [focus.x + r * Math.sin(Math.PI / 4), focus.y - r * Math.cos(Math.PI / 4)],
          [focus.x + r, focus.y],
          [focus.x + r * Math.sin(Math.PI / 4), focus.y + r * Math.cos(Math.PI / 4)],
          [focus.x, focus.y + r],
          [focus.x - r * Math.sin(Math.PI / 4), focus.y + r * Math.cos(Math.PI / 4)],
          [focus.x - r, focus.y],
          [focus.x - r * Math.sin(Math.PI / 4), focus.y - r * Math.cos(Math.PI / 4)]
        ].map(p => p.join(',')).join(' ');
        star.setAttribute('points', pts);
        star.classList.add('on');
      }
    }

    // Live diagnostic — only shown in a true era view (BOTH the home launcher
    // AND the splash are hidden). The home screen also hides the splash, so a
    // splash-only check would wrongly show this badge on the homepage (the
    // "green strip" regression — see docs/BUGS.md §I).
    const d = $('focus-diag');
    const sp = $('splash');
    const hs = $('home-screen');
    if (d) {
      const inEra = (!sp || sp.classList.contains('hidden')) &&
                    (!hs || hs.classList.contains('home-hidden'));
      d.style.display = inEra ? 'block' : 'none';
      d.textContent = '🎯 ' + (LANG === 'AR'
        ? 'الخطوة ' + arNum(STEP + 1) + ' — ' + (s.titleAr || '')
        : 'Step ' + (STEP + 1) + ' — ' + (s.titleEn || ''))
        + '  ·  (' + focus.x + ', ' + focus.y + ')';
    }
    console.log('[focus]', EVT, 'step=' + STEP, 'pos=(' + focus.x + ',' + focus.y + ')', s[t('title')]);
  }

  // ── Pulse on/off helpers (linked to audio state) ────────
  function setAudioPulse(on) {
    const focusLayer = $('focus-' + EVT);
    if (!focusLayer) return;
    const pulse = focusLayer.querySelector('.focus-pulse');
    if (pulse) pulse.classList.toggle('speaking', !!on);
  }

  // ── Navigation ──────────────────────────────────────────
  function goTo(i) {
    const l = DB[EVT].steps.length;
    if (i < 0 || i >= l) return;
    STEP = i;
    stopAudio();
    render();
    applyMapFocus(true);
    if (AUTO_NARRATE) {
      // Wait for the map pan/zoom transition (~950ms) to start, then narrate
      setTimeout(() => { if (AUTO_NARRATE) playVerse(); }, 850);
    }
  }

  function step(d) { goTo(STEP + d); }

  // ── Audio: pre-recorded only ───────────────────────────
  // 'narrate' -> pre-generated neural MP3 under audio/. 'verse' -> real reciter
  // recitation from everyayah.com. No live TTS (Web Speech / translate_tts).

  // ── Narration MP3 url for the current (voice, era, step, language) ──
  function narrationURL(slot) {
    const lang = LANG === 'AR' ? 'ar' : 'en';
    return 'audio/' + (slot || VOICE) + '/' + EVT + '_' + STEP + '_' + lang + '.mp3';
  }

  // ── Verse recitation URLs (real reciter audio from everyayah.com) ──
  // The data uses two ref styles in `ayahRefEn`:
  //   A) "Surah Yunus (10), verse 1"  /  "… (81), verses 8-9"
  //   B) "Surah Al-Alaq — 96:1"       /  "… — 8:30-31"
  // Returns one zero-padded surah:ayah MP3 url per ayah in the range, or [] if
  // the ref isn't a parseable Quran citation (e.g. a hadith/athar) → no audio.
  function verseAudioURLs(step, reciterId) {
    const ref = (step && step.ayahRefEn) || '';
    let surah, start, end;
    const mA = ref.match(/\((\d+)\)\s*,\s*verses?\s+(\d+)(?:\s*[-–]\s*(\d+))?/i);
    const mB = ref.match(/\b(\d+):(\d+)(?:\s*[-–]\s*(\d+))?/);
    if (mA) { surah = +mA[1]; start = +mA[2]; end = mA[3] ? +mA[3] : start; }
    else if (mB) { surah = +mB[1]; start = +mB[2]; end = mB[3] ? +mB[3] : start; }
    else return [];
    if (surah < 1 || surah > 114) return [];   // guard against non-Quran numbers
    const dir = reciter(reciterId).dir;
    const pad = (n) => String(n).padStart(3, '0');
    const urls = [];
    for (let a = start; a <= end && a - start < 20; a++) {
      urls.push('https://everyayah.com/data/' + dir + '/' + pad(surah) + pad(a) + '.mp3');
    }
    return urls;
  }

  // ── Diagnostic banner ───────────────────────────────────
  let diagTimer = null;
  function diag(msg, kind, sticky) {
    const el = $('diag');
    if (!el) return;
    el.className = 'diag diag-' + (kind || 'info');
    el.textContent = msg;
    el.style.display = msg ? 'block' : 'none';
    if (diagTimer) { clearTimeout(diagTimer); diagTimer = null; }
    if (msg && !sticky) {
      diagTimer = setTimeout(() => { el.style.display = 'none'; }, 5500);
    }
  }

  // Audio is PRE-RECORDED ONLY: pre-generated neural narration MP3s, and real
  // reciter recitation for verses. The old live Web Speech / Google translate_tts
  // engines were removed — they sounded robotic in both AR and EN.
  function playVerse() {
    stopAudio();
    const myToken = ++playToken;

    const s = DB[EVT].steps[STEP];
    const isNarrate = TTS_MODE === 'narrate';

    const pb = $('btn-play');
    pb.classList.add('on');
    pb.textContent = '⏹';                       // stop affordance while audio plays
    pb.title = LANG === 'AR' ? 'إيقاف' : 'Stop';
    pb.setAttribute('aria-label', LANG === 'AR' ? 'إيقاف' : 'Stop');
    isPlaying = true;
    setAudioPulse(true);

    function finishPlayback(reason) {
      isPlaying = false;
      setAudioPulse(false);
      resetPlayBtn();
      if (reason) console.log('[audio] finish:', reason);
    }

    function unavailable(reason) {
      console.log('[audio] unavailable:', reason);
      diag(LANG === 'AR' ? 'الصوت غير متاح لهذه الخطوة' : 'Audio not available for this step', 'warn');
      finishPlayback(reason);
    }

    // Play a list of MP3s back-to-back (one file per ayah; a single-element list
    // for narration). Guarded by isPlaying + the play token so Stop / navigation /
    // a newer play cancels it cleanly (stopAudio sets src='' which fires onerror —
    // we must NOT advance). The -8% storytelling pace is baked into narration files.
    function playSequence(urls, onDone, onFail) {
      let i = 0, anyOk = false;
      function next() {
        if (!isPlaying || playToken !== myToken) return;  // stopped or superseded
        if (i >= urls.length) { onDone && onDone(); return; }
        const url = urls[i++];
        try {
          const a = new Audio(url);
          currentAudio = a;
          a.volume = 1.0;
          a.onended = () => { if (!isPlaying || playToken !== myToken) return; anyOk = true; currentAudio = null; next(); };
          a.onerror = () => {
            if (!isPlaying || playToken !== myToken) return;
            currentAudio = null;
            if (anyOk) next(); else onFail && onFail();   // skip a bad ayah mid-run, but fail fast on the first
          };
          const p = a.play();
          if (p && p.catch) p.catch(() => {
            if (!isPlaying || playToken !== myToken) return;
            currentAudio = null;
            if (anyOk) next(); else onFail && onFail();
          });
        } catch (e) { onFail && onFail(); }
      }
      next();
    }

    if (isNarrate) {
      // Pre-generated neural narration MP3 — the only narration source (1 file).
      playSequence([narrationURL()],
        () => { diag(''); finishPlayback('mp3 ok'); },
        () => unavailable('no narration MP3: ' + narrationURL())
      );
    } else {
      // Verse mode: real reciter recitation (everyayah.com), ayah by ayah.
      const urls = verseAudioURLs(s, RECITER);
      if (urls.length) {
        playSequence(urls,
          () => { diag(''); finishPlayback('recitation ok'); },
          () => unavailable('recitation unreachable')
        );
      } else {
        unavailable('no Quran citation to recite');  // e.g. a hadith/athar step
      }
    }
    // Stuck-state backstop. 180s safely exceeds any single clip; the token guard
    // prevents an old timer from stopping a newer playback.
    setTimeout(() => { if (isPlaying && playToken === myToken) finishPlayback('timeout'); }, 180000);
  }

  function stopAudio() {
    if (currentAudio) {
      try {
        currentAudio.pause();
        currentAudio.src = '';
      } catch (e) { /* ignore */ }
      currentAudio = null;
    }
    isPlaying = false;
    setAudioPulse(false);
    resetPlayBtn();
  }

  function resetPlayBtn() {
    const btn = $('btn-play');
    if (!btn) return;
    btn.classList.remove('on');
    btn.textContent = '▶';
    btn.title = LANG === 'AR' ? 'تشغيل' : 'Play';
    btn.setAttribute('aria-label', LANG === 'AR' ? 'تشغيل' : 'Play');
  }

  function togglePlay() {
    if (isPlaying) stopAudio();
    else playVerse();
  }

  // ── Master render ───────────────────────────────────────
  function render() {
    const ev = DB[EVT];
    const s = ev.steps[STEP];
    const tot = ev.steps.length;
    const k = t(''); // 'Ar' or 'En'

    // Ayah + ref
    $('ayah-text').textContent = s.ayah;
    $('ayah-ref').textContent = s.ayahRef;
    // English version (shown when LANG === 'EN')
    const ayahEn = $('ayah-text-en');
    if (ayahEn) ayahEn.textContent = s.ayahEn;
    const ayahRefEn = $('ayah-ref-en');
    if (ayahRefEn) ayahRefEn.textContent = s.ayahRefEn;

    // Stage badge
    const stageText = LANG === 'AR'
      ? 'المرحلة ' + arNum(STEP + 1) + ' من ' + arNum(tot)
      : 'Step ' + (STEP + 1) + ' of ' + tot;
    $('stage-badge').textContent = stageText;

    // Date
    $('ev-date').textContent = s[t('date')];

    // Title + description
    const te = $('ev-title');
    te.textContent = s[t('title')];
    te.style.animation = 'none';
    void te.offsetWidth;
    te.style.animation = '';

    const de = $('ev-desc');
    de.textContent = s[t('desc')];
    de.style.animation = 'none';
    void de.offsetWidth;
    de.style.animation = '';

    // Characters
    const chars = s[t('chars')];
    $('chars-grid').innerHTML = (chars || []).map((c) => `
      <div class="char-row">
        <div class="char-ic">${c.i}</div>
        <div>
          <div class="char-nm">${c.n}</div>
          <div class="char-rl">${c.r}</div>
        </div>
      </div>
    `).join('');

    // Lesson
    $('lesson-text').textContent = s[t('lesson')];

    // Sources
    $('src-list').innerHTML = (s.srcs || []).map((r) =>
      `<span class="src-chip">📖 ${r}</span>`
    ).join('');

    // Map badges
    $('badge-time').textContent = s[t('time')];
    $('badge-dist').textContent = s[t('dist')];

    // Map card
    $('mc-title').textContent = s[t('mt')];
    $('mc-desc').textContent = s[t('md')];
    $('map-card').classList.add('up');

    // Map ambient
    $('map-amb').className = 'map-amb amb-' + (s.amb || 'day');

    // Hijra: route progress + node states
    if (EVT === 'hijra') {
      const rp = $('h-route-anim');
      if (rp && ev.offsets) {
        rp.style.strokeDashoffset = ev.offsets[STEP] != null ? ev.offsets[STEP] : 0;
      }
      for (let i = 0; i <= 5; i++) {
        const nd = $('hnode-' + i);
        if (!nd) continue;
        nd.classList.remove('act', 'vis');
        if (i === STEP) nd.classList.add('act');
        else if (i < STEP) nd.classList.add('vis');
      }
    }

    // Badr: tactical state
    if (EVT === 'badr') {
      const blocked = STEP >= 1;
      const b1 = $('bblock-1'); if (b1) b1.classList.toggle('hidden', !blocked);
      const b2 = $('bblock-2'); if (b2) b2.classList.toggle('hidden', !blocked);
      const ci = $('b-cistern'); if (ci) ci.classList.toggle('hidden', STEP < 1);
      const cl = $('b-clash');   if (cl) cl.classList.toggle('hidden', STEP < 2);

      const thick = STEP === 2 ? '8' : '4.5';
      const mm = $('b-march-m'); if (mm) mm.setAttribute('stroke-width', thick);
      const mq = $('b-march-q'); if (mq) mq.setAttribute('stroke-width', thick);

      const n0 = $('bnode-0');
      const n2 = $('bnode-2');
      if (n0) n0.classList.remove('act');
      if (n2) n2.classList.remove('act');
      if (STEP === 0 && n0) n0.classList.add('act');
      if (STEP >= 1 && n2) n2.classList.add('act');
    }

    // Timeline strip
    const pct = tot > 1 ? (STEP / (tot - 1)) * 100 : 100;
    $('tl-fill').style.width = pct + '%';
    $('hdr-prog').style.width = pct + '%';
    for (let i = 0; i < tot; i++) {
      const n = $('tn' + i);
      if (!n) continue;
      n.classList.remove('now', 'done');
      if (i === STEP) n.classList.add('now');
      else if (i < STEP) n.classList.add('done');
    }

    // Footer strip: current step title + counter ("1 / 6")
    const footerTitle = s[t('title')];
    $('tl-name').textContent = footerTitle;
    $('tl-counter').textContent = LANG === 'AR'
      ? arNum(STEP + 1) + ' / ' + arNum(tot)
      : (STEP + 1) + ' / ' + tot;

    // Nav buttons
    $('btn-prev').disabled = STEP === 0;
    $('btn-next').disabled = STEP === tot - 1;

    // Map focus pan/zoom (slight delay so layout has settled)
    requestAnimationFrame(() => applyMapFocus(true));
  }

  // ── Audio-source picker UI (context-aware) ─────────────
  // One control, two registries: in 'narrate' mode it picks a narration VOICE;
  // in 'verse' mode it picks a Quran RECITER. The menu, label, and selection
  // all switch with TTS_MODE.
  function pickerIsVerse() { return TTS_MODE === 'verse'; }
  function pickerList() { return pickerIsVerse() ? RECITERS : VOICE_SLOTS; }
  function pickerCurrentId() { return pickerIsVerse() ? RECITER : VOICE; }
  function pickerCurrentItem() { return pickerIsVerse() ? reciter() : voiceSlot(); }

  // Built with DOM methods (not innerHTML) — content is trusted constants,
  // but createElement keeps it XSS-proof by construction.
  function buildVoiceMenu() {
    const menu = $('voice-menu');
    if (!menu) return;
    while (menu.firstChild) menu.removeChild(menu.firstChild);
    const curId = pickerCurrentId();
    pickerList().forEach((s) => {
      const on = s.id === curId;
      const opt = document.createElement('div');
      opt.className = 'voice-opt' + (on ? ' active' : '');
      opt.setAttribute('role', 'menuitemradio');
      opt.setAttribute('tabindex', '0');
      opt.setAttribute('aria-checked', String(on));
      opt.dataset.voice = s.id;

      const check = document.createElement('span');
      check.className = 'vo-check';
      check.textContent = '✓';
      const name = document.createElement('span');
      name.className = 'vo-name';
      name.textContent = LANG === 'AR' ? s.labelAr : s.labelEn;
      const desc = document.createElement('span');
      desc.className = 'vo-desc';
      desc.textContent = LANG === 'AR' ? s.descAr : s.descEn;

      opt.appendChild(check);
      opt.appendChild(name);
      opt.appendChild(desc);
      opt.addEventListener('click', () => setVoice(s.id));
      opt.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();   // setVoice closes the menu; stop the key reaching the global Space→togglePlay handler
          setVoice(s.id);
        }
      });
      menu.appendChild(opt);
    });
  }

  function updateVoiceUI() {
    const item = pickerCurrentItem();
    const now = $('voice-now');
    if (now) now.textContent = LANG === 'AR' ? item.labelAr : item.labelEn;
    const btn = $('btn-voice');
    if (btn) {
      const title = pickerIsVerse()
        ? (LANG === 'AR' ? 'القارئ' : 'Reciter')
        : (LANG === 'AR' ? 'صوت الراوي' : 'Narrator voice');
      btn.title = title;
      btn.setAttribute('aria-label', title);
    }
    buildVoiceMenu();
  }

  // Mode-toggle label. The button's span has NO data-ar/data-en (those would be
  // clobbered by applyLanguage) — this function is the single source of truth
  // for its bilingual, state-dependent text. Called on init, click, and lang toggle.
  function updateModeUI() {
    const btn = $('btn-mode');
    if (!btn) return;
    btn.classList.toggle('narrate', TTS_MODE === 'narrate');
    const span = btn.querySelector('span');
    if (span) {
      span.textContent = TTS_MODE === 'narrate'
        ? (LANG === 'AR' ? 'سرد' : 'Narr.')
        : (LANG === 'AR' ? 'آية' : 'Verse');
    }
    // The picker switches between narration voices and reciters with the mode.
    if (typeof updateVoiceUI === 'function') updateVoiceUI();
  }

  function openVoiceMenu(open) {
    const menu = $('voice-menu');
    const btn = $('btn-voice');
    if (!menu || !btn) return;
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function setVoice(id) {
    if (!pickerList().some((v) => v.id === id)) return;
    if (pickerIsVerse()) {
      RECITER = id;
      localStorage.setItem(STORAGE.reciter, id);
    } else {
      VOICE = id;
      localStorage.setItem(STORAGE.voice, id);
    }
    updateVoiceUI();
    openVoiceMenu(false);
    // If audio is playing, restart it immediately with the new selection.
    if (isPlaying) playVerse();
  }

  // ── Wire up DOM ─────────────────────────────────────────
  function init() {
    // Home screen: click cards
    const homeSera = $('home-sera');
    if (homeSera) homeSera.addEventListener('click', goToSera);
    const homeImams = $('home-imams');
    if (homeImams) homeImams.addEventListener('click', goToImams);

    // Splash: click era cards
    document.querySelectorAll('.era-card, .caliph-card').forEach((el) => {
      el.addEventListener('click', () => switchEv(el.dataset.ev));
    });
    // Back to splash
    const backBtn = $('btn-splash');
    if (backBtn) backBtn.addEventListener('click', goToSplash);
    // Splash back to home
    const splashBack = $('splash-back');
    if (splashBack) splashBack.addEventListener('click', goToHome);

    // Language toggle (header + splash)
    const langToggle = (btn) => {
      if (!btn) return;
      btn.addEventListener('click', () => {
        LANG = LANG === 'AR' ? 'EN' : 'AR';
        applyLanguage();
        // Sync the other toggle button's text too
        const other = btn.id === 'langToggle' ? $('splash-lang-toggle') : $('langToggle');
        if (other) {
          const span = other.querySelector('span');
          if (span) span.textContent = LANG === 'AR' ? 'English' : 'العربية';
        }
      });
    };
    langToggle($('langToggle'));
    langToggle($('splash-lang-toggle'));

    // Navigation
    $('btn-prev').addEventListener('click', () => step(-1));
    $('btn-next').addEventListener('click', () => step(1));
    $('btn-play').addEventListener('click', togglePlay);

    // TTS mode toggle: verse <-> narration
    const modeBtn = $('btn-mode');
    if (modeBtn) {
      updateModeUI();
      modeBtn.addEventListener('click', () => {
        TTS_MODE = TTS_MODE === 'verse' ? 'narrate' : 'verse';
        localStorage.setItem(STORAGE.ttsMode, TTS_MODE);
        updateModeUI();
      });
    }

    // Auto-narrate on step change
    const autoBtn = $('btn-auto');
    if (autoBtn) {
      const refresh = () => autoBtn.classList.toggle('on', AUTO_NARRATE);
      refresh();
      autoBtn.addEventListener('click', () => {
        AUTO_NARRATE = !AUTO_NARRATE;
        localStorage.setItem(STORAGE.auto, AUTO_NARRATE ? '1' : '0');
        refresh();
      });
    }

    // Narrator voice picker
    const voiceBtn = $('btn-voice');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const menu = $('voice-menu');
        openVoiceMenu(menu && menu.hidden);
      });
      // Close on outside-click or Escape
      document.addEventListener('click', (e) => {
        const menu = $('voice-menu');
        if (menu && !menu.hidden && !e.target.closest('.voice-pick')) openVoiceMenu(false);
      });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') openVoiceMenu(false); });
    }
    updateVoiceUI();

    // Map node clicks
    for (let i = 0; i <= 5; i++) {
      const n = $('hnode-' + i);
      if (n) n.addEventListener('click', () => goTo(i));
    }
    const bn0 = $('bnode-0');
    const bn2 = $('bnode-2');
    if (bn0) bn0.addEventListener('click', () => goTo(0));
    if (bn2) bn2.addEventListener('click', () => goTo(2));

    // Map zoom controls — change the SVG viewBox to zoom in/out of the
    // currently visible map. The default viewBox is "0 0 700 560".
    // Smaller viewBox → zoom in (content grows on screen).
    // Larger viewBox  → zoom out (content shrinks to fit more of the map).
    const MAP_BASE = { w: 700, h: 560 };
    const ZOOM_LEVELS = [0.5, 0.75, 1.0, 1.5, 2.0];
    let zoomIdx = 2; // 1.0x
    const zRst = $('z-rst');
    const zIn  = $('z-in');
    const zOut = $('z-out');
    function applyZoom() {
      const z = ZOOM_LEVELS[zoomIdx];
      const w = MAP_BASE.w / z;
      const h = MAP_BASE.h / z;
      const x = (MAP_BASE.w - w) / 2;
      const y = (MAP_BASE.h - h) / 2;
      const vb = x + ' ' + y + ' ' + w + ' ' + h;
      ['svg-preb','svg-hijra','svg-badr','svg-meccan','svg-medinan',
       'svg-abubakr','svg-umar','svg-uthman','svg-ali','svg-hasan'].forEach((id) => {
        const svg = $(id);
        if (svg) svg.setAttribute('viewBox', vb);
      });
      if (zRst) zRst.textContent = Math.round(z * 100) + '%';
    }
    if (zIn)  zIn.addEventListener('click',  () => { if (zoomIdx < ZOOM_LEVELS.length - 1) { zoomIdx++; applyZoom(); } });
    if (zOut) zOut.addEventListener('click', () => { if (zoomIdx > 0) { zoomIdx--; applyZoom(); } });
    if (zRst) zRst.addEventListener('click', () => { zoomIdx = 2; applyZoom(); });
    applyZoom();

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
      // Don't fire global shortcuts while the voice/reciter menu is open — its
      // own options (<div tabindex=0>) handle Enter/Space, and arrows shouldn't
      // navigate steps underneath the popup.
      const vm = $('voice-menu');
      if (vm && !vm.hidden) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); step(LANG === 'AR' ? -1 : 1); }
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); step(LANG === 'AR' ? 1 : -1); }
      if (e.key === ' ') { e.preventDefault(); togglePlay(); }
      if (e.key === 'l' || e.key === 'L') { e.preventDefault(); LANG = LANG === 'AR' ? 'EN' : 'AR'; applyLanguage(); }
    });

    // Start with home screen (master launcher)
    buildTimeline();
    showHome();
    applyLanguage();

    // Diag banner: click to dismiss
    const diagEl = $('diag');
    if (diagEl) {
      diagEl.addEventListener('click', () => {
        diagEl.style.display = 'none';
        if (diagTimer) { clearTimeout(diagTimer); diagTimer = null; }
      });
    }
  }

  // Wait for DOM + data.js
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
