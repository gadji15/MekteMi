"use client"

import type React from "react"
import { Suspense, useEffect } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { usePathname } from "next/navigation"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith("/admin")

  // Register the service worker for PWA capabilities
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) => {
          // Silently ignore registration errors to avoid breaking the app
          console.error("Service worker registration failed:", err)
        })
    }
  }, [])

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
} catch (e) {
          // no-op: optional logging
          console.error("Service worker registration failed:", e)
        }
      }
      register()
    }
  }, [])

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
