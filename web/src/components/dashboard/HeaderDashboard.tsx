import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

import { Search, Calendar, Cloud, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlobalSearch } from '../GlobalSearch';
import { useNavigate } from 'react-router-dom';

interface HeaderDashboardProps {
  onCustomize: () => void;
}

export function HeaderDashboard({ onCustomize }: HeaderDashboardProps) {
  const { currentUser, tarefas } = useApp();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('Bom dia');
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState<{ temp: number, loading: boolean }>({ temp: 24, loading: true });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bom dia');
    else if (hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');

    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    
    // Fetch Weather
    fetch('https://api.open-meteo.com/v1/forecast?latitude=-23.5505&longitude=-46.6333&current_weather=true')
      .then(res => res.json())
      .then(data => {
        if (data.current_weather) {
          setWeather({ temp: Math.round(data.current_weather.temperature), loading: false });
        }
      })
      .catch(() => setWeather({ temp: 24, loading: false }));

    return () => clearInterval(timer);
  }, []);

  const diaSemana = currentTime.toLocaleDateString('pt-BR', { weekday: 'long' });
  const dia = currentTime.toLocaleDateString('pt-BR', { day: '2-digit' });
  const mes = currentTime.toLocaleDateString('pt-BR', { month: 'long' });
  const formattedToday = `${diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)}, ${dia} de ${mes}`;

  const nextMeeting = tarefas
    .filter(t => t.responsavel_id === currentUser?.id && t.setor === 'Reunião' && t.prazo && new Date(t.prazo) > new Date() && t.status !== 'Concluído' && t.status !== 'Cancelado')
    .sort((a, b) => new Date(a.prazo!).getTime() - new Date(b.prazo!).getTime())[0];

  return (
    <div className="w-full mb-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        
        {/* Saudação e Clima */}
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            {greeting}, {currentUser?.nome.split(' ')[0]} 👋
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm font-medium text-zinc-400">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Calendar className="w-4 h-4 text-blue-500" />
              {formattedToday}
            </span>
            <span className="w-1 h-1 rounded-full bg-zinc-700 hidden sm:block"></span>
            <span className="flex items-center gap-1.5">
              <Cloud className="w-4 h-4 text-emerald-500" />
              {weather.loading ? 'Carregando clima...' : `${weather.temp}°C em São Paulo`}
            </span>
            <span className="w-1 h-1 rounded-full bg-zinc-700 hidden sm:block"></span>
            <span className="flex items-center gap-1.5 text-amber-500">
              {nextMeeting ? `Próxima: ${nextMeeting.titulo.replace('Reunião: ', '')} às ${new Date(nextMeeting.prazo!).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}` : 'Sem reuniões agendadas hoje'}
            </span>
          </div>
        </div>

        {/* Barra de Pesquisa e Config */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div 
            onClick={() => setSearchOpen(true)}
            className="flex-1 md:w-64 h-11 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center px-4 text-zinc-400 cursor-text hover:border-zinc-700 hover:bg-zinc-800/50 transition-all shadow-inner"
          >
            <Search className="w-4 h-4 mr-2 text-zinc-500" />
            <span className="text-sm">Pesquisar tudo...</span>
            <kbd className="ml-auto text-[10px] font-bold px-2 py-1 rounded bg-zinc-800 text-zinc-500 border border-zinc-700/50">Ctrl K</kbd>
          </div>
          
          <Button variant="outline" className="h-11 w-11 rounded-2xl bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-400 p-0 relative shadow-sm">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2.5 right-3 w-2 h-2 rounded-full bg-red-500 border-2 border-zinc-900"></span>
          </Button>
          
          <Button onClick={onCustomize} variant="outline" className="h-11 rounded-2xl bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300 shadow-sm font-semibold flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Personalizar</span>
          </Button>
        </div>
      </div>

      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} onNavigate={(url) => navigate(url)} />
    </div>
  );
}
