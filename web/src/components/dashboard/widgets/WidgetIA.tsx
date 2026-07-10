import React from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { Sparkles, Zap, Clock, MessageSquareText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function WidgetIA() {
  return (
    <WidgetContainer id="ia" title="Copilot IA" icon={<Sparkles className="w-5 h-5 text-blue-500" />}>
      <div className="flex flex-col h-full gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-2xl">
            <Zap className="w-4 h-4 text-blue-500 mb-2" />
            <div className="text-xl font-black text-white">45k</div>
            <div className="text-[10px] uppercase font-bold text-blue-400/70 tracking-wider">Tokens Usados</div>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-2xl">
            <Clock className="w-4 h-4 text-purple-500 mb-2" />
            <div className="text-xl font-black text-white">12h</div>
            <div className="text-[10px] uppercase font-bold text-purple-400/70 tracking-wider">Tempo Economizado</div>
          </div>
        </div>

        <div className="flex-1 bg-zinc-950/50 border border-zinc-800/50 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquareText className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-bold text-zinc-300">Sugestão da IA</span>
            </div>
            <p className="text-sm text-zinc-400 italic leading-snug">
              "Notei que o cliente <strong className="text-zinc-200">Clínica Vida</strong> está com aprovação pendente há 3 dias. Sugiro enviar um lembrete no WhatsApp."
            </p>
          </div>
          <div className="mt-3 text-right">
            <Badge className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-lg shadow-blue-600/20">
              Gerar Mensagem
            </Badge>
          </div>
        </div>
      </div>
    </WidgetContainer>
  );
}
