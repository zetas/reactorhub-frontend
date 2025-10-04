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
  // Cache control headers
  async headers() {
    return [
      {
        // Cache static assets aggressively (they have hashed filenames)
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Don't cache HTML pages - always revalidate
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },
  // Generate unique build ID for cache busting
  generateBuildId: async () => {
    // Use timestamp to ensure new build ID on each deploy
    return `build-${Date.now()}`;
  },
};

module.exports = nextConfig;