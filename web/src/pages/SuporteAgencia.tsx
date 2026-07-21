import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Plus, Loader2, List, Heading, AlertTriangle, ArrowLeft, CheckCircle2, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';

interface Ticket {
  id: number;
  remetente_id: number;
  categoria: string;
  assunto: string;
  prioridade: string;
  descricao: string;
  status: string;
  criado_em: string;
  remetente?: {
    nome: string;
    avatar_url: string;
  };
}

interface Mensagem {
  id: number;
  ticket_id: number;
  remetente_id: number;
  mensagem: string;
  criado_em: string;
  remetente?: {
    nome: string;
    avatar_url: string;
  };
}

export default function SuporteAgenciaPage() {
  const { currentUser } = useApp();
  
  // Apenas quem está usando a conta Atlas (via impersonation) atua como Suporte
  const isAtlas = !!localStorage.getItem('@atlas_impersonation');
  const isAdmin = isAtlas; 
  
  const [view, setView] = useState<'list' | 'create' | 'chat'>('list');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Chat state
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  // Form state
  const [categoria, setCategoria] = useState('');
  const [assunto, setAssunto] = useState('');
  const [prioridade, setPrioridade] = useState('Média');
  const [descricao, setDescricao] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, [currentUser]);

  const fetchTickets = async () => {
    setLoading(true);
    let query = supabase.from('suporte_tickets').select(`*, remetente:usuarios(nome, avatar_url)`).order('criado_em', { ascending: false });
    
    // Se não for admin, vê apenas os próprios tickets
    if (!isAdmin && currentUser) {
      query = query.eq('remetente_id', currentUser.id);
    }
    
    const { data, error } = await query;
    if (!error && data) {
      setTickets(data as any);
    }
    setLoading(false);
  };

  const fetchMensagens = async (ticketId: number) => {
    const { data, error } = await supabase
      .from('suporte_mensagens')
      .select(`*, remetente:usuarios(nome, avatar_url)`)
      .eq('ticket_id', ticketId)
      .order('criado_em', { ascending: true });
      
    if (!error && data) {
      setMensagens(data as any);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoria || !assunto || !descricao || !currentUser) return;
    
    setCreating(true);
    const newTicket = {
      remetente_id: currentUser.id,
      categoria,
      assunto,
      prioridade,
      descricao,
      status: 'Aberto'
    };

    const { data, error } = await supabase.from('suporte_tickets').insert([newTicket]).select();
    
    setCreating(false);
    if (!error && data) {
      setCategoria('');
      setAssunto('');
      setPrioridade('Média');
      setDescricao('');
      fetchTickets();
      setView('list');
    } else {
      alert('Erro ao criar chamado. Verifique se atualizou o banco de dados.');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaMensagem.trim() || !activeTicket || !currentUser) return;
    
    setSendingMsg(true);
    const msg = {
      ticket_id: activeTicket.id,
      remetente_id: currentUser.id,
      mensagem: novaMensagem.trim()
    };
    
    const { error } = await supabase.from('suporte_mensagens').insert([msg]);
    
    if (!error) {
      setNovaMensagem('');
      // Atualizar o ticket para "Em andamento" se estiver aberto e for admin respondendo
      if (isAdmin && activeTicket.status === 'Aberto') {
        await supabase.from('suporte_tickets').update({ status: 'Em andamento' }).eq('id', activeTicket.id);
        setActiveTicket({ ...activeTicket, status: 'Em andamento' });
        fetchTickets();
      }
      fetchMensagens(activeTicket.id);
    }
    setSendingMsg(false);
  };

  const handleCloseTicket = async () => {
    if (!activeTicket) return;
    const { error } = await supabase.from('suporte_tickets').update({ status: 'Fechado' }).eq('id', activeTicket.id);
    if (!error) {
      setActiveTicket({ ...activeTicket, status: 'Fechado' });
      fetchTickets();
    }
  };

  const openTicket = (ticket: Ticket) => {
    setActiveTicket(ticket);
    setView('chat');
    fetchMensagens(ticket.id);
  };

  // --- RENDERS ---
  
  if (view === 'create') {
    return (
      <div className="max-w-3xl mx-auto w-full pb-10">
        <button onClick={() => setView('list')} className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar para Meus Chamados
        </button>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-indigo-500" />
            Abrir Novo Chamado
          </h1>
          <p className="text-zinc-400 mt-1">Descreva o problema para que possamos ajudar da melhor forma.</p>
        </div>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <form onSubmit={handleCreateTicket} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2"><List className="w-4 h-4 text-indigo-500" /> Categoria *</label>
              <select required value={categoria} onChange={e => setCategoria(e.target.value)} className="w-full h-11 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                <option value="">Selecione...</option>
                <option value="Dúvida">Dúvida Geral</option>
                <option value="Bug no Sistema">Erro/Bug no Sistema</option>
                <option value="Financeiro">Financeiro / Faturamento</option>
                <option value="Sugestão">Sugestão de Melhoria</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2"><Heading className="w-4 h-4 text-indigo-500" /> Assunto *</label>
              <input type="text" value={assunto} onChange={(e) => setAssunto(e.target.value)} required placeholder="Resumo do problema" className="w-full h-11 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-indigo-500" /> Prioridade *</label>
              <select required value={prioridade} onChange={e => setPrioridade(e.target.value)} className="w-full h-11 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
                <option value="Urgente">Urgente</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-indigo-500" /> Descrição Detalhada *</label>
              <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} required rows={5} placeholder="O que você estava fazendo? O que aconteceu?" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none" />
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={creating} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg transition-all disabled:opacity-50">
                {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {creating ? 'Salvando...' : 'Enviar Chamado'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  if (view === 'chat' && activeTicket) {
    return (
      <div className="max-w-4xl mx-auto w-full h-[calc(100vh-140px)] flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setView('list')} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          {isAdmin && activeTicket.status !== 'Fechado' && (
            <button onClick={handleCloseTicket} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-sm transition-colors">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Marcar como Resolvido
            </button>
          )}
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-t-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-zinc-100">#{activeTicket.id} - {activeTicket.assunto}</h2>
            <p className="text-sm text-zinc-400 mt-1 flex items-center gap-2">
              <User className="w-3 h-3" /> {activeTicket.remetente?.nome} &bull; {new Date(activeTicket.criado_em).toLocaleString('pt-BR')} &bull; {activeTicket.categoria}
            </p>
          </div>
          <div className="flex gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${activeTicket.prioridade === 'Urgente' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : activeTicket.prioridade === 'Alta' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-zinc-800 text-zinc-400'}`}>
              {activeTicket.prioridade}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${activeTicket.status === 'Fechado' ? 'bg-emerald-500/20 text-emerald-400' : activeTicket.status === 'Em andamento' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}`}>
              {activeTicket.status}
            </span>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 bg-zinc-950 border-x border-zinc-800 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          {/* Ticket Description as first message */}
          <div className="flex gap-4">
            <img src={activeTicket.remetente?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'} className="w-10 h-10 rounded-full bg-zinc-800" alt="Avatar" />
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-semibold text-zinc-200">{activeTicket.remetente?.nome}</span>
                <span className="text-xs text-zinc-500">{new Date(activeTicket.criado_em).toLocaleString('pt-BR')}</span>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-tl-none p-4 text-zinc-300 text-sm whitespace-pre-wrap">
                {activeTicket.descricao}
              </div>
            </div>
          </div>

          {/* Replies */}
          {mensagens.map(msg => {
            const isMe = msg.remetente_id === currentUser?.id;
            return (
              <div key={msg.id} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}>
                <img src={msg.remetente?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'} className="w-10 h-10 rounded-full bg-zinc-800" alt="Avatar" />
                <div className={`flex-1 flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-semibold text-zinc-200">{msg.remetente?.nome}</span>
                    <span className="text-xs text-zinc-500">{new Date(msg.criado_em).toLocaleString('pt-BR')}</span>
                  </div>
                  <div className={`rounded-2xl p-4 text-sm whitespace-pre-wrap max-w-[85%] ${isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-none'}`}>
                    {msg.mensagem}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Area */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-b-xl p-4">
          {activeTicket.status === 'Fechado' ? (
            <div className="text-center text-zinc-500 text-sm py-2">
              Este chamado foi marcado como fechado.
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <input 
                type="text" 
                value={novaMensagem} 
                onChange={e => setNovaMensagem(e.target.value)} 
                placeholder="Escreva sua resposta..." 
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-zinc-100 focus:outline-none focus:border-indigo-500" 
              />
              <button disabled={sendingMsg || !novaMensagem.trim()} type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 flex items-center justify-center transition-colors disabled:opacity-50">
                {sendingMsg ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Default List View
  return (
    <div className="max-w-5xl mx-auto w-full pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-indigo-500" />
            {isAdmin ? 'Central de Suporte (Helpdesk)' : 'Meus Chamados'}
          </h1>
          <p className="text-zinc-400 mt-1">
            {isAdmin ? 'Gerencie e responda às solicitações da equipe.' : 'Acompanhe suas solicitações de suporte e fale com a equipe.'}
          </p>
        </div>
        
        {!isAdmin && (
          <button onClick={() => setView('create')} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors">
            <Plus className="w-5 h-5" /> Novo Chamado
          </button>
        )}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-indigo-500" />
            <p>Carregando chamados...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-zinc-500" />
            </div>
            <h3 className="text-lg font-medium text-zinc-200">Nenhum chamado encontrado</h3>
            <p className="text-zinc-500 mt-1">Ainda não há tickets registrados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-zinc-800/50 bg-zinc-900/50 text-xs uppercase text-zinc-500 font-semibold">
                  <th className="p-4">Assunto</th>
                  {isAdmin && <th className="p-4">Solicitante</th>}
                  <th className="p-4">Categoria</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Prioridade</th>
                  <th className="p-4 text-right">Data</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(ticket => (
                  <tr 
                    key={ticket.id} 
                    onClick={() => openTicket(ticket)}
                    className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors cursor-pointer group"
                  >
                    <td className="p-4">
                      <p className="text-sm font-semibold text-zinc-200 group-hover:text-indigo-400 transition-colors">{ticket.assunto}</p>
                      <p className="text-xs text-zinc-500 truncate max-w-xs">{ticket.descricao}</p>
                    </td>
                    {isAdmin && (
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <img src={ticket.remetente?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=u'} className="w-6 h-6 rounded-full bg-zinc-800" alt="avatar" />
                          <span className="text-sm text-zinc-300">{ticket.remetente?.nome}</span>
                        </div>
                      </td>
                    )}
                    <td className="p-4"><span className="text-sm text-zinc-400">{ticket.categoria}</span></td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${ticket.status === 'Fechado' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ticket.status === 'Em andamento' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-medium ${ticket.prioridade === 'Urgente' ? 'text-red-400' : ticket.prioridade === 'Alta' ? 'text-orange-400' : 'text-zinc-500'}`}>
                        {ticket.prioridade}
                      </span>
                    </td>
                    <td className="p-4 text-right text-sm text-zinc-500">
                      {new Date(ticket.criado_em).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
