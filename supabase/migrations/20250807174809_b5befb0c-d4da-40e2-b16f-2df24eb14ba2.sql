
-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('admin', 'doctor', 'secretary');

-- Create users table for the application (separate from auth.users)
CREATE TABLE public.app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'secretary',
  approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by VARCHAR(50),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all app_users" ON public.app_users
  FOR SELECT USING (true);

CREATE POLICY "Admin users can manage app_users" ON public.app_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.app_users au 
      WHERE au.auth_user_id = auth.uid() 
      AND au.role IN ('admin', 'doctor', 'secretary')
    )
  );

-- Insert the three initial users (they will need to sign up first in Supabase Auth)
-- Note: These will be linked to actual auth.users after they sign up
INSERT INTO public.app_users (username, role, approved, created_by) VALUES
  ('matheus', 'doctor', true, 'system'),
  ('fabiola', 'doctor', true, 'system'),
  ('iosantaluzia', 'secretary', true, 'system');

-- Create function to handle user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user already exists in app_users by username
  UPDATE public.app_users 
  SET auth_user_id = NEW.id, 
      updated_at = now()
  WHERE username = LOWER(NEW.raw_user_meta_data->>'username')
    AND auth_user_id IS NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to link auth.users with app_users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
