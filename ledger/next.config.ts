import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Lets your phone load the dev server over your Wi-Fi (http://<your-computer-ip>:3000)
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.16.*.*"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
