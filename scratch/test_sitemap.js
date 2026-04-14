
const elementsData = require('./data/elements.json');

function testSitemap() {
  const baseUrl = 'https://learnperiodic.vercel.app';
  const elements = elementsData;
  const lastModified = new Date().toISOString().split('T')[0];

  const staticRoutes = ['', '/compare', '/quiz'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  const dynamicRoutes = elements.map((element) => ({
    url: `${baseUrl}/element/${element.symbol.toLowerCase()}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const all = [...staticRoutes, ...dynamicRoutes];
  
  console.log('Total entries:', all.length);
  
  all.forEach((entry, i) => {
    if (!entry.url || entry.url.includes('undefined')) {
      console.error(`Invalid URL at index ${i}:`, entry);
    }
  });

  console.log('Test complete.');
}

testSitemap();
