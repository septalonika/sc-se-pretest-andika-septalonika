import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Label } from '@/components/ui/label'
import { MAX_BOARD_SIZE, MIN_BOARD_SIZE } from '@/lib/constants'

interface BoardControlFormProps {
  initialCols: number
  initialRows: number
  onGenerate: (cols: number, rows: number) => void
}

function isInRange(value: string): boolean {
  if (!/^-?\d+$/.test(value)) return false
  const n = Number(value)
  return n >= MIN_BOARD_SIZE && n <= MAX_BOARD_SIZE
}

function clamp(value: string, fallback: number): number {
  const n = Number.parseInt(value, 10)
  if (Number.isNaN(n)) return fallback
  return Math.min(MAX_BOARD_SIZE, Math.max(MIN_BOARD_SIZE, n))
}

export function BoardControlForm({ initialCols, initialRows, onGenerate }: BoardControlFormProps) {
  const [colsDraft, setColsDraft] = useState(String(initialCols))
  const [rowsDraft, setRowsDraft] = useState(String(initialRows))

  const colsValid = isInRange(colsDraft)
  const rowsValid = isInRange(rowsDraft)
  const canGenerate = colsValid && rowsValid

  const handleGenerate = () => {
    if (!canGenerate) return
    onGenerate(Number.parseInt(colsDraft, 10), Number.parseInt(rowsDraft, 10))
  }

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="rows-input">Rows</Label>
        <Input
          id="rows-input"
          value={rowsDraft}
          onChange={setRowsDraft}
          onBlur={() => setRowsDraft(String(clamp(rowsDraft, initialRows)))}
          min={MIN_BOARD_SIZE}
          max={MAX_BOARD_SIZE}
          invalid={!rowsValid}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cols-input">Columns</Label>
        <Input
          id="cols-input"
          value={colsDraft}
          onChange={setColsDraft}
          onBlur={() => setColsDraft(String(clamp(colsDraft, initialCols)))}
          min={MIN_BOARD_SIZE}
          max={MAX_BOARD_SIZE}
          invalid={!colsValid}
        />
      </div>

      <Button onClick={handleGenerate} disabled={!canGenerate}>
        Generate Board
      </Button>

      {(!colsValid || !rowsValid) && (
        <p className="w-full text-sm text-red-600" role="alert">
          Rows and columns must be whole numbers between {MIN_BOARD_SIZE} and {MAX_BOARD_SIZE}.
        </p>
      )}
    </div>
  )
}
