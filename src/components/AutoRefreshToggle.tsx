/* ══════════════════════════════════════════════════════════════════════════
   AutoRefreshToggle — on/off pill slider with interval label
   ══════════════════════════════════════════════════════════════════════════
   Extracted from Rolodex LiteLLMUsage / OpenCodeZenUsage — exact pattern
   used in both widgets, no reason to duplicate.

   Usage:
     <AutoRefreshToggle on={autoRefresh} onToggle={setAutoRefresh} />
   ══════════════════════════════════════════════════════════════════════════ */

import { cn } from '../utils/cn';

export interface AutoRefreshToggleProps {
  /** Whether auto-refresh is enabled */
  on: boolean;
  /** Toggle callback */
  onToggle: (on: boolean) => void;
  /** Label for the interval (default: '30s') */
  intervalLabel?: string;
  /** Size variant */
  size?: 'sm' | 'md';
  /** Additional classes */
  className?: string;
}

export function AutoRefreshToggle({
  on,
  onToggle,
  intervalLabel = '30s',
  size = 'sm',
  className,
}: AutoRefreshToggleProps) {
  const sizeMap = {
    sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4', label: 'text-[11px]' },
    md: { track: 'w-10 h-5', thumb: 'w-3.5 h-3.5', translate: 'translate-x-5', label: 'text-xs' },
  };

  const s = sizeMap[size];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        onClick={() => onToggle(!on)}
        className={`relative ${s.track} rounded-full transition-colors duration-200 ${
          on ? 'bg-teal' : 'bg-white/20'
        }`}
        title={on ? `Auto-refresh on (${intervalLabel})` : 'Auto-refresh off'}
        aria-label={on ? 'Disable auto-refresh' : 'Enable auto-refresh'}
        type="button"
      >
        <span
          className={`absolute top-0.5 left-0.5 ${s.thumb} rounded-full bg-white transition-transform duration-200 ${
            on ? s.translate : ''
          }`}
        />
      </button>
      <span
        className={`${s.label} text-ink-soft dark:text-white/50 min-w-[6ch] tabular-nums`}
      >
        {on ? intervalLabel : 'off'}
      </span>
    </div>
  );
}
