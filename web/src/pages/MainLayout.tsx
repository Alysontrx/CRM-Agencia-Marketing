import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, KanbanSquare, Users, TrendingUp, Settings, 
  LogOut, Bell, Plus, Search, MoreVertical, CheckCircle2, Clock, AlertCircle, PlayCircle, MessageSquare, X, DollarSign, Phone, Mail, FileText, Sparkles, Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModalNovaTarefa, ModalNovoCliente, ModalNovaMetrica, ModalNovoLead } from '../components/Modals';
import { GlobalSearch } from '../components/GlobalSearch';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

import DashboardPage from './Dashboard';
import ComercialPage from './Comercial';
import KanbanPage from './Kanban';
import ClientesPage from './Clientes';
import ResultadosPage from './Resultados';
import EquipePage from './Equipe';
import CopilotPage from './Copilot';
import ConteudoPage from './Conteudo';

type Page = 'dashboard' | 'comercial' | 'kanban' | 'clientes' | 'resultados' | 'equipe' | 'copilot' | 'conteudo';

// ===== SIDEBAR =====
function Sidebar({ page, setPage, isMobileOpen, setIsMobileOpen }: { page: Page; setPage: (p: Page) => void; isMobileOpen: boolean; setIsMobileOpen: (v: boolean) => void }) {
  const { currentUser, currentAgencia, logout, tarefas, correcoes } = useApp();
  const atrasadas = tarefas.filter(t => t.status === 'Atrasado').length;
  const pendentes = correcoes.filter(c => c.status === 'Pendente').length;

  const isAdmin = currentUser?.funcao === 'Admin' || currentUser?.funcao === 'Secretária';
  const isFuncionario = ['Designer', 'Social Media', 'Videomaker'].includes(currentUser?.funcao || '');
  const isCliente = currentUser?.funcao === 'Cliente';

  const allNavItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', show: isAdmin },
    { id: 'comercial', icon: DollarSign, label: 'Comercial (Leads)', show: isAdmin },
    { id: 'kanban', icon: KanbanSquare, label: 'Esteira', badge: atrasadas || undefined, badgeColor: 'destructive', show: isAdmin || isFuncionario },
    { id: 'conteudo', icon: Sparkles, label: 'Conteúdo (IA)', show: isAdmin || isFuncionario },
    { id: 'clientes', icon: Users, label: 'Clientes', show: isAdmin },
    { id: 'resultados', icon: TrendingUp, label: 'Antes × Depois', show: isAdmin || isCliente },
    { id: 'copilot', icon: Sparkles, label: 'Sense Copilot', show: isAdmin || isFuncionario },
    { id: 'equipe', icon: Settings, label: 'Equipe', badge: pendentes || undefined, badgeColor: 'warning', show: isAdmin || isFuncionario },
  ];

  const navItems = allNavItems.filter(item => item.show);

  return (
    <>
      {/* Overlay para fechar no Mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col flex-shrink-0
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
      <div className="flex items-center justify-center p-4 min-h-[64px] border-b border-zinc-800/50">
        <img 
          src={currentAgencia?.logo_url || '/logo.png'} 
          alt={currentAgencia?.nome || "Logo da Agência"} 
          className="w-full max-w-[200px] h-auto max-h-16 object-contain drop-shadow-md brightness-0 invert scale-125" 
        />
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto">
        <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-2">Workspace</p>
        <nav className="flex flex-col gap-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = page === item.id;
            return (
              <button 
                key={item.id} 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'}`} 
                onClick={() => setPage(item.id as Page)}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'opacity-100' : 'opacity-70'}`} />
                {item.label}
                {item.badge && (
                  <Badge variant={item.badgeColor === 'destructive' ? 'destructive' : 'default'} className="ml-auto text-[10px] px-1.5 py-0 rounded-full h-5">
                    {item.badge}
                  </Badge>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-zinc-800/50">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/50 transition-colors cursor-pointer">
          <Avatar className="h-9 w-9">
            <AvatarImage src={currentUser?.avatar} />
            <AvatarFallback className="bg-zinc-800 text-zinc-300">{currentUser?.nome[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-100 truncate">{currentUser?.nome}</p>
            <p className="text-[11px] text-zinc-500 truncate">{currentUser?.funcao}</p>
          </div>
          <button onClick={logout} className="text-zinc-500 hover:text-zinc-300 p-1" title="Sair">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}

// ===== TOPBAR =====
const PAGE_TITLES: Record<Page, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Visão geral da operação em tempo real' },
  comercial: { title: 'Pipeline Comercial', subtitle: 'Acompanhamento de novos leads e negociações' },
  kanban: { title: 'Esteira Operacional', subtitle: 'Gerencie o fluxo de produção com Drag & Drop' },
  clientes: { title: 'Clientes', subtitle: 'Gerencie todos os clientes da agência' },
  resultados: { title: 'Antes × Depois', subtitle: 'Demonstre o impacto do seu trabalho com dados' },
  copilot: { title: 'Sense Copilot', subtitle: 'Seu assistente IA conectado aos dados da agência' },
  equipe: { title: 'Equipe', subtitle: 'Performance e tarefas dos colaboradores' },
  conteudo: { title: 'Estúdio de Conteúdo', subtitle: 'Fábrica de ideias, roteiros e legendas com IA' },
};

function Topbar({ page, onNewTask, onOpenSearch, onToggleMenu }: { page: Page; onNewTask: () => void; onOpenSearch: () => void; onToggleMenu: () => void }) {
  const { title, subtitle } = PAGE_TITLES[page];
  const { notificacoes, marcarNotificacaoLida } = useApp();
  const unreadCount = notificacoes.filter(n => !n.lida).length;
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="h-16 min-h-[64px] bg-zinc-950 border-b border-zinc-800/50 flex items-center justify-between px-4 md:px-6 z-40 sticky top-0">
      <div className="flex items-center gap-3">
        <button className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-white transition-colors" onClick={onToggleMenu}>
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-zinc-100 leading-tight">{title}</h1>
          <p className="text-xs text-zinc-400 mt-0.5 hidden sm:block">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative w-64 hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <Input 
            readOnly
            onClick={onOpenSearch}
            placeholder="Buscar (Ctrl+K)..." 
            className="pl-9 h-9 bg-zinc-900 border-zinc-800 text-sm focus-visible:ring-1 focus-visible:ring-zinc-700 cursor-pointer" 
          />
        </div>
        
        {/* NOTIFICATIONS */}
        <div className="relative">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9 relative border-zinc-800 bg-zinc-900 hover:bg-zinc-800"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <Bell className="w-4 h-4 text-zinc-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-zinc-950">
                {unreadCount}
              </span>
            )}
          </Button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden z-50"
              >
                <div className="p-3 border-b border-zinc-800/50 flex justify-between items-center bg-zinc-900/80">
                  <span className="font-semibold text-zinc-200 text-sm">Notificações</span>
                  <Badge variant="secondary" className="bg-zinc-800 text-zinc-400">{unreadCount} novas</Badge>
                </div>
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                  {notificacoes.length === 0 ? (
                    <div className="p-6 text-center text-zinc-500 text-xs">Nenhuma notificação</div>
                  ) : (
                    notificacoes.map(n => (
                      <div 
                        key={n.id} 
                        className={`p-3 border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors cursor-pointer flex gap-3 ${!n.lida ? 'bg-zinc-800/20' : ''}`}
                        onClick={() => {
                          marcarNotificacaoLida(n.id);
                        }}
                      >
                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${n.tipo === 'alerta' ? 'bg-red-500' : n.tipo === 'sucesso' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                        <div>
                          <p className={`text-xs ${!n.lida ? 'text-zinc-200 font-medium' : 'text-zinc-400'}`}>{n.mensagem}</p>
                          <span className="text-[10px] text-zinc-600 block mt-1">{new Date(n.data_criacao).toLocaleString('pt-BR')}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {useApp().currentUser?.funcao !== 'Cliente' && (
          <Button onClick={onNewTask} className="h-9 bg-zinc-100 text-zinc-900 hover:bg-zinc-200">
            <Plus className="w-4 h-4 mr-1.5" />
            Nova Tarefa
          </Button>
        )}
      </div>
    </header>
  );
}


// ===== MAIN LAYOUT EXPORT =====
export default function MainLayout() {
  const { currentUser } = useApp();
  
  // Set initial page based on role
  const getInitialPage = (): Page => {
    if (!currentUser) return 'dashboard';
    if (['Admin', 'Secretária'].includes(currentUser.funcao)) return 'dashboard';
    if (currentUser.funcao === 'Cliente') return 'resultados';
    return 'kanban';
  };

  const [page, setPage] = useState<Page>(getInitialPage());
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [modalNovaTarefa, setModalNovaTarefa] = useState(false);
  const [modalNovoCliente, setModalNovoCliente] = useState(false);
  const [modalNovaMetrica, setModalNovaMetrica] = useState(false);
  const [modalNovoLead, setModalNovoLead] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex w-full h-screen overflow-hidden bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-zinc-800">
      <Sidebar 
        page={page} 
        setPage={(p) => {
          setPage(p);
          setIsMobileOpen(false);
        }} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Topbar page={page} onNewTask={() => setModalNovaTarefa(true)} onOpenSearch={() => setIsSearchOpen(true)} onToggleMenu={() => setIsMobileOpen(!isMobileOpen)} />
        <main className="flex-1 flex flex-col overflow-y-auto p-6 scroll-smooth">
          {page === 'dashboard' && <DashboardPage />}
          {page === 'comercial' && <ComercialPage />}
          {page === 'kanban' && <KanbanPage />}
          {page === 'clientes' && <ClientesPage />}
          {page === 'resultados' && <ResultadosPage />}
          {page === 'copilot' && <CopilotPage />}
          {page === 'equipe' && <EquipePage />}
          {page === 'conteudo' && <ConteudoPage />}
        </main>
      </div>

      {/* Global Modals */}
      <ModalNovaTarefa isOpen={modalNovaTarefa} onClose={() => setModalNovaTarefa(false)} />
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onNavigate={setPage} />
    </div>
  );
}
