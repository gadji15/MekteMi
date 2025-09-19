"use client"

import type React from "react"
import { Suspense } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { usePathname } from "next/navigation"

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith("/admin")

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

export default LayoutContent
