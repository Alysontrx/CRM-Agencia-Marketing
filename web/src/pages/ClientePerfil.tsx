import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useReactToPrint } from 'react-to-print';
import { 
  ArrowLeft, Building2, User, Mail, Phone, MapPin, 
  Calendar, CreditCard, Tag, FileText, CheckCircle2, 
  Clock, AlertCircle, PlayCircle, FolderOpen, Sparkles, Plus, MoreVertical 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ModalNovoCliente } from '../components/Modals';
import { ModalExportarPDF } from '../components/ModalExportarPDF';
import { Download } from 'lucide-react';

interface ClientePerfilProps {
  clienteId: number;
  onBack: () => void;
}

export default function ClientePerfilPage({ clienteId, onBack }: ClientePerfilProps) {
  const { clientes, tarefas, users } = useApp();
  
  const cliente = clientes.find(c => c.id === clienteId);
  const [activeTab, setActiveTab] = useState('visao-geral');
  const [modalEdit, setModalEdit] = useState(false);
  const [modalExport, setModalExport] = useState(false);
  const [pdfPeriod, setPdfPeriod] = useState<{start: string, end: string} | null>(null);

  const pdfRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: pdfRef,
    documentTitle: cliente ? `Relatorio_${cliente.empresa || cliente.nome}` : 'Relatorio',
    onAfterPrint: () => {
      setPdfPeriod(null);
    }
  });

  React.useEffect(() => {
    if (pdfPeriod && pdfRef.current) {
      setTimeout(() => {
        handlePrint();
      }, 500);
    }
  }, [pdfPeriod, cliente]);

  if (!cliente) return <div className="text-zinc-500">Cliente não encontrado.</div>;

  const resp = users.find(u => u.id === cliente.responsavel_id);

  const TABS = [
    { id: 'visao-geral', label: 'Visão Geral' },
    { id: 'demandas', label: 'Demandas' },
    { id: 'projetos', label: 'Projetos' },
    { id: 'conteudo', label: 'Conteúdo' },
    { id: 'financeiro', label: 'Financeiro' },
    { id: 'arquivos', label: 'Arquivos' },
    { id: 'historico', label: 'Histórico' },
    { id: 'observacoes', label: 'Observações' },
    { id: 'ia', label: 'Copilot' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col min-h-0 space-y-6">
      
      {/* HEADER: Dashboard do Cliente */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <button onClick={onBack} className="mt-1 p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <Avatar className="w-16 h-16 border-2 border-zinc-800">
            <AvatarImage src={cliente.logo} />
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-2xl">
              {cliente.empresa?.[0] || cliente.nome[0]}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">{cliente.empresa || cliente.nome}</h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-zinc-400">
              <span className="flex items-center gap-1"><User className="w-4 h-4"/> {cliente.nome}</span>
              <span className="flex items-center gap-1"><Building2 className="w-4 h-4"/> {cliente.servico}</span>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">{cliente.status_geral || 'Ativo'}</Badge>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setModalExport(true)} variant="outline" className="border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800 hover:text-white">
            <Download className="w-4 h-4 mr-2" /> Exportar Relatório
          </Button>
          <Button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 hidden md:flex">
            <MoreVertical className="w-4 h-4" />
          </Button>
          <Button onClick={() => setModalEdit(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20">
            Editar Cliente
          </Button>
        </div>
      </div>

      {/* QUICK STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800/50 hover:bg-zinc-900 transition-colors">
          <CardContent className="p-4 flex flex-col justify-center items-center text-center">
            <span className="text-2xl font-bold text-emerald-400">R$ {cliente.mrr?.toLocaleString('pt-BR', {minimumFractionDigits:2}) || '0,00'}</span>
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mt-1">Receita Mensal</span>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50 hover:bg-zinc-900 transition-colors">
          <CardContent className="p-4 flex flex-col justify-center items-center text-center">
            <span className="text-2xl font-bold text-zinc-100">{tarefas.filter(t => t.cliente_id === cliente.id && t.status !== 'Aprovado').length}</span>
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mt-1">Demandas</span>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50 hover:bg-zinc-900 transition-colors">
          <CardContent className="p-4 flex flex-col justify-center items-center text-center">
            <span className="text-2xl font-bold text-rose-400">{tarefas.filter(t => t.cliente_id === cliente.id && t.status === 'Atrasado').length}</span>
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mt-1">Atrasadas</span>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50 hover:bg-zinc-900 transition-colors">
          <CardContent className="p-4 flex flex-col justify-center items-center text-center">
            <span className="text-2xl font-bold text-amber-400">{tarefas.filter(t => t.cliente_id === cliente.id && t.status === 'Aguardando revisão').length}</span>
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mt-1">Aprovações</span>
          </CardContent>
        </Card>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex overflow-x-auto border-b border-zinc-800 custom-scrollbar pb-px">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="flex-1 overflow-y-auto">
        
        {/* ABA 1: VISÃO GERAL */}
        {activeTab === 'visao-geral' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg text-zinc-100 flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-400"/> Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-zinc-500 block">Responsável</span><span className="text-zinc-200 font-medium">{resp?.nome || 'Não atribuído'}</span></div>
                  <div><span className="text-zinc-500 block">E-mail</span><span className="text-zinc-200">{cliente.email || '-'}</span></div>
                  <div><span className="text-zinc-500 block">Telefone</span><span className="text-zinc-200">{cliente.telefone || '-'}</span></div>
                  <div><span className="text-zinc-500 block">CPF/CNPJ</span><span className="text-zinc-200">{cliente.cpf_cnpj || '-'}</span></div>
                  <div><span className="text-zinc-500 block">Data de Início</span><span className="text-zinc-200">{cliente.data_inicio || '-'}</span></div>
                  <div><span className="text-zinc-500 block">Próxima Renovação</span><span className="text-zinc-200">{cliente.data_renovacao || '-'}</span></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg text-zinc-100 flex items-center gap-2"><Tag className="w-5 h-5 text-indigo-400"/> Organização</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="text-zinc-500 block mb-1">Segmento</span>
                    <Badge variant="secondary" className="bg-zinc-800">{cliente.nicho || cliente.segmento || 'Não definido'}</Badge>
                  </div>
                  <div>
                    <span className="text-zinc-500 block mb-1">Tags</span>
                    <div className="flex gap-2 flex-wrap">
                      {(cliente.tags || []).map(t => (
                        <Badge key={t} variant="outline" className="text-zinc-300 border-zinc-700">{t}</Badge>
                      ))}
                      {(!cliente.tags || cliente.tags.length === 0) && <span className="text-zinc-500">Sem tags</span>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ABA 2: DEMANDAS */}
        {activeTab === 'demandas' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-zinc-100">Demandas do Cliente</h2>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white"><Plus className="w-4 h-4 mr-2"/> Nova Demanda</Button>
            </div>
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[500px]">
                <thead className="bg-zinc-950/50 text-zinc-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Nome</th>
                    <th className="px-4 py-3 font-medium">Prioridade</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {tarefas.filter(t => t.cliente_id === cliente.id).map(t => (
                    <tr key={t.id} className="hover:bg-zinc-800/50">
                      <td className="px-4 py-3 text-zinc-200 font-medium">{t.titulo}</td>
                      <td className="px-4 py-3"><Badge variant="outline">{t.prioridade}</Badge></td>
                      <td className="px-4 py-3"><Badge>{t.status}</Badge></td>
                    </tr>
                  ))}
                  {tarefas.filter(t => t.cliente_id === cliente.id).length === 0 && (
                    <tr><td colSpan={3} className="px-4 py-8 text-center text-zinc-500">Nenhuma demanda aberta.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ABA 3: PROJETOS */}
        {activeTab === 'projetos' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-zinc-100">Projetos</h2>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white"><Plus className="w-4 h-4 mr-2"/> Novo Projeto</Button>
            </div>
            <div className="text-zinc-500 text-center py-10 bg-zinc-900 border border-zinc-800 rounded-xl">
              Nenhum projeto cadastrado.
            </div>
          </div>
        )}

        {/* ABA 4: CONTEÚDO */}
        {activeTab === 'conteudo' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-zinc-100">Conteúdos</h2>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white"><Plus className="w-4 h-4 mr-2"/> Novo Conteúdo</Button>
            </div>
            <div className="text-zinc-500 text-center py-10 bg-zinc-900 border border-zinc-800 rounded-xl">
              Nenhum conteúdo cadastrado.
            </div>
          </div>
        )}

        {/* ABA 5: FINANCEIRO */}
        {activeTab === 'financeiro' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-zinc-100">Histórico Financeiro</h2>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white"><Plus className="w-4 h-4 mr-2"/> Nova Cobrança</Button>
            </div>
            <div className="text-zinc-500 text-center py-10 bg-zinc-900 border border-zinc-800 rounded-xl">
              Nenhum registro financeiro.
            </div>
          </div>
        )}

        {/* ABA 6: ARQUIVOS */}
        {activeTab === 'arquivos' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-zinc-100">Arquivos do Cliente</h2>
              <Button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100"><FolderOpen className="w-4 h-4 mr-2"/> Upload</Button>
            </div>
            <div className="text-zinc-500 text-center py-10 bg-zinc-900 border border-zinc-800 rounded-xl">
              Nenhum arquivo disponível.
            </div>
          </div>
        )}

        {/* ABA 7: HISTÓRICO */}
        {activeTab === 'historico' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-zinc-100">Timeline</h2>
            <div className="text-zinc-500 text-center py-10 bg-zinc-900 border border-zinc-800 rounded-xl">
              Nenhum histórico registrado.
            </div>
          </div>
        )}

        {/* ABA 8: OBSERVAÇÕES */}
        {activeTab === 'observacoes' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-zinc-100">Observações Internas</h2>
            <textarea 
              className="w-full h-64 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Digite suas anotações aqui..."
              defaultValue={cliente.observacoes || ''}
            ></textarea>
            <div className="flex justify-end">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Salvar Observações</Button>
            </div>
          </div>
        )}

        {/* ABA 9: COPILOT */}
        {activeTab === 'ia' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-indigo-400" />
              <h2 className="text-lg font-bold text-zinc-100">Copilot para {cliente.empresa || cliente.nome}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-zinc-900 border-zinc-800 hover:border-indigo-500/50 transition-colors cursor-pointer group">
                <CardContent className="p-6">
                  <h3 className="font-bold text-zinc-100 group-hover:text-indigo-400 transition-colors">Resumo Executivo</h3>
                  <p className="text-sm text-zinc-400 mt-2">Gere um resumo do histórico e situação atual do cliente usando IA.</p>
                </CardContent>
              </Card>
              <Card className="bg-zinc-900 border-zinc-800 hover:border-indigo-500/50 transition-colors cursor-pointer group">
                <CardContent className="p-6">
                  <h3 className="font-bold text-zinc-100 group-hover:text-indigo-400 transition-colors">Gerar Ideias de Conteúdo</h3>
                  <p className="text-sm text-zinc-400 mt-2">Crie sugestões de posts baseados no nicho e serviço contratado.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      
      <ModalNovoCliente isOpen={modalEdit} onClose={() => setModalEdit(false)} editData={cliente} />
      <ModalExportarPDF 
        isOpen={modalExport} 
        onClose={() => setModalExport(false)} 
        title={`Exportar Relatório - ${cliente.empresa || cliente.nome}`}
        onExport={(start, end) => setPdfPeriod({start, end})}
      />

      {/* Hidden Div for PDF Generation */}
      {pdfPeriod && (
        <div style={{ display: 'none' }}>
          <div ref={pdfRef} id="pdf-content-cliente" className="p-8 bg-zinc-950 text-zinc-100">
            <div className="flex items-center gap-4 border-b border-zinc-800 pb-6 mb-6">
              <img src={cliente.logo || '/logo.png'} alt="Logo" className="w-16 h-16 object-contain" />
              <div>
                <h1 className="text-3xl font-bold">{cliente.empresa || cliente.nome}</h1>
                <p className="text-zinc-400">Relatório de Performance | {new Date(pdfPeriod.start).toLocaleDateString('pt-BR')} a {new Date(pdfPeriod.end).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                <h3 className="text-sm font-bold text-zinc-400 uppercase">Receita Gerada (MRR)</h3>
                <p className="text-2xl font-bold text-emerald-400 mt-2">R$ {cliente.mrr?.toLocaleString('pt-BR', {minimumFractionDigits:2}) || '0,00'}</p>
              </div>
              <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                <h3 className="text-sm font-bold text-zinc-400 uppercase">Demandas Concluídas</h3>
                <p className="text-2xl font-bold text-indigo-400 mt-2">
                  {tarefas.filter(t => t.cliente_id === cliente.id && t.status === 'Aprovado' && t.data_criacao >= pdfPeriod.start && t.data_criacao <= pdfPeriod.end).length}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4 border-b border-zinc-800 pb-2">Resumo das Demandas no Período</h3>
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400">
                    <th className="py-2">Título</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {tarefas.filter(t => t.cliente_id === cliente.id && t.data_criacao >= pdfPeriod.start && t.data_criacao <= pdfPeriod.end).map(t => (
                    <tr key={t.id} className="border-b border-zinc-800/50">
                      <td className="py-2">{t.titulo}</td>
                      <td className="py-2">{t.status}</td>
                      <td className="py-2">{new Date(t.data_criacao).toLocaleDateString('pt-BR')}</td>
                    </tr>
                  ))}
                  {tarefas.filter(t => t.cliente_id === cliente.id && t.data_criacao >= pdfPeriod.start && t.data_criacao <= pdfPeriod.end).length === 0 && (
                    <tr><td colSpan={3} className="py-4 text-center text-zinc-500">Nenhuma demanda registrada neste período.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="text-center text-xs text-zinc-600 mt-10 pt-4 border-t border-zinc-800">
              Relatório gerado automaticamente pelo sistema SenseOS em {new Date().toLocaleString('pt-BR')}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
