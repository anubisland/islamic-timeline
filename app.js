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
  const STORAGE = { lang: 'sera.lang', ttsMode: 'sera.tts', auto: 'sera.auto' };
  let EVT = 'hijra';
  let STEP = 0;
  let LANG = (localStorage.getItem(STORAGE.lang) || 'AR').toUpperCase();
  let currentAudio = null;
  let isPlaying = false;
  let onAudioEnd = null; // callback to fire when TTS completes (for pulse cleanup)
  let TTS_MODE = localStorage.getItem(STORAGE.ttsMode) || 'verse';   // 'verse' | 'narrate'
  let AUTO_NARRATE = localStorage.getItem(STORAGE.auto) === '1';        // auto-play on step change

  // ── Map viewBoxes ──────────────────────────────────────
  const MAP_VB = { hijra: [700, 560], badr: [700, 500], meccan: [700, 560], medinan: [700, 560] };

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

    // Toggle the language button text
    const langBtn = $('langToggle');
    if (langBtn) {
      const span = langBtn.querySelector('span');
      if (span) span.textContent = isAr ? 'English' : 'العربية';
    }

    localStorage.setItem(STORAGE.lang, LANG);
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

  // ── Switch event (hijra / badr) ─────────────────────────
  function switchEv(key) {
    if (!DB[key]) return;
    EVT = key;
    STEP = 0;
    stopAudio();

    // Update event buttons
    document.querySelectorAll('.ev-btn').forEach((btn) => {
      btn.classList.toggle('on', btn.dataset.ev === key);
    });

    // Toggle maps
    $('svg-hijra').classList.toggle('hidden', key !== 'hijra');
    $('svg-badr').classList.toggle('hidden', key !== 'badr');
    const sm = $('svg-meccan'); if (sm) sm.classList.toggle('hidden', key !== 'meccan');
    const sd = $('svg-medinan'); if (sd) sd.classList.toggle('hidden', key !== 'medinan');

    // Update map label
    $('map-label').textContent = DB[key][t('mapLabel')];

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

  // ── Audio (Web Speech first, Google TTS as fallback) ───
  // ── TTS mode: 'verse' (Quran ayah only) or 'narrate' (description) ──
  function cleanForTTS(text) {
    return String(text || '')
      .replace(/[﴿﴾]/g, ' ')
      .replace(/[،؛؟!.]/g, ' ')
      .replace(/[\u064B-\u0652]/g, '')  // strip tashkil for natural speech
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Pick the best available Arabic voice for the system
  let cachedArVoice = null;
  function pickArabicVoice() {
    if (cachedArVoice) return cachedArVoice;
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices() || [];
    const ar = voices.find(v => /ar(-|_)/i.test(v.lang))
            || voices.find(v => /arabic/i.test(v.name))
            || null;
    cachedArVoice = ar;
    return ar;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = pickArabicVoice;
  }

  function playVerse() {
    stopAudio();

    const s = DB[EVT].steps[STEP];
    // Choose text: verse (Quran ayah) or description narration
    const raw = TTS_MODE === 'narrate' ? s[t('desc')] : s.ayah;
    const text = cleanForTTS(raw);
    if (!text) { finishPlayback(); return; }

    $('btn-play').classList.add('on');
    $('btn-play').textContent = '⏸';
    isPlaying = true;
    setAudioPulse(true);

    function finishPlayback() {
      isPlaying = false;
      setAudioPulse(false);
      resetPlayBtn();
    }
    window.__ttsFinish = finishPlayback;

    function sysTTS(t, onDone) {
      if (!('speechSynthesis' in window)) { onDone && onDone(); return; }
      try { window.speechSynthesis.cancel(); } catch (e) {}
      const u = new SpeechSynthesisUtterance(t);
      u.lang = LANG === 'AR' ? 'ar-SA' : 'en-US';
      u.rate = 0.6;
      u.volume = 0.95;
      const v = pickArabicVoice();
      if (v) u.voice = v;
      u.onstart = () => { window.__ttsStart = Date.now(); };
      u.onend = () => onDone && onDone();
      u.onerror = () => onDone && onDone();
      window.speechSynthesis.speak(u);
    }

    function googleTTS(t, onDone, onFail) {
      try {
        const url = 'https://translate.google.com/translate_tts?ie=UTF-8'
                  + '&q=' + encodeURIComponent(t)
                  + '&tl=' + (LANG === 'AR' ? 'ar' : 'en')
                  + '&client=tw-ob';
        const a = new Audio(url);
        currentAudio = a;
        a.volume = 0.95;
        a.playbackRate = 0.75;
        a.onended = () => { currentAudio = null; onDone && onDone(); };
        a.onerror = () => { currentAudio = null; onFail && onFail(); };
        const p = a.play();
        if (p && p.catch) p.catch(() => { currentAudio = null; onFail && onFail(); });
      } catch (e) {
        onFail && onFail();
      }
    }

    // Use Web Speech API first (no CORS, no network). If onend fires within
    // 600ms of onstart, the engine failed silently — fall back to Google.
    window.__ttsStart = 0;
    sysTTS(text, () => {
      const dur = Date.now() - (window.__ttsStart || 0);
      if (dur > 0 && dur < 600) {
        // Web Speech failed silently — try Google TTS
        googleTTS(text, finishPlayback, () => finishPlayback());
      } else {
        finishPlayback();
      }
    });
    // Safety timeout — if neither engine fires onend within 30s, finish
    setTimeout(() => { if (isPlaying) finishPlayback(); }, 30000);
  }

  function stopAudio() {
    if (currentAudio) {
      try {
        currentAudio.pause();
        currentAudio.src = '';
      } catch (e) { /* ignore */ }
      currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
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

    // Footer label
    const footerTitle = '📍 ' + s[t('title')];
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

  // ── Wire up DOM ─────────────────────────────────────────
  function init() {
    // Event switcher
    document.querySelectorAll('.ev-btn').forEach((btn) => {
      btn.addEventListener('click', () => switchEv(btn.dataset.ev));
    });

    // Language toggle
    $('langToggle').addEventListener('click', () => {
      LANG = LANG === 'AR' ? 'EN' : 'AR';
      applyLanguage();
    });

    // Navigation
    $('btn-prev').addEventListener('click', () => step(-1));
    $('btn-next').addEventListener('click', () => step(1));
    $('btn-play').addEventListener('click', togglePlay);

    // TTS mode toggle: verse <-> narration
    const modeBtn = $('btn-mode');
    if (modeBtn) {
      const refresh = () => {
        modeBtn.classList.toggle('narrate', TTS_MODE === 'narrate');
        modeBtn.querySelector('span').textContent = TTS_MODE === 'narrate'
          ? (LANG === 'AR' ? 'سرد' : 'Narr.')
          : (LANG === 'AR' ? 'آية' : 'Verse');
      };
      refresh();
      modeBtn.addEventListener('click', () => {
        TTS_MODE = TTS_MODE === 'verse' ? 'narrate' : 'verse';
        localStorage.setItem(STORAGE.ttsMode, TTS_MODE);
        refresh();
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

    // Map node clicks
    for (let i = 0; i <= 5; i++) {
      const n = $('hnode-' + i);
      if (n) n.addEventListener('click', () => goTo(i));
    }
    const bn0 = $('bnode-0');
    const bn2 = $('bnode-2');
    if (bn0) bn0.addEventListener('click', () => goTo(0));
    if (bn2) bn2.addEventListener('click', () => goTo(2));

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); step(LANG === 'AR' ? -1 : 1); }
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); step(LANG === 'AR' ? 1 : -1); }
      if (e.key === ' ') { e.preventDefault(); togglePlay(); }
      if (e.key === 'l' || e.key === 'L') { e.preventDefault(); LANG = LANG === 'AR' ? 'EN' : 'AR'; applyLanguage(); }
    });

    // Initial mount
    applyLanguage();
  }

  // Wait for DOM + data.js
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
