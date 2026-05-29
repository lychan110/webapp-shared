/* ══════════════════════════════════════════════════════════════════════════
   StatusPill — state-driven status indicator with color-coded dot + label
   ══════════════════════════════════════════════════════════════════════════
   Displays a colored dot with accompanying label text to indicate the
   current status of a service, job, or connection.

   Usage:
     <StatusPill variant="up" label="Connected" />
     <StatusPill variant="error" label="Disconnected" />
     <StatusPill variant="checking" label="Checking..." size="sm" />
   ══════════════════════════════════════════════════════════════════════════ */

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

/* ─── Variants ────────────────────────────────────────────────────────── */

export const statusPillVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full font-medium transition-colors',
  {
    variants: {
      variant: {
        up: 'text-teal',
        down: 'text-rust',
        checking: 'text-ochre',
        error: 'text-rust',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'checking',
      size: 'md',
    },
  },
);

/* ─── Status dot ──────────────────────────────────────────────────────── */

interface StatusDotProps {
  variant: 'up' | 'down' | 'checking' | 'error';
  className?: string;
}

function StatusDot({ variant, className }: StatusDotProps) {
  return (
    <span
      className={cn(
        'inline-block w-2 h-2 rounded-full flex-shrink-0',
        variant === 'up' &&
          'bg-teal shadow-[0_0_6px_var(--color-teal)]',
        variant === 'down' &&
          'bg-rust shadow-[0_0_6px_var(--color-rust)]',
        variant === 'error' &&
          'bg-rust shadow-[0_0_6px_var(--color-rust)]',
        variant === 'checking' &&
          'bg-ochre animate-pulse shadow-[0_0_6px_var(--color-ochre)]',
        className,
      )}
      aria-hidden="true"
    />
  );
}

/* ─── Props ────────────────────────────────────────────────────────────── */

export interface StatusPillProps extends VariantProps<typeof statusPillVariants> {
  /** Status label text displayed next to the dot */
  label: string;
  /** Additional CSS classes */
  className?: string;
}

/* ─── Component ────────────────────────────────────────────────────────── */

export function StatusPill({
  variant = 'checking',
  size = 'md',
  label,
  className,
}: StatusPillProps) {
  return (
    <span className={cn(statusPillVariants({ variant, size }), className)}>
      <StatusDot variant={variant ?? 'checking'} />
      <span>{label}</span>
    </span>
  );
}

StatusPill.displayName = 'StatusPill';

/* ─── Utility: map arbitrary status strings to variant ─────────────────── */

/**
 * Map a free-form status string to one of the four StatusPill variants.
 * Handles common state names from job runners, health checks, and APIs.
 *
 * @example
 *   statusToVariant('connected')    // → 'up'
 *   statusToVariant('failed')       // → 'down'
 *   statusToVariant('pending')      // → 'checking'
 *   statusToVariant('disconnected') // → 'error'
 */
export function statusToVariant(status: string): 'up' | 'down' | 'checking' | 'error' {
  const s = status.toLowerCase();

  const upStates = new Set([
    'ok',
    'up',
    'on',
    'connected',
    'completed',
    'approved',
    'success',
    'done',
    'active',
    'healthy',
    'running',
  ]);
  const downStates = new Set([
    'down',
    'off',
    'error',
    'failed',
    'failure',
    'dead',
    'unhealthy',
    'crashed',
    'stopped',
    'denied',
    'rejected',
  ]);
  const errorStates = new Set([
    'disconnected',
    'timeout',
    'unreachable',
    'critical',
    'fatal',
  ]);

  if (upStates.has(s)) return 'up';
  if (errorStates.has(s)) return 'error';
  if (downStates.has(s)) return 'down';

  // Everything else — pending, running, checking, starting, etc. — maps to 'checking'
  return 'checking';
}
