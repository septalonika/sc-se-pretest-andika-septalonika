import { describe, expect, it } from 'vitest'
import { getKnightPath, getValidMoves, isValidMove, KNIGHT_OFFSETS } from './knight'

describe('getValidMoves', () => {
  it('accepts all 8 offsets from a center square', () => {
    const moves = getValidMoves({ x: 5, y: 5 }, 11, 11)
    expect(moves).toHaveLength(8)
    expect(moves).toEqual(
      expect.arrayContaining(KNIGHT_OFFSETS.map(([dx, dy]) => ({ x: 5 + dx, y: 5 + dy }))),
    )
  })

  it('returns exactly 2 legal moves from the corner of an 8x8 board', () => {
    const moves = getValidMoves({ x: 0, y: 0 }, 8, 8)
    expect(moves).toHaveLength(2)
    expect(moves).toEqual(
      expect.arrayContaining([
        { x: 2, y: 1 },
        { x: 1, y: 2 },
      ]),
    )
  })

  it('returns 0 legal moves on a 1x1 board', () => {
    expect(getValidMoves({ x: 0, y: 0 }, 1, 1)).toHaveLength(0)
  })

  it('returns 8 legal moves from the center of a 100x100 board', () => {
    expect(getValidMoves({ x: 50, y: 50 }, 100, 100)).toHaveLength(8)
  })
})

describe('isValidMove', () => {
  const cols = 8
  const rows = 8

  it.each(KNIGHT_OFFSETS)('accepts offset [%i, %i] from a center square', (dx, dy) => {
    const from = { x: 4, y: 4 }
    const to = { x: 4 + dx, y: 4 + dy }
    expect(isValidMove(from, to, cols, rows)).toBe(true)
  })

  it('rejects out-of-bounds targets on every edge', () => {
    expect(isValidMove({ x: 0, y: 0 }, { x: -2, y: 1 }, cols, rows)).toBe(false)
    expect(isValidMove({ x: 0, y: 0 }, { x: 1, y: -2 }, cols, rows)).toBe(false)
    expect(isValidMove({ x: 7, y: 7 }, { x: 9, y: 8 }, cols, rows)).toBe(false)
    expect(isValidMove({ x: 7, y: 7 }, { x: 8, y: 9 }, cols, rows)).toBe(false)
  })

  it('rejects moving to the same square', () => {
    expect(isValidMove({ x: 4, y: 4 }, { x: 4, y: 4 }, cols, rows)).toBe(false)
  })

  it('rejects straight moves', () => {
    expect(isValidMove({ x: 4, y: 4 }, { x: 4, y: 5 }, cols, rows)).toBe(false)
    expect(isValidMove({ x: 4, y: 4 }, { x: 6, y: 4 }, cols, rows)).toBe(false)
  })

  it('rejects diagonal moves', () => {
    expect(isValidMove({ x: 4, y: 4 }, { x: 5, y: 5 }, cols, rows)).toBe(false)
    expect(isValidMove({ x: 4, y: 4 }, { x: 6, y: 6 }, cols, rows)).toBe(false)
  })
})

describe('getKnightPath', () => {
  it('traverses the long (2-magnitude) axis first, e.g. A1 -> C2', () => {
    expect(getKnightPath({ x: 0, y: 0 }, { x: 2, y: 1 })).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 1 },
    ])
  })

  it('traverses the long axis first when it is the y axis, e.g. A1 -> B3', () => {
    expect(getKnightPath({ x: 0, y: 0 }, { x: 1, y: 2 })).toEqual([
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
    ])
  })

  it('handles negative directions', () => {
    expect(getKnightPath({ x: 4, y: 4 }, { x: 2, y: 3 })).toEqual([
      { x: 4, y: 4 },
      { x: 3, y: 4 },
      { x: 2, y: 4 },
      { x: 2, y: 3 },
    ])
  })

  it.each(KNIGHT_OFFSETS)('every waypoint for offset [%i, %i] stays a unit step from the last', (dx, dy) => {
    const from = { x: 5, y: 5 }
    const to = { x: 5 + dx, y: 5 + dy }
    const path = getKnightPath(from, to)

    expect(path[0]).toEqual(from)
    expect(path.at(-1)).toEqual(to)
    for (let i = 1; i < path.length; i++) {
      const stepDx = Math.abs(path[i].x - path[i - 1].x)
      const stepDy = Math.abs(path[i].y - path[i - 1].y)
      expect(stepDx + stepDy).toBe(1)
    }
  })

  it('falls back to a direct two-point path for a non-knight displacement', () => {
    expect(getKnightPath({ x: 5, y: 5 }, { x: 0, y: 0 })).toEqual([
      { x: 5, y: 5 },
      { x: 0, y: 0 },
    ])
  })
})
