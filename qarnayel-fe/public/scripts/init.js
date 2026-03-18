/**
 * Pre-paint initialisation — runs synchronously before the first frame.
 *
 * 1. Theme  — reads localStorage → falls back to prefers-color-scheme → sets
 *             data-theme on <html> so CSS variables resolve on first paint.
 *
 * 2. Locale — reads the first URL segment to detect a non-default locale and
 *             corrects lang/dir on <html> before the browser lays out the page.
 *
 * Keep LOCALE_DIRS and DEFAULT_LOCALE in sync with src/lib/i18n/locales.ts.
 */
(function () {
  var LOCALE_DIRS = { ar: 'rtl', en: 'ltr' };
  var DEFAULT_LOCALE = 'ar';

  try {
    // ── Theme ────────────────────────────────────────────────────────────────
    var t = localStorage.getItem('theme');
    if (!t)
      t = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    document.documentElement.setAttribute('data-theme', t);

    // ── Locale ───────────────────────────────────────────────────────────────
    var loc = location.pathname.split('/')[1];
    if (loc && loc !== DEFAULT_LOCALE && LOCALE_DIRS[loc]) {
      document.documentElement.lang = loc;
      document.documentElement.dir = LOCALE_DIRS[loc];
    }
  } catch (e) {}
})();
