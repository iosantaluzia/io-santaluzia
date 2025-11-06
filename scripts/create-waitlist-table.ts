// Script para criar a tabela waitlist no Supabase
// Execute: npx tsx scripts/create-waitlist-table.ts

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://aobjtwikccovikmfoicg.supabase.co";
// Para executar SQL, precisamos da service_role_key (não a anon key)
// Você precisa adicionar isso como variável de ambiente ou pedir para o usuário
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Erro: SUPABASE_SERVICE_ROLE_KEY não encontrada.');
  console.log('\n📝 Para executar este script, você precisa:');
  console.log('1. Obter a Service Role Key do Supabase Dashboard:');
  console.log('   - Vá em Settings > API');
  console.log('   - Copie a "service_role" key (NÃO a anon key)');
  console.log('2. Execute o script com:');
  console.log('   SUPABASE_SERVICE_ROLE_KEY=sua_key_aqui npx tsx scripts/create-waitlist-table.ts');
  console.log('\n⚠️  ATENÇÃO: A service_role key tem acesso completo ao banco. Não compartilhe!');
  process.exit(1);
}

// Criar cliente com service_role (acesso administrativo)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSQL() {
  try {
    console.log('🔄 Lendo arquivo SQL...');
    const sqlPath = path.join(process.cwd(), 'supabase', 'create_waitlist_table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    
    console.log('📤 Executando SQL no Supabase...');
    
    // O Supabase JS client não suporta execução direta de SQL
    // Vamos tentar usar a API REST do PostgREST para executar via função RPC
    // Ou usar o método rpc() se houver uma função criada
    
    // Alternativa: usar fetch direto na API do Supabase
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({ sql_query: sql })
    });

    if (!response.ok) {
      // Se não houver função RPC, vamos tentar executar via migrations
      console.log('⚠️  Não foi possível executar diretamente.');
      console.log('\n📋 Por favor, execute o SQL manualmente:');
      console.log('\n' + sql);
      console.log('\n💡 Ou use o Supabase CLI:');
      console.log('   npx supabase db push');
      return;
    }

    const result = await response.json();
    console.log('✅ SQL executado com sucesso!');
    console.log(result);
  } catch (error: any) {
    console.error('❌ Erro ao executar SQL:', error.message);
    console.log('\n📋 Por favor, execute o SQL manualmente no Supabase Dashboard:');
    console.log('\n' + fs.readFileSync(path.join(process.cwd(), 'supabase', 'create_waitlist_table.sql'), 'utf-8'));
  }
}

executeSQL();

