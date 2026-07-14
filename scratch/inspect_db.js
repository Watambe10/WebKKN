const fs = require('fs');
const path = require('path');

// Read .env.local
const envPath = path.join(__dirname, '..', '.env.local');
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

console.log('Supabase URL:', url);
console.log('Key length:', key ? key.length : 0);

async function inspectTable(tableName) {
  try {
    const res = await fetch(`${url}/rest/v1/${tableName}?select=*&limit=1`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    if (!res.ok) {
      console.log(`Failed to fetch ${tableName}:`, res.status, await res.text());
      return;
    }
    const data = await res.json();
    console.log(`\nTable: ${tableName}`);
    if (data.length > 0) {
      console.log('Keys:', Object.keys(data[0]));
      console.log('First row sample:', data[0]);
    } else {
      console.log('Table is empty.');
    }
  } catch (err) {
    console.error(`Error fetching ${tableName}:`, err);
  }
}

async function run() {
  await inspectTable('monografi_desa');
  await inspectTable('berita');
  await inspectTable('kegiatan');
  await inspectTable('gallery');
}

run();
