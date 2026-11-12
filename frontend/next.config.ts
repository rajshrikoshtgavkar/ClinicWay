import type { NextConfig } from "next";

const isExport = process.env.NEXT_EXPORT === "true";

const nextConfig: NextConfig = {
  reactCompiler: true,

  ...(isExport && { output: "export" }),

  images: {
    ...(isExport && { unoptimized: true }),
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "cdn-icons-png.flaticon.com" },
    ],
  },

  // Only used by `npm run dev` locally. In production, Nginx does this job.
  ...(!isExport && {
    async rewrites() {
      return [
        {
          source: "/spring-server/:path*",
          destination: "http://localhost:8080/:path*",
        },
      ];
    },
  }),
};

export default nextConfig;