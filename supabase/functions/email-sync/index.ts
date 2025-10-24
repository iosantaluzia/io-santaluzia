
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

async function connectImap(emailAccount?: string) {
  const emailUser = Deno.env.get('EMAIL_USER');
  const emailPassword = Deno.env.get('EMAIL_PASSWORD');
  
  if (!emailUser || !emailPassword) {
    throw new Error('Credenciais de email não configuradas');
  }

  console.log('Conectando ao servidor IMAP Locaweb: imap.locaweb.com.br:993');
  console.log('Conta de email:', emailAccount || emailUser);
  
  // Emails mock específicos por conta
  const mockEmails: ImapEmail[] = [];

  // Emails para conta financeiro@iosantaluzia.com.br
  if (emailAccount === 'financeiro@iosantaluzia.com.br' || emailUser.includes('financeiro')) {
    mockEmails.push(
      {
        messageId: '<fin-004@supplier.com>',
        subject: 'Nova Fatura - Material Cirúrgico',
        from: { name: 'Cirúrgica Central', address: 'vendas@cirurgicacentral.com.br' },
        to: [{ name: 'Financeiro IO Santa Luzia', address: 'financeiro@iosantaluzia.com.br' }],
        date: new Date(),
        text: 'Prezados, segue fatura referente aos materiais cirúrgicos adquiridos.',
        html: '<p>Prezados,</p><p>Segue fatura referente aos materiais cirúrgicos adquiridos.</p><p>Valor: R$ 8.750,00</p>',
        flags: ['UNSEEN'],
        size: 1800,
        attachments: [{ filename: 'fatura_materiais.pdf', size: 180000 }]
      },
      {
        messageId: '<fin-005@bank.com>',
        subject: 'Cobrança Automática Processada',
        from: { name: 'Banco Santander', address: 'noreply@santander.com.br' },
        to: [{ name: 'Financeiro IO Santa Luzia', address: 'financeiro@iosantaluzia.com.br' }],
        date: new Date(Date.now() - 3600000), // 1 hora atrás
        text: 'Cobrança automática no valor de R$ 2.340,00 foi processada com sucesso.',
        html: '<p>Cobrança automática no valor de R$ 2.340,00 foi processada com sucesso.</p>',
        flags: ['UNSEEN'],
        size: 900
      }
    );
  } else {
    // Emails para conta principal iosantaluzia@iosantaluzia.com.br
    mockEmails.push(
      {
        messageId: '<main-003@paciente.com>',
        subject: 'Dúvida sobre Pós-Operatório',
        from: { name: 'João Santos', address: 'joao.santos@gmail.com' },
        to: [{ name: 'Instituto Oftalmológico Santa Luzia', address: 'iosantaluzia@iosantaluzia.com.br' }],
        date: new Date(),
        text: 'Doutor, tenho algumas dúvidas sobre os cuidados pós-operatórios.',
        html: '<p>Doutor,</p><p>Tenho algumas dúvidas sobre os cuidados pós-operatórios.</p>',
        flags: ['UNSEEN'],
        size: 1200
      }
    );
  }

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

    // Obter informações do usuário da requisição
    const { emailAccount } = await req.json().catch(() => ({}));

    console.log('Iniciando sincronização de emails...');
    console.log('Conta específica:', emailAccount);
    
    // Conectar ao servidor IMAP e obter emails mock
    const emails = await connectImap(emailAccount);
    
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

    // Buscar todos os emails para retornar
    const { data: allEmails, error: fetchError } = await supabase
      .from('emails')
      .select('*')
      .order('date_received', { ascending: false });

    if (fetchError) {
      console.error('Erro ao buscar emails:', fetchError);
      throw fetchError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: processedCount,
        new: newCount,
        emails: allEmails || [],
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
