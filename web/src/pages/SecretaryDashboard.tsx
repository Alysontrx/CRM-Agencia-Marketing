import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { 
  Users, MessageCircle, Calendar as CalendarIcon, 
  CreditCard, Search, Phone, Bell, Star,
  Clock, CheckCircle2, AlertCircle, FileText,
  Mail, ExternalLink, Video
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function SecretaryDashboard() {
  const { currentUser, clientes, tarefas, leads } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  // Lógica de Triagem
  const reunioesHoje = tarefas.filter(t => {
    if (t.setor !== 'Reunião' || !t.prazo) return false;
    const isToday = new Date(t.prazo).toDateString() === new Date().toDateString();
    return isToday;
  }).sort((a, b) => new Date(a.prazo!).getTime() - new Date(b.prazo!).getTime());

  const clientesInadimplentes = clientes.filter(c => c.status_geral === 'atrasado');
  const clientesOnboarding = clientes.filter(c => c.status_geral === 'Em implantação');
  const novosLeads = leads.filter(l => l.status === 'Contato Feito' || l.status === 'Prospect');

  const filteredClientes = clientes.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.empresa || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="flex-1 flex flex-col min-h-0 w-full max-w-[1600px] mx-auto pb-10 space-y-8"
    >
      
      {/* HEADER DE BOAS VINDAS */}
      <div className="shrink-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-pink-500/20 rounded-3xl p-8 relative overflow-hidden shadow-lg">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-500/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <Avatar className="w-16 h-16 border-2 border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.4)]">
              <AvatarImage src={currentUser?.avatar} />
              <AvatarFallback className="bg-pink-900 text-pink-300 text-xl">{getInitials(currentUser?.nome || 'S')}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
                Bom dia, {currentUser?.nome.split(' ')[0]} <span className="animate-bounce inline-block">✨</span>
              </h1>
              <p className="text-pink-200/70 font-medium text-sm mt-1">
                Você tem <strong className="text-pink-300">{reunioesHoje.length} reuniões</strong> agendadas e <strong className="text-pink-300">{novosLeads.length} novos contatos</strong> para hoje.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            {/* Botões de contato removidos temporariamente */}
          </div>
        </div>
      </div>

      {/* QUICK METRICS TRIAGE */}
      <div className="shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#18181b] border-zinc-800/80 rounded-2xl hover:border-pink-500/30 transition-all cursor-pointer group shadow-md">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarIcon className="w-6 h-6 text-pink-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Agenda do Dia</p>
              <h2 className="text-2xl font-black text-white">{reunioesHoje.length}</h2>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#18181b] border-zinc-800/80 rounded-2xl hover:border-purple-500/30 transition-all cursor-pointer group shadow-md">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Leads Novos</p>
              <h2 className="text-2xl font-black text-white">{novosLeads.length}</h2>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#18181b] border-zinc-800/80 rounded-2xl hover:border-indigo-500/30 transition-all cursor-pointer group shadow-md">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Star className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Onboarding</p>
              <h2 className="text-2xl font-black text-white">{clientesOnboarding.length}</h2>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#18181b] border-zinc-800/80 rounded-2xl hover:border-rose-500/30 transition-all cursor-pointer group shadow-md">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CreditCard className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Inadimplentes</p>
              <h2 className="text-2xl font-black text-white">{clientesInadimplentes.length}</h2>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MAIN TWO COLUMNS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUNA ESQUERDA: Agenda e Avisos */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Reuniões do Dia */}
          <section className="bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 blur-[50px] pointer-events-none" />
            <h3 className="text-lg font-black text-white mb-5 flex items-center gap-2">
              <Clock className="w-5 h-5 text-pink-400" /> Radar de Reuniões
            </h3>

            <div className="space-y-4">
              {reunioesHoje.length === 0 ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                  <p className="text-sm text-zinc-500 font-medium">Nenhuma reunião hoje</p>
                </div>
              ) : (
                reunioesHoje.map(reuniao => {
                  const cliente = clientes.find(c => c.id === reuniao.cliente_id);
                  const hora = reuniao.prazo ? new Date(reuniao.prazo).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'}) : '--';
                  
                  // Extract link if exists
                  const match = reuniao.titulo.match(/\((https?:\/\/[^\)]+)\)/);
                  const link = match ? match[1] : null;
                  const cleanTitle = reuniao.titulo.replace(/\(https?:\/\/[^\)]+\)/, '').replace('Reunião: ', '').trim();

                  return (
                    <div key={reuniao.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 hover:border-pink-500/30 transition-colors group">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-pink-500/10 text-pink-400 border-pink-500/30 px-2 py-0.5 rounded text-[10px] uppercase font-black">{hora}</Badge>
                        </div>
                        {link && (
                          <a href={link} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-pink-400 transition-colors" title="Abrir Sala">
                            <Video className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-zinc-200 line-clamp-1">{cleanTitle}</h4>
                      <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider font-bold">{cliente?.nome || 'Cliente Interno'}</p>
                      
                      <button className="w-full mt-4 flex items-center justify-center gap-2 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold rounded-lg border border-zinc-800 transition-colors">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> Avisar Cliente
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Mural de Recados */}
          <section className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <h3 className="text-lg font-black text-amber-500 mb-5 flex items-center gap-2">
              <FileText className="w-5 h-5" /> Mural de Recados
            </h3>
            <div className="space-y-3">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                <p className="text-sm text-amber-200/80 font-medium italic">"Lembrar de cobrar o contrato da Clínica XYZ hoje de tarde!"</p>
                <p className="text-[10px] text-amber-500/60 font-black tracking-widest uppercase mt-2 text-right">- Admin</p>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 border-dashed cursor-pointer hover:bg-zinc-800/50 transition-colors flex items-center justify-center text-zinc-500 text-sm font-bold">
                + Novo Recado
              </div>
            </div>
          </section>

        </div>

        {/* COLUNA DIREITA: Diretório de Clientes */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-[#18181b] border border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-xl flex-1 flex flex-col h-full min-h-[600px]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Users className="w-6 h-6 text-indigo-400" /> Diretório de Clientes
                </h3>
                <p className="text-zinc-500 text-sm mt-1">Acesso ultra-rápido para contato e cobrança.</p>
              </div>
              
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Buscar cliente..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div className="overflow-y-auto custom-scrollbar flex-1 pr-2 space-y-3">
              {filteredClientes.length === 0 ? (
                <div className="text-center py-20 text-zinc-500">Nenhum cliente encontrado.</div>
              ) : (
                filteredClientes.map(cliente => {
                  const isAtrasado = cliente.status_geral === 'atrasado';
                  const isOnboarding = cliente.status_geral === 'Em implantação';

                  return (
                    <div key={cliente.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-zinc-900/40 hover:bg-zinc-800/40 border border-zinc-800/60 rounded-2xl p-4 gap-4 transition-all group">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12 border border-zinc-700">
                          <AvatarImage src={cliente.logo} />
                          <AvatarFallback className="bg-zinc-800 text-zinc-400 font-bold">{getInitials(cliente.nome)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="text-zinc-200 font-bold text-base leading-tight flex items-center gap-2">
                            {cliente.nome}
                            {isAtrasado && <AlertCircle className="w-3.5 h-3.5 text-rose-500" />}
                            {isOnboarding && <Star className="w-3.5 h-3.5 text-amber-500" />}
                          </h4>
                          <p className="text-zinc-500 text-xs font-medium mt-0.5">{cliente.empresa || cliente.nicho || 'Sem categoria'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        {isAtrasado && (
                          <Badge variant="outline" className="bg-rose-500/10 text-rose-400 border-rose-500/20 text-[10px] font-black uppercase hidden md:flex">Inadimplente</Badge>
                        )}
                        {isOnboarding && (
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px] font-black uppercase hidden md:flex">Onboarding</Badge>
                        )}

                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-sm font-bold rounded-xl transition-all shadow-inner group-hover:border-zinc-700">
                          <FileText className="w-4 h-4 text-zinc-500" /> <span className="hidden sm:inline">Docs</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </section>
        </div>

      </div>
    </motion.div>
  );
}
