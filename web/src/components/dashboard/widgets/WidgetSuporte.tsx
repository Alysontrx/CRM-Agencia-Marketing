import React from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { LifeBuoy, ExternalLink, MessageSquare, Phone } from 'lucide-react';

export function WidgetSuporte() {
  return (
    <WidgetContainer id="suporte" title="Suporte Técnico" icon={<LifeBuoy className="w-5 h-5 text-rose-400" />}>
      <div className="flex flex-col h-full gap-4">
        <div className="bg-gradient-to-br from-rose-500/10 to-orange-500/10 border border-rose-500/20 p-5 rounded-3xl flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Precisa de Ajuda?</h3>
            <p className="text-sm text-zinc-400 mb-4">
              Nossa equipe está disponível para tirar dúvidas, relatar bugs ou auxiliar na configuração da plataforma.
            </p>
            
            <div className="space-y-3">
              <a href="/suporte" className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 hover:bg-zinc-800 transition-colors border border-zinc-800/50 group">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-zinc-200 group-hover:text-white">Abrir Chamado</div>
                  <div className="text-[10px] text-zinc-500">Resposta em até 2h úteis</div>
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-rose-400 transition-colors" />
              </a>

              <a href="https://wa.me/5511999999999" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 hover:bg-zinc-800 transition-colors border border-zinc-800/50 group">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-zinc-200 group-hover:text-white">WhatsApp de Emergência</div>
                  <div className="text-[10px] text-zinc-500">Apenas bugs críticos</div>
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </WidgetContainer>
  );
}
