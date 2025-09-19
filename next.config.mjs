/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enforce type-checking and linting during builds to catch issues early
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    // Use Next.js image optimization
    unoptimized: false,
  },
}

export default nextConfig
