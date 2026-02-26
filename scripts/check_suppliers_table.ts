
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function checkTable() {
    const { data, error } = await supabase.from('suppliers').select('*').limit(1);
    if (error) {
        console.log('Error or table does not exist:', error.message);
    } else {
        console.log('Table exists, data:', data);
    }
}

checkTable();
