import { cx } from '../../lib/format.js'
import { Button } from './Button.jsx'

export function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null
  return (
    <nav aria-label="Paginación" className="flex flex-wrap items-center justify-center gap-1.5">
      <Button onClick={() => onChange(page - 1)} disabled={page === 0}>
        ← Anterior
      </Button>
      {Array.from({ length: pages }, (_, p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          aria-current={p === page ? 'page' : undefined}
          aria-label={`Página ${p + 1}`}
          className={cx(
            'size-10 rounded-md text-sm font-semibold tabular-nums transition',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500',
            p === page
              ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
              : 'border border-stone-300 bg-white hover:bg-stone-100 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10',
          )}
        >
          {p + 1}
        </button>
      ))}
      <Button onClick={() => onChange(page + 1)} disabled={page === pages - 1}>
        Siguiente →
      </Button>
    </nav>
  )
}
