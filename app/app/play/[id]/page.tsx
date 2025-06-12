"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Mic, MicOff, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

export default function PlayRoomPage({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showEndDialog, setShowEndDialog] = useState(false)
  const [timer, setTimer] = useState(0)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [turn, setTurn] = useState(0)
  const [status, setStatus] = useState<'active'|'grading'|'completed'|'idle'>('idle')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Auto-focus textarea
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  // 首次加载，拉取场景信息，生成开场白
  useEffect(() => {
    if (!sessionId && messages.length === 0) {
      // 拉取场景信息
      fetch(`/api/generate-scenario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: 'workplace', difficulty: 1 })
      })
        .then(res => res.json())
        .then(data => {
          setMessages([
            {
              id: 'sys',
              content: data.system_prompt || 'Welcome! Please start the conversation.',
              sender: 'ai',
              timestamp: new Date(),
            },
          ])
        })
    }
  }, [sessionId, messages.length])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)
    try {
      let res
      if (!sessionId) {
        // 首次对话，创建session
        res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scenarioId: params.id, message: inputValue })
        })
      } else {
        // 继续对话
        res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, message: inputValue })
        })
      }
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setSessionId(data.sessionId)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + '_ai',
          content: data.reply,
          sender: 'ai',
          timestamp: new Date(),
        },
      ])
      setTurn(data.turn || (turn + 1))
      setStatus(data.status || 'active')
      setIsTyping(false)
      setTimer(0)
      // 3轮后自动跳转结果页
      if (data.status === 'grading' || data.status === 'completed') {
        setTimeout(() => {
          router.push(`/app/result/${data.sessionId}`)
        }, 1200)
      }
    } catch (e) {
      setIsTyping(false)
      alert('对话出错，请重试')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleEndSession = () => {
    if (sessionId) {
      router.push(`/app/result/${sessionId}`)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold text-slate-900">Performance Review Practice</h1>
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Active Session</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-slate-100 px-3 py-1 rounded-full text-sm font-medium text-slate-700">
            {formatTime(timer)}
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowHistory(true)}>
            <ArrowUp className="w-4 h-4 mr-2" />
            History
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowEndDialog(true)}>
            End Session
          </Button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[90%] p-4 rounded-2xl ${
                  message.sender === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-slate-900 border border-slate-200"
                }`}
              >
                <p className="leading-relaxed">{message.content}</p>
                <div className={`text-xs mt-2 ${message.sender === "user" ? "text-indigo-100" : "text-slate-500"}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-start"
            >
              <div className="bg-white border border-slate-200 p-4 rounded-2xl">
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-slate-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-6">
        <div className="flex items-end space-x-4">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your response... (Ctrl+Enter to send)"
              className="min-h-[60px] max-h-[120px] resize-none pr-12"
              rows={3}
            />
            <div className="absolute bottom-2 right-2 text-xs text-slate-400">Ctrl+Enter</div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsRecording(!isRecording)}
              className={isRecording ? "bg-red-50 border-red-200 text-red-600" : ""}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Conversation History</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === "user" ? "bg-indigo-100 text-indigo-900" : "bg-slate-100 text-slate-900"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* End Session Dialog */}
      <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>End Practice Session?</DialogTitle>
          </DialogHeader>
          <p className="text-slate-600">
            Are you sure you want to end this practice session? You'll receive your scores and feedback.
          </p>
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setShowEndDialog(false)}>
              Continue Practicing
            </Button>
            <Button onClick={handleEndSession} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              End & Get Results
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
