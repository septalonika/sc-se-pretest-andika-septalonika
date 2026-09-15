import { create } from 'zustand'
import { DEFAULT_COLS, DEFAULT_ROWS } from '@/lib/constants'
import { isValidMove, type Position } from '@/lib/knight'

interface BoardState {
  cols: number
  rows: number
  knight: Position
  setBoardSize: (cols: number, rows: number) => void
  moveKnight: (x: number, y: number) => void
  resetKnight: () => void
}

export const useBoardStore = create<BoardState>((set, get) => ({
  cols: DEFAULT_COLS,
  rows: DEFAULT_ROWS,
  knight: { x: 0, y: 0 },

  setBoardSize: (cols, rows) => set({ cols, rows, knight: { x: 0, y: 0 } }),

  moveKnight: (x, y) => {
    const { knight, cols, rows } = get()
    const to = { x, y }
    if (!isValidMove(knight, to, cols, rows)) return
    set({ knight: to })
  },

  resetKnight: () => set({ knight: { x: 0, y: 0 } }),
}))
