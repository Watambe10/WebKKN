import fs from 'fs';
import path from 'path';

const url = 'https://static-maps.yandex.ru/1.x/?ll=110.5954,-7.8082&z=15&l=map&size=600,450&lang=en_US';
const outputPath = path.resolve('public/peta-plasan.png');

async function download() {
  console.log('Downloading map from:', url);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(outputPath, buffer);
    console.log('Map successfully saved to:', outputPath);
  } catch (error) {
    console.error('Error downloading map:', error);
  }
}

download();
