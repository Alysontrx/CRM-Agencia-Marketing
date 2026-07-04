import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hcwtqiqlrlcyzngtuzsf.supabase.co';
const supabaseKey = 'sb_publishable_H8YHt50L1kkKA78cQzeZsw_76YrcHOd';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const tarefaMock = {
    titulo: 'Teste NULL',
    cliente_id: null,
    responsavel_id: 1,
    prioridade: 'Média',
    setor: 'Design',
    status: 'A fazer',
    checklists: []
  };

  const { data, error } = await supabase.from('tarefas').insert([tarefaMock]).select();
  console.log('Result:', data);
  console.log('Error:', error);
}

test();
