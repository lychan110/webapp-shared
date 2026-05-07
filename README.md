# @lenya/webapp-shared

**Studio Design System** — Shared design tokens, React components, and hooks for Lenya's webapp ecosystem.

## Architecture

```
shared/
├── src/
│   ├── tokens/
│   │   └── tokens.ts              # TypeScript token definitions (single source of truth)
│   ├── styles/
│   │   ├── tokens.css              # Tailwind v4 @theme block
│   │   ├── tokens-generated.css    # Generated CSS variables (for non-Tailwind consumers)
│   │   └── base.css                # Base styles (body, scrollbar, blobs, glass)
│   ├── utils/
│   │   └── cn.ts                   # clsx + tailwind-merge class merger
│   ├── hooks/
│   │   ├── useLocalStorage.ts      # Type-safe localStorage with JSON serialization
│   │   ├── useMediaQuery.ts        # Reactive media query matching
│   │   ├── useDebounce.ts          # Generic debounce hook
│   │   ├── useHealthCheck.ts       # URL polling with configurable interval/timeout
│   │   ├── useOnClickOutside.ts    # Click-away detection for modals/dropdowns
│   │   └── useKeyboard.ts          # Keyboard shortcut registration
│   ├── components/
│   │   ├── Button.tsx              # Variant-based button (primary/secondary/ghost/danger)
│   │   ├── Card.tsx                # Card with variants (glass/default/elevated/sunken)
│   │   ├── Badge.tsx               # Badge with optional status dot
│   │   ├── Tag.tsx                 # Tag/pill component
│   │   ├── IconButton.tsx          # Square icon button (accessible)
│   │   ├── ThemeToggle.tsx         # Sun/moon toggle (uses IconButton)
│   │   └── Modal.tsx               # Compound modal with focus trap + escape handling
│   ├── providers/
│   │   └── ThemeProvider.tsx       # Context-based theme with flash-free hydration
│   └── index.ts                    # Public API barrel
├── scripts/
│   └── build-tokens.js            # Generate CSS vars + JSON from TS tokens
└── package.json
```

## Installation (in consuming app)

```json
{
  "dependencies": {
    "@lenya/webapp-shared": "file:../shared"
  }
}
```

## Setup

### 1. Install Tailwind CSS v4

```bash
npm install tailwindcss @tailwindcss/vite
```

### 2. Import the Studio theme

In your main CSS file:

```css
@import "@lenya/webapp-shared/styles/fonts.css";
@import "tailwindcss";
@import "@lenya/webapp-shared/styles/tokens.css";
@import "@lenya/webapp-shared/styles/base.css";
```

Your own `@theme` overrides go between the token and base import:

```css
@import "@lenya/webapp-shared/styles/fonts.css";
@import "tailwindcss";
@import "@lenya/webapp-shared/styles/tokens.css";

/* Override specific tokens */
@theme {
  --color-ink: #f4ede0;
  --color-paper: #14110d;
  --color-accent: #e57158;
  --font-display: "Fraunces", serif;
}

@import "@lenya/webapp-shared/styles/base.css";
```

### 3. Wrap with ThemeProvider

```tsx
import { ThemeProvider } from '@lenya/webapp-shared';

export default function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

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

## Theming

Each app can override any Studio token while keeping the shared components:

```css
/* In your app's main CSS file */
@import "tailwindcss";
@import "@lenya/webapp-shared/styles/tokens.css";

@theme {
  /* Replace the entire palette */
  --color-teal: #e57158;
  --color-rust: #c44b5e;
  /* Your custom tokens */
  --color-accent: #e57158;
}
```

## Scripts

```bash
# Generate CSS variables + JSON from TypeScript tokens
node src/scripts/build-tokens.js
```

## Peer Dependencies

- `react` ^18.2.0 || ^19.0.0
- `react-dom` ^18.2.0 || ^19.0.0
- `@radix-ui/react-dialog` ^1.1.6 (optional — for enhanced Modal)
- `@radix-ui/react-tooltip` ^1.1.8 (optional — for Tooltip)

## Status

**v0.1.0** — Active development. Components are production-ready for the Rolodex ecosystem.
