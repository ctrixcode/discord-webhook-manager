import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['imgs.search.brave.com', 'res.cloudinary.com'],
    remotePatterns: [
      {protocol: "https", hostname:"**"}
    ]

  },
  /* config options here */
};

export default nextConfig;
