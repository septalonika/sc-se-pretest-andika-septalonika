# Chess Lonely Knight

A single-page app: a chessboard of user-defined size (1–100 × 1–100) holding one knight. Hover a square to see if it's a legal knight move (green) or not (red), click a legal square to move there.

See [`../../PLAN-test-fe.MD`](../../PLAN-test-fe.MD) for the full design doc.

## Stack

React 19 + Vite + TypeScript · Zustand · Tailwind CSS v4 · shadcn/ui · Motion (`motion/react`) · `@tanstack/react-virtual` · Vitest + React Testing Library

## Commands

```bash
npm run dev          # start dev server
npm run build         # tsc -b && vite build
npm run preview       # preview the production build
npm run lint           # oxlint
npx vitest             # watch mode
npx vitest run          # run once (used by the deploy gate)
npx tsc -b --noEmit       # typecheck only
```

Run a single test file: `npx vitest run src/lib/knight.test.ts`

## Coordinate convention

`(0, 0)` is the top-left square. `x` is the column (increases rightward), `y` is the row (increases downward). Grid iteration is row-major: outer loop `y`, inner loop `x`.

## Two load-bearing design decisions

**Virtualized grid.** A 100×100 board is 10,000 cells — too many DOM nodes to render unconditionally. `ChessBoard` composes two `@tanstack/react-virtual` instances (one per axis) over a single scroll container, so only the visible cells (plus overscan) are mounted at any time.

**Knight as an overlay, not a cell child.** Because virtualized cells can unmount, a knight rendered inside its square would have no mounted animation target when moving off-screen — it would snap instead of animate. Instead the knight is a single absolutely-positioned `motion.div`, a sibling of the cell layer, driven by `animate={{ x: knight.x * CELL_SIZE, y: knight.y * CELL_SIZE }}`. It's `pointer-events-none` so clicks pass through to the square underneath.

Move validation (`src/lib/knight.ts`) is a constant-time check per square — no per-render allocation of a legal-moves set. Hover state lives locally in `Square`, never in the Zustand store, so hovering never re-renders the whole grid.

## Tests

- `src/lib/knight.test.ts` — pure move-validation logic
- `src/store/useBoardStore.test.ts` — board resize, move, reset
- `src/components/organisms/ChessBoard.test.tsx`, `src/components/molecules/BoardControlForm.test.tsx` — interaction tests

jsdom has no layout engine, so `@tanstack/react-virtual` needs a `ResizeObserver` and non-zero element dimensions to compute visible rows/cols — both are stubbed in `src/test/setup.ts`.

## Deployment

Vercel · root directory `sc-se-pretest-andika-septalonika/test-frontend` · framework preset Vite · build `npm run build` · output `dist`. No client-side routing, so no rewrite rules are needed. Gate any deploy on `npm run build` and `npx tsc -b --noEmit` both passing.
