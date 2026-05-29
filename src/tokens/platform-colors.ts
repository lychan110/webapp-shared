/* ══════════════════════════════════════════════════════════════════════════
   Platform colour tokens — CSS variable name mappings
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * Maps each known platform id to its CSS custom property name.
 *
 * Usage in stylesheets:
 * ```css
 * .platform-dot { background: var(--color-platform-hermes); }
 * ```
 *
 * Source: extracted from chimera apps/web/src/lib/platform-colors.ts
 */
export const PLATFORM_COLOR_VARS: Record<string, string> = {
  hermes:        '--color-platform-hermes',
  claude:        '--color-platform-claude',
  'claude-code': '--color-platform-claude-code',
  opencode:      '--color-platform-opencode',
  copilot:       '--color-platform-copilot',
  codex:         '--color-platform-codex',
  custom:        '--color-platform-custom',
} as const;

/** CSS variable for the default/fallback platform dot colour. */
export const PLATFORM_COLOR_VAR_DEFAULT = '--color-platform-default';

/**
 * Resolve the CSS custom property name for a given platform id.
 * Falls back to {@link PLATFORM_COLOR_VAR_DEFAULT} for unknown ids.
 */
export function platformColorVar(platform?: string | null): string {
  if (platform && platform in PLATFORM_COLOR_VARS) {
    return PLATFORM_COLOR_VARS[platform];
  }
  return PLATFORM_COLOR_VAR_DEFAULT;
}

/**
 * Inline HSL colour values for each platform.
 * Duplicated from `platforms.ts` so consumers that only need colours
 * can import this lighter module without the full platform definitions.
 */
export const PLATFORM_COLORS: Record<string, string> = {
  hermes:        'hsl(162, 52%, 52%)',  // royal emerald
  claude:        'hsl(16, 65%, 62%)',   // copper / warm orange
  'claude-code': 'hsl(16, 65%, 62%)',   // same as `claude`
  opencode:      'hsl(22, 90%, 58%)',   // bright orange
  copilot:       'hsl(190, 60%, 56%)',  // teal
  codex:         'hsl(225, 65%, 66%)',  // steel blue
  custom:        'hsl(0, 0%, 75%)',     // neutral grey
} as const;
