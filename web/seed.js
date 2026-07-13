import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hcwtqiqlrlcyzngtuzsf.supabase.co';
const supabaseKey = 'sb_publishable_H8YHt50L1kkKA78cQzeZsw_76YrcHOd';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Buscando usuarios e clientes...');
  const { data: users } = await supabase.from('usuarios').select('id');
  const { data: clientes } = await supabase.from('clientes').select('id');

  if (!users?.length || !clientes?.length) {
    console.log('Sem usuários ou clientes para associar as tarefas.');
    return;
  }

  const statusOptions = ['Em andamento', 'Aprovado', 'Fechado', 'Atrasado', 'Pendente'];
  const prioridadeOptions = ['Baixa', 'Média', 'Alta'];
  const titulos = [
    'Criar posts para Instagram',
    'Revisar copy da campanha',
    'Ajustar layout do site',
    'Reunião de alinhamento',
    'Produzir roteiro de Reels',
    'Análise de métricas mensais',
    'Subir campanha no Facebook Ads',
    'Criar apresentação comercial',
    'Otimizar SEO do blog',
    'Aprovar artes com o cliente'
  ];

  const novasTarefas = [];
  
  for (let i = 0; i < 30; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomClient = clientes[Math.floor(Math.random() * clientes.length)];
    const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    const randomPrio = prioridadeOptions[Math.floor(Math.random() * prioridadeOptions.length)];
    const randomTitulo = titulos[Math.floor(Math.random() * titulos.length)];
    
    // Random date within the last 30 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    novasTarefas.push({
      titulo: `${randomTitulo} #${i+1}`,
      descricao: 'Tarefa simulada para gerar gráficos e relatórios.',
      status: randomStatus,
      prioridade: randomPrio,
      criado_em: date.toISOString(),
      prazo: new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      responsavel_id: randomUser.id,
      cliente_id: randomClient.id
    });
  }

  console.log(`Inserindo ${novasTarefas.length} tarefas mockadas...`);
  const { error } = await supabase.from('tarefas').insert(novasTarefas);

  if (error) {
    console.error('Erro ao inserir:', error);
  } else {
    console.log('Seed completo com sucesso!');
  }
}

seed();
