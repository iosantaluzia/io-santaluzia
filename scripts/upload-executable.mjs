// Script Node.js para fazer upload do executável para Supabase Storage
// Execute: node scripts/upload-executable.mjs

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar variáveis de ambiente
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas!');
  console.error('Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env');
  process.exit(1);
}

const executablePath = join(__dirname, '..', 'release', 'win-unpacked', 'Santa Luzia Admin.exe');
const fileName = 'Santa-Luzia-Admin.exe';

try {
  // Verificar se o arquivo existe
  const fs = await import('fs');
  if (!fs.existsSync(executablePath)) {
    console.error(`❌ Executável não encontrado em: ${executablePath}`);
    console.error('Execute "npm run electron:build:win:dir" primeiro para criar o executável.');
    process.exit(1);
  }

  const fileStats = fs.statSync(executablePath);
  const fileSizeMB = (fileStats.size / (1024 * 1024)).toFixed(2);
  
  console.log('=== Upload do Executável para Supabase Storage ===\n');
  console.log(`✅ Executável encontrado: ${executablePath}`);
  console.log(`   Tamanho: ${fileSizeMB} MB\n`);

  // Criar cliente Supabase
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Ler arquivo
  const fileBuffer = readFileSync(executablePath);

  console.log('📤 Fazendo upload do executável...\n');

  // Fazer upload
  const { data, error } = await supabase.storage
    .from('public-downloads')
    .upload(fileName, fileBuffer, {
      contentType: 'application/x-msdownload',
      upsert: true
    });

  if (error) {
    throw error;
  }

  // Obter URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('public-downloads')
    .getPublicUrl(fileName);

  console.log('✅ Upload concluído com sucesso!\n');
  console.log(`🔗 URL de download: ${publicUrl}\n`);
  console.log('✅ Executável disponível para download no painel administrativo!');

} catch (error) {
  console.error(`❌ Erro ao fazer upload: ${error.message}`);
  console.error('\n💡 Soluções:');
  console.error('   1. Verifique se o bucket "public-downloads" existe no Supabase');
  console.error('   2. Execute a migração: supabase/migrations/20250120000001_setup_public_downloads_storage.sql');
  console.error('   3. Ou faça upload manualmente:');
  console.error('      - Acesse o dashboard do Supabase');
  console.error('      - Vá em Storage > public-downloads');
  console.error(`      - Faça upload do arquivo: ${executablePath}`);
  process.exit(1);
}

