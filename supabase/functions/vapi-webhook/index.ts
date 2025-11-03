import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const VAPI_PRIVATE_KEY = Deno.env.get('VAPI_PRIVATE_KEY') || 'f5f59844-231f-4d0d-a4b2-bc7d8933bed6';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface VapiWebhookPayload {
  message?: {
    type: string;
    functionCall?: {
      name: string;
      parameters?: {
        patientName?: string;
        patientPhone?: string;
        patientEmail?: string;
        patientCPF?: string;
        appointmentDate?: string;
        appointmentTime?: string;
        doctor?: string;
        appointmentType?: string;
        notes?: string;
      };
    };
  };
  call?: {
    id: string;
    status: string;
    endedReason?: string;
    customer?: {
      number?: string;
    };
  };
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    // Verificar autenticação (Vapi pode enviar o token no header)
    const authHeader = req.headers.get('authorization') || req.headers.get('x-vapi-secret');
    
    // Se não houver header de auth, aceitar apenas se for webhook interno
    if (authHeader && !authHeader.includes(VAPI_PRIVATE_KEY)) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const payload: VapiWebhookPayload = await req.json();
    console.log('Webhook recebido da Vapi:', JSON.stringify(payload, null, 2));

    // Processar quando a chamada coletar informações de agendamento via function call
    if (payload.message?.type === 'function-call' && payload.message.functionCall?.name === 'schedule_appointment') {
      const params = payload.message.functionCall.parameters;
      
      if (!params) {
        return new Response(
          JSON.stringify({ error: 'Missing parameters' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Buscar ou criar paciente
      let patientId: string;
      
      // Verificar se paciente já existe pelo telefone ou CPF
      let existingPatient = null;
      if (params.patientPhone) {
        const { data: patientByPhone } = await supabase
          .from('patients')
          .select('id')
          .eq('phone', params.patientPhone)
          .maybeSingle();
        existingPatient = patientByPhone;
      }
      
      if (!existingPatient && params.patientCPF) {
        const { data: patientByCPF } = await supabase
          .from('patients')
          .select('id')
          .eq('cpf', params.patientCPF.replace(/\D/g, ''))
          .maybeSingle();
        existingPatient = patientByCPF;
      }

      if (existingPatient) {
        patientId = existingPatient.id;
        
        // Atualizar dados do paciente se necessário
        await supabase
          .from('patients')
          .update({
            name: params.patientName,
            phone: params.patientPhone,
            email: params.patientEmail,
            cpf: params.patientCPF?.replace(/\D/g, ''),
            updated_at: new Date().toISOString(),
          })
          .eq('id', patientId);
      } else {
        // Criar novo paciente
        // CPF pode ser opcional, então geramos um temporário se não houver
        const cpfValue = params.patientCPF?.replace(/\D/g, '') || `TEMP-${Date.now()}`;
        const dateOfBirth = params.patientCPF ? '1990-01-01' : null; // Data padrão se não houver CPF
        
        const { data: newPatient, error: patientError } = await supabase
          .from('patients')
          .insert({
            name: params.patientName || 'Paciente sem nome',
            phone: params.patientPhone || '',
            email: params.patientEmail,
            cpf: cpfValue,
            date_of_birth: dateOfBirth,
            created_by: 'vapi-voice-chat',
          })
          .select('id')
          .single();

        if (patientError || !newPatient) {
          console.error('Erro ao criar paciente:', patientError);
          throw new Error('Erro ao criar paciente');
        }
        
        patientId = newPatient.id;
      }

      // Criar agendamento (consulta futura)
      // Parsear data e hora
      let appointmentDateTime: Date;
      if (params.appointmentDate && params.appointmentTime) {
        // Formato esperado: "2024-02-15" e "14:30"
        const [datePart] = params.appointmentDate.split('T');
        appointmentDateTime = new Date(`${datePart}T${params.appointmentTime}:00`);
      } else {
        // Se não houver data/hora específica, usar data atual + 1 dia
        appointmentDateTime = new Date();
        appointmentDateTime.setDate(appointmentDateTime.getDate() + 1);
        appointmentDateTime.setHours(9, 0, 0, 0);
      }

      // Determinar nome do médico
      let doctorName = 'Dr. Matheus';
      if (params.doctor === 'fabiola' || params.doctor?.toLowerCase().includes('fabiola')) {
        doctorName = 'Dra. Fabíola';
      }

      const { data: appointment, error: appointmentError } = await supabase
        .from('consultations')
        .insert({
          patient_id: patientId,
          doctor_name: doctorName,
          consultation_date: appointmentDateTime.toISOString(),
          anamnesis: params.appointmentType || 'Consulta agendada via Voice Chat',
          observations: `Agendamento realizado via Voice Chat (Vapi)\n${params.notes || ''}\nTelefone: ${params.patientPhone}\nEmail: ${params.patientEmail || 'Não informado'}`,
          status: 'scheduled',
          created_by: 'vapi-voice-chat',
        })
        .select()
        .single();

      if (appointmentError) {
        console.error('Erro ao criar agendamento:', appointmentError);
        throw appointmentError;
      }

      console.log('Agendamento criado com sucesso:', appointment.id);

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Agendamento criado com sucesso',
          appointmentId: appointment.id,
          patientId: patientId,
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Retornar resposta padrão para outros eventos
    return new Response(
      JSON.stringify({ received: true, message: 'Webhook processado com sucesso' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );

  } catch (error: any) {
    console.error('Erro no webhook da Vapi:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erro interno do servidor' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});

