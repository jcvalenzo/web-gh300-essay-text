import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { REVIEW_PAGE_SIZE } from '../../../src/config.js'
import { ResultScreen } from '../../../src/screens/result/ResultScreen.jsx'

const exam = Array.from({ length: 12 }, (_, i) => ({
  id: `q${i}`,
  domain: i % 2 ? 'Dominio B' : 'Dominio A',
  question: `Pregunta ${i}`,
  options: ['Correcta', 'Incorrecta'],
  answer: [0],
  explanation: `Explicación ${i}`,
  docs: `https://example.com/${i}`,
}))
// 9 correct, 2 wrong, 1 unanswered -> 75%
const answers = Object.fromEntries(exam.slice(0, 11).map((q, i) => [q.id, i < 9 ? [0] : [1]]))

const renderResult = (props = {}) =>
  render(<ResultScreen exam={exam} answers={answers} timedOut={false} onRestart={vi.fn()} {...props} />)

test('muestra puntaje, aprobado y desglose por dominio', () => {
  renderResult()
  expect(screen.getByRole('img', { name: 'Puntaje 75%' })).toBeInTheDocument()
  expect(screen.getByText('✓ Aprobado')).toBeInTheDocument()
  expect(screen.getByRole('progressbar', { name: 'Dominio A' })).toBeInTheDocument()
})

test('avisa cuando se acabó el tiempo', () => {
  renderResult({ timedOut: true })
  expect(screen.getByText(/Se acabó el tiempo/)).toBeInTheDocument()
})

test('pagina la revisión', async () => {
  renderResult()
  expect(screen.getAllByRole('article')).toHaveLength(REVIEW_PAGE_SIZE)
  expect(screen.getByText(`Mostrando 1–${REVIEW_PAGE_SIZE} de 12`)).toBeInTheDocument()

  await userEvent.click(screen.getByRole('button', { name: 'Página 3' }))
  expect(screen.getAllByRole('article')).toHaveLength(12 - 2 * REVIEW_PAGE_SIZE)
})

test('filtra incorrectas (incluye sin responder) y vuelve a la página 1', async () => {
  renderResult()
  await userEvent.click(screen.getByRole('button', { name: 'Página 2' }))
  await userEvent.click(screen.getByRole('tab', { name: /Incorrectas/ }))

  const items = screen.getAllByRole('article')
  expect(items).toHaveLength(3)
  expect(within(items[2]).getByText('— Sin responder')).toBeInTheDocument()
  expect(screen.queryByRole('navigation', { name: 'Paginación' })).not.toBeInTheDocument()
})

test('cada pregunta muestra explicación y enlace de repaso', () => {
  renderResult()
  const first = screen.getAllByRole('article')[0]
  expect(within(first).getByText('Explicación 0')).toBeInTheDocument()
  expect(within(first).getByRole('link', { name: /Repasar/ })).toHaveAttribute('href', 'https://example.com/0')
})
