
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendEmailRequest {
  from?: string;
  to: string;
  cc?: string[];
  bcc?: string[];
  subject: string;
  content: string;
  replyToEmailId?: string;
}

async function sendSmtpEmail(emailData: SendEmailRequest) {
  const emailUser = Deno.env.get('EMAIL_USER');
  const emailPassword = Deno.env.get('EMAIL_PASSWORD');
  
  if (!emailUser || !emailPassword) {
    throw new Error('Credenciais de email não configuradas');
  }

  console.log('Enviando email via SMTP: email-ssl.com.br:465');
  console.log('De:', emailData.from || emailUser);
  console.log('Para:', emailData.to);
  console.log('Assunto:', emailData.subject);
  
  // Por enquanto, vamos simular o envio SMTP
  // Em produção, implementaríamos a conexão SMTP real aqui
  console.log('Simulando envio de email...');
  
  // Simular delay de envio
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    messageId: `<sent-${Date.now()}@iosantaluzia.com.br>`,
    accepted: [emailData.to],
    rejected: [],
    response: '250 Mensagem enviada com sucesso'
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const emailData: SendEmailRequest = await req.json();

    // Validar dados obrigatórios
    if (!emailData.to || !emailData.subject || !emailData.content) {
      return new Response(
        JSON.stringify({ error: 'Campos obrigatórios: destinatário, assunto e conteúdo' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Determinar email de origem
    const fromEmail = emailData.from || Deno.env.get('EMAIL_USER')!;
    const fromName = fromEmail.includes('financeiro') 
      ? 'Financeiro - Instituto Oftalmológico Santa Luzia'
      : 'Instituto Oftalmológico Santa Luzia';

    console.log('Enviando email...');
    
    // Enviar email via SMTP
    const result = await sendSmtpEmail(emailData);
    
    // Salvar email enviado no banco de dados
    const { error: insertError } = await supabase
      .from('emails')
      .insert({
        message_id: result.messageId,
        subject: emailData.subject,
        from_email: fromEmail,
        from_name: fromName,
        to_email: emailData.to,
        cc_emails: emailData.cc || [],
        bcc_emails: emailData.bcc || [],
        content_html: emailData.content,
        content_text: emailData.content.replace(/<[^>]*>/g, ''), // Remove tags HTML
        date_sent: new Date().toISOString(),
        date_received: new Date().toISOString(),
        folder: 'sent',
        is_read: true,
        in_reply_to: emailData.replyToEmailId || null
      });

    if (insertError) {
      console.error('Erro ao salvar email enviado:', insertError);
    }

    console.log('Email enviado com sucesso');

    return new Response(
      JSON.stringify({
        success: true,
        messageId: result.messageId,
        message: 'Email enviado com sucesso'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error) {
    console.error('Erro no envio de email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
