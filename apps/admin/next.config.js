/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@coc/ui'],
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  experimental: {},
};

module.exports = nextConfig;
