import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hcwtqiqlrlcyzngtuzsf.supabase.co';
const supabaseKey = 'sb_publishable_H8YHt50L1kkKA78cQzeZsw_76YrcHOd';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: ags } = await supabase.from('agencias').select('*');
  console.log('Agencias:', ags);
  
  const { data: cls } = await supabase.from('clientes').select('*');
  console.log('Clientes:', cls);
  
  const { data: usr } = await supabase.from('usuarios').select('*');
  console.log('Usuarios:', usr);
}
check();
