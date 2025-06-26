"use client"
import { Heart, Twitter, Linkedin, Github, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const footerLinks = {
  产品: ["功能特性", /* "价格", */ "API", "更新日志"],
  资源: ["博客", "文档", "帮助中心", "社区"],
  法律: ["隐私政策", "服务条款", "Cookie政策", "GDPR"],
  社交: ["Twitter", "LinkedIn", "GitHub", "Discord"],
}

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-16 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">EQ</span>
              </div>
              <span className="font-bold text-white text-lg">EQteacher</span>
            </div>
            <p className="text-slate-400 max-w-md">
              通过AI驱动的情商训练，掌握关键对话技巧。随时随地练习沟通技能。
            </p>

            {/* Newsletter */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white">保持更新</h4>
              <div className="flex space-x-2">
                <Input
                  placeholder="输入你的邮箱"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-400 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-1 text-slate-400">
            <span>© 2025 EQteacher. 用</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>制作于北京</span>
          </div>

          <div className="flex items-center space-x-4">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
