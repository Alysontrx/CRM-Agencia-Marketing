import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, CheckCircle2, Loader2, List, Heading, AlertTriangle, Paperclip } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function SuporteAgenciaPage() {
  const { currentUser } = useApp();
  const [categoria, setCategoria] = useState('');
  const [assunto, setAssunto] = useState('');
  const [prioridade, setPrioridade] = useState('Média');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoria || !assunto || !descricao) return;

    setLoading(true);
    setStatus('idle');

    // Simula o envio (substituindo a API falha)
    setTimeout(() => {
      setStatus('success');
      setCategoria('');
      setAssunto('');
      setPrioridade('Média');
      setDescricao('');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-indigo-500" />
          Suporte Técnico
        </h1>
        <p className="text-zinc-400 mt-1">Envie uma mensagem direta para a nossa equipe de suporte. Responderemos o mais rápido possível.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
      >
        {status === 'success' ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-zinc-100 mb-2">Mensagem Enviada!</h2>
            <p className="text-zinc-400 mb-6">Nossa equipe recebeu sua solicitação e entrará em contato em breve.</p>
            <button
              onClick={() => setStatus('idle')}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-sm font-medium transition-colors"
            >
              Enviar nova mensagem
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {status === 'error' && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-medium">
                Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde.
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2"><List className="w-4 h-4 text-indigo-500" /> Categoria *</label>
              <select required value={categoria} onChange={e => setCategoria(e.target.value)} className="w-full h-11 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                <option value="">Selecione...</option>
                <option value="Dúvida">Dúvida Geral</option>
                <option value="Bug no Sistema">Erro/Bug no Sistema</option>
                <option value="Financeiro">Financeiro / Faturamento</option>
                <option value="Sugestão">Sugestão de Melhoria</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2"><Heading className="w-4 h-4 text-indigo-500" /> Assunto *</label>
              <input
                type="text"
                value={assunto}
                onChange={(e) => setAssunto(e.target.value)}
                required
                placeholder="Resumo do problema"
                className="w-full h-11 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-indigo-500" /> Prioridade *</label>
              <select required value={prioridade} onChange={e => setPrioridade(e.target.value)} className="w-full h-11 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
                <option value="Urgente">Urgente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-indigo-500" /> Descrição *</label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
                rows={5}
                maxLength={1000}
                placeholder="O que você estava fazendo?&#10;O que aconteceu?&#10;Qual resultado era esperado?&#10;Existe alguma mensagem de erro?"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
              />
              <div className="text-right text-xs text-zinc-500 mt-1">{descricao.length}/1000</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2"><Paperclip className="w-4 h-4 text-indigo-500" /> Anexar Arquivos (Opcional)</label>
              <input type="file" multiple accept=".png,.jpg,.jpeg,.pdf" className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700 text-sm text-zinc-400" />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {loading ? 'Enviando...' : 'Enviar Chamado'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
