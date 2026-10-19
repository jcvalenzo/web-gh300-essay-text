import { cx } from '../../lib/format.js'

export function ProgressBar({ value, label, barClassName = 'bg-accent-600' }) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className="h-2 overflow-hidden rounded-full bg-stone-200 dark:bg-white/10"
    >
      <div className={cx('h-full rounded-full transition-all', barClassName)} style={{ width: `${value}%` }} />
    </div>
  )
}
