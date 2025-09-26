/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // Avoid route segment name collision: map legacy "/app" URLs to new "/dashboard"
      { source: '/app/:path*', destination: '/dashboard/:path*' },
    ];
  },
};

module.exports = nextConfig;
