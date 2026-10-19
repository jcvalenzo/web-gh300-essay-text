import { PASS_PERCENT } from '../config.js'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const isMultiple = (q) => q.answer.length > 1

export const toPercent = (part, total) => (total ? Math.round((part * 100) / total) : 0)

// Shuffles questions and their options; `answer` is remapped to the new option order.
export function buildExam(questions) {
  return shuffle(questions).map((q) => {
    const order = shuffle(q.options.map((_, i) => i))
    return {
      ...q,
      options: order.map((i) => q.options[i]),
      answer: order.flatMap((orig, i) => (q.answer.includes(orig) ? [i] : [])),
    }
  })
}

export function toggleSelection(selected = [], option, multiple) {
  if (!multiple) return [option]
  return selected.includes(option) ? selected.filter((x) => x !== option) : [...selected, option]
}

export const isCorrect = (q, selected = []) =>
  selected.length === q.answer.length && q.answer.every((a) => selected.includes(a))

export function countByDomain(questions) {
  const counts = {}
  for (const q of questions) counts[q.domain] = (counts[q.domain] ?? 0) + 1
  return counts
}

export function summarizeProgress(exam, answers, flagged) {
  const answered = exam.filter((q) => answers[q.id]?.length).length
  return {
    answered,
    unanswered: exam.length - answered,
    flagged: exam.filter((q) => flagged[q.id]).length,
  }
}

export function grade(exam, answers) {
  const byDomain = {}
  let correct = 0
  for (const q of exam) {
    const d = (byDomain[q.domain] ??= { correct: 0, total: 0 })
    d.total++
    if (isCorrect(q, answers[q.id])) {
      d.correct++
      correct++
    }
  }
  const percent = toPercent(correct, exam.length)
  return { correct, total: exam.length, percent, passed: percent >= PASS_PERCENT, byDomain }
}
