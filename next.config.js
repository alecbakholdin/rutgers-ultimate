/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["bakholdin.com"],
  },
  experimental: { appDir: true },
};

module.exports = nextConfig;
