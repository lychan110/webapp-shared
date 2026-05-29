import { forwardRef, type InputHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

/* ─── Variants ────────────────────────────────────────────────────────── */

export const inputVariants = cva(
  'w-full bg-paper border border-ink-soft/20 rounded-lg text-ink placeholder:text-ink-muted/60 focus:outline-none focus:ring-1 focus:ring-teal/60 transition-all disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'px-2.5 py-1.5 text-xs',
        md: 'px-3 py-2 text-sm',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

/* ─── Props ────────────────────────────────────────────────────────────── */

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /** Accessible label text. When set, wraps the input in a <label>. */
  label?: string;
}

/* ─── Component ────────────────────────────────────────────────────────── */

/**
 * Input — styled text input with size variants and accessible label support.
 * Forwards the ref to the native <input> element.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ size, label, className, id, ...props }, ref) => {
    const input = (
      <input
        ref={ref}
        id={id}
        className={cn(inputVariants({ size }), className)}
        {...props}
      />
    );

    if (label) {
      return (
        <label htmlFor={id} className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-ink-muted">
            {label}
          </span>
          {input}
        </label>
      );
    }

    return input;
  },
);

Input.displayName = 'Input';
