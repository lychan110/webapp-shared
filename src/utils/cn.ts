import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with conflict resolution.
 * Combines clsx (conditional classes) with tailwind-merge (intelligent merging).
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-teal text-white', className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
