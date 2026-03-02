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

function normalize(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

async function fetchBrazilianCities(): Promise<string[]> {
  const resp = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios');
  const data: any[] = await resp.json();
  return data.map((item: any) => item.nome as string);
}

async function fetchDataFromCep(cep: string): Promise<{ city: string, street: string } | null> {
  const clean = cep.replace(/\D/g, '');
  if (clean.length !== 8) return null;
  try {
    const resp = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
    const json: any = await resp.json();
    if (json && !json.erro && json.localidade) {
      return { city: json.localidade, street: json.logradouro };
    }
  } catch (_) {}
  return null;
}

function parseAddressString(addressStr: string) {
  if (!addressStr) return { street: '', city: '', cep: '' };
  
  const cepMatch = addressStr.match(/(\d{5}-?\d{3})/);
  const cep = cepMatch ? cepMatch[0].replace(/\D/g, '') : '';
  
  // Remove CEP from string for city/street parsing
  let cleanStr = addressStr.replace(cepMatch ? cepMatch[0] : '', '').trim();
  
  let city = '';
  // Try to find city after a hyphen or comma at the end
  const parts = cleanStr.split(/,|-/);
  if (parts.length > 1) {
    city = parts[parts.length - 1].trim();
    // If it's a 2-letter UF, take the previous part
    if (city.length === 2 && parts.length > 2) {
      city = parts[parts.length - 2].trim();
    }
  }
  
  const street = parts[0].trim();
  
  return { street, city, cep };
}

async function migrate() {
  const officialCities = await fetchBrazilianCities();
  const normalizedOfficial = officialCities.map(normalize);

  let from = 0;
  const pageSize = 500;
  let totalProcessed = 0;
  let totalUpdated = 0;

  console.log('Starting migration...');

  while (true) {
    const { data: patients, error } = await supabase
      .from('patients')
      .select('id, name, address, city, cep')
      .range(from, from + pageSize - 1);

    if (error) { console.error('Error:', error); break; }
    if (!patients || patients.length === 0) break;

    for (const patient of patients) {
      const { street: pStreet, city: pCity, cep: pCep } = parseAddressString(patient.address || '');
      
      let finalCity = pCity || patient.city || '';
      let finalCep = pCep || patient.cep || '';
      let finalStreet = pStreet || patient.address || '';

      // If we have a CEP, try to get official city
      if (finalCep) {
        const fromCep = await fetchDataFromCep(finalCep);
        if (fromCep) {
          finalCity = fromCep.city;
          // Only update street if it's very short or missing
          if (finalStreet.length < 5 && fromCep.street) {
            finalStreet = fromCep.street;
          }
        }
        await new Promise(r => setTimeout(r, 50)); // rate limit
      }

      // Fuzzy match city name if needed
      if (finalCity) {
        const normCity = normalize(finalCity);
        const idx = normalizedOfficial.indexOf(normCity);
        if (idx !== -1) {
          finalCity = officialCities[idx];
        } else {
          // You could add Levenshtein here if you want to be extra thorough
        }
      }

      // If change detected, update
      if (finalCity !== patient.city || finalCep !== patient.cep || (patient.address && finalStreet !== patient.address)) {
        await supabase.from('patients').update({
          city: finalCity,
          cep: finalCep.replace(/\D/g, ''),
          address: finalStreet
        }).eq('id', patient.id);
        totalUpdated++;
      }
      totalProcessed++;
    }

    if (patients.length < pageSize) break;
    from += pageSize;
    console.log(`Processed ${totalProcessed} patients...`);
  }

  console.log(`Migration finished. Total: ${totalProcessed}, Updated: ${totalUpdated}`);
}

migrate();
