"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface HeroSectionProps {
  title: string
  subtitle?: string
  children?: ReactNode
  backgroundImage?: string
  backgroundImageMobile?: string
  overlay?: "light" | "dark" | "gradient" | "none"
  height?: "sm" | "md" | "lg" | "xl" | "full"
  className?: string
  contentClassName?: string
  parallax?: boolean
  animated?: boolean
}

const heightClasses = {
  sm: "min-h-[300px]",
  md: "min-h-[400px]",
  lg: "min-h-[500px]",
  xl: "min-h-[600px]",
  full: "min-h-screen",
}

const overlayClasses = {
  light: "bg-white/20",
  dark: "bg-black/40",
  gradient: "bg-gradient-to-b from-black/20 via-black/30 to-black/50",
  none: "",
}

export function HeroSection({
  title,
  subtitle,
  children,
  backgroundImage,
  backgroundImageMobile,
  overlay = "dark",
  height = "md",
  className,
  contentClassName,
  parallax = false,
  animated = true,
}: HeroSectionProps) {
  const hasBackground = backgroundImage || backgroundImageMobile

  return (
    <header
      className={cn("relative overflow-hidden flex items-center justify-center", heightClasses[height], className)}
    >
      {/* Background Layer */}
      {hasBackground ? (
        <>
          {/* Desktop Background */}
          {backgroundImage && (
            <div
              className={cn(
                "absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700",
                parallax && "transform-gpu will-change-transform",
                animated && "animate-fade-in",
                "hidden md:block",
              )}
              style={{
                backgroundImage: `url(${backgroundImage})`,
                transform: parallax ? "scale(1.1)" : undefined,
              }}
            />
          )}

          {/* Mobile Background */}
          {backgroundImageMobile && (
            <div
              className={cn(
                "absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700",
                animated && "animate-fade-in",
                "block md:hidden",
              )}
              style={{
                backgroundImage: `url(${backgroundImageMobile})`,
              }}
            />
          )}

          {/* Fallback to desktop image on mobile if no mobile image provided */}
          {!backgroundImageMobile && backgroundImage && (
            <div
              className={cn(
                "absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700",
                animated && "animate-fade-in",
                "block md:hidden",
              )}
              style={{
                backgroundImage: `url(${backgroundImage})`,
              }}
            />
          )}

          {/* Overlay */}
          {overlay !== "none" && <div className={cn("absolute inset-0", overlayClasses[overlay])} />}
        </>
      ) : (
        /* Default gradient background when no image */
        <div className="absolute inset-0 gradient-animated" />
      )}

      {/* Content Layer */}
      <div
        className={cn(
          "relative z-10 max-w-4xl mx-auto text-center px-4 py-16",
          animated && "animate-slide-up",
          contentClassName,
        )}
      >
        <h1
          className={cn(
            "text-4xl md:text-6xl font-bold mb-4 text-balance",
            hasBackground ? "text-white drop-shadow-lg" : "text-white",
          )}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className={cn(
              "text-xl md:text-2xl mb-8 text-pretty",
              hasBackground ? "text-white/90 drop-shadow-md" : "text-white/90",
            )}
          >
            {subtitle}
          </p>
        )}

        {children}
      </div>

      {/* Decorative Elements */}
      {animated && (
        <>
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float" />
          <div
            className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-float"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full blur-lg animate-float"
            style={{ animationDelay: "4s" }}
          />
        </>
      )}
    </header>
  )
}
