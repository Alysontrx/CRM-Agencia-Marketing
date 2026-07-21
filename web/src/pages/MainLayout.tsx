import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, KanbanSquare, Users, TrendingUp, Settings, 
  LogOut, Bell, Plus, Search, MoreVertical, CheckCircle2, Clock, AlertCircle, PlayCircle, MessageSquare, X, DollarSign, Phone, Mail, FileText, Sparkles, Menu, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
import PlanejadorPage from './Planejador';
import EmployeeDashboard from './EmployeeDashboard';

import ClientePerfilPage from './ClientePerfil';
import SuporteAgenciaPage from './SuporteAgencia';
import ReunioesPage from './Reunioes';
import VideoMakerDashboard from './VideoMakerDashboard';
import SecretaryDashboard from './SecretaryDashboard';
import CalendarioPage from './Calendario';

export type Page = 'dashboard' | 'comercial' | 'kanban' | 'reunioes' | 'calendario' | 'clientes' | 'resultados' | 'equipe' | 'copilot' | 'conteudo' | 'planejador' | 'cliente-perfil' | 'suporte' | 'employee_dashboard' | 'video_maker_dashboard' | 'secretary_dashboard';

// ===== SIDEBAR =====
function SortableNavItem({ item, isActive, setPage }: { item: any; isActive: boolean; setPage: (p: Page) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };
  const Icon = item.icon;
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none w-full">
      <button 
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'}`} 
        onClick={() => setPage(item.id as Page)}
      >
        <Icon className={`w-4 h-4 ${isActive ? 'opacity-100' : 'opacity-70'}`} />
        {item.label}
        {item.badge && (
          <Badge variant={item.badgeColor === 'destructive' ? 'destructive' : 'default'} className="ml-auto text-[10px] px-1.5 py-0 rounded-full h-5 pointer-events-none">
            {item.badge}
          </Badge>
        )}
      </button>
    </div>
  );
}

