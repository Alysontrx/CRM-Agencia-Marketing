import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Clapperboard, Clock, AlertCircle, Calendar, MessageSquare, 
  Play, Pause, Square, UploadCloud, FolderDot, Sparkles, CheckSquare, ListVideo, PenTool, LayoutGrid
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import VideoKanban from '../components/video-maker/VideoKanban';
import VideoStorage from '../components/video-maker/VideoStorage';

export default function VideoMakerDashboard() {
  const { currentUser, tarefas } = useApp();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'kanban' | 'arquivos' | 'copilot' | 'performance'>('kanban');

  // Timer state fake
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning) {
      interval = setInterval(() => setTimerSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const minhasTarefas = tarefas.filter(t => t.responsavel_id === currentUser?.id);
  const emAndamento = minhasTarefas.filter(t => t.status === 'Em andamento');
  const aprovacoes = minhasTarefas.filter(t => t.status === 'Aguardando revisão');
  const atrasadas = minhasTarefas.filter(t => t.status === 'Atrasado');

  const greeting = currentTime.getHours() < 12 ? 'Bom dia' : currentTime.getHours() < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col min-h-0 w-full max-w-[1800px] mx-auto space-y-6">
      
      {/* 1. CABEÇALHO DO ESTÚDIO */}
      <div className="flex-shrink-0 bg-[#0f0f11] border border-zinc-800/80 rounded-3xl p-6 md:p-8 relative overflow-hidden backdrop-blur-3xl shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-rose-500/5 pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          
          <div className="flex items-center gap-5">
            <Avatar className="h-16 w-16 md:h-20 md:w-20 border-4 border-[#18181b] shadow-2xl ring-2 ring-indigo-500/30">
              <AvatarImage src={currentUser?.avatar} />
              <AvatarFallback className="text-xl font-bold bg-zinc-800 text-zinc-200">{currentUser?.nome[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                {greeting}, {currentUser?.nome.split(' ')[0]} <span className="animate-wave origin-bottom-right inline-block">👋</span>
              </h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold px-2 py-0.5">
                  <Clapperboard className="w-3.5 h-3.5 mr-1.5" />
                  {currentUser?.funcao}
                </Badge>
                <span className="text-zinc-500 text-sm font-medium">Sense</span>
              </div>
            </div>
          </div>

          {/* MENSAGEM DINÂMICA / RESUMO */}
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-4 flex gap-6">
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Vídeos para Editar</p>
              <p className="text-xl font-black text-zinc-200 flex items-center gap-2">
                <Clapperboard className="w-4 h-4 text-blue-400" /> {emAndamento.length}
              </p>
            </div>
            <div className="w-px bg-zinc-800/50" />
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Aguardando Aprovação</p>
              <p className="text-xl font-black text-zinc-200 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" /> {aprovacoes.length}
              </p>
            </div>
            <div className="w-px bg-zinc-800/50" />
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Devolvido p/ Correção</p>
              <p className="text-xl font-black text-zinc-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500" /> {atrasadas.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* NAVEGAÇÃO INTERNA & TIMER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 px-2 md:px-0">
        
        {/* TABS */}
        <div className="flex items-center gap-2 bg-[#18181b] p-1.5 rounded-2xl border border-zinc-800/60 shadow-lg overflow-x-auto w-full lg:w-auto custom-scrollbar">
          <button onClick={() => setActiveTab('kanban')} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'kanban' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}>
            <ListVideo className="w-4 h-4" /> Projetos
          </button>
          <button onClick={() => setActiveTab('arquivos')} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'arquivos' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}>
            <FolderDot className="w-4 h-4" /> Central de Arquivos
          </button>
          <button onClick={() => setActiveTab('copilot')} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'copilot' ? 'bg-indigo-500/20 text-indigo-300 shadow-md border border-indigo-500/30' : 'text-indigo-500/50 hover:text-indigo-400 hover:bg-indigo-500/10'}`}>
            <Sparkles className="w-4 h-4" /> Sense Copilot
          </button>
        </div>

        {/* TIMER PROFISSIONAL */}
        <div className="flex items-center gap-4 bg-[#0f0f11] border border-zinc-800/80 rounded-2xl p-2 pl-5 shadow-2xl backdrop-blur-xl relative overflow-hidden w-full lg:w-auto">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-emerald-600" />
          
          <div className="flex-1 lg:flex-none">
            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Sessão Atual</p>
            <p className="text-xl font-black text-white tabular-nums tracking-wider leading-none">
              {formatTimer(timerSeconds)}
            </p>
          </div>
          
          <div className="w-px h-8 bg-zinc-800 mx-1 hidden lg:block" />
          
          <div className="flex items-center gap-1.5 pr-1">
            {!isTimerRunning ? (
              <Button onClick={() => setIsTimerRunning(true)} size="icon" className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 transition-all">
                <Play className="w-4 h-4 ml-0.5" />
              </Button>
            ) : (
              <Button onClick={() => setIsTimerRunning(false)} size="icon" className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-white border border-amber-500/30 transition-all">
                <Pause className="w-4 h-4" />
              </Button>
            )}
            <Button onClick={() => {setIsTimerRunning(false); setTimerSeconds(0);}} size="icon" variant="ghost" className="w-10 h-10 rounded-xl text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
              <Square className="w-4 h-4" />
            </Button>
          </div>
        </div>

      </div>

      {/* ÁREA DE CONTEÚDO */}
      <div className="flex-1 min-h-0 relative">
        <AnimatePresence mode="wait">
          
          {activeTab === 'kanban' && (
            <motion.div key="kanban" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full flex flex-col">
               <VideoKanban />
            </motion.div>
          )}

          {activeTab === 'arquivos' && (
            <motion.div key="arquivos" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="h-full flex flex-col">
               <VideoStorage />
            </motion.div>
          )}

          {activeTab === 'copilot' && (
            <motion.div key="copilot" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="h-full flex flex-col">
               <div className="flex-1 flex items-center justify-center border-2 border-dashed border-indigo-500/20 bg-indigo-500/5 rounded-3xl">
                 <p className="text-indigo-400 font-bold flex items-center gap-2"><Sparkles className="w-5 h-5" /> Módulo IA Sense Copilot (Em Construção)</p>
               </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  );
}
