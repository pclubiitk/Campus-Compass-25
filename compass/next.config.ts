import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    // domains: ["th.bing.com", "www.iitk.ac.in"],
    domains: ['i0.wp.com', 'images.ctfassets.net', 'encrypted-tbn0.gstatic.com','placehold.co', 'www.iitk.ac.in',
      'iitk.ac.in',"th.bing.com", ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        
      },
    ],
  },
};

export default nextConfig;
