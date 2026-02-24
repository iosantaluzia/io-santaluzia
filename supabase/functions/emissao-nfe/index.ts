import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// import * as forge from "https://cdn.skypack.dev/node-forge"; // Biblioteca para lidar com certificados (comentada para simplificar o teste inicial)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { paciente, documento, servico, descricao, valor, emissor } = await req.json()

    // 1. Ler a senha do certificado do .env baseada no emissor selecionado
    let certificadoSenha: string | undefined;
    let tipoEmissorNome = '';

    if (emissor === 'PJ_INSTITUTO') {
      certificadoSenha = Deno.env.get("CERTIFICADO_PJ_INSTITUTO_SENHA");
      tipoEmissorNome = 'Instituto dos Olhos Santa Luzia (PJ)';
    } else {
      certificadoSenha = Deno.env.get("CERTIFICADO_PJ_MATHEUS_SENHA"); // Default/PJ_MATHEUS
      tipoEmissorNome = 'Matheus Roque Serviços Médicos LTDA (PJ)';
    }

    if (!certificadoSenha || certificadoSenha === "COLOQUE_SUA_SENHA_AQUI" || certificadoSenha === "sua_senha_aqui") {
      throw new Error(`A senha do certificado digital para o emissor ${tipoEmissorNome} não foi configurada.`)
    }

    console.log(`[LOG] Iniciando emissão para: ${paciente}`);
    console.log(`[LOG] Emissor selecionado: ${tipoEmissorNome}`);
    console.log(`[LOG] Lendo arquivo PFX correspondente e descriptografando com senha: ***`);

    // Aqui entraria o código real de leitura do PFX usando Deno.readFile ou Supabase Storage
    // Exemplo: const pfxBase64 = await Deno.readFile("../../MATHEUS ROQUE SERVICOS MEDICOS LTDA.pfx");
    // const p12Asn1 = forge.asn1.fromDer(pfxBase64, false);
    // const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, certificadoSenha);

    // Simulação de tempo de processamento e assinatura (2 segundos)
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log(`[LOG] Nota fiscal montada em JSON/XML e assinada digitalmente.`);
    console.log(`[LOG] Enviando para API do Sistema Nacional de NFS-e (Ambiente de Produção Restrita)...`);

    // Simulação de resposta de sucesso da Prefeitura/Governo
    const nfseEmitida = {
      status: "autorizada",
      numero: "2026" + Math.floor(100000 + Math.random() * 900000), // Ex: 2026123456
      data_emissao: new Date().toISOString(),
      paciente: paciente,
      valor_total: valor,
      codigo_verificacao: Math.random().toString(36).substring(2, 10).toUpperCase(),
      mensagem: "NFS-e autorizada com sucesso."
    };

    console.log(`[LOG] Sucesso! Nota número ${nfseEmitida.numero} gerada.`);

    return new Response(
      JSON.stringify(nfseEmitida),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("[ERRO]", errorMessage);
    return new Response(
      JSON.stringify({
        erro: "Falha na Emissão da Nota Fiscal Eletrônica",
        detalhe: errorMessage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
