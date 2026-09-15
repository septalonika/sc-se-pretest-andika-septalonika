import { ChessBoard } from '@/components/organisms/ChessBoard'
import { ControlPanel } from '@/components/organisms/ControlPanel'
import { GameTemplate } from '@/components/templates/GameTemplate'

export function GamePage() {
  return <GameTemplate controls={<ControlPanel />} board={<ChessBoard />} />
}
