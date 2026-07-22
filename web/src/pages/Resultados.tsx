import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { TrendingUp, Users, Eye, Target, Edit2, Trash2, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ModalNovaMetrica } from '../components/Modals';
import type { MetricaData } from '../data/types';
import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, RefreshCw } from 'lucide-react';

export default function ResultadosPage() {
  const { clientes, metricas, deleteMetrica, currentUser, addMetrica } = useApp();
  const isAdmin = currentUser?.funcao === 'Admin' || currentUser?.funcao === 'Secretária';
  const [modalNovaMetrica, setModalNovaMetrica] = useState(false);
  const [editMetrica, setEditMetrica] = useState<MetricaData | undefined>(undefined);
  const [syncLoading, setSyncLoading] = useState<number | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<number, number>>({});

  useEffect(() => {
    const saved = localStorage.getItem('syncCooldowns');
    if (saved) {
      try { setCooldowns(JSON.parse(saved)); } catch (e) {}
    }
    const interval = setInterval(() => {
      setCooldowns(prev => {
        const now = Date.now();
        const next = { ...prev };
        let changed = false;
        Object.keys(next).forEach(k => {
          if (now > next[Number(k)]) {
            delete next[Number(k)];
            changed = true;
          }
        });
        if (changed) localStorage.setItem('syncCooldowns', JSON.stringify(next));
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSync = async (clienteId: number, url: string) => {
    if (cooldowns[clienteId] && Date.now() < cooldowns[clienteId]) return;

    setSyncLoading(clienteId);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/scrape-instagram`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      
      if (data.success) {
        addMetrica({
          cliente_id: clienteId,
          data_registro: new Date().toISOString(),
          seguidores: data.data.followers,
          alcance: 10000, 
          engajamento: parseFloat(data.data.engagement),
          leads: data.data.posts,
          tipo: 'mensal',
          cliques_site: 0
        });
        alert(`Sincronizado com sucesso! ${data.data.followers} seguidores.`);
        
        // Aplica cooldown de 3 minutos
        const newCooldowns = { ...cooldowns, [clienteId]: Date.now() + 3 * 60 * 1000 };
        setCooldowns(newCooldowns);
        localStorage.setItem('syncCooldowns', JSON.stringify(newCooldowns));
      } else {
        alert('Erro ao sincronizar: ' + (data.error || 'Falha desconhecida.'));
      }
    } catch (err) {
      alert('Erro de conexão ao servidor de scraping.');
    } finally {
      setSyncLoading(null);
    }
  };

  const handleEdit = (m: MetricaData) => {
    setEditMetrica(m);
    setModalNovaMetrica(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta métrica?')) {
      deleteMetrica(id);
    }
  };

  const metricsByClient = useMemo(() => {
    const grouped: Record<number, MetricaData[]> = {};
    metricas.forEach(m => {
      if (!grouped[m.cliente_id]) grouped[m.cliente_id] = [];
      grouped[m.cliente_id].push(m);
    });
    
    // Ordena do mais antigo pro mais novo (Antes -> Depois)
    Object.values(grouped).forEach(list => {
      list.sort((a, b) => new Date(a.data_registro).getTime() - new Date(b.data_registro).getTime());
    });
    return grouped;
  }, [metricas]);

  const latestMetrics = useMemo(() => {
    return Object.values(metricsByClient).map(list => list[list.length - 1]);
  }, [metricsByClient]);

  const calculateGrowth = (before: number, after: number) => {
    if (before === 0) return after > 0 ? 100 : 0;
    return Math.round(((after - before) / before) * 100);
  };

  const renderGrowthBadge = (growth: number) => {
    if (growth > 0) return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] py-0"><ArrowUpRight className="w-3 h-3 mr-0.5" />{growth}%</Badge>;
    if (growth < 0) return <Badge variant="outline" className="bg-rose-500/10 text-rose-400 border-rose-500/20 text-[10px] py-0"><ArrowDownRight className="w-3 h-3 mr-0.5" />{Math.abs(growth)}%</Badge>;
    return <Badge variant="outline" className="bg-zinc-500/10 text-zinc-400 border-zinc-500/20 text-[10px] py-0"><Minus className="w-3 h-3 mr-0.5" />0%</Badge>;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      
      {/* Resumo Global */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {[
          { label: 'Total de Avaliações', value: metricas.length, icon: Target, color: 'text-blue-500' },
          { label: 'Clientes Atendidos', value: Object.keys(metricsByClient).length, icon: TrendingUp, color: 'text-emerald-500' },
          { label: 'Alcance Global', value: latestMetrics.reduce((acc, m) => acc + m.alcance, 0).toLocaleString('pt-BR'), icon: Eye, color: 'text-purple-500' },
          { label: 'Leads Gerados (Total)', value: latestMetrics.reduce((acc, m) => acc + m.leads, 0), icon: Users, color: 'text-amber-500' },
          { label: 'Cliques no Site', value: latestMetrics.reduce((acc, m) => acc + (m.cliques_site || 0), 0), icon: ArrowUpRight, color: 'text-pink-500' }
        ].map(s => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="bg-zinc-900 border-zinc-800 shadow-xl rounded-2xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-5 flex items-center justify-between relative z-10">
                <div>
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">{s.label}</p>
                  <p className="text-2xl font-black text-zinc-100">{s.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-zinc-950/50 border border-zinc-800 ${s.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-emerald-400" />
          Evolução dos Clientes (Antes × Depois)
        </h2>
        {isAdmin && (
          <button onClick={() => { setEditMetrica(undefined); setModalNovaMetrica(true); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all text-sm flex items-center gap-2">
            + Nova Métrica
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {Object.entries(metricsByClient).map(([clienteId, mList]) => {
          const cliente = clientes.find(c => c.id.toString() === clienteId);
          const antes = mList[0];
          const depois = mList[mList.length - 1];
          const hasEvolution = mList.length > 1;

          const chartData = mList.map(m => ({
            name: new Date(m.data_registro).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
            seguidores: m.seguidores,
            alcance: m.alcance,
            leads: m.leads,
            cliques_site: m.cliques_site || 0
          }));

          return (
            <Card key={clienteId} className="bg-zinc-900/80 border-zinc-800 rounded-3xl shadow-xl overflow-hidden">
              <CardHeader className="pb-4 pt-6 px-6 border-b border-zinc-800/50 flex flex-row items-center justify-between bg-zinc-950/20">
                <div>
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-xl font-black text-white">{cliente?.nome || 'Cliente Desconhecido'}</CardTitle>
                    {cliente?.instagram_url && (
                      <a href={cliente.instagram_url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline">
                        Ver Insta
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-zinc-400 font-medium">{cliente?.servico}</p>
                </div>
                <div className="flex items-center gap-3">
                  {isAdmin && cliente?.instagram_url && (
                    <button 
                      onClick={() => handleSync(Number(clienteId), cliente.instagram_url!)}
                      disabled={syncLoading === Number(clienteId) || !!cooldowns[Number(clienteId)]}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 transition-all"
                    >
                      {syncLoading === Number(clienteId) ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <RefreshCw className="w-3.5 h-3.5" />
                      )}
                      {cooldowns[Number(clienteId)] 
                        ? `Aguarde ${Math.ceil((cooldowns[Number(clienteId)] - Date.now()) / 1000)}s` 
                        : 'Auto Sincronizar'}
                    </button>
                  )}
                  {hasEvolution && (
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 font-bold px-3 py-1">
                      Comparativo Histórico
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Tabela Comparativa */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-widest border-b border-zinc-800 pb-2">Evolução em Números</h4>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 overflow-x-auto">
                      <table className="w-full text-sm min-w-[500px]">
                        <thead>
                          <tr className="text-zinc-500 text-left">
                            <th className="pb-3 font-medium">Métrica</th>
                            <th className="pb-3 font-medium text-zinc-400">Antes <span className="text-[10px] font-normal block">{new Date(antes.data_registro).toLocaleDateString('pt-BR')}</span></th>
                            <th className="pb-3 font-medium text-white">Depois <span className="text-[10px] font-normal block">{new Date(depois.data_registro).toLocaleDateString('pt-BR')}</span></th>
                            <th className="pb-3 font-medium text-right">Crescimento</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                          <tr>
                            <td className="py-3 text-zinc-300">Seguidores</td>
                            <td className="py-3 text-zinc-400">{antes.seguidores}</td>
                            <td className="py-3 font-bold text-white">{depois.seguidores}</td>
                            <td className="py-3 text-right">{renderGrowthBadge(calculateGrowth(antes.seguidores, depois.seguidores))}</td>
                          </tr>
                          <tr>
                            <td className="py-3 text-zinc-300">Alcance</td>
                            <td className="py-3 text-zinc-400">{antes.alcance.toLocaleString('pt-BR')}</td>
                            <td className="py-3 font-bold text-white">{depois.alcance.toLocaleString('pt-BR')}</td>
                            <td className="py-3 text-right">{renderGrowthBadge(calculateGrowth(antes.alcance, depois.alcance))}</td>
                          </tr>
                          <tr>
                            <td className="py-3 text-zinc-300">Engajamento</td>
                            <td className="py-3 text-zinc-400">{antes.engajamento}%</td>
                            <td className="py-3 font-bold text-white">{depois.engajamento}%</td>
                            <td className="py-3 text-right">{renderGrowthBadge(calculateGrowth(antes.engajamento, depois.engajamento))}</td>
                          </tr>
                          <tr>
                            <td className="py-3 text-zinc-300">Leads Gerados</td>
                            <td className="py-3 text-zinc-400">{antes.leads}</td>
                            <td className="py-3 font-bold text-white">{depois.leads}</td>
                            <td className="py-3 text-right">{renderGrowthBadge(calculateGrowth(antes.leads, depois.leads))}</td>
                          </tr>
                          <tr>
                            <td className="py-3 text-zinc-300">Cliques no Site</td>
                            <td className="py-3 text-zinc-400">{antes.cliques_site || 0}</td>
                            <td className="py-3 font-bold text-white">{depois.cliques_site || 0}</td>
                            <td className="py-3 text-right">{renderGrowthBadge(calculateGrowth(antes.cliques_site || 0, depois.cliques_site || 0))}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Gráfico de Evolução */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-widest border-b border-zinc-800 pb-2">Linha do Tempo (Seguidores)</h4>
                    <div className="h-[200px] w-full bg-zinc-950/30 rounded-xl border border-zinc-800/50 p-4">
                      {hasEvolution ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickMargin={10} axisLine={false} tickLine={false} />
                            <YAxis stroke="#52525b" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : val} />
                            <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', fontSize: '12px' }} />
                            <Line type="monotone" dataKey="seguidores" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#60a5fa' }} />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 text-sm">
                          <TrendingUp className="w-8 h-8 mb-2 opacity-50" />
                          <p>Adicione mais um mês para gerar o gráfico</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Histórico e Ações */}
                <div className="mt-6 pt-4 border-t border-zinc-800/50">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">Histórico de Registros ({mList.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {mList.map(m => (
                      <div key={m.id} className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg py-1.5 px-3">
                        <span className="text-xs text-zinc-400 font-medium">{new Date(m.data_registro).toLocaleDateString('pt-BR')}</span>
                        {isAdmin && (
                          <div className="flex items-center gap-1 ml-2 border-l border-zinc-800 pl-2">
                            <button onClick={() => handleEdit(m)} className="text-zinc-500 hover:text-white transition-colors"><Edit2 className="w-3 h-3" /></button>
                            <button onClick={() => handleDelete(m.id)} className="text-red-500/50 hover:text-red-500 transition-colors"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {Object.keys(metricsByClient).length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-zinc-900/50 border border-zinc-800 border-dashed rounded-3xl">
            <Target className="w-16 h-16 text-zinc-700 mb-4" />
            <h3 className="text-xl font-bold text-zinc-300 mb-2">Nenhum Resultado Registrado</h3>
            <p className="text-zinc-500 max-w-md">Adicione as métricas dos seus clientes mensalmente para que o CRM calcule e gere os gráficos de Antes x Depois automaticamente.</p>
          </div>
        )}
      </div>
      
      <ModalNovaMetrica 
        isOpen={modalNovaMetrica} 
        onClose={() => { setModalNovaMetrica(false); setEditMetrica(undefined); }} 
        editData={editMetrica}
      />
    </motion.div>
  );
}
