import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Search, X, Users, DollarSign, KanbanSquare, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: 'clientes' | 'comercial' | 'kanban') => void;
}

export function GlobalSearch({ isOpen, onClose, onNavigate }: GlobalSearchProps) {
  const { clientes, leads, tarefas } = useApp();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus on input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
    }
  }, [isOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const searchTerms = query.toLowerCase().trim().split(' ');

  const filteredClientes = query ? clientes.filter(c => 
    searchTerms.every(term => 
      c.nome.toLowerCase().includes(term) || 
      c.servico.toLowerCase().includes(term) ||
      c.segmento?.toLowerCase().includes(term)
    )
  ).slice(0, 5) : [];

  const filteredLeads = query ? leads.filter(l => 
    searchTerms.every(term => 
      l.empresa.toLowerCase().includes(term) || 
      l.contato.toLowerCase().includes(term)
    )
  ).slice(0, 5) : [];

  const filteredTarefas = query ? tarefas.filter(t => 
    searchTerms.every(term => 
      t.titulo.toLowerCase().includes(term) || 
      t.setor.toLowerCase().includes(term)
    )
  ).slice(0, 5) : [];

  const hasResults = filteredClientes.length > 0 || filteredLeads.length > 0 || filteredTarefas.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 sm:pt-32 px-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: -20 }} 
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Search Input Area */}
            <div className="relative flex items-center px-4 py-4 border-b border-zinc-800/80 bg-zinc-900/40">
              <Search className="w-5 h-5 text-zinc-400 absolute left-5" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Busque por clientes, leads ou tarefas..."
                className="w-full bg-transparent border-none text-zinc-100 placeholder:text-zinc-500 pl-10 pr-10 focus:outline-none focus:ring-0 text-lg"
              />
              <div className="absolute right-5 flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] text-zinc-500 border-zinc-800 uppercase hidden sm:flex">ESC</Badge>
                <button onClick={onClose} className="p-1 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/80 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
              {!query && (
                <div className="py-12 text-center text-zinc-500 flex flex-col items-center gap-3">
                  <Search className="w-8 h-8 text-zinc-800" />
                  <p className="text-sm">O que você está procurando?</p>
                </div>
              )}
              
              {query && !hasResults && (
                <div className="py-12 text-center text-zinc-500">
                  <p className="text-sm">Nenhum resultado encontrado para "{query}".</p>
                </div>
              )}

              {filteredClientes.length > 0 && (
                <div className="mb-4">
                  <div className="px-3 py-2 text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-3.5 h-3.5" /> Clientes
                  </div>
                  <div className="space-y-1">
                    {filteredClientes.map(c => (
                      <button 
                        key={c.id} 
                        onClick={() => { onNavigate('clientes'); onClose(); }}
                        className="w-full text-left flex items-center justify-between px-4 py-3 rounded-xl hover:bg-zinc-800/60 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold">
                            {c.nome[0]}
                          </div>
                          <div>
                            <p className="text-zinc-200 text-sm font-semibold group-hover:text-blue-400 transition-colors">{c.nome}</p>
                            <p className="text-zinc-500 text-xs">{c.servico}</p>
                            {c.segmento && <span className="ml-2 px-1.5 py-0.5 rounded-full bg-zinc-800 text-[10px]">{c.segmento}</span>}
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-zinc-900 border-zinc-700 text-zinc-400 text-[10px]">Ver Cliente</Badge>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredLeads.length > 0 && (
                <div className="mb-4">
                  <div className="px-3 py-2 text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5" /> Leads (Comercial)
                  </div>
                  <div className="space-y-1">
                    {filteredLeads.map(l => (
                      <button 
                        key={l.id} 
                        onClick={() => { onNavigate('comercial'); onClose(); }}
                        className="w-full text-left flex items-center justify-between px-4 py-3 rounded-xl hover:bg-zinc-800/60 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-zinc-200 text-sm font-semibold group-hover:text-emerald-400 transition-colors">{l.empresa}</p>
                            <p className="text-zinc-500 text-xs">{l.contato} • {l.status}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-zinc-900 border-zinc-700 text-zinc-400 text-[10px]">Ver Lead</Badge>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredTarefas.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                    <KanbanSquare className="w-3.5 h-3.5" /> Tarefas
                  </div>
                  <div className="space-y-1">
                    {filteredTarefas.map(t => {
                      const cli = clientes.find(c => c.id === t.cliente_id);
                      return (
                        <button 
                          key={t.id} 
                          onClick={() => { onNavigate('kanban'); onClose(); }}
                          className="w-full text-left flex items-center justify-between px-4 py-3 rounded-xl hover:bg-zinc-800/60 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold text-xs">
                              {t.status === 'A fazer' ? 'TD' : t.status === 'Em andamento' ? 'DO' : 'OK'}
                            </div>
                            <div>
                              <p className="text-zinc-200 text-sm font-semibold group-hover:text-purple-400 transition-colors">{t.titulo}</p>
                              <p className="text-zinc-500 text-xs">{cli?.nome || 'Sem cliente'} • {t.setor}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-zinc-900 border-zinc-700 text-zinc-400 text-[10px]">Ver Tarefa</Badge>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="px-4 py-2 border-t border-zinc-800 bg-zinc-900/30 flex items-center justify-between text-[11px] text-zinc-500">
              <div className="flex items-center gap-2">
                Navegue rapidamente pelos módulos.
              </div>
              <div>Copilot IA</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
