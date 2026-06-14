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

const supabase = createClient(url, key);

const initialItems = [
  {
    title_tr: 'Geleceğin Teknolojileri Raporu 2026',
    title_en: 'Future Technologies Report 2026',
    category: 'raporlar',
    description_tr: 'Intechne vizyonuyla hazırlanan teknoloji ekosistemi ve gelecek öngörülerini içeren kapsamlı analiz raporu.',
    description_en: 'Comprehensive analysis report containing technology ecosystem and future predictions prepared with Intechne vision.',
    type: 'report',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf-test.pdf'
  },
  {
    title_tr: 'Intechne Akademi Sanal Tur',
    title_en: 'Intechne Academy Virtual Tour',
    category: 'interaktif',
    description_tr: 'Eğitim kampüsümüzü 360 derece sanal tur ile keşfedin, atölyelerimizde dijital bir gezintiye çıkın.',
    description_en: 'Discover our training campus with a 360-degree virtual tour, take a digital stroll in our workshops.',
    type: 'interactive',
    file_url: 'https://embed.windy.com'
  },
  {
    title_tr: 'Otonom Sistemler Eğitim Serisi',
    title_en: 'Autonomous Systems Training Series',
    category: 'egitimler',
    description_tr: 'Temel ve ileri seviye otonom sistemler video eğitim serisi ve interaktif simülasyon araçları.',
    description_en: 'Basic and advanced autonomous systems video training series and interactive simulation tools.',
    type: 'video',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    title_tr: 'Hack The Future 2025 Analizi',
    title_en: 'Hack The Future 2025 Analysis',
    category: 'projeler',
    description_tr: 'Geçtiğimiz yılın en çarpıcı projeleri ve geliştirilen yenilikçi çözümlerin teknik incelemeleri.',
    description_en: 'Technical reviews of the most striking projects of the past year and the innovative solutions developed.',
    type: 'report',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf-test.pdf'
  },
  {
    title_tr: 'Intechne Robotik Eko-Sistemi Tanıtım Videosu',
    title_en: 'Intechne Robotics Eco-System Introduction Video',
    category: 'projeler',
    description_tr: 'Intechne bünyesinde kurulan ve yürütülen robotik ligleri, festivaller ve akademi programlarının genel ekosistem tanıtım belgeseli.',
    description_en: 'A general ecosystem documentary of robotics leagues, festivals, and academy programs established and managed under Intechne.',
    type: 'video',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  }
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

  console.log('1. Clearing old interactive items...');
  const { error: deleteError } = await supabase
    .from('interactive')
    .delete()
    .neq('title_tr', 'some-nonexistent-title');

  if (deleteError) {
    console.error('Error clearing interactive table:', deleteError.message);
    process.exit(1);
  }
  console.log('Interactive table cleared.');

  console.log('2. Seeding initial interactive items...');
  const { data, error: insertError } = await supabase
    .from('interactive')
    .insert(initialItems)
    .select();

  if (insertError) {
    console.error('Error seeding interactive items:', insertError.message);
    process.exit(1);
  }

  console.log('Seeded items successfully:', data);
  console.log('Database seeding complete!');
}

main();
