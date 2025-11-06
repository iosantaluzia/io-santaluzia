// Script para executar SQL no Supabase
// Execute: node scripts/execute-waitlist-sql.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://aobjtwikccovikmfoicg.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔧 Criando migration para a tabela waitlist...\n');

// Ler o SQL
const sqlPath = path.join(__dirname, '..', 'supabase', 'create_waitlist_table.sql');
const sql = fs.readFileSync(sqlPath, 'utf-8');

// Criar nome de migration com timestamp
const timestamp = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0];
const migrationName = `${timestamp}_create_waitlist_table.sql`;
const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', migrationName);

// Verificar se já existe migration similar
const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
const existingMigrations = fs.readdirSync(migrationsDir)
  .filter(f => f.includes('waitlist') || f.includes('create_waitlist'));

if (existingMigrations.length > 0) {
  console.log('⚠️  Já existem migrations relacionadas à waitlist:');
  existingMigrations.forEach(m => console.log(`   - ${m}`));
  console.log('\n📋 O SQL já está disponível nas migrations acima.');
} else {
  // Criar nova migration
  fs.writeFileSync(migrationPath, sql);
  console.log(`✅ Migration criada: ${migrationName}`);
  console.log(`   Local: ${migrationPath}\n`);
}

console.log('📝 Para aplicar a migration, você tem 3 opções:\n');

console.log('1️⃣  Via Supabase CLI (Recomendado):');
console.log('   npx supabase db push\n');

console.log('2️⃣  Via Dashboard SQL Editor:');
console.log('   - Acesse: https://supabase.com/dashboard/project/aobjtwikccovikmfoicg/sql');
console.log('   - Cole o conteúdo do arquivo: supabase/create_waitlist_table.sql');
console.log('   - Clique em "Run"\n');

console.log('3️⃣  Via Migration direta:');
console.log('   O arquivo foi criado em: supabase/migrations/' + migrationName);
console.log('   Execute: npx supabase migration up\n');

console.log('📄 SQL para copiar:');
console.log('─'.repeat(70));
console.log(sql);
console.log('─'.repeat(70));

