import type { MetadataRoute } from 'next';

const BASE = 'https://neosenia-calculateur.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE}/regie-publicitaire`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/pack-ugc`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ];
}
