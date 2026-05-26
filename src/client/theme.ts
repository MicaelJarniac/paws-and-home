(function () {
  const STORAGE_KEY = 'paws-theme';
  const BS_THEME_ATTR = 'data-bs-theme';
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');

  type Theme = 'light' | 'dark';

  function setTheme(theme: Theme): void {
    root.setAttribute(BS_THEME_ATTR, theme);
    localStorage.setItem(STORAGE_KEY, theme);
    if (btn) {
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
      );
    }
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') {
    setTheme(saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
  } else {
    setTheme('light');
  }

  if (btn) {
    btn.addEventListener('click', () => {
      const current = root.getAttribute(BS_THEME_ATTR);
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }
})();
