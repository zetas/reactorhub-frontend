/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable image optimization - external CDN images are already optimized
    domains: [
      'img.youtube.com',
      'i.ytimg.com',
      'i.vimeocdn.com',
      'c.patreon.com',
      'c10.patreonusercontent.com'
    ],
  },
  // Environment variables for API URL (don't hardcode domains)
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  },
  // Skip type checking and linting during production build (run in CI instead)
  // This reduces memory usage on servers with limited RAM
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;