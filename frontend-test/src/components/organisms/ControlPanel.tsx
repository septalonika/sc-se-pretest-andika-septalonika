import { BoardControlForm } from '@/components/molecules/BoardControlForm'
import { useBoardStore } from '@/store/useBoardStore'

export function ControlPanel() {
  const cols = useBoardStore((s) => s.cols)
  const rows = useBoardStore((s) => s.rows)
  const setBoardSize = useBoardStore((s) => s.setBoardSize)

  return (
    <BoardControlForm
      initialCols={cols}
      initialRows={rows}
      onGenerate={(newCols, newRows) => setBoardSize(newCols, newRows)}
    />
  )
}
