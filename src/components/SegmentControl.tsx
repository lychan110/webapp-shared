/* ══════════════════════════════════════════════════════════════════════════
   SegmentControl — Segmented radio button group
   ══════════════════════════════════════════════════════════════════════════
   A horizontal row of options where one is selected at a time, with
   animated selection indicator.

   Usage:
     <SegmentControl
       options={[
         { id: 'day', label: 'Day' },
         { id: 'week', label: 'Week' },
         { id: 'month', label: 'Month' },
       ]}
       value="week"
       onChange={(id) => setPeriod(id)}
     />
   ══════════════════════════════════════════════════════════════════════════ */

import { type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

/* ─── Variants ────────────────────────────────────────────────────────── */

export const segmentControlVariants = cva(
  'inline-flex items-center rounded-lg border p-0.5 bg-white/5 dark:bg-white/[0.03] border-ink-soft/10 dark:border-white/10',
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const segmentOptionVariants = cva(
  'inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-all duration-200 cursor-pointer border-0 focus-visible:outline-2 focus-visible:outline-teal focus-visible:outline-offset-2',
  {
    variants: {
      selected: {
        true: 'bg-white dark:bg-white/10 text-ink dark:text-white shadow-sm',
        false:
          'bg-transparent text-ink-soft/50 dark:text-white/50 hover:text-ink-soft/70 dark:hover:text-white/70',
      },
      size: {
        sm: 'px-2.5 py-1',
        md: 'px-3 py-1.5',
        lg: 'px-4 py-2',
      },
    },
    defaultVariants: {
      selected: false,
      size: 'md',
    },
  },
);

/* ─── Types ───────────────────────────────────────────────────────────── */

export interface SegmentOption<T extends string = string> {
  /** Unique identifier */
  id: T;
  /** Display label */
  label: string;
  /** Optional icon node (e.g. lucide-react icon component) */
  icon?: ReactNode;
}

export interface SegmentControlProps<T extends string = string>
  extends VariantProps<typeof segmentControlVariants> {
  /** Array of options to display */
  options: SegmentOption<T>[];
  /** Currently selected option id */
  value: T;
  /** Called when a new option is selected */
  onChange?: (id: T) => void;
  /** Additional classes for the container */
  className?: string;
}

/* ─── Component ────────────────────────────────────────────────────────── */

/**
 * SegmentControl — A segmented radio button group.
 *
 * Renders a horizontal row of options where exactly one is selectable
 * at a time. Option buttons render as `role="radio"` for accessibility.
 *
 * @template T - The string literal union type of option ids
 */
export function SegmentControl<T extends string = string>({
  options,
  value,
  onChange,
  size,
  className,
}: SegmentControlProps<T>) {
  return (
    <div
      role="radiogroup"
      className={cn(segmentControlVariants({ size }), className)}
    >
      {options.map((option) => {
        const selected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange?.(option.id)}
            className={cn(segmentOptionVariants({ selected, size }))}
          >
            {option.icon && <span className="shrink-0">{option.icon}</span>}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

SegmentControl.displayName = 'SegmentControl';
