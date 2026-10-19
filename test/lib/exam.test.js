import { describe, expect, test } from 'vitest'
import questions from '../../src/data/questions.json'
import {
  buildExam,
  countByDomain,
  grade,
  isCorrect,
  summarizeProgress,
  toPercent,
  toggleSelection,
} from '../../src/lib/exam.js'

const correctTexts = (q) => q.answer.map((i) => q.options[i]).sort()

describe('buildExam', () => {
  test('mezcla preguntas y opciones sin perder la respuesta correcta', () => {
    const exam = buildExam(questions)
    expect(exam).toHaveLength(questions.length)
    for (const q of exam) {
      expect(correctTexts(q)).toEqual(correctTexts(questions.find((o) => o.id === q.id)))
    }
  })

  test('no modifica el banco original', () => {
    const before = JSON.stringify(questions)
    buildExam(questions)
    expect(JSON.stringify(questions)).toBe(before)
  })
})

describe('isCorrect', () => {
  const multi = { answer: [0, 2] }
  test.each([
    [[2, 0], true],
    [[0], false],
    [[0, 1, 2], false],
    [undefined, false],
  ])('selección %j -> %s', (selected, expected) => {
    expect(isCorrect(multi, selected)).toBe(expected)
  })
})

describe('toggleSelection', () => {
  test('selección única reemplaza', () => expect(toggleSelection([1], 2, false)).toEqual([2]))
  test('múltiple agrega', () => expect(toggleSelection([1], 2, true)).toEqual([1, 2]))
  test('múltiple quita', () => expect(toggleSelection([1, 2], 1, true)).toEqual([2]))
  test('sin selección previa', () => expect(toggleSelection(undefined, 0, true)).toEqual([0]))
})

test('toPercent redondea y tolera total 0', () => {
  expect(toPercent(2, 3)).toBe(67)
  expect(toPercent(0, 0)).toBe(0)
})

test('countByDomain', () => {
  expect(countByDomain([{ domain: 'a' }, { domain: 'b' }, { domain: 'a' }])).toEqual({ a: 2, b: 1 })
})

describe('grade', () => {
  const exam = [
    { id: '1', domain: 'A', answer: [0] },
    { id: '2', domain: 'A', answer: [1] },
    { id: '3', domain: 'B', answer: [0, 1] },
  ]

  test('calcula total, porcentaje y desglose por dominio', () => {
    const r = grade(exam, { 1: [0], 2: [0], 3: [1, 0] })
    expect(r).toMatchObject({ correct: 2, total: 3, percent: 67, passed: false })
    expect(r.byDomain).toEqual({ A: { correct: 1, total: 2 }, B: { correct: 1, total: 1 } })
  })

  test('aprueba con 70% o más', () => {
    expect(grade(exam, { 1: [0], 2: [1], 3: [0, 1] }).passed).toBe(true)
  })
})

test('summarizeProgress', () => {
  const exam = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
  expect(summarizeProgress(exam, { a: [0], b: [] }, { c: true })).toEqual({ answered: 1, unanswered: 2, flagged: 1 })
})
