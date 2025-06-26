"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function CTABanner() {
  const router = useRouter()

  const handleStartPractice = () => {
    router.push('/app/play')
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-3xl p-12 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-white mb-6" style={{ fontFamily: "Inter Tight, sans-serif" }}>
            准备好提升你的情商了吗？
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            通过AI驱动的对话练习，掌握关键沟通技巧。完全免费开始你的情商训练之旅。
          </p>
          <Button
            size="lg"
            className="bg-white text-indigo-600 hover:bg-slate-50 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 px-8 py-4 text-lg font-semibold"
            onClick={handleStartPractice}
          >
            开始免费练习
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
