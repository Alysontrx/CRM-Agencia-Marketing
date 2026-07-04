import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AgenciaData, User, ClienteData, TarefaData, CorrecaoData, MetricaData, LeadData, NotificacaoData } from '../data/types';
import { MOCK_USERS, MOCK_AGENCIAS, MOCK_CORRECOES } from '../data/mockData';
import { supabase } from '../lib/supabase';
import { generateOnboardingTasks, qualifyLead } from '../lib/ai';
import { sendWelcomeEmail } from '../lib/email';

interface AppContextType {
  currentUser: User | null;
  currentAgencia: AgenciaData | null;
  users: User[];
  clientes: ClienteData[];
  leads: LeadData[];
  tarefas: TarefaData[];
  correcoes: CorrecaoData[];
  metricas: MetricaData[];
  notificacoes: NotificacaoData[];
  loadingData: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  updateTarefa: (id: number, changes: Partial<TarefaData>) => Promise<void>;
  updateLead: (id: number, changes: Partial<LeadData>) => Promise<void>;
  updateCliente: (id: number, changes: Partial<ClienteData>) => Promise<void>;
  updateMetrica: (id: number, changes: Partial<MetricaData>) => Promise<void>;
  deleteTarefa: (id: number) => Promise<void>;
  deleteLead: (id: number) => Promise<void>;
  deleteCliente: (id: number) => Promise<void>;
  deleteMetrica: (id: number) => Promise<void>;
  addComentario: (tarefaId: number, texto: string) => Promise<void>;
  addTarefa: (tarefa: Omit<TarefaData, 'id' | 'data_criacao' | 'comentarios' | 'agencia_id'>) => Promise<void>;
  addCliente: (cliente: Omit<ClienteData, 'id' | 'status_geral' | 'progresso' | 'agencia_id'>) => Promise<void>;
  addLead: (lead: Omit<LeadData, 'id' | 'data_criacao' | 'nota_ia' | 'resumo_ia' | 'agencia_id'>) => Promise<void>;
  addMetrica: (metrica: Omit<MetricaData, 'id' | 'agencia_id'>) => Promise<void>;
  addNotificacao: (mensagem: string, tipo: 'info' | 'sucesso' | 'alerta' | 'erro') => Promise<void>;
  marcarNotificacaoLida: (id: number) => Promise<void>;
  addUser: (user: Omit<User, 'id' | 'agencia_id'>) => Promise<void>;
  updateUser: (id: number, changes: Partial<User>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  setTarefas: React.Dispatch<React.SetStateAction<TarefaData[]>>;
  setClientes: React.Dispatch<React.SetStateAction<ClienteData[]>>;
  setLeads: React.Dispatch<React.SetStateAction<LeadData[]>>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentAgencia, setCurrentAgencia] = useState<AgenciaData | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [correcoes] = useState<CorrecaoData[]>(MOCK_CORRECOES);
  
  const [clientes, setClientes] = useState<ClienteData[]>([]);
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [tarefas, setTarefas] = useState<TarefaData[]>([]);
  const [metricas, setMetricas] = useState<MetricaData[]>([]);
  const [notificacoes, setNotificacoes] = useState<NotificacaoData[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      if (!currentUser) {
        setLoadingData(false);
        return;
      }
      
      setLoadingData(true);
      try {
        const [resClientes, resLeads, resTarefas, resMetricas, resNotificacoes, resUsers] = await Promise.all([
          supabase.from('clientes').select('*').eq('agencia_id', currentUser.agencia_id).order('id', { ascending: false }),
          supabase.from('leads').select('*').eq('agencia_id', currentUser.agencia_id).order('id', { ascending: false }),
          supabase.from('tarefas').select('*').eq('agencia_id', currentUser.agencia_id).order('id', { ascending: false }),
          supabase.from('metricas').select('*').eq('agencia_id', currentUser.agencia_id).order('id', { ascending: false }),
          supabase.from('notificacoes').select('*').eq('agencia_id', currentUser.agencia_id).order('id', { ascending: false }),
          supabase.from('usuarios').select('*').eq('agencia_id', currentUser.agencia_id).order('id', { ascending: false })
        ]);

        if (resClientes.data) setClientes(resClientes.data);
        if (resLeads.data) setLeads(resLeads.data);
        if (resTarefas.data) setTarefas(resTarefas.data);
        if (resMetricas.data) setMetricas(resMetricas.data);
        if (resNotificacoes.data) setNotificacoes(resNotificacoes.data);
        if (resUsers.data) setUsers(resUsers.data.map((u: any) => ({ ...u, avatar: u.avatar_url })));
      } catch (err) {
        console.error("Erro ao carregar dados do Supabase", err);
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
  }, [currentUser]);

