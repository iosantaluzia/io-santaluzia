// Script para aplicar SQL diretamente no Supabase via API REST
// Execute: node scripts/apply-waitlist-sql.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://aobjtwikccovikmfoicg.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🚀 Aplicando SQL da tabela waitlist...\n');

// Ler o SQL
const sqlPath = path.join(__dirname, '..', 'supabase', 'create_waitlist_table.sql');
const sql = fs.readFileSync(sqlPath, 'utf-8');

// Dividir SQL em comandos individuais (removendo comentários)
const commands = sql
  .split(';')
  .map(cmd => cmd.trim())
  .filter(cmd => {
    const trimmed = cmd.trim();
    return trimmed.length > 0 && !trimmed.startsWith('--') && !trimmed.startsWith('COMMENT');
  })
  .map(cmd => cmd.replace(/--.*$/gm, '').trim())
  .filter(cmd => cmd.length > 0);

console.log(`📋 Encontrados ${commands.length} comandos SQL para executar\n`);

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.log('⚠️  SUPABASE_SERVICE_ROLE_KEY não encontrada.');
  console.log('\n📝 Para executar automaticamente, você precisa da Service Role Key:');
  console.log('   1. Acesse: https://supabase.com/dashboard/project/aobjtwikccovikmfoicg/settings/api');
  console.log('   2. Copie a "service_role" key (não a anon key)');
  console.log('   3. Execute: $env:SUPABASE_SERVICE_ROLE_KEY="sua_chave" ; node scripts/apply-waitlist-sql.mjs\n');
  console.log('📄 SQL para execução manual:');
  console.log('─'.repeat(70));
  console.log(sql);
  console.log('─'.repeat(70));
  console.log('\n💡 Ou acesse: https://supabase.com/dashboard/project/aobjtwikccovikmfoicg/sql');
  process.exit(0);
}

// Tentar executar cada comando via API REST
// Nota: O Supabase não permite execução direta de SQL via API REST sem uma função RPC
// Vamos tentar criar a tabela via API REST usando o cliente Supabase

async function executeViaAPI() {
  console.log('🔄 Tentando executar via API REST do Supabase...\n');
  
  // Como não podemos executar SQL diretamente via API REST sem função RPC,
  // vamos mostrar o SQL formatado para execução manual
  console.log('⚠️  O Supabase não permite execução direta de SQL via API REST.');
  console.log('📋 Execute o SQL manualmente no Dashboard:\n');
  console.log('─'.repeat(70));
  console.log(sql);
  console.log('─'.repeat(70));
  console.log('\n🔗 Link direto: https://supabase.com/dashboard/project/aobjtwikccovikmfoicg/sql');
  console.log('\n✅ Após executar, a tabela waitlist estará disponível!');
}

// Alternativa: criar uma função Edge Function que execute o SQL
console.log('💡 Solução alternativa: Criar uma Edge Function\n');
console.log('Criando função Edge Function para executar o SQL...');

const edgeFunctionCode = `
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  try {
    const { sql } = await req.json()
    
    // Executar SQL usando o cliente do Supabase
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Executar SQL (requer acesso direto ao banco)
    const { data, error } = await supabase.rpc('exec_sql', { query: sql })
    
    if (error) throw error
    
    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
`;

console.log('\n📋 SOLUÇÃO MAIS SIMPLES:\n');
console.log('Execute o SQL diretamente no Dashboard do Supabase:');
console.log('1. Acesse: https://supabase.com/dashboard/project/aobjtwikccovikmfoicg/sql');
console.log('2. Cole o SQL abaixo:');
console.log('3. Clique em "Run"\n');
console.log('─'.repeat(70));
console.log(sql);
console.log('─'.repeat(70));

executeViaAPI();

