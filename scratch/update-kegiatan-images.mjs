import fs from 'fs';
import path from 'path';

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

async function updateKegiatanImages() {
  try {
    const res = await fetch(`${url}/rest/v1/kegiatan?select=id`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    const rows = await res.json();

    for (const row of rows) {
      const patchRes = await fetch(`${url}/rest/v1/kegiatan?id=eq.${row.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ gambar: '/hero-desa.png' })
      });
      console.log(`Updated ID ${row.id} status:`, patchRes.status);
    }
    console.log('All kegiatan images successfully set to template /hero-desa.png');
  } catch (err) {
    console.error('Error updating kegiatan images:', err);
  }
}

updateKegiatanImages();
