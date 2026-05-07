import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';

/* ─── Sizes ────────────────────────────────────────────────────────────── */

const iconButtonSizes = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-11 h-11 text-base',
} as const;

/* ─── Props ────────────────────────────────────────────────────────────── */

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  /** Required for accessibility */
  label: string;
  size?: keyof typeof iconButtonSizes;
}

/* ─── Component ────────────────────────────────────────────────────────── */

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, className, size = 'md', label, ...props }, ref) => {
    return (
      <button
        ref={ref}
        aria-label={label}
        title={label}
        className={cn(
          'inline-flex items-center justify-center rounded-lg border transition-colors duration-200',
          'border-ink-soft/20 dark:border-white/20 bg-transparent',
          'text-ink-soft dark:text-white/70',
          'hover:bg-ink-soft/10 dark:hover:bg-white/20',
          'focus-visible:outline-2 focus-visible:outline-teal focus-visible:outline-offset-2',
          iconButtonSizes[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';
