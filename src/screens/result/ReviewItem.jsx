import { Badge } from '../../components/ui/Badge.jsx'
import { Card } from '../../components/ui/Card.jsx'
import { cx } from '../../lib/format.js'

export function ReviewItem({ question, number, selected, ok }) {
  const status = ok ? '✓ Correcta' : selected.length ? '✕ Incorrecta' : '— Sin responder'

  return (
    <Card as="article" className={cx('border-l-4 p-5 sm:p-6', ok ? 'border-l-emerald-500' : 'border-l-red-500')}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-stone-500 dark:text-stone-400">#{number}</span>
        <Badge tone={ok ? 'success' : 'danger'}>{status}</Badge>
        <Badge>{question.domain}</Badge>
      </div>
      <h3 className="mt-3 leading-snug font-semibold">{question.question}</h3>

      <ul className="mt-4 space-y-2">
        {question.options.map((text, i) => (
          <ReviewOption key={i} text={text} right={question.answer.includes(i)} picked={selected.includes(i)} />
        ))}
      </ul>

      <div className="mt-4 rounded-md bg-stone-50 p-4 text-sm leading-relaxed dark:bg-white/5">
        <span className="font-semibold">Explicación: </span>
        {question.explanation}
      </div>
      <a
        href={question.docs}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600 hover:underline dark:text-accent-400"
      >
        Repasar en la documentación ↗
      </a>
    </Card>
  )
}

function ReviewOption({ text, right, picked }) {
  return (
    <li
      className={cx(
        'flex items-start gap-3 rounded-lg px-3 py-2 text-sm',
        right && 'bg-emerald-50 text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-200',
        !right && picked && 'bg-red-50 text-red-900 dark:bg-red-500/10 dark:text-red-200',
        !right && !picked && 'text-stone-600 dark:text-stone-400',
      )}
    >
      <span className="w-4 shrink-0 font-bold">{right ? '✓' : picked ? '✕' : '·'}</span>
      <span className="flex-1">{text}</span>
      {picked && <span className="shrink-0 text-xs font-medium opacity-75">tu respuesta</span>}
    </li>
  )
}
