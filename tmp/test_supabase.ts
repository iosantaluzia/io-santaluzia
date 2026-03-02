import { supabase } from '../src/integrations/supabase/client';

(async () => {
  const { data, error } = await supabase
    .from('patients')
    .select('id, name, address, date_of_birth')
    .limit(5);
  console.log('Data:', data);
  if (error) console.error('Error:', error);
})();
