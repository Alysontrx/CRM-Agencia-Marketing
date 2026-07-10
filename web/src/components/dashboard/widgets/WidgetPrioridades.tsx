import React from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { useApp } from '../../../context/AppContext';
import { AlertCircle, Clock, CheckCircle2, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function WidgetPrioridades() {
  const { tarefas, correcoes, financeiro } = useApp();

  const atrasadas = tarefas.filter(t => t.status === 'Atrasado' || t.prioridade === 'Urgente').slice(0, 2);
  const aprovacoes = tarefas.filter(t => t.status === 'Aguardando revisão').slice(0, 2);
  const pagamentosVencidos = financeiro.filter(f => f.status === 'Atrasado').slice(0, 2);
  const correcoesAbertas = correcoes.filter(c => c.status === 'Pendente').slice(0, 2);

  const prioridades = [
    ...atrasadas.map(t => ({ id: `t-${t.id}`, type: 'atraso', text: `Projeto atrasado: ${t.titulo}`, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' })),
    ...aprovacoes.map(t => ({ id: `a-${t.id}`, type: 'aprovacao', text: `Aprovação pendente: ${t.titulo}`, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' })),
    ...pagamentosVencidos.map(f => ({ id: `f-${f.id}`, type: 'financeiro', text: `Pagamento vencido: ${f.descricao}`, icon: DollarSign, color: 'text-red-500', bg: 'bg-red-500/10' })),
    ...correcoesAbertas.map(c => ({ id: `c-${c.id}`, type: 'correcao', text: `Correção aberta: Tarefa #${c.tarefa_id}`, icon: CheckCircle2, color: 'text-amber-500', bg: 'bg-amber-500/10' })),
  ];

  return (
    <WidgetContainer id="prioridades" title="Minha Prioridade" icon={<AlertCircle className="w-5 h-5 text-red-500" />}>
      <div className="space-y-3">
        {prioridades.length === 0 ? (
          <div className="text-center py-6 text-zinc-500 text-sm font-medium">
            Tudo limpo! Nenhuma prioridade crítica no momento.
          </div>
        ) : (
          prioridades.slice(0, 5).map(p => (
            <div key={p.id} className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-950/30 border border-zinc-800/50 hover:bg-zinc-950/80 transition-colors group">
              <div className={`p-2 rounded-xl flex-shrink-0 shadow-inner ${p.bg} ${p.color}`}>
                <p.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 mt-1">
                <p className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors line-clamp-2 leading-snug">
                  {p.text}
                </p>
              </div>
              <div className="mt-1">
                <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border-transparent ${p.bg} ${p.color}`}>
                  AÇÃO
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </WidgetContainer>
  );
}
