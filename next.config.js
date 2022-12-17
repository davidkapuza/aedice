/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['avatars.dicebear.com', 'lh3.googleusercontent.com'],
  },
  experimental: {
    appDir: true,
    esmExternals: false,
    fontLoaders: [
      { loader: '@next/font/google', options: { subsets: ['latin'] } },
    ],
  },
  webpack: (config) => {
    config.experiments = { ...config.experiments, ...{ topLevelAwait: true }};
    return config;
  },
}
