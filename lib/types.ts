export interface Goal {
  id: string
  name: string
  monthlyIncome: number
  monthlyExpenses: number
  currentSavings: number
  goalAmount: number
  goalDuration: number
  durationType: string
  date: Date
  completed: boolean
  progress: number // Add progress field (0-100)
}

export interface CalculationResult {
  monthlySavingPotential: number
  requiredMonthlySavings: number
  gap: number
  progressPercentage: number
  goalAmount: number
  currentSavings: number
}
