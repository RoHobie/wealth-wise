import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const {
      monthlySavingPotential,
      requiredMonthlySavings,
      gap,
      progressPercentage,
      goalAmount,
      currentSavings,
      userGoals,
      userLevel,
    } = await request.json()

    // Create a prompt for the AI model
    const prompt = `
      As a financial advisor, provide personalized advice based on the following financial data:
      
      Monthly Saving Potential: ₹${monthlySavingPotential}
      Required Monthly Savings: ₹${requiredMonthlySavings}
      Monthly Gap/Surplus: ₹${gap} (${gap >= 0 ? "surplus" : "deficit"})
      Current Progress: ${progressPercentage.toFixed(1)}%
      Goal Amount: ₹${goalAmount}
      Current Savings: ₹${currentSavings}
      User Experience: Level ${userLevel} with ${userGoals} total goals
      
      Provide specific, actionable financial advice in 2-3 sentences that helps the user reach their goal.
      Focus on practical steps they can take based on their current financial situation.
      Keep your response under 400 characters.
      Include advice specific to the Indian financial context, mentioning relevant investment options in India if appropriate.
    `

    // Call the AI model using the AI SDK with the API key from environment variables
    const { text } = await generateText({
      model: openai("gpt-4o"), // The API key will be automatically picked up from environment variables
      prompt: prompt,
    })

    return NextResponse.json({ advice: text })
  } catch (error) {
    console.error("Error generating financial advice:", error)
    return NextResponse.json({ error: "Failed to generate financial advice" }, { status: 500 })
  }
}
