# Changelog

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
- This CHANGELOG

### Fixed
- `build-tokens.js`: regex parsing now handles nested token objects (was using `[^}]+` which broke on braces)
- `build-tokens.js`: corrupted source path (`SRC_TOKENS=***`) replaced with proper `resolve()` call
- Token generation now produces correct CSS variables for both light and dark modes

### Changed
- Package version from 0.1.0 → 0.2.0
- Full design token pipeline: `tokens.ts` is the single source of truth, `tokens.css` and `tokens-generated.css` are derived

## [0.1.0] — 2026-05-06

### Added
- Initial scaffolding
- `tokens.ts` with Studio design tokens (colors, fonts, spacing, radius, shadows)
- `package.json` with exports map
- TypeScript configuration
