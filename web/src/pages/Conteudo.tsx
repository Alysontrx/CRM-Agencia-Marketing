import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { generateContentIdeas, generateScript } from '../lib/ai';
import { Sparkles, Plus, Loader2, Video, FileText, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ConteudoPage() {
  const { clientes, addTarefa, currentUser } = useApp();
  const [selectedClienteId, setSelectedClienteId] = useState<number | null>(null);
  
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [ideias, setIdeias] = useState<string[]>([]);
  const [customNicho, setCustomNicho] = useState('');
  
  const [selectedIdeia, setSelectedIdeia] = useState<string | null>(null);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [script, setScript] = useState<string | null>(null);

  const [sentToProd, setSentToProd] = useState(false);

  const handleGerarIdeias = async () => {
    if (!selectedClienteId) return;
    const cliente = clientes.find(c => c.id === selectedClienteId);
    if (!cliente) return;

    setIsGeneratingIdeas(true);
    setIdeias([]);
    setSelectedIdeia(null);
    setScript(null);
    setSentToProd(false);
    
    // Usa o nicho que o usuário digitou/confirmou no input
    const nichoFinal = customNicho.trim() || cliente.nicho || cliente.segmento || cliente.servico || 'Geral';
    
    const novasIdeias = await generateContentIdeas(nichoFinal, 5);
    setIdeias(novasIdeias);
    setIsGeneratingIdeas(false);
  };

  const handleSelectIdeia = async (ideia: string) => {
    if (!selectedClienteId) return;
    const cliente = clientes.find(c => c.id === selectedClienteId);
    if (!cliente) return;

    setSelectedIdeia(ideia);
    setIsGeneratingScript(true);
    setScript(null);
    setSentToProd(false);

    const nichoFinal = customNicho.trim() || cliente.nicho || cliente.segmento || cliente.servico || 'Geral';
    const novoRoteiro = await generateScript(nichoFinal, ideia);
    
    setScript(novoRoteiro);
    setIsGeneratingScript(false);
  };

  const handleSendToProduction = () => {
    if (!selectedClienteId || !selectedIdeia || !script || !currentUser) return;

    addTarefa({
      titulo: `Post: ${selectedIdeia.substring(0, 40)}...`,
      cliente_id: selectedClienteId,
      responsavel_id: currentUser.id,
      prioridade: 'Média',
      prazo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 dias
      setor: 'Design',
      status: 'A fazer'
    });

    setSentToProd(true);
    setTimeout(() => {
      setSelectedIdeia(null);
      setScript(null);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-500" />
            Estúdio de Conteúdo IA
          </h2>
          <p className="text-sm text-zinc-400 mt-1">Gere ideias, roteiros e legendas em segundos e envie para o Kanban.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lado Esquerdo: Clientes e Ideias */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-zinc-300">1. Selecione o Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <select 
                className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                value={selectedClienteId || ''}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setSelectedClienteId(id);
                  setIdeias([]);
                  setSelectedIdeia(null);
                  setScript(null);
                  
                  const c = clientes.find(client => client.id === id);
                  if (c) {
                    setCustomNicho(c.nicho || c.segmento || c.servico || '');
                  } else {
                    setCustomNicho('');
                  }
                }}
              >
                <option value="">Escolha um cliente...</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nome} ({c.segmento || c.nicho || c.servico})</option>
                ))}
              </select>

              {selectedClienteId && (
                <div className="mt-4 space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Nicho Alvo (Editável)
                  </label>
                  <input 
                    type="text" 
                    value={customNicho}
                    onChange={(e) => setCustomNicho(e.target.value)}
                    placeholder="Ex: T.I, Saúde, Imóveis de luxo..."
                    className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                  <p className="text-[10px] text-zinc-500">Isso direciona a criatividade da IA.</p>
                </div>
              )}

              <Button 
                onClick={handleGerarIdeias} 
                disabled={!selectedClienteId || isGeneratingIdeas}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isGeneratingIdeas ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Mapeando Nicho...</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" /> Gerar 5 Ideias Matadoras</>
                )}
              </Button>
            </CardContent>
          </Card>

          <AnimatePresence>
            {ideias.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <h3 className="text-sm font-semibold text-zinc-400 px-1 uppercase tracking-wider">2. Escolha uma Ideia</h3>
                {ideias.map((ideia, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectIdeia(ideia)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${selectedIdeia === ideia ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${selectedIdeia === ideia ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                        {idx + 1}
                      </div>
                      <p className={`text-sm font-medium leading-relaxed ${selectedIdeia === ideia ? 'text-blue-50' : 'text-zinc-300'}`}>
                        {ideia}
                      </p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Lado Direito: Roteiro e Legenda */}
        <div className="lg:col-span-2">
          {(!selectedIdeia && !isGeneratingScript) ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-zinc-800/50 rounded-2xl bg-zinc-900/20 text-zinc-500">
              <Video className="w-12 h-12 mb-3 text-zinc-700" />
              <p>Selecione uma ideia ao lado para expandi-la em um roteiro.</p>
            </div>
          ) : (
            <Card className="bg-zinc-900 border-zinc-800 h-full flex flex-col shadow-xl">
              <CardHeader className="border-b border-zinc-800/80 bg-zinc-900/50">
                <CardTitle className="text-base text-zinc-100 flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{selectedIdeia}</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6 flex-1 overflow-y-auto">
                {isGeneratingScript ? (
                  <div className="h-64 flex flex-col items-center justify-center text-blue-400 gap-4">
                    <Loader2 className="w-10 h-10 animate-spin" />
                    <p className="text-sm font-medium animate-pulse">A IA está escrevendo o roteiro e a legenda...</p>
                  </div>
                ) : (
                  <div className="prose prose-invert prose-blue max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800">
                    <div className="whitespace-pre-wrap text-sm text-zinc-300 font-medium">
                      {script}
                    </div>
                  </div>
                )}
              </CardContent>

              {script && (
                <div className="p-4 border-t border-zinc-800 bg-zinc-900 flex justify-end">
                  <Button 
                    onClick={handleSendToProduction} 
                    disabled={sentToProd}
                    className={`h-10 px-6 font-semibold ${sentToProd ? 'bg-emerald-600 hover:bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'} text-white shadow-lg transition-all`}
                  >
                    {sentToProd ? (
                      <><CheckCircle2 className="w-4 h-4 mr-2" /> Tarefa Criada no Kanban!</>
                    ) : (
                      <><Plus className="w-4 h-4 mr-2" /> Enviar para Produção (Kanban)</>
                    )}
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
