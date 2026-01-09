/**
 * Zod validation schemas for form inputs
 * SECURITY: Validates and sanitizes user input before saving to database
 */
import { z } from 'zod';
import { parseCurrency } from './currency';

// CPF validation schema
export const cpfSchema = z.string()
  .min(11, 'CPF deve ter 11 dígitos')
  .max(14, 'CPF inválido')
  .refine((cpf) => {
    const numbers = cpf.replace(/\D/g, '');
    if (numbers.length !== 11) return false;
    
    // Basic CPF validation algorithm
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers[i]) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers[9])) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers[i]) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    return remainder === parseInt(numbers[10]);
  }, 'CPF inválido');

// Phone validation schema (Brazilian format)
export const phoneSchema = z.string()
  .min(10, 'Telefone deve ter pelo menos 10 dígitos')
  .max(15, 'Telefone inválido')
  .refine((phone) => {
    const numbers = phone.replace(/\D/g, '');
    return numbers.length >= 10 && numbers.length <= 11;
  }, 'Telefone inválido');

// Email validation schema
export const emailSchema = z.string()
  .email('Email inválido')
  .max(255, 'Email muito longo');

// CEP validation schema (Brazilian postal code)
export const cepSchema = z.string()
  .min(8, 'CEP deve ter 8 dígitos')
  .max(10, 'CEP inválido')
  .refine((cep) => {
    const numbers = cep.replace(/\D/g, '');
    return numbers.length === 8;
  }, 'CEP inválido');

// Name validation schema
export const nameSchema = z.string()
  .min(2, 'Nome deve ter pelo menos 2 caracteres')
  .max(255, 'Nome muito longo')
  .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras');

// Appointment form schema
export const appointmentFormSchema = z.object({
  name: nameSchema,
  cpf: cpfSchema.optional().or(z.literal('')),
  phone: phoneSchema,
  date_of_birth: z.string().optional().or(z.literal('')),
  email: emailSchema.optional().or(z.literal('')),
  address: z.string().max(500, 'Endereço muito longo').optional(),
  cep: cepSchema.optional().or(z.literal('')),
  city: z.string().max(100, 'Cidade muito longa').optional(),
  doctor: z.string().min(1, 'Selecione um médico'),
  time: z.string().min(1, 'Selecione um horário'),
  appointmentType: z.string().min(1, 'Selecione o tipo de consulta'),
  amount: z.union([z.string(), z.number()]).optional().transform((val) => {
    if (val === '' || val === null || val === undefined) return undefined;
    const num = typeof val === 'string' ? parseCurrency(val) : val;
    return isNaN(num) || num < 0 ? undefined : num;
  }),
  notes: z.string().max(1000, 'Observações muito longas').optional()
});

// Consultation form schema
export const consultationFormSchema = z.object({
  doctor_name: z.string().min(1, 'Nome do médico é obrigatório').max(255),
  consultation_date: z.string().datetime('Data inválida'),
  anamnesis: z.string().max(5000, 'Anamnese muito longa').optional(),
  physical_exam: z.string().max(5000, 'Exame físico muito longo').optional(),
  visual_acuity_od: z.string().max(20).optional(),
  visual_acuity_oe: z.string().max(20).optional(),
  ocular_pressure_od: z.string().max(20).optional(),
  ocular_pressure_oe: z.string().max(20).optional(),
  biomicroscopy: z.string().max(5000).optional(),
  diagnosis: z.string().max(2000).optional(),
  prescription: z.string().max(2000).optional(),
  observations: z.string().max(5000).optional(),
  amount: z.union([z.string(), z.number()]).optional().transform((val) => {
    if (val === '' || val === null || val === undefined) return undefined;
    const num = typeof val === 'string' ? parseCurrency(val) : val;
    return isNaN(num) || num < 0 ? undefined : num;
  })
});

// Patient form schema
export const patientFormSchema = z.object({
  name: nameSchema,
  cpf: cpfSchema.optional().or(z.literal('')),
  date_of_birth: z.string().optional().or(z.literal('')),
  phone: phoneSchema.optional(),
  email: emailSchema.optional().or(z.literal('')),
  address: z.string().max(500).optional(),
  emergency_contact: z.string().max(255).optional(),
  emergency_phone: phoneSchema.optional(),
  medical_history: z.string().max(5000).optional(),
  allergies: z.string().max(1000).optional(),
  medications: z.string().max(1000).optional()
});

export type AppointmentFormData = z.infer<typeof appointmentFormSchema>;
export type ConsultationFormData = z.infer<typeof consultationFormSchema>;
export type PatientFormData = z.infer<typeof patientFormSchema>;

