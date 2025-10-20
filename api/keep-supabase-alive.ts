// Vercel Serverless Function - Keep Supabase Alive
// Esta função faz ping no Supabase para mantê-lo ativo

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://aobjtwikccovikmfoicg.supabase.co';
  const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

  try {
    console.log('🔄 Keep-alive ping iniciado:', new Date().toISOString());

    // Fazer ping no health endpoint do Supabase
    const healthResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'HEAD',
      headers: {
        'apikey': SUPABASE_KEY || '',
        'Authorization': `Bearer ${SUPABASE_KEY || ''}`
      }
    });

    // Fazer ping no auth endpoint também
    const authResponse = await fetch(`${SUPABASE_URL}/auth/v1/health`, {
      headers: {
        'apikey': SUPABASE_KEY || ''
      }
    });

    const authData = await authResponse.json();

    console.log('✅ Ping bem-sucedido!');
    console.log('REST API Status:', healthResponse.status);
    console.log('Auth Status:', authData);

    return res.status(200).json({
      success: true,
      message: 'Supabase keep-alive ping successful',
      timestamp: new Date().toISOString(),
      supabaseUrl: SUPABASE_URL,
      restApiStatus: healthResponse.status,
      authHealth: authData
    });

  } catch (error) {
    console.error('❌ Erro no keep-alive:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Keep-alive ping failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}

