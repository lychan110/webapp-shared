import { type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

/* ─── Variants ────────────────────────────────────────────────────────── */

export const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-ink-soft/10 text-ink-soft dark:text-white/70',
        success: 'bg-teal/10 text-teal',
        error: 'bg-rust/10 text-rust',
        warning: 'bg-ochre/10 text-ochre',
        outline:
          'border border-ink-soft/20 dark:border-white/20 text-ink-soft dark:text-white/70',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2.5 py-1',
        lg: 'px-3 py-1.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

/* ─── Status dot ───────────────────────────────────────────────────────── */

interface StatusDotProps {
  status: 'up' | 'down' | 'checking' | 'error';
  className?: string;
}

function StatusDot({ status, className }: StatusDotProps) {
  return (
    <span
      className={cn(
        'inline-block w-2 h-2 rounded-full flex-shrink-0',
        status === 'up' && 'bg-teal shadow-[0_0_8px_var(--color-teal)] animate-pulse-glow',
        status === 'down' && 'bg-rust shadow-[0_0_8px_var(--color-rust)]',
        status === 'error' && 'bg-rust shadow-[0_0_8px_var(--color-rust)]',
        status === 'checking' && 'bg-ochre animate-pulse',
        className,
      )}
    />
  );
}

/* ─── Props ────────────────────────────────────────────────────────────── */

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children?: ReactNode;
  className?: string;
  /** Show a colored status dot before the label */
  status?: 'up' | 'down' | 'checking' | 'error';
  /** Dot label displayed when status is set */
  statusLabel?: string;
}

/* ─── Component ────────────────────────────────────────────────────────── */

export function Badge({
  variant,
  size,
  status,
  statusLabel,
  className,
  children,
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)}>
      {status && <StatusDot status={status} />}
      {statusLabel && status && (
        <span className="sr-only">{statusLabel}</span>
      )}
      {children}
    </span>
  );
}

Badge.displayName = 'Badge';
