"use client"

import { motion } from "framer-motion"
import { Play, Award, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function Hero() {
  const router = useRouter()

  const handleStartPractice = () => {
    router.push('/app/play')
  }

  return (
    <section className="pt-24 pb-16 px-4">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="space-y-6">
              <motion.h1
                className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight"
                style={{ fontFamily: "Inter Tight, sans-serif" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Master Crucial Conversations—
                <span className="text-indigo-600">Anywhere, Anytime.</span>
              </motion.h1>

              <motion.p
                className="text-xl text-slate-600 leading-relaxed max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                AI-powered role-play for workplace feedback, first dates, family talks, and more. Three turns. Instant
                insights.
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Button
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 px-8 py-4 text-lg"
                onClick={handleStartPractice}
              >
                Start Free Practice
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-slate-700 hover:text-indigo-600 px-8 py-4 text-lg group"
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              className="flex items-center space-x-6 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Product Hunt #1 Product of the Day</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Shield className="w-4 h-4 text-indigo-500" />
                <span>Stripe Verified Partner</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          >
            <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 shadow-2xl">
              <div className="bg-white rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">Practice Session</h3>
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Active</div>
                </div>

                <div className="space-y-3">
                  <div className="bg-slate-100 rounded-lg p-3">
                    <p className="text-sm text-slate-700">"I need to discuss my performance review..."</p>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-3 ml-4">
                    <p className="text-sm text-indigo-700">
                      "I understand this is important to you. Let's schedule time to discuss your goals and feedback
                      constructively."
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">87</div>
                    <div className="text-xs text-slate-500">EQ Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-500">92</div>
                    <div className="text-xs text-slate-500">Empathy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">85</div>
                    <div className="text-xs text-slate-500">Clarity</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