  const login = async (email: string): Promise<boolean> => {
    const { data: user } = await supabase.from('usuarios').select('*').ilike('email', email).single();
    if (user) { 
      setCurrentUser({ ...user, avatar: user.avatar_url }); 
      const { data: agencia } = await supabase.from('agencias').select('*').eq('id', user.agencia_id).single();
      setCurrentAgencia(agencia);
      return true; 
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentAgencia(null);
  };

  const updateTarefa = async (id: number, changes: Partial<TarefaData>) => {
    setTarefas(prev => prev.map(t => t.id === id ? { ...t, ...changes } : t));
    await supabase.from('tarefas').update(changes).eq('id', id);
  };

  const updateLead = async (id: number, changes: Partial<LeadData>) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...changes } : l));
    await supabase.from('leads').update(changes).eq('id', id);
  };

  const updateCliente = async (id: number, changes: Partial<ClienteData>) => {
    setClientes(prev => prev.map(c => c.id === id ? { ...c, ...changes } : c));
    await supabase.from('clientes').update(changes).eq('id', id);
  };

  const updateMetrica = async (id: number, changes: Partial<MetricaData>) => {
    setMetricas(prev => prev.map(m => m.id === id ? { ...m, ...changes } : m));
    await supabase.from('metricas').update(changes).eq('id', id);
  };

  const deleteTarefa = async (id: number) => {
    setTarefas(prev => prev.filter(t => t.id !== id));
    await supabase.from('tarefas').delete().eq('id', id);
    addNotificacao('Tarefa excluída.', 'info');
  };

  const deleteLead = async (id: number) => {
    setLeads(prev => prev.filter(l => l.id !== id));
    await supabase.from('leads').delete().eq('id', id);
    addNotificacao('Lead excluído.', 'info');
  };

  const deleteCliente = async (id: number) => {
    setClientes(prev => prev.filter(c => c.id !== id));
    await supabase.from('clientes').delete().eq('id', id);
    addNotificacao('Cliente excluído.', 'info');
  };

  const deleteMetrica = async (id: number) => {
    setMetricas(prev => prev.filter(m => m.id !== id));
    await supabase.from('metricas').delete().eq('id', id);
    addNotificacao('Métrica excluída.', 'info');
  };

  const deleteUser = async (id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    await supabase.from('usuarios').delete().eq('id', id);
    addNotificacao('Funcionário excluído da equipe.', 'info');
  };

  const addComentario = async (tarefaId: number, texto: string) => {
    if (!currentUser) return;
    const tarefa = tarefas.find(t => t.id === tarefaId);
    if (!tarefa) return;
    
    const novoComentario = {
      autor: currentUser.nome,
      texto,
      data: new Date().toLocaleDateString('pt-BR')
    };
    
    const novosComentarios = [...(tarefa.comentarios || []), novoComentario];
    
    setTarefas(prev => prev.map(t => t.id === tarefaId ? { ...t, comentarios: novosComentarios } : t));
    await supabase.from('tarefas').update({ comentarios: novosComentarios }).eq('id', tarefaId);
  };

  const addTarefa = async (tarefa: Omit<TarefaData, 'id' | 'data_criacao' | 'comentarios' | 'agencia_id'>) => {
    if (!currentUser) return;
    const novaTarefa = { ...tarefa, agencia_id: currentUser.agencia_id };
    const { data, error } = await supabase.from('tarefas').insert([novaTarefa]).select().single();
    if (error) {
      console.error('Erro ao adicionar Tarefa:', error);
      alert(`Erro ao adicionar tarefa. \nDetalhes: ${error.message} \nPayload: cliente_id=${novaTarefa.cliente_id}`);
    }
    if (data && !error) setTarefas(prev => [data, ...prev]);
  };

  const addCliente = async (cliente: Omit<ClienteData, 'id' | 'status_geral' | 'progresso' | 'agencia_id'>) => {
    if (!currentUser) return;
    const novoCliente = { ...cliente, agencia_id: currentUser.agencia_id };
    const { data, error } = await supabase.from('clientes').insert([novoCliente]).select().single();
    if (error) {
      console.error('Erro ao criar Cliente no Supabase:', error);
      addNotificacao(`Erro ao salvar Cliente: ${error.message}`, 'erro');
      return;
    }
    if (data && !error) {
      setClientes(prev => [data, ...prev]);
      
      // Sense AI: Gerar tarefas de onboarding automaticamente
      generateOnboardingTasks(data.nome, data.servico, data.responsavel_id).then(async (tasks) => {
        if (tasks.length > 0) {
          const tasksComCliente = tasks.map(t => ({ ...t, cliente_id: data.id, agencia_id: currentUser.agencia_id }));
          const res = await supabase.from('tarefas').insert(tasksComCliente).select();
          if (res.data) {
            setTarefas(prev => [...res.data, ...prev]);
            addNotificacao(`A Sense AI gerou o plano de ação (onboarding) para o cliente ${data.nome}.`, 'sucesso');
          }
        }
      });
    }
  };

  const addLead = async (lead: Omit<LeadData, 'id' | 'data_criacao' | 'nota_ia' | 'resumo_ia' | 'agencia_id'>) => {
    if (!currentUser) return;
    const novoLead = { ...lead, agencia_id: currentUser.agencia_id };
    const { data, error } = await supabase.from('leads').insert([novoLead]).select().single();
    if (error) {
      console.error('Erro ao inserir Lead no Supabase:', error);
      addNotificacao(`Erro ao salvar Lead: ${error.message}`, 'erro');
      return;
    }
    if (data && !error) {
      setLeads(prev => [data, ...prev]);

      // Automação: Envio de E-mail de Boas-vindas
      if (data.email) {
        sendWelcomeEmail(data.empresa, data.email, data.id).then((enviado) => {
          if (enviado) addNotificacao(`E-mail de apresentação enviado para ${data.empresa}`, 'sucesso');
        });
      }

      // Sense AI: Qualificação do Lead e criação de tarefa para o vendedor
      qualifyLead(data.empresa, data.contato, data.valor_estimado, data.origem).then(async (aiResult) => {
        if (aiResult) {
          // Atualiza o lead com a nota e resumo da IA
          const { data: updatedLead } = await supabase
            .from('leads')
            .update({ nota_ia: aiResult.nota, resumo_ia: aiResult.resumo })
            .eq('id', data.id)
            .select()
            .single();

          if (updatedLead) {
            setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
            addNotificacao(`Lead qualificado pela IA! Nota: ${aiResult.nota}/10`, 'sucesso');
          }

          // Cria a tarefa de follow-up sugerida pela IA
          addTarefa({
            titulo: `${aiResult.tarefa} (${data.empresa})`,
            cliente_id: null as any, // Como é lead, podemos colocar null
            responsavel_id: currentUser?.id || 1,
            setor: 'Atendimento',
            prioridade: aiResult.nota >= 8 ? 'Alta' : 'Média',
            status: 'A fazer'
          });
        }
      });
    }
  };

  const addMetrica = async (metrica: Omit<MetricaData, 'id' | 'agencia_id'>) => {
    if (!currentUser) return;
    const novaMetrica = { ...metrica, agencia_id: currentUser.agencia_id };
    const { data, error } = await supabase.from('metricas').insert([novaMetrica]).select().single();
    if (data && !error) setMetricas(prev => [data, ...prev]);
  };

  const addUser = async (user: Omit<User, 'id' | 'agencia_id'>) => {
    if (!currentUser) return;
    const { avatar, ...rest } = user as any;
    
    // Pegando o maior ID atual para evitar o bug de sequência do Supabase
    const { data: maxUsers } = await supabase.from('usuarios').select('id').order('id', { ascending: false }).limit(1);
    const nextId = (maxUsers && maxUsers.length > 0) ? maxUsers[0].id + 1 : 1;

    const novoUser = { ...rest, id: nextId, avatar_url: avatar, agencia_id: currentUser.agencia_id };
    const { data, error } = await supabase.from('usuarios').insert([novoUser]).select().single();
    if (error) {
      console.error(error);
      alert('Erro ao adicionar: ' + error.message);
    }
    if (data && !error) setUsers(prev => [{...data, avatar: data.avatar_url}, ...prev]);
  };

  const updateUser = async (id: number, changes: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...changes } : u));
    const { avatar, ...rest } = changes as any;
    const dbChanges = avatar !== undefined ? { ...rest, avatar_url: avatar } : rest;
    await supabase.from('usuarios').update(dbChanges).eq('id', id);
  };

  const addNotificacao = async (mensagem: string, tipo: 'info' | 'sucesso' | 'alerta' | 'erro') => {
    if (!currentUser) return;
    const nova = { mensagem, tipo, lida: false, agencia_id: currentUser.agencia_id };
    const { data, error } = await supabase.from('notificacoes').insert([nova]).select().single();
    if (error) {
       console.error('Erro ao salvar notificação:', error);
       alert(mensagem); // Fallback nativo
    }
    if (data && !error) setNotificacoes(prev => [data, ...prev]);
  };

  const marcarNotificacaoLida = async (id: number) => {
    setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
    await supabase.from('notificacoes').update({ lida: true }).eq('id', id);
  };

  return (
    <AppContext.Provider value={{
      currentUser, currentAgencia, users, clientes, leads, tarefas, correcoes, metricas, notificacoes, loadingData,
      login, logout, updateTarefa, updateLead, updateCliente, updateMetrica, 
      deleteTarefa, deleteLead, deleteCliente, deleteMetrica,
      addComentario, addTarefa, addCliente, addLead, addMetrica, addNotificacao, marcarNotificacaoLida, addUser, updateUser, deleteUser, setTarefas, setClientes, setLeads, setUsers
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
