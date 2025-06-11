import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
   images: {
     domains: ['i0.wp.com', 'images.ctfassets.net', 'encrypted-tbn0.gstatic.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        
      },
    ],
  },
};

export default nextConfig;
