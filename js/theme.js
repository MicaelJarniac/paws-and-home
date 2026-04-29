/**
 * theme.js — Dark mode toggle with localStorage persistence.
 *
 * Uses Bootstrap 5.3's data-bs-theme attribute on <html> for dark mode.
 * Reads the saved preference from localStorage on load, then toggles
 * the [data-bs-theme] attribute and updates the button emoji.
 */
(function () {
  "use strict";

  const STORAGE_KEY = "paws-theme";
  const BS_THEME_ATTR = "data-bs-theme";
  const root = document.documentElement;
  const btn = document.getElementById("theme-toggle");

  /** Apply the given theme and persist it. */
  function setTheme(theme) {
    root.setAttribute(BS_THEME_ATTR, theme);
    localStorage.setItem(STORAGE_KEY, theme);
    if (btn) {
      btn.textContent = theme === "dark" ? "☀️" : "🌙";
      btn.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
    }
  }

  // Initialise: check saved preference, then OS preference, default light
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    setTheme(saved);
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    setTheme("dark");
  } else {
    // Ensure the default is set (in case it's not in the HTML)
    setTheme("light");
  }

  // Toggle on click
  if (btn) {
    btn.addEventListener("click", function () {
      const current = root.getAttribute(BS_THEME_ATTR);
      setTheme(current === "dark" ? "light" : "dark");
    });
  }
})();
