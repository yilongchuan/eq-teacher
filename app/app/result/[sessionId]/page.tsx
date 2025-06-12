"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Download, RotateCcw, Share2, TrendingUp, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const scoreData = {
  overall: 87,
  dimensions: [
    { name: "Empathy", score: 92, description: "Your ability to understand and share feelings" },
    { name: "Clarity", score: 85, description: "How clearly you communicate your thoughts" },
    { name: "Assertiveness", score: 83, description: "Your confidence in expressing needs and boundaries" },
    { name: "Active Listening", score: 90, description: "How well you listen and respond to others" },
  ],
  improvements: [
    {
      title: "Use more specific examples",
      template:
        "Instead of saying 'I've been working hard,' try 'I completed the Johnson project 2 days ahead of schedule.'",
    },
    {
      title: "Ask follow-up questions",
      template: "Try asking 'What specific areas would you like me to focus on?' to show engagement.",
    },
    {
      title: "Acknowledge feedback positively",
      template: "Use phrases like 'I appreciate that feedback' or 'That's helpful to know.'",
    },
  ],
}

export default function ResultPage({ params }: { params: { sessionId: string } }) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const [comicLoaded, setComicLoaded] = useState(false)

  // Animate score from 0 to final value
  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0
      const increment = scoreData.overall / 50 // 50 steps for smooth animation
      const interval = setInterval(() => {
        current += increment
        if (current >= scoreData.overall) {
          setAnimatedScore(scoreData.overall)
          clearInterval(interval)
        } else {
          setAnimatedScore(Math.floor(current))
        }
      }, 20)
      return () => clearInterval(interval)
    }, 500)

    // Simulate comic loading
    const comicTimer = setTimeout(() => {
      setComicLoaded(true)
    }, 2000)

    return () => {
      clearTimeout(timer)
      clearTimeout(comicTimer)
    }
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-amber-600"
    if (score >= 70) return "text-orange-600"
    return "text-red-600"
  }

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-green-100"
    if (score >= 80) return "bg-amber-100"
    if (score >= 70) return "bg-orange-100"
    return "bg-red-100"
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "Inter Tight, sans-serif" }}>
            Practice Session Complete!
          </h1>
          <p className="text-lg text-slate-600">Here's how you performed in your performance review conversation</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Overall Score */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="text-center">
              <CardHeader>
                <CardTitle>Overall EQ Score</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-slate-200"
                    />
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      className="text-indigo-600"
                      initial={{ strokeDasharray: "0 314" }}
                      animate={{ strokeDasharray: `${(animatedScore / 100) * 314} 314` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-slate-900" style={{ fontVariantNumeric: "tabular-nums" }}>
                      {animatedScore}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Badge className={`${getScoreBg(scoreData.overall)} ${getScoreColor(scoreData.overall)} border-0`}>
                    {scoreData.overall >= 90 ? "Excellent" : scoreData.overall >= 80 ? "Good" : "Needs Improvement"}
                  </Badge>
                  <p className="text-sm text-slate-600">Average users score 72. You're doing great!</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Dimension Scores */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Detailed Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {scoreData.dimensions.map((dimension, index) => (
                  <motion.div
                    key={dimension.name}
                    className="space-y-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-900">{dimension.name}</h4>
                        <p className="text-sm text-slate-600">{dimension.description}</p>
                      </div>
                      <span className="text-lg font-bold text-slate-900" style={{ fontVariantNumeric: "tabular-nums" }}>
                        {dimension.score}
                      </span>
                    </div>
                    <Progress value={dimension.score} className="h-2" />
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Improvements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {scoreData.improvements.map((improvement, index) => (
                <motion.div
                  key={index}
                  className="p-4 bg-slate-50 rounded-lg space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                >
                  <h4 className="font-medium text-slate-900">{improvement.title}</h4>
                  <p className="text-sm text-slate-600 italic">"{improvement.template}"</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(improvement.template)}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    Copy Template
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Comic Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-indigo-600" />
                Your Conversation Comic
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!comicLoaded ? (
                <div className="h-48 bg-slate-100 rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-sm text-slate-600">Generating your comic...</p>
                  </div>
                </div>
              ) : (
                <motion.div
                  className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="text-center space-y-4">
                    <div className="grid grid-cols-2 gap-2 max-w-md">
                      {[1, 2, 3, 4].map((panel) => (
                        <div key={panel} className="bg-white rounded p-3 text-xs">
                          <div className="bg-slate-200 rounded h-8 mb-2"></div>
                          <div className="bg-slate-100 rounded h-2 mb-1"></div>
                          <div className="bg-slate-100 rounded h-2 w-3/4"></div>
                        </div>
                      ))}
                    </div>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                      <Download className="w-4 h-4 mr-2" />
                      Download PNG
                    </Button>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <Link href="/app/play/2">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <RotateCcw className="w-5 h-5 mr-2" />
              Practice Again (Medium)
            </Button>
          </Link>
          <Link href="/app">
            <Button variant="outline" size="lg">
              Back to Dashboard
            </Button>
          </Link>
          <Button variant="outline" size="lg">
            <Share2 className="w-5 h-5 mr-2" />
            Share Results
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
