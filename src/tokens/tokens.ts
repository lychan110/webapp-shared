export const tokens = {
  colors: {
    ink: { light: '#1E1E2E', dark: '#E8E8ED' },
    'ink-soft': { light: '#4A4A5A', dark: '#A0A0B0' },
    paper: { light: '#E8E6E3', dark: '#0E0E18' },
    'paper-deep': { light: '#D8D6D3', dark: '#1A1A24' },
    'paper-soft': { light: '#F0EEF0', dark: '#161620' },
    teal: { light: '#8CC1DB', dark: '#4BC4B0' },
    'teal-pale': { light: '#B8D9E8', dark: '#6ED4C4' },
    'teal-deep': { light: '#5A9BB5', dark: '#2E8B7B' },
    coral: { light: '#E07A5F', dark: '#FF6B6B' },
    ochre: { light: '#F2CC8F', dark: '#FFD93D' },
    sage: { light: '#81B29A', dark: '#95D5B2' },
    rust: { light: '#BC6C4A', dark: '#E07A5F' },
    muted: { light: '#999999', dark: '#666666' },
    'status-success': { light: '#22C55E', dark: '#4BC4B0' },
    'status-error': { light: '#EF4444', dark: '#C44B5E' },
    'status-warning': { light: '#F59E0B', dark: '#FFD93D' },
  } as const,

  fonts: {
    display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
    body: ['"Lato"', 'system-ui', 'sans-serif'],
    mono: ['"JetBrains Mono"', 'Menlo', 'Consolas', 'monospace'],
    hand: ['"Caveat"', 'cursive'],
  } as const,

  spacing: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96] as const,

  radius: {
    sm: '4px',
    default: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  } as const,

  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    default: '0 4px 8px rgba(0,0,0,0.1)',
    md: '0 8px 16px rgba(0,0,0,0.12)',
    lg: '0 16px 32px rgba(0,0,0,0.15)',
    glow: '0 0 20px rgba(140,193,219,0.3)',
  } as const,
} as const;

export type StudioToken = typeof tokens;
export type ThemeMode = 'light' | 'dark';
export type ColorKey = keyof typeof tokens.colors;
