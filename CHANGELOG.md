# Changelog

## [0.4.0] — 2026-05-29

### Added
- **12 utilities**: sleep, slugify, download (file/JSON/CSV), todaySlug, toBase64Url, resolvePath, isWithinDirs, request (typed fetch), detectLanguage, fetchWithBackoff, diff (LCS), email-deobfuscate, readConfigKey
- **9 new components**: Profile, Toggle, Field, Toast, Input, Icon (40+ SVG icons), StatusPill, ErrorBanner, TypingDots, SegmentControl, PageHeader, FilterableLedger, Tree
- **4 new hooks**: useScrollFade, useWebSocket, useFileImport, useControllableState
- **8 server-side patterns**: config-router, watcher-manager, resolve-interpreter, fs-tree, event-hub, ws-client, runtime-settings, crypto (AES-256-GCM)
- **Platform identity tokens**: platform definitions and colors from Chimera
- **CSS additions**: blob-drift animations, prefers-reduced-motion, scrollbar-hide utility
- **Tests**: Vitest with 40 passing tests across 5 test suites
- npm scripts: `test`, `test:watch`, `lint`, `build-tokens`
- Enhanced EmptyState component (compact variant, secondaryAction, imageUrl)

### Fixed
- `build-tokens.js`: regex and font parser now correctly handle current tokens.ts format
- `@custom-variant dark` changed from `:where()` to `:is()` for correct specificity
- Animation keyframes renamed to kebab-case for Tailwind v4 compatibility
- Unused `ReactNode` import removed from Profile component

### Changed
- Package version from 0.2.0 → 0.4.0
- Package is now public (not private)
- `.gitignore` hardened for public repo (blocks env files, secrets, certs)
- Server-only utilities separated into `./server/*` export path

## [0.2.0] — 2026-05-07

### Added
- 10 shared components: Button, Card, Badge, Tag, IconButton, ThemeToggle, Modal (compound), AutoRefreshToggle, Skeleton, EmptyState
- 6 shared hooks: useLocalStorage, useMediaQuery, useDebounce, useHealthCheck, useOnClickOutside, useKeyboard
- ThemeProvider with flash-free hydration and system preference detection
- Tailwind v4 `@theme` block (`tokens.css`) with Studio design tokens
- Base styles (`base.css`): glass effect, blobs, scrollbar, focus ring, line-clamp
- Font imports (`fonts.css`): Cormorant Garamond, Lato, JetBrains Mono, Caveat
- `cn()` utility (clsx + tailwind-merge)
- `build-tokens.js` script to generate CSS variables and JSON from TS tokens

### Fixed
- `build-tokens.js`: regex parsing now handles nested token objects
- `build-tokens.js`: corrupted source path replaced with proper `resolve()` call
- Token generation now produces correct CSS variables for both light and dark modes

## [0.1.0] — 2026-05-06

### Added
- Initial scaffolding
- `tokens.ts` with Studio design tokens (colors, fonts, spacing, radius, shadows)
- `package.json` with exports map
- TypeScript configuration
