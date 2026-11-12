import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  reactCompiler: true,
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "cdn-icons-png.flaticon.com" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/spring-server/:path*",
        destination: "http://localhost:8080/:path*",
      },
    ];
  },
};

export default nextConfig;



// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   output: "standalone",

//   reactCompiler: true,

//   images: {
//     remotePatterns: [
//       { hostname: "images.unsplash.com" },
//       { hostname: "cdn-icons-png.flaticon.com" },
//     ],
//   },

//   async rewrites() {
//     return [
//       {
//         source: "/spring-server/:path*",
//         destination: "http://localhost:8080/:path*",
//       },
//     ];
//   },
// };

// export default nextConfig;
