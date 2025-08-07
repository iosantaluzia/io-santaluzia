export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      app_users: {
        Row: {
          approved: boolean | null
          auth_user_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          last_login: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          username: string
        }
        Insert: {
          approved?: boolean | null
          auth_user_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          last_login?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          username: string
        }
        Update: {
          approved?: boolean | null
          auth_user_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          last_login?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      consultations: {
        Row: {
          anamnesis: string | null
          biomicroscopy: string | null
          consultation_date: string
          created_at: string
          created_by: string | null
          diagnosis: string | null
          doctor_name: string
          id: string
          observations: string | null
          ocular_pressure_od: string | null
          ocular_pressure_oe: string | null
          patient_id: string
          physical_exam: string | null
          prescription: string | null
          status: string | null
          updated_at: string
          visual_acuity_od: string | null
          visual_acuity_oe: string | null
        }
        Insert: {
          anamnesis?: string | null
          biomicroscopy?: string | null
          consultation_date?: string
          created_at?: string
          created_by?: string | null
          diagnosis?: string | null
          doctor_name: string
          id?: string
          observations?: string | null
          ocular_pressure_od?: string | null
          ocular_pressure_oe?: string | null
          patient_id: string
          physical_exam?: string | null
          prescription?: string | null
          status?: string | null
          updated_at?: string
          visual_acuity_od?: string | null
          visual_acuity_oe?: string | null
        }
        Update: {
          anamnesis?: string | null
          biomicroscopy?: string | null
          consultation_date?: string
          created_at?: string
          created_by?: string | null
          diagnosis?: string | null
          doctor_name?: string
          id?: string
          observations?: string | null
          ocular_pressure_od?: string | null
          ocular_pressure_oe?: string | null
          patient_id?: string
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
      exam_files: {
        Row: {
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          patient_exam_id: string
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          patient_exam_id: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          patient_exam_id?: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exam_files_patient_exam_id_fkey"
            columns: ["patient_exam_id"]
            isOneToOne: false
            referencedRelation: "patient_exams"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_exams: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          doctor_name: string | null
          exam_date: string
          exam_type: Database["public"]["Enums"]["exam_type"]
          id: string
          patient_id: string
          results: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          doctor_name?: string | null
          exam_date?: string
          exam_type: Database["public"]["Enums"]["exam_type"]
          id?: string
          patient_id: string
          results?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          doctor_name?: string | null
          exam_date?: string
          exam_type?: Database["public"]["Enums"]["exam_type"]
          id?: string
          patient_id?: string
          results?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_exams_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          allergies: string | null
          cpf: string
          created_at: string
          created_by: string | null
          date_of_birth: string
          email: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          id: string
          medical_history: string | null
          medications: string | null
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          allergies?: string | null
          cpf: string
          created_at?: string
          created_by?: string | null
          date_of_birth: string
          email?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          id?: string
          medical_history?: string | null
          medications?: string | null
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          allergies?: string | null
          cpf?: string
          created_at?: string
          created_by?: string | null
          date_of_birth?: string
          email?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          id?: string
          medical_history?: string | null
          medications?: string | null
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_auth_user_if_needed: {
        Args: { username_param: string; password_param: string }
        Returns: {
          user_id: string
          email: string
          success: boolean
        }[]
      }
    }
    Enums: {
      exam_type:
        | "pentacam"
        | "campimetria"
        | "topografia"
        | "microscopia_especular"
        | "oct"
        | "retinografia"
        | "angiofluoresceinografia"
        | "ultrassom_ocular"
      user_role: "admin" | "doctor" | "secretary"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      exam_type: [
        "pentacam",
        "campimetria",
        "topografia",
        "microscopia_especular",
        "oct",
        "retinografia",
        "angiofluoresceinografia",
        "ultrassom_ocular",
      ],
      user_role: ["admin", "doctor", "secretary"],
    },
  },
} as const
