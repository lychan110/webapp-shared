import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

/* ─── Variants ────────────────────────────────────────────────────────── */

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 rounded-full text-xs font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-teal focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-[#794BC4] to-[#5E3599] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5',
        secondary:
          'bg-white/10 dark:bg-white/10 text-ink-soft dark:text-white/80 border border-ink-soft/20 dark:border-white/20 hover:bg-white/20 dark:hover:bg-white/20 hover:-translate-y-0.5',
        ghost:
          'text-ink-soft/50 dark:text-white/50 hover:text-ink-soft/70 dark:hover:text-white/70 hover:-translate-y-0.5',
        danger:
          'bg-rust/10 text-rust border border-rust/30 hover:bg-rust/20 hover:-translate-y-0.5',
      },
      size: {
        sm: 'px-2.5 py-1',
        md: 'px-3 py-1.5',
        lg: 'px-4 py-2',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

/* ─── Props ────────────────────────────────────────────────────────────── */

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
}

/* ─── Component ────────────────────────────────────────────────────────── */

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
