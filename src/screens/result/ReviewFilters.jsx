import { cx } from '../../lib/format.js'
import { REVIEW_FILTERS } from './filters.js'

export function ReviewFilters({ items, active, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Filtrar respuestas"
      className="inline-flex rounded-md border border-stone-300 bg-white p-0.5 dark:border-white/15 dark:bg-white/5"
    >
      {REVIEW_FILTERS.map((f) => (
        <button
          key={f.key}
          type="button"
          role="tab"
          aria-selected={active === f.key}
          onClick={() => onChange(f.key)}
          className={cx(
            'rounded px-3 py-1.5 text-sm font-medium transition',
            active === f.key
              ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
              : 'text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-white/10',
          )}
        >
          {f.label} <span className="tabular-nums opacity-70">{items.filter(f.test).length}</span>
        </button>
      ))}
    </div>
  )
}
