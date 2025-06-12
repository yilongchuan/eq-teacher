"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Target, MessageCircle, BarChart3, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

const domains = [
  { id: "workplace", label: "Workplace Feedback", icon: "💼" },
  { id: "dating", label: "Dating & Relationships", icon: "💕" },
  { id: "family", label: "Family Conversations", icon: "👨‍👩‍👧‍👦" },
  { id: "networking", label: "Professional Networking", icon: "🤝" },
  { id: "conflict", label: "Conflict Resolution", icon: "⚖️" },
  { id: "sales", label: "Sales & Negotiation", icon: "💰" },
]

const tips = [
  {
    icon: MessageCircle,
    title: "Practice Real Conversations",
    description: "Engage in realistic scenarios tailored to your goals and challenges.",
  },
  {
    icon: BarChart3,
    title: "Get Instant Feedback",
    description: "Receive detailed scores on empathy, clarity, and emotional intelligence.",
  },
  {
    icon: Sparkles,
    title: "Share Your Progress",
    description: "Turn your best conversations into shareable comics and celebrate wins.",
  },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [selectedDomains, setSelectedDomains] = useState<string[]>([])
  const router = useRouter()

  const handleDomainToggle = (domainId: string) => {
    setSelectedDomains((prev) => (prev.includes(domainId) ? prev.filter((id) => id !== domainId) : [...prev, domainId]))
  }

  const handleComplete = () => {
    // Save preferences and redirect to dashboard
    localStorage.setItem("userPreferences", JSON.stringify({ domains: selectedDomains }))
    router.push("/app")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="text-center p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="space-y-6">
                  <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                    <span className="text-white font-bold text-2xl">EQ</span>
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "Inter Tight, sans-serif" }}>
                    Welcome to EQteacher
                  </h1>
                  <p className="text-lg text-slate-600 max-w-md mx-auto">
                    Let's personalize your emotional intelligence training experience in just a few steps.
                  </p>
                  <Button
                    onClick={() => setStep(2)}
                    size="lg"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3"
                  >
                    Get Started
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="domains"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="space-y-6">
                  <div className="text-center space-y-3">
                    <Target className="w-12 h-12 text-indigo-600 mx-auto" />
                    <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "Inter Tight, sans-serif" }}>
                      Choose Your Focus Areas
                    </h2>
                    <p className="text-slate-600">
                      Select the conversation types you'd like to practice (choose at least one)
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {domains.map((domain) => (
                      <motion.button
                        key={domain.id}
                        onClick={() => handleDomainToggle(domain.id)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          selectedDomains.includes(domain.id)
                            ? "border-indigo-500 bg-indigo-50 shadow-md"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{domain.icon}</span>
                          <span className="font-medium text-slate-900 text-sm">{domain.label}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="ghost" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      disabled={selectedDomains.length === 0}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      Continue
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="tips"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="space-y-8">
                  <div className="text-center space-y-3">
                    <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "Inter Tight, sans-serif" }}>
                      How EQteacher Works
                    </h2>
                    <p className="text-slate-600">Here's what makes your practice sessions effective</p>
                  </div>

                  <div className="space-y-6">
                    {tips.map((tip, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start space-x-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2, duration: 0.4 }}
                      >
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <tip.icon className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-1">{tip.title}</h3>
                          <p className="text-slate-600 text-sm">{tip.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="ghost" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button
                      onClick={handleComplete}
                      size="lg"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
                    >
                      Start First Practice
                      <Sparkles className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                i <= step ? "bg-indigo-600" : "bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
