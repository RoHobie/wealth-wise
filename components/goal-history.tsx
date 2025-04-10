"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, CheckCircle, Edit } from "lucide-react"
import type { Goal } from "@/lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

interface GoalHistoryProps {
  goals: Goal[]
  onDelete: (id: string) => void
  onComplete: (id: string) => void
  onUpdateProgress: (id: string, progress: number, currentSavings: number) => void
}

export default function GoalHistory({ goals, onDelete, onComplete, onUpdateProgress }: GoalHistoryProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [progressValue, setProgressValue] = useState(0)
  const [currentSavingsValue, setCurrentSavingsValue] = useState(0)

  const openProgressDialog = (goal: Goal) => {
    setSelectedGoal(goal)
    setProgressValue(goal.progress)
    setCurrentSavingsValue(goal.currentSavings)
    setIsDialogOpen(true)
  }

  const handleUpdateProgress = () => {
    if (selectedGoal) {
      onUpdateProgress(selectedGoal.id, progressValue, currentSavingsValue)
      setIsDialogOpen(false)
    }
  }

  if (goals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Goal History</CardTitle>
          <CardDescription>Your saved financial goals will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">No goals saved yet. Create your first goal!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Goal History</CardTitle>
          <CardDescription>Your saved financial goals</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {goals.map((goal) => (
                <Card key={goal.id} className={`${goal.completed ? "bg-muted" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium flex items-center">
                          {goal.name}
                          {goal.completed && <CheckCircle className="h-4 w-4 text-green-500 ml-2" />}
                        </h3>
                        <p className="text-xs text-muted-foreground">{new Date(goal.date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex space-x-1">
                        {!goal.completed && (
                          <>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => openProgressDialog(goal)}
                              className="h-7 w-7"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Update Progress</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => onComplete(goal.id)}
                              className="h-7 w-7"
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span className="sr-only">Complete</span>
                            </Button>
                          </>
                        )}
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onDelete(goal.id)}
                          className="h-7 w-7 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between text-xs">
                        <span>Progress: {goal.progress.toFixed(1)}%</span>
                        <span>
                          ₹{goal.currentSavings.toFixed(0)} / ₹{goal.goalAmount.toFixed(0)}
                        </span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs mt-3">
                      <div>
                        <p className="text-muted-foreground">Goal Amount:</p>
                        <p className="font-medium">₹{goal.goalAmount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Current Savings:</p>
                        <p className="font-medium">₹{goal.currentSavings.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Duration:</p>
                        <p className="font-medium">
                          {goal.goalDuration} {goal.durationType}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status:</p>
                        <Badge variant={goal.completed ? "success" : "default"} className="mt-1">
                          {goal.completed ? "Completed" : "In Progress"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Goal Progress</DialogTitle>
          </DialogHeader>

          {selectedGoal && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="currentSavings">Current Savings (₹)</Label>
                <Input
                  id="currentSavings"
                  type="number"
                  value={currentSavingsValue}
                  onChange={(e) => {
                    const value = Number.parseFloat(e.target.value)
                    setCurrentSavingsValue(value)
                    // Update progress percentage based on current savings
                    if (selectedGoal.goalAmount > 0) {
                      setProgressValue((value / selectedGoal.goalAmount) * 100)
                    }
                  }}
                  min="0"
                  step="100"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="progress">Progress ({progressValue.toFixed(1)}%)</Label>
                </div>
                <Input
                  id="progress"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={progressValue}
                  onChange={(e) => {
                    const value = Number.parseFloat(e.target.value)
                    setProgressValue(value)
                    // Update current savings based on progress percentage
                    setCurrentSavingsValue((value / 100) * selectedGoal.goalAmount)
                  }}
                  className="w-full"
                />
                <Progress value={progressValue} className="h-2" />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProgress}>Update Progress</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
