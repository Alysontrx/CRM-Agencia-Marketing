import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';

import { HeaderDashboard } from '../components/dashboard/HeaderDashboard';
import { QuickActions } from '../components/dashboard/QuickActions';

// Widgets
import { WidgetKPIs } from '../components/dashboard/widgets/WidgetKPIs';
import { WidgetPrioridades } from '../components/dashboard/widgets/WidgetPrioridades';
import { WidgetAgenda } from '../components/dashboard/widgets/WidgetAgenda';
import { WidgetProjetos } from '../components/dashboard/widgets/WidgetProjetos';
import { WidgetEquipe } from '../components/dashboard/widgets/WidgetEquipe';
import { WidgetComercial } from '../components/dashboard/widgets/WidgetComercial';
import { WidgetFinanceiro } from '../components/dashboard/widgets/WidgetFinanceiro';
import { WidgetConteudo } from '../components/dashboard/widgets/WidgetConteudo';
import { WidgetIA } from '../components/dashboard/widgets/WidgetIA';
import { WidgetTimeline } from '../components/dashboard/widgets/WidgetTimeline';
import { WidgetSuporte } from '../components/dashboard/widgets/WidgetSuporte';
import { WidgetTarefasEquipe } from '../components/dashboard/widgets/WidgetTarefasEquipe';

import { 
  Modal,
  ModalNovoCliente, 
  ModalNovoLead, 
  ModalNovaTarefa, 
  ModalNovaReuniao, 
  ModalNovoProjeto 
} from '../components/Modals';

type WidgetId = 'kpis' | 'prioridades' | 'agenda' | 'projetos' | 'equipe' | 'tarefas_equipe' | 'comercial' | 'financeiro' | 'conteudo' | 'ia' | 'timeline' | 'suporte';

const WIDGETS_MAP: Record<WidgetId, React.FC<any>> = {
  'kpis': WidgetKPIs,
  'prioridades': WidgetPrioridades,
  'agenda': WidgetAgenda,
  'projetos': WidgetProjetos,
  'equipe': WidgetEquipe,
  'tarefas_equipe': WidgetTarefasEquipe,
  'comercial': WidgetComercial,
  'financeiro': WidgetFinanceiro,
  'conteudo': WidgetConteudo,
  'ia': WidgetIA,
  'timeline': WidgetTimeline,
  'suporte': WidgetSuporte
};

const WIDGETS_LABELS: Record<WidgetId, string> = {
  'kpis': 'Métricas Principais',
  'prioridades': 'Minhas Prioridades',
  'agenda': 'Agenda do Dia',
  'projetos': 'Projetos em Andamento',
  'equipe': 'Equipe & Capacidade',
  'tarefas_equipe': 'Tarefas da Equipe',
  'comercial': 'Funil Comercial',
  'financeiro': 'Resumo Financeiro',
  'conteudo': 'Hub de Conteúdo',
  'ia': 'Copilot IA',
  'timeline': 'Atividade Recente',
  'suporte': 'Suporte Técnico'
};

