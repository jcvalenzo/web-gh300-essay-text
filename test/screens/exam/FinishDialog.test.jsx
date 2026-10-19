import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { FinishDialog } from '../../../src/screens/exam/FinishDialog.jsx'

const progress = { answered: 60, unanswered: 6, flagged: 3 }

function setup(open = true) {
  const handlers = { onCancel: vi.fn(), onConfirm: vi.fn() }
  const view = render(<FinishDialog open={open} progress={progress} remaining={65_000} {...handlers} />)
  return { ...handlers, ...view }
}

test('cerrado no se muestra', () => {
  setup(false)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

test('abierto muestra el resumen y el tiempo restante', () => {
  setup()
  const dialog = screen.getByRole('dialog', { name: '¿Terminar el examen?' })
  expect(dialog).toHaveTextContent('60Respondidas')
  expect(dialog).toHaveTextContent('6Sin responder')
  expect(dialog).toHaveTextContent('3Marcadas')
  expect(dialog).toHaveTextContent('01:05')
})

test('confirmar llama onConfirm', async () => {
  const { onConfirm, onCancel } = setup()
  await userEvent.click(screen.getByRole('button', { name: 'Terminar examen' }))
  expect(onConfirm).toHaveBeenCalled()
  expect(onCancel).not.toHaveBeenCalled()
})

test('al cerrarse el diálogo llama onCancel', () => {
  const { onCancel } = setup()
  screen.getByRole('dialog').close()
  expect(onCancel).toHaveBeenCalled()
})
