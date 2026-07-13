import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hcwtqiqlrlcyzngtuzsf.supabase.co';
const supabaseKey = 'sb_publishable_H8YHt50L1kkKA78cQzeZsw_76YrcHOd';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedMore() {
  console.log('Iniciando carga de Leads, Conteúdos e Tarefas adicionais...');

  const { data: allClientes } = await supabase.from('clientes').select('id');
  
  // Create some default clients if none exist
  let c1, c2, c3, c4;
  if (!allClientes || allClientes.length === 0) {
    console.log('Criando clientes base...');
    const { data: inserted } = await supabase.from('clientes').insert([
      { nome: 'Agência Base', servico: 'Geral', mrr: 1000 },
      { nome: 'Cliente Teste', servico: 'Geral', mrr: 2000 }
    ]).select();
    if (inserted && inserted.length > 0) {
      c1 = inserted[0].id;
      c2 = inserted.length > 1 ? inserted[1].id : c1;
      c3 = c1;
      c4 = c2;
    } else {
      console.error('Falha ao criar clientes base');
      return;
    }
  } else {
    c1 = allClientes[0].id;
    c2 = allClientes.length > 1 ? allClientes[1].id : c1;
    c3 = allClientes.length > 2 ? allClientes[2].id : c1;
    c4 = allClientes.length > 3 ? allClientes[3].id : c1;
  }

  const { data: users } = await supabase.from('usuarios').select('id');
  const u1 = users && users.length > 0 ? users[0].id : 1;
  const u2 = users && users.length > 1 ? users[1].id : u1;
  const u3 = users && users.length > 2 ? users[2].id : u1;

  const leadsExtras = [
    { empresa: 'Restaurante Sabor', contato: 'Carlos', telefone: '(11) 9999-8888', origem: 'Instagram', valor_estimado: 1200, status: 'Prospect', criado_em: '2026-07-01' },
    { empresa: 'Gym Fit', contato: 'Mariana', telefone: '(11) 9888-7777', origem: 'Indicação', valor_estimado: 2500, status: 'Reunião', criado_em: '2026-06-28' },
    { empresa: 'Dr. João Odonto', contato: 'João', telefone: '(11) 9777-6666', origem: 'Site', valor_estimado: 1800, status: 'Proposta', criado_em: '2026-06-25' },
    { empresa: 'Auto Center Vrum', contato: 'Pedro', telefone: '(11) 9666-5555', origem: 'WhatsApp', valor_estimado: 3000, status: 'Negociação', criado_em: '2026-06-20' },
    { empresa: 'Clínica Estética Bela', contato: 'Amanda', telefone: '(11) 9555-4444', origem: 'Indicação', valor_estimado: 4500, status: 'Fechado', criado_em: '2026-05-10' },
    { empresa: 'Escola de Inglês Top', contato: 'Marcos', telefone: '(11) 9444-3333', origem: 'Facebook Ads', valor_estimado: 2200, status: 'Prospect', criado_em: '2026-07-10' }
  ];
  const { error: el } = await supabase.from('leads').insert(leadsExtras);
  if (el) console.error('Erro leads:', el);

  const conteudosExtras = [
    { cliente_id: c1, tipo: 'Post', titulo: 'Look de Inverno 2026', status: 'Em produção', criado_em: '2026-07-07' },
    { cliente_id: c1, tipo: 'Reel', titulo: 'Tendências de Moda', status: 'Em aprovação', criado_em: '2026-07-05' },
    { cliente_id: c2, tipo: 'Carrossel', titulo: '5 Benefícios do Clareamento', status: 'Agendado', criado_em: '2026-07-06' },
    { cliente_id: c1, tipo: 'Story', titulo: 'Bastidores da Coleção', status: 'Publicado', criado_em: '2026-07-08' },
    { cliente_id: c2, tipo: 'Reel', titulo: 'Dicas de saúde no inverno', status: 'Agendado', criado_em: '2026-07-10' },
    { cliente_id: c1, tipo: 'Carrossel', titulo: 'Como combinar peças curingas', status: 'Ideia', criado_em: '2026-07-11' },
    { cliente_id: c2, tipo: 'Post', titulo: 'Mitos e Verdades sobre Clareamento', status: 'Em produção', criado_em: '2026-07-12' }
  ];
  const { error: ec } = await supabase.from('conteudos').insert(conteudosExtras);
  if (ec) console.error('Erro conteudos:', ec);

  const tarefasExtras = [
    { titulo: 'Criar roteiro de reels', cliente_id: c1, responsavel_id: u1, setor: 'Social Media', prioridade: 'Alta', prazo: '2026-07-15', status: 'Em andamento', criado_em: '2026-07-10' },
    { titulo: 'Revisar legenda da campanha de inverno', cliente_id: c1, responsavel_id: u2, setor: 'Secretária', prioridade: 'Média', prazo: '2026-07-16', status: 'Aguardando revisão', criado_em: '2026-07-10' },
    { titulo: 'Arte para feed (Promoção)', cliente_id: c1, responsavel_id: u3, setor: 'Design', prioridade: 'Alta', prazo: '2026-07-12', status: 'Aprovado', criado_em: '2026-07-08' },
    { titulo: 'Gerar relatório mensal de Junho', cliente_id: c2, responsavel_id: u1, setor: 'Social Media', prioridade: 'Alta', prazo: '2026-07-05', status: 'Atrasado', criado_em: '2026-07-01' },
    { titulo: 'Acompanhar lançamento do E-book', cliente_id: c2, responsavel_id: u2, setor: 'Atendimento', prioridade: 'Alta', prazo: '2026-07-20', status: 'Pendente', criado_em: '2026-07-11' },
    { titulo: 'Aprovar copy com o cliente', cliente_id: c2, responsavel_id: u3, setor: 'Atendimento', prioridade: 'Média', prazo: '2026-07-14', status: 'Pendente', criado_em: '2026-07-11' }
  ];
  const { error: et } = await supabase.from('tarefas').insert(tarefasExtras);
  if (et) console.error('Erro tarefas:', et);

  console.log('Pronto! Leads, conteúdos e tarefas inseridos (possíveis erros listados acima).');
}
seedMore();
