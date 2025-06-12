"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Target, Calendar, CheckCircle, Circle, TrendingUp, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const goals = [
  {
    id: "1",
    title: "Improve Empathy Score to 95",
    description: "Focus on understanding others' perspectives in workplace scenarios",
    category: "skill",
    target: 95,
    current: 92,
    deadline: "2025-03-01",
    status: "active",
    progress: 85,
    milestones: [
      { title: "Complete 10 empathy-focused sessions", completed: true },
      { title: "Achieve 90+ empathy score", completed: true },
      { title: "Maintain 90+ for 2 weeks", completed: false },
      { title: "Reach target of 95", completed: false },
    ],
  },
  {
    id: "2",
    title: "30-Day Practice Streak",
    description: "Practice emotional intelligence daily for 30 consecutive days",
    category: "habit",
    target: 30,
    current: 12,
    deadline: "2025-02-28",
    status: "active",
    progress: 40,
    milestones: [
      { title: "Complete 7-day streak", completed: true },
      { title: "Complete 14-day streak", completed: false },
      { title: "Complete 21-day streak", completed: false },
      { title: "Complete 30-day streak", completed: false },
    ],
  },
  {
    id: "3",
    title: "Master Conflict Resolution",
    description: "Achieve consistent 85+ scores in conflict resolution scenarios",
    category: "skill",
    target: 85,
    current: 81,
    deadline: "2025-04-15",
    status: "active",
    progress: 75,
    milestones: [
      { title: "Complete conflict resolution course", completed: true },
      { title: "Practice 15 conflict scenarios", completed: true },
      { title: "Achieve 80+ average score", completed: true },
      { title: "Achieve 85+ average score", completed: false },
    ],
  },
  {
    id: "4",
    title: "Complete 100 Practice Sessions",
    description: "Reach milestone of 100 total practice sessions",
    category: "milestone",
    target: 100,
    current: 87,
    deadline: "2025-03-31",
    status: "active",
    progress: 87,
    milestones: [
      { title: "Complete 25 sessions", completed: true },
      { title: "Complete 50 sessions", completed: true },
      { title: "Complete 75 sessions", completed: true },
      { title: "Complete 100 sessions", completed: false },
    ],
  },
]

interface GoalTrackingProps {
  timeRange: string
}

export function GoalTracking({ timeRange }: GoalTrackingProps) {
  const [showNewGoalDialog, setShowNewGoalDialog] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "",
    target: "",
    deadline: "",
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "skill":
        return "bg-indigo-100 text-indigo-700 border-indigo-200"
      case "habit":
        return "bg-green-100 text-green-700 border-green-200"
      case "milestone":
        return "bg-amber-100 text-amber-700 border-amber-200"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const getStatusColor = (progress: number) => {
    if (progress >= 100) return "text-green-600"
    if (progress >= 75) return "text-amber-600"
    return "text-slate-600"
  }

  const handleCreateGoal = () => {
    // Handle goal creation
    console.log("Creating goal:", newGoal)
    setShowNewGoalDialog(false)
    setNewGoal({ title: "", description: "", category: "", target: "", deadline: "" })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Goal Tracking</h3>
          <p className="text-slate-600">Set and track your emotional intelligence development goals</p>
        </div>
        <Dialog open={showNewGoalDialog} onOpenChange={setShowNewGoalDialog}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Goal Title</label>
                <Input
                  placeholder="e.g., Improve clarity score to 90"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Description</label>
                <Textarea
                  placeholder="Describe your goal and why it's important"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Category</label>
                  <Select
                    value={newGoal.category}
                    onValueChange={(value) => setNewGoal({ ...newGoal, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="skill">Skill</SelectItem>
                      <SelectItem value="habit">Habit</SelectItem>
                      <SelectItem value="milestone">Milestone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Target</label>
                  <Input
                    placeholder="e.g., 90"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Deadline</label>
                <Input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowNewGoalDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateGoal} disabled={!newGoal.title || !newGoal.category}>
                  Create Goal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Goals Grid */}
      <div className="grid gap-6">
        {goals.map((goal, index) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold text-slate-900">{goal.title}</h4>
                      <Badge variant="outline" className={getCategoryColor(goal.category)}>
                        {goal.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">{goal.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <div className="flex items-center space-x-1">
                        <Target className="w-4 h-4" />
                        <span>Target: {goal.target}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>Current: {goal.current}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Progress</span>
                    <span className={`text-sm font-medium ${getStatusColor(goal.progress)}`}>{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>

                {/* Milestones */}
                <div className="space-y-3">
                  <h5 className="text-sm font-medium text-slate-700">Milestones</h5>
                  <div className="space-y-2">
                    {goal.milestones.map((milestone, milestoneIndex) => (
                      <div key={milestoneIndex} className="flex items-center space-x-3">
                        {milestone.completed ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-400" />
                        )}
                        <span
                          className={`text-sm ${
                            milestone.completed ? "text-slate-900 line-through" : "text-slate-700"
                          }`}
                        >
                          {milestone.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
