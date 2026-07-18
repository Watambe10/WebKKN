import fs from 'fs';
import path from 'path';

async function checkRenderedPage() {
  try {
    const res = await fetch('http://localhost:3000/');
    if (!res.ok) {
      console.log('Error fetching homepage:', res.status, res.statusText);
      return;
    }
    const html = await res.text();
    fs.writeFileSync(path.resolve(process.cwd(), 'scratch/rendered-home.html'), html);
    console.log('Saved rendered HTML to scratch/rendered-home.html');

    // Search for gallery links and titles in the HTML
    const regex = /href="\/galeri\/(\d+)"[^>]*>[\s\S]*?<h3[^>]*>([\s\S]*?)<\/h3>/g;
    let match;
    console.log('Rendered Gallery Items:');
    while ((match = regex.exec(html)) !== null) {
      console.log(`- ID: ${match[1]}, Title: ${match[2].trim()}`);
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

checkRenderedPage();
