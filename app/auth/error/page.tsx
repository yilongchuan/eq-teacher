'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AuthErrorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string>('认证过程中发生错误')

  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      switch (error) {
        case 'OAuthSignin':
          setErrorMessage('OAuth登录过程中发生错误')
          break
        case 'OAuthCallback':
          setErrorMessage('OAuth回调过程中发生错误')
          break
        case 'OAuthAccountNotLinked':
          setErrorMessage('此邮箱已通过其他方式注册，请使用原始登录方式')
          break
        case 'EmailSignin':
          setErrorMessage('邮箱登录过程中发生错误')
          break
        case 'CredentialsSignin':
          setErrorMessage('登录凭据无效')
          break
        case 'SessionRequired':
          setErrorMessage('此页面需要登录才能访问')
          break
        default:
          setErrorMessage('认证过程中发生未知错误')
      }
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md text-center">
        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h2 className="mt-6 text-2xl font-bold text-gray-900">认证错误</h2>
        
        <p className="mt-2 text-sm text-gray-600">
          {errorMessage}
        </p>
        
        <div className="mt-6 space-y-4">
          <Button
            className="w-full"
            onClick={() => router.push('/auth/login')}
          >
            返回登录
          </Button>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push('/')}
          >
            返回首页
          </Button>
          
          <div className="text-xs text-gray-500 mt-4">
            如需帮助，请<Link href="/contact" className="text-blue-600 hover:underline">联系客服</Link>
          </div>
        </div>
      </div>
    </div>
  )
} 