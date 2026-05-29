# Shared Ecosystem Refactor Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Transform `@lenya/webapp-shared` into a cohesive design-system + utility library consumed by all 6 webapps, eliminate duplicated code across repos, and ensure all apps contribute to and benefit from the shared submodule.

**Architecture:** Each webapp gets a `shared/` git submodule → `@lenya/webapp-shared`. All 6 apps pull from the same source. Refactors proceed webapp-by-webapp, extracting reusable code to shared first, then migrating apps to consume shared components/hooks/utils. Githooks ensure submodule stays current.

**Tech Stack:** TypeScript 5, React 18/19, Tailwind CSS v4, Vite 5-6, Node.js 22, Express/Fastify, pnpm (chimera only), Astro 4 (portfolio only).

**Webapps audited:**
| App | Tech | Has shared submodule? | Source count |
|-----|------|-----------------------|-------------|
| rolodex | React+Vite+Express | ✅ Yes | ~25 files |
| brain-bound | React+Vite+Fastify (monorepo) | ❌ No | ~94 files |
| chimera | React+Vite+Express (pnpm) | ❌ No | ~60 files |
| contact-scout | React+Vite (static) | ❌ No | ~4 files |
| rsvp-automation | React+Vite (inviteflow) | ❌ No | ~50 files |
| lychan110.github.io | Astro+React | ❌ No | ~31 files |

---

## Phase 0: Shared Library Foundation

### Task 0.1: Clean up shared library issues

**Execution:** 🅾️ OpenCode

**Objective:** Fix existing issues in shared before adding more code

**Files:**
- Modify: `src/scripts/build-tokens.js`
- Verify: `dist/tokens.json`

**Step 1: Fix `build-tokens.js` regex**

The colors and fonts regex fails on current `tokens.ts` format — `dist/tokens.json` has empty `"colors":{}` and `"fonts":{}`. Fix the regex parsing.

**Step 2: Rebuild and verify**

```bash
node src/scripts/build-tokens.js
cat dist/tokens.json | jq '.colors | length'  # Should be 16
cat dist/tokens.json | jq '.fonts | length'   # Should be 4
```

**Step 3: Fix `@custom-variant dark` in tokens.css**

Change `&:where(.dark, .dark *)` to `&:is(.dark, .dark *)` so consuming apps don't need their own override.

**Step 4: Fix animation name mismatch**

Shared defines `fadeUp` (camelCase) keyframe but rolodex uses `fade-up` (kebab-case). Align to kebab-case everywhere (Tailwind convention).

**Step 5: Commit**

```bash
git add src/scripts/build-tokens.js src/styles/tokens.css
git commit -m "fix: repair token build script, dark variant specificity, animation naming"
```

### Task 0.2: Add missing shared CSS patterns

**Execution:** 🅾️ OpenCode

**Objective:** Add scrollbar-hide, prefers-reduced-motion, blob-drift animations to shared

