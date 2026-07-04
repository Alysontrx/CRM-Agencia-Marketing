import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { DollarSign, AlertCircle, CheckCircle2, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ModalNovoCliente } from '../components/Modals';
import React, { useState } from 'react';
import type { ClienteData } from '../data/types';

export default function ClientesPage() {
  const { clientes, tarefas, setClientes, addNotificacao, deleteCliente, currentUser } = useApp();
  const isAdmin = currentUser?.funcao === 'Admin' || currentUser?.funcao === 'Secretária';
  const [modalNovoCliente, setModalNovoCliente] = useState(false);
  const [editCliente, setEditCliente] = useState<ClienteData | undefined>(undefined);

  const handleEdit = (cliente: ClienteData) => {
    setEditCliente(cliente);
    setModalNovoCliente(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      deleteCliente(id);
    }
  };

  const handlePagamento = (clienteId: number, clienteNome: string) => {
    setClientes(prev => prev.map(c => 
      c.id === clienteId ? { ...c, status_geral: 'em_dia' } : c
    ));
    addNotificacao(`Pagamento de ${clienteNome} recebido com sucesso. Status atualizado!`, 'sucesso');
  };

  const handleAtraso = (clienteId: number, clienteNome: string) => {
    setClientes(prev => prev.map(c => 
      c.id === clienteId ? { ...c, status_geral: 'atrasado' } : c
    ));
    addNotificacao(`Cliente ${clienteNome} marcado como inadimplente (Atrasado).`, 'alerta');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Módulo Financeiro & Clientes</h2>
          <p className="text-sm text-zinc-400 mt-1">Controle de inadimplência e status geral da carteira.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border-zinc-800 shadow-xl rounded-2xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-5 flex items-center justify-between relative z-10">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">MRR Total</p>
              <h3 className="text-3xl font-extrabold text-emerald-400">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                  clientes.reduce((acc, c) => acc + (c.mrr || 0), 0)
                )}
              </h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 shadow-inner">
              <DollarSign className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
        <CardHeader className="pb-4 pt-6 px-6 border-b border-zinc-800/30 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-zinc-400" />
            Carteira de Clientes
          </CardTitle>
          {isAdmin && (
            <Button onClick={() => setModalNovoCliente(true)} className="bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs font-semibold px-4 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all">
              + Novo Cliente
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-500 uppercase bg-zinc-950/20">
                <tr>
                  <th className="px-6 py-4 font-semibold tracking-wider">Cliente</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">MRR</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Status Financeiro</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Entregas do Mês</th>
                  <th className="px-6 py-4 font-semibold tracking-wider text-right">Ações (Simulador)</th>
                  {isAdmin && <th className="px-6 py-4 font-bold tracking-wider rounded-tr-lg">Ações</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/30">
                {clientes.map(c => (
                  <tr key={c.id} className="hover:bg-zinc-800/20 transition-colors group">
                    <td className="px-6 py-4 flex items-center gap-4">
                      <Avatar className="h-10 w-10 rounded-xl shadow-lg border border-zinc-800 group-hover:scale-105 transition-transform">
                        <AvatarImage src={c.logo} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-zinc-700 to-zinc-900 text-xs font-bold text-white rounded-xl">{c.nome[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-semibold text-zinc-200 block">{c.nome}</span>
                        <span className="text-[11px] font-medium text-zinc-500">{c.servico}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-zinc-300 font-bold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(c.mrr || 0)}
                      </div>
                      {c.dia_pagamento && (
                        <div className="text-[10px] text-zinc-500 font-medium mt-0.5">
                          Vencimento: Dia {c.dia_pagamento}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {c.status_geral === 'em_dia' ? (
                        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-sm">Em Dia</Badge>
                      ) : c.status_geral === 'atrasado' ? (
                        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-sm">Atrasado</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-sm">Atenção</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {c.entregas_mensais && c.entregas_mensais > 0 ? (
                        <div className="w-32">
                          <div className="flex justify-between items-center mb-1 text-[10px] font-bold">
                            <span className="text-zinc-400 uppercase tracking-wider">Progresso</span>
                            <span className="text-zinc-200">{tarefas.filter(t => t.cliente_id === c.id && t.status === 'Feito').length} / {c.entregas_mensais}</span>
                          </div>
                          <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                            <div 
                              className={`h-full transition-all rounded-full ${tarefas.filter(t => t.cliente_id === c.id && t.status === 'Feito').length >= c.entregas_mensais ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                              style={{ width: `${Math.min(100, (tarefas.filter(t => t.cliente_id === c.id && t.status === 'Feito').length / c.entregas_mensais) * 100)}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-600 font-medium">Não configurado</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {c.status_geral !== 'em_dia' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handlePagamento(c.id, c.nome)}
                            className="h-8 text-[11px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30 transition-all shadow-sm"
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1.5" /> Marcar Pago
                          </Button>
                        )}
                        {c.status_geral === 'em_dia' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleAtraso(c.id, c.nome)}
                            className="h-8 text-[11px] font-bold bg-zinc-900/50 hover:bg-rose-500/10 hover:text-rose-400 border-zinc-700 hover:border-rose-500/30 transition-all shadow-sm text-zinc-400"
                          >
                            <AlertCircle className="w-3 h-3 mr-1.5" /> Acusar Atraso
                          </Button>
                        )}
                        {c.status_geral === 'atrasado' && c.whatsapp && (
                          <a 
                            href={`https://wa.me/55${c.whatsapp.replace(/\D/g, '')}?text=Olá! Tudo bem? Passando para lembrar sobre a sua mensalidade referente aos nossos serviços da Agência que venceu no dia ${c.dia_pagamento || 'recentemente'}. Se já tiver feito o pagamento, pode desconsiderar essa mensagem. Qualquer dúvida, estou à disposição!`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 text-[11px] font-bold bg-zinc-900/50 hover:bg-emerald-500/10 hover:text-emerald-400 border-zinc-700 hover:border-emerald-500/30 transition-all shadow-sm text-zinc-400"
                            >
                              Cobrar (Whats)
                            </Button>
                          </a>
                        )}
                      </div>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(c)} className="h-7 px-2 text-xs bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-700">
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(c.id)} className="h-7 px-2 text-xs bg-red-500/10 border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/20">
                            Excluir
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <ModalNovoCliente 
        isOpen={modalNovoCliente} 
        onClose={() => { setModalNovoCliente(false); setEditCliente(undefined); }} 
        editData={editCliente} 
      />
    </motion.div>
  );
}
