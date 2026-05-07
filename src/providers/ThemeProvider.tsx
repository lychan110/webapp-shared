import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';

/* ─── Types ───────────────────────────────────────────────────────────── */

export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  toggle: () => void;
  setTheme: (theme: ThemeMode) => void;
}

/* ─── Context ─────────────────────────────────────────────────────────── */

const ThemeContext = createContext<ThemeContextType | null>(null);

/* ─── Hydration-safe initializer ───────────────────────────────────────── */

function getInitialTheme(storageKey: string): ThemeMode | null {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    /* storage unavailable */
  }
  return null;
}

/* ─── Provider ─────────────────────────────────────────────────────────── */

interface ThemeProviderProps {
  children: ReactNode;
  /** localStorage key (default: 'studio-theme') */
  storageKey?: string;
  /** Default theme when no preference is stored (default: 'dark') */
  defaultTheme?: ThemeMode;
  /** CSS selector to apply the theme class to (default: 'html') */
  rootSelector?: string;
}

export function ThemeProvider({
  children,
  storageKey = 'studio-theme',
  defaultTheme = 'dark',
  rootSelector = 'html',
}: ThemeProviderProps) {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    // Priority: localStorage > system preference > default
    return getInitialTheme(storageKey) ?? (prefersDark ? 'dark' : defaultTheme);
  });

  // Sync theme to DOM
  useEffect(() => {
    const root = document.querySelector(rootSelector);
    if (!root) return;

    const oldClass = theme === 'dark' ? 'light' : 'dark';
    root.classList.remove(oldClass);
    root.classList.add(theme);

    try {
      localStorage.setItem(storageKey, theme);
    } catch { /* noop */ }
  }, [theme, storageKey, rootSelector]);

  // Update if system preference changes (only when no stored preference)
  useEffect(() => {
    if (getInitialTheme(storageKey) !== null) return;
    setThemeState(prefersDark ? 'dark' : defaultTheme);
  }, [prefersDark, storageKey]);

  const setTheme = (t: ThemeMode) => setThemeState(t);
  const toggle = () => setThemeState(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/* ─── Hook ─────────────────────────────────────────────────────────────── */

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme() must be used within a <ThemeProvider>');
  }
  return ctx;
}
