/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Standalone output — Vercel deploys only .next/standalone + .next/static
  // plus the public/ directory. node_modules is never shipped.
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"]
  },
  async headers() {
    return [
      {
        // Static assets get long-lived caching headers.
        source: "/icons/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" }
        ]
      },
      {
        source: "/og.svg",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" }
        ]
      }
    ];
  }
};

export default nextConfig;
