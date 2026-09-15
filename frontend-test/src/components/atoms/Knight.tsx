import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { CELL_SIZE } from '@/lib/constants'
import { getKnightPath, type Position } from '@/lib/knight'

interface KnightProps {
  position: Position
}

const STEP_DURATION_S = 0.15

export function Knight({ position }: KnightProps) {
  const prevRef = useRef(position)
  const [path, setPath] = useState<Position[]>([position])

  useEffect(() => {
    const prev = prevRef.current
    if (prev.x !== position.x || prev.y !== position.y) {
      setPath(getKnightPath(prev, position))
      prevRef.current = position
    }
  }, [position])

  return (
    <motion.div
      className="pointer-events-none absolute top-0 left-0 flex items-center justify-center"
      style={{ width: CELL_SIZE, height: CELL_SIZE }}
      animate={{
        x: path.map((p) => p.x * CELL_SIZE),
        y: path.map((p) => p.y * CELL_SIZE),
      }}
      transition={{ duration: STEP_DURATION_S * (path.length - 1), ease: 'easeInOut' }}
    >
      <span className="text-2xl font-extrabold text-red-600 select-none drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">
        K
      </span>
    </motion.div>
  )
}
