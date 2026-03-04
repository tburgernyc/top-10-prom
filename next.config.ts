import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Turbopack (stable in Next 16) ──────────────────────────────────────────
  turbopack: {},

  // ── Image optimisation ─────────────────────────────────────────────────────
  images: {
    // Serve AVIF first, then WebP — maximum bandwidth savings on edge
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Supabase Storage (hosted + local dev)
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "54321",
        pathname: "/storage/v1/object/public/**",
      },
      // Placeholder/CDN images during development
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // ── Security headers ───────────────────────────────────────────────────────
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
    ];
  },

  // ── Compiler options ───────────────────────────────────────────────────────
  compiler: {
    // Remove console.log in production, keep warn/error
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["warn", "error"] }
      : false,
  },
};

export default nextConfig;
