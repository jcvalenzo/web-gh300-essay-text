import { useState } from 'react'
import { summarizeProgress } from '../../lib/exam.js'
import { ExamHeader } from './ExamHeader.jsx'
import { FinishDialog } from './FinishDialog.jsx'
import { QuestionCard } from './QuestionCard.jsx'
import { QuestionNavigator } from './QuestionNavigator.jsx'

export function ExamScreen({ exam, answers, flagged, current, remaining, select, toggleFlag, goTo, submit }) {
  const [confirming, setConfirming] = useState(false)
  const question = exam[current]
  const progress = summarizeProgress(exam, answers, flagged)

  function navigate(index) {
    goTo(index)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const askToFinish = () => setConfirming(true)

  return (
    <div className="min-h-screen">
      <ExamHeader answered={progress.answered} total={exam.length} remaining={remaining} />

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1fr_300px]">
        <QuestionCard
          question={question}
          index={current}
          total={exam.length}
          selected={answers[question.id] ?? []}
          flagged={!!flagged[question.id]}
          onSelect={select}
          onToggleFlag={toggleFlag}
          onPrev={() => navigate(current - 1)}
          onNext={() => navigate(current + 1)}
          onFinish={askToFinish}
        />
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <QuestionNavigator
            exam={exam}
            answers={answers}
            flagged={flagged}
            current={current}
            onGoTo={navigate}
            onFinish={askToFinish}
          />
        </aside>
      </main>

      <FinishDialog
        open={confirming}
        progress={progress}
        remaining={remaining}
        onCancel={() => setConfirming(false)}
        onConfirm={submit}
      />
    </div>
  )
}
