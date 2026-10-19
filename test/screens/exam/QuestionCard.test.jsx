import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'
import { QuestionCard } from '../../../src/screens/exam/QuestionCard.jsx'

const single = { id: 's', domain: 'IA responsable', question: '¿Pregunta única?', options: ['Uno', 'Dos'], answer: [1] }
const multi = { ...single, id: 'm', question: '¿Pregunta múltiple?', options: ['A', 'B', 'C'], answer: [0, 2] }

function setup(props = {}) {
  const handlers = { onSelect: vi.fn(), onToggleFlag: vi.fn(), onPrev: vi.fn(), onNext: vi.fn(), onFinish: vi.fn() }
  render(<QuestionCard question={single} index={0} total={3} selected={[]} flagged={false} {...handlers} {...props} />)
  return handlers
}

describe('QuestionCard', () => {
  test('pregunta de opción única usa radios y avisa la selección', async () => {
    const { onSelect } = setup()
    expect(screen.getAllByRole('radio')).toHaveLength(2)
    await userEvent.click(screen.getByText('Dos'))
    expect(onSelect).toHaveBeenCalledWith(1)
  })

  test('pregunta múltiple usa checkboxes e indica cuántas elegir', () => {
    setup({ question: multi })
    expect(screen.getAllByRole('checkbox')).toHaveLength(3)
    expect(screen.getByText('Selecciona 2')).toBeInTheDocument()
  })

  test('refleja la opción seleccionada', () => {
    setup({ selected: [1] })
    expect(screen.getByRole('radio', { name: /Dos/ })).toBeChecked()
  })

  test('navegación: anterior deshabilitado en la primera pregunta', async () => {
    const { onNext } = setup()
    expect(screen.getByRole('button', { name: /Anterior/ })).toBeDisabled()
    await userEvent.click(screen.getByRole('button', { name: /Siguiente/ }))
    expect(onNext).toHaveBeenCalled()
  })

  test('en la última pregunta ofrece terminar', async () => {
    const { onFinish } = setup({ index: 2 })
    await userEvent.click(screen.getByRole('button', { name: 'Terminar examen' }))
    expect(onFinish).toHaveBeenCalled()
  })

  test('marcar para revisar', async () => {
    const { onToggleFlag } = setup({ flagged: true })
    const flag = screen.getByRole('button', { name: 'Marcada para revisar' })
    expect(flag).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(flag)
    expect(onToggleFlag).toHaveBeenCalled()
  })
})
