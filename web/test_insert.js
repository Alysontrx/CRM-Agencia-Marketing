import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hcwtqiqlrlcyzngtuzsf.supabase.co';
const supabaseKey = 'sb_publishable_H8YHt50L1kkKA78cQzeZsw_76YrcHOd';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: cls } = await supabase.from('clientes').select('id, nome');
  console.log('Clientes:', cls);
  if (!cls || cls.length === 0) return;

  const { data: users } = await supabase.from('usuarios').select('id, nome');
  console.log('Usuarios:', users);
  
  const tarefaMock = {
    titulo: 'Teste',
    cliente_id: cls[0].id,
    responsavel_id: users[0].id,
    prioridade: 'Média',
    setor: 'Design',
    status: 'A fazer',
    checklists: []
  };

  console.log('Tentando inserir:', tarefaMock);
  const { data, error } = await supabase.from('tarefas').insert([tarefaMock]).select();
  console.log('Result:', data);
  console.log('Error:', error);
}

test();