function Sidebar({ page, setPage, isMobileOpen, setIsMobileOpen }: { page: Page; setPage: (p: Page) => void; isMobileOpen: boolean; setIsMobileOpen: (v: boolean) => void }) {
  const { currentUser, logout, tarefas, correcoes, updatePreferencias } = useApp();
  const atrasadas = tarefas.filter(t => t.status === 'Atrasado').length;
  const pendentes = correcoes.filter(c => c.status === 'Pendente').length;

  const f = currentUser?.funcao || '';
  const isAdmin = f === 'Administrador' || f === 'Gerente' || f === 'Admin';
  const isSecretaria = f === 'Secretária';
  const isComercial = f === 'Comercial';
  const isProdutor = ['Designer', 'Editor de Vídeo', 'Videomaker', 'Video Maker', 'Social Media', 'Desenvolvedor'].includes(f);
  const isFinanceiro = f === 'Financeiro';
  const isVideoMaker = ['Editor de Vídeo', 'Videomaker', 'Video Maker'].includes(f);

  const allNavItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', show: isAdmin },
    { id: 'comercial', icon: DollarSign, label: 'Comercial (Leads)', show: isAdmin || isComercial },
    { id: 'employee_dashboard', icon: LayoutDashboard, label: 'Meu Dashboard', badge: atrasadas || undefined, badgeColor: 'destructive', show: !isAdmin && !isVideoMaker && !isSecretaria },
    { id: 'secretary_dashboard', icon: LayoutDashboard, label: 'Central de Triagem', show: isSecretaria },
    { id: 'video_maker_dashboard', icon: LayoutDashboard, label: 'Meu Estúdio', show: isVideoMaker },
    { id: 'kanban', icon: KanbanSquare, label: isAdmin ? 'Tarefas' : 'Minhas Demandas', show: true },
    { id: 'reunioes', icon: Clock, label: 'Reuniões', show: true },
    { id: 'calendario', icon: Calendar, label: 'Calendário', show: true },
    { id: 'conteudo', icon: Sparkles, label: 'Conteúdo (IA)', show: isAdmin || isProdutor },
    { id: 'planejador', icon: Calendar, label: 'Planejador de Posts', show: isAdmin || isProdutor },
    { id: 'clientes', icon: Users, label: 'Clientes', show: isAdmin || isSecretaria || isComercial || isFinanceiro },
    { id: 'resultados', icon: TrendingUp, label: 'Antes × Depois', show: isAdmin },
    { id: 'copilot', icon: Sparkles, label: 'Copilot', show: isAdmin || isProdutor },
    { id: 'equipe', icon: Settings, label: 'Equipe', badge: pendentes || undefined, badgeColor: 'warning', show: isAdmin },
    { id: 'suporte', icon: MessageSquare, label: 'Suporte Técnico', show: true },
  ];

  const [navItems, setNavItems] = useState<any[]>([]);

  useEffect(() => {
    let items = allNavItems.filter(item => item.show);
    const savedOrder = currentUser?.preferencias?.sidebarLayout;
    if (savedOrder && Array.isArray(savedOrder)) {
      items.sort((a, b) => {
        const idxA = savedOrder.indexOf(a.id);
        const idxB = savedOrder.indexOf(b.id);
        if (idxA === -1 && idxB === -1) return 0;
        if (idxA === -1) return 1;
        if (idxB === -1) return -1;
        return idxA - idxB;
      });
    }
    setNavItems(items);
  }, [currentUser?.preferencias?.sidebarLayout, currentUser?.funcao, atrasadas, pendentes]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setNavItems((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        const newArray = arrayMove(items, oldIndex, newIndex);
        if (currentUser && updatePreferencias) {
          updatePreferencias({ sidebarLayout: newArray.map(i => i.id) });
        }
        return newArray;
      });
    }
  };

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
        fixed md:static inset-y-0 left-0 z-50 w-64 glass-panel border-r border-zinc-800 flex flex-col flex-shrink-0
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
      <div className="flex items-center justify-center p-5 min-h-[80px] border-b border-zinc-800/50">
        <img src="/logo.png" alt="Sense CRM" className="w-full max-w-[150px] h-auto object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity" />
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto">
        <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-2">Workspace</p>
        <nav className="flex flex-col gap-1">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={navItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
              {navItems.map(item => (
                <SortableNavItem key={item.id} item={item} isActive={page === item.id} setPage={setPage} />
              ))}
            </SortableContext>
          </DndContext>
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
  kanban: { title: 'Tarefas', subtitle: 'Acompanhe as tarefas de produção e entregas' },
  clientes: { title: 'Clientes', subtitle: 'Gerencie todos os clientes da agência' },
  resultados: { title: 'Antes × Depois', subtitle: 'Demonstre o impacto do seu trabalho com dados' },
  copilot: { title: 'Sense Copilot', subtitle: 'Seu assistente IA conectado aos dados da agência' },
  equipe: { title: 'Equipe', subtitle: 'Performance e tarefas dos colaboradores' },
  conteudo: { title: 'Estúdio de Conteúdo', subtitle: 'Fábrica de ideias, roteiros e legendas com IA' },
  planejador: { title: 'Planejador de Conteúdo', subtitle: 'Visualize e adiante posts organizados por mês' },
  'cliente-perfil': { title: 'Perfil do Cliente', subtitle: 'Visão 360 do cliente' },
  suporte: { title: 'Suporte Técnico', subtitle: 'Fale com a equipe de suporte da plataforma' },
  employee_dashboard: { title: 'Meu Dashboard', subtitle: 'Foco na sua execução de hoje' },
  video_maker_dashboard: { title: 'Estúdio de Produção', subtitle: 'Central de Audiovisual' },
  secretary_dashboard: { title: 'Central de Triagem', subtitle: 'Visão de atendimentos rápidos e agenda' },
  reunioes: { title: 'Reuniões', subtitle: 'Gerencie seus compromissos e videoconferências' },
  calendario: { title: 'Calendário Geral', subtitle: 'Agenda completa da agência' },
};

