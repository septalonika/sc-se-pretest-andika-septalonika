import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'
import { Knight } from '@/components/atoms/Knight'
import { ChessSquare } from '@/components/molecules/ChessSquare'
import { toColumnLabel } from '@/lib/columnLabel'
import { CELL_SIZE, LABEL_SIZE } from '@/lib/constants'
import { useBoardStore } from '@/store/useBoardStore'

const overlayCell = { gridColumn: 1, gridRow: 1 } as const

export function ChessBoard() {
  const cols = useBoardStore((s) => s.cols)
  const rows = useBoardStore((s) => s.rows)
  const knight = useBoardStore((s) => s.knight)

  const scrollRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: rows,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => CELL_SIZE,
    overscan: 4,
  })

  const colVirtualizer = useVirtualizer({
    count: cols,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => CELL_SIZE,
    overscan: 4,
    horizontal: true,
  })

  const virtualRows = rowVirtualizer.getVirtualItems()
  const virtualCols = colVirtualizer.getVirtualItems()
  const boardWidth = colVirtualizer.getTotalSize()
  const boardHeight = rowVirtualizer.getTotalSize()
  const contentWidth = boardWidth + LABEL_SIZE * 2
  const contentHeight = boardHeight + LABEL_SIZE * 2

  const colHeader = (edge: 'top' | 'bottom') => (
    <div
      className="sticky z-10 bg-neutral-50 dark:bg-neutral-900"
      style={{
        ...overlayCell,
        [edge]: 0,
        alignSelf: edge === 'bottom' ? 'end' : 'start',
        height: LABEL_SIZE,
        width: contentWidth,
      }}
    >
      {virtualCols.map((virtualCol) => (
        <div
          key={virtualCol.index}
          className="absolute top-0 flex items-center justify-center text-xs font-medium text-neutral-500 dark:text-neutral-400"
          style={{ left: LABEL_SIZE + virtualCol.start, width: CELL_SIZE, height: LABEL_SIZE }}
        >
          {toColumnLabel(virtualCol.index)}
        </div>
      ))}
    </div>
  )

  const rowHeader = (edge: 'left' | 'right') => (
    <div
      className="sticky z-10 bg-neutral-50 dark:bg-neutral-900"
      style={{
        ...overlayCell,
        [edge]: 0,
        justifySelf: edge === 'right' ? 'end' : 'start',
        width: LABEL_SIZE,
        height: contentHeight,
      }}
    >
      {virtualRows.map((virtualRow) => (
        <div
          key={virtualRow.index}
          className="absolute left-0 flex items-center justify-center text-xs font-medium text-neutral-500 dark:text-neutral-400"
          style={{ top: LABEL_SIZE + virtualRow.start, width: LABEL_SIZE, height: CELL_SIZE }}
        >
          {virtualRow.index + 1}
        </div>
      ))}
    </div>
  )

  const corner = (vEdge: 'top' | 'bottom', hEdge: 'left' | 'right') => (
    <div
      key={`${vEdge}-${hEdge}`}
      className="sticky z-20 bg-neutral-50 dark:bg-neutral-900"
      style={{
        ...overlayCell,
        [vEdge]: 0,
        [hEdge]: 0,
        alignSelf: vEdge === 'bottom' ? 'end' : 'start',
        justifySelf: hEdge === 'right' ? 'end' : 'start',
        width: LABEL_SIZE,
        height: LABEL_SIZE,
      }}
    />
  )

  return (
    <div
      ref={scrollRef}
      className="max-h-[70vh] max-w-full overflow-auto rounded-md border border-neutral-300 dark:border-neutral-700"
    >
      {/*
        Every layer below shares the same grid cell (grid-area 1/1), so they
        overlap as independent boxes anchored to whichever edge they're pinned
        to — a margin or sticky offset on one layer never shifts the others,
        unlike stacking them in normal block flow.
      */}
      <div className="grid" style={{ width: contentWidth, height: contentHeight }}>
        {colHeader('top')}
        {colHeader('bottom')}
        {rowHeader('left')}
        {rowHeader('right')}
        {corner('top', 'left')}
        {corner('top', 'right')}
        {corner('bottom', 'left')}
        {corner('bottom', 'right')}

        {/* the board itself, inset past the top/left headers */}
        <div
          className="relative"
          style={{
            ...overlayCell,
            marginTop: LABEL_SIZE,
            marginLeft: LABEL_SIZE,
            width: boardWidth,
            height: boardHeight,
          }}
        >
          {virtualRows.map((virtualRow) =>
            virtualCols.map((virtualCol) => (
              <ChessSquare
                key={`${virtualCol.index}-${virtualRow.index}`}
                x={virtualCol.index}
                y={virtualRow.index}
              />
            )),
          )}

          <Knight position={knight} />
        </div>
      </div>
    </div>
  )
}
