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

async function checkGallery() {
  try {
    const res = await fetch(`${url}/rest/v1/gallery?select=*`, {
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
    console.log('Gallery rows length:', data.length);
    fs.writeFileSync(path.resolve(process.cwd(), 'scratch/gallery-output.json'), JSON.stringify(data, null, 2));
    console.log('Successfully saved to scratch/gallery-output.json');
  } catch (err) {
    console.error(`Error:`, err);
  }
}

checkGallery();
