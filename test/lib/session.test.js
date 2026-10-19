import { describe, expect, test } from 'vitest'
import { PHASE, initialSession, sessionReducer } from '../../src/lib/session.js'

const exam = [
  { id: 'single', answer: [0], options: ['a', 'b'] },
  { id: 'multi', answer: [0, 1], options: ['a', 'b', 'c'] },
  { id: 'last', answer: [1], options: ['a', 'b'] },
]
const started = sessionReducer(initialSession, { type: 'start', exam, endsAt: 123 })

describe('sessionReducer', () => {
  test('start reinicia el estado y entra en examen', () => {
    const dirty = { ...started, answers: { single: [1] }, current: 2 }
    const s = sessionReducer(dirty, { type: 'start', exam, endsAt: 456 })
    expect(s).toMatchObject({ phase: PHASE.EXAM, current: 0, answers: {}, flagged: {}, endsAt: 456, timedOut: false })
  })

  test('select en pregunta de opción única reemplaza la respuesta', () => {
    let s = sessionReducer(started, { type: 'select', option: 0 })
    s = sessionReducer(s, { type: 'select', option: 1 })
    expect(s.answers.single).toEqual([1])
  })

  test('select en pregunta múltiple acumula', () => {
    let s = sessionReducer(started, { type: 'goTo', index: 1 })
    s = sessionReducer(s, { type: 'select', option: 0 })
    s = sessionReducer(s, { type: 'select', option: 2 })
    expect(s.answers.multi).toEqual([0, 2])
  })

  test('toggleFlag alterna la marca de la pregunta actual', () => {
    const once = sessionReducer(started, { type: 'toggleFlag' })
    expect(once.flagged.single).toBe(true)
    expect(sessionReducer(once, { type: 'toggleFlag' }).flagged.single).toBe(false)
  })

  test('goTo limita el índice al rango del examen', () => {
    expect(sessionReducer(started, { type: 'goTo', index: 99 }).current).toBe(2)
    expect(sessionReducer(started, { type: 'goTo', index: -1 }).current).toBe(0)
  })

  test('submit entrega una sola vez y conserva timedOut', () => {
    const done = sessionReducer(started, { type: 'submit', timedOut: true })
    expect(done).toMatchObject({ phase: PHASE.RESULT, timedOut: true })
    expect(sessionReducer(done, { type: 'submit' })).toBe(done)
  })

  test('ignora respuestas y marcas fuera del examen', () => {
    const done = sessionReducer(started, { type: 'submit' })
    expect(sessionReducer(done, { type: 'select', option: 0 })).toBe(done)
    expect(sessionReducer(done, { type: 'toggleFlag' })).toBe(done)
  })

  test('acción desconocida lanza error', () => {
    expect(() => sessionReducer(started, { type: 'nope' })).toThrow('nope')
  })
})
