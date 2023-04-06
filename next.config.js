/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "standalone",
  images: {
    domains: ["bakholdin.com"],
  },
  experimental: { appDir: true },
};

module.exports = nextConfig;
