// Tipos do sistema Atlas OS

export type UserRole = 'Admin' | 'Designer' | 'Social Media' | 'Secretária' | 'Videomaker' | 'Cliente';

export interface AgenciaData {
  id: number;
  nome: string;
  logo_url?: string;
  tema_cores?: any;
}

export interface User {
  id: number;
  agencia_id: number;
  nome: string;
  email: string;
  funcao: UserRole;
  avatar?: string;
}

export interface ClienteData {
  id: number;
  agencia_id: number;
  nome: string;
  servico: string;
  instagram_url?: string;
  responsavel_id: number;
  status_geral: 'em_dia' | 'atencao' | 'atrasado' | 'pausado';
  progresso: number;
  proxima_entrega?: string;
  pendencia_atual?: string;
  logo?: string;
  instagram?: string;
  whatsapp?: string;
  mrr?: number; // Receita Recorrente Mensal
  dia_pagamento?: number; // Dia de vencimento do pagamento (1 a 31)
  data_inicio?: string;
  nicho_mercado?: string;
  entregas_mensais?: number; // Posts/Entregas por mês
}

export interface LeadData {
  id: number;
  agencia_id: number;
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
  agencia_id: number;
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
}

export interface CorrecaoData {
  id: number;
  agencia_id: number;
  cliente_id: number;
  tarefa_id: number;
  descricao: string;
  responsavel_id: number;
  status: string;
  prazo?: string;
}

export interface MetricaData {
  id: number;
  agencia_id: number;
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
  agencia_id: number;
  mensagem: string;
  tipo: 'info' | 'sucesso' | 'alerta' | 'erro';
  lida: boolean;
  data_criacao: string;
  link?: string; // Para redirecionar ao clicar
}
