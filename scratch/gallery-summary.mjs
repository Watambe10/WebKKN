import fs from 'fs';
import path from 'path';

const dataPath = path.resolve(process.cwd(), 'scratch/gallery-output.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(rawData);

const summary = data.map(item => ({
  id: item.id,
  judul: item.judul,
  deskripsi: item.deskripsi ? item.deskripsi.substring(0, 100) + '...' : '',
  kategori: item.kategori,
  tanggal_upload: item.tanggal_upload,
  created_at: item.created_at,
  gambar_length: item.gambar ? item.gambar.length : 0,
  gambar_preview: item.gambar ? item.gambar.substring(0, 50) + '...' : ''
}));

fs.writeFileSync(path.resolve(process.cwd(), 'scratch/gallery-summary.json'), JSON.stringify(summary, null, 2));
console.log('Saved summary to scratch/gallery-summary.json');
