import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

// We no longer rely on a non-HttpOnly cookie for SSR protection.
// Auth is enforced client-side (AdminLayout) and by the Laravel backend.
export function middleware(_req: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
}