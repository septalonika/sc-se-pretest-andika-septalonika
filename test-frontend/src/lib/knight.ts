export interface Position {
  x: number
  y: number
}

/** [dx, dy] offsets for the 8 knight L-shapes. */
export const KNIGHT_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [2, 1],
  [2, -1],
  [-2, 1],
  [-2, -1],
  [1, 2],
  [1, -2],
  [-1, 2],
  [-1, -2],
]

function inBounds(pos: Position, cols: number, rows: number): boolean {
  return pos.x >= 0 && pos.x < cols && pos.y >= 0 && pos.y < rows
}

/** All in-bounds knight moves from `from`. */
export function getValidMoves(from: Position, cols: number, rows: number): Position[] {
  return KNIGHT_OFFSETS.map(([dx, dy]) => ({ x: from.x + dx, y: from.y + dy })).filter((pos) =>
    inBounds(pos, cols, rows),
  )
}

/** Is `to` a legal knight move from `from`, and in bounds? Constant time. */
export function isValidMove(from: Position, to: Position, cols: number, rows: number): boolean {
  if (!inBounds(to, cols, rows)) return false

  const dx = Math.abs(to.x - from.x)
  const dy = Math.abs(to.y - from.y)

  return (dx === 1 && dy === 2) || (dx === 2 && dy === 1)
}
