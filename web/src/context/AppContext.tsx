import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, ClienteData, TarefaData, CorrecaoData, MetricaData, LeadData, NotificacaoData, ProjetoData, ConteudoData, FinanceiroData, ArquivoData, HistoricoData } from '../data/types';

import { supabase } from '../lib/supabase';
import { generateOnboardingTasks, qualifyLead } from '../lib/ai';
import { sendWelcomeEmail } from '../lib/email';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  clientes: ClienteData[];
  leads: LeadData[];
  tarefas: TarefaData[];
  correcoes: CorrecaoData[];
  metricas: MetricaData[];
  notificacoes: NotificacaoData[];
  projetos: ProjetoData[];
  conteudos: ConteudoData[];
  financeiro: FinanceiroData[];
  arquivos: ArquivoData[];
  historico: HistoricoData[];
  loadingData: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  updateTarefaStatus: (tarefaId: number, newStatus: string) => Promise<void>;
  updateTarefa: (id: number, updates: Partial<Omit<TarefaData, 'id' | 'data_criacao' | 'comentarios'>>) => Promise<void>;
  updateLead: (id: number, changes: Partial<LeadData>) => Promise<void>;
  updateCliente: (id: number, changes: Partial<ClienteData>) => Promise<void>;
  updateMetrica: (id: number, changes: Partial<MetricaData>) => Promise<void>;
  deleteTarefa: (id: number) => Promise<void>;
  deleteLead: (id: number) => Promise<void>;
  deleteCliente: (id: number) => Promise<void>;
  deleteMetrica: (id: number) => Promise<void>;
  addComentario: (tarefaId: number, texto: string) => Promise<void>;
  addTarefa: (tarefa: Omit<TarefaData, 'id' | 'data_criacao' | 'comentarios'>, googleSyncData?: { isAllDay?: boolean; endDateTime?: string }) => Promise<void>;
  addCliente: (cliente: Omit<ClienteData, 'id' | 'status_geral' | 'progresso'>) => Promise<void>;
  addLead: (lead: Omit<LeadData, 'id' | 'data_criacao' | 'nota_ia' | 'resumo_ia'>) => Promise<void>;
  addMetrica: (metrica: Omit<MetricaData, 'id'>) => Promise<void>;
  addNotificacao: (mensagem: string, tipo: 'info' | 'sucesso' | 'alerta' | 'erro') => Promise<void>;
  marcarNotificacaoLida: (id: number) => Promise<void>;
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: number, changes: Partial<User>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  setTarefas: React.Dispatch<React.SetStateAction<TarefaData[]>>;
  setClientes: React.Dispatch<React.SetStateAction<ClienteData[]>>;
  setLeads: React.Dispatch<React.SetStateAction<LeadData[]>>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  addProjeto: (projeto: Omit<ProjetoData, 'id' | 'data_inicio'>) => Promise<void>;
  addConteudo: (conteudo: Omit<ConteudoData, 'id' | 'data_criacao'>) => Promise<void>;
  addFinanceiro: (fin: Omit<FinanceiroData, 'id'>) => Promise<void>;
  addArquivo: (arq: Omit<ArquivoData, 'id' | 'data_upload'>) => Promise<void>;
  addHistorico: (hist: Omit<HistoricoData, 'id' | 'data_registro'>) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [correcoes] = useState<CorrecaoData[]>([]);
  
  const [clientes, setClientes] = useState<ClienteData[]>([]);
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [tarefas, setTarefas] = useState<TarefaData[]>([]);
  const [metricas, setMetricas] = useState<MetricaData[]>([]);
  const [notificacoes, setNotificacoes] = useState<NotificacaoData[]>([]);
  const [projetos, setProjetos] = useState<ProjetoData[]>([]);
  const [conteudos, setConteudos] = useState<ConteudoData[]>([]);
  const [financeiro, setFinanceiro] = useState<FinanceiroData[]>([]);
  const [arquivos, setArquivos] = useState<ArquivoData[]>([]);
  const [historico, setHistorico] = useState<HistoricoData[]>([]);
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
        const [resClientes, resLeads, resTarefas, resMetricas, resNotificacoes, resUsers, resProj, resCont, resFin, resArq, resHist] = await Promise.all([
          supabase.from('clientes').select('*').order('id', { ascending: false }),
          supabase.from('leads').select('*').order('id', { ascending: false }),
          supabase.from('tarefas').select('*').order('id', { ascending: false }),
          supabase.from('metricas').select('*').order('id', { ascending: false }),
          supabase.from('notificacoes').select('*').order('id', { ascending: false }),
          supabase.from('usuarios').select('*').order('id', { ascending: false }),
          supabase.from('projetos').select('*').order('id', { ascending: false }),
          supabase.from('conteudos').select('*').order('id', { ascending: false }),
          supabase.from('financeiro').select('*').order('id', { ascending: false }),
          supabase.from('arquivos').select('*').order('id', { ascending: false }),
          supabase.from('historico_clientes').select('*').order('id', { ascending: false })
        ]);

        if (resClientes.data) setClientes(resClientes.data);
        if (resLeads.data) setLeads(resLeads.data.map((l: any) => ({...l, data_criacao: l.data_criacao || l.criado_em || l.created_at})));
        if (resTarefas.data) setTarefas(resTarefas.data.map((t: any) => ({...t, data_criacao: t.data_criacao || t.criado_em || t.created_at})));
        if (resMetricas.data) setMetricas(resMetricas.data);
        if (resNotificacoes.data) setNotificacoes(resNotificacoes.data.map((n: any) => ({...n, data_criacao: n.data_criacao || n.criado_em || n.created_at})));
        if (resUsers.data) setUsers(resUsers.data.map((u: any) => ({ ...u, avatar: u.avatar_url })));
        if (resProj.data) setProjetos(resProj.data);
        if (resCont.data) setConteudos(resCont.data.map((c: any) => ({...c, data_criacao: c.data_criacao || c.criado_em || c.created_at})));
        if (resFin.data) setFinanceiro(resFin.data);
        if (resArq.data) setArquivos(resArq.data);
        if (resHist.data) setHistorico(resHist.data);
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
      return true; 
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateTarefaStatus = async (tarefaId: number, newStatus: string) => {
    const { error } = await supabase.from('tarefas').update({ status: newStatus }).eq('id', tarefaId);
    if (!error) {
      setTarefas(prev => prev.map(t => t.id === tarefaId ? { ...t, status: newStatus } : t));
    }
  };

  const updateTarefa = async (id: number, updates: Partial<Omit<TarefaData, 'id' | 'data_criacao' | 'comentarios'>>) => {
    const { error } = await supabase.from('tarefas').update(updates).eq('id', id);
    if (!error) {
      setTarefas(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    } else {
      console.error('Erro ao atualizar Tarefa:', error);
      alert('Erro ao atualizar tarefa');
    }
  };

  const deleteTarefa = async (id: number) => {
    const { error } = await supabase.from('tarefas').delete().eq('id', id);
    if (!error) {
      setTarefas(prev => prev.filter(t => t.id !== id));
      addNotificacao('Tarefa excluída.', 'info');
    } else {
      console.error('Erro ao excluir Tarefa:', error);
      alert('Erro ao excluir tarefa');
    }
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

  const addTarefa = async (tarefa: Omit<TarefaData, 'id' | 'data_criacao' | 'comentarios'>, googleSyncData?: { isAllDay?: boolean; endDateTime?: string }) => {
    if (!currentUser) return;
    const { data, error } = await supabase.from('tarefas').insert([tarefa]).select().single();
    if (error) {
      console.error('Erro ao adicionar Tarefa:', error);
      alert(`Erro ao adicionar tarefa. \nDetalhes: ${error.message}`);
    }
    if (data && !error) {
      setTarefas(prev => [data, ...prev]);

      // Sincronizar com o Google Calendar caso tenha um prazo e o usuário esteja logado com o Google
      if (tarefa.prazo) {
        const token = localStorage.getItem('@crm_google_token');
        const calendarId = import.meta.env.VITE_GOOGLE_CALENDAR_ID || 'primary';
        if (token) {
          const start = new Date(tarefa.prazo);
          
          let gStart: any;
          let gEnd: any;
          
          if (googleSyncData?.isAllDay) {
            const dateStr = start.toISOString().split('T')[0];
            gStart = { date: dateStr };
            const nextDay = new Date(start);
            nextDay.setDate(nextDay.getDate() + 1);
            gEnd = { date: nextDay.toISOString().split('T')[0] };
          } else {
            gStart = { dateTime: start.toISOString() };
            if (googleSyncData?.endDateTime) {
              gEnd = { dateTime: new Date(googleSyncData.endDateTime).toISOString() };
            } else {
              gEnd = { dateTime: new Date(start.getTime() + (60 * 60 * 1000)).toISOString() };
            }
          }
          
          // Map CRM Sector to Google Calendar colorId
          let gColorId = '9'; // Blueberry (Default Blue)
          if (tarefa.setor === 'Reunião') gColorId = '11'; // Tomato (Red)
          else if (tarefa.setor === 'Design') gColorId = '10'; // Basil (Green)
          else if (tarefa.setor === 'Marketing') gColorId = '6'; // Tangerine (Orange)
          else if (tarefa.setor === 'Outros') gColorId = '3'; // Grape (Purple)

          fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              summary: `[Sense] ${tarefa.titulo}`,
              description: `Setor: ${tarefa.setor} | Prioridade: ${tarefa.prioridade}`,
              colorId: gColorId,
              start: gStart,
              end: gEnd
            })
          }).then(async res => {
            if (!res.ok) {
              if (res.status === 401) {
                localStorage.removeItem('@crm_google_token');
                alert('A sua conexão com o Google Agenda expirou! Por favor, vá até o menu "Calendário" e clique em "Conectar Google Agenda" novamente.');
              } else {
                const errText = await res.text();
                console.error('Google API Error:', errText);
                alert(`Erro na sincronização com o Google: ${res.status} - ${errText}`);
              }
            }
          }).catch(err => {
            console.error('Erro de rede ao sincronizar tarefa com Google Calendar:', err);
            alert(`Erro de rede Google Calendar: ${err.message}`);
          });
        }
      }
    }
  };

  const addCliente = async (cliente: Omit<ClienteData, 'id' | 'status_geral' | 'progresso'>) => {
    if (!currentUser) return;
    const { data, error } = await supabase.from('clientes').insert([cliente]).select().single();
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
          const tasksComCliente = tasks.map(t => ({ ...t, cliente_id: data.id }));
          const res = await supabase.from('tarefas').insert(tasksComCliente).select();
          if (res.data) {
            setTarefas(prev => [...res.data, ...prev]);
            addNotificacao(`A Inteligência Artificial gerou o plano de ação (onboarding) para o cliente ${data.nome}.`, 'sucesso');
          }
        }
      });
    }
  };

  const addLead = async (lead: Omit<LeadData, 'id' | 'data_criacao' | 'nota_ia' | 'resumo_ia'>) => {
    if (!currentUser) return;
    const { data, error } = await supabase.from('leads').insert([lead]).select().single();
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

  const addMetrica = async (metrica: Omit<MetricaData, 'id'>) => {
    if (!currentUser) return;
    const { data, error } = await supabase.from('metricas').insert([metrica]).select().single();
    if (data && !error) setMetricas(prev => [data, ...prev]);
  };

  const addUser = async (user: Omit<User, 'id'>) => {
    if (!currentUser) return;
    const { avatar, ...rest } = user as any;
    
    // Pegando o maior ID atual para evitar o bug de sequência do Supabase
    const { data: maxUsers } = await supabase.from('usuarios').select('id').order('id', { ascending: false }).limit(1);
    const nextId = (maxUsers && maxUsers.length > 0) ? maxUsers[0].id + 1 : 1;

    const novoUser = { ...rest, id: nextId, avatar_url: avatar };
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
    const nova = { mensagem, tipo, lida: false };
    const { data, error } = await supabase.from('notificacoes').insert([nova]).select().single();
    if (error) {
       console.error('Erro ao salvar notificação:', error);
       alert(mensagem); // Fallback nativo
    }
    if (data && !error) setNotificacoes(prev => [data, ...prev]);
  };

  const addProjeto = async (projeto: Omit<ProjetoData, 'id' | 'data_inicio'>) => {
    if (!currentUser) return;
    const { data, error } = await supabase.from('projetos').insert([projeto]).select().single();
    if (data && !error) setProjetos(prev => [data, ...prev]);
  };

  const addConteudo = async (conteudo: Omit<ConteudoData, 'id' | 'data_criacao'>) => {
    if (!currentUser) return;
    const { data, error } = await supabase.from('conteudos').insert([conteudo]).select().single();
    if (data && !error) setConteudos(prev => [data, ...prev]);
  };

  const addFinanceiro = async (fin: Omit<FinanceiroData, 'id'>) => {
    if (!currentUser) return;
    const { data, error } = await supabase.from('financeiro').insert([fin]).select().single();
    if (data && !error) setFinanceiro(prev => [data, ...prev]);
  };

  const addArquivo = async (arq: Omit<ArquivoData, 'id' | 'data_upload'>) => {
    if (!currentUser) return;
    const { data, error } = await supabase.from('arquivos').insert([arq]).select().single();
    if (data && !error) setArquivos(prev => [data, ...prev]);
  };

  const addHistorico = async (hist: Omit<HistoricoData, 'id' | 'data_registro'>) => {
    if (!currentUser) return;
    const { data, error } = await supabase.from('historico_clientes').insert([hist]).select().single();
    if (data && !error) setHistorico(prev => [data, ...prev]);
  };

  const marcarNotificacaoLida = async (id: number) => {
    setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
    await supabase.from('notificacoes').update({ lida: true }).eq('id', id);
  };

  return (
    <AppContext.Provider value={{
      currentUser, users, clientes, leads, tarefas, correcoes, metricas, notificacoes, projetos, conteudos, financeiro, arquivos, historico, loadingData,
      login, logout, updateTarefaStatus, updateTarefa, updateLead, updateCliente, updateMetrica, 
      deleteTarefa, deleteLead, deleteCliente, deleteMetrica,
      addComentario, addTarefa, addCliente, addLead, addMetrica, addNotificacao, marcarNotificacaoLida, addUser, updateUser, deleteUser, setTarefas, setClientes, setLeads, setUsers,
      addProjeto, addConteudo, addFinanceiro, addArquivo, addHistorico
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
