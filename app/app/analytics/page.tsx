"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, TrendingUp, Target, BarChart3, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { OverviewCharts } from "@/components/analytics/overview-charts"
import { SkillProgressCharts } from "@/components/analytics/skill-progress-charts"
import { GoalTracking } from "@/components/analytics/goal-tracking"
import { DetailedMetrics } from "@/components/analytics/detailed-metrics"

const timeRanges = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 3 months" },
  { value: "1y", label: "Last year" },
  { value: "all", label: "All time" },
]

const keyMetrics = [
  {
    title: "Total Sessions",
    value: "127",
    change: "+12%",
    trend: "up",
    icon: BarChart3,
  },
  {
    title: "Average Score",
    value: "84.2",
    change: "+5.3%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "Practice Streak",
    value: "12 days",
    change: "Current",
    trend: "neutral",
    icon: Calendar,
  },
  {
    title: "Goals Achieved",
    value: "8/10",
    change: "80%",
    trend: "up",
    icon: Target,
  },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "Inter Tight, sans-serif" }}>
              Progress Analytics
            </h1>
            <p className="text-slate-600">Track your emotional intelligence development over time</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {keyMetrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">{metric.title}</p>
                      <p className="text-2xl font-bold text-slate-900" style={{ fontVariantNumeric: "tabular-nums" }}>
                        {metric.value}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <metric.icon className="w-6 h-6 text-indigo-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <Badge
                      variant="outline"
                      className={`${
                        metric.trend === "up"
                          ? "border-green-200 bg-green-50 text-green-700"
                          : metric.trend === "down"
                            ? "border-red-200 bg-red-50 text-red-700"
                            : "border-slate-200 bg-slate-50 text-slate-700"
                      }`}
                    >
                      {metric.change}
                    </Badge>
                    <span className="text-sm text-slate-500 ml-2">vs last period</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Analytics Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="detailed">Detailed</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <OverviewCharts timeRange={timeRange} />
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <SkillProgressCharts timeRange={timeRange} />
            </TabsContent>

            <TabsContent value="goals" className="space-y-6">
              <GoalTracking timeRange={timeRange} />
            </TabsContent>

            <TabsContent value="detailed" className="space-y-6">
              <DetailedMetrics timeRange={timeRange} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
