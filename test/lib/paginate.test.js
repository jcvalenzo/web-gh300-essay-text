import { expect, test } from 'vitest'
import { paginate } from '../../src/lib/paginate.js'

const items = Array.from({ length: 12 }, (_, i) => i)

test('primera página', () => {
  expect(paginate(items, 0, 5)).toEqual({ page: 0, pages: 3, start: 0, items: [0, 1, 2, 3, 4] })
})

test('última página incompleta', () => {
  expect(paginate(items, 2, 5).items).toEqual([10, 11])
})

test('página fuera de rango se ajusta', () => {
  expect(paginate(items, 9, 5).page).toBe(2)
  expect(paginate(items, -3, 5).page).toBe(0)
})

test('lista vacía tiene una página', () => {
  expect(paginate([], 0, 5)).toEqual({ page: 0, pages: 1, start: 0, items: [] })
})
