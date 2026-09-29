import type { CalorieInput } from './nutrition'
import { describe, expect, it } from 'vitest'
import { bmr, calculate, suggestActivity, validate } from './nutrition'

const base: CalorieInput = { sex: 'male', age: 30, heightCm: 180, weightKg: 80, activity: 'moderate', goal: 'maintain' }

describe('bmr', () => {
  it('uses Mifflin-St Jeor for men', () => {
    expect(bmr(base)).toEqual({ value: 1780, formula: 'Mifflin-St Jeor' })
  })
  it('uses −161 offset for women', () => {
    expect(bmr({ ...base, sex: 'female' }).value).toBe(1780 - 166)
  })
  it('switches to Katch-McArdle when body fat is given', () => {
    const r = bmr({ ...base, bodyFatPct: 20 })
    expect(r.formula).toBe('Katch-McArdle')
    expect(r.value).toBeCloseTo(370 + 21.6 * 64)
  })
})

describe('calculate', () => {
  it('multiplies BMR by activity factor', () => {
    const r = calculate(base)
    expect(r.tdee).toBe(2759)
    expect(r.target).toBe(2759)
    expect(r.range).toEqual([2483, 3035])
  })
  it('applies goal adjustments', () => {
    expect(calculate({ ...base, goal: 'cut' }).target).toBe(2207)
    expect(calculate({ ...base, goal: 'bulk' }).target).toBe(3035)
  })
  it('floors unsafe targets per sex', () => {
    const small = { heightCm: 150, weightKg: 40, age: 60, activity: 'sedentary', goal: 'cut' } as const
    const f = calculate({ ...base, ...small, sex: 'female' })
    expect(f).toMatchObject({ target: 1200, floored: true })
    const m = calculate({ ...base, ...small, sex: 'male' })
    expect(m).toMatchObject({ target: 1500, floored: true })
    expect(calculate(base).floored).toBe(false)
  })
  it('macros add up to the target', () => {
    for (const goal of ['cut', 'maintain', 'bulk'] as const) {
      const { target, macros } = calculate({ ...base, goal })
      const sum = macros.protein.kcal + macros.carbs.kcal + macros.fat.kcal
      expect(Math.abs(sum - target)).toBeLessThanOrEqual(3)
      expect(macros.protein.grams).toBe(goal === 'cut' ? 160 : 144)
    }
  })
  it('never returns negative carbs', () => {
    const r = calculate({ ...base, sex: 'female', age: 60, heightCm: 150, weightKg: 120, bodyFatPct: 50, activity: 'sedentary', goal: 'cut' })
    expect(r.macros.carbs.grams).toBeGreaterThanOrEqual(0)
  })
})

describe('validate', () => {
  it('accepts valid input, body fat optional', () => {
    expect(validate({ age: 30, heightCm: 180, weightKg: 80 })).toEqual({ errors: {}, valid: true, isMinor: false })
  })
  it('flags missing and out-of-range values', () => {
    const r = validate({ age: 12, heightCm: null, weightKg: 300, bodyFatPct: 70 })
    expect(r.valid).toBe(false)
    expect(Object.keys(r.errors).sort()).toEqual(['age', 'bodyFatPct', 'heightCm', 'weightKg'])
  })
  it('marks minors', () => {
    expect(validate({ age: 16, heightCm: 170, weightKg: 60 }).isMinor).toBe(true)
  })
})

describe('suggestActivity', () => {
  it.each([[0, 'sedentary'], [1, 'light'], [2.9, 'light'], [3, 'moderate'], [5, 'active'], [7, 'athlete']] as const)(
    '%s workouts/week → %s',
    (n, expected) => expect(suggestActivity(n)).toBe(expected),
  )
})
