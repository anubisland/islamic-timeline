(function () {
  'use strict';

  const STORAGE_KEY = 'sera.lang';
  const langToggle = document.getElementById('langToggle');
  let currentLang = localStorage.getItem(STORAGE_KEY) || 'AR';

  const translatableSelector = '[data-ar][data-en]';

  function applyLanguage(lang) {
    currentLang = lang;
    const isAr = lang === 'AR';
    const html = document.documentElement;

    html.lang = isAr ? 'ar' : 'en';
    html.dir = isAr ? 'rtl' : 'ltr';

    document.querySelectorAll(translatableSelector).forEach((el) => {
      el.textContent = isAr ? el.dataset.ar : el.dataset.en;
    });

    localStorage.setItem(STORAGE_KEY, lang);
  }

  function toggle() {
    applyLanguage(currentLang === 'AR' ? 'EN' : 'AR');
  }

  if (langToggle) {
    langToggle.addEventListener('click', toggle);
  }

  // Initial render based on stored preference
  applyLanguage(currentLang);
})();
