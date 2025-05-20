import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true, 
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "80",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "adome.codewithjoe.in", // ✅ Add this
        pathname: "/media/**",
      },
    ],
  },
  experimental: {},
};

export default nextConfig;
