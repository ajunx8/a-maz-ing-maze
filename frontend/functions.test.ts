// sum.test.ts
import { expect, test } from 'vitest'
import { sum } from './sum'
import { mult } from './mult'

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})

test('multiplies 4 * 4 to equal 16', () => {
  expect(mult(4, 4)).toBe(16)
})