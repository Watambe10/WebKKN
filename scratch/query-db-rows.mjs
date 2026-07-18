import fs from 'fs';
import path from 'path';

// Read .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function queryTable(tableName) {
  try {
    const res = await fetch(`${url}/rest/v1/${tableName}?select=*`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    if (!res.ok) {
      console.log(`Failed to fetch ${tableName}:`, res.status, await res.text());
      return [];
    }
    return await res.json();
  } catch (err) {
    console.error(`Error querying ${tableName}:`, err);
    return [];
  }
}

async function run() {
  const berita = await queryTable('berita');
  console.log('\n--- BERITA TABLE ---');
  berita.forEach(row => console.log(`ID: ${row.id} | Judul: ${row.judul} | Slug: ${row.slug}`));

  const kegiatan = await queryTable('kegiatan');
  console.log('\n--- KEGIATAN TABLE ---');
  kegiatan.forEach(row => console.log(`ID: ${row.id} | Nama: ${row.nama_kegiatan} | Slug: ${row.slug}`));

  const gallery = await queryTable('gallery');
  console.log('\n--- GALLERY TABLE ---');
  gallery.forEach(row => console.log(`ID: ${row.id} | Judul: ${row.judul} | Kategori: ${row.kategori}`));
}

run();
