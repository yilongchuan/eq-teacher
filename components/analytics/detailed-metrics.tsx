"use client"

import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, MessageSquare, Target, TrendingUp } from "lucide-react"

const sessionMetrics = [
  { metric: "Total Sessions", value: "127", change: "+12%", icon: MessageSquare },
  { metric: "Total Practice Time", value: "42.5h", change: "+18%", icon: Clock },
  { metric: "Average Session Length", value: "20m", change: "+3%", icon: Target },
  { metric: "Completion Rate", value: "94%", change: "+2%", icon: TrendingUp },
]

const scenarioPerformance = [
  { scenario: "Performance Review", sessions: 25, avgScore: 87, improvement: 12 },
  { scenario: "Team Conflict", sessions: 18, avgScore: 82, improvement: 8 },
  { scenario: "Client Presentation", sessions: 22, avgScore: 89, improvement: 15 },
  { scenario: "Salary Negotiation", sessions: 15, avgScore: 79, improvement: 6 },
  { scenario: "First Date", sessions: 20, avgScore: 85, improvement: 10 },
  { scenario: "Family Discussion", sessions: 16, avgScore: 91, improvement: 14 },
]

const timeDistribution = [
  { timeSlot: "Morning (6-12)", sessions: 45, percentage: 35 },
  { timeSlot: "Afternoon (12-18)", sessions: 52, percentage: 41 },
  { timeSlot: "Evening (18-24)", sessions: 30, percentage: 24 },
]

const weeklyComparison = [
  { week: "Week 1", sessions: 8, avgScore: 76, totalTime: 160 },
  { week: "Week 2", sessions: 12, avgScore: 79, totalTime: 240 },
  { week: "Week 3", sessions: 10, avgScore: 82, totalTime: 200 },
  { week: "Week 4", sessions: 15, avgScore: 85, totalTime: 300 },
  { week: "Week 5", sessions: 11, avgScore: 87, totalTime: 220 },
  { week: "Week 6", sessions: 13, avgScore: 89, totalTime: 260 },
]

const difficultyBreakdown = [
  { difficulty: "Easy", sessions: 45, avgScore: 92, color: "#10B981" },
  { difficulty: "Medium", sessions: 58, avgScore: 84, color: "#F59E0B" },
  { difficulty: "Hard", sessions: 24, avgScore: 76, color: "#EF4444" },
]

interface DetailedMetricsProps {
  timeRange: string
}

export function DetailedMetrics({ timeRange }: DetailedMetricsProps) {
  return (
    <div className="space-y-6">
      {/* Session Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sessionMetrics.map((metric, index) => (
          <Card key={metric.metric}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">{metric.metric}</p>
                  <p className="text-2xl font-bold text-slate-900" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {metric.value}
                  </p>
                  <Badge variant="outline" className="mt-1 text-xs bg-green-50 text-green-700 border-green-200">
                    {metric.change}
                  </Badge>
                </div>
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <metric.icon className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Scenario Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Scenario Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                avgScore: {
                  label: "Average Score",
                  color: "hsl(var(--chart-1))",
                },
                sessions: {
                  label: "Sessions",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scenarioPerformance} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="scenario" type="category" width={120} className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="avgScore" fill="var(--color-avgScore)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Weekly Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                avgScore: {
                  label: "Average Score",
                  color: "hsl(var(--chart-1))",
                },
                sessions: {
                  label: "Sessions",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="avgScore"
                    stroke="var(--color-avgScore)"
                    strokeWidth={3}
                    dot={{ fill: "var(--color-avgScore)", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sessions"
                    stroke="var(--color-sessions)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Time Distribution and Difficulty Breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Practice Time Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timeDistribution.map((slot, index) => (
                <div key={slot.timeSlot} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">{slot.timeSlot}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-600">{slot.sessions} sessions</span>
                      <span className="text-sm font-medium text-slate-900">{slot.percentage}%</span>
                    </div>
                  </div>
                  <Progress value={slot.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Difficulty Level Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                sessions: {
                  label: "Sessions",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={difficultyBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="sessions"
                    label={({ difficulty, percentage }) => `${difficulty}: ${percentage}%`}
                  >
                    {difficultyBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-4 space-y-2">
              {difficultyBreakdown.map((item) => (
                <div key={item.difficulty} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-slate-700">{item.difficulty}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-slate-600">{item.sessions} sessions</span>
                    <span className="font-medium text-slate-900">{item.avgScore} avg</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Scenario Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Scenario Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scenarioPerformance.map((scenario, index) => (
              <div key={scenario.scenario} className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-slate-900">{scenario.scenario}</h4>
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline" className="text-xs">
                      {scenario.sessions} sessions
                    </Badge>
                    <span className="text-lg font-bold text-slate-900" style={{ fontVariantNumeric: "tabular-nums" }}>
                      {scenario.avgScore}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Progress value={scenario.avgScore} className="flex-1 mr-4" />
                  <span className="text-sm text-green-600 font-medium">+{scenario.improvement}% improvement</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
