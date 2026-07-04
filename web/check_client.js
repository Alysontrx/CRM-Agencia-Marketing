import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hcwtqiqlrlcyzngtuzsf.supabase.co';
const supabaseKey = 'sb_publishable_H8YHt50L1kkKA78cQzeZsw_76YrcHOd';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: cls, error } = await supabase.from('clientes').select('*');
  console.log('Clientes:', cls);
  console.log('Error:', error);
}
check();
