import { useMemo, useRef, useState } from 'react'
import { Logo } from '../../components/Logo.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Pagination } from '../../components/ui/Pagination.jsx'
import { REVIEW_PAGE_SIZE } from '../../config.js'
import { grade, isCorrect } from '../../lib/exam.js'
import { paginate } from '../../lib/paginate.js'
import { ReviewFilters } from './ReviewFilters.jsx'
import { ReviewItem } from './ReviewItem.jsx'
import { REVIEW_FILTERS } from './filters.js'
import { ScoreSummary } from './ScoreSummary.jsx'

export function ResultScreen({ exam, answers, timedOut, onRestart }) {
  const [filter, setFilter] = useState(REVIEW_FILTERS[0].key)
  const [page, setPage] = useState(0)
  const reviewRef = useRef(null)

  const result = useMemo(() => grade(exam, answers), [exam, answers])
  const items = useMemo(
    () => exam.map((question, i) => ({ question, number: i + 1, ok: isCorrect(question, answers[question.id]) })),
    [exam, answers],
  )
  const filtered = items.filter(REVIEW_FILTERS.find((f) => f.key === filter).test)
  const view = paginate(filtered, page, REVIEW_PAGE_SIZE)

  function changeFilter(key) {
    setFilter(key)
    setPage(0)
  }

  function changePage(p) {
    setPage(p)
    reviewRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Logo />
      <ScoreSummary result={result} timedOut={timedOut} onRestart={onRestart} />

      <div ref={reviewRef} className="mt-12 mb-4 flex scroll-mt-4 flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Revisión de respuestas</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {filtered.length
              ? `Mostrando ${view.start + 1}–${view.start + view.items.length} de ${filtered.length}`
              : 'No hay preguntas en este filtro'}
          </p>
        </div>
        <ReviewFilters items={items} active={filter} onChange={changeFilter} />
      </div>

      <div className="space-y-4">
        {view.items.map(({ question, number, ok }) => (
          <ReviewItem
            key={question.id}
            question={question}
            number={number}
            ok={ok}
            selected={answers[question.id] ?? []}
          />
        ))}
      </div>

      <div className="mt-6">
        <Pagination page={view.page} pages={view.pages} onChange={changePage} />
      </div>

      <div className="mt-8 flex justify-center">
        <Button variant="primary" onClick={onRestart}>
          Repetir examen
        </Button>
      </div>
    </main>
  )
}
