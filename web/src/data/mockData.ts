import type { AgenciaData, User, ClienteData, TarefaData, CorrecaoData, MetricaData, NotificacaoData } from './types';

export const MOCK_AGENCIAS: AgenciaData[] = [
  { id: 1, nome: 'Sense Agency', logo_url: '/logo.png' },
  { id: 2, nome: 'Vibra Marketing', logo_url: 'https://ui-avatars.com/api/?name=Vibra&background=random' },
];

export const MOCK_USERS: User[] = [
  { id: 1, agencia_id: 1, nome: 'Gabi', email: 'gabi@atlas.com', funcao: 'Admin', avatar: 'https://i.pravatar.cc/150?img=47' },
  { id: 2, agencia_id: 1, nome: 'Ana', email: 'ana@atlas.com', funcao: 'Designer', avatar: 'https://i.pravatar.cc/150?img=45' },
  { id: 3, agencia_id: 1, nome: 'Lucas', email: 'lucas@atlas.com', funcao: 'Social Media', avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: 4, agencia_id: 1, nome: 'Marina', email: 'marina@atlas.com', funcao: 'Secretária', avatar: 'https://i.pravatar.cc/150?img=48' },
  { id: 5, agencia_id: 1, nome: 'João', email: 'joao@atlas.com', funcao: 'Videomaker', avatar: 'https://i.pravatar.cc/150?img=15' },
  // Usuário de outra agência para teste de isolamento
  { id: 6, agencia_id: 2, nome: 'Beto', email: 'beto@vibra.com', funcao: 'Admin', avatar: 'https://i.pravatar.cc/150?img=11' },
];

export const MOCK_CLIENTES: any[] = [
  { id: 1, agencia_id: 1, nome: 'Bella Store', servico: 'Gestão de Redes Sociais', responsavel_id: 2, status_geral: 'em_dia', progresso: 85, proxima_entrega: '2026-07-05', mrr: 1500, data_inicio: '2025-01-10', nicho_mercado: 'Moda' },
  { id: 2, agencia_id: 1, nome: 'Clínica Vida', servico: 'Tráfego Pago + Social', responsavel_id: 3, status_geral: 'atencao', progresso: 40, pendencia_atual: 'Aguardando aprovação de verba', mrr: 2500, data_inicio: '2025-03-15', nicho_mercado: 'Saúde' },
  { id: 3, agencia_id: 1, nome: 'Rancharia Eventos', servico: 'Audiovisual (Reels)', responsavel_id: 5, status_geral: 'em_dia', progresso: 100, proxima_entrega: '2026-07-03', mrr: 3000, data_inicio: '2025-06-01', nicho_mercado: 'Eventos' },
  { id: 4, agencia_id: 1, nome: 'Tech Solutions', servico: 'Gestão Completa (SaaS)', responsavel_id: 2, status_geral: 'atrasado', progresso: 15, proxima_entrega: '2026-07-02', pendencia_atual: 'Revisão final do cliente', mrr: 4500, data_inicio: '2025-11-20', nicho_mercado: 'Tecnologia' },
  // Cliente da agência 2
  { id: 5, agencia_id: 2, nome: 'Pizzaria Napoles', servico: 'Social Media', responsavel_id: 6, status_geral: 'em_dia', progresso: 50, proxima_entrega: '2026-07-10', mrr: 1000, data_inicio: '2026-01-10', nicho_mercado: 'Alimentação' },
];

export const MOCK_LEADS: any[] = [
  { id: 1, agencia_id: 1, empresa: 'Restaurante Sabor', contato: 'Carlos', telefone: '(11) 9999-8888', origem: 'Instagram', valor_estimado: 1200, status: 'Prospect', data_criacao: '2026-07-01' },
  { id: 2, agencia_id: 1, empresa: 'Gym Fit', contato: 'Mariana', telefone: '(11) 9888-7777', origem: 'Indicação', valor_estimado: 2500, status: 'Reunião', data_criacao: '2026-06-28' },
  { id: 3, agencia_id: 1, empresa: 'Dr. João Odonto', contato: 'João', telefone: '(11) 9777-6666', origem: 'Site', valor_estimado: 1800, status: 'Proposta', data_criacao: '2026-06-25' },
  { id: 4, agencia_id: 1, empresa: 'Auto Center Vrum', contato: 'Pedro', telefone: '(11) 9666-5555', origem: 'WhatsApp', valor_estimado: 3000, status: 'Negociação', data_criacao: '2026-06-20' },
];

