"use client"

import { motion } from "framer-motion"
import { Wand2, Gauge, PanelsTopLeft } from "lucide-react"

const features = [
  {
    icon: Wand2,
    title: "Dynamic Scenarios",
    description: "From salary talks to small talk—generate tailor-made scripts in a tap.",
  },
  {
    icon: Gauge,
    title: "Real-Time Scoring",
    description: "Claude-powered rubric grades empathy, clarity, assertiveness within 10s.",
  },
  {
    icon: PanelsTopLeft,
    title: "Shareable Comics",
    description: "Turn your best moves into four-panel comics and flex on LinkedIn or IG.",
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
            Everything you need to level up your EQ
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Practice real conversations with AI that understands context, emotion, and social dynamics.
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
