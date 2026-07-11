import fs from 'fs';
import path from 'path';

// Load env variables
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const headers = {
  apikey: supabaseAnonKey,
  Authorization: `Bearer ${supabaseAnonKey}`,
  'Content-Type': 'application/json'
};

async function test() {
  const url = `${supabaseUrl}/rest/v1/monografi_desa?select=*&limit=1`;
  const res = await fetch(url, { headers });
  if (res.ok) {
    const data = await res.json();
    console.log("Current schema columns:", Object.keys(data[0] || {}));
    console.log("Full first row data:", data[0]);
  } else {
    console.error("Error fetching schema:", await res.text());
  }
}

test().catch(console.error);
