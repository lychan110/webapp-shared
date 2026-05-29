import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

/* ─── Variants ────────────────────────────────────────────────────────── */

export const toggleVariants = cva(
  'relative inline-flex items-center rounded-lg flex-shrink-0 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-teal focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'w-8 h-4',
        md: 'w-9 h-5',
      },
      checked: {
        true: 'bg-teal',
        false: 'bg-paper-deep border border-ink-soft/20',
      },
    },
    defaultVariants: {
      size: 'md',
      checked: false,
    },
  },
);

export const toggleThumbVariants = cva(
  'absolute top-0.5 rounded-md bg-white shadow-sm transition-all duration-200',
  {
    variants: {
      size: {
        sm: 'w-3 h-3',
        md: 'w-3.5 h-3.5',
      },
      checked: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      { size: 'sm', checked: true, className: 'right-0.5' },
      { size: 'sm', checked: false, className: 'left-0.5' },
      { size: 'md', checked: true, className: 'right-0.5' },
      { size: 'md', checked: false, className: 'left-0.5' },
    ],
    defaultVariants: {
      size: 'md',
      checked: false,
    },
  },
);

/* ─── Props ────────────────────────────────────────────────────────────── */

export interface ToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'>,
    VariantProps<typeof toggleVariants> {
  /** Whether the toggle is on */
  checked: boolean;
  /** Called when the toggle value changes */
  onChange: () => void;
  /** Label rendered adjacent to the toggle */
  label?: ReactNode;
  /** Size variant */
  size?: 'sm' | 'md';
}

/* ─── Component ────────────────────────────────────────────────────────── */

/**
 * Toggle (switch) — accessible on/off control.
 * Uses role="switch" for proper accessibility semantics.
 */
export function Toggle({
  checked,
  onChange,
  disabled,
  size,
  label,
  className,
  ...props
}: ToggleProps) {
  const inner = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={cn(toggleVariants({ size, checked }), className)}
      {...props}
    >
      <span className={cn(toggleThumbVariants({ size, checked }))} />
    </button>
  );

  if (label) {
    return (
      <label className="inline-flex items-center gap-2 cursor-pointer">
        {inner}
        <span className="text-sm text-ink-soft">{label}</span>
      </label>
    );
  }

  return inner;
}

Toggle.displayName = 'Toggle';
