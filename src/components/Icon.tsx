/* ══════════════════════════════════════════════════════════════════════════
   Icon — feather-style SVG icon set
   ══════════════════════════════════════════════════════════════════════════
   Name-based rendering via a switch statement. All icons use a standard
   24×24 viewBox with 1.5px stroke, matching the Feather icon style.

   Usage:
     <Icon name="check" size={20} className="text-teal" />
     <Icon name="search" size={16} />
   ══════════════════════════════════════════════════════════════════════════ */

import type { SVGAttributes } from 'react';
import { cn } from '../utils/cn';

/* ─── Icon names ─────────────────────────────────────────────────────────── */

export type IconName =
  | 'check'
  | 'x'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-up'
  | 'chevron-down'
  | 'search'
  | 'plus'
  | 'minus'
  | 'settings'
  | 'external-link'
  | 'refresh-cw'
  | 'sun'
  | 'moon'
  | 'copy'
  | 'trash-2'
  | 'edit'
  | 'home'
  | 'folder'
  | 'file'
  | 'clock'
  | 'alert-circle'
  | 'info'
  | 'arrow-left'
  | 'arrow-right'
  | 'download'
  | 'upload'
  | 'user'
  | 'menu'
  | 'send'
  | 'attach'
  | 'cog'
  | 'kebab'
  | 'sparkles'
  | 'play'
  | 'pause'
  | 'terminal'
  | 'chat'
  | 'list'
  | 'key'
  | 'bolt'
  | 'gauge'
  | 'eye'
  | 'shield'
  | 'cloud'
  | 'brain'
  | 'plug';

