/* ══════════════════════════════════════════════════════════════════════════
   PageHeader — Top page header with title, eyebrow, back button, and actions
   ══════════════════════════════════════════════════════════════════════════
   A flexible page header that displays a title with optional eyebrow text,
   back navigation, right slot, and unsaved-changes indicator dot.

   Usage:
     <PageHeader
       title="Settings"
       eyebrow="Workspace"
       backHref="/"
       rightAction={<Button size="sm">Save</Button>}
     />
   ══════════════════════════════════════════════════════════════════════════ */

import { type ReactNode } from 'react';
import { cn } from '../utils/cn';

/* ─── Props ────────────────────────────────────────────────────────────── */

export interface PageHeaderProps {
  /** Page title */
  title: string;
  /** Optional eyebrow / breadcrumb text shown above the title */
  eyebrow?: string;
  /** If provided, shows a back button linking to this href */
  backHref?: string;
  /** Optional element rendered on the right side of the header */
  rightAction?: ReactNode;
  /** When true, shows a small dot indicating unsaved changes */
  showUnsavedDot?: boolean;
  /** Additional classes */
  className?: string;
}

/* ─── Component ────────────────────────────────────────────────────────── */

/**
 * PageHeader — Top page header with title, eyebrow, back button, and right action.
 *
 * Renders a compact header row suitable for page-level layouts. Supports
 * an optional back link, an eyebrow breadcrumb, a right-side action slot,
 * and an unsaved-changes indicator dot.
 */
export function PageHeader({
  title,
  eyebrow,
  backHref,
  rightAction,
  showUnsavedDot,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2.5 px-4 py-3 shrink-0',
        className,
      )}
    >
      {backHref && (
        <a
          href={backHref}
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-ink-soft/50 dark:text-white/50 hover:text-ink-soft/70 dark:hover:text-white/70 hover:bg-ink-soft/10 dark:hover:bg-white/10 transition-colors duration-200 shrink-0"
          aria-label="Back"
        >
          {/* Chevron-left icon inline via SVG */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </a>
      )}

      <div className="flex-1 min-w-0">
        {eyebrow && (
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[11px] font-medium text-ink-soft/60 dark:text-white/40 uppercase tracking-wider">
              {eyebrow}
            </span>
            {showUnsavedDot && (
              <span
                className="inline-block w-1.5 h-1.5 rounded-full bg-ochre shrink-0"
                aria-label="Unsaved changes"
                title="You have unsaved changes"
              />
            )}
          </div>
        )}
        <h1 className="text-sm font-semibold text-ink dark:text-white truncate">
          {title}
        </h1>
      </div>

      {rightAction && (
        <div className="shrink-0">{rightAction}</div>
      )}
    </div>
  );
}

PageHeader.displayName = 'PageHeader';
