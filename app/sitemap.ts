import { MetadataRoute } from 'next';
import { getPortfolioData } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getPortfolioData();
  const baseUrl = (
    data.seo.canonical_domain ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3000'
  ).replace(/\/$/, '');

  const projectUrls = data.projects
    .filter((p) => p.published)
    .map((proj) => ({
      url: `${baseUrl}/projects/${proj.slug}`,
      lastModified: new Date(proj.updated_at || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(data.last_content_update || Date.now()),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(data.last_content_update || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...projectUrls,
  ];
}
