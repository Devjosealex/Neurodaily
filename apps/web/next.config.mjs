/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@neurodaily/shared'],
  experimental: {
    typedRoutes: false,
  },
};

export default nextConfig;
