import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { askCopilot } from '../lib/ai';
import { Send, Bot, User, Sparkles, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function CopilotPage() {
  const { clientes, leads, tarefas, users } = useApp();
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('sense-copilot-history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erro ao ler histórico', e);
      }
    }
    return [
      {
        id: '1',
        role: 'assistant',
        content: 'Olá! Eu sou o Sense Copilot 🤖. Estou conectado aos dados da sua agência em tempo real. Como posso te ajudar hoje? \n\n*Dica: Você pode pedir para eu resumir os leads quentes, checar tarefas atrasadas ou até criar uma legenda para um post de um cliente.*'
      }
    ];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem('sense-copilot-history', JSON.stringify(messages));
  }, [messages, isLoading]);

  // Função para compilar o contexto atual da agência
  const generateContext = () => {
    const activeClients = clientes.length;
    const atrasados = clientes.filter(c => c.status_geral === 'atrasado').map(c => c.nome).join(', ');
    const activeLeads = leads.filter(l => l.status !== 'Fechado' && l.status !== 'Perdido').length;
    const tarefasAtrasadas = tarefas.filter(t => t.status === 'Atrasado').map(t => t.titulo).join(', ');
    
    return `
Resumo da Agência:
- Total de clientes: ${activeClients}
- Clientes com pagamento atrasado: ${atrasados || 'Nenhum'}
- Leads ativos no funil: ${activeLeads}
- Tarefas atrasadas da equipe: ${tarefasAtrasadas || 'Nenhuma'}

Lembre-se: Use essas informações APENAS se for relevante para a pergunta do usuário.
    `.trim();
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const savedInput = input.trim();
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: savedInput };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setErrorMsg(null);

    const history = messages.map(m => ({ role: m.role, content: m.content }));
    history.push({ role: 'user', content: userMessage.content });

    const contextData = generateContext();

    try {
      const response = await askCopilot(history, contextData);
      const assistantMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages(prev => prev.slice(0, -1)); // Remove a mensagem do usuário que falhou
      setInput(savedInput); // Devolve o texto pra caixa de digitação
      
      if (err.message && err.message.toLowerCase().includes('rate limit')) {
        setErrorMsg("⚠️ Copiloto Recarregando! Aguarde 1 minuto antes de enviar a próxima mensagem.");
      } else {
        setErrorMsg("⚠️ Falha na conexão. Tente novamente.");
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

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-zinc-950/50 rounded-2xl border border-zinc-800/50 overflow-hidden relative shadow-2xl">
      {/* Header */}
      <div className="h-16 border-b border-zinc-800/50 bg-zinc-900/80 backdrop-blur-sm flex items-center px-6 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-zinc-100 font-bold text-lg leading-tight">Sense Copilot</h2>
            <p className="text-zinc-400 text-xs">Sua IA integrada aos dados da agência</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm ${msg.role === 'user' ? 'bg-zinc-800 border border-zinc-700' : 'bg-gradient-to-br from-blue-500 to-purple-600'}`}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-zinc-300" /> : <Bot className="w-4 h-4 text-white" />}
            </div>
            
            {/* Bubble */}
            <div className={`p-4 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-zinc-800 text-zinc-200 rounded-tr-sm' : 'bg-zinc-900/80 border border-zinc-800/50 text-zinc-300 rounded-tl-sm'}`}>
              <div className="text-sm whitespace-pre-wrap leading-relaxed">
                {msg.content}
              </div>
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
              <span className="text-xs text-zinc-500 animate-pulse">O Copiloto está pensando...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-zinc-900/80 backdrop-blur-sm border-t border-zinc-800/50 shrink-0">
        {errorMsg && (
          <div className="max-w-4xl mx-auto mb-3 px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-medium rounded-lg flex items-center justify-between">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="hover:text-rose-300"><X className="w-3.5 h-3.5" /></button>
          </div>
        )}
        <div className="max-w-4xl mx-auto relative flex items-end gap-2 bg-zinc-950 border border-zinc-800 rounded-xl p-2 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all shadow-inner">
          <textarea
            className="w-full max-h-32 min-h-[44px] bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 resize-none outline-none py-3 px-3 custom-scrollbar"
            placeholder="Pergunte sobre seus clientes, tarefas ou peça ajuda para criar conteúdo..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <Button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="h-11 w-11 shrink-0 rounded-lg bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 disabled:hover:bg-blue-600 shadow-md"
          >
            <Send className="w-5 h-5 ml-1" />
          </Button>
        </div>
        <p className="text-center text-[10px] text-zinc-600 mt-3 font-medium">
          O Sense Copilot usa o Llama 3.1 e pode cometer erros. Verifique informações importantes.
        </p>
      </div>
    </div>
  );
}
