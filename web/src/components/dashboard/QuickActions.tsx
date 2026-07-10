import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Target, PlayCircle, FolderOpen, Calendar, Bot, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function QuickActions({ onAction }: { onAction?: (action: string) => void }) {
  const navigate = useNavigate();

  const actions = [
    { id: 'cliente', label: 'Novo Cliente', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10', hover: 'hover:bg-blue-500/20' },
    { id: 'lead', label: 'Novo Lead', icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-500/10', hover: 'hover:bg-emerald-500/20' },
    { id: 'demanda', label: 'Nova Demanda', icon: PlayCircle, color: 'text-purple-400', bg: 'bg-purple-500/10', hover: 'hover:bg-purple-500/20' },
    { id: 'projeto', label: 'Novo Projeto', icon: FolderOpen, color: 'text-amber-400', bg: 'bg-amber-500/10', hover: 'hover:bg-amber-500/20' },
    { id: 'reuniao', label: 'Nova Reunião', icon: Calendar, color: 'text-pink-400', bg: 'bg-pink-500/10', hover: 'hover:bg-pink-500/20' },
    { id: 'conteudo', label: 'Novo Conteúdo', icon: Share2, color: 'text-orange-400', bg: 'bg-orange-500/10', hover: 'hover:bg-orange-500/20' },
  ];

  const handleClick = (action: any) => {
    if (action.path) {
      navigate(action.path);
    } else if (onAction) {
      onAction(action.id);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {actions.map((action, idx) => {
        const Icon = action.icon;
        return (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => handleClick(action)}
            className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-sm transition-all duration-300 hover:-translate-y-0.5 ${action.hover}`}
          >
            <div className={`p-1.5 rounded-xl ${action.bg} ${action.color} transition-transform group-hover:scale-110`}>
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold text-zinc-300 group-hover:text-white">{action.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
