"use client"

import { useState, useEffect } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import FinancialGoalForm from "@/components/financial-goal-form"
import ResultsSection from "@/components/results-section"
import GoalHistory from "@/components/goal-history"
import UserProfile from "@/components/user-profile"
import type { Goal, CalculationResult } from "@/lib/types"

export default function Home() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null)
  const [userLevel, setUserLevel] = useState(1)
  const [completedGoals, setCompletedGoals] = useState(0)
  const [showFirstGoalBadge, setShowFirstGoalBadge] = useState(false)

  // Load goals from localStorage on initial render
  useEffect(() => {
    const savedGoals = localStorage.getItem("financialGoals")
    if (savedGoals) {
      const parsedGoals = JSON.parse(savedGoals)
      setGoals(parsedGoals)

      // Calculate user level and completed goals
      const completed = parsedGoals.filter((goal: Goal) => goal.completed).length
      setCompletedGoals(completed)
      setUserLevel(Math.floor(completed / 5) + 1)

      // Show first goal badge if there's at least one goal
      setShowFirstGoalBadge(parsedGoals.length > 0)
    }
  }, [])

  // Save goals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("financialGoals", JSON.stringify(goals))
  }, [goals])

  const handleCalculate = (result: CalculationResult) => {
    setCalculationResult(result)
  }

  const handleSaveGoal = (newGoal: Goal) => {
    const updatedGoals = [...goals, { ...newGoal, id: Date.now().toString(), date: new Date(), completed: false }]
    setGoals(updatedGoals)

    // Show first goal badge if this is the first goal
    if (updatedGoals.length === 1) {
      setShowFirstGoalBadge(true)
    }
  }

  const handleDeleteGoal = (id: string) => {
    const updatedGoals = goals.filter((goal) => goal.id !== id)
    setGoals(updatedGoals)
  }

  const handleCompleteGoal = (id: string) => {
    const updatedGoals = goals.map((goal) => (goal.id === id ? { ...goal, completed: true } : goal))

    const completed = updatedGoals.filter((goal) => goal.completed).length
    setCompletedGoals(completed)
    setUserLevel(Math.floor(completed / 5) + 1)
    setGoals(updatedGoals)
  }

  // Add the onUpdateProgress handler to the component
  const handleUpdateProgress = (id: string, progress: number, currentSavings: number) => {
    const updatedGoals = goals.map((goal) => (goal.id === id ? { ...goal, progress, currentSavings } : goal))
    setGoals(updatedGoals)
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <main className="min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">WealthWise - by Malay, and Ronit</h1>
            <ModeToggle />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <FinancialGoalForm onCalculate={handleCalculate} onSaveGoal={handleSaveGoal} />

              {calculationResult && (
                <ResultsSection result={calculationResult} userGoals={goals.length} userLevel={userLevel} />
              )}
            </div>

            <div className="space-y-8">
              <UserProfile level={userLevel} completedGoals={completedGoals} showFirstGoalBadge={showFirstGoalBadge} />

              <GoalHistory
                goals={goals}
                onDelete={handleDeleteGoal}
                onComplete={handleCompleteGoal}
                onUpdateProgress={handleUpdateProgress}
              />
            </div>
          </div>
        </div>
      </main>
    </ThemeProvider>
  )
}
