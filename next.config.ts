import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbopackPersistentCaching: false,
  },
  env: {
    ADMIN_PHONE_NUMBER: process.env.ADMIN_PHONE_NUMBER,
    ADMIN_PHONE_NUMBER_FOR_FORMAT: process.env.ADMIN_PHONE_NUMBER_FOR_FORMAT,
    BASE_URL: process.env.BASE_URL,
    SEARCH_GOOGLE_CONSOLE: process.env.SEARCH_GOOGLE_CONSOLE,
  },
  images: {
    domains: ['utfs.io'],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
