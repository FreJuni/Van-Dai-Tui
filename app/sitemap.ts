import { db } from '@/server';
import { products } from '@/server/schema';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.BASE_URL || 'https://vandaitui.com'; // Fallback if env not set
  const locales = ['en', 'mm'];

  // 1. Define your static routes (without locale)
  const staticRoutes = [
    '', // home page
    '/about',
    '/services',
    '/contact',
    '/privacy',
    '/warranty-policy',
    '/how-it-works',
    '/terms',
  ];

  // 2. Fetch dynamic data (Products) from DB
  // We only need the ID and maybe updatedAt if you track it
  const allProducts = await db
    .select({
      id: products.id,
      updatedAt: products.createdAt, // Using createdAt as update time if no updatedAt
    })
    .from(products);

  // 3. Generate sitemap entries
  const entries: MetadataRoute.Sitemap = [];

  // A. Static Pages for each Key Locale
  staticRoutes.forEach((route) => {
    locales.forEach((locale) => {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'white' === route ? 'daily' : 'monthly', // Example logic
        priority: route === '' ? 1 : 0.8,
      });
    });
  });

  // B. Dynamic Product Pages for each Key Locale
  allProducts.forEach((product) => {
    locales.forEach((locale) => {
      entries.push({
        url: `${baseUrl}/${locale}/listing-page/${product.id}`,
        lastModified: product.updatedAt || new Date(),
        changeFrequency: 'weekly',
        priority: 0.9, // High priority for products
      });
    });
  });

  return entries;
}
