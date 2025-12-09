#!/usr/bin/env node

/**
 * Script para fazer upload do executável para o Supabase Storage
 * Execute após cada build: node scripts/upload-executable-to-storage.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar variáveis de ambiente
dotenv.config({ path: join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // Precisa da service key para upload

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Variáveis de ambiente não configuradas!');
  console.error('Configure VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function uploadExecutable() {
  try {
    const executablePath = join(__dirname, '..', 'release', 'win-unpacked', 'Santa Luzia Admin.exe');
    
    console.log('📦 Lendo arquivo executável...');
    const fileBuffer = readFileSync(executablePath);
    const fileName = 'Santa-Luzia-Admin.exe';
    
    console.log('☁️  Fazendo upload para Supabase Storage...');
    const { data, error } = await supabase.storage
      .from('public-downloads')
      .upload(fileName, fileBuffer, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'application/x-msdownload'
      });

    if (error) {
      throw error;
    }

    console.log('✅ Upload concluído!');
    
    // Obter URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('public-downloads')
      .getPublicUrl(fileName);

    console.log('🔗 URL pública:', publicUrl);
    console.log('');
    console.log('✅ Executável disponível para download!');
    
  } catch (error) {
    console.error('❌ Erro ao fazer upload:', error.message);
    process.exit(1);
  }
}

uploadExecutable();

