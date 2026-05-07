import { useEffect, useCallback, useRef } from 'react';

type KeyCombo = string; // e.g. 'meta+k', 'ctrl+k', 'escape', 'arrowdown'

interface UseKeyboardOptions {
  /** Allow event when an input/textarea is focused */
  ignoreInputs?: boolean;
}

/**
 * Register keyboard shortcuts with a simple string API.
 *
 * @example
 * useKeyboard('meta+k', () => setIsOpen(true))
 * useKeyboard('escape', () => setIsOpen(false))
 * useKeyboard('enter', handleSubmit, { ignoreInputs: false })
 */
export function useKeyboard(
  combo: KeyCombo,
  handler: (event: KeyboardEvent) => void,
  options: UseKeyboardOptions = {},
) {
  const { ignoreInputs = true } = options;
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  const normalize = useCallback((e: KeyboardEvent): string => {
    const parts: string[] = [];
    if (e.metaKey) parts.push('meta');
    if (e.ctrlKey) parts.push('ctrl');
    if (e.altKey) parts.push('alt');
    if (e.shiftKey) parts.push('shift');
    parts.push(e.key.toLowerCase());
    return parts.join('+');
  }, []);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (ignoreInputs) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      }
      if (normalize(e) === combo) {
        e.preventDefault();
        handlerRef.current(e);
      }
    };

    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [combo, normalize, ignoreInputs]);
}
