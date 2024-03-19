/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["mongoose"],
  },
  images: {
    domains: ['lh3.googleusercontent.com','res.cloudinary.com'],
    
  },
  webpack(config) {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    }
    return config
  },
   reactStrictMode: true,
  env: {
    BASE_URL: process.env.NEXT_PUBLIC_CLOUDINARY_URL,
  },
}

module.exports = nextConfig