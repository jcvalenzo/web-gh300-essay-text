import { useCallback, useMemo, useReducer } from 'react'
import { EXAM_MINUTES } from '../config.js'
import { buildExam } from '../lib/exam.js'
import { PHASE, initialSession, sessionReducer } from '../lib/session.js'
import { useCountdown } from './useCountdown.js'

export function useExamSession(questionBank) {
  const [state, dispatch] = useReducer(sessionReducer, initialSession)

  const onExpire = useCallback(() => dispatch({ type: 'submit', timedOut: true }), [])
  const remaining = useCountdown(state.phase === PHASE.EXAM ? state.endsAt : 0, onExpire)

  const actions = useMemo(
    () => ({
      start: (size) =>
        dispatch({ type: 'start', exam: buildExam(questionBank, size), endsAt: Date.now() + EXAM_MINUTES * 60_000 }),
      select: (option) => dispatch({ type: 'select', option }),
      toggleFlag: () => dispatch({ type: 'toggleFlag' }),
      goTo: (index) => dispatch({ type: 'goTo', index }),
      submit: () => dispatch({ type: 'submit' }),
    }),
    [questionBank],
  )

  return { ...state, remaining, ...actions }
}
