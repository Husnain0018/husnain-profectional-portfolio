import { MetadataRoute } from 'next';
import { getPortfolioData } from '@/lib/db';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const data = await getPortfolioData();
  const baseUrl = (
    data.seo.canonical_domain ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3000'
  ).replace(/\/$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/admin'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
