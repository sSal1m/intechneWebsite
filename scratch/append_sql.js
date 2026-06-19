const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'supabase_schema.sql');
const migrationPath = path.join(__dirname, 'brand_pages_migration.sql');

let schema = fs.readFileSync(schemaPath, 'utf8');
const migration = fs.readFileSync(migrationPath, 'utf8');

// 1. Add DROP TABLE IF EXISTS brand_pages; to the top DROP block
const dropInsertIndex = schema.indexOf('DROP TABLE IF EXISTS trash_bin;');
if (dropInsertIndex !== -1) {
  schema = schema.slice(0, dropInsertIndex) + 'DROP TABLE IF EXISTS brand_pages;\n' + schema.slice(dropInsertIndex);
}

// 2. Add ALTER TABLE brand_pages ENABLE ROW LEVEL SECURITY; policy list etc.
// Let's just append the migration content to the bottom of the schema file
schema = schema + '\n\n-- J. Marka Sayfaları Tablosu, RLS Politikaları ve İlk Veriler\n' + migration;

fs.writeFileSync(schemaPath, schema);
console.log('Appended migration to supabase_schema.sql successfully.');
