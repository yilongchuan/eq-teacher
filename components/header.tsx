"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronDown, Globe } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { UserMenu } from "@/components/user/user-menu"

export function Header() {
  const [isScrolled, setIsIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md border-b border-slate-200/50" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">EQ</span>
            </div>
            <span className="font-bold text-slate-900 text-lg">EQteacher</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-slate-700 hover:text-indigo-600 transition-colors">
            功能
          </a>
          <a href="#faq" className="text-slate-700 hover:text-indigo-600 transition-colors">
            常见问题
          </a>
          <Link href="/app/play" className="text-slate-700 hover:text-indigo-600 transition-colors">
            开始练习
          </Link>
          {/* <Link href="/history" className="text-slate-700 hover:text-indigo-600 transition-colors">
            历史记录
          </Link> */}
        </nav>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* User Menu */}
          <UserMenu />
        </div>
      </div>
    </motion.header>
  )
}
