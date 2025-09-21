"use client"

import { useEffect } from "react"

export default function PWARegister() {
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!("serviceWorker" in navigator)) return

    // In development, avoid registering a service worker to prevent caching issues (e.g., missing CSS).
    if (process.env.NODE_ENV !== "production") {
      // Best effort: unregister any existing SW from a previous prod build.
      navigator.serviceWorker.getRegistrations?.().then((regs) => {
        regs.forEach((r) => r.unregister().catch(() => {}))
      })
      return
    }

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          // updateViaCache: "none",
        })

        // Listen for updates and prompt user
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing
          if (!newWorker) return
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              console.info("Une nouvelle version de l'application est disponible. Actualisez pour mettre à jour.")
            }
          })
        })
      } catch (err) {
        console.warn("Service worker registration failed:", err)
      }
    }

    register()

    const interval = setInterval(async () => {
      try {
        const reg = await navigator.serviceWorker.getRegistration()
        await reg?.update()
      } catch {
        // ignore
      }
    }, 1000 * 60 * 30) // every 30 minutes

    return () => clearInterval(interval)
  }, [])

  return null
}