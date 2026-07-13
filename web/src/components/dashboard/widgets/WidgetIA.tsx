import React, { useState, useEffect } from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { Sparkles, Zap, Clock, MessageSquareText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useApp } from '../../../context/AppContext';
import { generateDashboardInsight } from '../../../lib/ai';

export function WidgetIA({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { tarefas, clientes, leads, conteudos } = useApp();
  const [insight, setInsight] = useState('Analisando seus dados em tempo real...');
  const [isLoading, setIsLoading] = useState(true);

  // Calcula "Tokens Usados" e "Tempo Economizado" com base puramente nos dados reais do sistema
  const leadsQualificadosIA = leads.filter(l => l.nota_ia).length;
  const conteudosGerados = conteudos.length; 
  
  // Exemplo: 1500 tokens por lead qualificado, 3500 por conteúdo gerado
  const tokensRaw = (leadsQualificadosIA * 1500) + (conteudosGerados * 3500); 
  const tokensUsados = tokensRaw > 1000 ? (tokensRaw / 1000).toFixed(1) + 'k' : tokensRaw.toString();
  
  // Exemplo: 10 min economizados por lead, 30 min por conteúdo
  const minutosEconomizados = (leadsQualificadosIA * 10) + (conteudosGerados * 30); 
  const tempoEconomizado = minutosEconomizados > 0 ? `${Math.floor(minutosEconomizados / 60)}h ${minutosEconomizados % 60}m` : '0h 0m';

  useEffect(() => {
    let mounted = true;
    const fetchInsight = async () => {
      setIsLoading(true);
      const res = await generateDashboardInsight(tarefas, clientes, leads);
      if (mounted) {
        setInsight(res);
        setIsLoading(false);
      }
    };
    fetchInsight();
    return () => { mounted = false; };
  }, [tarefas.length, clientes.length, leads.length]); // Recalcula se o volume mudar bastante

  return (
    <WidgetContainer id="ia" title="Copilot IA" icon={<Sparkles className="w-5 h-5 text-blue-500" />} fullWidth>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        <div className="grid grid-cols-2 gap-3 col-span-1">
          <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-2xl">
            <Zap className="w-4 h-4 text-blue-500 mb-2" />
            <div className="text-xl font-black text-white">{tokensUsados}</div>
            <div className="text-[10px] uppercase font-bold text-blue-400/70 tracking-wider">Tokens Usados</div>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-2xl">
            <Clock className="w-4 h-4 text-purple-500 mb-2" />
            <div className="text-xl font-black text-white">{tempoEconomizado}</div>
            <div className="text-[10px] uppercase font-bold text-purple-400/70 tracking-wider">Tempo Economizado</div>
          </div>
        </div>

        <div className="md:col-span-2 flex-1 bg-zinc-950/50 border border-zinc-800/50 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquareText className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-bold text-zinc-300">Sugestão da IA</span>
            </div>
            <p className={`text-sm italic leading-snug ${isLoading ? 'text-zinc-500 animate-pulse' : 'text-zinc-400'}`}>
              "{insight}"
            </p>
          </div>
          <div className="mt-3 text-right">
            <Badge 
              onClick={() => onNavigate && onNavigate('copilot')} 
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-lg shadow-blue-600/20"
            >
              Abrir Copilot
            </Badge>
          </div>
        </div>
      </div>
    </WidgetContainer>
  );
}
