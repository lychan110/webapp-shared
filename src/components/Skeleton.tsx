/* ══════════════════════════════════════════════════════════════════════════
   Skeleton — loading placeholder for cards, text, and widgets
   ══════════════════════════════════════════════════════════════════════════
   Extracted from Rolodex patterns. Multi-purpose loading skeleton that
   pulses to indicate content is being fetched.

   Usage:
     <Skeleton className="h-16 w-full" />
     <Skeleton variant="text" lines={3} />
   ══════════════════════════════════════════════════════════════════════════ */

import { cn } from '../utils/cn';

/* ─── Variants ────────────────────────────────────────────────────────── */

export interface SkeletonProps {
  /** CSS classes for custom sizing */
  className?: string;
  /** Predefined variant */
  variant?: 'block' | 'text' | 'card' | 'circle';
  /** Number of lines (text variant only, default: 3) */
  lines?: number;
}

export function Skeleton({ className, variant, lines = 3 }: SkeletonProps) {
  if (variant === 'text') {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-3 rounded-md bg-white/5 animate-pulse',
              i === lines - 1 ? 'w-3/4' : 'w-full',
              className,
            )}
          />
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn('rounded-2xl bg-white/5 p-4 animate-pulse', className)}>
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-white/10 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 rounded-md bg-white/10" />
            <div className="h-3 w-full rounded-md bg-white/[0.07]" />
            <div className="h-3 w-1/2 rounded-md bg-white/[0.07]" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'circle') {
    return (
      <div
        className={cn('rounded-full bg-white/5 animate-pulse', className || 'w-10 h-10')}
      />
    );
  }

  // Default: block
  return <div className={cn('rounded-xl bg-white/5 animate-pulse', className || 'h-16 w-full')} />;
}
