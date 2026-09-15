import { motion } from 'motion/react'
import { CELL_SIZE } from '@/lib/constants'
import type { Position } from '@/lib/knight'

interface KnightProps {
  position: Position
}

export function Knight({ position }: KnightProps) {
  return (
    <motion.div
      className="pointer-events-none absolute top-0 left-0 flex items-center justify-center"
      style={{ width: CELL_SIZE, height: CELL_SIZE }}
      animate={{ x: position.x * CELL_SIZE, y: position.y * CELL_SIZE }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <span className="text-2xl font-extrabold text-red-600 select-none">K</span>
    </motion.div>
  )
}
