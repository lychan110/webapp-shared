/* ══════════════════════════════════════════════════════════════════════════
   EmptyState — placeholder for when there's nothing to show
   ══════════════════════════════════════════════════════════════════════════
   Extracted from Rolodex's `.empty-state` CSS pattern. Shows an optional
   icon/emoji, image, message, description, and action button(s).

   Usage:
     <EmptyState
       icon="🔍"
       message="No apps match this filter"
     />
     <EmptyState
       icon="⚙️"
       message="Service unavailable"
       action={{ label: 'Retry', onClick: refetch }}
     />
     <EmptyState
       variant="compact"
       icon="📭"
       message="No results"
       secondaryAction={{ label: 'Clear filters', onClick: clearFilters }}
     />
     <EmptyState
       imageUrl="/illustrations/empty.svg"
       message="No data yet"
       action={{ label: 'Get started', onClick: start }}
     />
   ══════════════════════════════════════════════════════════════════════════ */

import type { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

/* ─── Variants ────────────────────────────────────────────────────────── */

export const emptyStateVariants = cva(
  'text-center rounded-2xl border bg-white/5 dark:bg-white/[0.03] backdrop-blur-xl border-ink-soft/10 dark:border-white/10',
  {
    variants: {
      variant: {
        default: 'p-8',
        compact: 'p-4',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

/* ─── Types ───────────────────────────────────────────────────────────── */

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

export interface EmptyStateProps extends VariantProps<typeof emptyStateVariants> {
  /** Icon or emoji (optional) */
  icon?: string | ReactNode;
  /** Main message */
  message: string;
  /** Optional sub-message */
  description?: string;
  /** Optional primary action button */
  action?: EmptyStateAction;
  /** Optional secondary action button */
  secondaryAction?: EmptyStateAction;
  /** Optional URL for an illustration image (shown before the icon) */
  imageUrl?: string;
  /** Additional classes */
  className?: string;
}

/* ─── Component ────────────────────────────────────────────────────────── */

/**
 * EmptyState — A placeholder shown when there's no content to display.
 *
 * Supports an optional icon/emoji, illustration image, message, description,
 * and up to two action buttons. Comes in `default` and `compact` variants.
 */
export function EmptyState({
  variant,
  icon,
  message,
  description,
  action,
  secondaryAction,
  imageUrl,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(emptyStateVariants({ variant }), className)}>
      {imageUrl && (
        <div className={cn('flex justify-center', variant === 'compact' ? 'mb-2' : 'mb-4')}>
          <img
            src={imageUrl}
            alt=""
            className={cn(
              'object-contain',
              variant === 'compact' ? 'w-24 h-24' : 'w-32 h-32',
            )}
          />
        </div>
      )}
      {icon && (
        <div className={cn(
          'flex justify-center',
          variant === 'compact' ? 'mb-1.5 text-2xl' : 'mb-3 text-3xl',
        )}>
          {typeof icon === 'string' ? <span>{icon}</span> : icon}
        </div>
      )}
      <p className={cn(
        'text-ink-soft dark:text-white/50',
        variant === 'compact' ? 'text-xs' : 'text-sm',
      )}>
        {message}
      </p>
      {description && (
        <p className={cn(
          'text-ink-soft/60 dark:text-white/30 mt-1',
          variant === 'compact' ? 'text-[11px]' : 'text-xs',
        )}>
          {description}
        </p>
      )}
      {(action || secondaryAction) && (
        <div className={cn(
          'flex items-center justify-center gap-2',
          variant === 'compact' ? 'mt-3' : 'mt-4',
        )}>
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="px-4 py-1.5 text-xs rounded-full border border-ink-soft/20 dark:border-white/20 text-ink-soft dark:text-white/70 hover:bg-ink-soft/10 dark:hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-200"
              type="button"
            >
              {secondaryAction.label}
            </button>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className="px-4 py-1.5 text-xs rounded-full bg-teal/10 text-teal border border-teal/30 hover:bg-teal/20 hover:-translate-y-0.5 transition-all duration-200"
              type="button"
            >
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

EmptyState.displayName = 'EmptyState';
