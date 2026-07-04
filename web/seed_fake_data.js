import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hcwtqiqlrlcyzngtuzsf.supabase.co';
const supabaseKey = 'sb_publishable_H8YHt50L1kkKA78cQzeZsw_76YrcHOd';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Iniciando simulador de dados...');

  // 1. Pegar a primeira agência e um usuário
  const { data: agencias } = await supabase.from('agencias').select('id').limit(1);
  if (!agencias || agencias.length === 0) {
    console.error('Nenhuma agência encontrada. Crie uma agência/usuário primeiro.');
    return;
  }
  const agencia_id = agencias[0].id;

  const { data: users } = await supabase.from('usuarios').select('id').eq('agencia_id', agencia_id).limit(1);
  const responsavel_id = users?.[0]?.id;

  if (!responsavel_id) {
    console.error('Nenhum usuário encontrado na agência.');
    return;
  }

  // 2. Criar Clientes Falsos
  const clientes = [
    {
      agencia_id,
      nome: 'Clínica Sorriso Saudável',
      servico: 'Gestão de Redes Sociais',
      responsavel_id,
      status_geral: 'em_dia',
      mrr: 2500,
      dia_pagamento: 10,
      entregas_mensais: 12,
      nicho_mercado: 'Odontologia',
      instagram_url: 'https://instagram.com/sorrisosaudavel'
    },
    {
      agencia_id,
      nome: 'Boutique Elegance',
      servico: 'Tráfego Pago + Social Media',
      responsavel_id,
      status_geral: 'atencao',
      mrr: 1800,
      dia_pagamento: 5,
      entregas_mensais: 8,
      nicho_mercado: 'Moda Feminina',
      instagram_url: 'https://instagram.com/boutiqueelegance'
    },
    {
      agencia_id,
      nome: 'Academia Iron Tech',
      servico: 'Tráfego Pago',
      responsavel_id,
      status_geral: 'em_dia',
      mrr: 3000,
      dia_pagamento: 20,
      entregas_mensais: 0, // Apenas tráfego, sem posts orgânicos
      nicho_mercado: 'Fitness',
      instagram_url: 'https://instagram.com/irontech'
    }
  ];

  const { data: clientesInseridos, error: cErr } = await supabase.from('clientes').insert(clientes).select();
  if (cErr) console.error('Erro clientes:', cErr);
  else console.log(`✓ ${clientesInseridos.length} clientes criados.`);

  const clienteOdonto = clientesInseridos.find(c => c.nome.includes('Odonto') || c.nome.includes('Sorriso'));
  const clienteModa = clientesInseridos.find(c => c.nome.includes('Moda') || c.nome.includes('Elegance'));

  // 3. Criar Leads Falsos
  const leads = [
    { agencia_id, empresa: 'Restaurante Sabor Divino', contato: 'Carlos (11) 99999-9999', valor_estimado: 1500, status: 'Novo', temperatura: 'quente', score: 85, responsavel_id },
    { agencia_id, empresa: 'Imobiliária Morar Bem', contato: 'Ana (11) 98888-8888', valor_estimado: 4000, status: 'Reunião Agendada', temperatura: 'morno', score: 60, responsavel_id },
    { agencia_id, empresa: 'Petshop Cão Feliz', contato: 'Roberto (11) 97777-7777', valor_estimado: 1200, status: 'Proposta Enviada', temperatura: 'quente', score: 90, responsavel_id }
  ];
  const { error: lErr } = await supabase.from('leads').insert(leads);
  if (lErr) console.error('Erro leads:', lErr);
  else console.log('✓ 3 leads criados.');

  // 4. Criar Tarefas (Kanban) Falsas
  const tarefas = [
    // Tarefas Feitas (Para encher a barra de progresso de entregas)
    ...Array(8).fill(null).map((_, i) => ({
      agencia_id, cliente_id: clienteOdonto?.id, responsavel_id,
      titulo: `Post ${i+1}: Dica de saúde bucal`,
      status: 'Feito', setor: 'Design', prioridade: 'Média', prazo: new Date().toISOString()
    })),
    ...Array(3).fill(null).map((_, i) => ({
      agencia_id, cliente_id: clienteModa?.id, responsavel_id,
      titulo: `Reels ${i+1}: Nova Coleção`,
      status: 'Feito', setor: 'Social Media', prioridade: 'Alta', prazo: new Date().toISOString()
    })),
    // Tarefas a Fazer / Fazendo
    { agencia_id, cliente_id: clienteOdonto?.id, responsavel_id, titulo: 'Carrossel: Tipos de Clareamento', status: 'Fazendo', setor: 'Design', prioridade: 'Média', prazo: '2026-07-15' },
    { agencia_id, cliente_id: clienteOdonto?.id, responsavel_id, titulo: 'Reels: Bastidores da Clínica', status: 'A fazer', setor: 'Videomaker', prioridade: 'Alta', prazo: '2026-07-20' },
    { agencia_id, cliente_id: clienteModa?.id, responsavel_id, titulo: 'Aprovar roteiro de Live', status: 'Revisão', setor: 'Atendimento', prioridade: 'Urgente', prazo: '2026-07-05' }
  ];
  const { error: tErr } = await supabase.from('tarefas').insert(tarefas);
  if (tErr) console.error('Erro tarefas:', tErr);
  else console.log('✓ Tarefas (Postagens) criadas.');

  // 5. Criar Métricas (Antes x Depois)
  const agora = new Date();
  const tresMesesAtras = new Date(agora);
  tresMesesAtras.setMonth(agora.getMonth() - 3);

  const metricas = [
    // Clínica Odonto (Crescimento de +1200 seguidores)
    { agencia_id, cliente_id: clienteOdonto?.id, seguidores: 2500, alcance: 5000, engajamento: 1.2, leads: 10, data_registro: tresMesesAtras.toISOString() },
    { agencia_id, cliente_id: clienteOdonto?.id, seguidores: 3700, alcance: 12500, engajamento: 3.5, leads: 45, data_registro: agora.toISOString() },
    
    // Boutique Moda
    { agencia_id, cliente_id: clienteModa?.id, seguidores: 8000, alcance: 15000, engajamento: 2.0, leads: 30, data_registro: tresMesesAtras.toISOString() },
    { agencia_id, cliente_id: clienteModa?.id, seguidores: 10500, alcance: 28000, engajamento: 4.1, leads: 85, data_registro: agora.toISOString() }
  ];
  const { error: mErr } = await supabase.from('metricas').insert(metricas);
  if (mErr) console.error('Erro metricas:', mErr);
  else console.log('✓ Métricas de Antes x Depois criadas.');

  console.log('--- SIMULAÇÃO CONCLUÍDA! RECARREGUE O CRM ---');
}

seed();
