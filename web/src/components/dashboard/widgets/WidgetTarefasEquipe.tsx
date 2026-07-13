import React, { useState } from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { useApp } from '../../../context/AppContext';
import { ListTodo, CheckCircle2, AlertCircle, Clock, ChevronDown, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

export function WidgetTarefasEquipe() {
  const { users, tarefas } = useApp();
  const [expandedUsers, setExpandedUsers] = useState<number[]>([]);

  const toggleUser = (id: number) => {
    if (expandedUsers.includes(id)) {
      setExpandedUsers(expandedUsers.filter(u => u !== id));
    } else {
      setExpandedUsers([...expandedUsers, id]);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Feito':
      case 'Aprovado':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Atrasado':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Em andamento':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Aguardando revisão':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <WidgetContainer id="tarefas_equipe" title="Tarefas da Equipe" icon={<ListTodo className="w-5 h-5 text-indigo-500" />} fullWidth>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {users.map(u => {
          const userTasks = tarefas.filter(t => t.responsavel_id === u.id);
          if (userTasks.length === 0) return null; // Não exibe usuários sem tarefas neste painel

          const isExpanded = expandedUsers.includes(u.id);

          return (
            <div key={u.id} className="bg-zinc-900/50 border border-zinc-800/60 rounded-2xl overflow-hidden transition-colors hover:border-zinc-700/60">
              {/* Header do Funcionário */}
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-800/30 transition-colors"
                onClick={() => toggleUser(u.id)}
              >
                <div className="flex items-center gap-4">
                  <Avatar className="w-10 h-10 border border-zinc-700/50 shadow-md">
                    <AvatarImage src={u.avatar} />
                    <AvatarFallback className="bg-zinc-800 text-zinc-400">{u.nome[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-zinc-100 text-sm">{u.nome}</h4>
                    <p className="text-[11px] text-zinc-500 font-medium">{u.funcao}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="bg-zinc-950 border-zinc-800 font-mono text-xs shadow-inner">
                    {userTasks.length} {userTasks.length === 1 ? 'tarefa' : 'tarefas'}
                  </Badge>
                  {isExpanded ? <ChevronDown className="w-5 h-5 text-zinc-500" /> : <ChevronRight className="w-5 h-5 text-zinc-500" />}
                </div>
              </div>

              {/* Lista de Tarefas Expandida */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: 'auto', opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-2 border-t border-zinc-800/50 space-y-2">
                      {userTasks.map(t => (
                        <div key={t.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-zinc-950/50 rounded-xl border border-zinc-800/50 hover:bg-zinc-900 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-zinc-200 truncate">{t.titulo}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider bg-zinc-900 px-1.5 py-0.5 rounded">{t.setor}</span>
                              <span className={`text-[10px] font-bold tracking-widest uppercase ${t.prioridade === 'Urgente' || t.prioridade === 'Alta' ? 'text-red-400' : 'text-blue-400'}`}>
                                {t.prioridade}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 sm:ml-auto">
                            <Badge variant="outline" className={`font-semibold whitespace-nowrap text-[11px] ${getStatusColor(t.status)}`}>
                              {t.status}
                            </Badge>
                            <div className="flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-900/80 px-2 py-1 rounded-md border border-zinc-800 whitespace-nowrap">
                              <Clock className="w-3.5 h-3.5 text-zinc-500" />
                              {t.prazo ? new Date(t.prazo).toLocaleDateString('pt-BR') : '-'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
        {users.every(u => tarefas.filter(t => t.responsavel_id === u.id).length === 0) && (
          <div className="text-center py-8 text-zinc-500 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
            Nenhuma tarefa cadastrada no momento.
          </div>
        )}
      </div>
    </WidgetContainer>
  );
}
