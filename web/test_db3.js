import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hcwtqiqlrlcyzngtuzsf.supabase.co';
const supabaseKey = 'sb_publishable_H8YHt50L1kkKA78cQzeZsw_76YrcHOd';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: users } = await supabase.from('usuarios').select('*');
  console.log('Usuarios:', users?.map(u => ({ id: u.id, nome: u.nome })));
}
test();
