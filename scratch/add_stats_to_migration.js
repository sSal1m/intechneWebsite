const fs = require('fs');
const path = require('path');

// 1. Read brands.ts to get stats
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

// 2. Read migration file
const migrationPath = path.join(__dirname, 'brand_pages_migration.sql');
let migrationSql = fs.readFileSync(migrationPath, 'utf8');

// Add stats column to CREATE TABLE (right after sections_en)
migrationSql = migrationSql.replace(
  '    sections_en JSONB NOT NULL DEFAULT \'[]\',',
  "    sections_en JSONB NOT NULL DEFAULT '[]',\n    stats JSONB NOT NULL DEFAULT '[]',"
);

// Map stats for each slug in INSERT statements
for (const [slug, stats] of Object.entries(brandStatsMap)) {
  const jsonStats = JSON.stringify(stats).replace(/'/g, "''");
  
  // Find the insert block for this slug
  // It has: 'slug',\n  nedir_tr,\n...
  // and values: 'slug',\n  'nedir_tr_value',...
  const patternHeader = `  sections_en,\n  status_message_tr,\n  status_message_en\n) VALUES (\n  '${slug}',`;
  const targetHeader = `  sections_en,\n  stats,\n  status_message_tr,\n  status_message_en\n) VALUES (\n  '${slug}',`;
  migrationSql = migrationSql.replace(patternHeader, targetHeader);

  // Now we need to insert the JSON string before the status_message_tr / status_message_en values.
  // Wait, let's locate the values section for this slug.
  // The insert statement looks like:
  // INSERT INTO brand_pages (..., sections_en, status_message_tr, status_message_en) VALUES ('slug', ..., json_sections_en, val_status_tr, val_status_en);
  // Let's locate the INSERT INTO brand_pages statement for the slug
  const searchStr = `INSERT INTO brand_pages (\n  slug,\n  nedir_tr,\n  nedir_en,\n  vizyon_tr,\n  vizyon_en,\n  kapsam_tr,\n  kapsam_en,\n  video_url,\n  gallery,\n  sections_tr,\n  sections_en,\n  status_message_tr,\n  status_message_en\n) VALUES (\n  '${slug}'`;

  const insertIndex = migrationSql.indexOf(searchStr);
  if (insertIndex !== -1) {
    // Find the closing ');' of this insert statement
    const endInsertIndex = migrationSql.indexOf(');', insertIndex);
    const insertStatement = migrationSql.slice(insertIndex, endInsertIndex);
    
    // We want to add 'stats' column in the column list
    let updatedStatement = insertStatement.replace(
      '  sections_en,\n  status_message_tr,\n  status_message_en',
      '  sections_en,\n  stats,\n  status_message_tr,\n  status_message_en'
    );
    
    // We want to insert the stats JSON value at the end.
    // The values list is at the end: ..., sections_en_json, status_message_tr_val, status_message_en_val
    // Let's find the last two arguments. They are preceded by commas.
    // Since there are 12 columns originally, the values are:
    // ('slug', nedir_tr, nedir_en, vizyon_tr, vizyon_en, kapsam_tr, kapsam_en, video_url, gallery, sections_tr, sections_en, status_message_tr, status_message_en)
    // We want to insert the stats value after sections_en (which is the 11th value).
    // Let's count commas in the VALUES part to find where sections_en ends.
    // Actually, a simpler way is: since the last two are status_message_tr and status_message_en,
    // let's split the values part by ',\r\n  ' or ',\n  ' and insert the stats value before the last two values!
    // Let's parse the values list:
    const valuesPartStart = updatedStatement.indexOf('VALUES (\n  ');
    const valuesPart = updatedStatement.slice(valuesPartStart + 8);
    
    // Parse the values safely. Since it is SQL, we can just split by ',\n  ' (newlines are formatted by the converter script)
    const valuesList = valuesPart.split(/,\r?\n  /);
    // valuesList has 13 elements.
    // Element 10 is sections_en (json). Element 11 is status_message_tr. Element 12 is status_message_en.
    // Insert stats at index 11
    valuesList.splice(11, 0, `'${jsonStats}'`);
    
    const newValuesPart = 'VALUES (\n  ' + valuesList.join(',\n  ');
    updatedStatement = updatedStatement.slice(0, valuesPartStart) + newValuesPart;
    
    migrationSql = migrationSql.slice(0, insertIndex) + updatedStatement + migrationSql.slice(endInsertIndex);
  }
}

fs.writeFileSync(migrationPath, migrationSql);
console.log('Successfully added stats to brand_pages_migration.sql!');
