// Armazenamento local para lista de espera (fallback quando Supabase não está disponível)
import { toast } from 'sonner';

export interface WaitlistEntry {
  id: string;
  patient_name: string;
  phone: string;
  observations?: string;
  contact_attempts: number;
  status: string;
  patient_id?: string;
  scheduled_consultation_id?: string;
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = 'waitlist_entries';
const PATIENTS_DATA_KEY = 'waitlist_patients_imported';

// Dados iniciais dos pacientes
const initialPatientsData = [
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

// Gerar ID único
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Obter todas as entradas do localStorage
export function getLocalWaitlistEntries(): WaitlistEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Erro ao ler localStorage:', error);
    return [];
  }
}

// Salvar entradas no localStorage
function saveLocalWaitlistEntries(entries: WaitlistEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Erro ao salvar localStorage:', error);
    toast.error('Erro ao salvar dados localmente');
  }
}

// Inicializar pacientes padrão no localStorage
export function initializeLocalWaitlist(): void {
  // Verificar se já foram importados
  const imported = localStorage.getItem(PATIENTS_DATA_KEY);
  if (imported === 'true') {
    return; // Já foram importados
  }

  // Criar entradas a partir dos dados iniciais
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const entries: WaitlistEntry[] = initialPatientsData.map(patient => ({
    id: generateId(),
    patient_name: patient.patient_name,
    phone: patient.phone,
    observations: patient.observations || undefined,
    contact_attempts: 0,
    status: 'waiting',
    created_at: today.toISOString(),
    updated_at: today.toISOString()
  }));

  // Salvar no localStorage
  saveLocalWaitlistEntries(entries);
  localStorage.setItem(PATIENTS_DATA_KEY, 'true');
  
  console.log(`✅ ${entries.length} pacientes adicionados à lista de espera local`);
}

// Adicionar nova entrada
export function addLocalWaitlistEntry(entry: Omit<WaitlistEntry, 'id' | 'created_at' | 'updated_at'>): WaitlistEntry {
  const newEntry: WaitlistEntry = {
    ...entry,
    id: generateId(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const entries = getLocalWaitlistEntries();
  entries.push(newEntry);
  saveLocalWaitlistEntries(entries);
  
  return newEntry;
}

// Atualizar entrada
export function updateLocalWaitlistEntry(id: string, updates: Partial<Omit<WaitlistEntry, 'id' | 'created_at'>>): boolean {
  const entries = getLocalWaitlistEntries();
  const index = entries.findIndex(e => e.id === id);
  
  if (index === -1) return false;
  
  entries[index] = {
    ...entries[index],
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  saveLocalWaitlistEntries(entries);
  return true;
}

// Incrementar tentativas de contato
export function incrementLocalContactAttempts(id: string): boolean {
  const entries = getLocalWaitlistEntries();
  const entry = entries.find(e => e.id === id);
  
  if (!entry) return false;
  
  entry.contact_attempts += 1;
  entry.updated_at = new Date().toISOString();
  saveLocalWaitlistEntries(entries);
  
  return true;
}

// Remover entrada
export function removeLocalWaitlistEntry(id: string): boolean {
  const entries = getLocalWaitlistEntries();
  const filtered = entries.filter(e => e.id !== id);
  
  if (filtered.length === entries.length) return false;
  
  saveLocalWaitlistEntries(filtered);
  return true;
}

// Limpar todos os dados (para testes)
export function clearLocalWaitlist(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(PATIENTS_DATA_KEY);
}

