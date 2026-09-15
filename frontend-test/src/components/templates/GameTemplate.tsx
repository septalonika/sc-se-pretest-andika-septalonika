import type { ReactNode } from 'react'

interface GameTemplateProps {
  controls: ReactNode
  board: ReactNode
}

export function GameTemplate({ controls, board }: GameTemplateProps) {
  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center gap-8 px-4 py-10">
      <h1 className="text-2xl font-bold">Chess Lonely Knight</h1>
      <div className="w-full">{controls}</div>
      <div className="flex w-full justify-center">{board}</div>
    </div>
  )
}
