/* ══════════════════════════════════════════════════════════════════════════
   TypingDots — animated loading indicator with three bouncing dots
   ══════════════════════════════════════════════════════════════════════════
   Three dots that pulse sequentially at staggered delays, commonly used
   for "typing..." or "loading..." indicators.

   Requires the `typing-bounce` animation defined in tokens.css.

   Usage:
     <TypingDots />
     <TypingDots className="gap-2" dotClassName="w-3 h-3" />
     <TypingDots ariaLabel="Loading responses" />
   ══════════════════════════════════════════════════════════════════════════ */

import { cn } from '../utils/cn';

/* ─── Props ────────────────────────────────────────────────────────────── */

export interface TypingDotsProps {
  /** Additional CSS classes for the container */
  className?: string;
  /** Additional CSS classes for each dot */
  dotClassName?: string;
  /** Color class (default: matches current text color) */
  color?: string;
  /** Accessible label (default: 'Loading') */
  ariaLabel?: string;
}

/* ─── Component ────────────────────────────────────────────────────────── */

export function TypingDots({
  className,
  dotClassName,
  color,
  ariaLabel = 'Loading',
}: TypingDotsProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-1', className)}
      role="status"
      aria-label={ariaLabel}
    >
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className={cn(
            'inline-block w-[7px] h-[7px] rounded-full',
            'animate-typing-bounce',
            color ?? 'bg-current',
            dotClassName,
          )}
          style={{ animationDelay: `${index * 140}ms` }}
        />
      ))}
    </span>
  );
}

TypingDots.displayName = 'TypingDots';
