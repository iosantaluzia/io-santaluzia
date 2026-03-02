import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function toTitleCase(str: string): string {
  return str.toLowerCase().split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

function extractCity(address: string | null): string | null {
  if (!address) return null;

  // Tentar dividir por vírgula primeiro
  const parts = address.split(',');
  if (parts.length > 1) {
    let lastPart = parts[parts.length - 1].trim();
    
    // Remover -MT ou /MT se houver
    lastPart = lastPart.split('-')[0].split('/')[0].trim();
    
    // Se a última parte for curta (ex: 2 ou 3 letras) e houver uma anterior, pegar a anterior? 
    // Não, geralmente a cidade é a última.
    
    // Algumas vezes a última parte é o CEP se for formato completo.
    // Mas nos exemplos vimos que é a cidade.
    
    // Se o endereço termina com "Sinop-MT", split('-') dá Sinop.
    
    if (lastPart.toLowerCase() === 'mt' && parts.length > 2) {
        lastPart = parts[parts.length - 2].trim();
    }

    return toTitleCase(lastPart);
  }

  // Se não houver vírgula, tentar por traço
  const dashParts = address.split(' - ');
  if (dashParts.length > 1) {
    let lastPart = dashParts[dashParts.length - 1].trim();
    lastPart = lastPart.split('-')[0].split('/')[0].trim();
    return toTitleCase(lastPart);
  }

  return null;
}

async function standardizeCities() {
  console.log('Fetching patients...');
  const { data: patients, error } = await supabase
    .from('patients')
    .select('id, address, city');

  if (error) {
    console.error('Error fetching patients:', error);
    return;
  }

  console.log(`Analyzing ${patients?.length} patients...`);
  
  let updatedCount = 0;
  
  for (const patient of patients || []) {
    // Se a cidade já estiver preenchida e formatada, pular?
    // O usuário quer "verificar se todos estão marcados corretamente".
    
    const suggestedCity = extractCity(patient.address);
    const currentCity = patient.city;
    
    if (suggestedCity && suggestedCity !== currentCity) {
      console.log(`Updating ${patient.id}: ${currentCity} -> ${suggestedCity} (Addr: ${patient.address})`);
      const { error: updateError } = await supabase
        .from('patients')
        .update({ city: suggestedCity })
        .eq('id', patient.id);
        
      if (updateError) {
        console.error(`Error updating patient ${patient.id}:`, updateError);
      } else {
        updatedCount++;
      }
    }
  }

  console.log(`Finished. Updated ${updatedCount} patients.`);
}

standardizeCities();
