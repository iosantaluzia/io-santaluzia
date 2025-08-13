
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
  const emailUser = Deno.env.get('EMAIL_USER');
  const emailPassword = Deno.env.get('EMAIL_PASSWORD');
  
  if (!emailUser || !emailPassword) {
    throw new Error('Credenciais de email não configuradas');
  }

  console.log('Conectando ao servidor IMAP: email-ssl.com.br:993');
  
  // Por enquanto, vamos simular emails para testar a interface
  // Em produção, implementaríamos a conexão IMAP real aqui
  const mockEmails: ImapEmail[] = [
    {
      messageId: '<test-001@iosantaluzia.com.br>',
      subject: 'Consulta de Retorno - Maria Silva',
      from: { name: 'Maria Silva', address: 'maria.silva@gmail.com' },
      to: [{ name: 'Financeiro IO Santa Luzia', address: 'financeiro@iosantaluzia.com.br' }],
      date: new Date(),
      text: 'Bom dia! Gostaria de agendar uma consulta de retorno para próxima semana. Meu último exame foi em dezembro e preciso fazer o acompanhamento.',
      html: '<p>Bom dia!</p><p>Gostaria de agendar uma consulta de retorno para próxima semana. Meu último exame foi em dezembro e preciso fazer o acompanhamento.</p>',
      flags: ['UNSEEN'],
      size: 1024
    },
    {
      messageId: '<test-002@supplier.com>',
      subject: 'Proposta Comercial - Equipamentos Oftalmológicos',
      from: { name: 'João Fornecedor', address: 'joao@medequip.com.br' },
      to: [{ name: 'Financeiro IO Santa Luzia', address: 'financeiro@iosantaluzia.com.br' }],
      date: new Date(Date.now() - 86400000), // 1 dia atrás
      text: 'Prezados, segue em anexo nossa proposta para equipamentos oftalmológicos conforme solicitado.',
      html: '<p>Prezados,</p><p>Segue em anexo nossa proposta para equipamentos oftalmológicos conforme solicitado.</p>',
      flags: ['SEEN'],
      size: 2048,
      attachments: [{ filename: 'proposta_equipamentos.pdf', size: 150000 }]
    },
    {
      messageId: '<test-003@paciente.com>',
      subject: 'Dúvida sobre Cirurgia de Catarata',
      from: { name: 'José Santos', address: 'jose.santos@hotmail.com' },
      to: [{ name: 'Financeiro IO Santa Luzia', address: 'financeiro@iosantaluzia.com.br' }],
      date: new Date(Date.now() - 172800000), // 2 dias atrás
      text: 'Olá, gostaria de tirar algumas dúvidas sobre o procedimento de cirurgia de catarata e os valores.',
      html: '<p>Olá,</p><p>Gostaria de tirar algumas dúvidas sobre o procedimento de cirurgia de catarata e os valores.</p>',
      flags: ['SEEN'],
      size: 856
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

    console.log('Iniciando sincronização de emails...');
    
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
          console.error('Erro ao inserir email:', insertError);
        } else {
          newCount++;
          console.log(`Novo email inserido: ${email.subject}`);
        }
      }
      
      processedCount++;
    }

    console.log(`Sincronização concluída. Processados: ${processedCount}, Novos: ${newCount}`);

    return new Response(
      JSON.stringify({
        success: true,
        processed: processedCount,
        new: newCount,
        message: 'Sincronização de emails concluída com sucesso'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error) {
    console.error('Erro na sincronização de emails:', error);
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
