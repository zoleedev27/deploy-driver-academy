import type { NextConfig } from "next";
import { i18n } from "./next-i18next.config.js";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  i18n: i18n,
  images: {
    domains: ["backend-spring2025.web-staging.eu"],
  },
};

export default nextConfig;
