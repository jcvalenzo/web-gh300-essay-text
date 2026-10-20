import { describe, expect, test } from 'vitest'
import questions from '../../src/data/questions.json'
import {
  buildExam,
  countByDomain,
  grade,
  isCorrect,
  pickByWeight,
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

  test('elige la cantidad pedida de preguntas distintas', () => {
    const exam = buildExam(questions, 10)
    expect(exam).toHaveLength(10)
    expect(new Set(exam.map((q) => q.id)).size).toBe(10)
  })

  test('un intento de 60 sigue los pesos oficiales del examen', () => {
    expect(countByDomain(buildExam(questions, 60))).toEqual({
      'IA responsable': 11,
      'Funcionalidades de Copilot': 17,
      'Datos y arquitectura': 8,
      'Ingeniería de prompts y contexto': 8,
      'Productividad del desarrollador': 8,
      'Privacidad, exclusiones y salvaguardas': 8,
    })
  })

  test('no modifica el banco original', () => {
    const before = JSON.stringify(questions)
    buildExam(questions)
    expect(JSON.stringify(questions)).toBe(before)
  })
})

describe('pickByWeight', () => {
  const bank = [
    ...Array.from({ length: 10 }, (_, i) => ({ id: `a${i}`, domain: 'A' })),
    ...Array.from({ length: 2 }, (_, i) => ({ id: `b${i}`, domain: 'B' })),
  ]

  test('respeta la cuota de cada dominio', () => {
    expect(countByDomain(pickByWeight(bank, 4, { A: 0.5, B: 0.5 }))).toEqual({ A: 2, B: 2 })
  })

  test('completa con otros dominios si a uno le faltan preguntas', () => {
    const picked = pickByWeight(bank, 8, { A: 0.5, B: 0.5 })
    expect(countByDomain(picked)).toEqual({ A: 6, B: 2 })
    expect(new Set(picked.map((q) => q.id)).size).toBe(8)
  })

  test('con el banco completo incluye todas las preguntas', () => {
    expect(pickByWeight(bank, bank.length, { A: 0.5, B: 0.5 })).toHaveLength(bank.length)
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
