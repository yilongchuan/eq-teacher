"use client"

import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "AI是如何给我评分的？",
    answer:
      "我们的AI使用最新AI大模型，从同理心、清晰度、自信等多个维度分析你的回应。评分基于成熟的心理学框架和沟通最佳实践。",
  },
  {
    question: "我的数据隐私安全吗？",
    answer:
      "是的，隐私保护是我们的首要任务。所有对话都经过加密处理，从不与第三方共享，你可以随时删除自己的数据。我们遵循GDPR、CCPA等主要隐私法规。",
  },
  {
    question: "支持其他语言吗？",
    answer:
      "目前暂时支持中文，后面会扩展其他语言。我们的AI能够理解语境和文化差异，为不同语言用户提供准确的反馈。",
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
            常见问题
          </h2>
          <p className="text-xl text-slate-600">关于EQteacher你需要了解的一切</p>
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
