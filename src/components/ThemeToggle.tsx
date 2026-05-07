import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';
import { IconButton } from './IconButton';
import { Sun, Moon } from 'lucide-react';

/* ─── Variants ────────────────────────────────────────────────────────── */

export const themeToggleVariants = cva('', {
  variants: {
      variant: {
        default: '',
        glass:
          'bg-white/10 dark:bg-white/10 border border-white/10 dark:border-white/20 hover:bg-white/20 dark:hover:bg-white/20',
      },
  },
  defaultVariants: {
      variant: 'default',
  },
});

/* ─── Props ────────────────────────────────────────────────────────────── */

export interface ThemeToggleProps extends VariantProps<typeof themeToggleVariants> {
  isDark: boolean;
  onToggle: () => void;
  className?: string;
}

/* ─── Component ────────────────────────────────────────────────────────── */

export function ThemeToggle({ isDark, onToggle, variant, className }: ThemeToggleProps) {
  return (
    <IconButton
      onClick={onToggle}
      label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(themeToggleVariants({ variant }), className)}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </IconButton>
  );
}

ThemeToggle.displayName = 'ThemeToggle';