**Files:**
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/base.css`

**Step 1: Add blob-drift animations to tokens.css**

Move `@keyframes blob-drift` and `.blob-animate` utilities from rolodex to shared `tokens.css`.

**Step 2: Add prefers-reduced-motion to base.css**

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Step 3: Add scrollbar-hide to base.css**

```css
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar { display: none; }
```

**Step 4: Commit**

```bash
git add src/styles/tokens.css src/styles/base.css
git commit -m "feat: add blob-drift, prefers-reduced-motion, scrollbar-hide to shared"
```

### Task 0.3: Install githooks on all webapps

**Execution:** 🄸 Inline

**Objective:** Every webapp that adds the shared submodule gets `.githooks/` with post-checkout and post-merge to keep submodules current.

**Githook contents:**

`.githooks/post-checkout`:
```sh
#!/bin/sh
git submodule update --init --recursive
```

`.githooks/post-merge`:
```sh
#!/bin/sh
git submodule update --init --recursive
```

**Step 1: Install on rolodex** (already done — verify)

```bash
ls ~/webapps/rolodex/.githooks/
chmod +x ~/webapps/rolodex/.githooks/*
```

**Step 2: Configure git to use .githooks dir on each repo**

```bash
# Run in each repo after adding .githooks/
git config core.hooksPath .githooks
```

(This is done per-repo, not globally — each webapp controls its own hooks path.)

**Step 3: Install on brain-bound, chimera, contact-scout, rsvp-automation, lychan110.github.io**

Same files and `git config core.hooksPath .githooks` in each.

**Step 4: Verify**

```bash
# In each repo:
git config core.hooksPath  # Should output: .githooks
ls .githooks/
```

---

## Phase 1: Quick Wins — Trivial Utilities (all apps → shared)

### Task 1.1: Extract `sleep()` utility

**Execution:** 🅾️ OpenCode

**Objective:** `sleep(ms)` exists in contact-scout and rsvp-automation. Extract to shared.

**Files:**
- Create: `shared/src/utils/sleep.ts`
- Modify: `shared/src/index.ts` (export)

**Implementation:**
```typescript
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

**Commit:**
```bash
git add src/utils/sleep.ts src/index.ts
git commit -m "feat: add sleep() utility"
```

### Task 1.2: Extract `slugify()` utility

**Execution:** 🅾️ OpenCode

**Source:** rolodex `src/pages/SettingsPage.tsx:8-10`

**Files:**
- Create: `shared/src/utils/slugify.ts`

**Implementation:**
```typescript
export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
```

### Task 1.3: Extract `downloadFile()` utility

**Execution:** 🅾️ OpenCode

**Source:** contact-scout `src/App.tsx` (3x duplication of URL.createObjectURL pattern)

**Files:**
- Create: `shared/src/utils/download.ts`

**Implementation:**
```typescript
export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadJSON(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  downloadFile(blob, filename);
}

export function downloadCSV(headers: string[], rows: string[][], filename: string): void {
  const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  downloadFile(blob, filename);
}
```

### Task 1.4: Extract `todaySlug()` utility

**Execution:** 🅾️ OpenCode

**Source:** rsvp-automation `src/scout/utils.ts`

**Files:**
- Create: `shared/src/utils/today-slug.ts`

**Implementation:**
```typescript
export function todaySlug(): string {
  return new Date().toISOString().slice(0, 10);
}
```

### Task 1.5: Extract `toBase64Url()` utility

**Execution:** 🅾️ OpenCode

**Source:** rsvp-automation `src/inviteflow/api/gmail.ts`

**Files:**
- Create: `shared/src/utils/base64.ts`

### Task 1.6: Extract `isWithinDirs()` / `resolvePath()` server utils

**Execution:** 🅾️ OpenCode

**Source:** rolodex `server/utils.ts`

**Files:**
- Create: `shared/src/utils/resolve-path.ts`
- Create: `shared/src/utils/is-within-dirs.ts`

Note: These are Node-specific (`path`, `os` modules). Add a separate `shared/server/` export path or mark as server-only.

### Task 1.7: Extract `req()` typed fetch wrapper

**Execution:** 🅾️ OpenCode

**Source:** rolodex `src/hooks/useScriptApi.ts:24-35`

**Files:**
- Create: `shared/src/utils/request.ts`

### Task 1.8: Extract `detectLanguage()` utility

**Execution:** 🅾️ OpenCode

**Source:** rolodex `server/utils.ts:16-38`

**Files:**
- Create: `shared/src/utils/detect-language.ts`

### Task 1.9: Extract `fetchWithBackoff()` pattern

**Execution:** 🅾️ OpenCode

**Source:** rsvp-automation `src/inviteflow/api/gmail.ts`

**Files:**
- Create: `shared/src/utils/fetch-with-backoff.ts`

### Task 1.10: Extract LCS `diff()` utility

**Execution:** 🅾️ OpenCode

**Source:** brain-bound `apps/web/src/lib/diff.ts`

**Files:**
- Create: `shared/src/utils/diff.ts`

### Task 1.11: Extract email deobfuscation utility

**Execution:** 🅾️ OpenCode

**Source:** lychan110.github.io `src/components/About.astro` (data-u/data-d pattern)

**Files:**
- Create: `shared/src/utils/email-deobfuscate.ts`

### Task 1.12: Extract `readConfigKey()` multi-source resolver

**Execution:** 🅾️ OpenCode

**Source:** rsvp-automation `src/scout/constants.ts`

**Files:**
- Create: `shared/src/utils/read-config-key.ts`

Pattern: check sessionStorage → check env var → fallback. Generic for any key.

---

## Phase 2: Shared Components — New Additions

### Task 2.1: Extract `Profile` component (from rolodex)

**Execution:** 🅾️ OpenCode

**Source:** rolodex `src/components/Profile.tsx`

**Files:**
- Create: `shared/src/components/Profile.tsx`

Props: `name`, `tagline`, `avatarUrl?`, `className?`. Pure presentational — avatar + serif name + tagline.

### Task 2.2: Extract `Toggle` switch component

**Execution:** 🅾️ OpenCode

**Source:** rolodex `src/pages/SettingsPage.tsx:28-47` (inline Toggle)

Also from chimera `packages/ui/src/components/atoms/Toggle.tsx` if source recovered.

**Files:**
- Create: `shared/src/components/Toggle.tsx`

Props: `checked`, `onChange`, `disabled?`, `size?: 'sm' | 'md'`, `className?`.

### Task 2.3: Extract `Field` form wrapper component

**Execution:** 🅾️ OpenCode

**Source:** rolodex `src/pages/SettingsPage.tsx:49-66`

**Files:**
- Create: `shared/src/components/Field.tsx`

Props: `label`, `htmlFor`, `children`, `description?`.

### Task 2.4: Extract `Toast` notification component

**Execution:** 🅾️ OpenCode

**Source:** rolodex `src/pages/SettingsPage.tsx:370-382` (SaveToast)

**Files:**
- Create: `shared/src/components/Toast.tsx`

Variants: `success`/`error`/`info`. Auto-dismiss with timeout. Fixed bottom-right.

### Task 2.5: Extract `Input` component with `cva` styling

**Execution:** 🅾️ OpenCode

**Source:** rolodex `src/pages/SettingsPage.tsx:68-69` (inputCls pattern)

**Files:**
- Create: `shared/src/components/Input.tsx`

```typescript
export const inputVariants = cva(
  'w-full rounded-lg border bg-paper px-3 py-2 text-sm ...',
  { variants: { size: { sm: '...', md: '...' } } }
);
```

### Task 2.6: Extract `Icon` component set

**Execution:** 🅾️ OpenCode

**Source:** chimera `packages/ui/src/components/atoms/Icon.tsx` (30+ SVG icons) — requires git recovery

Fallback: rsvp-automation `src/inviteflow/components/Icon.tsx` (feather-style icons)

**Files:**
- Create: `shared/src/components/Icon.tsx`

Name-based icon renderer: `<Icon name="check" size={16} />`. Include most common feather icons.

**Step 1: Recover chimera Icon source from git**

```bash
cd ~/webapps/chimera
git log --all --full-history -- '**/Icon.tsx'
git checkout <commit> -- packages/ui/src/components/atoms/Icon.tsx
```

**Step 2: Extract to shared, add to index exports**

### Task 2.7: Extract `StatusPill` component

**Execution:** 🅾️ OpenCode

**Source:** chimera `packages/ui/src/components/atoms/StatusPill.tsx`

**Files:**
- Create: `shared/src/components/StatusPill.tsx`

State-driven status indicator with color-coded dot + label. Variants: up/down/checking/error.

### Task 2.8: Extract `ErrorBanner` component

**Execution:** 🅾️ OpenCode

**Source:** chimera `packages/ui/src/components/molecules/ErrorBanner.tsx`

**Files:**
- Create: `shared/src/components/ErrorBanner.tsx`

### Task 2.9: Extract `TypingDots` loading indicator

**Execution:** 🅾️ OpenCode

**Source:** chimera `packages/ui/src/components/atoms/TypingDots.tsx`

**Files:**
- Create: `shared/src/components/TypingDots.tsx`

Animated three-dot loading indicator.

### Task 2.10: Extract `SegmentControl` component

**Execution:** 🅾️ OpenCode

**Source:** chimera `packages/ui/src/components/molecules/SegmentControl.tsx`

**Files:**
- Create: `shared/src/components/SegmentControl.tsx`

Segmented radio button group.

### Task 2.11: Extract `PageHeader` component

**Execution:** 🅾️ OpenCode

**Source:** rsvp-automation `src/inviteflow/components/PageHeader.tsx`

**Files:**
- Create: `shared/src/components/PageHeader.tsx`

Props: `title`, `eyebrow?`, `backHref?`, `rightAction?`, `showUnsavedDot?`.

### Task 2.12: Extract `EmptyState` improvements

**Execution:** 🅾️ OpenCode

**Objective:** Shared already has `EmptyState`. Enrich it with patterns from chimera's `EmptyStateCard.tsx` and rsvp-automation's empty states.

**Files:**
- Modify: `shared/src/components/EmptyState.tsx`

Add: `compact` variant, `secondaryAction`, `imageUrl` prop.

### Task 2.13: Extract `FilterableLedger<T>` component

**Execution:** 🅾️ OpenCode

**Source:** lychan110.github.io `src/components/ProjectGrid.tsx`

**Files:**
- Create: `shared/src/components/FilterableLedger.tsx`

Generic filterable data grid with category pills, column headers, status symbols, empty state.

### Task 2.14: Extract `Tree` component

**Execution:** 🅾️ OpenCode

**Source:** brain-bound `apps/web/src/components/FolderTree.tsx`

**Files:**
- Create: `shared/src/components/Tree.tsx`

Recursive tree from flat paths. Configurable icons, collapsible, virtualized for large datasets.

---

## Phase 3: Shared Hooks — New Additions

### Task 3.1: Extract `useScrollFade` hook

**Execution:** 🅾️ OpenCode

**Source:** lychan110.github.io `src/components/About.astro` (scroll-driven opacity)

**Files:**
- Create: `shared/src/hooks/useScrollFade.ts`

```typescript
export function useScrollFade(ref: RefObject<HTMLElement>, options?: { threshold?: number }): number
```

### Task 3.2: Extract `useWebSocket<T>` generic hook

**Execution:** 🅾️ OpenCode

**Source:** rolodex `src/hooks/useScriptSocket.ts` (auto-reconnect pattern)

**Files:**
- Create: `shared/src/hooks/useWebSocket.ts`

Generic WebSocket hook with typed messages, auto-reconnect, readyState tracking.

### Task 3.3: Extract `useFileImport<T>` hook

**Execution:** 🅾️ OpenCode

**Source:** contact-scout `src/App.tsx:393-406`

**Files:**
- Create: `shared/src/hooks/useFileImport.ts`

FileReader-based JSON import hook.

### Task 3.4: Extract `useControllableState` hook

**Execution:** 🅾️ OpenCode

**Source:** rolodex `src/components/ExecutionPanel.tsx:34` (controlled/uncontrolled pattern)

**Files:**
- Create: `shared/src/hooks/useControllableState.ts`

Support both controlled (`value`/`onChange`) and uncontrolled (`defaultValue`) state.

---

## Phase 4: Server-Side Shared Patterns

### Task 4.1: Extract `createConfigRouter()` factory

**Execution:** 🅾️ OpenCode

**Source:** rolodex `server/routes/config.ts`

**Files:**
- Create: `shared/server/routes/config.ts`

Express router factory: `createConfigRouter(filePath: string, schema?: ZodSchema)` → CRUD JSON config endpoints.

### Task 4.2: Extract `WatcherManager` class

**Execution:** 🅾️ OpenCode

**Source:** rolodex `server/watcher.ts`

**Files:**
- Create: `shared/server/watcher.ts`

Chokidar + EventEmitter wrapper for file watching with WebSocket bridging.

### Task 4.3: Extract `resolveInterpreter()` utility

**Execution:** 🅾️ OpenCode

**Source:** rolodex `server/routes/execute.ts:15-23`

**Files:**
- Create: `shared/server/resolve-interpreter.ts`

### Task 4.4: Extract `buildTree()` directory tree builder

**Execution:** 🅾️ OpenCode

**Source:** rolodex `server/routes/files.ts:18-40`

**Files:**
- Create: `shared/server/fs-tree.ts`

### Task 4.5: Extract `createEventHub<T>()` pattern

**Execution:** 🅾️ OpenCode

**Source:** chimera `packages/bridge/src/event-hub.ts`

**Files:**
- Create: `shared/src/utils/event-hub.ts`

Lazy typed event emitter for in-process pub/sub.

### Task 4.6: Extract `ws-client.ts` WebSocket manager

**Execution:** 🅾️ OpenCode

**Source:** chimera `packages/bridge/src/ws-client.ts`

**Files:**
- Create: `shared/src/utils/ws-client.ts`

WebSocket client with reconnection, message queuing, and health checking.

### Task 4.7: Extract `RuntimeSettingsStore` pattern

**Execution:** 🅾️ OpenCode

**Source:** brain-bound `apps/server/src/runtime-settings.ts` (JSON file persistence + hot reload)

**Files:**
- Create: `shared/server/runtime-settings.ts`

### Task 4.8: Extract `AES-256-GCM` crypto utilities

**Execution:** 🅾️ OpenCode

**Source:** brain-bound `apps/server/src/session.ts` (encrypt/decrypt)

**Files:**
- Create: `shared/server/crypto.ts`

---

## Phase 5: Design System Consolidation

### Task 5.1: Add chimera platform identity tokens to shared

**Execution:** 🅾️ OpenCode

**Source:** chimera `packages/ui/src/tokens/platform-colors.ts` + `src/data/platforms.tsx`

**Files:**
- Create: `shared/src/tokens/platforms.ts`
- Create: `shared/src/tokens/platform-colors.ts`

Platform definitions (Discord, Telegram, WhatsApp, etc.) with glyphs, color tokens, feature flags.

### Task 5.2: Standardize Tailwind v4 setup across all apps

**Execution:** 🅾️ OpenCode

**Objective:** All React+Vite apps should use the same Tailwind v4 + shared token pipeline.

**Pattern for each app:**
1. Add `shared/` submodule
2. `vite.config.ts`: add `@tailwindcss/vite` plugin, resolve alias `@lenya/webapp-shared` → `./shared`
3. `src/index.css`: `@import '@lenya/webapp-shared/styles/fonts.css'`, `@import '@lenya/webapp-shared/styles/tokens.css'`, `@import 'tailwindcss'`, `@import '@lenya/webapp-shared/styles/base.css'`
4. Wrap app in `<ThemeProvider>`
5. Replace hand-rolled components with shared equivalents

**Apps to migrate:**
- brain-bound (currently Tailwind v3 → upgrade to v4)
- chimera (currently Tailwind v3 → upgrade to v4)
- contact-scout (currently inline styles only → add Tailwind v4 + shared)
- rsvp-automation (currently Tailwind v4 but custom tokens → merge with shared)
- lychan110.github.io (Astro with Tailwind v3 — different setup, lower priority)

### Task 5.3: Deduplicate ThemeProvider / ThemeContext

**Execution:** 🅾️ OpenCode

**Objective:** brain-bound has its own `ThemeContext.tsx` duplicating shared `ThemeProvider`. Replace with shared.

**Files:**
- Modify: brain-bound `apps/web/src/App.tsx` (import from shared)
- Remove: brain-bound `apps/web/src/contexts/ThemeContext.tsx`

### Task 5.4: Replace inline components with shared in contact-scout

**Execution:** 🅾️ OpenCode

**Objective:** contact-scout is the smallest app — perfect pilot for shared migration.

**Replacements:**
- `loadCSState()`/`saveCSState()` → `useLocalStorage`
- Hand-rolled modal overlay → shared `Modal`
- `btn()` style helper → shared `Button`
- `tagStyle()` → shared `Tag`/`Badge`
- Inline scrollbar CSS → shared `base.css`

**Files:**
- Modify: contact-scout `src/App.tsx`

### Task 5.5: Replace inline components with shared in rolodex

**Execution:** 🅾️ OpenCode

**Objective:** rolodex already uses shared — now replace remaining hand-rolled patterns with newly-extracted shared components.

**Replacements:**
- Inline `SaveToast` → shared `Toast`
- Inline `Toggle` → shared `Toggle`
- Inline `Field` → shared `Field`
- Inline input classes → shared `Input`
- `Profile` component → imports from shared (already extracted in Task 2.1)
- `req()` helper → shared `request.ts`
- Fix animation name mismatch (`fade-up` → shared)

---

## Phase 6: Cross-Cutting — CI, Docs, & Ecosystem

### Task 6.1: Create shared `tsconfig.base.json`

**Execution:** 🅾️ OpenCode

**Files:**
- Create: `shared/tsconfig.base.json`

Standard base config that all webapps extend. Strict mode, ESNext modules, React JSX, path aliases.

### Task 6.2: Add tests to shared library

**Execution:** 🅾️ OpenCode

**Objective:** Zero tests exist today. Add vitest + basic tests for all utilities and hooks.

**Files:**
- Create: `shared/vitest.config.ts`
- Create: `shared/src/utils/__tests__/sleep.test.ts`
- Create: `shared/src/utils/__tests__/cn.test.ts`
- Create: `shared/src/utils/__tests__/slugify.test.ts`
- Create: `shared/src/hooks/__tests__/useDebounce.test.ts`
- Modify: `shared/package.json` (add vitest, test script)

### Task 6.3: Add ESLint config to shared

**Execution:** 🅾️ OpenCode

**Files:**
- Create: `shared/eslint.config.mjs`
- Modify: `shared/package.json` (add lint script)

### Task 6.4: Write shared library migration guide

**Execution:** 🄸 Inline

**Files:**
- Modify: `shared/README.md` (add "Migration Guide" section)

Document the canonical setup for any new webapp: submodule → vite alias → CSS imports → ThemeProvider → component usage.

### Task 6.5: Update rolodex MEMORY.md with new conventions

**Execution:** 🄸 Inline

**Files:**
- Modify: rolodex `docs/MEMORY.md`

Document the extraction decisions, what moved where, and patterns to follow going forward.

---

## Execution Order (Recommended)

1. **Phase 0** (Foundation) — Fix shared issues, add githooks to all repos
2. **Phase 1** (Quick Wins) — Extract all trivial utilities first
3. **Phase 2** (Components) — Extract new shared components
4. **Phase 3** (Hooks) — Extract new shared hooks
5. **Task 5.4** (contact-scout migration) — Pilot: migrate simplest app
6. **Task 5.5** (rolodex cleanup) — Clean up existing consumer
7. **Phase 4** (Server-side) — Extract server patterns
8. **Phase 5** remaining — Migrate brain-bound, chimera, rsvp-automation
9. **Phase 6** (Cross-cutting) — Tests, docs, CI

---

## Githooks Checklist (all repos)

After adding the `shared` submodule to each webapp, ensure:

- [ ] `.githooks/post-checkout` (chmod +x)
- [ ] `.githooks/post-merge` (chmod +x)
- [ ] `git config core.hooksPath .githooks` (per-repo)
- [ ] Submodule initialized: `git submodule add https://github.com/lychan110/webapp-shared.git shared`
- [ ] Vite alias configured: `resolve.alias['@lenya/webapp-shared']` → `./shared`
- [ ] CSS imports added to `src/index.css`
- [ ] `<ThemeProvider>` wrapping app root
