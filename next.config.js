/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  compiler: {
    styledComponents: true,
  },
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['@sanity/client', '@portabletext/react', 'sanity'],
    optimizeCss: true,
  },
  // Enable static generation where possible
  output: 'standalone',
  // Compress output
  compress: true,
  // Optimize production builds
  swcMinify: true,
  // Reduce JavaScript bundle
  reactStrictMode: true,
  // Aggressive prefetching for instant navigation
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig
