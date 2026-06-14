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
const key = (env.SUPABASE_SERVICE_ROLE_KEY && env.SUPABASE_SERVICE_ROLE_KEY !== 'your-supabase-service-role-key')
  ? env.SUPABASE_SERVICE_ROLE_KEY
  : env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Credentials not found in .env.local');
  process.exit(1);
}

// Use service role key if available to bypass RLS policies for management script
const supabase = createClient(url, key);

const newCategories = [
  { slug: 'duyurular-kurumsal', name_tr: 'Duyurular & Kurumsal', name_en: 'Announcements & Corporate' },
  { slug: 'robotik-yarismalar', name_tr: 'Robotik & Yarışmalar', name_en: 'Robotics & Competitions' },
  { slug: 'egitim-akademi', name_tr: 'Eğitim & Akademi', name_en: 'Education & Academy' },
  { slug: 'yazilim-hackathon', name_tr: 'Yazılım & Hackathon', name_en: 'Software & Hackathons' },
  { slug: 'girisimcilik-yatirim', name_tr: 'Girişimcilik & Yatırım', name_en: 'Entrepreneurship & Innovation' },
  { slug: 'oyun-espor', name_tr: 'Oyun & E-Spor', name_en: 'Gaming & E-Sports' }
];

async function main() {
  console.log('0. Authenticating as admin...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@intechne.com.tr',
    password: 'admin123'
  });

  if (authError) {
    console.error('Authentication failed:', authError.message);
    process.exit(1);
  }
  console.log('Authenticated successfully as:', authData.user.email);

  console.log('1. Clearing old categories in news_categories...');
  // Note: Due to RLS or foreign key constraints, we delete rows.
  // Set category_slug to null for news that reference old slugs first to be safe
  const { error: updateNewsError } = await supabase
    .from('news')
    .update({ category_slug: null })
    .not('category_slug', 'is', null);

  if (updateNewsError) {
    console.warn('Warning: Could not set news category_slugs to null:', updateNewsError.message);
  }

  // Delete all rows in news_categories
  const { error: deleteError } = await supabase
    .from('news_categories')
    .delete()
    .neq('slug', 'all-keep'); // Deletes all

  if (deleteError) {
    console.error('Error deleting old categories:', deleteError);
    process.exit(1);
  }
  console.log('Old categories deleted successfully.');

  console.log('2. Inserting new categories...');
  const { data, error: insertError } = await supabase
    .from('news_categories')
    .insert(newCategories);

  if (insertError) {
    console.error('Error inserting new categories:', insertError);
    process.exit(1);
  }

  console.log('New categories inserted successfully:', newCategories);
  console.log('Database sync complete!');
}

main();
