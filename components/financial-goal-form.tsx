"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { CalculationResult, Goal } from "@/lib/types"

interface FinancialGoalFormProps {
  onCalculate: (result: CalculationResult) => void
  onSaveGoal: (goal: Goal) => void
}

export default function FinancialGoalForm({ onCalculate, onSaveGoal }: FinancialGoalFormProps) {
  const [goalName, setGoalName] = useState("")
  const [monthlyIncome, setMonthlyIncome] = useState("")
  const [monthlyExpenses, setMonthlyExpenses] = useState("")
  const [currentSavings, setCurrentSavings] = useState("")
  const [goalAmount, setGoalAmount] = useState("")
  const [goalDuration, setGoalDuration] = useState("")
  const [durationType, setDurationType] = useState("months")

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()

    // Convert inputs to numbers
    const income = Number.parseFloat(monthlyIncome)
    const expenses = Number.parseFloat(monthlyExpenses)
    const savings = Number.parseFloat(currentSavings)
    const goal = Number.parseFloat(goalAmount)
    const duration = Number.parseFloat(goalDuration)

    // Calculate monthly saving potential
    const monthlySavingPotential = income - expenses

    // Calculate required monthly savings
    const durationInMonths = durationType === "years" ? duration * 12 : duration
    const requiredMonthlySavings = (goal - savings) / durationInMonths

    // Calculate gap or surplus
    const gap = monthlySavingPotential - requiredMonthlySavings

    // Calculate progress percentage
    const progressPercentage = Math.min(100, Math.max(0, (savings / goal) * 100))

    const result: CalculationResult = {
      monthlySavingPotential,
      requiredMonthlySavings,
      gap,
      progressPercentage,
      goalAmount: goal,
      currentSavings: savings,
    }

    onCalculate(result)
  }

  const handleSaveGoal = () => {
    const newGoal: Goal = {
      id: "", // Will be set in the parent component
      name: goalName,
      monthlyIncome: Number.parseFloat(monthlyIncome),
      monthlyExpenses: Number.parseFloat(monthlyExpenses),
      currentSavings: Number.parseFloat(currentSavings),
      goalAmount: Number.parseFloat(goalAmount),
      goalDuration: Number.parseFloat(goalDuration),
      durationType,
      date: new Date(),
      completed: false,
      progress: (Number.parseFloat(currentSavings) / Number.parseFloat(goalAmount)) * 100, // Initialize progress based on current savings
    }

    onSaveGoal(newGoal)

    // Reset form
    setGoalName("")
    setMonthlyIncome("")
    setMonthlyExpenses("")
    setCurrentSavings("")
    setGoalAmount("")
    setGoalDuration("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Your Financial Goal</CardTitle>
        <CardDescription>Enter your financial details to calculate your savings plan</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCalculate} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="goalName">Goal Name</Label>
            <Input
              id="goalName"
              placeholder="e.g., New Car, Vacation, Emergency Fund"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthlyIncome">Monthly Income (₹)</Label>
              <Input
                id="monthlyIncome"
                type="number"
                placeholder="5000"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                min="0"
                step="100"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyExpenses">Monthly Expenses (₹)</Label>
              <Input
                id="monthlyExpenses"
                type="number"
                placeholder="3000"
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(e.target.value)}
                min="0"
                step="100"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentSavings">Current Savings (₹)</Label>
              <Input
                id="currentSavings"
                type="number"
                placeholder="1000"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(e.target.value)}
                min="0"
                step="100"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goalAmount">Goal Amount (₹)</Label>
              <Input
                id="goalAmount"
                type="number"
                placeholder="10000"
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value)}
                min="0"
                step="100"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Goal Duration</Label>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="12"
                value={goalDuration}
                onChange={(e) => setGoalDuration(e.target.value)}
                min="1"
                step="1"
                required
                className="flex-1"
              />
              <Tabs defaultValue="months" value={durationType} onValueChange={setDurationType} className="w-[200px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="months">Months</TabsTrigger>
                  <TabsTrigger value="years">Years</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button type="submit" className="flex-1">
              Calculate
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveGoal}
              disabled={
                !goalName || !monthlyIncome || !monthlyExpenses || !currentSavings || !goalAmount || !goalDuration
              }
            >
              Save Goal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
