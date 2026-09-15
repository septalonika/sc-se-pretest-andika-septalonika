import { beforeEach, describe, expect, it } from 'vitest'
import { DEFAULT_COLS, DEFAULT_ROWS } from '@/lib/constants'
import { useBoardStore } from './useBoardStore'

beforeEach(() => {
  useBoardStore.setState({
    cols: DEFAULT_COLS,
    rows: DEFAULT_ROWS,
    knight: { x: 0, y: 0 },
  })
})

describe('useBoardStore', () => {
  it('setBoardSize resets the knight to (0, 0)', () => {
    useBoardStore.getState().moveKnight(2, 1)
    expect(useBoardStore.getState().knight).toEqual({ x: 2, y: 1 })

    useBoardStore.getState().setBoardSize(10, 12)

    const state = useBoardStore.getState()
    expect(state.cols).toBe(10)
    expect(state.rows).toBe(12)
    expect(state.knight).toEqual({ x: 0, y: 0 })
  })

  it('moveKnight updates state on a legal move', () => {
    useBoardStore.getState().moveKnight(2, 1)
    expect(useBoardStore.getState().knight).toEqual({ x: 2, y: 1 })
  })

  it('moveKnight is a no-op on an illegal move', () => {
    useBoardStore.getState().moveKnight(1, 1)
    expect(useBoardStore.getState().knight).toEqual({ x: 0, y: 0 })
  })

  it('resetKnight returns the knight to (0, 0)', () => {
    useBoardStore.getState().moveKnight(2, 1)
    useBoardStore.getState().resetKnight()
    expect(useBoardStore.getState().knight).toEqual({ x: 0, y: 0 })
  })
})
