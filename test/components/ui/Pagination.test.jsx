import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { Pagination } from '../../../src/components/ui/Pagination.jsx'

test('no se muestra con una sola página', () => {
  const { container } = render(<Pagination page={0} pages={1} onChange={() => {}} />)
  expect(container).toBeEmptyDOMElement()
})

test('marca la página actual y navega', async () => {
  const onChange = vi.fn()
  render(<Pagination page={0} pages={3} onChange={onChange} />)

  expect(screen.getByRole('button', { name: 'Página 1' })).toHaveAttribute('aria-current', 'page')
  expect(screen.getByRole('button', { name: /Anterior/ })).toBeDisabled()

  await userEvent.click(screen.getByRole('button', { name: 'Página 3' }))
  await userEvent.click(screen.getByRole('button', { name: /Siguiente/ }))
  expect(onChange.mock.calls).toEqual([[2], [1]])
})
