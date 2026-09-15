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

/**
 * Decomposes one knight move into unit orthogonal hops for animation.
 * The two deltas of a legal knight move are always {1, 2} — never equal — so
 * "traverse the 2-magnitude axis first, then the 1-magnitude axis" is a
 * tie-break-free rule: exactly one axis always qualifies as "the long leg".
 * Falls back to a direct two-point path for any non-knight displacement
 * (e.g. a board-reset snap), where there is no L-shape to decompose.
 */
export function getKnightPath(from: Position, to: Position): Position[] {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const absDx = Math.abs(dx)
  const absDy = Math.abs(dy)

  const isKnightShape = (absDx === 1 && absDy === 2) || (absDx === 2 && absDy === 1)
  if (!isKnightShape) return [from, to]

  const stepX = Math.sign(dx)
  const stepY = Math.sign(dy)

  if (absDx === 2) {
    return [from, { x: from.x + stepX, y: from.y }, { x: to.x, y: from.y }, to]
  }
  return [from, { x: from.x, y: from.y + stepY }, { x: from.x, y: to.y }, to]
}
