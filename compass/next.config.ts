import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  

  images: {
    domains: ["th.bing.com", "www.iitk.ac.in"],
  },
};


const withPWA = require('next-pwa')({
  dest: 'public',       
  register: true,     
  skipWaiting: true     
})

module.exports = withPWA({
  reactStrictMode: true,
})

export default nextConfig;
