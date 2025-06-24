"use client"

import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "How does the AI grade me?",
    answer:
      "Our AI uses Claude-powered natural language processing to analyze your responses across multiple dimensions including empathy, clarity, assertiveness, and emotional intelligence. The scoring is based on established psychological frameworks and communication best practices.",
  },
  {
    question: "Is my data private?",
    answer:
      "Yes, your privacy is our top priority. All conversations are encrypted, never shared with third parties, and you can delete your data at any time. We comply with GDPR, CCPA, and other major privacy regulations.",
  },
  {
    question: "Do you support other languages?",
    answer:
      "Currently we support English and Spanish, with more languages coming soon. Our AI can understand context and cultural nuances in both languages to provide accurate feedback.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: "Inter Tight, sans-serif" }}>
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-slate-600">Everything you need to know about EQteacher</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-xl border border-slate-200 px-6"
              >
                <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-indigo-600 transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
