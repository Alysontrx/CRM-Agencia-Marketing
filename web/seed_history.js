import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hcwtqiqlrlcyzngtuzsf.supabase.co';
const supabaseKey = 'sb_publishable_H8YHt50L1kkKA78cQzeZsw_76YrcHOd';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedHistory() {
  console.log('Iniciando carga de dados históricos...');

  const clientesExtras = [
    { nome: 'TechStart', servico: 'Lançamento', responsavel_id: 3, status_geral: 'em_dia', progresso: 90, proxima_entrega: '2026-07-25', mrr: 5000, data_inicio: '2026-02-01', nicho: 'Tecnologia' },
    { nome: 'Café do Ponto', servico: 'Redes Sociais', responsavel_id: 4, status_geral: 'atencao', progresso: 60, pendencia_atual: 'Fotos do local', mrr: 800, data_inicio: '2026-04-10', nicho: 'Alimentação' },
    { nome: 'Construtora Horizonte', servico: 'Tráfego Pago + SEO', responsavel_id: 5, status_geral: 'em_dia', progresso: 75, proxima_entrega: '2026-07-20', mrr: 4000, data_inicio: '2026-01-15', nicho: 'Imóveis' }
  ];

  console.log('Inserindo clientes extras...');
  const { data: insertedClientes, error: errClientes } = await supabase.from('clientes').insert(clientesExtras).select();
  if (errClientes) console.error('Erro clientes:', errClientes);
  
  const { data: allClientes } = await supabase.from('clientes').select('id');
  if (!allClientes || allClientes.length === 0) return;
  
  const c1 = allClientes[0].id;
  const c2 = allClientes.length > 1 ? allClientes[1].id : c1;
  const c3 = allClientes.length > 2 ? allClientes[2].id : c1;
  const c4 = allClientes.length > 3 ? allClientes[3].id : c1;

  const tarefasHistoricas = [
    { titulo: 'Configurar BM e Pixel', cliente_id: c1, responsavel_id: 3, setor: 'Tráfego', prioridade: 'Alta', prazo: '2026-03-10', status: 'Aprovado', data_criacao: '2026-03-01' },
    { titulo: 'Identidade Visual - Ajustes', cliente_id: c2, responsavel_id: 2, setor: 'Design', prioridade: 'Média', prazo: '2026-04-20', status: 'Aprovado', data_criacao: '2026-04-15' },
    { titulo: 'Planejamento de Maio', cliente_id: c1, responsavel_id: 3, setor: 'Social Media', prioridade: 'Alta', prazo: '2026-05-01', status: 'Aprovado', data_criacao: '2026-04-25' },
    { titulo: 'Relatório Trimestral Q1', cliente_id: c2, responsavel_id: 1, setor: 'Atendimento', prioridade: 'Alta', prazo: '2026-04-05', status: 'Aprovado', data_criacao: '2026-04-01' },
    { titulo: 'Gravação com Influenciadores', cliente_id: c3, responsavel_id: 5, setor: 'Videomaker', prioridade: 'Média', prazo: '2026-06-15', status: 'Aprovado', data_criacao: '2026-06-01' },
    { titulo: 'Setup de CRM', cliente_id: c4, responsavel_id: 1, setor: 'Tecnologia', prioridade: 'Alta', prazo: '2026-01-20', status: 'Aprovado', data_criacao: '2026-01-10' }
  ];

  console.log('Inserindo tarefas históricas...');
  await supabase.from('tarefas').insert(tarefasHistoricas);

  const metricasHistoricas = [
    { cliente_id: c1, data_registro: '2026-02-01', seguidores: 3800, alcance: 12000, engajamento: 2.5, leads: 20, cliques_site: 10, tipo: 'mensal' },
    { cliente_id: c1, data_registro: '2026-03-01', seguidores: 4200, alcance: 15500, engajamento: 2.8, leads: 35, cliques_site: 45, tipo: 'mensal' },
    { cliente_id: c1, data_registro: '2026-04-01', seguidores: 4800, alcance: 21000, engajamento: 3.1, leads: 50, cliques_site: 80, tipo: 'mensal' },
    { cliente_id: c1, data_registro: '2026-05-01', seguidores: 5500, alcance: 35000, engajamento: 4.0, leads: 70, cliques_site: 110, tipo: 'mensal' },
    { cliente_id: c2, data_registro: '2026-04-01', seguidores: 1200, alcance: 5000, engajamento: 1.5, leads: 5, cliques_site: 20, tipo: 'baseline' },
    { cliente_id: c2, data_registro: '2026-05-01', seguidores: 1800, alcance: 12000, engajamento: 2.2, leads: 15, cliques_site: 60, tipo: 'mensal' }
  ];

  console.log('Inserindo metricas históricas...');
  await supabase.from('metricas').insert(metricasHistoricas);

  const conteudosHistoricos = [
    { cliente_id: c1, tipo: 'Post', titulo: 'Coleção de Outono', status: 'Publicado', data_criacao: '2026-03-20' },
    { cliente_id: c1, tipo: 'Reel', titulo: 'Bastidores da Loja', status: 'Publicado', data_criacao: '2026-04-10' },
    { cliente_id: c2, tipo: 'Carrossel', titulo: 'Dicas de Prevenção', status: 'Publicado', data_criacao: '2026-05-15' },
    { cliente_id: c3, tipo: 'Video', titulo: 'After Movie - Festa 10 Anos', status: 'Publicado', data_criacao: '2026-06-05' }
  ];

  console.log('Inserindo conteudos históricos...');
  await supabase.from('conteudos').insert(conteudosHistoricos);

  const financeiroHistorico = [
    { cliente_id: c1, descricao: 'Fee Mensal - Março', valor: 1500, vencimento: '2026-03-10', status: 'Pago' },
    { cliente_id: c1, descricao: 'Fee Mensal - Abril', valor: 1500, vencimento: '2026-04-10', status: 'Pago' },
    { cliente_id: c1, descricao: 'Fee Mensal - Maio', valor: 1500, vencimento: '2026-05-10', status: 'Pago' },
    { cliente_id: c1, descricao: 'Fee Mensal - Junho', valor: 1500, vencimento: '2026-06-10', status: 'Pago' },
    { cliente_id: c2, descricao: 'Setup + Fee - Abril', valor: 3500, vencimento: '2026-04-05', status: 'Pago' },
    { cliente_id: c2, descricao: 'Fee Mensal - Maio', valor: 2500, vencimento: '2026-05-05', status: 'Pago' },
    { cliente_id: c2, descricao: 'Fee Mensal - Junho', valor: 2500, vencimento: '2026-06-05', status: 'Pago' },
    { cliente_id: c3, descricao: 'Sinal - Audiovisual', valor: 1500, vencimento: '2026-06-01', status: 'Pago' }
  ];

  console.log('Inserindo financeiro histórico...');
  await supabase.from('financeiro').insert(financeiroHistorico);

  const historicoLogs = [
    { cliente_id: c1, usuario: 'Gabi', descricao: 'Apresentação do relatório de Q1', data_registro: '2026-04-10T14:30:00Z' },
    { cliente_id: c1, usuario: 'Ana', descricao: 'Entrega final da campanha de Outono', data_registro: '2026-03-25T10:00:00Z' },
    { cliente_id: c2, usuario: 'Gabi', descricao: 'Assinatura do contrato', data_registro: '2025-03-15T09:00:00Z' },
    { cliente_id: c3, usuario: 'Lucas', descricao: 'Reunião de briefing presencial', data_registro: '2026-06-02T16:00:00Z' },
    { cliente_id: c4, usuario: 'João', descricao: 'Deploy inicial do sistema', data_registro: '2026-01-20T11:45:00Z' }
  ];

  console.log('Inserindo historico logs...');
  await supabase.from('historico_clientes').insert(historicoLogs);

  console.log('Pronto! Banco de dados carregado com histórico.');
}

seedHistory();
