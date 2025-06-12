"use client"

import {
  Line,
  LineChart,
  Bar,
  BarChart,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"

const performanceData = [
  { date: "Jan 1", score: 72, sessions: 3, empathy: 75, clarity: 68, assertiveness: 73 },
  { date: "Jan 8", score: 76, sessions: 5, empathy: 78, clarity: 72, assertiveness: 78 },
  { date: "Jan 15", score: 79, sessions: 4, empathy: 82, clarity: 75, assertiveness: 80 },
  { date: "Jan 22", score: 82, sessions: 6, empathy: 85, clarity: 78, assertiveness: 83 },
  { date: "Jan 29", score: 84, sessions: 7, empathy: 87, clarity: 81, assertiveness: 85 },
  { date: "Feb 5", score: 87, sessions: 5, empathy: 90, clarity: 84, assertiveness: 87 },
  { date: "Feb 12", score: 85, sessions: 4, empathy: 88, clarity: 82, assertiveness: 85 },
  { date: "Feb 19", score: 89, sessions: 8, empathy: 92, clarity: 86, assertiveness: 89 },
]

const domainData = [
  { domain: "Workplace", sessions: 45, avgScore: 86, improvement: 12 },
  { domain: "Dating", sessions: 32, avgScore: 82, improvement: 8 },
  { domain: "Family", sessions: 28, avgScore: 88, improvement: 15 },
  { domain: "Networking", sessions: 22, avgScore: 79, improvement: 6 },
]

const weeklyActivityData = [
  { day: "Mon", sessions: 2, minutes: 45 },
  { day: "Tue", sessions: 1, minutes: 22 },
  { day: "Wed", sessions: 3, minutes: 67 },
  { day: "Thu", sessions: 2, minutes: 38 },
  { day: "Fri", sessions: 4, minutes: 89 },
  { day: "Sat", sessions: 1, minutes: 15 },
  { day: "Sun", sessions: 2, minutes: 41 },
]

interface OverviewChartsProps {
  timeRange: string
}

export function OverviewCharts({ timeRange }: OverviewChartsProps) {
  return (
    <div className="grid gap-6">
      {/* Performance Trend */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Performance Trend
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                +12% improvement
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                score: {
                  label: "Overall Score",
                  color: "hsl(var(--chart-1))",
                },
                empathy: {
                  label: "Empathy",
                  color: "hsl(var(--chart-2))",
                },
                clarity: {
                  label: "Clarity",
                  color: "hsl(var(--chart-3))",
                },
                assertiveness: {
                  label: "Assertiveness",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[60, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="var(--color-score)"
                    strokeWidth={3}
                    dot={{ fill: "var(--color-score)", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="empathy"
                    stroke="var(--color-empathy)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  <Line
                    type="monotone"
                    dataKey="clarity"
                    stroke="var(--color-clarity)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  <Line
                    type="monotone"
                    dataKey="assertiveness"
                    stroke="var(--color-assertiveness)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                sessions: {
                  label: "Sessions",
                  color: "hsl(var(--chart-1))",
                },
                minutes: {
                  label: "Minutes",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sessions" fill="var(--color-sessions)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Domain Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance by Domain</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {domainData.map((domain, index) => (
              <div key={domain.domain} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-slate-900">{domain.domain}</h4>
                    <Badge variant="outline" className="text-xs">
                      {domain.sessions} sessions
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-slate-600">+{domain.improvement}% improvement</span>
                    <span className="text-lg font-bold text-slate-900" style={{ fontVariantNumeric: "tabular-nums" }}>
                      {domain.avgScore}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${domain.avgScore}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 w-8">{domain.avgScore}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Practice Intensity Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Practice Intensity</CardTitle>
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
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="sessions"
                  stroke="var(--color-sessions)"
                  fill="var(--color-sessions)"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
