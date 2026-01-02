/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // IGNORE ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // IGNORE TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Für bessere Performance (Next.js 15)
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Static Export für Vercel
  output: 'standalone',
  
  // Images
  images: {
    unoptimized: true, // Für einfacheres Hosting
  }
}

module.exports = nextConfig
