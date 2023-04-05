/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  output: "standalone",
  images: {
    domains: ["bakholdin.com"],
  },
  experimental: { appDir: true },
};

module.exports = nextConfig;
