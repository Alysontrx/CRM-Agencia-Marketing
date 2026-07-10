import React from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { useApp } from '../../../context/AppContext';
import { Users, CheckCircle2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function WidgetEquipe() {
  const { users, tarefas } = useApp();

  return (
    <WidgetContainer id="equipe" title="Equipe & Capacidade" icon={<Users className="w-5 h-5 text-fuchsia-500" />}>
      <div className="space-y-4">
        {users.map(u => {
          const abertas = tarefas.filter(t => t.responsavel_id === u.id && t.status !== 'Feito' && t.status !== 'Aprovado' && t.status !== 'Fechado').length;
          const concluidas = tarefas.filter(t => t.responsavel_id === u.id && (t.status === 'Feito' || t.status === 'Aprovado' || t.status === 'Fechado')).length;
          const total = abertas + concluidas;
          const progresso = total > 0 ? Math.round((concluidas / total) * 100) : 0;
          
          return (
            <div key={u.id} className="p-3 rounded-2xl bg-zinc-900/50 hover:bg-zinc-800/50 border border-zinc-800/50 transition-colors space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10 border border-zinc-700/50 shadow-md">
                      <AvatarImage src={u.avatar} />
                      <AvatarFallback className="bg-zinc-800 text-zinc-400">{u.nome[0]}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-zinc-900 ${abertas > 5 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-200 text-sm">{u.nome}</h4>
                    <p className="text-[11px] text-zinc-500 font-medium">{u.funcao}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider mb-0.5">Pendentes</div>
                    <Badge variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-300 font-mono">{abertas}</Badge>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider mb-0.5">Entregues</div>
                    <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-mono">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      {concluidas}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Barra de Progresso */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold tracking-wider">
                  <span className="text-zinc-500 uppercase">Progresso Geral</span>
                  <span className="text-indigo-400">{progresso}%</span>
                </div>
                <div className="w-full bg-zinc-800/80 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-indigo-600 to-indigo-400 h-1.5 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${progresso}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </WidgetContainer>
  );
}
