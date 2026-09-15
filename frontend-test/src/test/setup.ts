import '@testing-library/jest-dom/vitest'

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// jsdom has no layout engine, and TanStack Virtual needs ResizeObserver
// plus real element dimensions to compute which rows/cols are "visible".
globalThis.ResizeObserver ??= ResizeObserverMock as unknown as typeof ResizeObserver

Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
  configurable: true,
  value: 400,
})
Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
  configurable: true,
  value: 400,
})
