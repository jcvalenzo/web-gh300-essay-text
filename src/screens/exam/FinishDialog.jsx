import { useEffect, useRef } from 'react'
import { Button } from '../../components/ui/Button.jsx'
import { cx, formatTime } from '../../lib/format.js'

// Native <dialog> controlled by `open`; Esc (native close) and "Seguir respondiendo" both report onCancel.
export function FinishDialog({ open, progress, remaining, onCancel, onConfirm }) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const stats = [
    [progress.answered, 'Respondidas', ''],
    [progress.unanswered, 'Sin responder', progress.unanswered > 0 && 'text-red-600 dark:text-red-400'],
    [progress.flagged, 'Marcadas', 'text-orange-600 dark:text-orange-400'],
  ]

  return (
    <dialog
      ref={ref}
      onClose={onCancel}
      aria-labelledby="finish-title"
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-lg border border-stone-200 bg-white p-0 text-stone-900 shadow-xl backdrop:bg-stone-950/60 dark:border-white/10 dark:bg-stone-900 dark:text-stone-100"
    >
      <div className="p-6">
        <h2 id="finish-title" className="text-lg font-bold">
          ¿Terminar el examen?
        </h2>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
          Una vez entregado no podrás cambiar tus respuestas.
        </p>
        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          {stats.map(([value, label, tone]) => (
            <div key={label} className="rounded-md bg-stone-100 p-3 dark:bg-white/5">
              <p className={cx('text-2xl font-bold tabular-nums', tone)}>{value}</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">{label}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-stone-600 dark:text-stone-400">
          Tiempo restante: <span className="font-mono font-semibold tabular-nums">{formatTime(remaining)}</span>
        </p>
      </div>
      <div className="flex justify-end gap-2 border-t border-stone-200 bg-stone-50 px-6 py-4 dark:border-white/10 dark:bg-white/5">
        <Button autoFocus onClick={onCancel}>
          Seguir respondiendo
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Terminar examen
        </Button>
      </div>
    </dialog>
  )
}
