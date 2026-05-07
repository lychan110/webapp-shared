# @lenya/webapp-shared

**Studio Design System** — Shared design tokens, React components, and hooks for Lenya's webapp ecosystem.

> **v0.2.0** · TypeScript, Tailwind v4, React 18/19

---

## Architecture

```
shared/
├── package.json                  # exports map → src/ (consumer compiles)
├── tsconfig.json
├── CHANGELOG.md                  # Version history
├── src/
│   ├── index.ts                  # Barrel export — all public API
│   │
│   ├── tokens/
│   │   └── tokens.ts             # ⭐ SINGLE SOURCE OF TRUTH
│   │
│   ├── styles/
│   │   ├── fonts.css             # Google Fonts @import (must be first!)
│   │   ├── tokens.css            # Tailwind v4 @theme block (canonical Studio theme)
│   │   ├── tokens-generated.css  # Auto-generated CSS vars (non-Tailwind consumers)
│   │   └── base.css              # Body, blobs, glass, scrollbar, line-clamp
│   │
│   ├── utils/
│   │   └── cn.ts                 # clsx + tailwind-merge
│   │
│   ├── hooks/
│   │   ├── useLocalStorage.ts    # Type-safe localStorage
│   │   ├── useMediaQuery.ts      # Reactive matchMedia
│   │   ├── useDebounce.ts        # Generic debounce
│   │   ├── useHealthCheck.ts     # URL polling w/ AbortController
│   │   ├── useOnClickOutside.ts  # Click-away detection
│   │   └── useKeyboard.ts        # "meta+k" style shortcuts
│   │
│   ├── components/
│   │   ├── Button.tsx            # cva: primary/secondary/ghost/danger × sm/md/lg
│   │   ├── Card.tsx              # cva: glass/default/elevated/sunken × padding
│   │   ├── Badge.tsx             # variants + status dot (up/down/checking/error)
│   │   ├── Tag.tsx               # pill, button when interactive
│   │   ├── IconButton.tsx        # accessible square icon button
│   │   ├── ThemeToggle.tsx       # sun/moon built on IconButton
│   │   ├── Modal.tsx             # compound: Trigger/Content/Header/Body/Footer/Close
│   │   ├── AutoRefreshToggle.tsx # on/off pill slider w/ interval label
│   │   ├── Skeleton.tsx          # loading: block/text/card/circle
│   │   └── EmptyState.tsx        # icon + message + action
│   │
│   └── providers/
│       └── ThemeProvider.tsx     # Context-based, flash-free, system pref detection
│
├── scripts/
│   └── build-tokens.js           # Generate tokens-generated.css + dist/tokens.json
└── dist/                         # Build artifacts (gitignored)
    └── tokens.json               # Generated JSON for design tools
```

---

## Installation

### 1. Add the submodule (in your consuming app)

```bash
cd ~/webapps/<your-app>
git submodule add https://github.com/lychan110/webapp-shared.git shared
```

### 2. Add the dependency

```json
{
  "dependencies": {
    "@lenya/webapp-shared": "file:./shared"
  }
}
```

Then install:

```bash
npm install --legacy-peer-deps
```

> **Why `--legacy-peer-deps`?** `lucide-react@0.344.0` pins React to `^18` in its peer deps, so npm's strict resolver picks React 19 for the shared lib (which accepts `^18 || ^19`) then fails on the lucide mismatch. Since all consuming apps use React 18, `--legacy-peer-deps` is safe.

### 3. Add the Vite resolve alias

Because `@lenya/webapp-shared` is a `file:` symlink, `@tailwindcss/vite` resolves `@import "tailwindcss"` relative to the *shared lib's* filesystem path — which has no `tailwindcss` in its `node_modules`. Add this to your app's `vite.config.ts`:

```ts
import path from 'path';

export default defineConfig({
  // ...
  resolve: {
    alias: {
      tailwindcss: path.resolve(__dirname, './node_modules/tailwindcss'),
    },
  },
});
```

---

## Setup

### 1. Install Tailwind CSS v4

```bash
npm install tailwindcss @tailwindcss/vite
```

Add `@tailwindcss/vite` to your Vite plugins.

### 2. Import the Studio theme

In your main CSS file — **in this exact order** (CSS spec requires `@import` before any other rules):

```css
@import "@lenya/webapp-shared/styles/fonts.css";  /* must be first */
@import "tailwindcss";                              /* must be second */
@import "@lenya/webapp-shared/styles/tokens.css";
@import "@lenya/webapp-shared/styles/base.css";
```

Override specific tokens between the `tailwindcss` and `tokens.css` imports:

```css
@import "@lenya/webapp-shared/styles/fonts.css";
@import "tailwindcss";
@import "@lenya/webapp-shared/styles/tokens.css";

/* Override specific tokens for your app */
@theme {
  --color-ink: #f4ede0;
  --color-paper: #14110d;
  --color-accent: #e57158;
  --font-display: "Fraunces", serif;
}

@import "@lenya/webapp-shared/styles/base.css";
```

Then use Tailwind utilities as usual:
```html
<div class="bg-paper text-ink border-teal/20 font-display">...</div>
```

### 3. Wrap with ThemeProvider

```tsx
import { ThemeProvider } from '@lenya/webapp-shared';

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="my-app-theme">
      <YourApp />
    </ThemeProvider>
  );
}
```

---

## Usage

```tsx
import { Button, Card, Badge, Tag, Modal, useTheme } from '@lenya/webapp-shared';

function Example() {
  const { theme, toggle } = useTheme();

  return (
    <Card variant="glass" padding="lg">
      <Badge variant="success">Connected</Badge>
      <Button variant="primary" onClick={toggle}>
        Switch to {theme === 'dark' ? 'light' : 'dark'}
      </Button>
    </Card>
  );
}
```

