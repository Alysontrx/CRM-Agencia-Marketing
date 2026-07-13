import type { AgenciaData, User, ClienteData, TarefaData, CorrecaoData, MetricaData, NotificacaoData, ProjetoData, ConteudoData, FinanceiroData, HistoricoData } from './types';

export const MOCK_AGENCIAS: AgenciaData[] = [
  { id: 1, nome: 'Agência Marketing', logo_url: '/logo.png' },
  { id: 2, nome: 'Vibra Marketing', logo_url: 'https://ui-avatars.com/api/?name=Vibra&background=random' },
];

export const MOCK_USERS: User[] = [
  { id: 1, agencia_id: 1, nome: 'Gabi', email: 'gabi@atlas.com', funcao: 'Admin', avatar: 'https://i.pravatar.cc/150?img=47' },
  { id: 2, agencia_id: 1, nome: 'Ana', email: 'ana@atlas.com', funcao: 'Designer', avatar: 'https://i.pravatar.cc/150?img=45' },
  { id: 3, agencia_id: 1, nome: 'Lucas', email: 'lucas@atlas.com', funcao: 'Social Media', avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: 4, agencia_id: 1, nome: 'Marina', email: 'marina@atlas.com', funcao: 'Secretária', avatar: 'https://i.pravatar.cc/150?img=48' },
  { id: 5, agencia_id: 1, nome: 'João', email: 'joao@atlas.com', funcao: 'Editor de Vídeo', avatar: 'https://i.pravatar.cc/150?img=15' },
  // Usuário de outra agência para teste de isolamento
  { id: 6, agencia_id: 2, nome: 'Beto', email: 'beto@vibra.com', funcao: 'Admin', avatar: 'https://i.pravatar.cc/150?img=11' },
];

