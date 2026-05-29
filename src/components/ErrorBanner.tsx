/* ══════════════════════════════════════════════════════════════════════════
   ErrorBanner — alert banner for error messages
   ══════════════════════════════════════════════════════════════════════════
   Displays an error notification with icon, title, detail message, and
   optional dismiss button. Used for transient errors, API failures, and
   connection issues.

   Usage:
     <ErrorBanner title="Connection lost" detail="The server is unreachable." />
     <ErrorBanner
       title="Save failed"
       detail="Check your permissions and try again."
       onDismiss={() => setShowError(false)}
     />
   ══════════════════════════════════════════════════════════════════════════ */

import { cn } from '../utils/cn';
import { Icon } from './Icon';
import type { IconName } from './Icon';

/* ─── Props ────────────────────────────────────────────────────────────── */

export interface ErrorBannerProps {
  /** Error title (bold, primary text) */
  title: string;
  /** Error detail / description (secondary text) */
  detail?: string;
  /** Icon name override (default: 'alert-circle') */
  icon?: IconName;
  /** Callback when dismiss button is clicked. Providing this enables the close button. */
  onDismiss?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/* ─── Component ────────────────────────────────────────────────────────── */

export function ErrorBanner({
  title,
  detail,
  icon = 'alert-circle',
  onDismiss,
  className,
}: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 rounded-xl border border-rust/30 bg-rust/10 p-4',
        'dark:border-rust/20 dark:bg-rust/[0.08]',
        className,
      )}
    >
      {/* Icon */}
      <Icon
        name={icon}
        size={20}
        className="mt-0.5 flex-shrink-0 text-rust"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-rust dark:text-rust">
          {title}
        </p>
        {detail && (
          <p className="mt-1 text-xs text-ink-soft/80 dark:text-white/60 leading-relaxed">
            {detail}
          </p>
        )}
      </div>

      {/* Dismiss */}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss error"
          className={cn(
            'flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-md',
            'text-rust/60 hover:text-rust',
            'hover:bg-rust/10 dark:hover:bg-rust/20',
            'transition-colors duration-150',
            'focus-visible:outline-2 focus-visible:outline-rust focus-visible:outline-offset-2',
          )}
        >
          <Icon name="x" size={14} />
        </button>
      )}
    </div>
  );
}

ErrorBanner.displayName = 'ErrorBanner';
