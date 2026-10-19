import { cx } from '../../lib/format.js'

const VARIANTS = {
  primary: 'bg-stone-900 text-white hover:bg-stone-700 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white',
  secondary:
    'border border-stone-300 bg-white hover:bg-stone-100 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10',
  warning: 'border border-orange-400 bg-orange-50 text-orange-800 dark:bg-orange-500/15 dark:text-orange-300',
}

const SIZES = {
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-8 py-4 text-base',
}

export function Button({ variant = 'secondary', size = 'md', type = 'button', className, ...props }) {
  return (
    <button
      type={type}
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500',
        'disabled:cursor-not-allowed disabled:opacity-40',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  )
}
