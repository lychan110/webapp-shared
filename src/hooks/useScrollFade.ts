import { useEffect, useRef, useState, type RefObject } from 'react';

interface UseScrollFadeOptions {
  /** Distance as fraction of viewport height over which the element fades (default: 0.6) */
  threshold?: number;
}

/**
 * Returns an opacity value (0–1) for an element based on its scroll position
 * relative to the viewport. The element fades out as it scrolls past the top
 * of the viewport and fades back in when scrolled back down.
 *
 * Uses a passive scroll event with requestAnimationFrame for smooth updates.
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null)
 * const opacity = useScrollFade(ref, { threshold: 0.5 })
 *
 * // <div ref={ref} style={{ opacity }}>Fades on scroll</div>
 */
export function useScrollFade(
  ref: RefObject<HTMLElement | null>,
  options: UseScrollFadeOptions = {},
): number {
  const { threshold = 0.6 } = options;
  const [opacity, setOpacity] = useState(1);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fadeDistance = window.innerHeight * threshold;

    function update() {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const next = rect.top >= 0 ? 1 : Math.max(0, 1 + rect.top / fadeDistance);
      setOpacity(next);
    }

    function handleScroll() {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    }

    update(); // set correct value on mount
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [ref, threshold]);

  return opacity;
}
