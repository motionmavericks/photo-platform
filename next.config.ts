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
      {
        protocol: 'https',
        hostname: 'rthnpitxydzbjssrqbpz.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  webpack: (config) => {
    config.snapshot = {
      ...config.snapshot,
      // Don't snapshot these directories to avoid platform-specific module warnings
      managedPaths: [
        /^(.+?[\\/]node_modules[\\/](?!@next|@img|sharp))/, // Exclude @next, @img, and sharp from snapshotting
      ],
    }
    return config
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
