import type { NextConfig } from "next";
import { env } from "./src/lib/env";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  env: env(),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
