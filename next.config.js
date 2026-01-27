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
  // Use webpack explicitly (Turbopack doesn't support custom webpack config yet)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ensure client chunks are properly generated
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Studio chunks
            studio: {
              name: 'studio',
              test: /[\\/]node_modules[\\/](sanity|@sanity)[\\/]/,
              priority: 20,
            },
            // Framework chunks
            framework: {
              name: 'framework',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
              priority: 10,
            },
          },
        },
      }
    }
    return config
  },
  // Reduce JavaScript bundle
  reactStrictMode: true,
  // Aggressive prefetching for instant navigation
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig
