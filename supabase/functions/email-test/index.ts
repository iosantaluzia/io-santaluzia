import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestResult {
  service: string;
  hostname: string;
  port: number;
  success: boolean;
  error?: string;
  responseTime?: number;
}

async function testSmtpConnection(): Promise<TestResult> {
  const startTime = Date.now();
  
  try {
    console.log('Testando conexão SMTP: smtp.locaweb.com.br:587');
    
    const conn = await Deno.connect({
      hostname: 'smtp.locaweb.com.br',
      port: 587,
    });
    
    const responseTime = Date.now() - startTime;
    await conn.close();
    
    return {
      service: 'SMTP',
      hostname: 'smtp.locaweb.com.br',
      port: 587,
      success: true,
      responseTime
    };
    
  } catch (error) {
    return {
      service: 'SMTP',
      hostname: 'smtp.locaweb.com.br',
      port: 587,
      success: false,
      error: error.message,
      responseTime: Date.now() - startTime
    };
  }
}

async function testImapConnection(): Promise<TestResult> {
  const startTime = Date.now();
  
  try {
    console.log('Testando conexão IMAP: imap.locaweb.com.br:993');
    
    const conn = await Deno.connect({
      hostname: 'imap.locaweb.com.br',
      port: 993,
    });
    
    const responseTime = Date.now() - startTime;
    await conn.close();
    
    return {
      service: 'IMAP',
      hostname: 'imap.locaweb.com.br',
      port: 993,
      success: true,
      responseTime
    };
    
  } catch (error) {
    return {
      service: 'IMAP',
      hostname: 'imap.locaweb.com.br',
      port: 993,
      success: false,
      error: error.message,
      responseTime: Date.now() - startTime
    };
  }
}

async function testSmtpSslConnection(): Promise<TestResult> {
  const startTime = Date.now();
  
  try {
    console.log('Testando conexão SMTP SSL: smtp.locaweb.com.br:465');
    
    const conn = await Deno.connect({
      hostname: 'smtp.locaweb.com.br',
      port: 465,
    });
    
    const responseTime = Date.now() - startTime;
    await conn.close();
    
    return {
      service: 'SMTP SSL',
      hostname: 'smtp.locaweb.com.br',
      port: 465,
      success: true,
      responseTime
    };
    
  } catch (error) {
    return {
      service: 'SMTP SSL',
      hostname: 'smtp.locaweb.com.br',
      port: 465,
      success: false,
      error: error.message,
      responseTime: Date.now() - startTime
    };
  }
}

async function testDnsResolution(): Promise<TestResult> {
  const startTime = Date.now();
  
  try {
    console.log('Testando resolução DNS: iosantaluzia.com.br');
    
    // Simular teste de DNS (Deno não tem DNS lookup direto)
    const conn = await Deno.connect({
      hostname: 'iosantaluzia.com.br',
      port: 80,
    });
    
    const responseTime = Date.now() - startTime;
    await conn.close();
    
    return {
      service: 'DNS',
      hostname: 'iosantaluzia.com.br',
      port: 80,
      success: true,
      responseTime
    };
    
  } catch (error) {
    return {
      service: 'DNS',
      hostname: 'iosantaluzia.com.br',
      port: 80,
      success: false,
      error: error.message,
      responseTime: Date.now() - startTime
    };
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Iniciando testes de conectividade de email...');
    
    // Executar todos os testes em paralelo
    const [smtpTest, imapTest, smtpSslTest, dnsTest] = await Promise.all([
      testSmtpConnection(),
      testImapConnection(),
      testSmtpSslConnection(),
      testDnsResolution()
    ]);
    
    const results = [smtpTest, imapTest, smtpSslTest, dnsTest];
    const successCount = results.filter(r => r.success).length;
    const totalTests = results.length;
    
    // Determinar status geral
    let overallStatus = 'success';
    let recommendations: string[] = [];
    
    if (successCount === 0) {
      overallStatus = 'critical';
      recommendations.push('Todos os testes falharam. Verifique a conectividade de rede.');
    } else if (successCount < totalTests) {
      overallStatus = 'warning';
      recommendations.push('Alguns testes falharam. Verifique as configurações específicas.');
    }
    
    // Recomendações específicas
    if (!smtpTest.success && !smtpSslTest.success) {
      recommendations.push('SMTP não está acessível. Verifique firewall e configurações da Locaweb.');
    }
    
    if (!imapTest.success) {
      recommendations.push('IMAP não está acessível. Verifique configurações de recebimento.');
    }
    
    if (!dnsTest.success) {
      recommendations.push('DNS não está resolvendo. Verifique configurações de domínio.');
    }
    
    // Verificar variáveis de ambiente
    const emailUser = Deno.env.get('EMAIL_USER');
    const emailPassword = Deno.env.get('EMAIL_PASSWORD');
    
    const envStatus = {
      EMAIL_USER: emailUser ? 'configurado' : 'não configurado',
      EMAIL_PASSWORD: emailPassword ? 'configurado' : 'não configurado'
    };
    
    if (!emailUser || !emailPassword) {
      recommendations.push('Configure as variáveis EMAIL_USER e EMAIL_PASSWORD no Supabase.');
    }
    
    console.log(`Testes concluídos: ${successCount}/${totalTests} bem-sucedidos`);
    
    return new Response(
      JSON.stringify({
        success: true,
        overallStatus,
        summary: {
          totalTests,
          successCount,
          failureCount: totalTests - successCount
        },
        results,
        environment: envStatus,
        recommendations,
        timestamp: new Date().toISOString(),
        message: `Testes de conectividade concluídos. ${successCount}/${totalTests} serviços acessíveis.`
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error) {
    console.error('Erro nos testes de conectividade:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        message: 'Erro ao executar testes de conectividade'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