/* ─── Props ──────────────────────────────────────────────────────────────── */

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, 'stroke'> {
  /** Icon name */
  name: IconName;
  /** Size in pixels (width & height, default: 16) */
  size?: number;
  /** Stroke width (default: 1.5) */
  stroke?: number;
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export function Icon({
  name,
  size = 16,
  stroke: strokeWidth = 1.5,
  className,
  ...props
}: IconProps) {
  const svgProps = {
    width: size,
    height: size,
    fill: 'none' as const,
    stroke: 'currentColor' as const,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    viewBox: '0 0 24 24',
    className: cn('inline-block flex-shrink-0', className),
    ...props,
  };

  switch (name) {
    /* ── Actions ─────────────────────────────────────────────────────── */
    case 'check':
      return (
        <svg {...svgProps}>
          <path d="M5 12l5 5 9-11" />
        </svg>
      );
    case 'x':
      return (
        <svg {...svgProps}>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      );
    case 'plus':
      return (
        <svg {...svgProps}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case 'minus':
      return (
        <svg {...svgProps}>
          <path d="M5 12h14" />
        </svg>
      );
    case 'copy':
      return (
        <svg {...svgProps}>
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      );
    case 'edit':
      return (
        <svg {...svgProps}>
          <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" />
        </svg>
      );
    case 'trash-2':
      return (
        <svg {...svgProps}>
          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M10 11v6M14 11v6" />
        </svg>
      );
    case 'send':
      return (
        <svg {...svgProps}>
          <path d="M4 12l16-8-6 18-3-7-7-3z" />
        </svg>
      );
    case 'download':
      return (
        <svg {...svgProps}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
        </svg>
      );
    case 'upload':
      return (
        <svg {...svgProps}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
        </svg>
      );

    /* ── Navigation ──────────────────────────────────────────────────── */
    case 'chevron-left':
      return (
        <svg {...svgProps}>
          <path d="M15 18l-6-6 6-6" />
        </svg>
      );
    case 'chevron-right':
      return (
        <svg {...svgProps}>
          <path d="M9 18l6-6-6-6" />
        </svg>
      );
    case 'chevron-up':
      return (
        <svg {...svgProps}>
          <path d="M18 15l-6-6-6 6" />
        </svg>
      );
    case 'chevron-down':
      return (
        <svg {...svgProps}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      );
    case 'arrow-left':
      return (
        <svg {...svgProps}>
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      );
    case 'arrow-right':
      return (
        <svg {...svgProps}>
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      );
    case 'home':
      return (
        <svg {...svgProps}>
          <path d="M3 12l9-8 9 8M5 10v10h14V10" />
        </svg>
      );
    case 'menu':
      return (
        <svg {...svgProps}>
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      );

    /* ── UI ──────────────────────────────────────────────────────────── */
    case 'search':
      return (
        <svg {...svgProps}>
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      );
    case 'settings':
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    case 'cog':
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a2 2 0 0 0 .4 2.2l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a2 2 0 0 0-2.2-.4 2 2 0 0 0-1.2 1.8V22a2 2 0 0 1-4 0v-.1a2 2 0 0 0-1.4-1.8 2 2 0 0 0-2.2.4l-.1.1A2 2 0 1 1 3.1 17.8l.1-.1a2 2 0 0 0 .4-2.2 2 2 0 0 0-1.8-1.2H2a2 2 0 0 1 0-4h.1A2 2 0 0 0 4 9a2 2 0 0 0-.4-2.2l-.1-.1A2 2 0 1 1 6.3 3.9l.1.1a2 2 0 0 0 2.2.4H9a2 2 0 0 0 1.2-1.8V2a2 2 0 0 1 4 0v.1a2 2 0 0 0 1.2 1.8 2 2 0 0 0 2.2-.4l.1-.1A2 2 0 1 1 20.9 6.3l-.1.1a2 2 0 0 0-.4 2.2V9a2 2 0 0 0 1.8 1.2H22a2 2 0 0 1 0 4h-.1a2 2 0 0 0-1.8 1.2z" />
        </svg>
      );
    case 'external-link':
      return (
        <svg {...svgProps}>
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
        </svg>
      );
    case 'refresh-cw':
      return (
        <svg {...svgProps}>
          <path d="M23 4v6h-6M1 20v-6h6" />
          <path d="M3.5 9a9 9 0 0 1 15.4-3.4L23 10M20.5 15a9 9 0 0 1-15.4 3.4L1 14" />
        </svg>
      );
    case 'kebab':
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      );
    case 'sparkles':
      return (
        <svg {...svgProps}>
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" />
        </svg>
      );

    /* ── Media / Playback ────────────────────────────────────────────── */
    case 'play':
      return (
        <svg {...svgProps}>
          <path d="M6 4l14 8-14 8z" />
        </svg>
      );
    case 'pause':
      return (
        <svg {...svgProps}>
          <rect x="6" y="4" width="4" height="16" />
          <rect x="14" y="4" width="4" height="16" />
        </svg>
      );

    /* ── Files & Folders ─────────────────────────────────────────────── */
    case 'folder':
      return (
        <svg {...svgProps}>
          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
      );
    case 'file':
      return (
        <svg {...svgProps}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M10 12h4M10 16h4" />
        </svg>
      );
    case 'attach':
      return (
        <svg {...svgProps}>
          <path d="M21 11l-9 9a5 5 0 0 1-7-7l9-9a3.5 3.5 0 0 1 5 5l-9 9a2 2 0 0 1-3-3l8-8" />
        </svg>
      );

    /* ── Status & Alerts ─────────────────────────────────────────────── */
    case 'alert-circle':
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      );
    case 'info':
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      );
    case 'clock':
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...svgProps}>
          <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
        </svg>
      );

    /* ── Theme ───────────────────────────────────────────────────────── */
    case 'sun':
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      );
    case 'moon':
      return (
        <svg {...svgProps}>
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      );

    /* ── Apps & Objects ──────────────────────────────────────────────── */
    case 'terminal':
      return (
        <svg {...svgProps}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M7 9l3 3-3 3M13 15h5" />
        </svg>
      );
    case 'chat':
      return (
        <svg {...svgProps}>
          <path d="M21 12a8 8 0 0 1-12 7l-5 1 1-5a8 8 0 1 1 16-3z" />
        </svg>
      );
    case 'list':
      return (
        <svg {...svgProps}>
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      );
    case 'key':
      return (
        <svg {...svgProps}>
          <circle cx="8" cy="14" r="4" />
          <path d="M11 11l9-9M16 6l3 3" />
        </svg>
      );
    case 'bolt':
      return (
        <svg {...svgProps}>
          <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
        </svg>
      );
    case 'gauge':
      return (
        <svg {...svgProps}>
          <path d="M21 14A9 9 0 1 0 3 14M12 14l4-4" />
        </svg>
      );
    case 'eye':
      return (
        <svg {...svgProps}>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'cloud':
      return (
        <svg {...svgProps}>
          <path d="M17 18a4 4 0 0 0 0-8 6 6 0 0 0-11-2 4 4 0 0 0-1 8z" />
        </svg>
      );
    case 'brain':
      return (
        <svg {...svgProps}>
          <path d="M9 3a5 5 0 0 0-4 8.1A4 4 0 0 0 6 18h3v-2H6a2 2 0 0 1 0-4h1V9a3 3 0 0 1 6 0v3h1a2 2 0 0 1 0 4h-3v2h3a4 4 0 0 0 1-7.9A5 5 0 0 0 9 3z" />
        </svg>
      );
    case 'plug':
      return (
        <svg {...svgProps}>
          <path d="M12 22v-4M8 22v-4M10 18H6a4 4 0 0 1-4-4v-2h16v2a4 4 0 0 1-4 4h-4zM8 6V2M16 6V2M2 12V8h20v4" />
        </svg>
      );

    /* ── Identity ────────────────────────────────────────────────────── */
    case 'user':
      return (
        <svg {...svgProps}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );

    default:
      return null;
  }
}

Icon.displayName = 'Icon';
