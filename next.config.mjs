/** @type {import('next').NextConfig} */
const nextConfig = {
  // Re-enable lint and type checking during builds
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    // Proxy API to avoid cross-site cookie issues in Vercel preview if needed.
    // Usage from the app: fetch("/api-proxy/...", { credentials: "include" })
    // It will forward to your backend configured by NEXT_PUBLIC_API_BASE_URL.
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost"
    return [
      {
        source: "/api-proxy/:path*",
        destination: `${apiBase}/:path*`,
      },
    ]
  },
}

export default nextConfig
