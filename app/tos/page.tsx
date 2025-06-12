"use client"

import { motion } from "framer-motion"
import { FileText, Scale, AlertTriangle, Users, Gavel, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const sections = [
  {
    icon: Users,
    title: "Acceptance of Terms",
    content: [
      "By accessing EQteacher, you agree to be bound by these Terms of Service",
      "You must be at least 13 years old to use our service",
      "If you're under 18, you need parental consent to create an account",
      "These terms may be updated periodically with notice to users",
    ],
  },
  {
    icon: Shield,
    title: "Permitted Use",
    content: [
      "Use EQteacher for personal or professional development purposes",
      "Practice conversations in a respectful and constructive manner",
      "Respect the intellectual property rights of EQteacher and others",
      "Do not attempt to reverse engineer or copy our AI technology",
      "Report any bugs or security vulnerabilities responsibly",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Prohibited Activities",
    content: [
      "Using the service for illegal, harmful, or abusive purposes",
      "Attempting to hack, disrupt, or compromise system security",
      "Sharing inappropriate, offensive, or discriminatory content",
      "Creating multiple accounts to circumvent usage limits",
      "Reselling or redistributing access to the service",
    ],
  },
  {
    icon: Gavel,
    title: "Limitation of Liability",
    content: [
      "EQteacher is provided 'as is' without warranties of any kind",
      "We are not liable for any indirect, incidental, or consequential damages",
      "Our total liability is limited to the amount you paid in the last 12 months",
      "You use the service at your own risk and discretion",
      "We do not guarantee specific outcomes from using our training",
    ],
  },
]

export default function TermsPage() {
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
                <Scale className="w-8 h-8 text-indigo-600" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900" style={{ fontFamily: "Inter Tight, sans-serif" }}>
                Terms of Service
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                These terms govern your use of EQteacher and outline the rights and responsibilities of all users.
              </p>
              <div className="text-sm text-slate-500">Last updated: January 15, 2025</div>
            </motion.div>

            {/* Important Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              <Alert className="border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  <strong>Important:</strong> By using EQteacher, you acknowledge that our AI training is for
                  educational purposes only and does not replace professional counseling, therapy, or medical advice.
                </AlertDescription>
              </Alert>
            </motion.div>

            {/* Terms Sections */}
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

            {/* Additional Terms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12 space-y-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-6 h-6 text-indigo-600 mr-3" />
                    Account Termination
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-700">
                    You may terminate your account at any time by contacting support or using the account deletion
                    feature. Upon termination:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-slate-700">Your access to the service will be immediately revoked</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-slate-700">
                        Your data will be deleted within 30 days as per our Privacy Policy
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-slate-700">No refunds will be provided for unused subscription time</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Governing Law</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700">
                    These Terms of Service are governed by the laws of the State of New York, United States. Any
                    disputes will be resolved through binding arbitration in New York, NY.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-16 text-center"
            >
              <Card className="bg-indigo-50 border-indigo-200">
                <CardContent className="pt-8 pb-8">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Questions About These Terms?</h3>
                  <p className="text-slate-600 mb-6">
                    Our legal team is available to clarify any questions about these terms of service.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="mailto:legal@eqteacher.com"
                      className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Contact Legal Team
                    </a>
                    <a
                      href="/contact"
                      className="inline-flex items-center justify-center px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                      General Support
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
