import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkCities() {
  console.log('Fetching patients city and address...');
  const { data, error } = await supabase
    .from('patients')
    .select('id, name, address, city');

  if (error) {
    console.error('Error:', error);
    return;
  }

  const citiesCount: Record<string, number> = {};
  data?.forEach(p => {
    const city = p.city || 'EMPTY';
    citiesCount[city] = (citiesCount[city] || 0) + 1;
  });

  console.log('Cities found in database:');
  console.log(JSON.stringify(citiesCount, null, 2));
}

checkCities();
