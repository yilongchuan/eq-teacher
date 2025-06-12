"use client"

import { motion } from "framer-motion"
import { Shield, Lock, Eye, Database, UserCheck, Globe } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const sections = [
  {
    icon: Database,
    title: "Information We Collect",
    content: [
      "Account information (email, name, preferences)",
      "Practice session data and conversation transcripts",
      "Performance scores and analytics",
      "Usage patterns and feature interactions",
      "Device information and technical logs",
    ],
  },
  {
    icon: Lock,
    title: "How We Use Your Information",
    content: [
      "Provide personalized EQ training and feedback",
      "Generate performance analytics and insights",
      "Improve our AI models and user experience",
      "Send important updates and notifications",
      "Ensure platform security and prevent abuse",
    ],
  },
  {
    icon: Shield,
    title: "Data Protection",
    content: [
      "End-to-end encryption for all conversations",
      "SOC 2 Type II certified infrastructure",
      "Regular security audits and penetration testing",
      "GDPR and CCPA compliant data handling",
      "Secure data centers with 99.9% uptime",
    ],
  },
  {
    icon: Eye,
    title: "Your Privacy Rights",
    content: [
      "Access and download your personal data",
      "Request correction of inaccurate information",
      "Delete your account and all associated data",
      "Opt-out of non-essential communications",
      "Control data sharing preferences",
    ],
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-6 mb-16"
            >
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-indigo-600" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900" style={{ fontFamily: "Inter Tight, sans-serif" }}>
                Privacy Policy
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Your privacy is fundamental to everything we do. This policy explains how we collect, use, and protect
                your personal information.
              </p>
              <div className="text-sm text-slate-500">Last updated: January 15, 2025</div>
            </motion.div>

            {/* Key Principles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid md:grid-cols-3 gap-6 mb-16"
            >
              <Card className="text-center">
                <CardContent className="pt-6">
                  <UserCheck className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-slate-900 mb-2">Transparency First</h3>
                  <p className="text-sm text-slate-600">We're clear about what data we collect and why</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Lock className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-slate-900 mb-2">Security by Design</h3>
                  <p className="text-sm text-slate-600">Your data is encrypted and protected at every level</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Globe className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-slate-900 mb-2">Your Control</h3>
                  <p className="text-sm text-slate-600">You own your data and can manage it anytime</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Detailed Sections */}
            <div className="space-y-8">
              {sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <section.icon className="w-6 h-6 text-indigo-600 mr-3" />
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {section.content.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start">
                            <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-slate-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-16 text-center"
            >
              <Card className="bg-indigo-50 border-indigo-200">
                <CardContent className="pt-8 pb-8">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Questions About Your Privacy?</h3>
                  <p className="text-slate-600 mb-6">
                    Our privacy team is here to help. Contact us anytime with questions or concerns.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="mailto:privacy@eqteacher.com"
                      className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Email Privacy Team
                    </a>
                    <a
                      href="/contact"
                      className="inline-flex items-center justify-center px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                      Contact Support
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
