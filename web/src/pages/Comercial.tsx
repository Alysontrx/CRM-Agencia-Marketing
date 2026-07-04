import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ModalNovoLead } from '../components/Modals';
import React, { useState } from 'react';
import type { LeadData } from '../data/types';
import { Clock } from 'lucide-react';

export default function ComercialPage() {
  const { leads, updateLead, addCliente, addTarefa, addNotificacao, deleteLead, currentUser, currentAgencia, users } = useApp();
  const isAdmin = currentUser?.funcao === 'Admin' || currentUser?.funcao === 'Secretária';
  const [modalNovoLead, setModalNovoLead] = useState(false);
  const [editLead, setEditLead] = useState<LeadData | undefined>(undefined);

  const [modalConversao, setModalConversao] = useState<{isOpen: boolean, lead: LeadData | null}>({isOpen: false, lead: null});
  const [modalPerda, setModalPerda] = useState<{isOpen: boolean, lead: LeadData | null}>({isOpen: false, lead: null});
  const [servicoContratado, setServicoContratado] = useState('Marketing Digital');
  const [diaPagamento, setDiaPagamento] = useState('');
  const [responsavelId, setResponsavelId] = useState('');
  const [motivoPerda, setMotivoPerda] = useState('');

  const handleEdit = (lead: LeadData) => {
    setEditLead(lead);
    setModalNovoLead(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este Lead?')) {
      deleteLead(id);
    }
  };
  
  const colunas = ['Prospect', 'Contato Feito', 'Reunião', 'Proposta', 'Negociação', 'Fechado', 'Perdido'];

  const getMensagemWhats = (lead: LeadData) => {
    const nome = lead.contato || 'Responsável';
    const agencia = currentAgencia?.nome || 'agência';
    switch (lead.status) {
      case 'Prospect': return `Olá ${nome}! Aqui é da ${agencia}. Vi que você tem interesse em nossos serviços. Podemos conversar?`;
      case 'Contato Feito': return `Olá ${nome}! Tudo bem? Gostaria de agendar uma breve reunião para entender melhor suas necessidades.`;
      case 'Reunião': return `Olá ${nome}! Nossa reunião está confirmada? Qualquer dúvida, estou à disposição.`;
      case 'Proposta': return `Olá ${nome}! O que achou da nossa proposta? Fico no aguardo para darmos os próximos passos.`;
      case 'Negociação': return `Olá ${nome}! Tem alguma dúvida sobre os valores? Estou à disposição para chegarmos num acordo bacana!`;
      case 'Fechado': return `Olá ${nome}! Seja bem-vindo à ${agencia}! Estamos muito felizes com a parceria.`;
      case 'Perdido': return `Olá ${nome}. Entendemos sua decisão. A ${agencia} continua de portas abertas para oportunidades futuras!`;
      default: return `Olá ${nome}! Aqui é da ${agencia}. Podemos conversar?`;
    }
  };

  const getMensagemEmail = (lead: LeadData) => {
    const nome = lead.contato || 'Responsável';
    const agencia = currentAgencia?.nome || 'agência';
    switch (lead.status) {
      case 'Prospect': return `Olá ${nome}, tudo bem?\n\nGostaríamos de apresentar nossas soluções da ${agencia} para a sua empresa.`;
      case 'Proposta': return `Olá ${nome}, tudo bem?\n\nSegue em anexo a nossa proposta comercial. Fico à disposição para dúvidas.`;
      case 'Fechado': return `Olá ${nome}, parabéns pela decisão!\n\nSegue em anexo o seu contrato e as orientações iniciais (Onboarding).`;
      default: return `Olá ${nome}, tudo bem?\n\n`;
    }
  };
  
  const handleDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData('leadId', id.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, novaColuna: string) => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData('leadId'));
    if (!id) return;
    
    const lead = leads.find(l => l.id === id);
    if (!lead || lead.status === novaColuna) return;
    
    // Automação: Conversão para Cliente e Onboarding
    if (novaColuna === 'Fechado' && lead.status !== 'Fechado') {
      setModalConversao({ isOpen: true, lead });
      return;
    }
    
    // Automação: Lead Perdido
    if (novaColuna === 'Perdido' && lead.status !== 'Perdido') {
      setMotivoPerda('');
      setModalPerda({ isOpen: true, lead });
      return;
    }
    
    updateLead(id, { status: novaColuna as any });
  };

  const handleConfirmConversao = () => {
    const lead = modalConversao.lead;
    if (!lead) return;
    
    if (servicoContratado) {
      addCliente({
        nome: lead.empresa,
        servico: servicoContratado,
        responsavel_id: responsavelId ? parseInt(responsavelId) : (currentUser?.id || 1),
        mrr: lead.valor_estimado,
        whatsapp: lead.telefone,
        dia_pagamento: diaPagamento ? parseInt(diaPagamento) : undefined,
        data_inicio: new Date().toISOString().split('T')[0]
      }).then(() => {
        const fakeClienteId = Math.floor(Math.random() * 1000) + 10;
        
        addTarefa({
          titulo: `[Onboarding] Configurar contas e acessos - ${lead.empresa}`,
          cliente_id: fakeClienteId,
          responsavel_id: currentUser?.id || 1,
          setor: 'Admin',
          prioridade: 'Alta',
          prazo: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'A fazer'
        });
        addTarefa({
          titulo: `[Onboarding] Reunião de Kickoff - ${lead.empresa}`,
          cliente_id: fakeClienteId,
          responsavel_id: currentUser?.id || 1,
          setor: 'Admin',
          prioridade: 'Alta',
          prazo: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'A fazer'
        });
        addTarefa({
          titulo: `[Onboarding] Criar calendário editorial inicial - ${lead.empresa}`,
          cliente_id: fakeClienteId,
          responsavel_id: currentUser?.id || 1,
          setor: 'Social Media',
          prioridade: 'Média',
          prazo: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'A fazer'
        });

        addNotificacao(`Pasta do Google Drive criada para ${lead.empresa}`, 'info');

        if (lead.email) {
          fetch('http://localhost:3001/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: lead.email,
              fromName: currentAgencia?.nome || 'Sense Agency',
              fromEmail: currentAgencia?.nome?.includes('Sense') ? 'atlasupi@gmail.com' : (currentUser?.email || 'atlasupi@gmail.com'),
              subject: `Bem-vindo à ${currentAgencia?.nome || 'nossa agência'}!`,
              contractDetails: {
                empresa: lead.empresa,
                servico: servicoContratado,
                valor: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.valor_estimado)
              },
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                  <h2 style="color: #2563eb;">Olá, ${lead.contato}!</h2>
                  <p>Estamos muito felizes em ter a <strong>${lead.empresa}</strong> como nosso mais novo cliente.</p>
                  <p>Sua conta já foi criada em nosso sistema e as equipes já foram notificadas e suas demandas geradas em nosso Kanban.</p>
                  <p>Em breve, nossa equipe de Onboarding entrará em contato para marcarmos nossa reunião de Kickoff.</p>
                  <br/>
                  <p>Um abraço,<br/><strong>Equipe ${currentAgencia?.nome || 'Atlas'}</strong></p>
                </div>
              `
            })
          })
          .then(res => res.json())
          .then(data => {
            console.log("Email enviado:", data);
            addNotificacao(`E-mail de boas-vindas enviado para ${lead.email}`, 'sucesso');
          })
          .catch(err => {
            console.error("Erro ao enviar email:", err);
            addNotificacao('Falha ao enviar e-mail. Backend offline?', 'alerta');
          });
        }
        
        setModalConversao({ isOpen: false, lead: null });
        addNotificacao(`Contrato automático enviado para ${lead.email || lead.contato}`, 'info');
        addNotificacao(`E-mail de Boas-Vindas (Onboarding) enviado para ${lead.empresa}!`, 'sucesso');
      });
    }

    updateLead(lead.id, { status: 'Fechado' });
    setModalConversao({ isOpen: false, lead: null });
  };

  const handleConfirmPerda = () => {
    const lead = modalPerda.lead;
    if (!lead || !motivoPerda) return;

    const novoResumo = `${lead.resumo_ia || ''} | MOTIVO DA PERDA: ${motivoPerda}`;
    updateLead(lead.id, { resumo_ia: novoResumo, status: 'Perdido' });
    
    const daqui90dias = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    addTarefa({
      titulo: `[Reativação] Fazer follow-up com lead perdido: ${lead.empresa}`,
      cliente_id: null as any,
      responsavel_id: currentUser?.id || 1,
      setor: 'Comercial',
      prioridade: 'Média',
      prazo: daqui90dias,
      status: 'A fazer'
    });
    
    addNotificacao(`Motivo da perda salvo. Tarefa de reativação agendada para 90 dias.`, 'alerta');
    setModalPerda({ isOpen: false, lead: null });
    setMotivoPerda('');
  };

  const simulateCron = () => {
    let afetados = 0;
    leads.forEach(lead => {
      // Pega leads nas primeiras colunas que estão há muito tempo
      if (['Prospect', 'Contato Feito', 'Reunião'].includes(lead.status)) {
        addNotificacao(`Alerta: O Lead "${lead.empresa}" está esfriando! Sem movimento.`, 'erro');
        
        addTarefa({
          titulo: `[Recuperação] Entrar em contato com o Lead parado: ${lead.empresa}`,
          cliente_id: 1,
          responsavel_id: currentUser?.id || 1,
          setor: 'Comercial',
          prioridade: 'Alta',
          prazo: new Date().toISOString().split('T')[0], // Para hoje
          status: 'A fazer'
        });
        afetados++;
      }
    });

    if (afetados > 0) {
      addNotificacao(`Cron Simulado: ${afetados} leads parados detectados. Tarefas criadas!`, 'sucesso');
    } else {
      addNotificacao(`Cron Simulado: Nenhum lead parado encontrado!`, 'info');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col min-h-0">
      {isAdmin && (
        <div className="flex justify-between items-center mb-4">
          <Button onClick={simulateCron} variant="outline" className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10 gap-2 font-semibold">
            <Clock className="w-4 h-4" /> Simular Cron (Leads Parados)
          </Button>
          <Button onClick={() => setModalNovoLead(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all">
            + Novo Lead
          </Button>
        </div>
      )}
      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory">
        <div className="flex gap-4 md:gap-6 min-h-full min-w-max items-start px-2 md:px-4">
          {colunas.map(col => {
            const columnLeads = leads.filter(l => l.status === col);
            return (
              <div 
                key={col} 
                className="w-[85vw] sm:w-80 snap-center bg-zinc-900/60 rounded-2xl border border-zinc-800/60 flex flex-col max-h-full shadow-xl"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col)}
              >
                <div className="p-4 border-b border-zinc-800/30 flex items-center justify-between bg-zinc-950/20 rounded-t-2xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full shadow-lg ${col === 'Fechado' ? 'bg-emerald-500 shadow-emerald-500/50' : col === 'Perdido' ? 'bg-rose-500 shadow-rose-500/50' : col === 'Reunião' ? 'bg-blue-500 shadow-blue-500/50' : 'bg-amber-500 shadow-amber-500/50'}`} />
                    <h3 className="font-bold text-zinc-100 text-sm tracking-wide">{col}</h3>
                  </div>
                  <Badge variant="secondary" className="bg-zinc-800/80 text-zinc-300 font-bold px-2 py-0.5 rounded-md border border-zinc-700/50 shadow-sm">{columnLeads.length}</Badge>
                </div>
                <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                  {columnLeads.map(lead => (
                    <Card 
                      key={lead.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      className="bg-zinc-900 border-zinc-800 cursor-grab active:cursor-grabbing hover:border-zinc-500/50 transition-all hover:shadow-lg hover:-translate-y-1 rounded-xl group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      <CardContent className="p-5 relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="font-bold text-zinc-100 text-sm leading-tight group-hover:text-white transition-colors block">{lead.empresa}</span>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {lead.nota_ia ? (
                                <Badge variant="outline" className={`text-[9px] font-bold px-1.5 py-0 shadow-sm ${lead.nota_ia >= 8 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : lead.nota_ia >= 5 ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'}`}>
                                  Nota IA: {lead.nota_ia}/10
                                </Badge>
                              ) : null}
                              {new Date(lead.data_criacao).getTime() < Date.now() - 7 * 24 * 60 * 60 * 1000 && lead.status !== 'Fechado' && lead.status !== 'Perdido' ? (
                                <Badge variant="outline" className="text-[9px] font-bold px-1.5 py-0 shadow-sm bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse">
                                  Lead Parado (+7 dias)
                                </Badge>
                              ) : null}
                            </div>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-1 rounded-md border border-emerald-500/20 shadow-sm whitespace-nowrap ml-2">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.valor_estimado)}
                          </span>
                        </div>

                        {lead.resumo_ia && (
                          <div className="mb-4 text-[10px] text-zinc-400 italic bg-zinc-950/40 p-2 rounded-lg border border-zinc-800/50 border-l-2 border-l-blue-500">
                            "{lead.resumo_ia}"
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-[11px] text-zinc-300 font-medium mb-4 bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/80">
                          <Phone className="w-3.5 h-3.5 text-zinc-400" /> 
                          <span className="truncate">{lead.contato} <span className="text-zinc-500 ml-1">({lead.telefone})</span></span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <button 
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={() => {
                              if (lead.telefone) {
                                const numeroFormatado = lead.telefone.replace(/\D/g, '');
                                const mensagem = encodeURIComponent(getMensagemWhats(lead));
                                window.open(`https://wa.me/55${numeroFormatado}?text=${mensagem}`, '_blank');
                              } else {
                                addNotificacao('Este lead não tem um número de telefone cadastrado.', 'alerta');
                              }
                            }}
                            className="flex items-center justify-center gap-1.5 flex-1 bg-zinc-800/40 hover:bg-emerald-500/15 hover:text-emerald-400 text-zinc-400 text-[10px] font-bold uppercase tracking-wider py-2 rounded-lg border border-zinc-700/50 hover:border-emerald-500/30 transition-all shadow-sm z-20"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> Whats
                          </button>
                          <button 
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (lead.email) {
                                addNotificacao(`Enviando e-mail para ${lead.email}...`, 'info');
                                fetch('http://localhost:3001/api/send-email', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    to: lead.email,
                                    fromName: currentAgencia?.nome || 'Sense Agency',
                                    fromEmail: currentAgencia?.nome?.includes('Sense') ? 'atlasupi@gmail.com' : (currentUser?.email || 'atlasupi@gmail.com'),
                                    subject: `Contato - ${currentAgencia?.nome || 'Nossa Agência'}`,
                                    html: `<div style="font-family: sans-serif; color: #333; max-width: 600px;">
                                             <p>${getMensagemEmail(lead)}</p>
                                             <br/><p>Um abraço,<br/><strong>${currentAgencia?.nome || 'Equipe'}</strong></p>
                                           </div>`
                                  })
                                })
                                .then(res => res.json())
                                .then(() => {
                                  addNotificacao(`E-mail enviado com sucesso para ${lead.email}`, 'sucesso');
                                })
                                .catch(() => {
                                  addNotificacao('Falha ao enviar e-mail. Backend offline?', 'alerta');
                                });
                              } else {
                                addNotificacao('Este lead não tem um e-mail cadastrado.', 'alerta');
                              }
                            }}
                            className="flex items-center justify-center gap-1.5 flex-1 bg-zinc-800/40 hover:bg-blue-500/15 hover:text-blue-400 text-zinc-400 text-[10px] font-bold uppercase tracking-wider py-2 rounded-lg border border-zinc-700/50 hover:border-blue-500/30 transition-all shadow-sm z-20"
                          >
                            <Mail className="w-3.5 h-3.5" /> E-mail
                          </button>
                        </div>

                        <div className="flex justify-between items-center pt-4 mt-2 border-t border-zinc-800/50">
                          <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest bg-zinc-950/80 border-zinc-700/50 text-zinc-400 px-2 py-0.5 shadow-sm">
                            {lead.origem}
                          </Badge>
                          <span className="text-[10px] text-zinc-500 block mb-1">Status: {lead.status}</span>
                        </div>
                            
                        {isAdmin && (
                          <div className="flex gap-2 border-t border-zinc-800 pt-2 px-1">
                            <button onClick={() => handleEdit(lead)} className="text-[10px] flex-1 py-1 rounded bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors">
                              Editar
                            </button>
                            <button onClick={() => handleDelete(lead.id)} className="text-[10px] flex-1 py-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors">
                              Excluir
                            </button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  {columnLeads.length === 0 && (
                    <div className="h-28 flex items-center justify-center border-2 border-dashed border-zinc-800/30 rounded-xl text-zinc-600/80 text-xs font-semibold tracking-wide bg-zinc-950/10">
                      Vazio
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      <ModalNovoLead 
        isOpen={modalNovoLead} 
        onClose={() => { setModalNovoLead(false); setEditLead(undefined); }} 
        editData={editLead}
      />

      {/* Modal Conversão */}
      <AnimatePresence>
        {modalConversao.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalConversao({ isOpen: false, lead: null })} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-[#0a0a0a] border border-zinc-800 p-6 rounded-2xl shadow-2xl w-full max-w-md">
              <h2 className="text-xl font-bold text-white mb-2">🎉 Novo Cliente!</h2>
              <p className="text-zinc-400 text-sm mb-6">Você está convertendo o lead <strong className="text-white">{modalConversao.lead?.empresa}</strong> em um cliente ativo. Isso vai gerar as tarefas automáticas de Onboarding.</p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-1.5 block">Qual serviço foi contratado?</label>
                  <input type="text" value={servicoContratado} onChange={e => setServicoContratado(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-zinc-300 mb-1.5 block">Dia de Pagamento</label>
                    <input type="number" min="1" max="31" placeholder="Ex: 15" value={diaPagamento} onChange={e => setDiaPagamento(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-zinc-300 mb-1.5 block">Gestor (Responsável)</label>
                    <select required value={responsavelId} onChange={e => setResponsavelId(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none">
                      <option value="">Selecione...</option>
                      {users?.filter(u => u.funcao !== 'Cliente').map(u => (
                        <option key={u.id} value={u.id}>{u.nome}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="ghost" onClick={() => setModalConversao({ isOpen: false, lead: null })} className="text-zinc-400 hover:text-white">Cancelar</Button>
                <Button onClick={handleConfirmConversao} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">Confirmar & Gerar Onboarding</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Perda */}
      <AnimatePresence>
        {modalPerda.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalPerda({ isOpen: false, lead: null })} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-[#0a0a0a] border border-zinc-800 p-6 rounded-2xl shadow-2xl w-full max-w-md">
              <h2 className="text-xl font-bold text-rose-500 mb-2">Lead Perdido</h2>
              <p className="text-zinc-400 text-sm mb-6">Você moveu <strong className="text-white">{modalPerda.lead?.empresa}</strong> para Perdidos. O sistema agendará um follow-up de reativação para daqui a 90 dias.</p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-1.5 block">Qual foi o motivo da perda?</label>
                  <input autoFocus type="text" placeholder="Ex: Achou caro, fechou com concorrente..." value={motivoPerda} onChange={e => setMotivoPerda(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none" />
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="ghost" onClick={() => setModalPerda({ isOpen: false, lead: null })} className="text-zinc-400 hover:text-white">Cancelar</Button>
                <Button onClick={handleConfirmPerda} disabled={!motivoPerda} className="bg-rose-600 hover:bg-rose-700 text-white font-bold disabled:opacity-50">Confirmar Perda</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
