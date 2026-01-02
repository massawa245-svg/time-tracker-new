/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // IGNORE ALL ERRORS DURING BUILD
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Webpack Aliases für @/
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
      '@lib': require('path').resolve(__dirname, 'src/lib'),
      '@models': require('path').resolve(__dirname, 'src/models'),
      '@contexts': require('path').resolve(__dirname, 'src/contexts'),
      '@components': require('path').resolve(__dirname, 'src/components'),
    };
    return config;
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Static optimization
  images: {
    unoptimized: true,
  }
}

module.exports = nextConfig
