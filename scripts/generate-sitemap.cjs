const fs = require('fs');
const path = require('path');
const artigos = require('../src/data/artigos.json');

const BASE_URL = 'https://calculadoramortizacao.com.br';
const SITEMAP_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');

const staticPages = [
  { url: BASE_URL, lastmod: '2026-07-09', changefreq: 'weekly', priority: 1.0 },
  { url: `${BASE_URL}/artigos`, lastmod: '2026-07-09', changefreq: 'weekly', priority: 0.9 },
  { url: `${BASE_URL}/termos`, lastmod: '2026-07-09', changefreq: 'yearly', priority: 0.3 },
  { url: `${BASE_URL}/privacidade`, lastmod: '2026-07-09', changefreq: 'yearly', priority: 0.3 },
];

const articlePages = artigos.map((a) => ({
  url: `${BASE_URL}/artigos/${a.slug}`,
  lastmod: '2026-07-09',
  changefreq: 'monthly',
  priority: 0.8,
}));

const all = [...staticPages, ...articlePages];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map((p) => `  <url>
    <loc>${p.url}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(SITEMAP_PATH, xml, 'utf-8');
console.log('✓ sitemap.xml generated at public/sitemap.xml');