import { describe, expect, test } from 'vitest'
import { DOMAIN_WEIGHTS } from '../../src/config.js'
import questions from '../../src/data/questions.json'

describe('banco de preguntas', () => {
  test.each(questions.map((q) => [q.id, q]))('%s es válida', (_, q) => {
    expect(q.question).toBeTruthy()
    expect(q.domain).toBeTruthy()
    expect(q.explanation).toBeTruthy()
    expect(q.docs).toMatch(/^https:\/\//)
    expect(q.answer.length).toBeGreaterThan(0)
    for (const a of q.answer) expect(a).toBeLessThan(q.options.length)
  })

  test('los pesos cubren exactamente los dominios del banco', () => {
    expect(Object.keys(DOMAIN_WEIGHTS).sort()).toEqual([...new Set(questions.map((q) => q.domain))].sort())
  })

  test('ids únicos', () => {
    expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length)
  })
})
