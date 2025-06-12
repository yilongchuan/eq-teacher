"use client"

import { motion } from "framer-motion"
import { Check, Star, Zap, Crown, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    description: "Perfect for getting started",
    features: [
      "3 practice sessions per month",
      "Basic score reports",
      "Community support",
      "Mobile app access",
      "Email notifications",
    ],
    popular: false,
    cta: "Get Started Free",
    icon: Zap,
  },
  {
    name: "Pro",
    price: "$7",
    period: "/mo",
    description: "For serious practitioners",
    features: [
      "Unlimited practice sessions",
      "Detailed analytics & insights",
      "Comic exports (PNG/PDF)",
      "Voice input & transcription",
      "Priority email support",
      "Custom scenario generation",
      "Progress tracking & goals",
      "Advanced feedback system",
    ],
    popular: true,
    cta: "Start Free Trial",
    icon: Crown,
  },
  {
    name: "Team",
    price: "Custom",
    period: "",
    description: "For organizations & teams",
    features: [
      "Everything in Pro",
      "Team dashboard & analytics",
      "Custom branding",
      "SSO integration",
      "Dedicated account manager",
      "Custom training scenarios",
      "API access",
      "Advanced reporting",
    ],
    popular: false,
    cta: "Contact Sales",
    icon: Shield,
  },
]

const faqs = [
  {
    question: "Can I switch plans anytime?",
    answer:
      "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate any billing differences.",
  },
  {
    question: "What happens to my data if I cancel?",
    answer:
      "Your data remains accessible for 30 days after cancellation. You can export your progress and comics during this period.",
  },
  {
    question: "Do you offer student discounts?",
    answer:
      "Yes! Students get 50% off Pro plans with a valid .edu email address. Contact support to apply your discount.",
  },
  {
    question: "Is there a free trial for Pro?",
    answer: "All Pro features are free for 14 days. No credit card required to start your trial.",
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 mb-16"
            >
              <h1 className="text-5xl font-bold text-slate-900" style={{ fontFamily: "Inter Tight, sans-serif" }}>
                Choose Your EQ Journey
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Start free and upgrade when you're ready. All plans include our core AI-powered conversation practice.
              </p>
            </motion.div>

            {/* Pricing Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center space-x-4 mb-12"
            >
              <span className="text-slate-600">Monthly</span>
              <div className="relative">
                <input type="checkbox" className="sr-only" />
                <div className="w-12 h-6 bg-slate-200 rounded-full cursor-pointer"></div>
              </div>
              <span className="text-slate-600">Annual</span>
              <Badge className="bg-amber-100 text-amber-800 border-amber-200">Save 15%</Badge>
            </motion.div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="relative"
                >
                  <Card
                    className={`h-full ${plan.popular ? "border-indigo-200 shadow-xl scale-105" : "border-slate-200"}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-indigo-600 text-white px-4 py-1 flex items-center">
                          <Star className="w-3 h-3 mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center pb-8 pt-8">
                      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <plan.icon className="w-6 h-6 text-indigo-600" />
                      </div>
                      <h3
                        className="text-2xl font-bold text-slate-900 mb-2"
                        style={{ fontFamily: "Inter Tight, sans-serif" }}
                      >
                        {plan.name}
                      </h3>
                      <p className="text-slate-600 mb-4">{plan.description}</p>
                      <div className="flex items-baseline justify-center">
                        <span
                          className="text-5xl font-bold text-slate-900"
                          style={{ fontVariantNumeric: "tabular-nums" }}
                        >
                          {plan.price}
                        </span>
                        {plan.period && <span className="text-slate-600 ml-1">{plan.period}</span>}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      <ul className="space-y-4">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start">
                            <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-700">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className={`w-full py-3 ${
                          plan.popular
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl"
                            : plan.name === "Team"
                              ? "bg-slate-900 hover:bg-slate-800 text-white"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                        } transition-all duration-200`}
                      >
                        {plan.cta}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Enterprise CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-16 text-center"
            >
              <p className="text-slate-600 mb-4">Need a custom solution for your organization?</p>
              <Button variant="outline" size="lg">
                Contact Enterprise Sales
              </Button>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-4" style={{ fontFamily: "Inter Tight, sans-serif" }}>
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-slate-600">Everything you need to know about our pricing</p>
            </motion.div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-slate-50 rounded-xl p-6"
                >
                  <h3 className="font-semibold text-slate-900 mb-3">{faq.question}</h3>
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-3xl p-12 text-center"
            >
              <h2 className="text-3xl font-bold text-white mb-6" style={{ fontFamily: "Inter Tight, sans-serif" }}>
                Ready to transform your conversations?
              </h2>
              <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who've improved their emotional intelligence with EQteacher.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-slate-50 shadow-xl hover:shadow-2xl">
                  Start Free Trial
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  Schedule Demo
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
