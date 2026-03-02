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

async function seeAddresses() {
  const { data, error } = await supabase
    .from('patients')
    .select('address')
    .limit(50);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Sample Addresses:');
  data?.forEach(p => console.log(p.address));
}

seeAddresses();
