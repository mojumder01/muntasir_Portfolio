/* =============================================================
   theme-init.js
   Runs before the page paints, so the saved theme shows instantly
   (no white flash in dark mode). Default theme: black & white.
   Kept as a separate file because the security policy blocks
   inline scripts.
   ============================================================= */
(function applySavedTheme() {
  var THEME_STORAGE_KEY = 'portfolio-theme';
  var savedTheme = null;
  try {
    savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  } catch (error) {
    // Private mode / blocked storage: just use the default theme
  }
  var theme = savedTheme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
})();
