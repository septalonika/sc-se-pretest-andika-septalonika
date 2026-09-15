import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { DEFAULT_COLS, DEFAULT_ROWS } from '@/lib/constants'
import { useBoardStore } from '@/store/useBoardStore'
import { ChessBoard } from './ChessBoard'

beforeEach(() => {
  useBoardStore.setState({
    cols: DEFAULT_COLS,
    rows: DEFAULT_ROWS,
    knight: { x: 0, y: 0 },
  })
})

describe('ChessBoard', () => {
  it('moves the knight when a legal square is clicked', async () => {
    const user = userEvent.setup()
    render(<ChessBoard />)

    await user.click(screen.getByLabelText('column 2, row 1'))

    expect(useBoardStore.getState().knight).toEqual({ x: 2, y: 1 })
  })

  it('does not move the knight when an illegal square is clicked', async () => {
    const user = userEvent.setup()
    render(<ChessBoard />)

    await user.click(screen.getByLabelText('column 1, row 1'))

    expect(useBoardStore.getState().knight).toEqual({ x: 0, y: 0 })
  })
})
