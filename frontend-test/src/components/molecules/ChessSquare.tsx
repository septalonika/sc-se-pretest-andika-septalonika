import { Square } from '@/components/atoms/Square'
import { isValidMove } from '@/lib/knight'
import { useBoardStore } from '@/store/useBoardStore'

interface ChessSquareProps {
  x: number
  y: number
}

export function ChessSquare({ x, y }: ChessSquareProps) {
  const cols = useBoardStore((s) => s.cols)
  const rows = useBoardStore((s) => s.rows)
  const knightX = useBoardStore((s) => s.knight.x)
  const knightY = useBoardStore((s) => s.knight.y)
  const moveKnight = useBoardStore((s) => s.moveKnight)

  const isKnightSquare = knightX === x && knightY === y
  const isValid = !isKnightSquare && isValidMove({ x: knightX, y: knightY }, { x, y }, cols, rows)

  return (
    <Square
      x={x}
      y={y}
      isValidMove={isValid}
      isKnightSquare={isKnightSquare}
      onSelect={() => moveKnight(x, y)}
    />
  )
}
