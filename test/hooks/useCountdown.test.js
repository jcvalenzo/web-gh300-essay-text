import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { useCountdown } from '../../src/hooks/useCountdown.js'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

test('cuenta hacia atrás y llama onExpire al llegar a cero', () => {
  const onExpire = vi.fn()
  const endsAt = Date.now() + 3000
  const { result } = renderHook(() => useCountdown(endsAt, onExpire))
  expect(result.current).toBe(3000)

  act(() => vi.advanceTimersByTime(1000))
  expect(result.current).toBe(2000)
  expect(onExpire).not.toHaveBeenCalled()

  act(() => vi.advanceTimersByTime(2000))
  expect(result.current).toBe(0)
  expect(onExpire).toHaveBeenCalled()
})

test('endsAt 0 lo deja inactivo', () => {
  const onExpire = vi.fn()
  const { result } = renderHook(() => useCountdown(0, onExpire))
  act(() => vi.advanceTimersByTime(5000))
  expect(result.current).toBe(0)
  expect(onExpire).not.toHaveBeenCalled()
})
