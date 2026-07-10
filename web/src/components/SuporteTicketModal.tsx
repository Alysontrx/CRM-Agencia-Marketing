import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, LifeBuoy, Send, Paperclip } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SuporteTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SuporteTicketModal({ isOpen, onClose }: SuporteTicketModalProps) {
  const { currentUser } = useApp();
  const [assunto, setAssunto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [prioridade, setPrioridade] = useState('Média');
  const [descricao, setDescricao] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular o envio de e-mail e salvamento
    setTimeout(() => {
      alert('Chamado enviado com sucesso para atlasupi@gmail.com!');
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-zinc-800/80 bg-zinc-900/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400">
              <LifeBuoy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Suporte Técnico</h2>
              <p className="text-sm text-zinc-400">Abra um chamado direto com a equipe ATLAS</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <form id="suporte-form" onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300">Assunto</label>
                <Input 
                  required
                  placeholder="Ex: Erro ao carregar página" 
                  value={assunto}
                  onChange={(e) => setAssunto(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300">Categoria</label>
                <select 
                  required
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm rounded-md px-3 h-11 focus:ring-1 focus:ring-blue-500 outline-none"
                >
                  <option value="">Selecione...</option>
                  <option value="Dúvida">Dúvida</option>
                  <option value="Erro/Bug">Erro / Bug</option>
                  <option value="Sugestão">Sugestão de Melhoria</option>
                  <option value="Financeiro">Financeiro</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-300">Prioridade</label>
              <div className="flex gap-3">
                {['Baixa', 'Média', 'Alta', 'Crítica'].map(p => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPrioridade(p)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                      prioridade === p 
                        ? p === 'Crítica' ? 'bg-red-500/20 border-red-500/50 text-red-400' 
                          : p === 'Alta' ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                          : p === 'Média' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                          : 'bg-zinc-700/50 border-zinc-500/50 text-zinc-200'
                        : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:bg-zinc-800'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-300">Descrição Detalhada</label>
              <textarea 
                required
                rows={5}
                placeholder="Descreva o problema com o máximo de detalhes possível..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm rounded-xl p-4 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-300">Anexos (Opcional)</label>
              <div className="border-2 border-dashed border-zinc-800 bg-zinc-900/50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-900 transition-colors">
                <Paperclip className="w-8 h-8 text-zinc-500 mb-3" />
                <p className="text-sm font-medium text-zinc-400 text-center">Clique ou arraste arquivos aqui</p>
                <p className="text-xs text-zinc-600 mt-1">Imagens, PDFs, Vídeos (Máx 50MB)</p>
              </div>
            </div>
            
          </form>
        </div>

        <div className="p-6 border-t border-zinc-800 bg-zinc-950 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose} className="text-zinc-400 hover:text-white">
            Cancelar
          </Button>
          <Button type="submit" form="suporte-form" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-6">
            {isSubmitting ? (
              <span className="animate-pulse">Enviando...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Enviar Chamado
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
