/**
 * theme.js — Dark mode toggle with localStorage persistence.
 *
 * Reads the saved preference from localStorage on load, then toggles
 * the [data-theme] attribute on <html> and updates the button emoji.
 */
(function () {
  "use strict";

  const STORAGE_KEY = "paws-theme";
  const root = document.documentElement;
  const btn = document.getElementById("theme-toggle");

  /** Apply the given theme and persist it. */
  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
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
  }

  // Toggle on click
  if (btn) {
    btn.addEventListener("click", function () {
      const current = root.getAttribute("data-theme");
      setTheme(current === "dark" ? "light" : "dark");
    });
  }
})();
