import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.magicpatterns.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "gogari.quantumbytetech.com",
      },
      {
        protocol: "https",
        hostname: "s3.gogaaribd.com",
      },
      {
        protocol: "https",
        hostname: "backend.gogaaribd.com",
      },
    ],
  },
};

export default nextConfig;
