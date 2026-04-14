import fs from 'fs';
import path from 'path';

const elements = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/elements.json'), 'utf-8'));

const baseUrl = 'https://learnperiodic.vercel.app';
const lastmod = new Date().toISOString().split('T')[0];

const staticRoutes = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/compare', priority: '0.8', changefreq: 'weekly' },
  { url: '/quiz', priority: '0.8', changefreq: 'weekly' }
];

const dynamicRoutes = elements.map(element => ({
  url: `/element/${element.symbol.toLowerCase()}`,
  priority: '0.6',
  changefreq: 'monthly'
}));

const allRoutes = [...staticRoutes, ...dynamicRoutes];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${baseUrl}${route.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
console.log('✅ Sitemap generated successfully in public/sitemap.xml');
