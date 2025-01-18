import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.html$/, // Match .html files
      use: "raw-loader", // Use raw-loader to import as a string
    });

    return config;
  },
};

export default nextConfig;