export default function DashboardPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { currentUser, updatePreferencias } = useApp();
  const [activeWidgets, setActiveWidgets] = useState<WidgetId[]>([]);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);

  // Modal States
  const [modalNovoCliente, setModalNovoCliente] = useState(false);
  const [modalNovoLead, setModalNovoLead] = useState(false);
  const [modalNovaDemanda, setModalNovaDemanda] = useState(false);
  const [modalNovaReuniao, setModalNovaReuniao] = useState(false);
  const [modalNovoProjeto, setModalNovoProjeto] = useState(false);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Define default widgets based on role
  useEffect(() => {
    if (!currentUser) return;
    
    // Check if there is a saved layout in preferences
    const savedLayout = currentUser.preferencias?.dashboardLayout;
    if (savedLayout && Array.isArray(savedLayout) && savedLayout.length > 0) {
      setActiveWidgets(savedLayout);
      return;
    }

    // Fallback: check old localStorage for backward compatibility
    const oldSavedLayout = localStorage.getItem(`@atlas_layout_${currentUser.id}`);
    if (oldSavedLayout) {
      try {
        const parsed = JSON.parse(oldSavedLayout);
        setActiveWidgets(parsed);
        // Save it to new preferences
        updatePreferencias({ dashboardLayout: parsed });
        localStorage.removeItem(`@atlas_layout_${currentUser.id}`);
        return;
      } catch (e) {
        console.error("Error parsing saved layout", e);
      }
    }

    // Default layouts per role
    const func = currentUser.funcao;
    let defaults: WidgetId[] = [];

    if (func === 'Admin' || func === 'Administrador' || func === 'Gerente') {
      defaults = ['kpis', 'financeiro', 'comercial', 'projetos', 'equipe', 'tarefas_equipe', 'timeline', 'ia', 'suporte'];
    } else if (func === 'Comercial') {
      defaults = ['kpis', 'comercial', 'agenda', 'prioridades', 'timeline', 'suporte'];
    } else if (func === 'Designer' || func === 'Editor de Vídeo') {
      defaults = ['kpis', 'prioridades', 'projetos', 'conteudo', 'ia', 'equipe', 'suporte'];
    } else if (func === 'Social Media') {
      defaults = ['kpis', 'conteudo', 'agenda', 'ia', 'prioridades', 'timeline', 'suporte'];
    } else if (func === 'Financeiro') {
      defaults = ['financeiro', 'agenda', 'prioridades', 'timeline', 'suporte'];
    } else if (func === 'Secretária') {
      defaults = ['agenda', 'prioridades', 'equipe', 'projetos', 'suporte'];
    } else {
      defaults = ['kpis', 'prioridades', 'agenda', 'projetos', 'suporte']; // generic fallback
    }

    setActiveWidgets(defaults);
  }, [currentUser]);

  // Handle Drag & Drop End
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setActiveWidgets((items) => {
        const oldIndex = items.indexOf(active.id as WidgetId);
        const newIndex = items.indexOf(over.id as WidgetId);
        const newArray = arrayMove(items, oldIndex, newIndex);
        if (currentUser) updatePreferencias({ dashboardLayout: newArray });
        return newArray;
      });
    }
  };

  // Toggle widget visibility
  const toggleWidget = (widgetId: WidgetId) => {
    setActiveWidgets(prev => {
      let newArray;
      if (prev.includes(widgetId)) {
        newArray = prev.filter(w => w !== widgetId);
      } else {
        newArray = [...prev, widgetId];
      }
      if (currentUser) updatePreferencias({ dashboardLayout: newArray });
      return newArray;
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="min-h-full pb-10 max-w-[1600px] mx-auto">
      
      {/* Top Section */}
      <HeaderDashboard onCustomize={() => setIsCustomizeModalOpen(true)} />
      <QuickActions onAction={(action) => {
        if (action === 'cliente') setModalNovoCliente(true);
        if (action === 'lead') setModalNovoLead(true);
        if (action === 'demanda') setModalNovaDemanda(true);
        if (action === 'reuniao') setModalNovaReuniao(true);
        if (action === 'projeto') setModalNovoProjeto(true);
        if (action === 'conteudo' && onNavigate) onNavigate('conteudo');
      }} />

      {/* Widgets Area with Drag and Drop */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={activeWidgets} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
            {activeWidgets.map((widgetId, idx) => {
              const WidgetComponent = WIDGETS_MAP[widgetId];
              if (!WidgetComponent) return null;
              
              // Determine if it should span multiple columns based on its ID
              const fullWidthIds = ['kpis', 'financeiro', 'projetos', 'equipe', 'tarefas_equipe', 'ia'];
              const isFullWidth = fullWidthIds.includes(widgetId);
              
              return (
                <motion.div 
                  key={widgetId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 + 0.1 }}
                  className={isFullWidth ? 'md:col-span-2 lg:col-span-3' : 'col-span-1'}
                >
                  <WidgetComponent 
                    onNavigate={onNavigate} 
                    onAddProjeto={widgetId === 'projetos' ? () => setModalNovoProjeto(true) : undefined}
                  />
                </motion.div>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      {/* Customization Modal */}
      <Modal isOpen={isCustomizeModalOpen} onClose={() => setIsCustomizeModalOpen(false)} title="Personalizar Painel">
        <div className="space-y-4">
          <p className="text-sm text-zinc-400 mb-4">Escolha quais módulos deseja exibir na sua tela inicial.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(Object.keys(WIDGETS_MAP) as WidgetId[]).map(widgetId => {
              const isActive = activeWidgets.includes(widgetId);
              return (
                <div 
                  key={widgetId} 
                  onClick={() => toggleWidget(widgetId)}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    isActive ? 'border-blue-500/50 bg-blue-500/10' : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center border ${isActive ? 'bg-blue-500 border-blue-500' : 'border-zinc-700 bg-zinc-800'}`}>
                    {isActive && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                  </div>
                  <span className={`text-sm font-medium ${isActive ? 'text-blue-400' : 'text-zinc-300'}`}>
                    {WIDGETS_LABELS[widgetId]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>

      {/* Modais de Ações Rápidas */}
      <ModalNovoCliente isOpen={modalNovoCliente} onClose={() => setModalNovoCliente(false)} />
      <ModalNovoLead isOpen={modalNovoLead} onClose={() => setModalNovoLead(false)} />
      <ModalNovaTarefa isOpen={modalNovaDemanda} onClose={() => setModalNovaDemanda(false)} />
      <ModalNovaReuniao isOpen={modalNovaReuniao} onClose={() => setModalNovaReuniao(false)} />
      <ModalNovoProjeto isOpen={modalNovoProjeto} onClose={() => setModalNovoProjeto(false)} />
    </motion.div>
  );
}
