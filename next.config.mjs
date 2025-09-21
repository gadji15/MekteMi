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
}

export default nextConfig
