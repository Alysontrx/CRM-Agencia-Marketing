// Tipos do sistema (Single-Agency / Sense)

export type Page = 'dashboard' | 'comercial' | 'kanban' | 'clientes' | 'resultados' | 'copilot' | 'equipe' | 'conteudo' | 'cliente-perfil' | 'suporte' | 'employee_dashboard' | 'video_maker_dashboard' | 'secretary_dashboard' | 'reunioes';

export type UserRole = 'Administrador' | 'Gerente' | 'Secretária' | 'Comercial' | 'Designer' | 'Editor de Vídeo' | 'Social Media' | 'Desenvolvedor' | 'Financeiro' | 'Admin'; // Admin kept for retrocompatibility with current data

export interface User {
  id: number;
  nome: string;
  email: string;
  funcao: UserRole;
  avatar?: string;
  avatar_url?: string;
}

export interface ClienteData {
  id: number;
  
  // Informações Básicas
  nome: string; 
  empresa?: string;
  nicho?: string;
  logo?: string;
  email?: string;
  telefone?: string;
  whatsapp?: string;
  cpf_cnpj?: string;
  responsavel_id: number;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;

  // Informações Comerciais
  servico: string;
  mrr?: number;
  data_inicio?: string;
  data_renovacao?: string;
  plano?: string;
  status_geral: 'Ativo' | 'Em implantação' | 'Pausado' | 'Cancelado' | 'Encerrado' | 'em_dia' | 'atencao' | 'atrasado' | 'pausado'; // retrocompatibility

  // Organização
  tags?: string[];
  segmento?: string;
  prioridade?: 'Alta' | 'Média' | 'Baixa';
  observacoes?: string;

  // Propriedades antigas mantidas
  progresso?: number;
  proxima_entrega?: string;
  pendencia_atual?: string;
  instagram_url?: string;
  dia_pagamento?: number;
  entregas_mensais?: number;
}

export interface ProjetoData {
  id: number;
  cliente_id: number;
  nome: string;
  tipo: string;
  responsavel_id: number;
  progresso: number;
  data_inicio: string;
  prazo: string;
}

export interface ConteudoData {
  id: number;
  cliente_id: number;
  tipo: 'Post' | 'Vídeo' | 'Criativo' | 'Story' | 'Reel' | 'Carrossel';
  titulo: string;
  status: 'Em produção' | 'Em aprovação' | 'Agendado' | 'Publicado';
  data_criacao: string;
}

export interface FinanceiroData {
  id: number;
  cliente_id: number;
  descricao: string;
  valor: number;
  vencimento: string;
  status: 'Pago' | 'Pendente' | 'Atrasado';
}

export interface ArquivoData {
  id: number;
  cliente_id: number;
  nome: string;
  categoria: 'Logos' | 'PDFs' | 'Contratos' | 'Briefing' | 'Vídeos' | 'Imagens' | 'Documentos';
  url: string;
  data_upload: string;
}

export interface HistoricoData {
  id: number;
  cliente_id: number;
  usuario: string;
  descricao: string;
  data_registro: string;
}

export interface LeadData {
  id: number;
  empresa: string;
  contato: string;
  telefone: string;
  email?: string;
  origem: string;
  valor_estimado: number;
  status: 'Prospect' | 'Contato Feito' | 'Reunião' | 'Proposta' | 'Negociação' | 'Fechado' | 'Perdido';
  data_criacao: string;
  nota_ia?: number;
  resumo_ia?: string;
}

export interface TarefaData {
  id: number;
  titulo: string;
  cliente_id: number;
  responsavel_id: number;
  setor: string;
  prioridade: string;
  prazo?: string;
  status: string;
  data_criacao: string;
  comentarios: Array<{ autor: string; texto: string; data: string }>;
  checklists?: Array<{ id: string; text: string; completed: boolean }>;
  link_entrega?: string;
}

export interface CorrecaoData {
  id: number;
  cliente_id: number;
  tarefa_id: number;
  descricao: string;
  responsavel_id: number;
  status: string;
  prazo?: string;
}

export interface MetricaData {
  id: number;
  cliente_id: number;
  data_registro: string;
  seguidores: number;
  alcance: number;
  engajamento: number;
  leads: number;
  cliques_site: number;
  tipo: string;
  anotacao?: string;
}

export interface NotificacaoData {
  id: number;
  mensagem: string;
  tipo: 'info' | 'sucesso' | 'alerta' | 'erro';
  lida: boolean;
  data_criacao: string;
  link?: string; // Para redirecionar ao clicar
}
