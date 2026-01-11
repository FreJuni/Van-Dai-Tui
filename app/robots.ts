import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.BASE_URL || 'https://vandaitui.com'; // Fallback if env not set
  const locales = ['en', 'mm'];

  // Paths to hide from search engines
  const protectedPaths = ['/dashboard', '/profile', '/account'];

  // Generate locale-prefixed paths (e.g. /en/dashboard)
  const disallowedPaths = [
    ...protectedPaths, // Root paths (just in case)
    ...locales.flatMap((locale) =>
      protectedPaths.map((path) => `/${locale}${path}`)
    ),
  ];

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: disallowedPaths,
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
