import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { MessageSquare, Edit2, Trash2, List, LayoutGrid, Calendar, CheckCircle2, Sparkles, Clock, TrendingUp, Zap, AlertCircle, X, Play, CheckSquare, PlayCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ModalNovaTarefa } from '../components/Modals';
import React, { useState } from 'react';
import type { TarefaData } from '../data/types';

interface VideoModalState {
  open: boolean;
  tarefaId: number | null;
  videoUrl: string | null;
}

export default function KanbanPage() {
  const { currentUser, tarefas, users, clientes, updateTarefa, deleteTarefa } = useApp();
  const isAdmin = currentUser?.funcao === 'Admin' || currentUser?.funcao === 'Administrador';
  const [modalNovaTarefa, setModalNovaTarefa] = useState(false);
  const [editTarefa, setEditTarefa] = useState<TarefaData | undefined>(undefined);
  const [videoModal, setVideoModal] = useState<VideoModalState>({ open: false, tarefaId: null, videoUrl: null });
  
  const colunas = ['A fazer', 'Em andamento', 'Aguardando revisão', 'Aprovado', 'Atrasado'];

  const handleEdit = (tarefa: TarefaData, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditTarefa(tarefa);
    setModalNovaTarefa(true);
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      deleteTarefa(id);
    }
  };

  // Stats Data
  const myTasks = tarefas.filter(t => t.responsavel_id === currentUser?.id);
  const tarefasExibidas = isAdmin ? tarefas : myTasks;
  
  const atrasadas = tarefasExibidas.filter(t => t.status === 'Atrasado').length;
  const emAndamento = tarefasExibidas.filter(t => t.status === 'Em andamento').length;
  const concluidas = tarefasExibidas.filter(t => t.status === 'Feito' || t.status === 'Aprovado').length;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col min-h-0 w-full max-w-[1600px] mx-auto">
      
      {/* HEADER E QUICK STATS */}
      <div className="mb-8 px-2 md:px-4">
        <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-4 mb-6">
            {/* Atalhos de IA */}
            <button className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-indigo-400 hover:from-indigo-500/20 hover:to-purple-500/20 hover:border-indigo-500/40 transition-all shadow-lg shadow-indigo-500/5">
              <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
              <span className="text-sm font-semibold">Criar Conteúdo IA</span>
            </button>
            <button className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-emerald-400 hover:from-emerald-500/20 hover:to-teal-500/20 hover:border-emerald-500/40 transition-all shadow-lg shadow-emerald-500/5">
              <Zap className="w-4 h-4 group-hover:text-emerald-300" />
              <span className="text-sm font-semibold">Gerador de Ideias</span>
            </button>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/60 rounded-2xl p-4 flex items-center gap-4 hover:bg-zinc-900/60 transition-colors">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20 shadow-inner">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-0.5">Em Andamento</p>
              <h3 className="text-2xl font-bold text-zinc-100">{emAndamento}</h3>
            </div>
          </div>
          <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/60 rounded-2xl p-4 flex items-center gap-4 hover:bg-zinc-900/60 transition-colors">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20 shadow-inner">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-0.5">Concluídas</p>
              <h3 className="text-2xl font-bold text-zinc-100">{concluidas}</h3>
            </div>
          </div>
          <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/60 rounded-2xl p-4 flex items-center gap-4 hover:bg-zinc-900/60 transition-colors">
            <div className="p-3 bg-red-500/10 rounded-xl text-red-400 border border-red-500/20 shadow-inner">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-0.5">Atrasadas</p>
              <h3 className="text-2xl font-bold text-zinc-100">{atrasadas}</h3>
            </div>
          </div>
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-md border border-indigo-500/20 rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400 border border-indigo-500/30 shadow-inner">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-0.5">Sua Performance</p>
              <h3 className="text-2xl font-bold text-white">Ótima</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 pb-10 flex flex-col gap-8">
        {(isAdmin ? users : [currentUser]).filter(Boolean).map(user => {
          const userTasks = tarefasExibidas.filter(t => t.responsavel_id === user?.id && t.setor !== 'Reunião');
          if (userTasks.length === 0) return null;

          return (
            <div key={user?.id} className="flex flex-col gap-4">
              <div className="flex items-center gap-3 px-2">
                <Avatar className="w-8 h-8 border border-zinc-700 shadow-md">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-zinc-800 text-zinc-300 font-bold text-xs">{user?.nome?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-bold text-zinc-100 leading-tight">{user?.nome}</h2>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">{user?.funcao}</p>
                </div>
                <Badge variant="secondary" className="ml-auto bg-zinc-800/80 border border-zinc-700/50 text-zinc-300">
                  {userTasks.length} {userTasks.length === 1 ? 'tarefa' : 'tarefas'}
                </Badge>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-x-auto mt-6 shadow-xl relative z-0">
                <table className="w-full min-w-[1000px] text-left text-sm whitespace-nowrap">
                  <thead className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider text-xs">
                    <tr>
                      <th className="px-6 py-4">Tarefa</th>
                      <th className="px-6 py-4">Cliente</th>
                      <th className="px-6 py-4">Prioridade</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Prazo</th>
                      <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {userTasks.map(tarefa => {
                      const cliente = clientes.find(c => c.id === tarefa.cliente_id);
                      const isUrgente = tarefa.prioridade === 'Urgente' || tarefa.prioridade === 'Alta';
                      
                      return (
                        <tr key={tarefa.id} className="hover:bg-zinc-800/40 transition-colors group">
                          <td className="px-6 py-4">
                            <p className="font-bold text-zinc-100 truncate max-w-[300px]">{tarefa.titulo}</p>
                            <p className="text-xs text-zinc-500 mt-0.5">{tarefa.setor}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                               <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-300">
                                 {cliente?.nome?.[0] || 'C'}
                               </div>
                               <span className="text-zinc-300 font-medium">{cliente?.empresa || cliente?.nome || 'Sem cliente'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shadow-sm ${isUrgente ? 'text-rose-400 border-rose-500/30 bg-rose-500/10' : 'text-blue-400 border-blue-500/30 bg-blue-500/10'}`}>
                              {tarefa.prioridade || 'Normal'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <select 
                              className="bg-zinc-950/80 border border-zinc-700/80 text-zinc-200 text-xs font-semibold rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner"
                              value={tarefa.status}
                              onChange={(e) => updateTarefa(tarefa.id, { status: e.target.value as any })}
                            >
                              {colunas.map(col => <option key={col} value={col}>{col}</option>)}
                              <option value="Feito">Feito</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800/80 w-fit text-zinc-300 shadow-inner">
                              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                              <span className="text-xs font-medium">{tarefa.prazo ? new Date(tarefa.prazo).toLocaleDateString('pt-BR') : '-'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={(e) => handleEdit(tarefa, e)} className="p-2 bg-zinc-800/80 text-zinc-400 hover:text-white rounded-lg transition-all hover:scale-105 hover:bg-zinc-700">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              {isAdmin && (
                                <button onClick={(e) => handleDelete(tarefa.id, e)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all hover:scale-105">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
        {tarefasExibidas.filter(t => t.setor !== 'Reunião').length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 bg-zinc-900/20 rounded-2xl border border-zinc-800/50">
            <CheckCircle2 className="w-12 h-12 text-zinc-700 mb-4" />
            <h3 className="text-lg font-bold text-zinc-400">Nenhuma tarefa encontrada</h3>
            <p className="text-sm text-zinc-500 mt-1">A equipe está sem tarefas pendentes.</p>
          </div>
        )}
      </div>

      <ModalNovaTarefa 
        isOpen={modalNovaTarefa} 
        onClose={() => { setModalNovaTarefa(false); setEditTarefa(undefined); }} 
        editData={editTarefa}
      />

      {/* NATIVE VIDEO PLAYER MODAL */}
      {videoModal.open && videoModal.videoUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md px-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 md:p-8 max-w-4xl w-full shadow-2xl relative flex flex-col animate-in fade-in zoom-in duration-200">
            <button onClick={() => setVideoModal({open: false, tarefaId: null, videoUrl: null})} className="absolute top-4 right-4 text-zinc-500 hover:text-white bg-zinc-900 rounded-full p-2">
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <PlayCircle className="w-6 h-6 text-indigo-500" /> Revisão de Vídeo
            </h3>

            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden border border-zinc-800 shadow-inner mb-6">
              <video 
                src={videoModal.videoUrl} 
                controls 
                autoPlay 
                className="w-full h-full object-contain"
              >
                Seu navegador não suporta a tag de vídeo.
              </video>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => {
                  updateTarefa(videoModal.tarefaId!, { status: 'Atrasado', link_entrega: undefined }); // 'Atrasado' is functioning as 'Correções'
                  setVideoModal({open: false, tarefaId: null, videoUrl: null});
                }} 
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/30 transition-all"
              >
                <AlertCircle className="w-5 h-5" /> Reprovar e Excluir
              </button>
              
              <button 
                onClick={() => {
                  updateTarefa(videoModal.tarefaId!, { status: 'Aprovado' });
                  setVideoModal({open: false, tarefaId: null, videoUrl: null});
                }} 
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-all"
              >
                <CheckCircle2 className="w-5 h-5" /> Aprovar Vídeo
              </button>
            </div>
          </div>
        </div>
      )}

    </motion.div>
  );
}

