/* =============================================================
   theme-init.js
   Runs before the page paints, so the saved theme shows instantly
   (no white flash in dark mode). Visitors who never switched get
   the default theme from the admin (Site settings → Appearance),
   which the build writes on <html data-default-theme="...">.
   Kept as a separate file because the security policy blocks
   inline scripts.
   ============================================================= */
(function applySavedTheme() {
  var THEME_STORAGE_KEY = 'portfolio-theme';
  var root = document.documentElement;
  var savedTheme = null;
  try {
    savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  } catch (error) {
    // Private mode / blocked storage: just use the default theme
  }
  var defaultTheme = root.getAttribute('data-default-theme') === 'dark' ? 'dark' : 'light';
  var theme = savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : defaultTheme;
  root.setAttribute('data-theme', theme);

  // Mobile browser bar color — must match BROWSER_BAR_COLORS in src/hooks/use-theme.ts
  if (theme === 'dark') {
    var themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) themeColorMeta.setAttribute('content', '#07080c');
  }
})();
