import { Button } from '../../components/ui/Button.jsx'
import { Card } from '../../components/ui/Card.jsx'
import { cx } from '../../lib/format.js'

export function QuestionNavigator({ exam, answers, flagged, current, onGoTo, onFinish }) {
  return (
    <Card className="p-5" aria-label="Navegación de preguntas">
      <h3 className="mb-3 text-sm font-semibold text-stone-500 dark:text-stone-400">Preguntas</h3>
      <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-10 lg:grid-cols-6">
        {exam.map((q, i) => {
          const answered = answers[q.id]?.length > 0
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onGoTo(i)}
              aria-current={i === current ? 'step' : undefined}
              aria-label={`Pregunta ${i + 1}${flagged[q.id] ? ', marcada' : ''}${answered ? ', respondida' : ''}`}
              className={cx(
                'relative aspect-square rounded-lg text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-accent-500',
                answered
                  ? 'bg-accent-600 text-white hover:bg-accent-500'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-white/5 dark:text-stone-300 dark:hover:bg-white/10',
                i === current &&
                  'ring-2 ring-stone-900 ring-offset-2 ring-offset-white dark:ring-stone-100 dark:ring-offset-stone-950',
              )}
            >
              {i + 1}
              {flagged[q.id] && <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-orange-400" />}
            </button>
          )
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500 dark:text-stone-400">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded bg-accent-600" /> Respondida
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-orange-400" /> Marcada
        </span>
      </div>
      <Button className="mt-5 w-full" onClick={onFinish}>
        Terminar y revisar
      </Button>
    </Card>
  )
}
