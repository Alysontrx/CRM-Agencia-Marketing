import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Settings, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ModalNovoUsuario } from '../components/Modals';
import { ModalExportarPDF } from '../components/ModalExportarPDF';
import { Edit2, Trash2, Plus, Download } from 'lucide-react';
import type { User } from '../data/types';
import { useReactToPrint } from 'react-to-print';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';

export default function EquipePage() {
  const { currentUser, users, tarefas, deleteUser } = useApp();
  // Filtramos Admin e Administrador, pois eles geralmente não executam tarefas produtivas monitoradas aqui
  const teamUsers = users.filter(u => u.funcao !== 'Admin' && u.funcao !== 'Administrador');
  
  const [modalUsuario, setModalUsuario] = useState(false);
  const [editUsuario, setEditUsuario] = useState<User | undefined>(undefined);
  const [selectedEmployeeForPDF, setSelectedEmployeeForPDF] = useState<User | null>(null);
  const [pdfPeriod, setPdfPeriod] = useState<{start: string, end: string} | null>(null);

  const [modalExportTeam, setModalExportTeam] = useState(false);
  const [teamPdfPeriod, setTeamPdfPeriod] = useState<{start: string, end: string} | null>(null);

  const pdfRef = useRef<HTMLDivElement>(null);
  const teamPdfRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: pdfRef,
    documentTitle: selectedEmployeeForPDF ? `Relatorio_${selectedEmployeeForPDF.nome.replace(/\s+/g, '_')}` : 'Relatorio',
    onAfterPrint: () => {
      setPdfPeriod(null);
      setSelectedEmployeeForPDF(null);
    }
  });

  useEffect(() => {
    if (pdfPeriod && selectedEmployeeForPDF && pdfRef.current) {
      setTimeout(() => {
        handlePrint();
      }, 500);
    }
  }, [pdfPeriod, selectedEmployeeForPDF]);

  const handlePrintTeam = useReactToPrint({
    contentRef: teamPdfRef,
    documentTitle: 'Relatorio_Equipe',
    onAfterPrint: () => setTeamPdfPeriod(null)
  });

  useEffect(() => {
    if (teamPdfPeriod && teamPdfRef.current) {
      setTimeout(() => {
        handlePrintTeam();
      }, 500);
    }
  }, [teamPdfPeriod]);

  const isAdmin = currentUser?.funcao === 'Admin' || currentUser?.funcao === 'Administrador';

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Card className="bg-zinc-900 border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
        <CardHeader className="pb-4 pt-6 px-6 border-b border-zinc-800/30 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-zinc-400" />
            Performance da Equipe
          </CardTitle>
          <div className="flex gap-2">
            <Button onClick={() => setModalExportTeam(true)} variant="outline" className="border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 h-8 px-3 text-xs transition-colors">
              <Download className="w-4 h-4 mr-1" /> Relatório Geral
            </Button>
            {isAdmin && (
              <Button onClick={() => { setEditUsuario(undefined); setModalUsuario(true); }} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all h-8 px-3 text-xs">
                <Plus className="w-4 h-4 mr-1" /> Novo Funcionário
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamUsers.map(member => {
              const userTasks = tarefas.filter(t => t.responsavel_id === member.id);
              const pendentes = userTasks.filter(t => t.status !== 'Aprovado' && t.status !== 'Fechado');
              const concluidas = userTasks.filter(t => t.status === 'Aprovado' || t.status === 'Fechado');
              const atrasadas = pendentes.filter(t => t.status === 'Atrasado');

              return (
                <Card key={member.id} className="bg-zinc-950/50 border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4 mb-5">
                      <Avatar className="h-12 w-12 border-2 border-zinc-800 shadow-xl">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-zinc-800 text-zinc-300 font-bold">{member.nome[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-sm font-bold text-zinc-100">{member.nome}</h3>
                        <p className="text-xs text-zinc-500 font-medium">{member.funcao}</p>
                      </div>
                      
                      {isAdmin && (
                        <div className="ml-auto flex gap-1">
                          <button onClick={() => setSelectedEmployeeForPDF(member)} className="p-1.5 bg-zinc-800 text-zinc-400 hover:text-white rounded-md transition-colors shadow-lg" title="Exportar Relatório">
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => { setEditUsuario(member); setModalUsuario(true); }} className="p-1.5 bg-zinc-800 text-zinc-400 hover:text-white rounded-md transition-colors shadow-lg" title="Editar">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => { if(confirm('Excluir funcionário?')) deleteUser(member.id); }} className="p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-md transition-colors shadow-lg">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-400 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> Tarefas Pendentes</span>
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 font-bold">{pendentes.length}</Badge>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-400 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Tarefas Concluídas</span>
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold">{concluidas.length}</Badge>
                      </div>
                      <div className="flex justify-between items-center text-xs pt-3 border-t border-zinc-800/50">
                        <span className="text-zinc-500 font-medium">Atrasos Atuais</span>
                        <span className={`font-bold ${atrasadas.length > 0 ? 'text-rose-500' : 'text-zinc-600'}`}>{atrasadas.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
      <ModalNovoUsuario isOpen={modalUsuario} onClose={() => { setModalUsuario(false); setEditUsuario(undefined); }} editData={editUsuario} />
      
      <ModalExportarPDF 
        isOpen={!!selectedEmployeeForPDF && !pdfPeriod} 
        onClose={() => setSelectedEmployeeForPDF(null)} 
        title={`Relatório - ${selectedEmployeeForPDF?.nome}`}
        onExport={(start, end) => setPdfPeriod({start, end})}
      />

      <ModalExportarPDF 
        isOpen={modalExportTeam} 
        onClose={() => setModalExportTeam(false)} 
        title="Exportar Relatório da Equipe"
        onExport={(start, end) => setTeamPdfPeriod({start, end})}
      />

      {/* Hidden Div for PDF Generation (Individual) */}
      {pdfPeriod && selectedEmployeeForPDF && (
        <div style={{ display: 'none' }}>
          <div ref={pdfRef} id="pdf-content-equipe" className="p-8 bg-zinc-950 text-zinc-100">
            <div className="flex items-center gap-4 border-b border-zinc-800 pb-6 mb-6">
              <img src={selectedEmployeeForPDF.avatar || '/logo.png'} alt="Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-zinc-700" />
              <div>
                <h1 className="text-3xl font-bold">{selectedEmployeeForPDF.nome}</h1>
                <p className="text-zinc-400">Relatório de Produtividade | {selectedEmployeeForPDF.funcao}</p>
                <p className="text-zinc-500 text-sm mt-1">{new Date(pdfPeriod.start).toLocaleDateString('pt-BR')} a {new Date(pdfPeriod.end).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 text-center">
                <h3 className="text-xs font-bold text-zinc-400 uppercase">Tarefas Entregues</h3>
                <p className="text-2xl font-bold text-emerald-400 mt-2">
                  {tarefas.filter(t => {
                    if (t.responsavel_id !== selectedEmployeeForPDF.id || (t.status !== 'Aprovado' && t.status !== 'Fechado')) return false;
                    const d = (t.data_criacao || (t as any).criado_em || (t as any).created_at || '').substring(0, 10);
                    return d >= pdfPeriod.start && d <= pdfPeriod.end;
                  }).length}
                </p>
              </div>
              <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 text-center">
                <h3 className="text-xs font-bold text-zinc-400 uppercase">Atrasadas no Período</h3>
                <p className="text-2xl font-bold text-rose-400 mt-2">
                  {tarefas.filter(t => {
                    if (t.responsavel_id !== selectedEmployeeForPDF.id || t.status !== 'Atrasado') return false;
                    const d = (t.data_criacao || (t as any).criado_em || (t as any).created_at || '').substring(0, 10);
                    return d >= pdfPeriod.start && d <= pdfPeriod.end;
                  }).length}
                </p>
              </div>
              <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 text-center">
                <h3 className="text-xs font-bold text-zinc-400 uppercase">Pendentes Atuais</h3>
                <p className="text-2xl font-bold text-blue-400 mt-2">
                  {tarefas.filter(t => t.responsavel_id === selectedEmployeeForPDF.id && t.status !== 'Aprovado' && t.status !== 'Fechado').length}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4 border-b border-zinc-800 pb-2">Entregas no Período</h3>
              <div className="mb-8 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400">
                    <th className="py-2">Título</th>
                    <th className="py-2">Prioridade</th>
                    <th className="py-2">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {tarefas.filter(t => {
                    if (t.responsavel_id !== selectedEmployeeForPDF.id || (t.status !== 'Aprovado' && t.status !== 'Fechado')) return false;
                    const d = (t.data_criacao || (t as any).criado_em || (t as any).created_at || '').substring(0, 10);
                    return d >= pdfPeriod.start && d <= pdfPeriod.end;
                  }).map(t => (
                    <tr key={t.id} className="border-b border-zinc-800/50">
                      <td className="py-2">{t.titulo}</td>
                      <td className="py-2">{t.prioridade}</td>
                      <td className="py-2">{new Date(t.data_criacao || (t as any).criado_em || '').toLocaleDateString('pt-BR')}</td>
                    </tr>
                  ))}
                  {tarefas.filter(t => {
                    if (t.responsavel_id !== selectedEmployeeForPDF.id || (t.status !== 'Aprovado' && t.status !== 'Fechado')) return false;
                    const d = (t.data_criacao || (t as any).criado_em || (t as any).created_at || '').substring(0, 10);
                    return d >= pdfPeriod.start && d <= pdfPeriod.end;
                  }).length === 0 && (
                    <tr><td colSpan={3} className="py-4 text-center text-zinc-500">Nenhuma entrega registrada neste período.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            </div>
            
            <div className="text-center text-xs text-zinc-600 mt-10 pt-4 border-t border-zinc-800">
              Documento interno | Gerado automaticamente pelo sistema SenseOS em {new Date().toLocaleString('pt-BR')}
            </div>
          </div>
        </div>
      )}

      {/* Hidden Div for PDF Generation (Team) */}
      {teamPdfPeriod && (
        <div style={{ display: 'none' }}>
          <div ref={teamPdfRef} id="pdf-content-team" className="p-8 bg-zinc-950 text-zinc-100" style={{ width: '800px' }}>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-6 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white">Relatório de Produtividade da Equipe</h1>
                <p className="text-zinc-400 mt-1">{new Date(teamPdfPeriod.start).toLocaleDateString('pt-BR')} a {new Date(teamPdfPeriod.end).toLocaleDateString('pt-BR')}</p>
              </div>
              <Settings className="w-10 h-10 text-zinc-700" />
            </div>

            {(() => {
              const teamData = teamUsers.map(member => {
                const userTasks = tarefas.filter(t => {
                  if (t.responsavel_id !== member.id) return false;
                  // Fallback robusto para garantir que a data existe, mesmo se AppContext falhar no mapeamento
                  const dateStr = t.data_criacao || (t as any).criado_em || (t as any).created_at;
                  if (!dateStr) return false;
                  
                  // Pega apenas o YYYY-MM-DD para comparação precisa
                  const d = dateStr.substring(0, 10);
                  return d >= teamPdfPeriod.start && d <= teamPdfPeriod.end;
                });
                
                const entregues = userTasks.filter(t => t.status === 'Aprovado' || t.status === 'Fechado').length;
                const atrasadas = userTasks.filter(t => t.status === 'Atrasado').length;
                return { nome: member.nome, entregues, atrasadas };
              });
              
              const totalEntregues = teamData.reduce((acc, curr) => acc + curr.entregues, 0);
              const totalAtrasadas = teamData.reduce((acc, curr) => acc + curr.atrasadas, 0);
              const destaque = [...teamData].sort((a,b) => b.entregues - a.entregues)[0];

              return (
                <>
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 text-center">
                      <h3 className="text-xs font-bold text-zinc-400 uppercase">Total de Entregas</h3>
                      <p className="text-3xl font-bold text-emerald-400 mt-2">{totalEntregues}</p>
                    </div>
                    <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 text-center">
                      <h3 className="text-xs font-bold text-zinc-400 uppercase">Total de Atrasos</h3>
                      <p className="text-3xl font-bold text-rose-400 mt-2">{totalAtrasadas}</p>
                    </div>
                    <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 text-center">
                      <h3 className="text-xs font-bold text-zinc-400 uppercase">Destaque Produtividade</h3>
                      <p className="text-xl font-bold text-blue-400 mt-3 truncate">{destaque?.entregues > 0 ? destaque.nome : 'Nenhum'}</p>
                    </div>
                  </div>

                  <div className="mb-8 p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                    <h3 className="text-lg font-bold mb-4 text-white text-center">Comparativo de Entregas por Funcionário</h3>
                    <div className="flex justify-center">
                      <BarChart width={700} height={320} data={teamData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis dataKey="nome" stroke="#a1a1aa" fontSize={12} tickMargin={15} />
                        <YAxis stroke="#a1a1aa" fontSize={12} allowDecimals={false} />
                        <RechartsTooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }} />
                        <Legend verticalAlign="bottom" height={40} wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar dataKey="entregues" name="Entregas (Aprovadas)" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="atrasadas" name="Atrasos" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </div>
                  </div>

                  <div className="text-center text-xs text-zinc-600 mt-10 pt-4 border-t border-zinc-800">
                    Documento interno | Gerado automaticamente pelo sistema SenseOS em {new Date().toLocaleString('pt-BR')}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </motion.div>
  );
}
