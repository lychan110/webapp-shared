import { useEffect, useRef, type RefObject } from 'react';

/**
 * Detect clicks outside a referenced element.
 * Useful for closing modals, dropdowns, and command palettes.
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null)
 * useOnClickOutside(ref, () => setIsOpen(false))
 */
export function useOnClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) return;
      handlerRef.current(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref]);
}
