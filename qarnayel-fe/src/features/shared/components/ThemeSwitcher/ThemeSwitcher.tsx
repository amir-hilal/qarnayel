'use client';

import './ThemeSwitcher.css';
import { useEffect, useState } from 'react';

// ---------------------------------------------------------------------------
// ThemeSwitcher — toggles light/dark theme via data-theme on <html>
// ---------------------------------------------------------------------------
export function ThemeSwitcher(): React.ReactElement {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const resolved =
      saved ??
      (window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light');
    setTheme(resolved);
    document.documentElement.setAttribute('data-theme', resolved);
  }, []);

  function toggle() {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  }

  if (theme === null) {
    return <div className="theme-switcher__placeholder" aria-hidden="true" />;
  }

  return (
    <button
      onClick={toggle}
      className="theme-switcher__btn"
      aria-label={
        theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
      }
    >
      <span className="material-symbols-outlined" aria-hidden="true">
        {theme === 'light' ? 'dark_mode' : 'light_mode'}
      </span>
    </button>
  );
}
