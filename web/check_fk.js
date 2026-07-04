import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hcwtqiqlrlcyzngtuzsf.supabase.co';
const supabaseKey = 'sb_publishable_H8YHt50L1kkKA78cQzeZsw_76YrcHOd';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: cls } = await supabase.from('clientes').select('id, nome');
  console.log('Clientes no DB:', cls);
  
  const { data: users } = await supabase.from('usuarios').select('id, nome');
  console.log('Usuarios no DB:', users);
}
check();
