/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { externalDir: true },
  poweredByHeader: false,
  compress: true,
};
module.exports = nextConfig;
