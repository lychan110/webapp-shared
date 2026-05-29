/* ══════════════════════════════════════════════════════════════════════════
   FilterableLedger — Generic filterable grid/ledger component
   ══════════════════════════════════════════════════════════════════════════
   A configurable, filterable grid display with category pills at the top,
   customizable columns, responsive layout, and empty state when no items
   match the active filter.

   Usage:
     <FilterableLedger
       items={projects}
       getCategory={(p) => p.category}
       categories={['all', 'work', 'academic', 'personal']}
       columns={[
         { key: 'title', label: 'TITLE', render: (p) => p.title },
         { key: 'tags', label: 'TAGS', render: (p) => p.tags.join(', ') },
       ]}
       renderRow={(item) => <div>{item.title}</div>}
       emptyMessage="No items match this filter."
     />
   ══════════════════════════════════════════════════════════════════════════ */

import { useState, useMemo, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { EmptyState } from './EmptyState';

/* ─── Types ───────────────────────────────────────────────────────────── */

export interface LedgerColumn<T> {
  /** Column key */
  key: string;
  /** Column header label */
  label: string;
  /** Render function receiving the item */
  render: (item: T) => ReactNode;
  /** Whether this column is visible on mobile */
  mobile?: boolean;
  /** Additional class name for the column */
  className?: string;
}

export interface FilterableLedgerProps<T> {
  /** Array of items to display */
  items: T[];
  /** Function to extract category from an item */
  getCategory: (item: T) => string;
  /** Available category options (first one is typically 'all') */
  categories: string[];
  /** Column definitions */
  columns: LedgerColumn<T>[];
  /** Custom row renderer (replaces columnar layout if provided) */
  renderRow?: (item: T, index: number) => ReactNode;
  /** Message shown when no items match */
  emptyMessage?: string;
  /** Empty state icon */
  emptyIcon?: string | ReactNode;
  /** External filter override (if provided, pills are not shown) */
  activeCategory?: string;
  /** Callback when category changes */
  onCategoryChange?: (category: string) => void;
  /** Additional classes */
  className?: string;
  /** Label for the category filter section */
  filterLabel?: string;
  /** Whether to show record count */
  showCount?: boolean;
}

/* ─── Component ────────────────────────────────────────────────────────── */

/**
 * FilterableLedger — A generic filterable grid component.
 *
 * Renders category filter pills at the top, configurable column headers,
 * and a list of items. When no items match the active filter, an EmptyState
 * is shown.
 *
 * @template T - The type of items in the ledger
 */
export function FilterableLedger<T>({
  items,
  getCategory,
  categories,
  columns,
  renderRow,
  emptyMessage = 'No items match this filter.',
  emptyIcon = '🔍',
  activeCategory: externalCategory,
  onCategoryChange,
  className,
  filterLabel = 'Category',
  showCount = true,
}: FilterableLedgerProps<T>) {
  const [internalCategory, setInternalCategory] = useState<string>(
    categories[0] ?? 'all',
  );

  // Use external control if provided, otherwise internal state
  const activeCategory = externalCategory ?? internalCategory;
  const setActiveCategory = onCategoryChange ?? setInternalCategory;

  const filtered = useMemo(
    () =>
      items.filter(
        (item) =>
          activeCategory === categories[0] ||
          getCategory(item) === activeCategory,
      ),
    [items, activeCategory, getCategory, categories],
  );

  return (
    <div className={cn('', className)}>
      {/* ── Filter bar ── */}
      <div className="flex items-center gap-2 py-4 border-b border-ink-soft/10 dark:border-white/10">
        <span
          className={cn(
            'font-mono mr-1 opacity-55 text-[10px]',
            'tracking-[0.1em] uppercase',
          )}
        >
          {filterLabel} →
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 select-none',
              activeCategory === cat
                ? 'bg-teal text-white dark:text-paper border-transparent'
                : 'bg-paper-deep/50 dark:bg-white/8 text-ink-soft/80 dark:text-white/70 border border-ink-soft/10 dark:border-white/10 hover:bg-teal/20 hover:text-teal',
            )}
          >
            {cat}
          </button>
        ))}
        {showCount && (
          <span
            className={cn(
              'ml-auto font-mono opacity-55 text-[10px]',
              'tracking-[0.1em] uppercase',
            )}
          >
            {String(filtered.length).padStart(3, '0')} records
          </span>
        )}
      </div>

      {/* ── Column headers ── */}
      {!renderRow && columns.length > 0 && (
        <div
          className={cn(
            'flex items-end px-3 pb-2.5 pt-3 border-b border-ink-soft/10 dark:border-white/10',
          )}
        >
          {columns.map((col) => (
            <span
              key={col.key}
              className={cn(
                'font-mono opacity-50 text-[9px] tracking-[0.2em] uppercase',
                col.mobile === false && 'hidden md:block',
                col.className,
              )}
            >
              {col.label}
            </span>
          ))}
        </div>
      )}

      {/* ── Content ── */}
      {filtered.length === 0 ? (
        <div className="py-12">
          <EmptyState
            variant="compact"
            icon={emptyIcon}
            message={emptyMessage}
          />
        </div>
      ) : renderRow ? (
        filtered.map((item, i) => (
          <div key={i}>{renderRow(item, i)}</div>
        ))
      ) : (
        filtered.map((item, i) => (
          <div
            key={i}
            className={cn(
              'flex items-start px-3 py-4 border-b border-ink-soft/5 dark:border-white/5',
              'hover:bg-ink-soft/[0.02] dark:hover:bg-white/[0.02] transition-colors',
            )}
          >
            {columns.map((col) => (
              <div
                key={col.key}
                className={cn(
                  col.mobile === false && 'hidden md:block',
                  col.className,
                )}
              >
                {col.render(item)}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

FilterableLedger.displayName = 'FilterableLedger';
