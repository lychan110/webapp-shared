import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

/* ─── Variants ────────────────────────────────────────────────────────── */

export const cardVariants = cva('rounded-2xl transition-all duration-300', {
  variants: {
    variant: {
      default:
        'bg-paper-deep/50 dark:bg-paper-deep/50 border border-ink-soft/10 dark:border-white/10 shadow-lg',
      glass:
        'backdrop-blur-xl bg-white/10 dark:bg-white/8 border border-white/10 dark:border-white/10 shadow-lg',
      elevated:
        'bg-paper-deep dark:bg-paper-deep border border-ink-soft/10 dark:border-white/10 shadow-xl',
      sunken:
        'bg-paper-soft dark:bg-paper-soft border border-ink-soft/5 dark:border-white/5',
    },
    padding: {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    },
    interactive: {
      true: 'cursor-pointer hover:-translate-y-1 hover:shadow-xl',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'glass',
    padding: 'md',
    interactive: false,
  },
});

/* ─── Props ────────────────────────────────────────────────────────────── */

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: ReactNode;
}

/* ─── Component ────────────────────────────────────────────────────────── */

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant, padding, interactive, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, interactive }), className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';
