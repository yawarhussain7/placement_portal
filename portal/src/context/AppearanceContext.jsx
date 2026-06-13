import React, { createContext, useContext, useEffect, useState } from 'react';

const AppearanceContext = createContext(null);

function applyAppearance({ theme }) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
}

export function AppearanceProvider({ children }) {
  const [appearance, setAppearance] = useState(() => {
    try {
      const saved = localStorage.getItem('appearance');
      return saved ? JSON.parse(saved) : { theme: 'light' };
    } catch {
      return { theme: 'light' };
    }
  });

  useEffect(() => {
    applyAppearance(appearance);
    localStorage.setItem('appearance', JSON.stringify(appearance));
  }, [appearance]);

  // re-apply when system color scheme changes
  useEffect(() => {
    if (appearance.theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyAppearance(appearance);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [appearance]);

  return (
    <AppearanceContext.Provider value={{ appearance, setAppearance }}>
      {children}
    </AppearanceContext.Provider>
  );
}

export const useAppearance = () => useContext(AppearanceContext);
