
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function run() {
    const username = 'financeiro';
    const authUserId = '349feaa6-0932-4423-856e-f112ca37f016';
    const newEmail = 'financeiro@iosantaluzia.com.br';
    const newPassword = '123456';

    console.log(`Corrigindo usuário: ${username}`);

    // 1. Forçar email correto no Auth via RPC
    const { error: emailError } = await supabase.rpc('update_user_email', {
        user_id: authUserId,
        new_email: newEmail
    });

    if (emailError) {
        console.error('Erro ao atualizar email:', emailError);
    } else {
        console.log('Email atualizado com sucesso:', newEmail);
    }

    // 2. Forçar senha via RPC
    const { error: passError } = await supabase.rpc('update_user_password', {
        user_id: authUserId,
        new_password: newPassword
    });

    if (passError) {
        console.error('Erro ao atualizar senha:', passError);
    } else {
        console.log('Senha atualizada com sucesso para: 123456');
    }

    // 3. Corrigir permissões - Garantir que o cargo é financeiro (atualmente está como secretary na consulta anterior)
    const { error: roleError } = await supabase
        .from('app_users')
        .update({ role: 'financeiro', approved: true })
        .eq('username', 'financeiro');

    if (roleError) {
        console.error('Erro ao atualizar cargo:', roleError);
    } else {
        console.log('Cargo atualizado para "financeiro" com sucesso.');
    }
}

run();
