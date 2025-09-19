// Simple auth gate using a non-HttpOnly cookie set on login.
// NOTE: Replace with real backend-issued HttpOnly cookies when integrating Laravel.

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get("auth-token")?.value

  const isProtected = pathname.startsWith("/admin") || pathname === "/dashboard"
  const isAuthPage = pathname.startsWith("/auth")

  // If route is protected and no token, redirect to login
  if (isProtected && !token) {
    const url = req.nextUrl.clone()
    url.pathname = "/auth/login"
    url.searchParams.set("from", pathname)
    return NextResponse.redirect(url)
  }

  // If already authenticated and visiting auth pages, redirect to dashboard
  if (isAuthPage && token) {
    const url = req.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard", "/auth/:path*"],
}