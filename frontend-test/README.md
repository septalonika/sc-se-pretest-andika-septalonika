[← Back to main README](../README.md)

# Chess Lonely Knight

A single-page app: a chessboard of user-defined size (1–100 × 1–100) holding one knight. Hover a square to see if it's a legal knight move (green) or not (red), click a legal square to move there.

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

**Knight as an overlay, not a cell child.** Because virtualized cells can unmount, a knight rendered inside its square would have no mounted animation target when moving off-screen — it would snap instead of animate. Instead the knight is a single absolutely-positioned `motion.div`, a sibling of the cell layer, animated with `motion/react` keyframes as it hops across the board (see below). It's `pointer-events-none` so clicks pass through to the square underneath.

Hover state lives locally in `Square`, never in the Zustand store, so hovering never re-renders the whole grid.

## Knight movement logic (`src/lib/knight.ts`)

All pure functions, no React — trivially unit-tested in `knight.test.ts`.

- **`isValidMove(from, to, cols, rows)`** — is `to` one of the 8 knight L-shapes from `from`, and in bounds? Constant-time: compares `{|dx|, |dy|}` against `{1, 2}`, no per-render allocation of a legal-moves set.
- **`getValidMoves(from, cols, rows)`** — all 8 offsets, filtered to in-bounds. Used for tests/debugging, not per-square rendering.
- **`getKnightPath(from, to)`** — decomposes one knight move into unit orthogonal hops, so the piece visibly steps square-by-square along one leg of the L, then the other, instead of sliding diagonally across the board.

  A knight's move always has deltas `{1, 2}` on the two axes — never equal — so exactly one axis is always "the long leg" (magnitude 2) and one is "the short leg" (magnitude 1). The rule: **traverse the long leg first, then the short leg.** E.g. from A1 `(0,0)` to C2 `(2,1)`: `x` is the long leg (Δ2), so the path is A1 → B1 → C1 → C2, not A1 → A2 → B2 → C2.

  This rule is deterministic with no tie-break needed — the {1, 2} asymmetry guarantees a unique "long leg" every time — and it matches how an L-shaped move visually reads: a two-square leap, then a one-square correction to the side.

  For any non-knight displacement (e.g. snapping the piece back to `(0, 0)` when the board is regenerated), there's no L-shape to decompose, so it falls back to a direct two-point path.

  `Knight.tsx` calls this on every position change and animates through the returned waypoints with `motion`'s keyframe arrays (`animate={{ x: [...], y: [...] }}`), so each hop is a fixed-duration step rather than one continuous glide.

## Tests

- `src/lib/knight.test.ts` — pure move-validation and path-decomposition logic
- `src/store/useBoardStore.test.ts` — board resize, move, reset
- `src/components/organisms/ChessBoard.test.tsx`, `src/components/molecules/BoardControlForm.test.tsx` — interaction tests

jsdom has no layout engine, so `@tanstack/react-virtual` needs a `ResizeObserver` and non-zero element dimensions to compute visible rows/cols — both are stubbed in `src/test/setup.ts`.

## Deployment

Vercel · root directory `sc-se-pretest-andika-septalonika/test-frontend` · framework preset Vite · build `npm run build` · output `dist`. No client-side routing, so no rewrite rules are needed. Gate any deploy on `npm run build` and `npx tsc -b --noEmit` both passing.
