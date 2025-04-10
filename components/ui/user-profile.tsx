"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Award, Trophy } from "lucide-react"

interface UserProfileProps {
  level: number
  completedGoals: number
  showFirstGoalBadge: boolean
}

export default function UserProfile({ level, completedGoals, showFirstGoalBadge }: UserProfileProps) {
  // Calculate progress to next level
  const goalsForNextLevel = level * 5
  const progress = ((completedGoals % 5) / 5) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
        <CardDescription>Track your financial planning journey</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-xl">Level {level}</h3>
            <p className="text-sm text-muted-foreground">Financial Planner</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="text-sm">Progress to Level {level + 1}</p>
            <p className="text-sm">{completedGoals % 5}/5 goals</p>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div>
          <h3 className="font-medium mb-2">Badges</h3>
          <div className="flex flex-wrap gap-2">
            {showFirstGoalBadge && (
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-1">
                  <Award className="h-6 w-6 text-amber-500" />
                </div>
                <span className="text-xs">First Goal</span>
              </div>
            )}

            {completedGoals >= 1 && (
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-1">
                  <Award className="h-6 w-6 text-green-500" />
                </div>
                <span className="text-xs">Goal Achiever</span>
              </div>
            )}

            {level >= 2 && (
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-1">
                  <Award className="h-6 w-6 text-blue-500" />
                </div>
                <span className="text-xs">Dedicated</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-muted p-3 rounded-lg">
          <p className="text-sm">
            <span className="font-medium">Total Completed Goals:</span> {completedGoals}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