export const MOCK_CLIENTES: any[] = [
  { id: 1, agencia_id: 1, nome: 'Bella Store', servico: 'Gestão de Redes Sociais', responsavel_id: 2, status_geral: 'em_dia', progresso: 85, proxima_entrega: '2026-07-05', mrr: 1500, data_inicio: '2025-01-10', nicho: 'Moda' },
  { id: 2, agencia_id: 1, nome: 'Clínica Vida', servico: 'Tráfego Pago + Social', responsavel_id: 3, status_geral: 'atencao', progresso: 40, pendencia_atual: 'Aguardando aprovação de verba', mrr: 2500, data_inicio: '2025-03-15', nicho: 'Saúde' },
  { id: 3, agencia_id: 1, nome: 'Rancharia Eventos', servico: 'Audiovisual (Reels)', responsavel_id: 5, status_geral: 'em_dia', progresso: 100, proxima_entrega: '2026-07-03', mrr: 3000, data_inicio: '2025-06-01', nicho: 'Eventos' },
  { id: 4, agencia_id: 1, nome: 'Tech Solutions', servico: 'Gestão Completa (SaaS)', responsavel_id: 2, status_geral: 'atrasado', progresso: 15, proxima_entrega: '2026-07-02', pendencia_atual: 'Revisão final do cliente', mrr: 4500, data_inicio: '2025-11-20', nicho: 'Tecnologia' },
  // Cliente da agência 2
  { id: 5, agencia_id: 2, nome: 'Pizzaria Napoles', servico: 'Social Media', responsavel_id: 6, status_geral: 'em_dia', progresso: 50, proxima_entrega: '2026-07-10', mrr: 1000, data_inicio: '2026-01-10', nicho: 'Alimentação' },
  // Novos clientes
  { id: 6, agencia_id: 1, nome: 'TechStart', servico: 'Lançamento', responsavel_id: 3, status_geral: 'em_dia', progresso: 90, proxima_entrega: '2026-07-25', mrr: 5000, data_inicio: '2026-02-01', nicho: 'Tecnologia' },
  { id: 7, agencia_id: 1, nome: 'Café do Ponto', servico: 'Redes Sociais', responsavel_id: 4, status_geral: 'atencao', progresso: 60, pendencia_atual: 'Fotos do local', mrr: 800, data_inicio: '2026-04-10', nicho: 'Alimentação' },
  { id: 8, agencia_id: 1, nome: 'Construtora Horizonte', servico: 'Tráfego Pago + SEO', responsavel_id: 5, status_geral: 'em_dia', progresso: 75, proxima_entrega: '2026-07-20', mrr: 4000, data_inicio: '2026-01-15', nicho: 'Imóveis' },
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
  { id: 7, agencia_id: 1, titulo: 'Otimizar SEO - Mês Julho', cliente_id: 8, responsavel_id: 5, setor: 'Performance', prioridade: 'Alta', prazo: '2026-07-15', status: 'Pendente', data_criacao: '2026-07-02', comentarios: [] },
  { id: 8, agencia_id: 1, titulo: 'Sessão de Fotos no Café', cliente_id: 7, responsavel_id: 4, setor: 'Audiovisual', prioridade: 'Média', prazo: '2026-07-18', status: 'Em andamento', data_criacao: '2026-07-05', comentarios: [] },
  { id: 9, agencia_id: 1, titulo: 'Subir campanha de lançamento', cliente_id: 6, responsavel_id: 3, setor: 'Tráfego', prioridade: 'Alta', prazo: '2026-07-12', status: 'Em andamento', data_criacao: '2026-07-08', comentarios: [] },
  // Histórico de tarefas passadas
  { id: 10, agencia_id: 1, titulo: 'Configurar BM e Pixel', cliente_id: 6, responsavel_id: 3, setor: 'Tráfego', prioridade: 'Alta', prazo: '2026-03-10', status: 'Aprovado', data_criacao: '2026-03-01', comentarios: [] },
  { id: 11, agencia_id: 1, titulo: 'Identidade Visual - Ajustes', cliente_id: 7, responsavel_id: 2, setor: 'Design', prioridade: 'Média', prazo: '2026-04-20', status: 'Aprovado', data_criacao: '2026-04-15', comentarios: [] },
  { id: 12, agencia_id: 1, titulo: 'Planejamento de Maio', cliente_id: 1, responsavel_id: 3, setor: 'Social Media', prioridade: 'Alta', prazo: '2026-05-01', status: 'Aprovado', data_criacao: '2026-04-25', comentarios: [] },
  { id: 13, agencia_id: 1, titulo: 'Relatório Trimestral Q1', cliente_id: 2, responsavel_id: 1, setor: 'Atendimento', prioridade: 'Alta', prazo: '2026-04-05', status: 'Aprovado', data_criacao: '2026-04-01', comentarios: [] },
  { id: 14, agencia_id: 1, titulo: 'Gravação com Influenciadores', cliente_id: 3, responsavel_id: 5, setor: 'Videomaker', prioridade: 'Média', prazo: '2026-06-15', status: 'Aprovado', data_criacao: '2026-06-01', comentarios: [] },
  { id: 15, agencia_id: 1, titulo: 'Setup de CRM', cliente_id: 4, responsavel_id: 1, setor: 'Tecnologia', prioridade: 'Alta', prazo: '2026-01-20', status: 'Aprovado', data_criacao: '2026-01-10', comentarios: [] },
];

export const MOCK_CORRECOES: CorrecaoData[] = [
  { id: 1, agencia_id: 1, cliente_id: 1, tarefa_id: 3, descricao: 'Ajustar contraste do texto na última tela do carrossel.', responsavel_id: 2, status: 'Pendente', prazo: '2026-07-03' },
  { id: 2, agencia_id: 1, cliente_id: 2, tarefa_id: 5, descricao: 'Substituir foto de banco de imagens por foto real do drive.', responsavel_id: 2, status: 'Em andamento', prazo: '2026-07-03' },
];

