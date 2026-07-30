import React from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { useApp } from '../../../context/AppContext';
import { FolderKanban, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function WidgetProjetos({ onAddProjeto }: { onAddProjeto?: () => void }) {
  const { projetos, clientes, users } = useApp();

  return (
    <WidgetContainer id="projetos" title="Projetos em Andamento" icon={<FolderKanban className="w-5 h-5 text-indigo-500" />} fullWidth>
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-sm text-left border-collapse min-w-[400px]">
          <thead>
            <tr className="border-b border-zinc-800/50 text-zinc-500">
              <th className="pb-3 font-medium uppercase tracking-wider text-xs">Projeto</th>
              <th className="pb-3 font-medium uppercase tracking-wider text-xs hidden sm:table-cell">Cliente</th>
              <th className="pb-3 font-medium uppercase tracking-wider text-xs hidden md:table-cell">Responsável</th>
              <th className="pb-3 font-medium uppercase tracking-wider text-xs">Progresso</th>
              <th className="pb-3 font-medium uppercase tracking-wider text-xs text-right">Prazo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/30">
            {projetos.slice(0, 5).map(p => {
              const cliente = clientes.find(c => c.id === p.cliente_id);
              const resp = users.find(u => u.id === p.responsavel_id);
              return (
                <tr key={p.id} className="group hover:bg-zinc-800/20 transition-colors">
                  <td className="py-4 pr-4">
                    <div className="font-semibold text-zinc-200 group-hover:text-white transition-colors">{p.nome}</div>
                    <div className="text-xs text-zinc-500 mt-1">{p.tipo}</div>
                  </td>
                  <td className="py-4 px-4 hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6 rounded-md">
                        <AvatarImage src={cliente?.logo} />
                        <AvatarFallback className="bg-zinc-800 text-[10px]">{cliente?.nome?.[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-zinc-400">{cliente?.nome}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={resp?.avatar} />
                        <AvatarFallback className="bg-zinc-800 text-[10px]">{resp?.nome?.[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-zinc-400">{resp?.nome}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-full max-w-[120px] h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full" 
                          style={{ width: `${p.progresso}%` }} 
                        />
                      </div>
                      <span className="text-xs font-bold text-zinc-400">{p.progresso}%</span>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <Badge variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-300 font-medium whitespace-nowrap">
                      <Clock className="w-3 h-3 mr-1.5 text-zinc-500" />
                      {p.prazo}
                    </Badge>
                  </td>
                </tr>
              )
            })}
            {projetos.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center">
                  <p className="text-zinc-500 mb-4">Nenhum projeto ativo.</p>
                  {onAddProjeto && (
                    <button 
                      onClick={onAddProjeto}
                      className="px-4 py-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 rounded-lg text-sm font-medium transition-colors border border-indigo-500/20"
                    >
                      + Criar Novo Projeto
                    </button>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </WidgetContainer>
  );
}
