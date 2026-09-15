import { describe, expect, it } from 'vitest'
import { toColumnLabel } from './columnLabel'

describe('toColumnLabel', () => {
  it.each([
    [0, 'A'],
    [1, 'B'],
    [25, 'Z'],
    [26, 'AA'],
    [27, 'AB'],
    [51, 'AZ'],
    [52, 'BA'],
  ])('maps index %i to %s', (index, expected) => {
    expect(toColumnLabel(index)).toBe(expected)
  })

  it('produces distinct labels for every column up to the 100-column max', () => {
    const labels = Array.from({ length: 100 }, (_, i) => toColumnLabel(i))
    expect(new Set(labels).size).toBe(100)
  })
})