export const MOCK_TAREFAS: TarefaData[] = [
  { id: 1, agencia_id: 1, titulo: 'Criar roteiro de reels', cliente_id: 1, responsavel_id: 3, setor: 'Social Media', prioridade: 'Alta', prazo: '2026-07-04', status: 'Em andamento', data_criacao: '2026-07-01', comentarios: [] },
  { id: 2, agencia_id: 1, titulo: 'Revisar legenda da campanha de inverno', cliente_id: 1, responsavel_id: 4, setor: 'Secretária', prioridade: 'Média', prazo: '2026-07-05', status: 'Aguardando revisão', data_criacao: '2026-07-01', comentarios: [] },
  { id: 3, agencia_id: 1, titulo: 'Arte para feed (Promoção Inverno)', cliente_id: 1, responsavel_id: 2, setor: 'Design', prioridade: 'Alta', prazo: '2026-07-02', status: 'Aprovado', data_criacao: '2026-06-30', comentarios: [] },
  { id: 4, agencia_id: 1, titulo: 'Gerar relatório mensal', cliente_id: 2, responsavel_id: 3, setor: 'Social Media', prioridade: 'Alta', prazo: '2026-07-01', status: 'Atrasado', data_criacao: '2026-06-28', comentarios: [{ autor: 'Gabi', texto: 'Precisamos desse relatório urgente.', data: '2026-07-01' }] },
  { id: 5, agencia_id: 1, titulo: 'Post institucional - Saúde do Coração', cliente_id: 2, responsavel_id: 2, setor: 'Design', prioridade: 'Alta', prazo: '2026-07-02', status: 'Atrasado', data_criacao: '2026-06-29', comentarios: [] },
  { id: 6, agencia_id: 1, titulo: 'Editar vídeo do evento Rancharia', cliente_id: 3, responsavel_id: 5, setor: 'Videomaker', prioridade: 'Alta', prazo: '2026-07-06', status: 'Em andamento', data_criacao: '2026-07-01', comentarios: [] },
];

export const MOCK_CORRECOES: CorrecaoData[] = [
  { id: 1, agencia_id: 1, cliente_id: 1, tarefa_id: 3, descricao: 'Ajustar contraste do texto na última tela do carrossel.', responsavel_id: 2, status: 'Pendente', prazo: '2026-07-03' },
  { id: 2, agencia_id: 1, cliente_id: 2, tarefa_id: 5, descricao: 'Substituir foto de banco de imagens por foto real do drive.', responsavel_id: 2, status: 'Em andamento', prazo: '2026-07-03' },
];

export const MOCK_METRICAS: MetricaData[] = [
  { id: 1, agencia_id: 1, cliente_id: 1, data_registro: '2026-01-01', seguidores: 3200, alcance: 8500, engajamento: 2.1, leads: 12, tipo: 'baseline' },
  { id: 2, agencia_id: 1, cliente_id: 1, data_registro: '2026-06-30', seguidores: 6450, alcance: 61300, engajamento: 5.8, leads: 86, tipo: 'mensal', anotacao: 'Após campanha de inverno, alcance cresceu 620%' },
];

export const MOCK_NOTIFICACOES: NotificacaoData[] = [
  { id: 1, agencia_id: 1, mensagem: 'Gym Fit está há 5 dias na etapa Contato Feito sem movimentação.', tipo: 'alerta', lida: false, data_criacao: new Date().toISOString() },
  { id: 2, agencia_id: 1, mensagem: 'O cliente Bella Store solicitou urgência no reels.', tipo: 'info', lida: false, data_criacao: new Date().toISOString() },
];
