import React from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { useApp } from '../../../context/AppContext';
import { Calendar, Clock, Video, CheckCircle } from 'lucide-react';

export function WidgetAgenda() {
  const { tarefas, projetos } = useApp();
  const hoje = new Date().toISOString().split('T')[0];

  const entregasHoje = tarefas.filter(t => t.prazo === hoje);
  
  // Em uma aplicação real teríamos uma tabela de reuniões. Por enquanto focamos nas entregas.
  const eventosAgenda = [
    ...entregasHoje.map(t => ({ id: `t-${t.id}`, time: '18:00', type: 'entrega', text: `Entrega: ${t.titulo}`, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' }))
  ].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <WidgetContainer id="agenda" title="Agenda do Dia" icon={<Calendar className="w-5 h-5 text-blue-500" />}>
      <div className="relative border-l border-zinc-800 ml-3 pl-5 space-y-6">
        {eventosAgenda.length > 0 ? (
          eventosAgenda.map((ev, idx) => (
            <div key={ev.id} className="relative group">
              <div className={`absolute -left-[29px] top-1 w-5 h-5 rounded-full border-4 border-zinc-900 ${ev.bg} ${ev.color} flex items-center justify-center shadow-lg transition-transform group-hover:scale-125`}>
                <div className={`w-1.5 h-1.5 rounded-full currentColor`} />
              </div>
              
              <div className="flex gap-4 items-start hover:bg-zinc-800/20 p-2 -ml-2 rounded-xl transition-colors cursor-pointer">
                <span className="text-sm font-bold text-zinc-400 mt-0.5 min-w-[45px]">{ev.time}</span>
                <div>
                  <p className="text-sm font-semibold text-zinc-200 group-hover:text-white">{ev.text}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <ev.icon className={`w-3 h-3 ${ev.color}`} />
                    <span className="text-xs text-zinc-500 capitalize">{ev.type}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-zinc-500 text-sm py-4">Sua agenda está livre hoje!</div>
        )}
      </div>
    </WidgetContainer>
  );
}
