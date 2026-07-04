import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, PlayCircle, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ModalNovaMetrica, Modal } from '../components/Modals';

export default function DashboardPage() {
  const { tarefas, clientes, correcoes, currentUser } = useApp();
  const isAdmin = currentUser?.funcao === 'Admin' || currentUser?.funcao === 'Secretária';
  const [modalNovaMetrica, setModalNovaMetrica] = useState(false);
  const [modalListConfig, setModalListConfig] = useState<{isOpen: boolean, title: string, items: any[], type: 'tarefas' | 'clientes' | 'correcoes'}>({
    isOpen: false, title: '', items: [], type: 'tarefas'
  });

  const hoje = new Date().toISOString().split('T')[0];
  const atrasadas = tarefas.filter(t => t.status === 'Atrasado').length;
  const hojeCount = tarefas.filter(t => t.prazo === hoje).length;
  const aprovacoes = tarefas.filter(t => t.status === 'Aguardando revisão').length;
  const corrPendentes = correcoes.filter(c => c.status === 'Pendente').length;
  const clientesAtrasados = clientes.filter(c => c.status_geral === 'atrasado').length;
  const clientesAtivos = clientes.filter(c => c.status_geral !== 'pausado').length;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      
      {/* STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {[
          { label: 'Clientes Ativos', value: clientesAtivos, icon: Users, color: 'text-zinc-100', bg: 'bg-zinc-800/50', onClick: () => setModalListConfig({ isOpen: true, title: 'Clientes Ativos', items: clientes.filter(c => c.status_geral !== 'pausado'), type: 'clientes' }) },
          { label: 'Demandas Hoje', value: hojeCount, icon: PlayCircle, color: 'text-blue-400', bg: 'bg-blue-500/10', onClick: () => setModalListConfig({ isOpen: true, title: 'Demandas Hoje', items: tarefas.filter(t => t.prazo === hoje), type: 'tarefas' }) },
          { label: 'Aprovações Pendentes', value: aprovacoes, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', onClick: () => setModalListConfig({ isOpen: true, title: 'Aprovações Pendentes', items: tarefas.filter(t => t.status === 'Aguardando revisão'), type: 'tarefas' }) },
          { label: 'Demandas Atrasadas', value: atrasadas, icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10', onClick: () => setModalListConfig({ isOpen: true, title: 'Demandas Atrasadas', items: tarefas.filter(t => t.status === 'Atrasado'), type: 'tarefas' }) },
          { label: 'Correções Abertas', value: corrPendentes, icon: CheckCircle2, color: 'text-red-400', bg: 'bg-red-500/10', onClick: () => setModalListConfig({ isOpen: true, title: 'Correções Abertas', items: correcoes.filter(c => c.status === 'Pendente'), type: 'correcoes' }) },
          { label: 'Clientes em Atraso', value: clientesAtrasados, icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10', onClick: () => setModalListConfig({ isOpen: true, title: 'Clientes em Atraso', items: clientes.filter(c => c.status_geral === 'atrasado'), type: 'clientes' }) },
        ].map(s => {
          const Icon = s.icon;
          return (
            <Card key={s.label} onClick={s.onClick} className="bg-zinc-900 border-zinc-800 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 rounded-2xl overflow-hidden relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-5 flex flex-col gap-3 relative z-10">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{s.label}</span>
                  <div className={`p-2 rounded-xl ${s.bg} ${s.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-white tracking-tight">{s.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="bg-zinc-900 border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
            <CardHeader className="pb-4 pt-6 px-6 border-b border-zinc-800/30">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-zinc-400" />
                Status dos Clientes
              </CardTitle>
              <p className="text-sm text-zinc-500 mt-1">Visão geral de todos os contratos ativos na agência</p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-zinc-500 uppercase bg-zinc-950/20">
                    <tr>
                      <th className="px-6 py-4 font-semibold tracking-wider">Cliente</th>
                      <th className="px-6 py-4 font-semibold tracking-wider">Serviço</th>
                      <th className="px-6 py-4 font-semibold tracking-wider">Progresso</th>
                      <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/30">
                    {clientes.slice(0,5).map(c => (
                      <tr key={c.id} className="hover:bg-zinc-800/20 transition-colors group">
                        <td className="px-6 py-4 flex items-center gap-4">
                          <Avatar className="h-10 w-10 rounded-xl shadow-lg border border-zinc-800 group-hover:scale-105 transition-transform">
                            <AvatarImage src={c.logo} className="object-cover" />
                            <AvatarFallback className="bg-gradient-to-br from-zinc-700 to-zinc-900 text-xs font-bold text-white rounded-xl">{c.nome[0]}</AvatarFallback>
                          </Avatar>
                          <span className="font-semibold text-zinc-200">{c.nome}</span>
                        </td>
                        <td className="px-6 py-4 text-zinc-400 text-xs font-medium">{c.servico}</td>
                        <td className="px-6 py-4">
                          {(() => {
                            const tarefasFeitas = tarefas.filter(t => t.cliente_id === c.id && t.status === 'Feito').length;
                            const progressPercent = c.entregas_mensais && c.entregas_mensais > 0 
                              ? Math.min(100, Math.round((tarefasFeitas / c.entregas_mensais) * 100)) 
                              : c.progresso || 0;
                            return (
                              <div className="flex items-center gap-3">
                                <div className="h-2 w-28 bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                                  <div className={`h-full rounded-full transition-all ${progressPercent >= 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-500 to-blue-400'}`} style={{ width: `${progressPercent}%` }}></div>
                                </div>
                                <span className="text-xs font-bold text-zinc-400">{progressPercent}%</span>
                              </div>
                            );
                          })()}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-zinc-900/50 text-zinc-300 border-zinc-700 shadow-sm">
                            {c.status_geral.replace('_', ' ')}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800 rounded-3xl shadow-2xl">
            <CardHeader className="pb-4 pt-6 px-6 border-b border-zinc-800/30 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Tarefas Urgentes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {tarefas.filter(t => t.status === 'Atrasado' || t.prioridade === 'Urgente').slice(0,4).map(t => (
                <div key={t.id} className="flex items-start gap-4 p-4 rounded-xl bg-zinc-950/30 border border-zinc-800/50 hover:bg-zinc-950/50 transition-colors group">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 shadow-lg ${t.status === 'Atrasado' ? 'bg-red-500 shadow-red-500/50' : 'bg-amber-500 shadow-amber-500/50'}`} />
                  <div>
                    <p className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">{t.titulo}</p>
                    <p className="text-xs text-zinc-500 font-medium mt-1.5 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      Prazo: {t.prazo}
                    </p>
                  </div>
                </div>
              ))}
              {tarefas.filter(t => t.status === 'Atrasado' || t.prioridade === 'Urgente').length === 0 && (
                <div className="text-center p-6 text-zinc-500 text-sm font-medium">
                  Tudo em dia! Nenhuma tarefa urgente.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Modal de Detalhes dos Cards */}
      <Modal isOpen={modalListConfig.isOpen} onClose={() => setModalListConfig(prev => ({ ...prev, isOpen: false }))} title={modalListConfig.title}>
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2 space-y-3">
          {modalListConfig.items.length === 0 ? (
            <div className="text-zinc-500 text-center py-6 text-sm">Nenhum item encontrado.</div>
          ) : (
            modalListConfig.items.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                {modalListConfig.type === 'tarefas' && (
                  <div>
                    <h4 className="font-bold text-zinc-100 text-sm mb-1">{item.titulo}</h4>
                    <p className="text-xs text-zinc-400">Prazo: <span className="font-semibold text-zinc-300">{item.prazo}</span> | Status: <span className="font-semibold text-zinc-300">{item.status}</span></p>
                  </div>
                )}
                {modalListConfig.type === 'clientes' && (
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={item.logo} />
                      <AvatarFallback className="bg-zinc-800 text-zinc-400">{item.nome?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-bold text-zinc-100 text-sm">{item.nome}</h4>
                      <p className="text-xs text-zinc-400">{item.servico}</p>
                    </div>
                  </div>
                )}
                {modalListConfig.type === 'correcoes' && (
                  <div>
                    <h4 className="font-bold text-zinc-100 text-sm mb-1">Correção: {item.tarefa_id}</h4>
                    <p className="text-xs text-zinc-400">{item.notas_correcao}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Modal>

    </motion.div>
  );
}
