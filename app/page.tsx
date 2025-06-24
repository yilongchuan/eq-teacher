"use client"

import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { CTABanner } from "@/components/cta-banner"
// import { Pricing } from "@/components/pricing"
import { FAQ } from "@/components/faq"
import { Footer } from "@/components/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main>
        <Hero />
        <Features />
        <CTABanner />
        {/* <Pricing /> */}
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
