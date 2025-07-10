/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "www.iitk.ac.in",
      "images.unsplash.com",
      "i.imgur.com",
      "lh3.googleusercontent.com"
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8081',
        pathname: '/uploads/reviews/**',
      },
    ],
  },
};

module.exports = nextConfig;
