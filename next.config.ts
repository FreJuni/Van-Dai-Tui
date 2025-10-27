import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbopackPersistentCaching: false,
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDER_EMAIL: process.env.SENDER_EMAIL
  },
  images: {
    domains: ['utfs.io']
  }
};

export default nextConfig;
