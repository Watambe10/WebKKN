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

async function getColumns() {
  try {
    const res = await fetch(`${url}/rest/v1/?apikey=${key}`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    if (!res.ok) {
      console.log(`Failed to fetch OpenAPI spec:`, res.status, await res.text());
      return;
    }
    const data = await res.json();
    const monografiDefinition = data.definitions.monografi_desa;
    if (monografiDefinition && monografiDefinition.properties) {
      console.log('Columns in monografi_desa:');
      console.log(Object.keys(monografiDefinition.properties));
    } else {
      console.log('monografi_desa definition not found in OpenAPI spec.');
    }
  } catch (err) {
    console.error(`Error:`, err);
  }
}

getColumns();
