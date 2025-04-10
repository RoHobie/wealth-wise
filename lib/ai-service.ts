// Update the error handling to provide more detailed information

// This file handles the integration with an AI API service

import type { CalculationResult } from "./types"

// Function to get AI-powered financial advice
export async function getAIFinancialAdvice(
  calculationResult: CalculationResult,
  userGoals: number,
  userLevel: number,
): Promise<string> {
  try {
    const response = await fetch("/api/financial-advice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        monthlySavingPotential: calculationResult.monthlySavingPotential,
        requiredMonthlySavings: calculationResult.requiredMonthlySavings,
        gap: calculationResult.gap,
        progressPercentage: calculationResult.progressPercentage,
        goalAmount: calculationResult.goalAmount,
        currentSavings: calculationResult.currentSavings,
        userGoals,
        userLevel,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Failed to get AI advice: ${response.status} ${errorData.error || response.statusText}`)
    }

    const data = await response.json()
    return data.advice
  } catch (error) {
    console.error("Error getting AI advice:", error)

    // Fallback advice if the API call fails
    if (calculationResult.gap >= 0) {
      return `You're on track to meet your goal! You have a surplus of ₹${Math.abs(calculationResult.gap).toFixed(2)} per month. Consider investing this extra amount in Indian mutual funds or a fixed deposit to reach your goal faster.`
    } else {
      return `You need to either increase your income, reduce expenses by ₹${Math.abs(calculationResult.gap).toFixed(2)} per month, or extend your goal timeline to meet your target. Consider reviewing your SIP investments if you have any.`
    }
  }
}
