import { type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

/* ─── Variants ────────────────────────────────────────────────────────── */

export const tagVariants = cva(
  'inline-flex items-center gap-1 rounded-full text-xs font-medium transition-all duration-200 select-none',
  {
    variants: {
      variant: {
        default:
          'bg-paper-deep/50 dark:bg-white/8 text-ink-soft/80 dark:text-white/70 border border-ink-soft/10 dark:border-white/10 hover:bg-teal/20 hover:text-teal',
        active:
          'bg-teal text-white dark:text-paper border-transparent',
        outline:
          'border border-ink-soft/20 dark:border-white/20 text-ink-soft dark:text-white/70',
      },
      size: {
        sm: 'px-2 py-0.5',
        md: 'px-3 py-1',
        lg: 'px-4 py-1.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

/* ─── Props ────────────────────────────────────────────────────────────── */

export interface TagProps extends VariantProps<typeof tagVariants> {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  /** If true, renders as a button for interactivity */
  interactive?: boolean;
}

/* ─── Component ────────────────────────────────────────────────────────── */

export function Tag({
  variant,
  size,
  children,
  className,
  onClick,
  interactive = false,
}: TagProps) {
  const cls = cn(tagVariants({ variant, size }), className);

  if (interactive || onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cls}
      >
        {children}
      </button>
    );
  }

  return <span className={cls}>{children}</span>;
}

Tag.displayName = 'Tag';
