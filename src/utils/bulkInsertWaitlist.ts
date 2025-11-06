// Utilitário para inserção em lote de pacientes na lista de espera
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WaitlistPatient {
  patient_name: string;
  phone: string;
  observations?: string | null;
}

// Função para gerar CPF temporário único (para cadastros incompletos)
// Usa um contador interno para garantir unicidade
let tempCPFCounter = 0;
function generateTempCPF(): string {
  tempCPFCounter++;
  // Usar timestamp + contador para garantir unicidade
  const timestamp = Date.now().toString();
  const counter = tempCPFCounter.toString().padStart(4, '0');
  // Combinar e formatar como CPF (11 dígitos)
  const combined = (timestamp.slice(-7) + counter).padStart(11, '0').slice(0, 11);
  return combined.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

const patientsData: WaitlistPatient[] = [
  { patient_name: 'Guilaine Treder Wilhelmm', phone: '(66) 99645-8555', observations: 'Não usa / paciente' },
  { patient_name: 'Vitor Manuel', phone: '(66) 99678-8130', observations: 'Não usa' },
  { patient_name: 'João Vitor da Silva Santana', phone: '(66) 99928-7352', observations: null },
  { patient_name: 'Harris Patrick', phone: '(65) 99626-4268', observations: null },
  { patient_name: 'Jéssica', phone: '(66) 99623-4801', observations: 'Encaixe Unimed / consulta' },
  { patient_name: 'Maria Luiza Quarto', phone: '(66) 99629-9449', observations: null },
  { patient_name: 'Leila Denise dos Santos', phone: '(66) 99985-6768', observations: 'Não usa / paciente / Unimed' },
  { patient_name: 'Antônio Carlos Carrião', phone: '(66) 99928-3840', observations: 'Encaixe' },
  { patient_name: 'Karine Isabelle Bani', phone: '(66) 99604-4752', observations: 'Não usa / Unimed' },
  { patient_name: 'Mayra Thayse Grava Ramos', phone: '(66) 98422-9638', observations: 'Não usa / Unimed' },
  { patient_name: 'Claudine Lopes Theriza Brussaloro', phone: '+1 (587) 936-1695', observations: null },
  { patient_name: 'Janete da Silva Pedroso de Almeida', phone: '(66) 99901-5760', observations: null },
  { patient_name: 'Arthur Sampaio da Silva', phone: '(66) 99686-9763', observations: 'Não usa / Unimed' },
  { patient_name: 'Kamile Zampere', phone: '(66) 99664-6100', observations: 'Não usa / Manchinha nos olhos' },
  { patient_name: 'Bruna de Alencar Souza', phone: '(66) 99903-3988', observations: 'Dor pós operatório' },
  { patient_name: 'Jaqueline dos Santos Filho Rissi', phone: '(66) 99934-9912', observations: 'Não usa / Unimed / Paciente' },
  { patient_name: 'Maria Angelica', phone: '(66) 99685-0905', observations: null },
  { patient_name: 'Gabrielly Alcântara Assunção', phone: '(66) 99628-0323', observations: null },
  { patient_name: 'Ellen Patiana Graciano', phone: '(66) 98439-4686', observations: null },
  { patient_name: 'Larissa Silva Ramos', phone: '(66) 99722-7714', observations: 'Encaixe' },
  { patient_name: 'Dominique Emanuelle dos Santos Benes', phone: '(66) 99627-4747', observations: null },
  { patient_name: 'João Victor Nascimento Cardoso', phone: '(66) 99255-8380', observations: 'Não usa / Unimed / Paciente / Foroni: nunca pode' },
  { patient_name: 'Gabriel dos Santos Pinheiro', phone: '(65) 99283-6575', observations: null },
  { patient_name: 'Clara Silva Lima', phone: '(65) 99952-9756', observations: 'Unimed / Não paciente / Não usa' },
  { patient_name: 'Judite Simão dos Santos', phone: '(65) 99943-1045', observations: 'Unimed' },
  { patient_name: 'Clemilson Acacio Franca', phone: '(66) 99914-1090', observations: 'Unimed / Colazio Palpebral' },
  { patient_name: 'Pollyana Oliveira dos Santos', phone: '(66) 99678-9039', observations: null },
  { patient_name: 'Maria Ap. Oliveira Kaiser', phone: '(66) 99961-6702', observations: null },
  { patient_name: 'Elisabete Olga Souza', phone: '(66) 99959-5211', observations: null },
  { patient_name: 'Rosilene Maria Grein Didone', phone: '(66) 99627-9187', observations: null },
  { patient_name: 'Marlon Menegat', phone: '(66) 99923-4286', observations: null },
  { patient_name: 'Encorre Esposa Dona', phone: '(66) 98407-1806', observations: null },
  { patient_name: 'Vanessa Gisler da Silva', phone: '(65) 99918-0525', observations: 'Unimed / paciente / usa' },
  { patient_name: 'Maristela Inês Jacinto Fanrtti', phone: '(66) 99995-0105', observations: null },
  { patient_name: 'Suelene Callo', phone: '(66) 99930-7780', observations: null },
  { patient_name: 'Nayara Silva França', phone: '(66) 99686-1716', observations: 'Encaixe' },
  { patient_name: 'Jair Dias da Rocha Junior', phone: '(66) 99627-2544', observations: null },
  { patient_name: 'Pamilli Kuwanishi', phone: '(66) 99612-2322', observations: null },
  { patient_name: 'Eduardo Martins (Lara Marilo)', phone: '(66) 97400-3155', observations: 'Paciente Unimed' },
  { patient_name: 'Manuela Dill Schiratto / Caro Dill Schiratto', phone: '(66) 99995-4200', observations: null },
  { patient_name: 'Traci Knab Tumiluro', phone: '(66) 99902-2081', observations: null },
  { patient_name: 'Cristiane Luiz Rodrigues', phone: '(66) 99905-4014', observations: null },
  { patient_name: 'Maicon Cristian da Paz', phone: '(66) 98257-4746', observations: null },
  { patient_name: 'Carla Palhares', phone: '(66) 99997-5406', observations: null },
  { patient_name: 'Cristiane dos Santos', phone: '(66) 99613-9272', observations: null },
  { patient_name: 'Mirtes Bri Bretzke Gratto', phone: '(66) 99647-5587', observations: null },
  { patient_name: 'Rodrigo de Almeida Batista', phone: '(66) 99954-9538', observations: null },
  { patient_name: 'Ruyane Cristina Andrade / Mauricio Bartolito Oliveira', phone: '(66) 99971-1820', observations: 'Encaixe / Unimed' },
  { patient_name: 'Juliana Cardoso Zanrosso', phone: '(66) 99903-1687', observations: 'Encaixe' },
  { patient_name: 'Vitória Maria', phone: '(66) 99230-3122', observations: 'Não usa / paciente / Unimed' },
  { patient_name: 'Erika Fernanda Talido', phone: '(66) 99922-0704', observations: 'Trocar óculos' },
  { patient_name: 'Daiane e Thiago', phone: '(65) 99647-7980', observations: 'Lente gelatinosa / cirurgia' }
];

export async function bulkInsertWaitlistPatients(showToast: boolean = true) {
  try {
    // Verificar quais pacientes já existem na lista de espera para evitar duplicatas
    const { data: existingWaitlist } = await supabase
      .from('waitlist')
      .select('patient_name, phone');

    const existingWaitlistKeys = new Set(
      (existingWaitlist || []).map(p => `${p.patient_name.toLowerCase()}_${p.phone.replace(/\D/g, '')}`)
    );

    // Filtrar apenas pacientes que não existem na lista de espera
    const patientsToProcess = patientsData.filter(patient => {
      const key = `${patient.patient_name.toLowerCase()}_${patient.phone.replace(/\D/g, '')}`;
      return !existingWaitlistKeys.has(key);
    });

    if (patientsToProcess.length === 0) {
      if (showToast) {
        toast.info('Todos os pacientes já estão na lista de espera');
      }
      return { success: true, data: [], inserted: 0 };
    }

    // Data de hoje para todos os registros
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Processar cada paciente: criar/atualizar na tabela patients e adicionar à waitlist
    const waitlistEntries = [];

    for (const patient of patientsToProcess) {
      try {
        // Buscar paciente existente por telefone
        const phoneNumbers = patient.phone.replace(/\D/g, '');
        let patientId: string | null = null;

        // Tentar encontrar paciente existente por telefone
        const { data: existingPatients } = await supabase
          .from('patients')
          .select('id')
          .eq('phone', patient.phone)
          .limit(1);

        if (existingPatients && existingPatients.length > 0) {
          patientId = existingPatients[0].id;
        } else {
          // Criar novo paciente incompleto com CPF temporário único
          let attempts = 0;
          let newPatient = null;
          let patientError = null;
          
          // Tentar criar paciente até conseguir um CPF único
          while (attempts < 5 && !newPatient) {
            const tempCPF = generateTempCPF();
            const { data, error } = await supabase
              .from('patients')
              .insert({
                name: patient.patient_name,
                phone: patient.phone,
                cpf: tempCPF,
                date_of_birth: '1990-01-01', // Data padrão
                email: null,
                address: null,
                created_at: today.toISOString(),
                updated_at: today.toISOString()
              })
              .select('id')
              .single();

            if (error) {
              // Se erro for de CPF duplicado, tentar novamente com outro CPF
              if (error.code === '23505' && error.message.includes('cpf')) {
                attempts++;
                continue;
              }
              patientError = error;
              break;
            }

            newPatient = data;
            break;
          }

          if (patientError || !newPatient) {
            console.error(`Erro ao criar paciente ${patient.patient_name}:`, patientError);
            // Continuar mesmo se não conseguir criar o paciente
            continue;
          }

          if (newPatient) {
            patientId = newPatient.id;
          }
        }

        // Adicionar à lista de espera
        waitlistEntries.push({
          patient_name: patient.patient_name,
          phone: patient.phone,
          observations: patient.observations,
          status: 'waiting',
          contact_attempts: 0,
          patient_id: patientId,
          created_at: today.toISOString(),
          updated_at: today.toISOString()
        });
      } catch (error) {
        console.error(`Erro ao processar paciente ${patient.patient_name}:`, error);
        // Continuar com os próximos pacientes mesmo se houver erro
      }
    }

    if (waitlistEntries.length === 0) {
      if (showToast) {
        toast.error('Não foi possível criar nenhum registro');
      }
      return { success: false, data: [], inserted: 0 };
    }

    // Inserir todos na lista de espera de uma vez
    const { data, error } = await supabase
      .from('waitlist')
      .insert(waitlistEntries)
      .select();

    if (error) {
      console.error('Erro ao inserir na lista de espera:', error);
      // Se a tabela não existir, retornar erro mais amigável
      if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
        console.warn('Tabela waitlist não existe. Execute o script SQL no Supabase Dashboard.');
        if (showToast) {
          toast.error('Tabela waitlist não encontrada. Execute o script SQL no Supabase.');
        }
        return { success: false, error, tableNotFound: true };
      }
      if (showToast) {
        toast.error('Erro ao inserir pacientes na lista de espera: ' + error.message);
      }
      return { success: false, error };
    }

    if (showToast) {
      toast.success(`${data?.length || 0} pacientes adicionados à lista de espera com sucesso!`);
    }
    return { success: true, data, inserted: data?.length || 0 };
  } catch (error) {
    console.error('Erro:', error);
    if (showToast) {
      toast.error('Erro ao inserir pacientes');
    }
    return { success: false, error };
  }
}

