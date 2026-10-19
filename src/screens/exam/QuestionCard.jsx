import { Badge } from '../../components/ui/Badge.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Card } from '../../components/ui/Card.jsx'
import { isMultiple } from '../../lib/exam.js'
import { cx } from '../../lib/format.js'

const LETTERS = 'ABCDEFGH'

export function QuestionCard({
  question,
  index,
  total,
  selected,
  flagged,
  onSelect,
  onToggleFlag,
  onPrev,
  onNext,
  onFinish,
}) {
  const multiple = isMultiple(question)
  const isLast = index === total - 1

  return (
    <Card className="p-5 sm:p-8">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-stone-500 dark:text-stone-400">
          Pregunta {index + 1} de {total}
        </span>
        <Badge>{question.domain}</Badge>
        {multiple && <Badge tone="warning">Selecciona {question.answer.length}</Badge>}
      </div>
      <h2 className="text-xl leading-snug font-semibold sm:text-2xl">{question.question}</h2>

      <fieldset className="mt-6 space-y-3">
        <legend className="sr-only">Opciones</legend>
        {question.options.map((text, i) => (
          <Option
            key={i}
            name={question.id}
            letter={LETTERS[i]}
            text={text}
            multiple={multiple}
            checked={selected.includes(i)}
            onChange={() => onSelect(i)}
          />
        ))}
      </fieldset>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 pt-5 dark:border-white/10">
        <Button variant={flagged ? 'warning' : 'secondary'} aria-pressed={flagged} onClick={onToggleFlag}>
          {flagged ? 'Marcada para revisar' : 'Marcar para revisar'}
        </Button>
        <div className="flex gap-2">
          <Button onClick={onPrev} disabled={index === 0}>
            ← Anterior
          </Button>
          <Button variant="primary" onClick={isLast ? onFinish : onNext}>
            {isLast ? 'Terminar examen' : 'Siguiente →'}
          </Button>
        </div>
      </div>
    </Card>
  )
}

function Option({ name, letter, text, multiple, checked, onChange }) {
  return (
    <label
      className={cx(
        'group flex cursor-pointer items-start gap-4 rounded-md border p-4 transition',
        'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-500',
        checked
          ? 'border-accent-500 bg-accent-50 shadow-sm dark:border-accent-400 dark:bg-accent-500/10'
          : 'border-stone-200 hover:border-accent-300 hover:bg-stone-50 dark:border-white/10 dark:hover:border-accent-400/50 dark:hover:bg-white/5',
      )}
    >
      <input
        type={multiple ? 'checkbox' : 'radio'}
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        aria-hidden
        className={cx(
          'grid size-8 shrink-0 place-items-center text-sm font-bold transition',
          multiple ? 'rounded-lg' : 'rounded-full',
          checked
            ? 'bg-accent-600 text-white'
            : 'bg-stone-100 text-stone-600 group-hover:bg-accent-100 dark:bg-white/10 dark:text-stone-300',
        )}
      >
        {letter}
      </span>
      <span className="pt-1">{text}</span>
    </label>
  )
}
