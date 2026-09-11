import type { NextConfig } from "next";

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const backendBase = rawApiUrl.replace(/\/api\/v1\/?$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three", "lucide-react"],
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendBase}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
