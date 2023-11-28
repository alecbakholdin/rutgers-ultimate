/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "standalone",
  images: {
    domains: ["bakholdin.com"],
  },
};

module.exports = nextConfig;
