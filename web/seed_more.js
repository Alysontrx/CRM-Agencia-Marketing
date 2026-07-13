import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hcwtqiqlrlcyzngtuzsf.supabase.co';
const supabaseKey = 'sb_publishable_H8YHt50L1kkKA78cQzeZsw_76YrcHOd';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedMore() {
  console.log('Iniciando carga de Leads, Conteúdos e Tarefas adicionais...');

  const { data: allClientes } = await supabase.from('clientes').select('id');
  if (!allClientes || allClientes.length === 0) {
    console.log('Sem clientes no banco!');
    return;
  }
  
  const c1 = allClientes[0].id;
  const c2 = allClientes.length > 1 ? allClientes[1].id : c1;

  // 1. LEADS
  const leadsExtras = [
    { empresa: 'Restaurante Sabor', contato: 'Carlos', telefone: '(11) 9999-8888', origem: 'Instagram', valor_estimado: 1200, status: 'Prospect', data_criacao: '2026-07-01' },
    { empresa: 'Gym Fit', contato: 'Mariana', telefone: '(11) 9888-7777', origem: 'Indicação', valor_estimado: 2500, status: 'Reunião', data_criacao: '2026-06-28' },
    { empresa: 'Dr. João Odonto', contato: 'João', telefone: '(11) 9777-6666', origem: 'Site', valor_estimado: 1800, status: 'Proposta', data_criacao: '2026-06-25' },
    { empresa: 'Auto Center Vrum', contato: 'Pedro', telefone: '(11) 9666-5555', origem: 'WhatsApp', valor_estimado: 3000, status: 'Negociação', data_criacao: '2026-06-20' },
    { empresa: 'Clínica Estética Bela', contato: 'Amanda', telefone: '(11) 9555-4444', origem: 'Indicação', valor_estimado: 4500, status: 'Fechado', data_criacao: '2026-05-10' },
    { empresa: 'Escola de Inglês Top', contato: 'Marcos', telefone: '(11) 9444-3333', origem: 'Facebook Ads', valor_estimado: 2200, status: 'Prospect', data_criacao: '2026-07-10' }
  ];

  console.log('Inserindo leads...');
  await supabase.from('leads').insert(leadsExtras);

  // 2. CONTEÚDOS (Planejador de Posts)
  const conteudosExtras = [
    { cliente_id: c1, tipo: 'Post', titulo: 'Look de Inverno 2026', status: 'Em produção', data_criacao: '2026-07-07' },
    { cliente_id: c1, tipo: 'Reel', titulo: 'Tendências de Moda', status: 'Em aprovação', data_criacao: '2026-07-05' },
    { cliente_id: c2, tipo: 'Carrossel', titulo: '5 Benefícios do Clareamento', status: 'Agendado', data_criacao: '2026-07-06' },
    { cliente_id: c1, tipo: 'Story', titulo: 'Bastidores da Coleção', status: 'Publicado', data_criacao: '2026-07-08' },
    { cliente_id: c2, tipo: 'Reel', titulo: 'Dicas de saúde no inverno', status: 'Agendado', data_criacao: '2026-07-10' },
    { cliente_id: c1, tipo: 'Carrossel', titulo: 'Como combinar peças curingas', status: 'Ideia', data_criacao: '2026-07-11' },
    { cliente_id: c2, tipo: 'Post', titulo: 'Mitos e Verdades sobre Clareamento', status: 'Em produção', data_criacao: '2026-07-12' }
  ];

  console.log('Inserindo conteúdos (posts)...');
  await supabase.from('conteudos').insert(conteudosExtras);

  // 3. TAREFAS ADICIONAIS
  const tarefasExtras = [
    { titulo: 'Criar roteiro de reels', cliente_id: c1, responsavel_id: 3, setor: 'Social Media', prioridade: 'Alta', prazo: '2026-07-15', status: 'Em andamento', data_criacao: '2026-07-10' },
    { titulo: 'Revisar legenda da campanha de inverno', cliente_id: c1, responsavel_id: 4, setor: 'Secretária', prioridade: 'Média', prazo: '2026-07-16', status: 'Aguardando revisão', data_criacao: '2026-07-10' },
    { titulo: 'Arte para feed (Promoção)', cliente_id: c1, responsavel_id: 2, setor: 'Design', prioridade: 'Alta', prazo: '2026-07-12', status: 'Aprovado', data_criacao: '2026-07-08' },
    { titulo: 'Gerar relatório mensal de Junho', cliente_id: c2, responsavel_id: 3, setor: 'Social Media', prioridade: 'Alta', prazo: '2026-07-05', status: 'Atrasado', data_criacao: '2026-07-01' },
    { titulo: 'Acompanhar lançamento do E-book', cliente_id: c2, responsavel_id: 1, setor: 'Atendimento', prioridade: 'Alta', prazo: '2026-07-20', status: 'Pendente', data_criacao: '2026-07-11' },
    { titulo: 'Aprovar copy com o cliente', cliente_id: c2, responsavel_id: 2, setor: 'Atendimento', prioridade: 'Média', prazo: '2026-07-14', status: 'Pendente', data_criacao: '2026-07-11' }
  ];

  console.log('Inserindo tarefas adicionais...');
  await supabase.from('tarefas').insert(tarefasExtras);

  console.log('Pronto! Leads, conteúdos e tarefas inseridos com sucesso no Supabase.');
}

seedMore();
