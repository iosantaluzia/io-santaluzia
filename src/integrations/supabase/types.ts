export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      consultations: {
        Row: {
          amount: number | null
          anamnesis: string | null
          biomicroscopy: string | null
          consultation_date: string
          created_at: string
          created_by: string | null
          diagnosis: string | null
          doctor_name: string
          fundus_exam: string | null
          id: string
          observations: string | null
          ocular_pressure_od: string | null
          ocular_pressure_oe: string | null
          patient_id: string
          payment_received: boolean | null
          physical_exam: string | null
          prescription: string | null
          status: string | null
          updated_at: string
          visual_acuity_od: string | null
          visual_acuity_oe: string | null
        }
        Insert: {
          amount?: number | null
          anamnesis?: string | null
          biomicroscopy?: string | null
          consultation_date?: string
          created_at?: string
          created_by?: string | null
          diagnosis?: string | null
          doctor_name: string
          fundus_exam?: string | null
          id?: string
          observations?: string | null
          ocular_pressure_od?: string | null
          ocular_pressure_oe?: string | null
          patient_id: string
          payment_received?: boolean | null
          physical_exam?: string | null
          prescription?: string | null
          status?: string | null
          updated_at?: string
          visual_acuity_od?: string | null
          visual_acuity_oe?: string | null
        }
        Update: {
          amount?: number | null
          anamnesis?: string | null
          biomicroscopy?: string | null
          consultation_date?: string
          created_at?: string
          created_by?: string | null
          diagnosis?: string | null
          doctor_name?: string
          fundus_exam?: string | null
          id?: string
          observations?: string | null
          ocular_pressure_od?: string | null
          ocular_pressure_oe?: string | null
          patient_id?: string
          payment_received?: boolean | null
          physical_exam?: string | null
          prescription?: string | null
          status?: string | null
          updated_at?: string
          visual_acuity_od?: string | null
          visual_acuity_oe?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      // ... outras tabelas existentes ...
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "admin" | "doctor" | "secretary"
      exam_type:
        | "pentacam"
        | "campimetria"
        | "topografia"
        | "microscopia_especular"
        | "oct"
        | "retinografia"
        | "angiofluoresceinografia"
        | "ultrassom_ocular"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
