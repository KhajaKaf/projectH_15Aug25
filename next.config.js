/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for dev safety (double-invokes side effects in dev to catch issues)
  reactStrictMode: true,

  // Lock image domains
  images: {
    domains: ["images.unsplash.com", "res.cloudinary.com"],
  },

  // Security headers (basic, non-CSP)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },

  // Keep this commented until you explicitly adopt it
  // experimental: { serverActions: true },
};

module.exports = nextConfig;