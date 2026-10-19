import { isMultiple, toggleSelection } from './exam.js'

export const PHASE = { START: 'start', EXAM: 'exam', RESULT: 'result' }

export const initialSession = {
  phase: PHASE.START,
  exam: [],
  answers: {},
  flagged: {},
  current: 0,
  endsAt: 0,
  timedOut: false,
}

// Exam state machine: start -> exam -> result. Pure, so it is tested without React.
export function sessionReducer(state, action) {
  switch (action.type) {
    case 'start':
      return { ...initialSession, phase: PHASE.EXAM, exam: action.exam, endsAt: action.endsAt }

    case 'select': {
      if (state.phase !== PHASE.EXAM) return state
      const q = state.exam[state.current]
      const next = toggleSelection(state.answers[q.id], action.option, isMultiple(q))
      return { ...state, answers: { ...state.answers, [q.id]: next } }
    }

    case 'toggleFlag': {
      if (state.phase !== PHASE.EXAM) return state
      const { id } = state.exam[state.current]
      return { ...state, flagged: { ...state.flagged, [id]: !state.flagged[id] } }
    }

    case 'goTo': {
      const current = Math.min(Math.max(action.index, 0), state.exam.length - 1)
      return { ...state, current }
    }

    case 'submit':
      if (state.phase !== PHASE.EXAM) return state
      return { ...state, phase: PHASE.RESULT, timedOut: !!action.timedOut }

    default:
      throw new Error(`Acción desconocida: ${action.type}`)
  }
}
