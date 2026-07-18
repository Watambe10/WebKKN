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

async function checkRow() {
  try {
    const res = await fetch(`${url}/rest/v1/monografi_desa?select=*&limit=1`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    if (!res.ok) {
      console.log(`Failed to fetch row:`, res.status, await res.text());
      return;
    }
    const data = await res.json();
    if (data.length > 0) {
      console.log('Columns in monografi_desa row:');
      console.log(Object.keys(data[0]));
    } else {
      console.log('No rows found in monografi_desa.');
    }
  } catch (err) {
    console.error(`Error:`, err);
  }
}

checkRow();
