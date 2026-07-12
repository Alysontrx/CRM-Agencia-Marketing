import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { askCopilot } from '../lib/ai';
import { Send, Bot, User, Sparkles, Loader2, X, Paperclip, MessageSquare, FileText, Info, UploadCloud, Image as ImageIcon } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string; // para exibir a imagem enviada na bolha de chat
}

export default function CopilotPage() {
  const { clientes, leads, tarefas } = useApp();
  
  const [allChats, setAllChats] = useState<Record<string, Message[]>>(() => {
    const saved = localStorage.getItem('sense-copilot-chats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erro ao ler histórico', e);
      }
    }
    return {
      'geral': [
        {
          id: '1',
          role: 'assistant',
          content: 'Olá! Eu sou o Copilot Inteligente 🤖. Escolha um cliente na lateral ou converse comigo sobre a agência em geral!'
        }
      ]
    };
  });

  const [activeChatId, setActiveChatId] = useState<string>('geral');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Imagem anexada para a próxima mensagem
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Vocabulários (Arquivos txt) salvos por cliente
  const [allVocabs, setAllVocabs] = useState<Record<string, {name: string, content: string}>>(() => {
    const saved = localStorage.getItem('sense-copilot-vocabs');
    return saved ? JSON.parse(saved) : {};
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeMessages = allChats[activeChatId] || [];
  const fileContext = allVocabs[activeChatId] || null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem('sense-copilot-chats', JSON.stringify(allChats));
  }, [allChats, isLoading, activeChatId]);

  useEffect(() => {
    localStorage.setItem('sense-copilot-vocabs', JSON.stringify(allVocabs));
  }, [allVocabs]);

  const handleSelectClient = (clientId: string) => {
    setActiveChatId(clientId);
    setAttachedImage(null);
    if (!allChats[clientId]) {
      const clientName = clientId === 'geral' ? 'Agência Geral' : clientes.find(c => c.id.toString() === clientId)?.nome || 'Cliente';
      setAllChats(prev => ({
        ...prev,
        [clientId]: [{
          id: Date.now().toString(),
          role: 'assistant',
          content: `Chat exclusivo ativado para: **${clientName}**. \n\nDica: Lá no topo da tela, você pode fixar um arquivo .txt com o tom de voz do cliente. Depois disso, você pode anexar imagens (artes de post) aqui embaixo para eu criar as legendas perfeitas!`
        }]
      }));
    }
  };

  // Upload de Imagem (na barra de chat)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, envie apenas imagens (.jpg, .png).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setAttachedImage(base64);
    };
    reader.readAsDataURL(file);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  // Upload de Vocabulário txt (no topo)
  const handleVocabUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.txt') && !file.name.endsWith('.csv') && !file.name.endsWith('.md')) {
      alert('Por favor, envie apenas arquivos de texto simples (.txt, .csv, .md) para o vocabulário.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setAllVocabs(prev => ({
        ...prev,
        [activeChatId]: { name: file.name, content }
      }));
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const generateContext = () => {
    const activeClients = clientes.length;
    const atrasados = clientes.filter(c => c.status_geral === 'atrasado').map(c => c.nome).join(', ');
    const activeLeads = leads.filter(l => l.status !== 'Fechado' && l.status !== 'Perdido').length;
    
    return `
Resumo da Agência:
- Total de clientes: ${activeClients}
- Clientes com pagamento atrasado: ${atrasados || 'Nenhum'}
- Leads ativos no funil: ${activeLeads}
    `.trim();
  };

  const handleSend = async () => {
    if (!input.trim() && !attachedImage) return;
    if (isLoading) return;

    const savedInput = input.trim();
    const savedImage = attachedImage;
    
    const userMessage: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: savedInput || 'Por favor, analise a imagem em anexo.',
      image: savedImage || undefined
    };
    
    setAllChats(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), userMessage]
    }));
    
    setInput('');
    setAttachedImage(null);
    setIsLoading(true);
    setErrorMsg(null);

    // Filter history for AI (remove image key as it's not standard for history array, except the last one which askCopilot handles)
    const historyForAi = [...activeMessages, userMessage].map(m => ({ role: m.role, content: m.content }));
    const contextData = generateContext();
    const clientName = activeChatId === 'geral' ? undefined : clientes.find(c => c.id.toString() === activeChatId)?.nome;
    const currentVocabText = fileContext?.content;

    try {
      const response = await askCopilot(historyForAi, contextData, clientName, currentVocabText, savedImage || undefined);
      const assistantMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: response };
      
      setAllChats(prev => ({
        ...prev,
        [activeChatId]: [...prev[activeChatId], assistantMessage]
      }));
    } catch (err: any) {
      setAllChats(prev => ({
        ...prev,
        [activeChatId]: prev[activeChatId].slice(0, -1)
      }));
      setInput(savedInput);
      setAttachedImage(savedImage);
      
      if (err.message && err.message.toLowerCase().includes('rate limit')) {
        setErrorMsg("⚠️ Copiloto Recarregando! Aguarde alguns segundos.");
      } else {
        setErrorMsg(`⚠️ ERRO DA API: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const activeClientName = activeChatId === 'geral' ? 'Agência Geral' : clientes.find(c => c.id.toString() === activeChatId)?.nome || 'Cliente';

  return (
    <div className="flex h-[calc(100vh-120px)] bg-zinc-950/50 rounded-2xl border border-zinc-800/50 overflow-hidden relative shadow-2xl">
      
      {/* Sidebar - Client Threads */}
      <div className="w-64 border-r border-zinc-800/50 bg-zinc-900/50 flex flex-col hidden md:flex shrink-0">
        <div className="p-4 border-b border-zinc-800/50">
          <h3 className="text-zinc-100 font-semibold flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            Chats do Copiloto
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          <button
            onClick={() => handleSelectClient('geral')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${activeChatId === 'geral' ? 'bg-blue-600/20 text-blue-400 font-medium' : 'text-zinc-400 hover:bg-zinc-800'}`}
          >
            <Sparkles className="w-4 h-4" />
            Agência Geral
          </button>
          
          <div className="pt-4 pb-1 px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Clientes
          </div>
          
          {clientes.map(cliente => (
            <button
              key={cliente.id}
              onClick={() => handleSelectClient(cliente.id.toString())}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors truncate ${activeChatId === cliente.id.toString() ? 'bg-blue-600/20 text-blue-400 font-medium' : 'text-zinc-400 hover:bg-zinc-800'}`}
            >
              {cliente.nome}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="h-16 border-b border-zinc-800/50 bg-zinc-900/80 backdrop-blur-sm flex items-center px-6 shrink-0 z-10 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-zinc-100 font-bold text-lg leading-tight truncate">{activeClientName}</h2>
              <p className="text-zinc-400 text-xs">Copiloto de Criação Visual</p>
            </div>
          </div>
          
          {activeChatId !== 'geral' && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <User className="w-3.5 h-3.5" />
              Modo Persona Ativado
            </div>
          )}
        </div>

        {/* Vocab Settings Banner (Top) */}
        {activeChatId !== 'geral' && (
          <div className="bg-zinc-900/50 border-b border-zinc-800/50 px-6 py-3 flex items-center justify-between shadow-inner shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-zinc-800 p-2 rounded-lg">
                <FileText className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-zinc-200">Tom de Voz (Vocabulário)</h4>
                <p className="text-xs text-zinc-500">
                  {fileContext ? `Arquivo fixado: ${fileContext.name}` : 'Nenhum vocabulário fixado para este cliente.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="file" ref={fileInputRef} onChange={handleVocabUpload} accept=".txt,.csv,.md" className="hidden" />
              {fileContext ? (
                <button 
                  onClick={() => setAllVocabs(prev => { const n = {...prev}; delete n[activeChatId]; return n; })}
                  className="px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-400/10 rounded-md transition-colors border border-red-400/20"
                >
                  Remover
                </button>
              ) : (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors border border-zinc-700 flex items-center gap-1"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  Fixar Arquivo (.txt)
                </button>
              )}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar scroll-smooth">
          {activeMessages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 max-w-[90%] sm:max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm ${msg.role === 'user' ? 'bg-zinc-800 border border-zinc-700' : 'bg-gradient-to-br from-blue-500 to-purple-600'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-zinc-300" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              
              <div className={`p-4 rounded-2xl shadow-sm flex flex-col gap-3 ${msg.role === 'user' ? 'bg-zinc-800 text-zinc-200 rounded-tr-sm' : 'bg-zinc-900/80 border border-zinc-800/50 text-zinc-300 rounded-tl-sm'}`}>
                {msg.image && (
                  <img src={msg.image} alt="Anexo do usuário" className="max-w-[300px] max-h-[300px] object-contain rounded-lg border border-zinc-700" />
                )}
                {msg.content && (
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/50 text-zinc-300 rounded-tl-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                <span className="text-xs text-zinc-500 animate-pulse">Lendo imagem e gerando conteúdo...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-2" />
        </div>

        {/* Input Area */}
        <div className="p-4 sm:p-6 pt-2 bg-zinc-900/80 border-t border-zinc-800/50">
          
          {errorMsg && (
            <div className="mb-3 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20 flex items-center gap-2">
              <Info className="w-4 h-4" /> {errorMsg}
            </div>
          )}

          {/* Image Preview before send */}
          {attachedImage && (
            <div className="mb-3 flex items-start gap-3 bg-zinc-950 border border-zinc-800 p-2 rounded-lg inline-block relative">
              <button 
                onClick={() => setAttachedImage(null)} 
                className="absolute -top-2 -right-2 bg-zinc-800 border border-zinc-700 rounded-full p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
              <img src={attachedImage} alt="Preview" className="h-24 w-auto rounded border border-zinc-800 object-contain" />
              <div className="flex flex-col justify-center h-full pr-4 mt-2">
                <span className="text-xs text-zinc-400 font-medium flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" /> Imagem Anexada
                </span>
                <span className="text-[10px] text-zinc-500">Pronta para a IA analisar</span>
              </div>
            </div>
          )}

          <div className="relative flex items-end gap-2">
            <div className="relative flex-1 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all">
              
              <input 
                type="file" 
                ref={imageInputRef}
                onChange={handleImageUpload}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden" 
              />
              
              <button 
                onClick={() => imageInputRef.current?.click()}
                className="absolute left-3 bottom-3 p-1.5 text-zinc-400 hover:text-blue-400 transition-colors z-10 bg-zinc-900 rounded-md shadow-sm border border-zinc-800/50 flex items-center gap-1"
                title="Anexar Imagem da Arte (Para a IA ler)"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ex: Crie uma legenda magnética baseada nesta arte em anexo..."
                className="w-full bg-transparent text-zinc-100 placeholder:text-zinc-600 p-4 pl-14 min-h-[60px] max-h-[200px] resize-none focus:outline-none custom-scrollbar"
                rows={input.split('\n').length > 1 ? Math.min(input.split('\n').length, 5) : 1}
              />
            </div>

            <button
              onClick={handleSend}
              disabled={(!input.trim() && !attachedImage) || isLoading}
              className="h-[60px] px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.2)] transition-all flex items-center justify-center shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
