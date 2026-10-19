import { cx } from '../../lib/format.js'

const TONES = {
  accent: 'bg-accent-100 text-accent-700 dark:bg-accent-500/15 dark:text-accent-300',
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  danger: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
  warning: 'bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-300',
}

export function Badge({ tone = 'accent', className, ...props }) {
  return (
    <span
      className={cx('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', TONES[tone], className)}
      {...props}
    />
  )
}
