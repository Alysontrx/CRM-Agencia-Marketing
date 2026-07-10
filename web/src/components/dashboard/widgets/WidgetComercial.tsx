import React from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { useApp } from '../../../context/AppContext';
import { Target, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Cell } from 'recharts';

export function WidgetComercial() {
  const { leads } = useApp();

  let novos = leads.filter(l => l.status === 'Prospect').length;
  let emNegociacao = leads.filter(l => l.status === 'Reunião' || l.status === 'Proposta' || l.status === 'Negociação').length;
  let ganhos = leads.filter(l => l.status === 'Fechado').length;

  // Fator Estético removido: exibe os dados reais do banco

  const funnelData = [
    { name: 'Novos', value: novos },
    { name: 'Em Negociação', value: emNegociacao },
    { name: 'Fechados', value: ganhos },
  ];

  const colors = ['#3b82f6', '#f59e0b', '#10b981'];

  return (
    <WidgetContainer id="comercial" title="Comercial & Funil" icon={<Target className="w-5 h-5 text-emerald-500" />}>
      <div className="flex flex-col md:flex-row gap-6 items-center">
        
        {/* Metricas Rapidas */}
        <div className="flex-1 space-y-3 w-full">
          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl flex justify-between items-center">
            <span className="text-sm font-semibold text-blue-400">Leads Novos</span>
            <span className="text-xl font-black text-white">{novos}</span>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex justify-between items-center">
            <span className="text-sm font-semibold text-amber-400">Em Negociação</span>
            <span className="text-xl font-black text-white">{emNegociacao}</span>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex justify-between items-center">
            <span className="text-sm font-semibold text-emerald-400">Fechados</span>
            <span className="text-xl font-black text-white">{ganhos}</span>
          </div>
        </div>

        {/* Gráfico de Funil / Barras Horizontais */}
        <div className="flex-1 w-full h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funnelData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12, fontWeight: 600 }} width={100} />
              <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }} />
              <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24}>
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </WidgetContainer>
  );
}
