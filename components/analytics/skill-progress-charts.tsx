"use client"

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

const skillRadarData = [
  { skill: "Empathy", current: 92, target: 95, previous: 85 },
  { skill: "Clarity", current: 85, target: 90, previous: 78 },
  { skill: "Assertiveness", current: 83, target: 88, previous: 79 },
  { skill: "Active Listening", current: 90, target: 92, previous: 84 },
  { skill: "Emotional Regulation", current: 78, target: 85, previous: 72 },
  { skill: "Conflict Resolution", current: 81, target: 87, previous: 75 },
]

const skillTrendData = [
  { week: "W1", empathy: 75, clarity: 68, assertiveness: 73, listening: 80, regulation: 65, conflict: 70 },
  { week: "W2", empathy: 78, clarity: 72, assertiveness: 76, listening: 82, regulation: 68, conflict: 72 },
  { week: "W3", empathy: 82, clarity: 75, assertiveness: 78, listening: 85, regulation: 71, conflict: 75 },
  { week: "W4", empathy: 85, clarity: 78, assertiveness: 80, listening: 87, regulation: 74, conflict: 78 },
  { week: "W5", empathy: 88, clarity: 81, assertiveness: 82, listening: 88, regulation: 76, conflict: 80 },
  { week: "W6", empathy: 90, clarity: 83, assertiveness: 83, listening: 89, regulation: 78, conflict: 81 },
  { week: "W7", empathy: 92, clarity: 85, assertiveness: 83, listening: 90, regulation: 78, conflict: 81 },
]

const skillInsights = [
  {
    skill: "Empathy",
    score: 92,
    change: 7,
    trend: "up",
    insight: "Excellent progress in understanding others' perspectives",
    nextStep: "Focus on expressing empathy verbally",
  },
  {
    skill: "Clarity",
    score: 85,
    change: 7,
    trend: "up",
    insight: "Significant improvement in message structure",
    nextStep: "Work on using specific examples",
  },
  {
    skill: "Assertiveness",
    score: 83,
    change: 4,
    trend: "up",
    insight: "Steady growth in expressing needs confidently",
    nextStep: "Practice setting boundaries",
  },
  {
    skill: "Active Listening",
    score: 90,
    change: 6,
    trend: "up",
    insight: "Strong ability to reflect and respond",
    nextStep: "Focus on asking follow-up questions",
  },
  {
    skill: "Emotional Regulation",
    score: 78,
    change: 6,
    trend: "up",
    insight: "Good progress in managing reactions",
    nextStep: "Practice pause techniques",
  },
  {
    skill: "Conflict Resolution",
    score: 81,
    change: 6,
    trend: "up",
    insight: "Improving at finding common ground",
    nextStep: "Work on de-escalation techniques",
  },
]

interface SkillProgressChartsProps {
  timeRange: string
}

export function SkillProgressCharts({ timeRange }: SkillProgressChartsProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <Minus className="w-4 h-4 text-slate-600" />
    }
  }

  return (
    <div className="grid gap-6">
      {/* Skill Radar Chart */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Skill Assessment Radar</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                current: {
                  label: "Current Level",
                  color: "hsl(var(--chart-1))",
                },
                target: {
                  label: "Target Level",
                  color: "hsl(var(--chart-2))",
                },
                previous: {
                  label: "Previous Level",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillRadarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" className="text-xs" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} className="text-xs" />
                  <Radar
                    name="Current"
                    dataKey="current"
                    stroke="var(--color-current)"
                    fill="var(--color-current)"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Target"
                    dataKey="target"
                    stroke="var(--color-target)"
                    fill="transparent"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  <Radar
                    name="Previous"
                    dataKey="previous"
                    stroke="var(--color-previous)"
                    fill="transparent"
                    strokeWidth={1}
                    strokeDasharray="2 2"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skill Progress Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                empathy: {
                  label: "Empathy",
                  color: "hsl(var(--chart-1))",
                },
                clarity: {
                  label: "Clarity",
                  color: "hsl(var(--chart-2))",
                },
                assertiveness: {
                  label: "Assertiveness",
                  color: "hsl(var(--chart-3))",
                },
                listening: {
                  label: "Active Listening",
                  color: "hsl(var(--chart-4))",
                },
                regulation: {
                  label: "Emotional Regulation",
                  color: "hsl(var(--chart-5))",
                },
                conflict: {
                  label: "Conflict Resolution",
                  color: "hsl(220 70% 50%)",
                },
              }}
              className="h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={skillTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis domain={[60, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="empathy" stroke="var(--color-empathy)" strokeWidth={2} />
                  <Line type="monotone" dataKey="clarity" stroke="var(--color-clarity)" strokeWidth={2} />
                  <Line type="monotone" dataKey="assertiveness" stroke="var(--color-assertiveness)" strokeWidth={2} />
                  <Line type="monotone" dataKey="listening" stroke="var(--color-listening)" strokeWidth={2} />
                  <Line type="monotone" dataKey="regulation" stroke="var(--color-regulation)" strokeWidth={2} />
                  <Line type="monotone" dataKey="conflict" stroke="var(--color-conflict)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Skill Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Development Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {skillInsights.map((skill, index) => (
              <div key={skill.skill} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-slate-900">{skill.skill}</h4>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(skill.trend)}
                      <span className="text-sm text-slate-600">+{skill.change} points</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-slate-900" style={{ fontVariantNumeric: "tabular-nums" }}>
                      {skill.score}
                    </span>
                    <Badge
                      variant="outline"
                      className={
                        skill.score >= 90
                          ? "border-green-200 bg-green-50 text-green-700"
                          : skill.score >= 80
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : "border-slate-200 bg-slate-50 text-slate-700"
                      }
                    >
                      {skill.score >= 90 ? "Excellent" : skill.score >= 80 ? "Good" : "Developing"}
                    </Badge>
                  </div>
                </div>

                <Progress value={skill.score} className="h-2" />

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-slate-700">Insight: </span>
                    <span className="text-slate-600">{skill.insight}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Next Step: </span>
                    <span className="text-slate-600">{skill.nextStep}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
