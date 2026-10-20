import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'
import App from '../src/App.jsx'
import { EXAM_MINUTES, EXAM_QUESTIONS } from '../src/config.js'
import questions from '../src/data/questions.json'

afterEach(() => vi.useRealTimers())

test('flujo completo: comenzar, responder, confirmar y ver resultados', async () => {
  const user = userEvent.setup()
  render(<App />)

  await user.click(screen.getByRole('button', { name: /Comenzar examen/ }))
  expect(screen.getByText(`Pregunta 1 de ${EXAM_QUESTIONS}`)).toBeInTheDocument()
  expect(screen.getByRole('timer')).toHaveTextContent(`${EXAM_MINUTES}:00`)

  // The first question is random: it may be single (radio) or multiple choice (checkbox).
  const [firstOption] = [...screen.queryAllByRole('radio'), ...screen.queryAllByRole('checkbox')]
  await user.click(firstOption)
  expect(screen.getByText(`1/${EXAM_QUESTIONS} respondidas`)).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: 'Pregunta 2' }))
  expect(screen.getByText(`Pregunta 2 de ${EXAM_QUESTIONS}`)).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: 'Terminar y revisar' }))
  const dialog = screen.getByRole('dialog')
  expect(dialog).toHaveTextContent(`${EXAM_QUESTIONS - 1}Sin responder`)

  await user.click(screen.getByRole('button', { name: 'Seguir respondiendo' }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: 'Terminar y revisar' }))
  await user.click(screen.getByRole('button', { name: 'Terminar examen' }))
  expect(screen.getByText('✕ No aprobado')).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Revisión de respuestas' })).toBeInTheDocument()

  await user.click(screen.getAllByRole('button', { name: 'Repetir examen' })[0])
  expect(screen.getByText(`0/${EXAM_QUESTIONS} respondidas`)).toBeInTheDocument()
})

test('al acabarse el tiempo entrega el examen automáticamente', () => {
  vi.useFakeTimers()
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: /Comenzar examen/ }))

  act(() => vi.advanceTimersByTime(EXAM_MINUTES * 60_000))
  expect(screen.getByText(/Se acabó el tiempo/)).toBeInTheDocument()
})

test('permite elegir el banco completo y repetir con la misma cantidad', async () => {
  const user = userEvent.setup()
  render(<App />)

  await user.click(screen.getByRole('radio', { name: new RegExp(`${questions.length} todas`) }))
  await user.click(screen.getByRole('button', { name: /Comenzar examen/ }))
  expect(screen.getByText(`Pregunta 1 de ${questions.length}`)).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: 'Terminar y revisar' }))
  await user.click(screen.getByRole('button', { name: 'Terminar examen' }))
  await user.click(screen.getAllByRole('button', { name: 'Repetir examen' })[0])
  expect(screen.getByText(`0/${questions.length} respondidas`)).toBeInTheDocument()
})
