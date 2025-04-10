"use client"

import type React from "react"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function FinancialPlanner() {
  const [isLoading, setIsLoading] = useState(false)
  const [advice, setAdvice] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call for financial advice
    setTimeout(() => {
      setAdvice(
        "Based on your financial goals and current situation, we recommend saving 20% of your monthly income and investing in a diversified portfolio. This approach should help you reach your target amount by your desired age.",
      )
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Financial Goal Planner</CardTitle>
          <CardDescription>Enter your details below to get a personalized financial plan</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="goal">Financial Goal</Label>
                <Input id="goal" placeholder="e.g., Retirement, Home Purchase, Education" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentAge">Current Age</Label>
                <Input id="currentAge" type="number" placeholder="Your current age" min="18" max="100" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">Monthly Income ($)</Label>
                <Input id="monthlyIncome" type="number" placeholder="Your monthly income" min="0" step="100" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetAmount">Target Amount ($)</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  placeholder="Amount you want to save"
                  min="0"
                  step="1000"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetAge">Target Age</Label>
                <Input id="targetAge" type="number" placeholder="Age to reach your goal" min="18" max="100" required />
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg">
              Get Plan
            </Button>
          </form>
        </CardContent>
      </Card>

      {(isLoading || advice) && (
        <Card className="mt-8 shadow-md">
          <CardHeader>
            <CardTitle>Your Financial Plan</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Generating your personalized financial plan...</p>
              </div>
            ) : (
              <div className="prose">
                <p>{advice}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
