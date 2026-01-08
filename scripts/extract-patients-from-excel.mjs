import XLSX from 'xlsx';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar variáveis de ambiente
dotenv.config({ path: join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Erro: Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não encontradas');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function extractPatientsFromExcel() {
  try {
    console.log('📖 Lendo arquivo Excel...');
    
    // Ler o arquivo Excel
    const filePath = join(__dirname, '..', 'public', 'uploads', 'Backup Hidoctor.xls');
    const workbook = XLSX.readFile(filePath);
    
    // Pegar a primeira planilha
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Converter para JSON com header na linha 1
    const data = XLSX.utils.sheet_to_json(worksheet, { 
      raw: false,
      defval: '',
      header: 1 // Usar array de arrays primeiro para debug
    });
    
    console.log(`✅ Arquivo lido com sucesso! Encontradas ${data.length} linhas.`);
    console.log('📋 Primeiras 5 linhas para debug:');
    data.slice(0, 5).forEach((row, idx) => {
      console.log(`   Linha ${idx + 1}:`, row);
    });
    
    // Encontrar a linha de cabeçalho (primeira linha com dados válidos)
    let headerRowIndex = -1;
    let headerRow = [];
    
    for (let i = 0; i < Math.min(20, data.length); i++) {
      const row = data[i];
      if (Array.isArray(row) && row.length > 0) {
        // Verificar se parece um cabeçalho (contém palavras como Nome, CPF, etc)
        const rowStr = row.join(' ').toLowerCase();
        if (rowStr.includes('nome') || rowStr.includes('cpf') || rowStr.includes('paciente')) {
          headerRowIndex = i;
          headerRow = row;
          break;
        }
      }
    }
    
    if (headerRowIndex === -1) {
      console.log('⚠️  Cabeçalho não encontrado, tentando usar primeira linha...');
      headerRowIndex = 0;
      headerRow = data[0] || [];
    }
    
    console.log(`\n📋 Cabeçalho encontrado na linha ${headerRowIndex + 1}:`, headerRow);
    
    // Converter novamente com o cabeçalho correto
    const dataWithHeaders = XLSX.utils.sheet_to_json(worksheet, { 
      raw: false,
      defval: '',
      range: headerRowIndex // Começar da linha do cabeçalho
    });
    
    console.log(`\n📊 Encontrados ${dataWithHeaders.length} registros após identificar cabeçalho.`);
    console.log('📋 Colunas encontradas:', Object.keys(dataWithHeaders[0] || {}));
    
    // Processar e inserir pacientes
    const patients = [];
    const errors = [];
    
    // Debug: mostrar algumas linhas de exemplo
    console.log('\n🔍 Exemplos de dados (primeiras 3 linhas):');
    dataWithHeaders.slice(0, 3).forEach((row, idx) => {
      console.log(`   Linha ${idx + 1}:`, JSON.stringify(row, null, 2));
    });
    
    for (let i = 0; i < dataWithHeaders.length; i++) {
      const row = dataWithHeaders[i];
      
      try {
        // Tentar diferentes variações de nomes de colunas
        const allKeys = Object.keys(row);
        const nameKey = allKeys.find(k => 
          k.toLowerCase().includes('nome') || 
          k.toLowerCase().includes('paciente') ||
          k.toLowerCase().includes('name')
        );
        const cpfKey = allKeys.find(k => 
          k.toLowerCase().includes('cpf') ||
          k.toLowerCase().includes('documento')
        );
        const prontuarioKey = allKeys.find(k => 
          k.toLowerCase().includes('prontuário') ||
          k.toLowerCase().includes('prontuario')
        );
        const birthKey = allKeys.find(k => 
          k.toLowerCase().includes('nasc') ||
          k.toLowerCase().includes('birth')
        );
        const phoneKey = allKeys.find(k => 
          k.toLowerCase().includes('telefone') ||
          k.toLowerCase().includes('fone') ||
          k.toLowerCase().includes('phone') ||
          k.toLowerCase().includes('celular')
        );
        const emailKey = allKeys.find(k => 
          k.toLowerCase().includes('email') ||
          k.toLowerCase().includes('e-mail')
        );
        const logradouroKey = allKeys.find(k => 
          k.toLowerCase().includes('logradouro')
        );
        const complementoKey = allKeys.find(k => 
          k.toLowerCase().includes('complemento')
        );
        const bairroKey = allKeys.find(k => 
          k.toLowerCase().includes('bairro')
        );
        const cidadeKey = allKeys.find(k => 
          k.toLowerCase().includes('cidade')
        );
        const cepKey = allKeys.find(k => 
          k.toLowerCase().includes('cep')
        );
        
        // Mapear colunas do Excel para o formato do banco
        const name = (nameKey ? row[nameKey] : '').toString().trim();
        const prontuario = (prontuarioKey ? row[prontuarioKey] : '').toString().trim();
        const dateOfBirth = birthKey ? (row[birthKey] || null) : null;
        
        // Gerar CPF único baseado no nome e data de nascimento
        let cpf = '';
        if (cpfKey && row[cpfKey]) {
          cpf = row[cpfKey].toString().replace(/\D/g, '');
        } else if (prontuario && prontuario.trim()) {
          // Usar prontuário como base para CPF temporário (preencher com zeros)
          const prontNum = prontuario.replace(/\D/g, '');
          cpf = prontNum.padStart(11, '0').substring(0, 11);
        } else {
          // Gerar CPF temporário único baseado em hash do nome + data de nascimento
          const nameStr = name.toLowerCase().trim();
          const birthStr = dateOfBirth || '';
          const hashInput = `${nameStr}_${birthStr}`;
          const hash = crypto.createHash('md5').update(hashInput).digest('hex');
          // Pegar os primeiros 11 dígitos do hash e converter para números
          const hashDigits = hash.replace(/\D/g, '').substring(0, 11);
          cpf = hashDigits.padStart(11, '0');
        }
        
        // Montar endereço completo
        const logradouro = logradouroKey ? (row[logradouroKey] || '').toString().trim() : '';
        const complemento = complementoKey ? (row[complementoKey] || '').toString().trim() : '';
        const bairro = bairroKey ? (row[bairroKey] || '').toString().trim() : '';
        const cidade = cidadeKey ? (row[cidadeKey] || '').toString().trim() : '';
        const cep = cepKey ? (row[cepKey] || '').toString().trim() : '';
        
        const addressParts = [logradouro, complemento, bairro, cidade, cep].filter(Boolean);
        const address = addressParts.length > 0 ? addressParts.join(', ') : null;
        
        const patientData = {
          name: name,
          cpf: cpf,
          date_of_birth: dateOfBirth,
          phone: phoneKey ? (row[phoneKey] || '').toString().replace(/\D/g, '') : '',
          email: emailKey ? (row[emailKey] || null) : null,
          address: address,
          emergency_contact: null,
          emergency_phone: null,
          medical_history: null,
          allergies: null,
          medications: null,
          created_by: 'matheus'
        };
        
        // Validar dados obrigatórios
        if (!patientData.name) {
          errors.push(`Linha ${i + headerRowIndex + 2}: Nome faltando`);
          continue;
        }
        
        // Validar que temos pelo menos um nome válido
        if (!name || name.length < 2) {
          errors.push(`Linha ${i + headerRowIndex + 2}: Nome inválido ou muito curto`);
          continue;
        }
        
        // Garantir que CPF tem 11 dígitos (preencher com zeros se necessário)
        if (cpf.length < 11) {
          cpf = cpf.padStart(11, '0');
        } else if (cpf.length > 11) {
          cpf = cpf.substring(0, 11);
        }
        patientData.cpf = cpf;
        
        // Formatar data de nascimento se necessário
        if (dateOfBirth) {
          // Tentar converter diferentes formatos de data
          const dateStr = dateOfBirth.toString().trim();
          if (dateStr && dateStr !== '') {
            if (dateStr.includes('/')) {
              const parts = dateStr.split('/');
              if (parts.length === 3) {
                // Formato MM/DD/YY ou DD/MM/YY
                let day, month, year;
                const firstPart = parseInt(parts[0]);
                const secondPart = parseInt(parts[1]);
                
                // Se primeira parte > 12, provavelmente é DD/MM/YY
                if (firstPart > 12) {
                  day = parts[0];
                  month = parts[1];
                  year = parts[2];
                } else if (secondPart > 12) {
                  // MM/DD/YY
                  month = parts[0];
                  day = parts[1];
                  year = parts[2];
                } else {
                  // Tentar inferir: se primeiro < 13, assumir MM/DD/YY
                  month = parts[0];
                  day = parts[1];
                  year = parts[2];
                }
                
                // Converter ano de 2 dígitos para 4 dígitos
                if (year.length === 2) {
                  const yearNum = parseInt(year);
                  year = yearNum > 50 ? `19${year}` : `20${year}`;
                }
                
                // Validar valores
                const dayNum = parseInt(day);
                const monthNum = parseInt(month);
                const yearNum = parseInt(year);
                
                if (dayNum >= 1 && dayNum <= 31 && monthNum >= 1 && monthNum <= 12 && yearNum >= 1900 && yearNum <= 2100) {
                  patientData.date_of_birth = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                } else {
                  patientData.date_of_birth = null;
                }
              } else {
                patientData.date_of_birth = null;
              }
            } else if (dateStr.includes('-')) {
              // Já está no formato correto ou precisa inverter
              const parts = dateStr.split('-');
              if (parts.length === 3) {
                if (parts[0].length === 2) {
                  // DD-MM-YYYY ou YYYY-MM-DD invertido
                  const yearNum = parseInt(parts[2]);
                  if (yearNum >= 1900 && yearNum <= 2100) {
                    patientData.date_of_birth = `${parts[2]}-${parts[1]}-${parts[0]}`;
                  } else {
                    patientData.date_of_birth = dateStr; // Já está no formato correto
                  }
                } else {
                  patientData.date_of_birth = dateStr; // Já está no formato correto
                }
              } else {
                patientData.date_of_birth = null;
              }
            } else {
              patientData.date_of_birth = null;
            }
          } else {
            patientData.date_of_birth = null;
          }
        } else {
          // Se não tem data de nascimento, usar uma data padrão (01/01/1900) para não violar constraint
          patientData.date_of_birth = '1900-01-01';
        }
        
        // Truncar nome se muito longo (limite de 255 caracteres geralmente)
        if (patientData.name.length > 200) {
          patientData.name = patientData.name.substring(0, 200);
        }
        
        patients.push(patientData);
      } catch (error) {
        errors.push(`Linha ${i + 2}: ${error.message}`);
      }
    }
    
    console.log(`\n📊 Processados ${patients.length} pacientes válidos`);
    if (errors.length > 0) {
      console.log(`⚠️  ${errors.length} erros encontrados:`);
      errors.slice(0, 10).forEach(err => console.log(`   - ${err}`));
      if (errors.length > 10) {
        console.log(`   ... e mais ${errors.length - 10} erros`);
      }
    }
    
    // Inserir pacientes no banco de dados
    console.log('\n💾 Inserindo pacientes no banco de dados...');
    
    let inserted = 0;
    let skipped = 0;
    let failed = 0;
    
    for (const patient of patients) {
      try {
        // Verificar se o paciente já existe pelo CPF
        const { data: existing } = await supabase
          .from('patients')
          .select('id')
          .eq('cpf', patient.cpf)
          .single();
        
        if (existing) {
          console.log(`⏭️  Paciente ${patient.name} (CPF: ${patient.cpf}) já existe, pulando...`);
          skipped++;
          continue;
        }
        
        // Inserir paciente
        const { error } = await supabase
          .from('patients')
          .insert(patient);
        
        if (error) {
          console.error(`❌ Erro ao inserir ${patient.name}:`, error.message);
          failed++;
        } else {
          inserted++;
          console.log(`✅ Inserido: ${patient.name} (CPF: ${patient.cpf})`);
        }
      } catch (error) {
        console.error(`❌ Erro ao processar ${patient.name}:`, error.message);
        failed++;
      }
    }
    
    console.log('\n📈 Resumo:');
    console.log(`   ✅ Inseridos: ${inserted}`);
    console.log(`   ⏭️  Pulados (já existem): ${skipped}`);
    console.log(`   ❌ Falhas: ${failed}`);
    console.log(`   📊 Total processado: ${patients.length}`);
    
  } catch (error) {
    console.error('❌ Erro ao processar arquivo Excel:', error);
    process.exit(1);
  }
}

// Executar
extractPatientsFromExcel();

