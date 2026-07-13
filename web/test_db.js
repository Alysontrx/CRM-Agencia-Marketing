import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hcwtqiqlrlcyzngtuzsf.supabase.co';
const supabaseKey = 'sb_publishable_H8YHt50L1kkKA78cQzeZsw_76YrcHOd';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const leadsExtras = [
    { empresa: 'Restaurante Sabor', contato: 'Carlos', telefone: '(11) 9999-8888', origem: 'Instagram', valor_estimado: 1200, status: 'Prospect', data_criacao: '2026-07-01' }
  ];
  const { data, error } = await supabase.from('leads').insert(leadsExtras).select();
  console.log('Leads Insert:', data, error);

  const tarefasExtras = [
    { titulo: 'Teste 123', cliente_id: 1, responsavel_id: 1, setor: 'Social Media', prioridade: 'Alta', prazo: '2026-07-15', status: 'Em andamento', data_criacao: '2026-07-10' }
  ];
  const { data: d2, error: e2 } = await supabase.from('tarefas').insert(tarefasExtras).select();
  console.log('Tarefas Insert:', d2, e2);
}
test();
