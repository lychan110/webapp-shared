import { type ReactNode } from 'react';
import { cn } from '../utils/cn';

/* ─── Props ────────────────────────────────────────────────────────────── */

export interface FieldProps {
  /** Label text displayed above the children */
  label: string;
  /** The form control element(s) */
  children: ReactNode;
  /** Optional id of the form control — sets htmlFor on the label */
  htmlFor?: string;
  /** Optional help / description text shown below the children */
  description?: string;
  className?: string;
}

/* ─── Component ────────────────────────────────────────────────────────── */

/**
 * Field — form field wrapper with label, control area, and optional help text.
 * Renders as a <label> when htmlFor is provided, otherwise as a <div>.
 */
export function Field({
  label,
  children,
  htmlFor,
  description,
  className,
}: FieldProps) {
  const content = (
    <>
      <span className="text-[11px] font-medium uppercase tracking-wider text-ink-muted">
        {label}
      </span>
      {children}
      {description && (
        <p className="text-xs text-ink-muted/80">{description}</p>
      )}
    </>
  );

  if (htmlFor) {
    return (
      <label htmlFor={htmlFor} className={cn('flex flex-col gap-1', className)}>
        {content}
      </label>
    );
  }

  return <div className={cn('flex flex-col gap-1', className)}>{content}</div>;
}

Field.displayName = 'Field';
