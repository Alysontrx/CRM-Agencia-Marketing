import React from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { useApp } from '../../../context/AppContext';
import { DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

export function WidgetFinanceiro() {
  const { financeiro } = useApp();

  const receitaTotal = financeiro.filter(f => f.status === 'Pago').reduce((a, b) => a + b.valor, 0);
  const atrasados = financeiro.filter(f => f.status === 'Atrasado').reduce((a, b) => a + b.valor, 0);

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Gerar dados reais para os últimos 6 meses
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const hoje = new Date();
  
  const chartData = Array.from({length: 6}, (_, i) => {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - 5 + i, 1);
    return { name: meses[d.getMonth()], mes: d.getMonth(), ano: d.getFullYear(), receita: 0, despesa: 0 };
  });

  financeiro.forEach(f => {
    const d = new Date(f.vencimento);
    const m = chartData.find(x => x.mes === d.getMonth() && x.ano === d.getFullYear());
    if (m) {
      if (f.status === 'Pago') {
        if (f.valor >= 0) m.receita += f.valor;
        else m.despesa += Math.abs(f.valor);
      }
    }
  });

  // Gráfico agora utiliza os valores reais 100% do tempo

  return (
    <WidgetContainer id="financeiro" title="Resumo Financeiro" icon={<DollarSign className="w-5 h-5 text-emerald-500" />} fullWidth>
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Metricas */}
        <div className="w-full lg:w-1/3 flex flex-col justify-center gap-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-3xl">
            <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2">Receita Líquida (Mês)</p>
            <p className="text-3xl font-black text-white">{formatCurrency(receitaTotal)}</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-3xl">
            <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-2">Inadimplência</p>
            <p className="text-3xl font-black text-white">{formatCurrency(atrasados)}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="w-full lg:w-2/3 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
              <YAxis hide />
              <RechartsTooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="receita" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorReceita)" />
              <Area type="monotone" dataKey="despesa" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorDespesa)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>
    </WidgetContainer>
  );
}
