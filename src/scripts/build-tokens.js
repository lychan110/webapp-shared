/**
 * build-tokens.js — Generate CSS from TypeScript token definitions.
 *
 * Reads src/tokens/tokens.ts and generates:
 *   - src/styles/tokens-generated.css  (CSS variables for consumers without Tailwind v4)
 *   - dist/tokens.json                  (Raw JSON for design tools/reference)
 *
 * Usage: node scripts/build-tokens.js
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const SRC_TOKENS = resolve(ROOT, 'src/tokens/tokens.ts');

// Extract token values using a simple regex parser (avoids needing ts-morph)
function parseTokens(source) {
  const tokens = {};
  const colors = {};
  const fonts = {};
  const spacing = [];
  const radius = {};
  const shadows = {};

  // Extract colors
  const colorsMatch = source.match(/colors:\s*\{([^}]+)\}/s);
  if (colorsMatch) {
    const colorEntries = colorsMatch[1].matchAll(/(\S[^:]+):\s*\{[^}]*?(light:\s*'([^']+)')?[^}]*?(dark:\s*'([^']+)')?[^}]*?\}/gs);
    for (const match of colorEntries) {
      const name = match[1].trim().replace(/['"]/g, '');
      colors[name] = {
        light: match[3] || '#000000',
        dark: match[4] || '#000000',
      };
    }
  }

  // Extract fonts
  const fontsMatch = source.match(/fonts:\s*\{([^}]+)\}/s);
  if (fontsMatch) {
    const fontEntries = fontsMatch[1].matchAll(/(\w+):\s*(\[[^\]]+\])/gs);
    for (const match of fontEntries) {
      try {
        fonts[match[1]] = JSON.parse(match[2].replace(/'/g, '"'));
      } catch { /* skip */ }
    }
  }

  // Extract spacing
  const spacingMatch = source.match(/spacing:\s*\[([^\]]+)\]/);
  if (spacingMatch) {
    spacingMatch[1].split(',').forEach(s => {
      const n = parseInt(s.trim());
      if (!isNaN(n)) spacing.push(n);
    });
  }

  // Extract radius
  const radiusMatch = source.match(/radius:\s*\{([^}]+)\}/s);
  if (radiusMatch) {
    const radiusEntries = radiusMatch[1].matchAll(/(\w+):\s*'([^']+)'/gs);
    for (const match of radiusEntries) {
      radius[match[1]] = match[2];
    }
  }

  // Extract shadows
  const shadowsMatch = source.match(/shadows:\s*\{([^}]+)\}/s);
  if (shadowsMatch) {
    const shadowEntries = shadowsMatch[1].matchAll(/(\w+):\s*'([^']+)'/gs);
    for (const match of shadowEntries) {
      shadows[match[1]] = match[2];
    }
  }

  return { colors, fonts, spacing, radius, shadows };
}

function generateCSSVars(tokens, mode) {
  const { colors } = tokens;
  const vars = [];

  for (const [name, value] of Object.entries(colors)) {
    const color = value[mode];
    const rgb = hexToRgb(color);
    vars.push(`  --c-${name}: ${rgb.r} ${rgb.g} ${rgb.b};`);
    vars.push(`  --color-${name}: ${color};`);
  }

  return vars.join('\n');
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : { r: 0, g: 0, b: 0 };
}

// ─── Main ────────────────────────────────────────────────────────────────

try {
  const source = readFileSync(SRC_TOKENS, 'utf-8');
  const tokens = parseTokens(source);

  // Generate CSS variables for consumers without Tailwind v4
  const css = `/* ══════════════════════════════════════════════════════════════════════════
   Studio Design Tokens — CSS Variables
   Auto-generated from src/tokens/tokens.ts. Do not edit directly.
   ══════════════════════════════════════════════════════════════════════════ */

:root {
  /* ─── Light mode ─────────────────────────────────────────────── */
${generateCSSVars(tokens, 'light')}
}

.dark {
${generateCSSVars(tokens, 'dark')}
}
`;

  const cssPath = resolve(ROOT, 'src/styles/tokens-generated.css');
  writeFileSync(cssPath, css);
  console.log(`✅ Generated ${cssPath}`);

  // Generate JSON
  const jsonPath = resolve(ROOT, 'dist/tokens.json');
  const distDir = resolve(ROOT, 'dist');
  if (!existsSync(distDir)) mkdirSync(distDir, { recursive: true });
  writeFileSync(jsonPath, JSON.stringify(tokens, null, 2));
  console.log(`✅ Generated ${jsonPath}`);

} catch (err) {
  console.error('❌ Error:', err.message);
  process.exit(1);
}