---

## Theming

Each app can override any Studio token while keeping the shared components:

```css
@import "tailwindcss";
@import "@lenya/webapp-shared/styles/tokens.css";

@theme {
  --color-teal: #e57158;
  --color-rust: #c44b5e;
  --color-accent: #e57158;
}
```

See [`tokens.ts`](src/tokens/tokens.ts) for the full list of available tokens.

---

## Design Token Pipeline

This is the **critical maintenance workflow**. Understanding it prevents drift.

```
tokens.ts  (⭐ single source of truth — TypeScript)
    │
    ├── build-tokens.js ─────────────────────────────────────┐
    │   (reads tokens.ts, generates CSS vars + JSON)         │
    │                                                         │
    ├── src/styles/tokens.css  (Tailwind v4 @theme —          │
    │   hand-written, mirrors tokens.ts)                      │
    │                                                         │
    ├── src/styles/tokens-generated.css  (auto-generated      │
    │   CSS variables — DO NOT EDIT)                          │
    │                                                         │
    └── dist/tokens.json  (auto-generated —                   │
        for design tools — gitignored)                        │
                                                              │
    ⚠️ tokens.css must be manually kept in sync with tokens.ts
       (the @theme block needs explicit --color-* entries)
```

### Rules

1. **`tokens.ts` is the single source of truth.** Never edit `tokens-generated.css` by hand.
2. **`tokens.css`** must be kept in sync manually (the `@theme` block needs explicit entries for Tailwind to pick them up). When you add a color to `tokens.ts`, add the corresponding `--color-*` and `--c-*` entries to `tokens.css`.
3. **After changing `tokens.ts`**:
   ```bash
   node src/scripts/build-tokens.js
   ```
   This regenerates `tokens-generated.css` and `dist/tokens.json`.
4. **Commit both** `tokens.ts` AND the regenerated outputs together. A PR that changes tokens but doesn't update `tokens-generated.css` is incomplete.

---

## Adding Things

### Adding a new component

1. Create `src/components/YourComponent.tsx` using the `cn()` utility
2. Use `cva()` for variant-based styling (see `Button.tsx` or `Card.tsx` as templates)
3. Export it from `src/index.ts`
4. Add the export path to `package.json` → `exports` map if it needs a subpath
5. Run `npx tsc --noEmit` to verify types
6. If the consuming app uses the component, `npm run build` in the app to verify it compiles

### Adding a new hook

1. Create `src/hooks/useYourHook.ts`
2. Export it from `src/index.ts`
3. Add the export path to `package.json` → `exports` map
4. Run `npx tsc --noEmit` to verify types

### Adding a new token

1. Edit `src/tokens/tokens.ts` (add the color/font/radius/shadow entry)
2. Edit `src/styles/tokens.css` to add the corresponding `--color-*` entry in the `@theme` block
3. Run `node src/scripts/build-tokens.js` to regenerate `tokens-generated.css`
4. Commit all three files together

### Adding a new style or utility class

Add it to `src/styles/base.css` inside the appropriate `@layer` block:
- **Global base styles** → `@layer base { ... }`
- **Utility classes** (blobs, glass, line-clamp) → `@layer utilities { ... }`

---

## Scripts

Run from the shared lib root (`~/webapps/rolodex/shared/`):

```bash
# Generate CSS variables + JSON from TypeScript tokens
node src/scripts/build-tokens.js
```

This script:
1. Reads `src/tokens/tokens.ts` and parses color, font, spacing, radius, and shadow tokens
2. Generates `src/styles/tokens-generated.css` with `:root` (light) and `.dark` (dark) variable blocks
3. Generates `dist/tokens.json` for design tool reference (gitignored)

---

## Maintenance

### Before committing

Always run these checks:

```bash
# 1. TypeScript check
npx tsc --noEmit

# 2. Regenerate if tokens changed
node src/scripts/build-tokens.js

# 3. Build the consuming app to verify integration
cd ~/webapps/rolodex && npm run build
```

### When updating the shared lib in a consuming app

```bash
cd ~/webapps/rolodex/shared
git pull origin main
cd ..
git add shared
git commit -m "chore: bump shared lib"
```

### When making changes to the shared lib itself

Follow the worktree workflow (single-command setup):

```bash
git worktree add -b feat/my-change ../shared-worktree main
cd ../shared-worktree
# ... make changes, test ...
git add -A && git commit -m "feat: description"
git push origin feat/my-change
gh pr create --head feat/my-change --base main --title "..." --body "..."
gh api repos/lychan110/webapp-shared/pulls/N/merge -X PUT -f merge_method=squash
cd ..
git worktree remove ../shared-worktree
git branch -D feat/my-change
```

> **Note:** Use `gh api .../merge` instead of `gh pr merge` because `gh pr merge` fails when the base branch is checked out in a linked worktree (which happens when rolodex's shared submodule has `main` checked out).

---

## Peer Dependencies

| Package | Version | Required? |
|---------|---------|-----------|
| `react` | ^18.2.0 \|\| ^19.0.0 | Required |
| `react-dom` | ^18.2.0 \|\| ^19.0.0 | Required |
| `@radix-ui/react-dialog` | ^1.1.6 | Optional (enhanced Modal) |
| `@radix-ui/react-tooltip` | ^1.1.8 | Optional (Tooltip) |

---

## Status

**v0.2.0** — Active development. All components are built and TypeScript-clean. Consumed by Rolodex. See [CHANGELOG.md](./CHANGELOG.md) for version history.
