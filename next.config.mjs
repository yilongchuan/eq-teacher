/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 在构建时忽略ESLint错误，避免因lint错误导致部署失败
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 在构建时忽略TypeScript错误，避免因类型错误导致部署失败
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // 启用App Router的稳定功能
    appDir: true,
  },
}

export default nextConfig
