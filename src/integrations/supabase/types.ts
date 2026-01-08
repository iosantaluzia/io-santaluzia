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
          saved_at: string | null
          started_at: string | null
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
          saved_at?: string | null
          started_at?: string | null
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
          saved_at?: string | null
          started_at?: string | null
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
      internal_messages: {
        Row: {
          created_at: string | null
          from_username: string
          id: string
          message: string
          message_type: string
          read: boolean | null
          to_username: string | null
        }
        Insert: {
          created_at?: string | null
          from_username: string
          id?: string
          message: string
          message_type?: string
          read?: boolean | null
          to_username?: string | null
        }
        Update: {
          created_at?: string | null
          from_username?: string
          id?: string
          message?: string
          message_type?: string
          read?: boolean | null
          to_username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_from_user"
            columns: ["from_username"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["username"]
          },
          {
            foreignKeyName: "fk_to_user"
            columns: ["to_username"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["username"]
          },
        ]
      }
      patient_exams: {
        Row: {
          amount: number | null
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
          amount?: number | null
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
          amount?: number | null
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
      patient_portal_access_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_portal_access_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "patient_portal_users"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_portal_appointments: {
        Row: {
          appointment_date: string
          appointment_type: string | null
          created_at: string | null
          created_by: string | null
          doctor_name: string
          id: string
          notes: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          appointment_date: string
          appointment_type?: string | null
          created_at?: string | null
          created_by?: string | null
          doctor_name: string
          id?: string
          notes?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_type?: string | null
          created_at?: string | null
          created_by?: string | null
          doctor_name?: string
          id?: string
          notes?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_portal_appointments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "patient_portal_users"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_portal_documents: {
        Row: {
          created_at: string | null
          description: string | null
          doctor_name: string | null
          document_type: string
          exam_date: string | null
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          is_visible: boolean | null
          mime_type: string | null
          title: string
          updated_at: string | null
          uploaded_by: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          doctor_name?: string | null
          document_type: string
          exam_date?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          is_visible?: boolean | null
          mime_type?: string | null
          title: string
          updated_at?: string | null
          uploaded_by?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          doctor_name?: string | null
          document_type?: string
          exam_date?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          is_visible?: boolean | null
          mime_type?: string | null
          title?: string
          updated_at?: string | null
          uploaded_by?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_portal_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "patient_portal_users"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_portal_sessions: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          last_accessed: string | null
          token: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          last_accessed?: string | null
          token: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          last_accessed?: string | null
          token?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_portal_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "patient_portal_users"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_portal_users: {
        Row: {
          cpf: string
          created_at: string | null
          date_of_birth: string | null
          email: string
          email_verification_token: string | null
          email_verified: boolean | null
          full_name: string
          id: string
          is_active: boolean | null
          password_hash: string
          password_reset_expires: string | null
          password_reset_token: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          cpf: string
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          email_verification_token?: string | null
          email_verified?: boolean | null
          full_name: string
          id?: string
          is_active?: boolean | null
          password_hash: string
          password_reset_expires?: string | null
          password_reset_token?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          cpf?: string
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          email_verification_token?: string | null
          email_verified?: boolean | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          password_hash?: string
          password_reset_expires?: string | null
          password_reset_token?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
      cleanup_old_messages: { Args: never; Returns: undefined }
      create_auth_user_if_needed: {
        Args: { password_param: string; username_param: string }
        Returns: {
          email: string
          success: boolean
          user_id: string
        }[]
      }
      hash_password: { Args: { password: string }; Returns: string }
      insert_consultation_with_amount: {
        Args: {
          p_amount?: number
          p_consultation_date: string
          p_created_by?: string
          p_doctor_name: string
          p_observations?: string
          p_patient_id: string
          p_payment_received?: boolean
          p_status?: string
        }
        Returns: string
      }
      validate_cpf: { Args: { cpf: string }; Returns: boolean }
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
