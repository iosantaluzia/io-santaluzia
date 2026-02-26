
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or Key not found in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listUsers() {
    const { data, error } = await supabase
        .from('app_users')
        .select('username, display_name, role, approved');

    if (error) {
        console.error('Error fetching users:', error);
        return;
    }

    console.log('Registered Users:');
    data.forEach(user => {
        console.log(`- ${user.display_name || user.username} | Role: ${user.role} | Approved: ${user.approved} (username: ${user.username})`);
    });
}

listUsers().catch(console.error);