export const MOCK_METRICAS: MetricaData[] = [
  { id: 1, agencia_id: 1, cliente_id: 1, data_registro: '2026-01-01', seguidores: 3200, alcance: 8500, engajamento: 2.1, leads: 12, cliques_site: 0, tipo: 'baseline' },
  { id: 2, agencia_id: 1, cliente_id: 1, data_registro: '2026-06-30', seguidores: 6450, alcance: 61300, engajamento: 5.8, leads: 86, cliques_site: 150, tipo: 'mensal', anotacao: 'Após campanha de inverno, alcance cresceu 620%' },
  // Histórico de métricas
  { id: 3, agencia_id: 1, cliente_id: 1, data_registro: '2026-02-01', seguidores: 3800, alcance: 12000, engajamento: 2.5, leads: 20, cliques_site: 10, tipo: 'mensal' },
  { id: 4, agencia_id: 1, cliente_id: 1, data_registro: '2026-03-01', seguidores: 4200, alcance: 15500, engajamento: 2.8, leads: 35, cliques_site: 45, tipo: 'mensal' },
  { id: 5, agencia_id: 1, cliente_id: 1, data_registro: '2026-04-01', seguidores: 4800, alcance: 21000, engajamento: 3.1, leads: 50, cliques_site: 80, tipo: 'mensal' },
  { id: 6, agencia_id: 1, cliente_id: 1, data_registro: '2026-05-01', seguidores: 5500, alcance: 35000, engajamento: 4.0, leads: 70, cliques_site: 110, tipo: 'mensal' },
  { id: 7, agencia_id: 1, cliente_id: 2, data_registro: '2026-04-01', seguidores: 1200, alcance: 5000, engajamento: 1.5, leads: 5, cliques_site: 20, tipo: 'baseline' },
  { id: 8, agencia_id: 1, cliente_id: 2, data_registro: '2026-05-01', seguidores: 1800, alcance: 12000, engajamento: 2.2, leads: 15, cliques_site: 60, tipo: 'mensal' },
];

export const MOCK_NOTIFICACOES: NotificacaoData[] = [
  { id: 1, agencia_id: 1, mensagem: 'Gym Fit está há 5 dias na etapa Contato Feito sem movimentação.', tipo: 'alerta', lida: false, data_criacao: new Date().toISOString() },
  { id: 2, agencia_id: 1, mensagem: 'O cliente Bella Store solicitou urgência no reels.', tipo: 'info', lida: false, data_criacao: new Date().toISOString() },
];

export const MOCK_PROJETOS: ProjetoData[] = [
  { id: 1, agencia_id: 1, cliente_id: 1, nome: 'Campanha de Inverno', tipo: 'Campanha Sazonal', responsavel_id: 2, progresso: 65, data_inicio: '2026-06-01', prazo: '2026-07-20' },
  { id: 2, agencia_id: 1, cliente_id: 2, nome: 'Lançamento E-book', tipo: 'Inbound', responsavel_id: 3, progresso: 25, data_inicio: '2026-06-15', prazo: '2026-08-01' },
];

export const MOCK_CONTEUDO: ConteudoData[] = [
  { id: 1, agencia_id: 1, cliente_id: 1, tipo: 'Post', titulo: 'Look de Inverno 2026', status: 'Em produção', data_criacao: '2026-07-07' },
  { id: 2, agencia_id: 1, cliente_id: 1, tipo: 'Reel', titulo: 'Tendências de Moda', status: 'Em aprovação', data_criacao: '2026-07-05' },
  { id: 3, agencia_id: 1, cliente_id: 2, tipo: 'Carrossel', titulo: '5 Benefícios do Clareamento', status: 'Agendado', data_criacao: '2026-07-06' },
  { id: 4, agencia_id: 1, cliente_id: 3, tipo: 'Story', titulo: 'Bastidores do Evento', status: 'Publicado', data_criacao: '2026-07-08' },
  { id: 5, agencia_id: 1, cliente_id: 6, tipo: 'Carrossel', titulo: 'O que é MVP?', status: 'Publicado', data_criacao: '2026-07-01' },
  { id: 6, agencia_id: 1, cliente_id: 7, tipo: 'Reel', titulo: 'Como preparamos seu café', status: 'Em produção', data_criacao: '2026-07-09' },
  { id: 7, agencia_id: 1, cliente_id: 8, tipo: 'Post', titulo: 'Novo empreendimento', status: 'Em aprovação', data_criacao: '2026-07-10' },
  // Conteúdos passados
  { id: 8, agencia_id: 1, cliente_id: 1, tipo: 'Post', titulo: 'Coleção de Outono', status: 'Publicado', data_criacao: '2026-03-20' },
  { id: 9, agencia_id: 1, cliente_id: 1, tipo: 'Reel', titulo: 'Bastidores da Loja', status: 'Publicado', data_criacao: '2026-04-10' },
  { id: 10, agencia_id: 1, cliente_id: 2, tipo: 'Carrossel', titulo: 'Dicas de Prevenção', status: 'Publicado', data_criacao: '2026-05-15' },
  { id: 11, agencia_id: 1, cliente_id: 3, tipo: 'Vídeo', titulo: 'After Movie - Festa 10 Anos', status: 'Publicado', data_criacao: '2026-06-05' },
];

