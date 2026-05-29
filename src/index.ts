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
export { createEventHub } from './utils/event-hub';
export { createWSClient } from './utils/ws-client';
export type { WSClient, WSClientOptions, WSClientEventMap, WSData } from './utils/ws-client';

/* ─── Hooks ────────────────────────────────────────────────────────── */
export { useLocalStorage } from './hooks/useLocalStorage';
export { useMediaQuery } from './hooks/useMediaQuery';
export { useDebounce } from './hooks/useDebounce';
export { useHealthCheck } from './hooks/useHealthCheck';
export type { HealthStatus } from './hooks/useHealthCheck';
export { useOnClickOutside } from './hooks/useOnClickOutside';
export { useKeyboard } from './hooks/useKeyboard';
export { useScrollFade } from './hooks/useScrollFade';
export { useWebSocket } from './hooks/useWebSocket';
export { useFileImport } from './hooks/useFileImport';
export { useControllableState } from './hooks/useControllableState';

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
export { SegmentControl } from './components/SegmentControl';
export type { SegmentOption, SegmentControlProps } from './components/SegmentControl';

export { PageHeader } from './components/PageHeader';
export type { PageHeaderProps } from './components/PageHeader';

export { EmptyState, emptyStateVariants } from './components/EmptyState';
export type { EmptyStateProps, EmptyStateAction } from './components/EmptyState';

export { FilterableLedger } from './components/FilterableLedger';
export type {
  LedgerColumn,
  FilterableLedgerProps,
} from './components/FilterableLedger';

export { Tree } from './components/Tree';
export type { TreeNode, TreeProps } from './components/Tree';
export { Profile } from './components/Profile';
export type { ProfileProps } from './components/Profile';
export { Toggle, toggleVariants, toggleThumbVariants } from './components/Toggle';
export type { ToggleProps } from './components/Toggle';
export { Field } from './components/Field';
export type { FieldProps } from './components/Field';
export { Toast, ToastProvider, useToast, toastVariants } from './components/Toast';
export type { ToastProps } from './components/Toast';
export { Input, inputVariants } from './components/Input';
export type { InputProps } from './components/Input';
export { Icon } from './components/Icon';
export type { IconName, IconProps } from './components/Icon';
export { StatusPill, statusPillVariants, statusToVariant } from './components/StatusPill';
export type { StatusPillProps } from './components/StatusPill';
export { ErrorBanner } from './components/ErrorBanner';
export type { ErrorBannerProps } from './components/ErrorBanner';
export { TypingDots } from './components/TypingDots';
export type { TypingDotsProps } from './components/TypingDots';
