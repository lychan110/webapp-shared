/* ══════════════════════════════════════════════════════════════════════════
   EmptyState — placeholder for when there's nothing to show
   ══════════════════════════════════════════════════════════════════════════
   Extracted from Rolodex's `.empty-state` CSS pattern. Shows an optional
   icon/emoji, message, and action button.

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
   ══════════════════════════════════════════════════════════════════════════ */

import type { ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

export interface EmptyStateProps {
  /** Icon or emoji (optional) */
  icon?: string | ReactNode;
  /** Main message */
  message: string;
  /** Optional sub-message */
  description?: string;
  /** Optional action button */
  action?: EmptyStateAction;
  /** Additional classes */
  className?: string;
}

export function EmptyState({
  icon,
  message,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'p-8 text-center rounded-2xl bg-white/5 dark:bg-white/[0.03] backdrop-blur-xl border border-ink-soft/10 dark:border-white/10',
        className,
      )}
    >
      {icon && (
        <div className="text-3xl mb-3">
          {typeof icon === 'string' ? <span>{icon}</span> : icon}
        </div>
      )}
      <p className="text-sm text-ink-soft dark:text-white/50">{message}</p>
      {description && (
        <p className="text-xs text-ink-soft/60 dark:text-white/30 mt-1">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-1.5 text-xs rounded-full bg-teal/10 text-teal border border-teal/30 hover:bg-teal/20 hover:-translate-y-0.5 transition-all duration-200"
          type="button"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
