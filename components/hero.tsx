"use client"

import { motion } from "framer-motion"
import { Play, Award, Shield, ZoomIn, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function Hero() {
  const router = useRouter()
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)

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
                掌握关键对话技巧—
                <span className="text-indigo-600">随时随地练习。</span>
              </motion.h1>

              <motion.p
                className="text-xl text-slate-600 leading-relaxed max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                通过AI角色扮演练习情商沟通技巧。职场反馈、社交破冰、家庭对话等多种场景。三轮对话，实时评分反馈。
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
                开始免费练习
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
                <span>使用最新AI大模型驱动</span>
              </div>
              {/* <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Shield className="w-4 h-4 text-indigo-500" />
                <span>Stripe Verified Partner</span>
              </div> */}
            </motion.div>
          </motion.div>

          {/* Right Visual - Demo Screenshot */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl transform rotate-3 opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 via-indigo-500 to-purple-600 rounded-3xl transform -rotate-2 opacity-15"></div>
            
            {/* Main Container */}
            <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-2xl">
              {/* Example Label */}
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-white/90 backdrop-blur-sm text-indigo-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  界面示例
                </div>
              </div>

              {/* Click to Enlarge Hint */}
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-black/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-3 h-3" />
                  点击放大
                </div>
              </div>

              {/* Image Container */}
              <div 
                className="relative rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => setIsImageDialogOpen(true)}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 z-10 flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-80 transition-opacity duration-200" />
                </div>
                <Image
                  src="/demo-china.png"
                  alt="EQteacher 界面示例 - 情商对话训练"
                  width={600}
                  height={400}
                  className="w-full h-auto transform group-hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>

              {/* Bottom Info */}
              <div className="mt-4 text-center">
                <p className="text-white/80 text-sm">
                  真实的对话训练界面展示
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-lg font-semibold">界面示例预览</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6">
            <div className="relative rounded-lg overflow-hidden">
              <Image
                src="/demo-china.png"
                alt="EQteacher 界面示例 - 情商对话训练"
                width={1200}
                height={800}
                className="w-full h-auto"
                priority
              />
            </div>
            <p className="text-sm text-slate-600 mt-3 text-center">
              EQteacher 对话训练界面 - 支持多场景情商技能练习
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
