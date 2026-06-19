const fs = require('fs');
const path = require('path');

// Read BrandPageContent.tsx to get details
const detailsPath = path.join(__dirname, '..', 'components', 'brands', 'BrandPageContent.tsx');
const detailsContent = fs.readFileSync(detailsPath, 'utf8');

const startIndex = detailsContent.indexOf('const brandDetails');
let bracesCount = 0;
let detailsString = '';
let foundStart = false;

for (let i = startIndex; i < detailsContent.length; i++) {
  if (detailsContent[i] === '=') {
    if (!foundStart) {
      foundStart = true;
      continue;
    }
  }
  if (!foundStart) continue;

  detailsString += detailsContent[i];

  if (detailsContent[i] === '{') bracesCount++;
  if (detailsContent[i] === '}') {
    bracesCount--;
    if (bracesCount === 0) {
      break;
    }
  }
}

let jsDetailsString = detailsString.trim();
jsDetailsString = jsDetailsString.replace(/icon:\s*\w+,/g, 'icon: null,');
jsDetailsString = jsDetailsString.replace(/;$/, '');
const brandDetails = eval('(' + jsDetailsString + ')');

// Read brands.ts to get stats
const brandsPath = path.join(__dirname, '..', 'src', 'data', 'brands.ts');
const brandsContent = fs.readFileSync(brandsPath, 'utf8');

const brandsStartIndex = brandsContent.indexOf('export const brands: Brand[] = [');
let brandsBracesCount = 0;
let brandsString = '';
let brandsFoundStart = false;

for (let i = brandsStartIndex; i < brandsContent.length; i++) {
  if (brandsContent[i] === '[') {
    if (!brandsFoundStart) {
      brandsFoundStart = true;
      continue;
    }
  }
  if (!brandsFoundStart) continue;

  brandsString += brandsContent[i];

  if (brandsContent[i] === '[') brandsBracesCount++;
  if (brandsContent[i] === ']') {
    brandsBracesCount--;
    if (brandsBracesCount === -1) { // since we skipped first '['
      break;
    }
  }
}

let jsBrandsString = brandsString.trim();
jsBrandsString = jsBrandsString.replace(/;$/, '');
const brandsArray = eval('([' + jsBrandsString + ')');

// Map slug to stats
const brandStatsMap = {};
for (const brand of brandsArray) {
  brandStatsMap[brand.slug] = brand.stats || [];
}

let sql = `
-- Drop table if exists to support clean re-run
DROP TABLE IF EXISTS brand_pages;

-- Brand Pages Table
CREATE TABLE brand_pages (
    slug VARCHAR(100) PRIMARY KEY,
    nedir_tr TEXT NOT NULL,
    nedir_en TEXT NOT NULL,
    vizyon_tr TEXT NOT NULL,
    vizyon_en TEXT NOT NULL,
    kapsam_tr TEXT NOT NULL,
    kapsam_en TEXT NOT NULL,
    video_url TEXT,
    gallery TEXT[] DEFAULT '{}',
    sections_tr JSONB NOT NULL DEFAULT '[]',
    sections_en JSONB NOT NULL DEFAULT '[]',
    stats JSONB NOT NULL DEFAULT '[]',
    status_message_tr VARCHAR(255),
    status_message_en VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE brand_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ziyaretciler marka sayfalarini okuyabilir" ON brand_pages FOR SELECT USING (true);

CREATE POLICY "Admin marka sayfalarini yonetebilir" ON brand_pages
    FOR ALL TO authenticated
    USING ((auth.jwt() ->> 'email') = 'admin@intechne.com.tr')
    WITH CHECK ((auth.jwt() ->> 'email') = 'admin@intechne.com.tr');
`;

for (const [slug, data] of Object.entries(brandDetails)) {
  const tr = data.tr;
  const en = data.en;
  const videoUrl = data.videoUrl || null;
  const gallery = data.gallery || [];
  const stats = brandStatsMap[slug] || [];

  const escapeStr = (str) => {
    if (!str) return 'NULL';
    return "'" + str.replace(/'/g, "''") + "'";
  };

  const escapeJson = (obj) => {
    return "'" + JSON.stringify(obj).replace(/'/g, "''") + "'";
  };

  sql += `
INSERT INTO brand_pages (
  slug,
  nedir_tr,
  nedir_en,
  vizyon_tr,
  vizyon_en,
  kapsam_tr,
  kapsam_en,
  video_url,
  gallery,
  sections_tr,
  sections_en,
  stats,
  status_message_tr,
  status_message_en
) VALUES (
  ${escapeStr(slug)},
  ${escapeStr(tr.nedir)},
  ${escapeStr(en.nedir)},
  ${escapeStr(tr.vizyon)},
  ${escapeStr(en.vizyon)},
  ${escapeStr(tr.kapsam)},
  ${escapeStr(en.kapsam)},
  ${escapeStr(videoUrl)},
  ARRAY[${gallery.map(g => escapeStr(g)).join(', ')}]::TEXT[],
  ${escapeJson(tr.sections)},
  ${escapeJson(en.sections)},
  ${escapeJson(stats)},
  ${escapeStr(tr.statusMessage)},
  ${escapeStr(en.statusMessage)}
);
`;
}

fs.writeFileSync(path.join(__dirname, 'brand_pages_migration.sql'), sql);
console.log('Successfully generated SQL script in scratch/brand_pages_migration.sql with brand stats!');
