import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hcwtqiqlrlcyzngtuzsf.supabase.co';
const supabaseKey = 'sb_publishable_H8YHt50L1kkKA78cQzeZsw_76YrcHOd';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  const { data: allClientes } = await supabase.from('clientes').select('id');
  if (!allClientes || allClientes.length === 0) return;
  const c1 = allClientes[0].id;
  const c2 = allClientes.length > 1 ? allClientes[1].id : c1;

  const conteudosExtras = [
    { cliente_id: c1, tipo: 'Post', titulo: 'Look de Inverno 2026', status: 'Em produção' },
    { cliente_id: c1, tipo: 'Reel', titulo: 'Tendências de Moda', status: 'Em aprovação' },
    { cliente_id: c2, tipo: 'Carrossel', titulo: '5 Benefícios do Clareamento', status: 'Agendado' },
    { cliente_id: c1, tipo: 'Story', titulo: 'Bastidores da Coleção', status: 'Publicado' },
    { cliente_id: c2, tipo: 'Reel', titulo: 'Dicas de saúde no inverno', status: 'Agendado' },
    { cliente_id: c1, tipo: 'Carrossel', titulo: 'Como combinar peças curingas', status: 'Ideia' },
    { cliente_id: c2, tipo: 'Post', titulo: 'Mitos e Verdades sobre Clareamento', status: 'Em produção' }
  ];
  
  const { error: ec } = await supabase.from('conteudos').insert(conteudosExtras);
  if (ec) console.error('Erro conteudos:', ec);
  else console.log('Conteudos inseridos com sucesso!');
}
seed();
