import { useEffect } from 'react'
import questions from './data/questions.json'
import { useExamSession } from './hooks/useExamSession.js'
import { PHASE } from './lib/session.js'
import { ExamScreen } from './screens/exam/ExamScreen.jsx'
import { ResultScreen } from './screens/result/ResultScreen.jsx'
import { StartScreen } from './screens/start/StartScreen.jsx'

export default function App() {
  const session = useExamSession(questions)

  useEffect(() => window.scrollTo(0, 0), [session.phase])

  switch (session.phase) {
    case PHASE.EXAM:
      return <ExamScreen {...session} />
    case PHASE.RESULT:
      return (
        <ResultScreen
          exam={session.exam}
          answers={session.answers}
          timedOut={session.timedOut}
          onRestart={session.start}
        />
      )
    default:
      return <StartScreen questions={questions} onStart={session.start} />
  }
}
