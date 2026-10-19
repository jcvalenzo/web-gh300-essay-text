import { describe, expect, test } from 'vitest'
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

  test('ids únicos', () => {
    expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length)
  })
})
