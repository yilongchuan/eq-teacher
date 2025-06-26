"use client"

import { motion } from "framer-motion"
import { Wand2, Gauge, PanelsTopLeft } from "lucide-react"

const features = [
  {
    icon: Wand2,
    title: "动态场景生成",
    description: "从薪资谈判到日常闲聊——一键生成量身定制的对话剧本。",
  },
  {
    icon: Gauge,
    title: "AI实时评分",
    description: "使用ChatGPT先进模型，在10秒内从同理心、清晰度、自信等维度评估你的表现。",
  },
  {
    icon: PanelsTopLeft,
    title: "对话分析报告", 
    description: "获得详细的表现分析和改进建议，帮你持续提升沟通技巧。",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: "Inter Tight, sans-serif" }}>
            提升情商沟通的完整工具
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            通过AI驱动的角色扮演，在真实情境中练习沟通技巧。理解语境、情绪和社交动态。
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-200 transition-colors">
                <feature.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3" style={{ fontFamily: "Inter Tight, sans-serif" }}>
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