function Topbar({ page, onNewTask, onOpenSearch, onToggleMenu }: { page: Page; onNewTask: () => void; onOpenSearch: () => void; onToggleMenu: () => void }) {
  const { title, subtitle } = PAGE_TITLES[page];
  const { notificacoes, marcarNotificacaoLida } = useApp();
  const unreadCount = notificacoes.filter(n => !n.lida).length;
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="h-16 min-h-[64px] glass-panel border-b border-zinc-800/50 flex items-center justify-between px-4 md:px-6 z-40 sticky top-0">
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

        {['Administrador', 'Gerente', 'Admin'].includes(useApp().currentUser?.funcao || '') && (
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
    if (['Administrador', 'Gerente', 'Admin'].includes(currentUser.funcao)) return 'dashboard';
    if (['Editor de Vídeo', 'Videomaker', 'Video Maker'].includes(currentUser.funcao)) return 'video_maker_dashboard';
    if (currentUser.funcao === 'Secretária') return 'secretary_dashboard';
    return 'employee_dashboard';
  };

  const [page, setPage] = useState<Page>(getInitialPage());
  const [selectedClienteId, setSelectedClienteId] = useState<number | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [modalNovaTarefa, setModalNovaTarefa] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const [impersonation, setImpersonation] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('@atlas_impersonation');
    if (token) {
      setImpersonation(JSON.parse(token));
    }
  }, []);

  const handleExitImpersonation = () => {
    localStorage.removeItem('@atlas_impersonation');
    window.location.href = '/atlas-admin/agencias';
  };

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
          if (p !== 'cliente-perfil') setSelectedClienteId(null);
          setIsMobileOpen(false);
        }} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {impersonation && (
          <div className="bg-rose-600 text-white px-4 py-2 flex items-center justify-between z-50">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-bold">Você está acessando esta conta como Administrador da Plataforma Sense.</span>
            </div>
            <Button 
              size="sm" 
              onClick={handleExitImpersonation}
              className="bg-black/20 hover:bg-black/40 border border-white/20 text-white h-7 text-xs"
            >
              Voltar para o Painel da Sense
            </Button>
          </div>
        )}
        <Topbar page={page} onNewTask={() => setModalNovaTarefa(true)} onOpenSearch={() => setIsSearchOpen(true)} onToggleMenu={() => setIsMobileOpen(!isMobileOpen)} />
        <main className="flex-1 flex flex-col overflow-y-auto p-6 scroll-smooth bg-zinc-950">
          {page === 'dashboard' && <DashboardPage onNavigate={(p: string) => setPage(p as Page)} />}
          {page === 'employee_dashboard' && <EmployeeDashboard />}
          {page === 'video_maker_dashboard' && <VideoMakerDashboard />}
          {page === 'secretary_dashboard' && <SecretaryDashboard />}
          {page === 'comercial' && <ComercialPage />}
          {page === 'kanban' && <KanbanPage />}
          {page === 'reunioes' && <ReunioesPage />}
          {page === 'calendario' && <CalendarioPage />}
          {page === 'clientes' && <ClientesPage onNavigateToPerfil={(id) => { setSelectedClienteId(id); setPage('cliente-perfil'); }} />}
          {page === 'resultados' && <ResultadosPage />}
          {page === 'copilot' && <CopilotPage />}
          {page === 'equipe' && <EquipePage />}
          {page === 'conteudo' && <ConteudoPage />}
          {page === 'planejador' && <PlanejadorPage />}
          {page === 'cliente-perfil' && selectedClienteId && <ClientePerfilPage clienteId={selectedClienteId} onBack={() => { setPage('clientes'); setSelectedClienteId(null); }} />}
          {page === 'suporte' && <SuporteAgenciaPage />}
        </main>
      </div>

      {/* Global Modals */}
      <ModalNovaTarefa isOpen={modalNovaTarefa} onClose={() => setModalNovaTarefa(false)} />
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onNavigate={setPage} />
    </div>
  );
}
