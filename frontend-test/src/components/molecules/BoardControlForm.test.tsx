import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { BoardControlForm } from './BoardControlForm'

describe('BoardControlForm', () => {
  it('disables Generate Board when an input is out of range', async () => {
    const user = userEvent.setup()
    const onGenerate = vi.fn()
    render(<BoardControlForm initialCols={8} initialRows={8} onGenerate={onGenerate} />)

    const colsInput = screen.getByLabelText('Columns')
    await user.clear(colsInput)
    await user.type(colsInput, '101')

    expect(screen.getByRole('button', { name: 'Generate Board' })).toBeDisabled()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('calls onGenerate with the parsed values when valid', async () => {
    const user = userEvent.setup()
    const onGenerate = vi.fn()
    render(<BoardControlForm initialCols={8} initialRows={8} onGenerate={onGenerate} />)

    const rowsInput = screen.getByLabelText('Rows')
    await user.clear(rowsInput)
    await user.type(rowsInput, '12')

    await user.click(screen.getByRole('button', { name: 'Generate Board' }))

    expect(onGenerate).toHaveBeenCalledWith(8, 12)
  })
})
