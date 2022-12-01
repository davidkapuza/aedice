/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['avatars.dicebear.com', 'lh3.googleusercontent.com'],
  },
  experimental: {
    appDir: true,
    esmExternals: false,
  }
}
