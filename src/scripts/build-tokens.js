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

  // Extract colors — match nested objects properly
  const colorsMatch = source.match(/colors:\s*\{([\s\S]*?)\n\}/);
  if (colorsMatch) {
    const block = colorsMatch[1];
    const entryRegex = /['"]?([\w-]+)['"]?\s*:\s*\{\s*light:\s*'([^']*)'\s*,\s*dark:\s*'([^']*)'\s*\}/g;
    let match;
    while ((match = entryRegex.exec(block)) !== null) {
      colors[match[1]] = {
        light: match[2] || '#000000',
        dark: match[3] || '#000000',
      };
    }
  }

  // Extract fonts
  const fontsMatch = source.match(/fonts:\s*\{([\s\S]*?)\n\}/);
  if (fontsMatch) {
    const block = fontsMatch[1];
    const fontRegex = /(\w+):\s*\[([^\]]+)\]/g;
    let match;
    while ((match = fontRegex.exec(block)) !== null) {
      try {
        fonts[match[1]] = JSON.parse('[' + match[2].replace(/'/g, '"') + ']');
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
  const radiusMatch = source.match(/radius:\s*\{([\s\S]*?)\n\}/);
  if (radiusMatch) {
    const block = radiusMatch[1];
    const radiusRegex = /(\w+):\s*'([^']+)'/g;
    let match;
    while ((match = radiusRegex.exec(block)) !== null) {
      radius[match[1]] = match[2];
    }
  }

  // Extract shadows
  const shadowsMatch = source.match(/shadows:\s*\{([\s\S]*?)\n\}/);
  if (shadowsMatch) {
    const block = shadowsMatch[1];
    const shadowRegex = /(\w+):\s*'([^']+)'/g;
    let match;
    while ((match = shadowRegex.exec(block)) !== null) {
      shadows[match[1]] = match[2];
    }
  }

  return { colors, fonts, spacing, radius, shadows };
}

function generateCSSVars(tokens, mode) {
  const { colors } = tokens;
  if (!colors || Object.keys(colors).length === 0) {
    return '  /* No color tokens parsed */';
  }
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

// --- Main ----------------------------------------------------------------

try {
  const source = readFileSync(SRC_TOKENS, 'utf-8');
  const tokens = parseTokens(source);

  // Generate CSS variables for consumers without Tailwind v4
  const css = [
    '/* ══════════════════════════════════════════════════════════════════════════',
    '   Studio Design Tokens — CSS Variables',
    '   Auto-generated from src/tokens/tokens.ts. Do not edit directly.',
    '   ══════════════════════════════════════════════════════════════════════════ */',
    '',
    ':root {',
    '  /* --- Light mode -------------------------------------------------- */',
    generateCSSVars(tokens, 'light'),
    '}',
    '',
    '.dark {',
    generateCSSVars(tokens, 'dark'),
    '}',
    '',
  ].join('\n');

  const cssPath = resolve(ROOT, 'src/styles/tokens-generated.css');
  writeFileSync(cssPath, css);
  console.log('Generated ' + cssPath);

  // Generate JSON
  const jsonPath = resolve(ROOT, 'dist/tokens.json');
  const distDir = resolve(ROOT, 'dist');
  if (!existsSync(distDir)) mkdirSync(distDir, { recursive: true });
  writeFileSync(jsonPath, JSON.stringify(tokens, null, 2));
  console.log('Generated ' + jsonPath);

} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
