import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project (a stray lockfile exists in the
  // home directory, which would otherwise confuse root inference).
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
