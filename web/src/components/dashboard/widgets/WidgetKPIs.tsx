import React from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { useApp } from '../../../context/AppContext';
import { Users, Target, PlayCircle, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

export function WidgetKPIs() {
  const { clientes, leads, tarefas, financeiro } = useApp();

  const activeClientsList = clientes.filter(c => c.status_geral !== 'pausado' && c.status_geral !== 'Cancelado' && c.status_geral !== 'Encerrado');
  const clientesAtivos = activeClientsList.length;
  const leadsNovos = leads.filter(l => l.status === 'Prospect').length;
  const demandasHoje = tarefas.filter(t => t.prazo === new Date().toISOString().split('T')[0]).length;
  
  // Receita Mensal baseada no MRR (Monthly Recurring Revenue) dos clientes ativos
  const receita = activeClientsList.reduce((acc, curr) => acc + (Number(curr.mrr) || 0), 0);

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const getDaysAgo = (days: number) => {
    const d = new Date();
    d.setHours(0,0,0,0);
    d.setDate(d.getDate() - days);
    return d;
  };

  const calculateTrend = (items: any[], dateField: string, valueField?: string) => {
    const today = new Date().getTime();
    const weekAgo = getDaysAgo(7).getTime();
    const twoWeeksAgo = getDaysAgo(14).getTime();

    let currentSum = 0;
    let prevSum = 0;

    items.forEach(item => {
      const itemDate = new Date(item[dateField] || 0).getTime();
      if (itemDate >= weekAgo && itemDate <= today) {
        currentSum += valueField ? (item[valueField] || 0) : 1;
      } else if (itemDate >= twoWeeksAgo && itemDate < weekAgo) {
        prevSum += valueField ? (item[valueField] || 0) : 1;
      }
    });

    if (prevSum === 0) return { trend: currentSum > 0 ? '+100%' : '0%', isPositive: currentSum >= 0 };
    const pct = ((currentSum - prevSum) / prevSum) * 100;
    return { trend: `${pct > 0 ? '+' : ''}${pct.toFixed(0)}%`, isPositive: pct >= 0 };
  };

  const getSparklineData = (items: any[], dateField: string, valueField?: string) => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = getDaysAgo(6 - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const dayItems = items.filter(item => (item[dateField] || '').startsWith(dateStr));
      const baseValue = valueField ? dayItems.reduce((acc, curr) => acc + (curr[valueField] || 0), 0) : dayItems.length;
      return { value: baseValue }; 
    });
  };

  const clienteTrend = calculateTrend(clientes, 'data_inicio');
  const leadTrend = calculateTrend(leads, 'data_criacao');
  const tarefaTrend = calculateTrend(tarefas, 'data_criacao');
  const receitaTrend = calculateTrend(activeClientsList, 'data_inicio', 'mrr');

  const kpis = [
    {
      title: 'Clientes Ativos',
      value: clientesAtivos,
      icon: Users,
      trend: clienteTrend.trend,
      isPositive: clienteTrend.isPositive,
      color: '#3b82f6', // blue-500
      data: getSparklineData(clientes, 'data_inicio')
    },
    {
      title: 'Leads Novos',
      value: leadsNovos,
      icon: Target,
      trend: leadTrend.trend,
      isPositive: leadTrend.isPositive,
      color: '#10b981', // emerald-500
      data: getSparklineData(leads, 'data_criacao')
    },
    {
      title: 'Demandas Hoje',
      value: demandasHoje,
      icon: PlayCircle,
      trend: tarefaTrend.trend,
      isPositive: tarefaTrend.isPositive,
      color: '#f59e0b', // amber-500
      data: getSparklineData(tarefas, 'data_criacao')
    },
    {
      title: 'Receita Mensal',
      value: formatCurrency(receita),
      icon: DollarSign,
      trend: receitaTrend.trend,
      isPositive: receitaTrend.isPositive,
      color: '#8b5cf6', // violet-500
      data: getSparklineData(activeClientsList, 'data_inicio', 'mrr')
    }
  ];

  return (
    <WidgetContainer id="kpis" fullWidth noPadding>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-zinc-800/50">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="p-6 relative group cursor-pointer hover:bg-zinc-800/20 transition-colors">
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 text-zinc-400">
                <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
                <span className="font-semibold text-sm">{kpi.title}</span>
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-zinc-900/50 border border-zinc-800 ${kpi.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {kpi.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {kpi.trend}
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div className="text-4xl font-black text-white tracking-tight">{kpi.value}</div>
              
              {/* Sparkline */}
              <div className="w-24 h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={kpi.data}>
                    <defs>
                      <linearGradient id={`color-${idx}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={kpi.color} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={kpi.color} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <YAxis hide domain={[0, 'dataMax + 5']} />
                    <Area type="monotone" dataKey="value" stroke={kpi.color} strokeWidth={2} fillOpacity={1} fill={`url(#color-${idx})`} isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </WidgetContainer>
  );
}
