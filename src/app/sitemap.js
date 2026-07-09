import artigos from '@/data/artigos.json';

const BASE_URL = 'https://www.calculadoramortizacao.com.br';

export default function sitemap() {
  const staticPages = [
    { url: BASE_URL, lastModified: '2026-07-09', changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/artigos`, lastModified: '2026-07-09', changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/termos`, lastModified: '2026-07-09', changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/privacidade`, lastModified: '2026-07-09', changeFrequency: 'yearly', priority: 0.3 },
  ];

  const articlePages = artigos.map((a) => ({
    url: `${BASE_URL}/artigos/${a.slug}`,
    lastModified: '2026-07-09',
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticPages, ...articlePages];
}