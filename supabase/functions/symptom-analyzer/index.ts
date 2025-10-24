
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Iniciando análise de sintomas...');
    
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY não configurada');
      throw new Error('Configuração de API não encontrada');
    }

    const { symptoms } = await req.json();
    
    if (!symptoms || symptoms.trim().length < 3) {
      throw new Error('Por favor, descreva seus sintomas com mais detalhes');
    }

    console.log('Sintomas recebidos:', symptoms);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Você é um especialista em oftalmologia do Instituto de Olhos Santa Luzia que fornece análises educativas iniciais sobre sintomas oculares. IMPORTANTE:

SEMPRE responda em português brasileiro de forma educativa e acessível.
NUNCA forneça diagnósticos definitivos ou substitua consulta médica.
SEMPRE recomende consulta presencial para diagnóstico preciso.
Mantenha respostas concisas (máximo 200 palavras).
Foque em possíveis causas comuns e sinais de alerta.
Use linguagem clara e tranquilizadora.

EXAMES DISPONÍVEIS NO INSTITUTO SANTA LUZIA:
- Exames de Consulta: Acuidade Visual, Refração, Adaptação de Lentes de Contato, Biomicroscopia, Fundoscopia, Mapeamento de Retina, Tonometria
- Equipamentos Especializados: OCT (Tomografia de Coerência Óptica), Pentacam, Topografia Corneana, Aberrômetro, Campimetria, Microscopia Especular, YAG Laser

CIRURGIAS REALIZADAS:
- Catarata, Ceratocone, Cirurgia Refrativa (Miopia, Hipermetropia, Astigmatismo, Presbiopia)
- Anel Intraestromal (Anel Corneano), Crosslinking, Tratamento de Lesões Oculares

Estruture sua resposta assim:
1. Breve explicação do(s) sintoma(s)
2. Possíveis causas comuns
3. Exames que podem ser necessários (mencione os disponíveis no Instituto)
4. Sinais que requerem atenção urgente (se aplicável)
5. Recomendação de consulta médica no Instituto Santa Luzia`
          },
          {
            role: 'user',
            content: `Analise estes sintomas oculares: "${symptoms}"`
          }
        ],
        temperature: 0.7,
        max_tokens: 400,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Erro na API OpenAI:', error);
      throw new Error('Erro no processamento da análise');
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content;

    if (!analysis) {
      console.error('Resposta inválida da OpenAI:', data);
      throw new Error('Não foi possível processar a análise');
    }

    console.log('Análise gerada com sucesso');

    return new Response(
      JSON.stringify({ 
        analysis,
        success: true 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Erro na função symptom-analyzer:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro interno do servidor',
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
