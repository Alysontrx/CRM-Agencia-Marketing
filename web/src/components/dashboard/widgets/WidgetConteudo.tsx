import React from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { useApp } from '../../../context/AppContext';
import { Share2 } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';

export function WidgetConteudo() {
  const { conteudos } = useApp();

  let produzindo = conteudos.filter(c => c.status === 'Em produção').length;
  let aprovacao = conteudos.filter(c => c.status === 'Em aprovação').length;
  let agendados = conteudos.filter(c => c.status === 'Agendado').length;

  // Fator Estético removido: usa apenas dados reais

  const data = [
    { name: 'Produção', value: produzindo, color: '#3b82f6' },
    { name: 'Aprovação', value: aprovacao, color: '#f59e0b' },
    { name: 'Agendados', value: agendados, color: '#10b981' },
  ];

  return (
    <WidgetContainer id="conteudo" title="Hub de Conteúdo" icon={<Share2 className="w-5 h-5 text-indigo-500" />}>
      <div className="flex flex-col items-center">
        
        <div className="w-full h-40 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={50}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full space-y-2">
          {data.map(item => (
            <div key={item.name} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-zinc-400 font-medium">{item.name}</span>
              </div>
              <span className="text-white font-bold">{item.value}</span>
            </div>
          ))}
        </div>

      </div>
    </WidgetContainer>
  );
}
