
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const lenses = [
    // ISERT 151 ESFERICA
    { name: 'Lente ISERT 151 Esférica +20.00', category: 'Lentes', quantity: 2, min_stock: 1, unit: 'unidade' },
    { name: 'Lente ISERT 151 Esférica +20.50', category: 'Lentes', quantity: 2, min_stock: 1, unit: 'unidade' },
    { name: 'Lente ISERT 151 Esférica +21.00', category: 'Lentes', quantity: 2, min_stock: 1, unit: 'unidade' },
    { name: 'Lente ISERT 151 Esférica +21.50', category: 'Lentes', quantity: 2, min_stock: 1, unit: 'unidade' },
    { name: 'Lente ISERT 151 Esférica +22.00', category: 'Lentes', quantity: 2, min_stock: 1, unit: 'unidade' },
    { name: 'Lente ISERT 151 Esférica +22.50', category: 'Lentes', quantity: 2, min_stock: 1, unit: 'unidade' },
    { name: 'Lente ISERT 151 Esférica +23.00', category: 'Lentes', quantity: 1, min_stock: 1, unit: 'unidade' },
    { name: 'Lente ISERT 151 Esférica +23.50', category: 'Lentes', quantity: 2, min_stock: 1, unit: 'unidade' },
    { name: 'Lente ISERT 151 Esférica +24.00', category: 'Lentes', quantity: 0, min_stock: 1, unit: 'unidade' },

    // VIVINEX GEMETRIC ASFERICA MULTIFOCAL
    { name: 'Lente Vivinex Gemetric Asférica Multifocal +20.00', category: 'Lentes', quantity: 1, min_stock: 1, unit: 'unidade' },
    { name: 'Lente Vivinex Gemetric Asférica Multifocal +20.50', category: 'Lentes', quantity: 1, min_stock: 1, unit: 'unidade' },
    { name: 'Lente Vivinex Gemetric Asférica Multifocal +21.00', category: 'Lentes', quantity: 1, min_stock: 1, unit: 'unidade' },
    { name: 'Lente Vivinex Gemetric Asférica Multifocal +21.50', category: 'Lentes', quantity: 1, min_stock: 1, unit: 'unidade' },
    { name: 'Lente Vivinex Gemetric Asférica Multifocal +22.00', category: 'Lentes', quantity: 1, min_stock: 1, unit: 'unidade' },
    { name: 'Lente Vivinex Gemetric Asférica Multifocal +22.50', category: 'Lentes', quantity: 1, min_stock: 1, unit: 'unidade' },
    { name: 'Lente Vivinex Gemetric Asférica Multifocal +23.00', category: 'Lentes', quantity: 1, min_stock: 1, unit: 'unidade' },
    { name: 'Lente Vivinex Gemetric Asférica Multifocal +23.50', category: 'Lentes', quantity: 1, min_stock: 1, unit: 'unidade' },
    { name: 'Lente Vivinex Gemetric Asférica Multifocal +24.00', category: 'Lentes', quantity: 1, min_stock: 1, unit: 'unidade' },

    // VIVINEX IMPRESS ASFERICA MONOFOCAL
    { name: 'Lente Vivinex Impress Asférica Monofocal +19.50', category: 'Lentes', quantity: 2, min_stock: 1, unit: 'unidade' },
    { name: 'Lente Vivinex Impress Asférica Monofocal +20.00', category: 'Lentes', quantity: 2, min_stock: 1, unit: 'unidade' },
    { name: 'Lente Vivinex Impress Asférica Monofocal +20.50', category: 'Lentes', quantity: 2, min_stock: 1, unit: 'unidade' },
    { name: 'Lente Vivinex Impress Asférica Monofocal +21.00', category: 'Lentes', quantity: 2, min_stock: 1, unit: 'unidade' },
    { name: 'Lente Vivinex Impress Asférica Monofocal +21.50', category: 'Lentes', quantity: 1, min_stock: 1, unit: 'unidade' },
    { name: 'Lente Vivinex Impress Asférica Monofocal +22.00', category: 'Lentes', quantity: 1, min_stock: 1, unit: 'unidade' },
    { name: 'Lente Vivinex Impress Asférica Monofocal +22.50', category: 'Lentes', quantity: 2, min_stock: 1, unit: 'unidade' },
    { name: 'Lente Vivinex Impress Asférica Monofocal +23.00', category: 'Lentes', quantity: 2, min_stock: 1, unit: 'unidade' },
    { name: 'Lente Vivinex Impress Asférica Monofocal +23.50', category: 'Lentes', quantity: 2, min_stock: 1, unit: 'unidade' },
    { name: 'Lente Vivinex Impress Asférica Monofocal +24.00', category: 'Lentes', quantity: 1, min_stock: 1, unit: 'unidade' },
];

async function insertLenses() {
    console.log('Inserting lenses...');
    const { data, error } = await supabase
        .from('inventory')
        .insert(lenses);

    if (error) {
        console.error('Error inserting lenses:', error);
    } else {
        console.log('Lenses inserted successfully:', data);
    }
}

insertLenses();
