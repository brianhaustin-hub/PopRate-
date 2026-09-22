/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['picsum.photos', 'via.placeholder.com'],
  },
};
module.exports = nextConfig;
