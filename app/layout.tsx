import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EQteacher - 情商对话训练',
  description: '通过AI角色扮演练习情商沟通技巧。职场反馈、社交破冰、家庭对话等多种场景。',
  generator: 'Next.js',
  icons: {
    icon: '/eqgenerate.png',
    shortcut: '/eqgenerate.png',
    apple: '/eqgenerate.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
