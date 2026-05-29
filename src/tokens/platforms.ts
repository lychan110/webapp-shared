/* ══════════════════════════════════════════════════════════════════════════
   Platform identity definitions — extracted from chimera
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * Feature flags describing platform capabilities.
 */
export interface PlatformFeatures {
  /** Supports streaming assistant responses (SSE / real-time). */
  streaming: boolean;
  /** Supports permission-request flow for tool calls. */
  permissions: boolean;
  /** Has a tool/agent system (shell, filesystem, etc.). */
  tools: boolean;
}

/**
 * Canonical platform identity definition.
 */
export interface PlatformDefinition {
  /** Unique machine-readable id (e.g. 'hermes', 'claude'). */
  id: string;
  /** Human-readable display name (e.g. 'Claude Code'). */
  displayName: string;
  /** Platform colour — HSL string (preferred) or hex. */
  color: string;
  /** Runtime type classification. */
  platformType: 'cli' | 'openai-compatible';
  /** Capability flags. */
  features: PlatformFeatures;
}

/**
 * Ordered registry of all known platform identities.
 *
 * Sources (from chimera):
 *   - apps/bridge/src/services/adapters/{hermes,claude,opencode,copilot}.ts
 *   - apps/web/src/lib/platform-colors.ts
 *   - apps/bridge/src/jobs/types.ts  (AgentId = 'claude-code' | 'codex')
 */
export const PLATFORMS: Record<string, PlatformDefinition> = {
  hermes: {
    id: 'hermes',
    displayName: 'Hermes',
    color: 'hsl(162, 52%, 52%)',      // royal emerald
    platformType: 'cli',
    features: { streaming: true, permissions: true, tools: true },
  },
  claude: {
    id: 'claude',
    displayName: 'Claude Code',
    color: 'hsl(16, 65%, 62%)',       // copper / warm orange
    platformType: 'cli',
    features: { streaming: true, permissions: true, tools: true },
  },
  'claude-code': {
    id: 'claude-code',
    displayName: 'Claude Code',
    color: 'hsl(16, 65%, 62%)',       // same colour as `claude`
    platformType: 'cli',
    features: { streaming: true, permissions: true, tools: true },
  },
  opencode: {
    id: 'opencode',
    displayName: 'OpenCode',
    color: 'hsl(22, 90%, 58%)',       // bright orange
    platformType: 'cli',
    features: { streaming: false, permissions: false, tools: true },
  },
  copilot: {
    id: 'copilot',
    displayName: 'Copilot',
    color: 'hsl(190, 60%, 56%)',      // teal (shifted from green to avoid Hermes clash)
    platformType: 'cli',
    features: { streaming: false, permissions: false, tools: true },
  },
  codex: {
    id: 'codex',
    displayName: 'Codex',
    color: 'hsl(225, 65%, 66%)',      // steel blue
    platformType: 'cli',
    features: { streaming: true, permissions: true, tools: true },
  },
  custom: {
    id: 'custom',
    displayName: 'Custom (OpenAI-compatible)',
    color: 'hsl(0, 0%, 75%)',         // neutral grey
    platformType: 'openai-compatible',
    features: { streaming: true, permissions: false, tools: false },
  },
} as const;

/** Union of known platform ids. */
export type PlatformId = keyof typeof PLATFORMS;

/** Look up a platform definition by id (case-insensitive fallback). */
export function getPlatform(id?: string | null): PlatformDefinition | undefined {
  if (!id) return undefined;
  return PLATFORMS[id] ?? undefined;
}

/** Get the canonical display colour for a platform id. */
export function platformColor(platform?: string | null): string | undefined {
  return platform ? PLATFORMS[platform]?.color : undefined;
}

/** Ordered list of platform definitions (same order as the record above). */
export const PLATFORM_LIST: readonly PlatformDefinition[] = /* #__PURE__ */ Object.freeze(
  Object.values(PLATFORMS),
);
