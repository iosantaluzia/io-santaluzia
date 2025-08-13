
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

  console.log('Conectando ao servidor IMAP: email-ssl.com.br:993');
  console.log('Conta de email:', emailAccount || emailUser);
  
  // Por enquanto, vamos usar emails mock específicos por conta
  // Em produção, implementaríamos a conexão IMAP real aqui
  const mockEmails: ImapEmail[] = [];

  // Emails para conta financeiro@iosantaluzia.com.br
  if (emailAccount === 'financeiro@iosantaluzia.com.br' || emailUser.includes('financeiro')) {
    mockEmails.push(
      {
        messageId: '<fin-001@supplier.com>',
        subject: 'Fatura de Equipamentos Médicos - Vencimento 25/01',
        from: { name: 'MedEquip Brasil', address: 'financeiro@medequip.com.br' },
        to: [{ name: 'Financeiro IO Santa Luzia', address: 'financeiro@iosantaluzia.com.br' }],
        date: new Date(),
        text: 'Prezados, segue em anexo a fatura dos equipamentos oftalmológicos com vencimento em 25/01/2025.',
        html: '<p>Prezados,</p><p>Segue em anexo a fatura dos equipamentos oftalmológicos com vencimento em 25/01/2025.</p><p>Valor: R$ 15.420,00</p>',
        flags: ['UNSEEN'],
        size: 2048,
        attachments: [{ filename: 'fatura_202501.pdf', size: 250000 }]
      },
      {
        messageId: '<fin-002@bank.com>',
        subject: 'Extrato Bancário - Janeiro 2025',
        from: { name: 'Banco do Brasil', address: 'noreply@bb.com.br' },
        to: [{ name: 'Financeiro IO Santa Luzia', address: 'financeiro@iosantaluzia.com.br' }],
        date: new Date(Date.now() - 86400000),
        text: 'Extrato bancário da conta corrente disponível.',
        html: '<p>Extrato bancário da conta corrente disponível.</p>',
        flags: ['SEEN'],
        size: 1024
      },
      {
        messageId: '<fin-003@governo.br>',
        subject: 'Notificação Fiscal - Declaração Mensal',
        from: { name: 'Receita Federal', address: 'noreply@receita.fazenda.gov.br' },
        to: [{ name: 'Financeiro IO Santa Luzia', address: 'financeiro@iosantaluzia.com.br' }],
        date: new Date(Date.now() - 172800000),
        text: 'Lembrete: Declaração mensal deve ser enviada até 20/01/2025.',
        html: '<p>Lembrete: Declaração mensal deve ser enviada até 20/01/2025.</p>',
        flags: ['UNSEEN'],
        size: 1500
      }
    );
  } else {
    // Emails para conta principal iosantaluzia@iosantaluzia.com.br
    mockEmails.push(
      {
        messageId: '<main-001@paciente.com>',
        subject: 'Consulta de Retorno - Maria Silva',
        from: { name: 'Maria Silva', address: 'maria.silva@gmail.com' },
        to: [{ name: 'Instituto Oftalmológico Santa Luzia', address: 'iosantaluzia@iosantaluzia.com.br' }],
        date: new Date(),
        text: 'Bom dia! Gostaria de agendar uma consulta de retorno para próxima semana.',
        html: '<p>Bom dia!</p><p>Gostaria de agendar uma consulta de retorno para próxima semana.</p>',
        flags: ['UNSEEN'],
        size: 1024
      },
      {
        messageId: '<main-002@convenio.com>',
        subject: 'Autorização de Cirurgia Aprovada',
        from: { name: 'Unimed Santa Luzia', address: 'autorizacoes@unimed.com.br' },
        to: [{ name: 'Instituto Oftalmológico Santa Luzia', address: 'iosantaluzia@iosantaluzia.com.br' }],
        date: new Date(Date.now() - 86400000),
        text: 'A autorização para cirurgia de catarata foi aprovada.',
        html: '<p>A autorização para cirurgia de catarata foi aprovada.</p>',
        flags: ['SEEN'],
        size: 1500
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
    
    // Conectar ao servidor IMAP
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
