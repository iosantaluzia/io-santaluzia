
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function run() {
    const username = 'secretaria';
    const authUserId = 'da2760c9-388d-457b-aba7-4455cedd562c';
    const newEmail = 'secretaria@iosantaluzia.com.br';
    const newPassword = '123456'; // Senha temporária simples para teste

    console.log(`Corrigindo usuário: ${username}`);

    // 1. Forçar email correto no Auth via RPC
    const { data: emailData, error: emailError } = await supabase.rpc('update_user_email', {
        user_id: authUserId,
        new_email: newEmail
    });

    if (emailError) {
        console.error('Erro ao atualizar email:', emailError);
    } else {
        console.log('Email atualizado com sucesso:', newEmail);
    }

    // 2. Forçar senha via RPC
    const { data: passData, error: passError } = await supabase.rpc('update_user_password', {
        user_id: authUserId,
        new_password: newPassword
    });

    if (passError) {
        console.error('Erro ao atualizar senha:', passError);
    } else {
        console.log('Senha atualizada com sucesso para: 123456');
    }
}

run();
