import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, Video, MoreVertical, Trash2, Edit2, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ModalNovaReuniao } from '../components/Modals';

export default function ReunioesPage() {
  const { tarefas, clientes, deleteTarefa, currentUser } = useApp();
  const [modalNovaReuniao, setModalNovaReuniao] = useState(false);
  const isAdmin = currentUser?.funcao === 'Admin' || currentUser?.funcao === 'Administrador';

  // Filter reunioes
  const reunioes = tarefas.filter(t => t.setor === 'Reunião').sort((a, b) => {
    const dataA = new Date(a.prazo || 0).getTime();
    const dataB = new Date(b.prazo || 0).getTime();
    return dataA - dataB;
  });

  const now = new Date().getTime();
  
  const proximas = reunioes.filter(r => new Date(r.prazo || 0).getTime() >= now);
  const passadas = reunioes.filter(r => new Date(r.prazo || 0).getTime() < now).reverse();

  const renderCard = (reuniao: typeof tarefas[0]) => {
    const cliente = clientes.find(c => c.id === reuniao.cliente_id);
    const dateObj = new Date(reuniao.prazo || '');
    const dateStr = !isNaN(dateObj.getTime()) ? dateObj.toLocaleDateString('pt-BR') : 'Sem data';
    const timeStr = !isNaN(dateObj.getTime()) ? dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '';
    
    // Extract link if exists in title like: "Reunião: Título (https://link)"
    const match = reuniao.titulo.match(/\((https?:\/\/[^\)]+)\)/);
    const link = match ? match[1] : null;
    const cleanTitle = reuniao.titulo.replace(/\(https?:\/\/[^\)]+\)/, '').replace('Reunião: ', '').trim();

    return (
      <Card key={reuniao.id} className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-all rounded-xl relative overflow-hidden group">
        <div className="absolute inset-y-0 left-0 w-1 bg-blue-500 rounded-l-xl" />
        <CardContent className="p-5 ml-1">
          <div className="flex justify-between items-start mb-3">
            <div className="flex flex-col">
              <h3 className="font-semibold text-zinc-100 text-lg">{cleanTitle || 'Reunião'}</h3>
              <span className="text-zinc-400 text-sm">{cliente?.empresa || cliente?.nome || 'Cliente não encontrado'}</span>
            </div>
            {isAdmin && (
              <button onClick={() => {
                if (confirm('Deseja excluir esta reunião?')) {
                  deleteTarefa(reuniao.id);
                }
              }} className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-md transition-colors opacity-0 group-hover:opacity-100">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-zinc-300">
            <div className="flex items-center gap-1.5 bg-zinc-800/50 px-2.5 py-1 rounded-md">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>{dateStr}</span>
            </div>
            {timeStr && (
              <div className="flex items-center gap-1.5 bg-zinc-800/50 px-2.5 py-1 rounded-md">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>{timeStr}</span>
              </div>
            )}
          </div>

          {link && (
            <div className="mt-4 pt-4 border-t border-zinc-800/50">
              <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors w-max">
                <Video className="w-4 h-4" />
                Acessar Videoconferência
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pb-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Agenda & Reuniões</h1>
          <p className="text-zinc-400 text-sm mt-1">Gerencie as próximas reuniões com clientes e equipe.</p>
        </div>
        <button 
          onClick={() => setModalNovaReuniao(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all font-medium text-sm"
        >
          <Calendar className="w-4 h-4" />
          Agendar Reunião
        </button>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            Próximas Reuniões ({proximas.length})
          </h2>
          {proximas.length === 0 ? (
            <div className="text-center py-10 bg-zinc-900/30 border border-zinc-800/50 rounded-xl">
              <Calendar className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400">Nenhuma reunião agendada.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {proximas.map(renderCard)}
            </div>
          )}
        </div>

        {passadas.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-zinc-400 flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 bg-zinc-600 rounded-full" />
              Reuniões Passadas ({passadas.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-70">
              {passadas.map(renderCard)}
            </div>
          </div>
        )}
      </div>

      <ModalNovaReuniao isOpen={modalNovaReuniao} onClose={() => setModalNovaReuniao(false)} />
    </motion.div>
  );
}
