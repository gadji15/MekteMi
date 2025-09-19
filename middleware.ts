import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

// Protect server-side access to /admin and /dashboard using a simple cookie check.
// NOTE: For real security, prefer HttpOnly cookies set by your Laravel backend (Sanctum/JWT)
// and validate sessions/tokens server-side.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only guard protected areas
  const isProtected = pathname.startsWith("/admin") || pathname.startsWith("/dashboard")
  if (!isProtected) return NextResponse.next()

  // Look for an auth-token cookie (set on login by the frontend for now)
  const tokenCookie = req.cookies.get("auth-token")

  if (!tokenCookie) {
    const loginUrl = new URL("/auth/login", req.url)
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
}