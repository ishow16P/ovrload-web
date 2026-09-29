// Daily calorie + macro estimates. Pure functions — no Vue.

export type Sex = 'male' | 'female'
export type Goal = 'cut' | 'maintain' | 'bulk'
export type ActivityId = 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete'

export const ACTIVITY_LEVELS: { id: ActivityId, label: string, hint: string, factor: number }[] = [
  { id: 'sedentary', label: 'Sedentary', hint: 'Desk job, little or no training', factor: 1.2 },
  { id: 'light', label: 'Light', hint: 'Train 1–3 days / week', factor: 1.375 },
  { id: 'moderate', label: 'Moderate', hint: 'Train 3–5 days / week', factor: 1.55 },
  { id: 'active', label: 'Active', hint: 'Train 6–7 days / week', factor: 1.725 },
  { id: 'athlete', label: 'Athlete', hint: 'Physical job or 2-a-day sessions', factor: 1.9 },
]

export const GOALS: { id: Goal, label: string, factor: number }[] = [
  { id: 'cut', label: 'Cut', factor: 0.8 },
  { id: 'maintain', label: 'Maintain', factor: 1 },
  { id: 'bulk', label: 'Bulk', factor: 1.1 },
]

// Below these, a flat estimate is unsafe to recommend without supervision.
const MIN_KCAL: Record<Sex, number> = { female: 1200, male: 1500 }

export interface CalorieInput {
  sex: Sex
  age: number
  heightCm: number
  weightKg: number
  bodyFatPct?: number | null
  activity: ActivityId
  goal: Goal
}

export interface Macro { grams: number, kcal: number, pct: number }

export interface CalorieResult {
  bmr: number
  formula: 'Mifflin-St Jeor' | 'Katch-McArdle'
  activityFactor: number
  tdee: number
  target: number
  range: [number, number]
  floored: boolean
  macros: { protein: Macro, carbs: Macro, fat: Macro }
}

const hasBodyFat = (pct?: number | null): pct is number => typeof pct === 'number' && Number.isFinite(pct) && pct > 0

export function bmr({ sex, age, heightCm, weightKg, bodyFatPct }: Pick<CalorieInput, 'sex' | 'age' | 'heightCm' | 'weightKg' | 'bodyFatPct'>) {
  if (hasBodyFat(bodyFatPct)) {
    const leanMass = weightKg * (1 - bodyFatPct / 100)
    return { value: 370 + 21.6 * leanMass, formula: 'Katch-McArdle' as const }
  }
  const value = 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === 'male' ? 5 : -161)
  return { value, formula: 'Mifflin-St Jeor' as const }
}

function macro(grams: number, kcalPerGram: number, total: number): Macro {
  const kcal = grams * kcalPerGram
  return { grams: Math.round(grams), kcal: Math.round(kcal), pct: total ? Math.round((kcal / total) * 100) : 0 }
}

export function calculate(input: CalorieInput): CalorieResult {
  const { value, formula } = bmr(input)
  const activityFactor = ACTIVITY_LEVELS.find(a => a.id === input.activity)!.factor
  const tdee = value * activityFactor
  const raw = tdee * GOALS.find(g => g.id === input.goal)!.factor
  const floored = raw < MIN_KCAL[input.sex]
  const target = Math.round(floored ? MIN_KCAL[input.sex] : raw)

  const proteinG = input.weightKg * (input.goal === 'cut' ? 2.0 : 1.8)
  const fatG = Math.max((target * 0.25) / 9, input.weightKg * 0.6)
  const carbsG = Math.max(0, (target - proteinG * 4 - fatG * 9) / 4)

  return {
    bmr: Math.round(value),
    formula,
    activityFactor,
    tdee: Math.round(tdee),
    target,
    range: [Math.round(target * 0.9), Math.round(target * 1.1)],
    floored,
    macros: {
      protein: macro(proteinG, 4, target),
      carbs: macro(carbsG, 4, target),
      fat: macro(fatG, 9, target),
    },
  }
}

type Field = 'age' | 'heightCm' | 'weightKg' | 'bodyFatPct'
const LIMITS: Record<Field, [number, number, string]> = {
  age: [13, 80, 'Age must be 13–80'],
  heightCm: [120, 230, 'Height must be 120–230 cm'],
  weightKg: [30, 250, 'Weight must be 30–250 kg'],
  bodyFatPct: [3, 60, 'Body fat must be 3–60%'],
}

export function validate(input: Partial<Record<Field, number | null>>) {
  const errors: Partial<Record<Field, string>> = {}
  for (const field of Object.keys(LIMITS) as Field[]) {
    const v = input[field]
    const optional = field === 'bodyFatPct'
    if (v == null || !Number.isFinite(v)) {
      if (!optional) errors[field] = 'Required'
      continue
    }
    const [min, max, msg] = LIMITS[field]
    if (v < min || v > max) errors[field] = msg
  }
  const age = input.age
  return { errors, valid: Object.keys(errors).length === 0, isMinor: typeof age === 'number' && age < 18 }
}

export function suggestActivity(workoutsPerWeek: number): ActivityId {
  if (workoutsPerWeek <= 0) return 'sedentary'
  if (workoutsPerWeek < 3) return 'light'
  if (workoutsPerWeek < 5) return 'moderate'
  if (workoutsPerWeek < 7) return 'active'
  return 'athlete'
}
