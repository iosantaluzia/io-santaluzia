
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ImapEmail {
  messageId: string;
  subject: string;
  from: { name?: string; address: string };
  to: { name?: string; address: string }[];
  cc?: { name?: string; address: string }[];
  bcc?: { name?: string; address: string }[];
  date: Date;
  text?: string;
  html?: string;
  attachments?: any[];
  inReplyTo?: string;
  references?: string[];
  flags?: string[];
  size?: number;
  headers?: any;
}

async function connectImap() {
  // Esta é uma simulação da conexão IMAP
  // Em produção, usaríamos uma biblioteca como node-imap ou similar
  const emailUser = Deno.env.get('EMAIL_USER');
  const emailPassword = Deno.env.get('EMAIL_PASSWORD');
  
  if (!emailUser || !emailPassword) {
    throw new Error('Email credentials not configured');
  }

  console.log('Connecting to IMAP server: email-ssl.com.br:993');
  
  // Simulação de emails recebidos (substituir por implementação IMAP real)
  const mockEmails: ImapEmail[] = [
    {
      messageId: '<mock-001@test.com>',
      subject: 'Consulta de Retorno',
      from: { name: 'Maria Silva', address: 'maria@example.com' },
      to: [{ name: 'Financeiro', address: 'financeiro@iosantaluzia.com.br' }],
      date: new Date(),
      text: 'Gostaria de agendar uma consulta de retorno para próxima semana.',
      html: '<p>Gostaria de agendar uma consulta de retorno para próxima semana.</p>',
      flags: ['UNSEEN'],
      size: 1024
    },
    {
      messageId: '<mock-002@supplier.com>',
      subject: 'Proposta Comercial - Equipamentos',
      from: { name: 'João Fornecedor', address: 'joao@supplier.com' },
      to: [{ name: 'Financeiro', address: 'financeiro@iosantaluzia.com.br' }],
      date: new Date(Date.now() - 86400000), // 1 day ago
      text: 'Segue nossa proposta para equipamentos oftalmológicos.',
      html: '<p>Segue nossa proposta para equipamentos oftalmológicos.</p>',
      flags: ['SEEN'],
      size: 2048,
      attachments: [{ filename: 'proposta.pdf', size: 50000 }]
    }
  ];

  return mockEmails;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting email sync...');
    
    // Conectar ao servidor IMAP
    const emails = await connectImap();
    
    let processedCount = 0;
    let newCount = 0;

    for (const email of emails) {
      // Verificar se o email já existe
      const { data: existing } = await supabase
        .from('emails')
        .select('id')
        .eq('message_id', email.messageId)
        .single();

      if (!existing) {
        // Inserir novo email
        const { error: insertError } = await supabase
          .from('emails')
          .insert({
            message_id: email.messageId,
            subject: email.subject,
            from_email: email.from.address,
            from_name: email.from.name || null,
            to_email: email.to[0]?.address || '',
            to_name: email.to[0]?.name || null,
            cc_emails: email.cc?.map(cc => cc.address) || [],
            content_text: email.text || null,
            content_html: email.html || null,
            date_received: email.date.toISOString(),
            is_read: !email.flags?.includes('UNSEEN'),
            has_attachments: (email.attachments?.length || 0) > 0,
            size_bytes: email.size || 0,
            flags: email.flags || [],
            in_reply_to: email.inReplyTo || null,
            references: email.references || [],
            raw_headers: email.headers || {}
          });

        if (insertError) {
          console.error('Error inserting email:', insertError);
        } else {
          newCount++;
          console.log(`Inserted new email: ${email.subject}`);
        }
      }
      
      processedCount++;
    }

    console.log(`Email sync completed. Processed: ${processedCount}, New: ${newCount}`);

    return new Response(
      JSON.stringify({
        success: true,
        processed: processedCount,
        new: newCount,
        message: 'Email sync completed successfully'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error) {
    console.error('Error in email-sync:', error);
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
