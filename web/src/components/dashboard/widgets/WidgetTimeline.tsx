import React from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { useApp } from '../../../context/AppContext';
import { Activity, MessageSquare, Plus, Check, DollarSign } from 'lucide-react';

export function WidgetTimeline() {
  const { historico, users } = useApp();

  const getIcon = (desc: string) => {
    if (desc.includes('Aprovou') || desc.includes('Concluiu')) return <Check className="w-3 h-3 text-emerald-500" />;
    if (desc.includes('Enviou proposta') || desc.includes('Pagamento')) return <DollarSign className="w-3 h-3 text-amber-500" />;
    if (desc.includes('Criou') || desc.includes('Novo')) return <Plus className="w-3 h-3 text-blue-500" />;
    return <MessageSquare className="w-3 h-3 text-zinc-500" />;
  };

  const getIconBg = (desc: string) => {
    if (desc.includes('Aprovou') || desc.includes('Concluiu')) return 'bg-emerald-500/20 border-emerald-500/30';
    if (desc.includes('Enviou proposta') || desc.includes('Pagamento')) return 'bg-amber-500/20 border-amber-500/30';
    if (desc.includes('Criou') || desc.includes('Novo')) return 'bg-blue-500/20 border-blue-500/30';
    return 'bg-zinc-800 border-zinc-700';
  };

  return (
    <WidgetContainer id="timeline" title="Atividade Recente" icon={<Activity className="w-5 h-5 text-rose-500" />}>
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-3.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
        
        {historico.slice(0, 4).map((h, idx) => {
          const user = users.find(u => u.nome === h.usuario);
          
          return (
            <div key={h.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              
              <div className="flex items-center justify-center w-7 h-7 rounded-full border shadow-lg shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 bg-zinc-900 absolute md:static left-0 md:left-auto">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${getIconBg(h.descricao)}`}>
                  {getIcon(h.descricao)}
                </div>
              </div>
              
              <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/50 transition-colors ml-10 md:ml-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-zinc-300">{h.usuario}</span>
                  <span className="text-[10px] font-semibold text-zinc-500">
                    {new Date(h.data_registro).toLocaleTimeString('pt-BR', { hour: '2-digit', minute:'2-digit' })}
                  </span>
                </div>
                <div className="text-xs text-zinc-400">
                  {h.descricao}
                </div>
              </div>

            </div>
          );
        })}
        {historico.length === 0 && (
           <div className="text-zinc-500 text-sm py-4 ml-10">Nenhuma atividade recente.</div>
        )}
      </div>
    </WidgetContainer>
  );
}
