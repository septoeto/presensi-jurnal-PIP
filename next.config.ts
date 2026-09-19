import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname, // Menegaskan bahwa root proyek ada di folder ini
  },
};

export default function config() {
  return nextConfig;
}