// Script Node.js simples para executar SQL no Supabase via API REST
// Execute: node scripts/execute-waitlist-sql.js

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://aobjtwikccovikmfoicg.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('\n❌ Erro: SUPABASE_SERVICE_ROLE_KEY não encontrada.');
  console.log('\n📝 Para executar este script:');
  console.log('1. Obtenha a Service Role Key do Supabase Dashboard:');
  console.log('   - Acesse: https://supabase.com/dashboard/project/aobjtwikccovikmfoicg/settings/api');
  console.log('   - Role: service_role (não a anon key)');
  console.log('   - Copie a chave');
  console.log('\n2. Execute no PowerShell:');
  console.log('   $env:SUPABASE_SERVICE_ROLE_KEY="sua_chave_aqui"');
  console.log('   node scripts/execute-waitlist-sql.js');
  console.log('\n⚠️  ATENÇÃO: A service_role key tem acesso completo. Não compartilhe!');
  process.exit(1);
}

async function executeSQL() {
  try {
    console.log('🔄 Lendo arquivo SQL...');
    const sqlPath = path.join(__dirname, '..', 'supabase', 'create_waitlist_table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    
    // Dividir SQL em comandos individuais
    const commands = sql
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`📤 Executando ${commands.length} comandos SQL...`);
    
    // Para executar SQL via Supabase, precisamos usar a API de migrations ou RPC
    // Como não temos acesso direto, vamos criar uma solução alternativa
    
    // Criar uma migration temporária
    const migrationContent = sql;
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const migrationName = `${timestamp}_create_waitlist_table.sql`;
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', migrationName);
    
    // Verificar se já existe
    if (fs.existsSync(migrationPath)) {
      console.log('⚠️  Migration já existe. Pulando criação...');
    } else {
      fs.writeFileSync(migrationPath, migrationContent);
      console.log(`✅ Migration criada: ${migrationName}`);
    }
    
    console.log('\n📋 Opções para aplicar o SQL:');
    console.log('\n1️⃣  Via Supabase CLI (Recomendado):');
    console.log('   npx supabase db push');
    console.log('\n2️⃣  Via Dashboard (Manual):');
    console.log('   - Acesse: https://supabase.com/dashboard/project/aobjtwikccovikmfoicg/sql');
    console.log('   - Cole o conteúdo do arquivo: supabase/create_waitlist_table.sql');
    console.log('   - Clique em "Run"');
    
    // Tentar executar via API REST (método alternativo)
    console.log('\n🔄 Tentando executar via API...');
    
    // Usar a API REST do Supabase para executar SQL via função RPC
    // Nota: Isso requer uma função RPC criada no Supabase
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ query: sql })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ SQL executado com sucesso via API!');
        console.log(result);
        return;
      }
    } catch (apiError) {
      console.log('⚠️  Não foi possível executar via API (função RPC não existe)');
    }
    
    // Se não funcionou, mostrar o SQL para execução manual
    console.log('\n📄 SQL para execução manual:');
    console.log('─'.repeat(60));
    console.log(sql);
    console.log('─'.repeat(60));
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.log('\n📋 Por favor, execute o SQL manualmente no Supabase Dashboard.');
  }
}

executeSQL();

