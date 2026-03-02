import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkPatients() {
  console.log('Fetching patients city data...');
  const { data, error } = await supabase
    .from('patients')
    .select('id, name, address, city')
    .limit(100);

  if (error) {
    console.error('Error fetching patients:', error);
    return;
  }

  console.log('Found', data.length, 'patients.');
  data.forEach(p => {
    console.log(`Patient: ${p.name}`);
    console.log(`Address: ${p.address}`);
    console.log(`City:    ${p.city}`);
    console.log('---');
  });
}

checkPatients();
