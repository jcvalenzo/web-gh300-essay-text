import { cx } from '../../lib/format.js'

export function Card({ as: Tag = 'section', className, ...props }) {
  return (
    <Tag
      className={cx(
        'rounded-lg border border-stone-200 bg-white shadow-sm dark:border-white/10 dark:bg-stone-900',
        className,
      )}
      {...props}
    />
  )
}
