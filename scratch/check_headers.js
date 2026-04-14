
async function checkSitemap() {
  const url = 'https://learnperiodic.vercel.app/sitemap.xml';
  try {
    const response = await fetch(url, { method: 'HEAD' });
    console.log('Status:', response.status);
    console.log('Headers:');
    response.headers.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
  } catch (error) {
    console.error('Error fetching sitemap:', error);
  }
}

checkSitemap();
