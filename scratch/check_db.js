const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
  if (line && !line.startsWith('#')) {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      env[key] = val;
    }
  }
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Credentials not found in .env.local');
  process.exit(1);
}

const supabase = createClient(url, key);

async function main() {
  console.log('Fetching one item from corporate_identity...');
  const { data, error } = await supabase
    .from('corporate_identity')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching corporate_identity:', error);
  } else {
    console.log('Results:', data);
    if (data && data.length > 0) {
      console.log('Keys of the returned object:', Object.keys(data[0]));
    } else {
      console.log('No rows returned. Trying to insert a mock item or checking columns via REST API...');
    }
  }
}

main();
