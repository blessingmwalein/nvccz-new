/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...existing config...
  reactStrictMode: false, // Disable strict mode to prevent double mounting in dev
}

module.exports = nextConfig
