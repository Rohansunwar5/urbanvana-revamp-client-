import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    deviceSizes: [375, 640, 768, 1024, 1280, 1536],
    imageSizes: [64, 128, 256, 384],
  },

  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  /* Native Node.js modules — must run in Node.js runtime, not edge */
  serverExternalPackages: ["mongoose", "bcrypt", "aws-sdk", "winston", "winston-cloudwatch"],

  /* Compress responses */
  compress: true,

  /* Security & CORS headers */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.CORS_ORIGINS ?? "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PATCH,PUT,DELETE,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Authorization, Content-Type, x-session-id",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