export const MOCK_FINANCEIRO: FinanceiroData[] = [
  { id: 1, agencia_id: 1, cliente_id: 1, descricao: 'Fee Mensal', valor: 1500, vencimento: '2026-07-10', status: 'Pendente' },
  { id: 2, agencia_id: 1, cliente_id: 2, descricao: 'Fee Mensal + Tráfego', valor: 2500, vencimento: '2026-07-05', status: 'Atrasado' },
  { id: 3, agencia_id: 1, cliente_id: 3, descricao: 'Cobertura de Evento', valor: 3000, vencimento: '2026-07-02', status: 'Pago' },
  // Pagamentos passados
  { id: 4, agencia_id: 1, cliente_id: 1, descricao: 'Fee Mensal - Março', valor: 1500, vencimento: '2026-03-10', status: 'Pago' },
  { id: 5, agencia_id: 1, cliente_id: 1, descricao: 'Fee Mensal - Abril', valor: 1500, vencimento: '2026-04-10', status: 'Pago' },
  { id: 6, agencia_id: 1, cliente_id: 1, descricao: 'Fee Mensal - Maio', valor: 1500, vencimento: '2026-05-10', status: 'Pago' },
  { id: 7, agencia_id: 1, cliente_id: 1, descricao: 'Fee Mensal - Junho', valor: 1500, vencimento: '2026-06-10', status: 'Pago' },
  { id: 8, agencia_id: 1, cliente_id: 2, descricao: 'Setup + Fee - Abril', valor: 3500, vencimento: '2026-04-05', status: 'Pago' },
  { id: 9, agencia_id: 1, cliente_id: 2, descricao: 'Fee Mensal - Maio', valor: 2500, vencimento: '2026-05-05', status: 'Pago' },
  { id: 10, agencia_id: 1, cliente_id: 2, descricao: 'Fee Mensal - Junho', valor: 2500, vencimento: '2026-06-05', status: 'Pago' },
  { id: 11, agencia_id: 1, cliente_id: 3, descricao: 'Sinal - Audiovisual', valor: 1500, vencimento: '2026-06-01', status: 'Pago' },
];

export const MOCK_HISTORICO: HistoricoData[] = [
  { id: 1, agencia_id: 1, cliente_id: 1, usuario: 'Gabi', descricao: 'Aprovou a arte para o post "Look de Inverno"', data_registro: new Date(Date.now() - 3600000).toISOString() },
  { id: 2, agencia_id: 1, cliente_id: 2, usuario: 'Lucas', descricao: 'Enviou proposta comercial para Gym Fit', data_registro: new Date(Date.now() - 7200000).toISOString() },
  { id: 3, agencia_id: 1, cliente_id: 3, usuario: 'Ana', descricao: 'Concluiu o vídeo do evento Rancharia', data_registro: new Date(Date.now() - 86400000).toISOString() },
  // Histórico mais antigo
  { id: 4, agencia_id: 1, cliente_id: 1, usuario: 'Gabi', descricao: 'Apresentação do relatório de Q1', data_registro: '2026-04-10T14:30:00Z' },
  { id: 5, agencia_id: 1, cliente_id: 1, usuario: 'Ana', descricao: 'Entrega final da campanha de Outono', data_registro: '2026-03-25T10:00:00Z' },
  { id: 6, agencia_id: 1, cliente_id: 2, usuario: 'Gabi', descricao: 'Assinatura do contrato', data_registro: '2025-03-15T09:00:00Z' },
  { id: 7, agencia_id: 1, cliente_id: 3, usuario: 'Lucas', descricao: 'Reunião de briefing presencial', data_registro: '2026-06-02T16:00:00Z' },
  { id: 8, agencia_id: 1, cliente_id: 4, usuario: 'João', descricao: 'Deploy inicial do sistema', data_registro: '2026-01-20T11:45:00Z' },
];
