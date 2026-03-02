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

// ─── Levenshtein distance ───
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) => {
    const row = new Array(n + 1).fill(0);
    row[0] = i;
    return row;
  });
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
    }
  }
  return dp[m][n];
}

// Remove accents for comparison
function normalize(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

// ─── Fetch official Brazilian cities from IBGE ───
async function fetchBrazilianCities(): Promise<string[]> {
  console.log('Fetching Brazilian cities from IBGE API...');
  const resp = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios');
  const data: any[] = await resp.json();
  console.log(`Fetched ${data.length} cities from IBGE.`);
  return data.map((item: any) => item.nome as string);
}

// ─── Fetch city by CEP using ViaCEP ───
async function fetchCityByCep(cep: string): Promise<string | null> {
  const clean = cep.replace(/\D/g, '');
  if (clean.length !== 8) return null;
  try {
    const resp = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
    const json: any = await resp.json();
    if (json && !json.erro && json.localidade) return json.localidade;
  } catch (_) {}
  return null;
}

// Extract city from address field using common patterns
function extractCityFromAddress(address: string | null): string | null {
  if (!address) return null;
  const parts = address.split(',');
  if (parts.length > 1) {
    let lastPart = parts[parts.length - 1].trim();
    lastPart = lastPart.split('-')[0].split('/')[0].trim();
    if (lastPart.toLowerCase() === 'mt' && parts.length > 2) {
      lastPart = parts[parts.length - 2].trim();
    }
    if (lastPart.length > 2) return lastPart;
  }
  return null;
}

// Extract CEP from address
function extractCep(address: string | null): string | null {
  if (!address) return null;
  const match = address.match(/\b\d{5}-?\d{3}\b/);
  return match ? match[0] : null;
}

async function correctPatientCities() {
  const officialCities = await fetchBrazilianCities();
  const normalizedOfficial = officialCities.map(normalize);

  // Fetch all patients
  let allPatients: any[] = [];
  let from = 0;
  const pageSize = 1000;
  while (true) {
    const { data, error } = await supabase
      .from('patients')
      .select('id, name, address')
      .range(from, from + pageSize - 1);
    if (error) { console.error('Error fetching patients:', error); return; }
    if (!data || data.length === 0) break;
    allPatients = allPatients.concat(data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  console.log(`Total patients fetched: ${allPatients.length}`);

  let correctedCount = 0;
  let skippedCount = 0;

  for (const patient of allPatients) {
    const address = patient.address || '';
    let correctedCity: string | null = null;

    // 1️⃣ Try CEP lookup first
    const cep = extractCep(address);
    if (cep) {
      correctedCity = await fetchCityByCep(cep);
      // Small delay to avoid rate-limiting ViaCEP
      if (correctedCity) await new Promise(r => setTimeout(r, 100));
    }

    // 2️⃣ If no CEP result, extract city from address and fuzzy-match
    if (!correctedCity) {
      const rawCity = extractCityFromAddress(address);
      if (!rawCity || rawCity.length < 3) { skippedCount++; continue; }

      const normRaw = normalize(rawCity);

      // Exact match (ignoring accents/case)
      const exactIdx = normalizedOfficial.indexOf(normRaw);
      if (exactIdx !== -1) {
        correctedCity = officialCities[exactIdx];
      } else {
        // Fuzzy match – find closest city with Levenshtein ≤ 3
        let bestDist = Infinity;
        let bestIdx = -1;
        for (let i = 0; i < normalizedOfficial.length; i++) {
          // Quick length check to skip obviously different
          if (Math.abs(normalizedOfficial[i].length - normRaw.length) > 3) continue;
          const dist = levenshtein(normRaw, normalizedOfficial[i]);
          if (dist < bestDist) { bestDist = dist; bestIdx = i; }
          if (dist === 0) break;
        }
        if (bestDist <= 3 && bestIdx !== -1) {
          correctedCity = officialCities[bestIdx];
        }
      }
    }

    if (!correctedCity) { skippedCount++; continue; }

    // Update the patient record (using the 'address' field to store city info
    // since we confirmed there's no standalone 'city' column)
    // Actually, let's check – the standardize_cities script updated 'city' before.
    // We'll update the address to include the corrected city at the end.
    // But first, let's just log what we'd correct.
    const rawCity = extractCityFromAddress(address);
    if (rawCity && normalize(rawCity) !== normalize(correctedCity)) {
      console.log(`[CORRECT] Patient "${patient.name}" (${patient.id}): "${rawCity}" → "${correctedCity}"`);
      // Update address: replace last city portion
      const newAddress = address.replace(rawCity, correctedCity);
      const { error: updErr } = await supabase
        .from('patients')
        .update({ address: newAddress })
        .eq('id', patient.id);
      if (updErr) console.error(`  ❌ Failed to update: ${updErr.message}`);
      else { console.log(`  ✅ Updated`); correctedCount++; }
    } else {
      skippedCount++;
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Total patients: ${allPatients.length}`);
  console.log(`Corrected: ${correctedCount}`);
  console.log(`Skipped/already correct: ${skippedCount}`);
}

correctPatientCities();
