const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf8');
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts[1].trim();
    if (!key.startsWith('#')) {
      process.env[key] = value;
    }
  }
});

async function test() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  console.log('URL:', url);
  console.log('Key length:', anonKey ? anonKey.length : 0);

  const supabase = createClient(url, anonKey);

  console.log('\n--- Testing messages insert with name ---');
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          name: 'Test Name',
          first_name: 'TestName',
          last_name: 'TestLastName',
          email: 'test@example.com',
          message: 'Test Message content'
        }
      ]);
    if (error) {
      console.error('messages (name only) error:', error);
    } else {
      console.log('messages (name only) success:', data);
    }
  } catch (err) {
    console.error('messages catch:', err);
  }

  console.log('\n--- Testing job_applications insert ---');
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .insert([
        {
          position_id: '88888888-8888-8888-8888-888888888888', // Dummy UUID
          first_name: 'TestName',
          last_name: 'TestLastName',
          email: 'test@example.com',
          phone: '1234567890',
          cover_letter: 'Test cover letter',
          cv_path: 'test-path/test.pdf'
        }
      ]);
    if (error) {
      console.error('job_applications error:', error);
    } else {
      console.log('job_applications success:', data);
    }
  } catch (err) {
    console.error('job_applications catch:', err);
  }
}

test();
