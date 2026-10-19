import { Logo } from '../../components/Logo.jsx'
import { ProgressBar } from '../../components/ui/ProgressBar.jsx'
import { CRITICAL_TIME_MS, LOW_TIME_MS } from '../../config.js'
import { toPercent } from '../../lib/exam.js'
import { cx, formatTime } from '../../lib/format.js'

export function ExamHeader({ answered, total, remaining }) {
  return (
    <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-stone-950/80">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Logo />
        <div className="hidden flex-1 sm:block">
          <div className="mb-1 flex justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>Progreso</span>
            <span>
              {answered}/{total} respondidas
            </span>
          </div>
          <ProgressBar value={toPercent(answered, total)} label="Preguntas respondidas" />
        </div>
        <Timer remaining={remaining} />
      </div>
    </header>
  )
}

function Timer({ remaining }) {
  const low = remaining < LOW_TIME_MS
  return (
    <span
      role="timer"
      aria-label="Tiempo restante"
      className={cx(
        'ml-auto rounded-md px-3 py-1.5 font-mono text-lg font-bold tabular-nums ring-1 sm:ml-0',
        low
          ? 'bg-red-50 text-red-600 ring-red-200 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/30'
          : 'bg-stone-100 ring-stone-200 dark:bg-white/5 dark:ring-white/10',
        remaining < CRITICAL_TIME_MS && 'animate-pulse',
      )}
    >
      {formatTime(remaining)}
    </span>
  )
}
