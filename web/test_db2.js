import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hcwtqiqlrlcyzngtuzsf.supabase.co';
const supabaseKey = 'sb_publishable_H8YHt50L1kkKA78cQzeZsw_76YrcHOd';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('tarefas').select('*');
  if (data && data.length > 0) {
    data.slice(-6).forEach(t => {
      console.log(`ID: ${t.id}, Titulo: ${t.titulo}, Criado_em: ${t.criado_em}, Status: ${t.status}, Resp_id: ${t.responsavel_id}`);
    });
  }
}
test();
