"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { CalculationResult } from "@/lib/types"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "@/components/ui/chart"
import { useEffect, useState } from "react"
import { getAIFinancialAdvice } from "@/lib/ai-service"
import { Loader2 } from "lucide-react"

interface ResultsSectionProps {
  result: CalculationResult
  userGoals?: number
  userLevel?: number
}

export default function ResultsSection({ result, userGoals = 0, userLevel = 1 }: ResultsSectionProps) {
  const [aiAdvice, setAiAdvice] = useState<string | null>(null)
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false)

  const { monthlySavingPotential, requiredMonthlySavings, gap, progressPercentage, goalAmount, currentSavings } = result

  const isPositiveGap = gap >= 0

  const chartData = [
    {
      name: "Current Savings",
      value: currentSavings,
    },
    {
      name: "Remaining",
      value: Math.max(0, goalAmount - currentSavings),
    },
  ]

  // Fetch AI advice when the result changes
  useEffect(() => {
    const fetchAdvice = async () => {
      setIsLoadingAdvice(true)
      try {
        const advice = await getAIFinancialAdvice(result, userGoals, userLevel)
        setAiAdvice(advice)
      } catch (error) {
        console.error("Failed to get AI advice:", error)
      } finally {
        setIsLoadingAdvice(false)
      }
    }

    fetchAdvice()
  }, [result, userGoals, userLevel])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Financial Plan</CardTitle>
        <CardDescription>Based on your inputs, here's your savings plan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Monthly Saving Potential</h3>
            <p className="text-2xl font-bold">₹{monthlySavingPotential.toFixed(2)}</p>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Required Monthly Savings</h3>
            <p className="text-2xl font-bold">₹{requiredMonthlySavings.toFixed(2)}</p>
          </div>

          <div
            className={`p-4 rounded-lg ${isPositiveGap ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"}`}
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              {isPositiveGap ? "Monthly Surplus" : "Monthly Deficit"}
            </h3>
            <p
              className={`text-2xl font-bold ${isPositiveGap ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
            >
              ₹{Math.abs(gap).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <h3 className="text-sm font-medium">Progress to Goal</h3>
            <p className="text-sm">{progressPercentage.toFixed(1)}%</p>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, "Amount"]} />
              <Bar dataKey="value" fill="var(--primary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-medium mb-2">AI Recommendation</h3>
          {isLoadingAdvice ? (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p>Generating personalized financial advice for you...</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {aiAdvice ||
                (isPositiveGap
                  ? `You're on track to meet your goal! You have a surplus of ₹${Math.abs(gap).toFixed(2)} per month. Consider investing this extra amount in Indian mutual funds or a fixed deposit to reach your goal faster.`
                  : `You need to either increase your income, reduce expenses by ₹${Math.abs(gap).toFixed(2)} per month, or extend your goal timeline to meet your target. Consider reviewing your SIP investments if you have any.`)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
