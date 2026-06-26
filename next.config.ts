import type { NextConfig } from "next";

const API_URL = process.env.API_URL ?? "http://localhost:3333";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [
        {
          source: "/api/:path*",
          destination: `${API_URL}/:path*`,
        },
        {
          source: "/uploads/:path*",
          destination: `${API_URL}/uploads/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
