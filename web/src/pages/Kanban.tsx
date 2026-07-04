import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Clock, MessageSquare, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ModalNovaTarefa } from '../components/Modals';
import React, { useState } from 'react';
import type { TarefaData } from '../data/types';

export default function KanbanPage() {
  const { tarefas, users, clientes, updateTarefa, deleteTarefa } = useApp();
  const [modalNovaTarefa, setModalNovaTarefa] = useState(false);
  const [editTarefa, setEditTarefa] = useState<TarefaData | undefined>(undefined);
  
  const colunas = ['A fazer', 'Em andamento', 'Aguardando revisão', 'Aprovado', 'Atrasado'];

  const handleDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData('tarefaId', id.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, novaColuna: string) => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData('tarefaId'));
    if (!id) return;
    
    const tarefa = tarefas.find(t => t.id === id);
    if (!tarefa || tarefa.status === novaColuna) return;
    
    updateTarefa(id, { status: novaColuna as any });
  };

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

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory">
        <div className="flex gap-4 md:gap-6 min-h-full min-w-max items-start px-2 md:px-4">
          {colunas.map(col => {
            const columnTarefas = tarefas.filter(t => (t.status || 'A fazer').toLowerCase() === col.toLowerCase());
            return (
              <div 
                key={col} 
                className="w-[85vw] sm:w-[340px] snap-center bg-zinc-900/60 rounded-2xl border border-zinc-800/60 flex flex-col max-h-full shadow-xl"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col)}
              >
                <div className="p-4 border-b border-zinc-800/30 flex items-center justify-between bg-zinc-950/20 rounded-t-2xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full shadow-lg ${col === 'Atrasado' ? 'bg-red-500 shadow-red-500/50' : col === 'Aprovado' ? 'bg-emerald-500 shadow-emerald-500/50' : col === 'Aguardando revisão' ? 'bg-amber-500 shadow-amber-500/50' : col === 'Em andamento' ? 'bg-blue-500 shadow-blue-500/50' : 'bg-zinc-500 shadow-zinc-500/50'}`} />
                    <h3 className="font-bold text-zinc-100 text-sm tracking-wide">{col}</h3>
                  </div>
                  <Badge variant="secondary" className="bg-zinc-800/80 text-zinc-300 font-bold px-2 py-0.5 rounded-md border border-zinc-700/50 shadow-sm">{columnTarefas.length}</Badge>
                </div>
                <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                  {columnTarefas.map(tarefa => {
                    const resp = users.find(u => u.id === tarefa.responsavel_id);
                    const cli = clientes.find(c => c.id === tarefa.cliente_id);
                    const isUrgente = tarefa.prioridade === 'Urgente' || tarefa.prioridade === 'Alta';
                    return (
                      <Card 
                        key={tarefa.id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, tarefa.id)}
                        className="bg-zinc-900 border-zinc-800 cursor-grab active:cursor-grabbing hover:border-zinc-500/50 transition-all hover:shadow-lg hover:-translate-y-1 rounded-xl group relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <CardContent className="p-5 relative z-10">
                          <div className="flex justify-between items-start mb-3">
                            <Badge variant="outline" className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 shadow-sm ${isUrgente ? 'text-rose-400 border-rose-500/30 bg-rose-500/10' : 'text-blue-400 border-blue-500/30 bg-blue-500/10'}`}>
                              {tarefa.prioridade || 'Normal'}
                            </Badge>
                            
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={(e) => handleEdit(tarefa, e)} className="p-1.5 bg-zinc-800 text-zinc-400 hover:text-white rounded-md transition-colors shadow-lg">
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button onClick={(e) => handleDelete(tarefa.id, e)} className="p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-md transition-colors shadow-lg">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          
                          <p className="font-semibold text-zinc-100 text-sm mb-4 leading-relaxed group-hover:text-white transition-colors">{tarefa.titulo}</p>
                          <div className="text-[11px] text-zinc-300 mb-5 flex items-center gap-2.5 bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/80 w-fit">
                            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                              {cli?.nome?.[0]}
                            </div>
                            <span className="truncate max-w-[200px] font-semibold tracking-wide">{cli?.nome || 'Sem cliente'}</span>
                          </div>
                          <div className="flex justify-between items-center pt-4 border-t border-zinc-800/50">
                            <div className="flex items-center gap-2.5">
                              {resp && (
                                <Avatar className="h-7 w-7 border-2 border-zinc-800 shadow-md">
                                  <AvatarImage src={resp.avatar} />
                                  <AvatarFallback className="text-[10px] font-bold bg-zinc-800 text-zinc-200">{resp.nome[0]}</AvatarFallback>
                                </Avatar>
                              )}
                              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{tarefa.setor}</span>
                            </div>
                            {tarefa.comentarios && tarefa.comentarios.length > 0 && (
                              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 bg-zinc-800/60 px-2.5 py-1 rounded-full font-semibold border border-zinc-700/80">
                                <MessageSquare className="w-3.5 h-3.5" /> <span>{tarefa.comentarios.length}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                  {columnTarefas.length === 0 && (
                    <div className="h-28 flex items-center justify-center border-2 border-dashed border-zinc-800/30 rounded-xl text-zinc-600/80 text-xs font-semibold tracking-wide bg-zinc-950/10">
                      Vazio
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      <ModalNovaTarefa 
        isOpen={modalNovaTarefa} 
        onClose={() => { setModalNovaTarefa(false); setEditTarefa(undefined); }} 
        editData={editTarefa}
      />
    </motion.div>
  );
}
