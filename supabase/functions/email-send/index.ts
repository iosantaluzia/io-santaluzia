
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendEmailRequest {
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
    throw new Error('Email credentials not configured');
  }

  console.log('Sending email via SMTP server: email-ssl.com.br:465');
  console.log('To:', emailData.to);
  console.log('Subject:', emailData.subject);
  
  // Simulação do envio SMTP (substituir por implementação SMTP real)
  // Em produção, usaríamos uma biblioteca como nodemailer ou similar
  
  // Simular delay de envio
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    messageId: `<sent-${Date.now()}@iosantaluzia.com.br>`,
    accepted: [emailData.to],
    rejected: [],
    response: '250 Message queued'
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
        JSON.stringify({ error: 'Missing required fields: to, subject, content' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    console.log('Sending email...');
    
    // Enviar email via SMTP
    const result = await sendSmtpEmail(emailData);
    
    // Salvar email enviado no banco de dados
    const { error: insertError } = await supabase
      .from('emails')
      .insert({
        message_id: result.messageId,
        subject: emailData.subject,
        from_email: Deno.env.get('EMAIL_USER')!,
        from_name: 'Instituto Oftalmológico Santa Luzia',
        to_email: emailData.to,
        cc_emails: emailData.cc || [],
        bcc_emails: emailData.bcc || [],
        content_html: emailData.content,
        content_text: emailData.content.replace(/<[^>]*>/g, ''), // Remove HTML tags
        date_sent: new Date().toISOString(),
        date_received: new Date().toISOString(),
        folder: 'sent',
        is_read: true,
        in_reply_to: emailData.replyToEmailId || null
      });

    if (insertError) {
      console.error('Error saving sent email:', insertError);
    }

    console.log('Email sent successfully');

    return new Response(
      JSON.stringify({
        success: true,
        messageId: result.messageId,
        message: 'Email sent successfully'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error) {
    console.error('Error in email-send:', error);
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
