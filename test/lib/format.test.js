import { expect, test } from 'vitest'
import { cx, formatTime } from '../../src/lib/format.js'

test.each([
  [100 * 60_000, '100:00'],
  [61_500, '01:02'],
  [0, '00:00'],
  [-5, '00:00'],
])('formatTime(%i) = %s', (ms, expected) => {
  expect(formatTime(ms)).toBe(expected)
})

test('cx omite valores falsy', () => {
  expect(cx('a', false, null, undefined, '', 'b')).toBe('a b')
})
