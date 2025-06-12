"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Play, Filter, TrendingUp, Award, Calendar, ChevronDown, Sparkles, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

const scenarios = [
  {
    id: "1",
    title: "Annual Performance Review",
    description: "Navigate a challenging conversation about career growth and feedback",
    domain: "workplace",
    difficulty: "medium",
    isNew: false,
    lastScore: 87,
  },
  {
    id: "2",
    title: "First Date Conversation",
    description: "Build connection while staying authentic and engaging",
    domain: "dating",
    difficulty: "easy",
    isNew: true,
    lastScore: null,
  },
  {
    id: "3",
    title: "Family Conflict Resolution",
    description: "Address disagreements with empathy and understanding",
    domain: "family",
    difficulty: "hard",
    isNew: false,
    lastScore: 72,
  },
]

const recentScores = [
  { date: "Today", score: 87, scenario: "Performance Review" },
  { date: "Yesterday", score: 92, scenario: "Team Meeting" },
  { date: "2 days ago", score: 78, scenario: "Client Call" },
]

const badges = [
  { id: "first-perfect", name: "Perfect Score", description: "Achieved 100% in any scenario", earned: false },
  { id: "cross-domain", name: "Cross-Domain Expert", description: "Practiced in 3+ different domains", earned: true },
  { id: "streak-7", name: "7-Day Streak", description: "Practiced for 7 consecutive days", earned: true },
  { id: "empathy-master", name: "Empathy Master", description: "Scored 95+ in empathy 5 times", earned: false },
]

export default function DashboardPage() {
  const [selectedDomain, setSelectedDomain] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [newScenarioOpen, setNewScenarioOpen] = useState(false)
  const [scenarioKeywords, setScenarioKeywords] = useState("")

  const filteredScenarios = scenarios.filter((scenario) => {
    const domainMatch = selectedDomain === "all" || scenario.domain === selectedDomain
    const difficultyMatch = selectedDifficulty === "all" || scenario.difficulty === selectedDifficulty
    return domainMatch && difficultyMatch
  })

  const handleGenerateScenario = () => {
    // API call to generate new scenario
    console.log("Generating scenario with keywords:", scenarioKeywords)
    setNewScenarioOpen(false)
    setScenarioKeywords("")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "Inter Tight, sans-serif" }}>
              Practice Dashboard
            </h1>
            <p className="text-slate-600">Choose a scenario to start practicing</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              View History
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/app/analytics">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Link>
            </Button>
            <Dialog open={newScenarioOpen} onOpenChange={setNewScenarioOpen}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Generate New Scenario
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate Custom Scenario</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Describe your scenario</label>
                    <Textarea
                      placeholder="e.g., Asking for a raise, difficult customer service call, family dinner discussion..."
                      value={scenarioKeywords}
                      onChange={(e) => setScenarioKeywords(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setNewScenarioOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleGenerateScenario} disabled={!scenarioKeywords.trim()}>
                      Generate Scenario
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  {selectedDomain === "all" ? "All Domains" : selectedDomain}
                  <ChevronDown className="w-4 h-4 ml-auto" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedDomain("all")}>All Domains</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedDomain("workplace")}>Workplace</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedDomain("dating")}>Dating</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedDomain("family")}>Family</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex bg-slate-100 rounded-lg p-1">
              {["all", "easy", "medium", "hard"].map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                    selectedDifficulty === difficulty
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {difficulty === "all" ? "All Levels" : difficulty}
                </button>
              ))}
            </div>
          </div>

          {/* Scenarios Grid */}
          <div className="grid gap-4">
            {filteredScenarios.map((scenario, index) => (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Card className="hover:shadow-lg transition-all duration-200 group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900">{scenario.title}</h3>
                          {scenario.isNew && (
                            <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                              <Sparkles className="w-3 h-3 mr-1" />
                              New
                            </Badge>
                          )}
                          <Badge variant="outline" className="capitalize">
                            {scenario.difficulty}
                          </Badge>
                        </div>
                        <p className="text-slate-600 mb-3">{scenario.description}</p>
                        {scenario.lastScore && (
                          <div className="flex items-center text-sm text-slate-500">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            Last score: {scenario.lastScore}%
                          </div>
                        )}
                      </div>
                      <Link href={`/app/play/${scenario.id}`}>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white group-hover:scale-105 transition-transform">
                          <Play className="w-4 h-4 mr-2" />
                          Play
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white border-l border-slate-200 p-6 space-y-6">
          {/* Recent Scores */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Scores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentScores.map((score, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-900">{score.scenario}</div>
                    <div className="text-sm text-slate-500">{score.date}</div>
                  </div>
                  <div className="text-2xl font-bold text-indigo-600" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {score.score}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Progress Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">7-Day Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    badge.earned ? "bg-amber-50 border border-amber-200" : "bg-slate-50"
                  }`}
                  title={badge.description}
                >
                  <Award className={`w-5 h-5 ${badge.earned ? "text-amber-600" : "text-slate-400"}`} />
                  <div className="flex-1">
                    <div className={`font-medium ${badge.earned ? "text-amber-900" : "text-slate-500"}`}>
                      {badge.name}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
