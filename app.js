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
  const IDB = window.FOUR_IMAMS_DB;  // may be undefined (graceful fallback)

  // ── State ──────────────────────────────────────────────
  const STORAGE = { lang: 'sera.lang', ttsMode: 'sera.tts', auto: 'sera.auto', evt: 'sera.evt', voice: 'sera.voice', reciter: 'sera.reciter', imam: 'sera.imam' };
  let MODE = 'home';   // 'home' | 'sera' | 'imams'
  let EVT = localStorage.getItem(STORAGE.evt) || 'hijra';
  if (!DB[EVT]) EVT = 'hijra'; // restored key may not exist in a stale-cached data.js (Pages max-age skew)
  let IMAM = localStorage.getItem(STORAGE.imam) || 'abu-hanifa';
  if (IDB && !IDB[IMAM]) IMAM = 'abu-hanifa';
  let STEP = 0;
  let PHASE_RANGE = null; // { start, end } for Ottoman phase, null otherwise
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
    { id: 'warm',    labelAr: 'عبدالله', labelEn: 'Ryan',  descAr: 'ودود',   descEn: 'Warm ♂' },
    { id: 'shakir',  labelAr: 'شاكر',  labelEn: 'Brian', descAr: 'مصري',   descEn: 'Egyptian ♂' }
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
  const MAP_VB = { preb: [700, 560], hijra: [700, 560], badr: [700, 500], meccan: [700, 560], medinan: [700, 560], abubakr: [700, 560], umar: [700, 560], uthman: [700, 560], ali: [700, 560], hasan: [700, 560], umawi: [1000, 560], abassi1: [1000, 560], abassi2: [1000, 560], abassi3: [1000, 560], abassi4: [1000, 560], uthmani: [1000, 560], imam: [700, 560] };

  // ── Map zoom state ─────────────────────────────────────
  // ONE writer owns the SVG viewBox: writeMapViewBox(). It composes the
  // step's intended framing (mapFocus.scale) with the user's manual zoom
  // (ZOOM_LEVELS[zoomIdx]) over the ACTIVE era's own base size (MAP_VB —
  // umawi/abassi are 1000×560, not 700×560). Manual zoom resets to 1.0×
  // on every step/era change so the % readout can never go stale.
  const ZOOM_LEVELS = [0.5, 0.75, 1.0, 1.5, 2.0];
  let zoomIdx = 2; // 1.0x

  function writeMapViewBox() {
    const inImam = MODE === 'imams';
    const ev = inImam ? (IDB && IDB[IMAM]) : DB[EVT];
    if (!ev) return;
    const s = ev.steps[STEP];
    const vb = MAP_VB[inImam ? 'imam' : EVT] || [700, 560];
    const focus = (s && s.mapFocus) || { x: vb[0] / 2, y: vb[1] / 2 };
    const scale = (focus.scale || 1.0) * ZOOM_LEVELS[zoomIdx];
    const svgEl = $(inImam ? 'svg-imam' : 'svg-' + EVT);
    if (!svgEl) return;
    const w = vb[0] / scale;
    const h = vb[1] / scale;
    // Zoomed in (frame smaller than map): center on the focus point, clamped
    // to the map on ALL four edges. Zoomed out (frame larger): center the map.
    const vx = w >= vb[0] ? (vb[0] - w) / 2 : Math.min(Math.max(0, focus.x - w / 2), vb[0] - w);
    const vy = h >= vb[1] ? (vb[1] - h) / 2 : Math.min(Math.max(0, focus.y - h / 2), vb[1] - h);
    svgEl.setAttribute('viewBox', vx + ' ' + vy + ' ' + w + ' ' + h);
    const zRst = $('z-rst');
    if (zRst) zRst.textContent = Math.round(ZOOM_LEVELS[zoomIdx] * 100) + '%';
  }

  // ── Home screen (master launcher) ──────────────────────
  // switchEv() rewrites the <title> (text + data-ar/data-en) per era; capture
  // the document defaults ONCE so returning home can restore them — otherwise
  // the tab keeps the last era's title for the whole session (and applyLanguage
  // keeps re-applying it from the clobbered data attributes).
  const TITLE_EL = document.querySelector('title');
  const TITLE_DEFAULT = TITLE_EL
    ? { ar: TITLE_EL.getAttribute('data-ar'), en: TITLE_EL.getAttribute('data-en') }
    : null;

  function showHome() {
    MODE = 'home';
    if (TITLE_EL && TITLE_DEFAULT) {
      TITLE_EL.setAttribute('data-ar', TITLE_DEFAULT.ar);
      TITLE_EL.setAttribute('data-en', TITLE_DEFAULT.en);
      TITLE_EL.textContent = LANG === 'AR' ? TITLE_DEFAULT.ar : TITLE_DEFAULT.en;
    }
    const home = $('home-screen');
    if (home) home.classList.remove('home-hidden');
    const splash = $('splash');
    if (splash) splash.classList.add('hidden');
    const imamScr = $('imam-screen');
    if (imamScr) imamScr.classList.add('hidden');
    const ottomanScr = $('ottoman-screen');
    if (ottomanScr) ottomanScr.classList.add('hidden');
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
    const imamScr = $('imam-screen');
    if (imamScr) imamScr.classList.add('hidden');
    showSplash();
  }

  function goToImams() {
    if (!IDB) {
      console.warn('FOUR_IMAMS_DB not loaded.');
      return;
    }
    MODE = 'imams';
    const home = $('home-screen');
    if (home) home.classList.add('home-hidden');
    showImamScreen();
  }

  // Dedicated home-screen entry straight into the Umayyad era view (it has its
  // own launcher card; it is NOT listed in the Seerah splash). switchEv() does
  // the heavy lifting — hideSplash() also hides the home screen, and it toggles
  // svg-umawi / labels / render. Back from this era returns home (see btn-splash
  // handler), since EVT==='umawi' is only reachable from here.
  function goToUmawi() {
    if (!DB.umawi) {
      console.warn('SEERAH_DB.umawi not loaded.');
      return;
    }
    MODE = 'sera';
    switchEv('umawi');
  }

  ['abassi1','abassi2','abassi3','abassi4'].forEach(function(key) {
    var fnName = 'goTo' + key.charAt(0).toUpperCase() + key.slice(1);
    window[fnName] = function() {
      if (!DB[key]) { console.warn('SEERAH_DB.' + key + ' not loaded.'); return; }
      MODE = 'sera';
      switchEv(key);
    };
  });

  function goToUthmani() {
    if (!DB.uthmani) {
      console.warn('SEERAH_DB.uthmani not loaded.');
      return;
    }
    showOttomanScreen();
  }

  // ── Splash navigation ──────────────────────────────────
  function hideSplash() {
    const home = $('home-screen');
    if (home) home.classList.add('home-hidden');
    const sp = $('splash');
    if (sp) sp.classList.add('hidden');
    const imamScr = $('imam-screen');
    if (imamScr) imamScr.classList.add('hidden');
    const ottomanScr = $('ottoman-screen');
    if (ottomanScr) ottomanScr.classList.add('hidden');
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
    const ottomanScr = $('ottoman-screen');
    if (ottomanScr) ottomanScr.classList.add('hidden');
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

  // ── Imam screen ──────────────────────────────────────────
  function showImamScreen() {
    MODE = 'imams';
    const home = $('home-screen');
    if (home) home.classList.add('home-hidden');
    const ottomanScr = $('ottoman-screen');
    if (ottomanScr) ottomanScr.classList.add('hidden');
    const imamScr = $('imam-screen');
    if (imamScr) imamScr.classList.remove('hidden');
    const hdr = $('site-header');
    if (hdr) hdr.classList.remove('visible');
    const slb = $('splash-lang-toggle');
    if (slb) slb.classList.remove('hidden');
    stopAudio();
    document.body.style.background = '#060b0f';
    document.body.style.overflow = 'hidden';
    document.querySelector('meta[name=theme-color]').content = '#060b0f';
    const diag = $('focus-diag');
    if (diag) diag.style.display = 'none';
  }

  function hideImamScreen() {
    const imamScr = $('imam-screen');
    if (imamScr) imamScr.classList.add('hidden');
  }

  function goToImamSplash() {
    STEP = 0;
    showImamScreen();
  }

  // ── Ottoman screen (phase selection) ──────────────────────
  function showOttomanScreen() {
    MODE = 'home';
    PHASE_RANGE = null;
    const home = $('home-screen');
    if (home) home.classList.add('home-hidden');
    const imamScr = $('imam-screen');
    if (imamScr) imamScr.classList.add('hidden');
    const ottomanScr = $('ottoman-screen');
    if (ottomanScr) ottomanScr.classList.remove('hidden');
    const hdr = $('site-header');
    if (hdr) hdr.classList.remove('visible');
    const slb = $('splash-lang-toggle');
    if (slb) slb.classList.remove('hidden');
    stopAudio();
    document.body.style.background = '#060b0f';
    document.body.style.overflow = 'hidden';
    document.querySelector('meta[name=theme-color]').content = '#060b0f';
    const diag = $('focus-diag');
    if (diag) diag.style.display = 'none';
  }

  function hideOttomanScreen() {
    const ottomanScr = $('ottoman-screen');
    if (ottomanScr) ottomanScr.classList.add('hidden');
  }

  function selectImam(key) {
    if (!IDB || !IDB[key]) return;
    MODE = 'imams';
    IMAM = key;
    localStorage.setItem(STORAGE.imam, key);
    STEP = 0;
    stopAudio();
    hideImamScreen();
    const hdr = $('site-header');
    if (hdr) hdr.classList.add('visible');
    const slb = $('splash-lang-toggle');
    if (slb) slb.classList.add('hidden');
    document.body.style.background = '#063529';
    document.body.style.overflow = '';
    document.querySelector('meta[name=theme-color]').content = '#063529';

    const lbl = $('era-label');
    if (lbl) lbl.textContent = LANG === 'AR' ? IDB[key].labelAr : IDB[key].labelEn;

    // Header brand title reflects the active module (imam vs Seerah)
    setBrandTitle('الخط الزمني للأئمة الأربعة', 'Four Imams Timeline');

    // Set map label to imam name
    const ml = $('map-label');
    if (ml) {
      const shortAr = IDB[key].shortLabelAr || IDB[key].labelAr;
      const shortEn = IDB[key].shortLabelEn || IDB[key].labelEn;
      ml.setAttribute('data-ar', '🕌 ' + shortAr);
      ml.setAttribute('data-en', '🕌 ' + shortEn);
      ml.textContent = LANG === 'AR' ? '🕌 ' + shortAr : '🕌 ' + shortEn;
    }

    // Hide all Sera SVGs + the old decorative card, show the shared imam SVG map
    ['svg-preb','svg-hijra','svg-badr','svg-meccan','svg-medinan',
     'svg-abubakr','svg-umar','svg-uthman','svg-ali','svg-hasan'].forEach((id) => {
      const el = $(id);
      if (el) el.classList.add('hidden');
    });
    const imamSvg = $('svg-imam');
    if (imamSvg) imamSvg.classList.remove('hidden');
    const imamMap = $('imam-map');
    if (imamMap) imamMap.classList.add('hidden');

    updateImamMapCard(key);
    buildTimeline();
    render();
  }

  function updateImamMapCard(key) {
    const imam = IDB && IDB[key];
    if (!imam) return;
    const bg = $('imam-mc-bg');
    if (bg) bg.style.background = imam.gradient;
    const icon = $('imam-mc-icon');
    if (icon) {
      const icons = { 'abu-hanifa': '📜', 'malik': '📖', 'shafii': '📚', 'ahmad': '🕌' };
      icon.textContent = icons[key] || '📜';
    }
    const name = $('imam-mc-name');
    if (name) name.textContent = LANG === 'AR' ? imam.labelAr : imam.labelEn;
    const title = $('imam-mc-title');
    if (title) title.textContent = LANG === 'AR' ? imam.titleAr : imam.titleEn;
    const dates = $('imam-mc-dates');
    if (dates) dates.textContent = imam.birthAH + ' – ' + imam.deathAH + '  │  ' + imam.birthCE + ' – ' + imam.deathCE;
    const bp = $('imam-mc-birthplace');
    if (bp) bp.textContent = LANG === 'AR' ? 'المولد: ' + imam.birthplaceAr : 'Born: ' + imam.birthplaceEn;
    const intro = $('imam-mc-intro');
    if (intro) intro.textContent = LANG === 'AR' ? imam.introAr : imam.introEn;
  }

  // ── Imam render & timeline ─────────────────────────────
  function renderImam() {
    const ev = IDB[IMAM];
    if (!ev) return;
    const s = ev.steps[STEP];
    if (!s) return;
    const tot = ev.steps.length;

    // Ayah
    $('ayah-text').textContent = s.ayah;
    $('ayah-ref').textContent = s.ayahRef;
    const ayahEn = $('ayah-text-en');
    if (ayahEn) ayahEn.textContent = s.ayahEn;
    const ayahRefEn = $('ayah-ref-en');
    if (ayahRefEn) ayahRefEn.textContent = s.ayahRefEn;

    // Stage badge
    $('stage-badge').textContent = LANG === 'AR'
      ? 'المرحلة ' + arNum(STEP + 1) + ' من ' + arNum(tot)
      : 'Step ' + (STEP + 1) + ' of ' + tot;

    // Date
    $('ev-date').textContent = s[t('date')];

    // Title
    const te = $('ev-title');
    te.textContent = s[t('title')];
    te.style.animation = 'none';
    void te.offsetWidth;
    te.style.animation = '';

    // Description
    const de = $('ev-desc');
    de.textContent = s[t('desc')];
    de.style.animation = 'none';
    void de.offsetWidth;
    de.style.animation = '';

    // Characters
    const chars = s[t('chars')];
    $('chars-grid').innerHTML = (chars || []).map(function(c) {
      return '<div class="char-row"><div class="char-ic">' + c.i + '</div><div><div class="char-nm">' + c.n + '</div><div class="char-rl">' + c.r + '</div></div></div>';
    }).join('');

    // Lesson
    $('lesson-text').textContent = s[t('lesson')];

    // Sources
    $('src-list').innerHTML = (s.srcs || []).map(function(r) {
      return '<span class="src-chip">📖 ' + r + '</span>';
    }).join('');

    // Map badges
    $('badge-time').textContent = s[t('time')];
    $('badge-dist').textContent = s[t('dist')];

    // Map card
    $('mc-title').textContent = s[t('mt')];
    $('mc-desc').textContent = s[t('md')];
    $('map-card').classList.add('up');

    // Map ambient — hide the overlay entirely when step has no amb field
    const ambEl = $('map-amb');
    if (s.amb) {
      ambEl.className = 'map-amb amb-' + s.amb;
      ambEl.style.display = '';
    } else {
      ambEl.className = 'map-amb';
      ambEl.style.display = 'none';
    }

    // Timeline fill
    const pct = tot > 1 ? (STEP / (tot - 1)) * 100 : 100;
    $('tl-fill').style.width = pct + '%';
    $('hdr-prog').style.width = pct + '%';

    // Timeline nodes
    for (let i = 0; i < tot; i++) {
      const n = $('tn' + i);
      if (!n) continue;
      n.classList.remove('now', 'done');
      if (i === STEP) n.classList.add('now');
      else if (i < STEP) n.classList.add('done');
    }

    // Footer strip
    $('tl-name').textContent = s[t('title')];
    $('tl-counter').textContent = LANG === 'AR'
      ? arNum(STEP + 1) + ' / ' + arNum(tot)
      : (STEP + 1) + ' / ' + tot;

    // Nav buttons
    $('btn-prev').disabled = STEP === 0;
    $('btn-next').disabled = STEP === tot - 1;

    // Position the focus pulse on the shared imam map. Call synchronously (not
    // via rAF) — rAF is paused in a hidden/backgrounded tab, and positioning is
    // just SVG attribute writes that need no layout. Mirrors the Sera path,
    // which also calls applyMapFocus() synchronously from goTo()/switchEv().
    applyMapFocus(true);
    // Plot the OTHER imams alive during this step's time period at their location.
    renderImamContemporaries(s);
  }

  // ── Imam contemporaries on the map ─────────────────────
  const SVG_NS = 'http://www.w3.org/2000/svg';

  // Parse the AH year range from an imam step's date ("100 – 120 AH" / "150 AH").
  function imamAHRange(step) {
    const m = (step && step.dateEn || '').match(/(\d+)\s*(?:[–-]\s*(\d+))?/);
    if (!m) return null;
    return [+m[1], m[2] ? +m[2] : +m[1]];
  }

  // Where was `imamKey` at Hijri year T? mapFocus of the phase covering T (or the
  // nearest phase). T is assumed within the imam's lifespan.
  function imamLocationAt(imamKey, T) {
    const im = IDB && IDB[imamKey];
    if (!im) return null;
    let best = null, bestDist = Infinity;
    im.steps.forEach((st) => {
      const r = imamAHRange(st);
      if (!r || !st.mapFocus) return;
      const d = (T >= r[0] && T <= r[1]) ? 0 : Math.min(Math.abs(T - r[0]), Math.abs(T - r[1]));
      if (d < bestDist) { bestDist = d; best = st.mapFocus; }
    });
    return best;
  }

  // Plot the OTHER imams whose lifespan overlaps the current step's time window,
  // each at their location during that overlap. Re-runs per step + on lang toggle.
  function renderImamContemporaries(curStep) {
    const layer = $('imam-contemporaries');
    if (!layer) return;
    while (layer.firstChild) layer.removeChild(layer.firstChild);
    const r = imamAHRange(curStep);
    if (!r) return;
    const s1 = r[0], s2 = r[1];
    const used = {};  // stack labels when imams share a city
    Object.keys(IDB).forEach((key) => {
      if (key === IMAM) return;
      const im = IDB[key];
      const birth = parseInt(im.birthAH, 10), death = parseInt(im.deathAH, 10);
      const oStart = Math.max(s1, birth), oEnd = Math.min(s2, death);
      if (oStart > oEnd) return;  // no chronological overlap with this step
      const loc = imamLocationAt(key, Math.round((oStart + oEnd) / 2));
      if (!loc) return;
      const color = im.color || '#888';
      const name = LANG === 'AR' ? (im.shortLabelAr || im.labelAr) : (im.shortLabelEn || im.labelEn);
      const cityKey = loc.x + ',' + loc.y;
      const stack = used[cityKey] || 0; used[cityKey] = stack + 1;

      const g = document.createElementNS(SVG_NS, 'g');
      g.setAttribute('class', 'imam-contemp');
      const ring = document.createElementNS(SVG_NS, 'circle');
      ring.setAttribute('cx', loc.x); ring.setAttribute('cy', loc.y); ring.setAttribute('r', '7');
      ring.setAttribute('fill', 'none'); ring.setAttribute('stroke', color);
      ring.setAttribute('stroke-width', '2'); ring.setAttribute('stroke-dasharray', '3 2'); ring.setAttribute('opacity', '.9');
      const dot = document.createElementNS(SVG_NS, 'circle');
      dot.setAttribute('cx', loc.x); dot.setAttribute('cy', loc.y); dot.setAttribute('r', '2.4'); dot.setAttribute('fill', color);
      const label = document.createElementNS(SVG_NS, 'text');
      label.setAttribute('x', loc.x); label.setAttribute('y', loc.y + 20 + stack * 12);
      label.setAttribute('text-anchor', 'middle'); label.setAttribute('fill', color);
      label.setAttribute('font-size', '9'); label.setAttribute('font-family', 'Cairo, sans-serif'); label.setAttribute('opacity', '.95');
      label.textContent = name;
      g.appendChild(ring); g.appendChild(dot); g.appendChild(label);
      layer.appendChild(g);
    });
  }

  function buildImamTimeline() {
    const ev = IDB[IMAM];
    if (!ev) return;
    const steps = ev.steps;
    const wrap = $('tl-nodes');
    if (!wrap) return;
    wrap.innerHTML = '';
    steps.forEach(function(s, i) {
      const n = document.createElement('div');
      n.className = 'tl-nd';
      n.id = 'tn' + i;
      n.addEventListener('click', function() { goTo(i); });

      const dot = document.createElement('div');
      dot.className = 'tl-dot';
      dot.textContent = LANG === 'AR' ? arNum(i + 1) : (i + 1);

      const lbl = document.createElement('div');
      lbl.className = 'tl-lbl';
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

  // ── Helpers ─────────────────────────────────────────────
  const $ = (id) => document.getElementById(id);
  const arNum = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
  const t = (key) => (LANG === 'AR' ? key + 'Ar' : key + 'En');

  // Header brand title — set both data-* (so applyLanguage re-translates it) and
  // the live textContent. Reflects the active module: Seerah vs Four Imams.
  function setBrandTitle(ar, en) {
    const bt = document.querySelector('.brand-title');
    if (!bt) return;
    bt.setAttribute('data-ar', ar);
    bt.setAttribute('data-en', en);
    bt.textContent = LANG === 'AR' ? ar : en;
  }

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
    // Update imam map card and header if in imam mode
    if (MODE === 'imams' && IDB && IDB[IMAM]) {
      updateImamMapCard(IMAM);
      const lbl = $('era-label');
      if (lbl) lbl.textContent = LANG === 'AR' ? IDB[IMAM].labelAr : IDB[IMAM].labelEn;
      const ml = $('map-label');
      if (ml) {
        const shortAr = IDB[IMAM].shortLabelAr || IDB[IMAM].labelAr;
        const shortEn = IDB[IMAM].shortLabelEn || IDB[IMAM].labelEn;
        ml.setAttribute('data-ar', '🕌 ' + shortAr);
        ml.setAttribute('data-en', '🕌 ' + shortEn);
        ml.textContent = LANG === 'AR' ? '🕌 ' + shortAr : '🕌 ' + shortEn;
      }
    }
    buildTimeline();
    render();
  }

  // ── Build timeline strip ───────────────────────────────
  function buildTimeline() {
    if (MODE === 'imams' && IDB && IDB[IMAM]) {
      buildImamTimeline();
      return;
    }
    const allSteps = DB[EVT].steps;
    const wrap = $('tl-nodes');
    if (!wrap) return;
    wrap.innerHTML = '';
    allSteps.forEach((s, i) => {
      // Skip steps outside the current Ottoman phase range
      if (PHASE_RANGE && (i < PHASE_RANGE.start || i > PHASE_RANGE.end)) return;
      const n = document.createElement('div');
      n.className = 'tl-nd';
      n.id = 'tn' + i;
      n.addEventListener('click', () => goTo(i));

      const dot = document.createElement('div');
      dot.className = 'tl-dot';
      const dotNum = PHASE_RANGE ? (i - PHASE_RANGE.start + 1) : (i + 1);
      dot.textContent = LANG === 'AR' ? arNum(dotNum) : dotNum;

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
  function switchEv(key, startStep) {
    if (!DB[key]) return;
    EVT = key;
    localStorage.setItem(STORAGE.evt, key);
    STEP = startStep != null ? startStep : 0;
    PHASE_RANGE = null; // clear any Ottoman phase range
    stopAudio();
    hideSplash();

    // Update era label in header
    const lbl = $('era-label');
    if (lbl) {
      lbl.textContent = LANG === 'AR' ? DB[key].labelAr : DB[key].labelEn;
    }
    // Header brand title: "الخط الزمني لل<era>" / "<era> Timeline"
    var arLabel = DB[key].labelAr;
    // Arabic lam-prefix: "ال..." -> "لل..." (للدولة); anything else takes an
    // ATTACHED lam (لخلافة عمر), never the detached "لـ " + space form.
    var timelineAr = arLabel.indexOf('ال') === 0 ? 'الخط الزمني لل' + arLabel.slice(2) : 'الخط الزمني ل' + arLabel;
    var timelineEn = DB[key].labelEn + ' Timeline';
    setBrandTitle(timelineAr, timelineEn);
    // Update page title
    var pt = document.querySelector('title');
    if (pt) { pt.setAttribute('data-ar', timelineAr); pt.setAttribute('data-en', timelineEn); pt.textContent = LANG === 'AR' ? timelineAr : timelineEn; }

    // Toggle maps (include svg-imam so it's hidden when returning to a Sera era)
    const allSvgs = ['svg-preb','svg-hijra','svg-badr','svg-meccan','svg-medinan',
                     'svg-abubakr','svg-umar','svg-uthman','svg-ali','svg-hasan','svg-umawi','svg-abassi','svg-uthmani','svg-imam'];
    allSvgs.forEach((id) => {
      const el = $(id);
      if (el) {
        // abassi sub-eras (1-4) all share svg-abassi
        var svgKey = key.startsWith('abassi') ? 'abassi' : key;
        el.classList.toggle('hidden', id !== 'svg-' + svgKey);
      }
    });
    const imamMapCard = $('imam-map');
    if (imamMapCard) imamMapCard.classList.add('hidden');

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
    // Works for both Sera eras and the shared imam map. `mapKey` selects the
    // SVG's pan-/focus- layer ids; in imam mode it's the fixed 'imam' map.
    const inImam = MODE === 'imams';
    const ev = inImam ? (IDB && IDB[IMAM]) : DB[EVT];
    if (!ev) return;
    const s = ev.steps[STEP];
    if (!s) return;
    const mapKey = inImam ? 'imam' : EVT;
    const vb = MAP_VB[mapKey] || [700, 560];
    const focus = s.mapFocus || { x: vb[0] / 2, y: vb[1] / 2, scale: 1.0 };

    // Frame the map for this step. Manual zoom resets to 1.0× on every
    // step/era change (the step's mapFocus.scale is the new baseline), so the
    // zoom % readout stays truthful. writeMapViewBox always writes — a step
    // without mapFocus.scale gets the era's full map, never the previous
    // step's stale frame.
    zoomIdx = 2;
    writeMapViewBox();

    // No transform on map-pan — the full map is always visible inside the frame
    const pan = $('pan-' + mapKey);
    if (pan) {
      pan.style.transform = '';
      pan.style.transformOrigin = '';
    }

    // Show & position the focus layer (pulse + 8-point star wake) at (focus.x, focus.y)
    const focusLayer = $('focus-' + mapKey);
    if (focusLayer) {
      focusLayer.style.display = '';
      const pulse = focusLayer.querySelector('.focus-pulse');
      const star = focusLayer.querySelector('.star-wake');
      if (pulse) {
        pulse.setAttribute('cx', focus.x);
        pulse.setAttribute('cy', focus.y);
        pulse.setAttribute('data-step', STEP);
        pulse.setAttribute('data-evt', mapKey);
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
    console.log('[focus]', mapKey, 'step=' + STEP, 'pos=(' + focus.x + ',' + focus.y + ')', s[t('title')]);
  }

  // ── Pulse on/off helpers (linked to audio state) ────────
  function setAudioPulse(on) {
    const focusLayer = $('focus-' + (MODE === 'imams' ? 'imam' : EVT));
    if (!focusLayer) return;
    const pulse = focusLayer.querySelector('.focus-pulse');
    if (pulse) pulse.classList.toggle('speaking', !!on);
  }

  // ── Navigation ──────────────────────────────────────────
  function goTo(i) {
    const ev = MODE === 'imams' ? (IDB ? IDB[IMAM] : null) : DB[EVT];
    if (!ev) return;
    const l = ev.steps.length;
    const min = PHASE_RANGE ? PHASE_RANGE.start : 0;
    const max = PHASE_RANGE ? PHASE_RANGE.end : l - 1;
    if (i < min || i > max) return;
    STEP = i;
    stopAudio();
    render();
    if (MODE !== 'imams') applyMapFocus(true);
    if (AUTO_NARRATE) {
      setTimeout(() => { if (AUTO_NARRATE) playVerse(); }, 850);
    }
  }

  function step(d) { goTo(STEP + d); }

  // ── Audio: pre-recorded only ───────────────────────────
  // 'narrate' -> pre-generated neural MP3 under audio/. 'verse' -> real reciter
  // recitation from everyayah.com. No live TTS (Web Speech / translate_tts).

  // ── Narration MP3 url for the current (voice, era|imam, step, language) ──
  // In imam mode the key is `imam-<id>` (NOT the Seerah EVT) — otherwise an imam
  // step would resolve to a real Seerah clip (e.g. audio/classic/hijra_0_ar.mp3)
  // and play the wrong narration. Imam audio isn't generated yet, so this path
  // 404s → playVerse() shows "audio not available", which is the intended result.
  function narrationURL(slot) {
    const lang = LANG === 'AR' ? 'ar' : 'en';
    const key = MODE === 'imams' ? ('imam-' + IMAM) : EVT;
    return 'audio/' + (slot || VOICE) + '/' + key + '_' + STEP + '_' + lang + '.mp3';
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

    const ev = MODE === 'imams' ? (IDB ? IDB[IMAM] : null) : DB[EVT];
    if (!ev) { diag('Audio unavailable', 'warn'); return; }
    const s = ev.steps[STEP];
    if (!s) { diag('Audio unavailable', 'warn'); return; }
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
    if (MODE === 'imams' && IDB && IDB[IMAM]) {
      renderImam();
      return;
    }
    const ev = DB[EVT];
    const s = ev.steps[STEP];
    const tot = ev.steps.length;
    const k = t(''); // 'Ar' or 'En'
    const phaseTot = PHASE_RANGE ? (PHASE_RANGE.end - PHASE_RANGE.start + 1) : tot;
    const phaseStep = PHASE_RANGE ? (STEP - PHASE_RANGE.start + 1) : (STEP + 1);

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
      ? 'المرحلة ' + arNum(phaseStep) + ' من ' + arNum(phaseTot)
      : 'Step ' + phaseStep + ' of ' + phaseTot;
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

    // Map ambient — hide the overlay entirely when step has no amb field
    const ambEl = $('map-amb');
    if (s.amb) {
      ambEl.className = 'map-amb amb-' + s.amb;
      ambEl.style.display = '';
    } else {
      ambEl.className = 'map-amb';
      ambEl.style.display = 'none';
    }

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
    const pct = phaseTot > 1 ? ((STEP - (PHASE_RANGE ? PHASE_RANGE.start : 0)) / (phaseTot - 1)) * 100 : 100;
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
      ? arNum(phaseStep) + ' / ' + arNum(phaseTot)
      : phaseStep + ' / ' + phaseTot;

    // Nav buttons
    $('btn-prev').disabled = PHASE_RANGE ? STEP === PHASE_RANGE.start : STEP === 0;
    $('btn-next').disabled = PHASE_RANGE ? STEP === PHASE_RANGE.end : STEP === tot - 1;

    // Map focus pan/zoom — synchronous on purpose: applyMapFocus only writes
    // SVG attributes (no layout reads), and requestAnimationFrame is paused in
    // hidden/backgrounded tabs (caused the imam map-focus regression, v2.11.x).
    applyMapFocus(true);
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
    const homeUmawi = $('home-umawi');
    if (homeUmawi) homeUmawi.addEventListener('click', goToUmawi);
    ['abassi1','abassi2','abassi3','abassi4'].forEach(function(key) {
      var el = $('home-' + key);
      if (el) el.addEventListener('click', window['goTo' + key.charAt(0).toUpperCase() + key.slice(1)]);
    });
    const homeUthmani = $('home-uthmani');
    if (homeUthmani) homeUthmani.addEventListener('click', goToUthmani);

    // Splash: click era cards
    document.querySelectorAll('.era-card, .caliph-card').forEach((el) => {
      el.addEventListener('click', () => switchEv(el.dataset.ev));
    });
    // Imam screen: click imam cards
    document.querySelectorAll('.imam-card').forEach((el) => {
      el.addEventListener('click', () => selectImam(el.dataset.imam));
    });
    // All card "buttons" are divs with role=button tabindex=0 — divs don't
    // synthesize click from Enter/Space, so without this the launcher and
    // splash are unreachable by keyboard.
    document.querySelectorAll('.home-card, .era-card, .caliph-card, .imam-card').forEach((el) => {
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
      });
    });
    // Back to splash (from era) or imam splash (from imam step)
    const backBtn = $('btn-splash');
    if (backBtn) backBtn.addEventListener('click', () => {
      if (MODE === 'imams') goToImamSplash();
      else if (EVT === 'umawi') goToHome();  // Umayyad has its own home card, not in the splash
      else if (EVT.startsWith('abassi')) goToHome(); // Abbasid sub-eras have their own home cards
      else if (EVT === 'uthmani') showOttomanScreen(); // Ottoman back to phase selection
      else goToSplash();
    });
    // Splash back to home
    const splashBack = $('splash-back');
    if (splashBack) splashBack.addEventListener('click', goToHome);
    // Imam screen back to home
    const imamBack = $('imam-back');
    if (imamBack) imamBack.addEventListener('click', goToHome);
    // Ottoman screen back to home
    const ottomanBack = $('ottoman-back');
    if (ottomanBack) ottomanBack.addEventListener('click', goToHome);
    // Ottoman phase cards → enter era at step offset within phase range
    document.querySelectorAll('.ot-phase-card').forEach((el) => {
      el.addEventListener('click', () => {
        const phase = parseInt(el.dataset.phase, 10);
        if (!phase || !DB.uthmani) return;
        const offsets = { 1: 0, 2: 8, 3: 16, 4: 22 };
        const limits = { 1: { start: 0, end: 7 }, 2: { start: 8, end: 15 }, 3: { start: 16, end: 21 }, 4: { start: 22, end: 27 } };
        if (offsets[phase] === undefined) return;
        MODE = 'sera';
        PHASE_RANGE = limits[phase];
        hideOttomanScreen();
        switchEv('uthmani', offsets[phase]);
      });
    });

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

    // Map zoom controls — manual zoom multiplies the step's mapFocus.scale
    // baseline; writeMapViewBox (the single viewBox writer) handles the math,
    // the active era's own MAP_VB base (umawi/abassi are 1000×560), edge
    // clamping, and the % readout. No init-time write: no map is visible at
    // boot, and entering an era frames it via applyMapFocus.
    const zIn  = $('z-in');
    const zOut = $('z-out');
    const zRstBtn = $('z-rst');
    if (zIn)  zIn.addEventListener('click',  () => { if (zoomIdx < ZOOM_LEVELS.length - 1) { zoomIdx++; writeMapViewBox(); } });
    if (zOut) zOut.addEventListener('click', () => { if (zoomIdx > 0) { zoomIdx--; writeMapViewBox(); } });
    if (zRstBtn) zRstBtn.addEventListener('click', () => { zoomIdx = 2; writeMapViewBox(); });

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
