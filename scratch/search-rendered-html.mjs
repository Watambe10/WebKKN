import fs from 'fs';
import path from 'path';

const html = fs.readFileSync(path.resolve(process.cwd(), 'scratch/rendered-home.html'), 'utf8');

console.log('Includes "Wasinem":', html.includes('Wasinem'));
console.log('Includes "yasinem":', html.includes('yasinem'));
console.log('Includes "Wasinem":', html.toLowerCase().includes('wasinem'));
console.log('Includes "yasinem":', html.toLowerCase().includes('yasinem'));
console.log('Includes "Tempe":', html.includes('Tempe'));
console.log('Includes "23":', html.includes('/galeri/23'));
console.log('Includes "19":', html.includes('/galeri/19'));
