"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// 暂时隐藏定价页面 - 重定向到主页
export default function PricingPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/')
  }, [router])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">正在跳转...</h1>
        <p className="text-slate-600">正在重定向到主页</p>
      </div>
    </div>
  )
} 