'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const router = useRouter()

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, displayName }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '注册失败')
      }

      if (data.message) {
        setSuccessMessage(data.message)
        
        // 如果注册成功（例如邮箱已存在的情况），自动重定向到登录页
        if (data.message === '邮箱已注册，请直接登录') {
          setTimeout(() => {
            router.push('/auth/login')
          }, 2000)
        } else {
          // 注册成功，但需要验证邮箱等情况
          setTimeout(() => {
            router.push('/auth/login')
          }, 3000)
        }
      }
    } catch (error) {
      console.error('注册错误:', error)
      setError(error instanceof Error ? error.message : '注册失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '登录失败')
      }

      // 重定向到OAuth提供商的登录页面
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('登录错误:', error)
      setError(error instanceof Error ? error.message : '登录失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">EQ</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">注册账户</h2>
          <p className="mt-2 text-sm text-gray-600">
            开始提升你的情商与沟通技巧
          </p>
        </div>

        <div className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2 py-5"
            onClick={() => handleOAuthLogin('google')}
            disabled={isLoading}
          >
            <FcGoogle className="w-5 h-5" />
            <span>使用Google账号注册</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2 py-5"
            onClick={() => handleOAuthLogin('github')}
            disabled={isLoading}
          >
            <FaGithub className="w-5 h-5" />
            <span>使用GitHub账号注册</span>
          </Button>

          {/* 邮箱注册暂时隐藏 */}
          {false && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">或使用邮箱注册</span>
                </div>
              </div>

              <form onSubmit={handleEmailRegister} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    邮箱地址
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                    显示名称
                  </label>
                  <Input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="您的昵称"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    密码
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="至少6位密码"
                    required
                    minLength={6}
                    className="mt-1"
                  />
                </div>

                {error && (
                  <div className="text-red-500 text-sm">
                    {error}
                  </div>
                )}

                {successMessage && (
                  <div className="text-green-500 text-sm">
                    {successMessage}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2"
                  disabled={isLoading}
                >
                  {isLoading ? '注册中...' : '注册'}
                </Button>
              </form>
            </>
          )}
        </div>

        {/* 登录链接暂时隐藏 */}
        {false && (
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              已有账号?{' '}
              <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-800">
                立即登录
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 