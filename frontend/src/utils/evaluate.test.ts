import { describe, it, expect } from 'vitest'
import { evaluate } from './evaluate'

describe('evaluate', () => {
  it('respects × over + precedence', () => {
    expect(evaluate('2+3×4')).toBe(14)
  })

  it('evaluates parentheses first', () => {
    expect(evaluate('(2+3)×4')).toBe(20)
  })

  it('handles nested parentheses', () => {
    expect(evaluate('((1+2)×(3+4))')).toBe(21)
  })

  it('raises to a power', () => {
    expect(evaluate('2^3')).toBe(8)
  })

  it('binds power tighter than multiplication', () => {
    expect(evaluate('2×3^2')).toBe(18)
  })

  it('treats power as right-associative', () => {
    expect(evaluate('2^3^2')).toBe(512)
  })

  it('combines power with parentheses', () => {
    expect(evaluate('(1+1)^(2+1)')).toBe(8)
  })

  it('throws on mismatched parentheses', () => {
    expect(() => evaluate('(2+3')).toThrow()
  })

  it('throws on empty parentheses', () => {
    expect(() => evaluate('()')).toThrow()
  })

  it('throws on an empty expression', () => {
    expect(() => evaluate('')).toThrow()
  })

  it('throws on trailing operator', () => {
    expect(() => evaluate('2+')).toThrow()
  })
})
