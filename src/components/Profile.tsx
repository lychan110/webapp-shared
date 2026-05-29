import { type ReactNode } from 'react';
import { cn } from '../utils/cn';

/* ─── Props ────────────────────────────────────────────────────────────── */

export interface ProfileProps {
  /** Display name (shown in avatar fallback initial) */
  name: string;
  /** Tagline or description below the name */
  tagline: string;
  /** Optional avatar image URL */
  avatarUrl?: string;
  className?: string;
}

/* ─── Component ────────────────────────────────────────────────────────── */

/**
 * Profile — avatar with serif-styled name and tagline.
 * Pure presentational, no interactivity.
 */
export function Profile({ name, tagline, avatarUrl, className }: ProfileProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center mb-6 md:mb-10 animate-fade-up',
        className,
      )}
    >
      {/* Avatar */}
      <div className="mb-4">
        <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-[3px] border-ink-soft/20 shadow-lg transition-colors">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-4xl text-white transition-colors"
              style={{ background: 'linear-gradient(135deg, var(--color-teal), #0d9488)' }}
            >
              {name.charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* Name */}
      <h1 className="text-2xl font-display font-semibold text-ink transition-colors mb-2">
        {name}
      </h1>

      {/* Tagline */}
      <p className="text-base text-ink-soft transition-colors">
        {tagline}
      </p>
    </div>
  );
}

Profile.displayName = 'Profile';
