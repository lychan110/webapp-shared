import { useState, useCallback } from 'react';

/**
 * Type-safe localStorage hook with JSON serialization.
 * Falls back to initialValue if storage is unavailable or parsing fails.
 *
 * @example
 * const [name, setName] = useLocalStorage('user-name', 'Guest')
 * const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'dark')
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue(prev => {
        const next = value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // Storage full or unavailable — silently fail
        }
        return next;
      });
    },
    [key],
  );

  return [storedValue, setValue];
}
