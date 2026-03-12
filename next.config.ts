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
        hostname: "gogari.quantumbytetech.com",
      },
      {
        protocol: "https",
        hostname: "s3.eu-central-003.backblazeb2.com",
      },
    ],
  },
};

export default nextConfig;
