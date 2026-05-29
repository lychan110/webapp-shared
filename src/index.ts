/* ══════════════════════════════════════════════════════════════════════════
   @lenya/webapp-shared — Public API
   ══════════════════════════════════════════════════════════════════════════ */

/* ─── Tokens ───────────────────────────────────────────────────────── */
export { tokens } from './tokens/tokens';
export type { StudioToken, ThemeMode, ColorKey } from './tokens/tokens';

/* ─── Utils ────────────────────────────────────────────────────────── */
export { cn } from './utils/cn';
export { toBase64Url } from './utils/base64';
export { resolvePath } from './utils/resolve-path';
export { isWithinDirs } from './utils/is-within-dirs';
export { req } from './utils/request';
export { detectLanguage } from './utils/detect-language';
export { fetchWithBackoff } from './utils/fetch-with-backoff';
export { diffLines, withContext, countChanges } from './utils/diff';
export type { DiffLine, HunkLine } from './utils/diff';
export { deobfuscateEmail } from './utils/email-deobfuscate';
export { readConfigKey } from './utils/read-config-key';
export { sleep } from './utils/sleep';
export { slugify } from './utils/slugify';
export { downloadFile, downloadJSON, downloadCSV } from './utils/download';
export { todaySlug } from './utils/today-slug';

/* ─── Hooks ────────────────────────────────────────────────────────── */
export { useLocalStorage } from './hooks/useLocalStorage';
export { useMediaQuery } from './hooks/useMediaQuery';
export { useDebounce } from './hooks/useDebounce';
export { useHealthCheck } from './hooks/useHealthCheck';
export type { HealthStatus } from './hooks/useHealthCheck';
export { useOnClickOutside } from './hooks/useOnClickOutside';
export { useKeyboard } from './hooks/useKeyboard';

/* ─── Providers ────────────────────────────────────────────────────── */
export { ThemeProvider, useTheme } from './providers/ThemeProvider';
export type { ThemeMode as ProviderThemeMode } from './providers/ThemeProvider';

/* ─── Components ───────────────────────────────────────────────────── */
export { Button, buttonVariants } from './components/Button';
export type { BadgeProps } from './components/Badge';
export { Card, cardVariants } from './components/Card';
export { Badge, badgeVariants } from './components/Badge';
export { Tag, tagVariants } from './components/Tag';
export { IconButton } from './components/IconButton';
export { ThemeToggle, themeToggleVariants } from './components/ThemeToggle';
export {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ModalClose,
} from './components/Modal';
export { AutoRefreshToggle } from './components/AutoRefreshToggle';
export type { AutoRefreshToggleProps } from './components/AutoRefreshToggle';
export { Skeleton } from './components/Skeleton';
export type { SkeletonProps } from './components/Skeleton';
export { EmptyState } from './components/EmptyState';
export type { EmptyStateProps, EmptyStateAction } from './components/EmptyState';
