/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'], // ✅ Add Cloudinary domain here
  },
};

module.exports = nextConfig;
