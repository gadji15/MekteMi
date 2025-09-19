"use client"

import type React from "react"
import { Suspense } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { usePathname } from "next/navigation"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith("/admin")

  // Don't render navbar and footer for admin routes
  if (isAdminRoute) {
    return <>{children}</>
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <Suspense fallback={null}>{children}</Suspense>
      </main>
      <Footer />
    </>
  )
}
