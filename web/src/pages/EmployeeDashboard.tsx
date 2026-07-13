import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  CheckCircle2, Clock, AlertCircle, Calendar, MessageSquare, 
  PlayCircle, Briefcase, Zap, CheckSquare, Upload, FileText, Sparkles 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function EmployeeDashboard() {
  const { currentUser, tarefas, clientes, users, notificacoes } = useApp();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Filtrar tarefas do usuário atual
  const minhasTarefas = tarefas.filter(t => t.responsavel_id === currentUser?.id);
  const emAndamento = minhasTarefas.filter(t => t.status === 'Em andamento');
  const atrasadas = minhasTarefas.filter(t => t.status === 'Atrasado');
  const aprovacoes = minhasTarefas.filter(t => t.status === 'Aguardando revisão');
  const concluidas = minhasTarefas.filter(t => t.status === 'Feito' || t.status === 'Aprovado');

  const reunioesHoje = minhasTarefas.filter(t => {
    if (t.setor !== 'Reunião' || !t.prazo) return false;
    return new Date(t.prazo).toDateString() === new Date().toDateString();
  });

  const agendaTarefas = minhasTarefas
    .filter(t => t.prazo && t.status !== 'Feito' && t.status !== 'Aprovado')
    .sort((a, b) => new Date(a.prazo!).getTime() - new Date(b.prazo!).getTime())
    .slice(0, 4);

  const recentTimeline = (notificacoes || []).slice(0, 4);

  const greeting = currentTime.getHours() < 12 ? 'Bom dia' : currentTime.getHours() < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col min-h-0 w-full max-w-[1600px] mx-auto pb-10 space-y-6">
      
      {/* 1. CABEÇALHO PERSONALIZADO */}
      <div className="flex-shrink-0 bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-6 md:p-8 relative overflow-hidden backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <Avatar className="h-16 w-16 md:h-20 md:w-20 border-4 border-zinc-900 shadow-xl">
              <AvatarImage src={currentUser?.avatar} />
              <AvatarFallback className="text-xl font-bold bg-zinc-800 text-zinc-200">{currentUser?.nome[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                {greeting}, {currentUser?.nome.split(' ')[0]} 👋
              </h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 font-bold px-2 py-0.5">
                  <Briefcase className="w-3.5 h-3.5 mr-1.5" />
                  {currentUser?.funcao}
                </Badge>
                <span className="text-zinc-500 text-sm font-medium">Sense</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-zinc-100 tabular-nums tracking-tighter">
              {format(currentTime, 'HH:mm')}
            </p>
            <p className="text-sm font-medium text-zinc-400 capitalize">
              {format(currentTime, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </p>
          </div>
        </div>

        {/* QUICK METRICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4 hover:bg-zinc-800 transition-colors">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20 shadow-inner">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Demandas Ativas</p>
              <h3 className="text-2xl font-black text-zinc-100">{emAndamento.length}</h3>
            </div>
          </div>
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4 hover:bg-zinc-800 transition-colors">
            <div className="p-3 bg-red-500/10 rounded-xl text-red-400 border border-red-500/20 shadow-inner">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Atrasadas</p>
              <h3 className="text-2xl font-black text-zinc-100">{atrasadas.length}</h3>
            </div>
          </div>
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4 hover:bg-zinc-800 transition-colors">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20 shadow-inner">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Aprovações Pendentes</p>
              <h3 className="text-2xl font-black text-zinc-100">{aprovacoes.length}</h3>
            </div>
          </div>
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4 hover:bg-zinc-800 transition-colors">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20 shadow-inner">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Reuniões Hoje</p>
              <h3 className="text-2xl font-black text-zinc-100">{reunioesHoje.length}</h3>
            </div>
          </div>
        </div>

        {/* HUB DE PRODUTIVIDADE */}
        <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-zinc-800/50">
          <Button variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-full h-9">
            <Upload className="w-4 h-4 mr-2" /> Upload Rápido
          </Button>
          <Button variant="outline" className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20 text-indigo-300 hover:text-white hover:bg-indigo-500/20 rounded-full h-9">
            <Sparkles className="w-4 h-4 mr-2" /> Sense Copilot
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full p-1 pl-4">
            <span className="text-xs font-bold text-zinc-400 mr-2 uppercase tracking-widest"><Clock className="w-3 h-3 inline mr-1 -mt-0.5" /> Timer</span>
            <span className="text-sm font-black text-white tabular-nums tracking-wider mr-2">00:00:00</span>
            <Button size="icon" className="w-7 h-7 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white">
              <PlayCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2 md:px-0">
        
        {/* COLUNA ESQUERDA: PRIORIDADES & AGENDA */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Prioridades */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              <h2 className="text-lg font-bold text-white">Prioridades</h2>
            </div>
            <div className="space-y-3">
              {atrasadas.length > 0 ? (
                atrasadas.slice(0, 3).map(t => (
                  <div key={t.id} className="bg-rose-950/20 border border-rose-900/30 rounded-xl p-4 hover:bg-rose-950/30 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest text-rose-400 border-rose-500/30 bg-rose-500/10 px-2 py-0.5 rounded-full">
                        Atrasado
                      </Badge>
                      <span className="text-xs font-semibold text-rose-400/80">{t.prazo ? format(new Date(t.prazo), 'dd/MM') : ''}</span>
                    </div>
                    <p className="font-bold text-zinc-100 text-sm leading-snug group-hover:text-white">{t.titulo}</p>
                  </div>
                ))
              ) : (
                <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500/50 mb-2" />
                  <p className="text-sm font-semibold text-zinc-400">Nenhuma prioridade urgente.</p>
                </div>
              )}
            </div>
          </section>

          {/* Agenda */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-bold text-white">Minha Agenda</h2>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-4 space-y-4">
              {agendaTarefas.length > 0 ? (
                agendaTarefas.map((t, idx) => {
                  const cores = ['text-blue-400', 'text-emerald-400', 'text-purple-400', 'text-amber-400'];
                  const corClass = cores[idx % cores.length];
                  const dataPrazo = new Date(t.prazo!);
                  const isToday = dataPrazo.toDateString() === new Date().toDateString();
                  // Check if time is 00:00 (or if it just has a date)
                  const timeString = isToday ? format(dataPrazo, 'HH:mm') : format(dataPrazo, 'dd/MM');
                  const displayTime = (timeString === '00:00' || timeString === '21:00') ? 'Até ' + format(dataPrazo, 'dd/MM') : timeString;
                  
                  return (
                    <div key={t.id} className="relative pl-6 pb-4 border-l border-zinc-800 last:border-transparent last:pb-0">
                      <div className="absolute w-3 h-3 bg-zinc-800 rounded-full -left-[6.5px] top-1 border-2 border-zinc-950" />
                      <p className={`text-xs font-bold ${corClass} mb-0.5`}>{displayTime}</p>
                      <p className="text-sm font-bold text-zinc-200">{t.titulo}</p>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-4 text-zinc-500">
                  <CheckCircle2 className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">Nenhuma demanda agendada.</p>
                </div>
              )}
            </div>
          </section>

          {/* Timeline / Atividade Recente */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-zinc-400" />
              <h2 className="text-lg font-bold text-white">Timeline Recente</h2>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-4 space-y-4">
              {recentTimeline.length > 0 ? (
                recentTimeline.map((notif) => {
                  let Icon = MessageSquare;
                  let colorClass = "bg-blue-500/10 text-blue-400";
                  if (notif.tipo === 'sucesso') { Icon = CheckCircle2; colorClass = "bg-emerald-500/10 text-emerald-400"; }
                  if (notif.tipo === 'alerta') { Icon = AlertCircle; colorClass = "bg-amber-500/10 text-amber-400"; }
                  if (notif.tipo === 'erro') { Icon = AlertCircle; colorClass = "bg-rose-500/10 text-rose-400"; }
                  if (notif.mensagem.toLowerCase().includes('tarefa') || notif.mensagem.toLowerCase().includes('demanda')) { Icon = FileText; colorClass = "bg-zinc-800 text-zinc-400"; }

                  return (
                    <div key={notif.id} className="flex items-start gap-3">
                      <div className={`p-1.5 rounded-lg mt-0.5 ${colorClass}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-300">{notif.mensagem}</p>
                        <p className="text-[10px] text-zinc-500">{notif.data_criacao ? new Date(notif.data_criacao).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}) : 'Agora'}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-4 text-zinc-500">
                  <Clock className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">Nenhuma atividade recente.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
