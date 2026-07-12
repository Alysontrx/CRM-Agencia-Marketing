import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Calendar as BigCalendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ModalNovaReuniao, ModalNovaTarefa, Modal } from '../components/Modals';
import { Calendar, CheckSquare, Video, ChevronLeft, ChevronRight, X, Edit2, Trash2, Clock, MapPin, AlignLeft } from 'lucide-react';

const locales = {
  'pt-BR': ptBR,
}
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CustomToolbar = (toolbar: any) => {
  const goToBack = () => toolbar.onNavigate('PREV');
  const goToNext = () => toolbar.onNavigate('NEXT');
  const goToCurrent = () => toolbar.onNavigate('TODAY');
  
  const label = toolbar.label; // e.g. "Julho de 2026"

  return (
    <div className="flex items-center justify-between mb-6 pt-2">
      <div className="flex items-center gap-4">
        <button 
          onClick={goToCurrent}
          className="px-4 py-1.5 border border-zinc-700 hover:bg-zinc-800 rounded-md text-sm font-medium text-zinc-300 transition-colors"
        >
          Hoje
        </button>
        <div className="flex items-center gap-1">
          <button onClick={goToBack} className="p-1.5 hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={goToNext} className="p-1.5 hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <h2 className="text-xl sm:text-2xl font-medium text-zinc-100 min-w-[150px] capitalize">
          {label}
        </h2>
      </div>
      
      <div className="hidden sm:flex items-center bg-zinc-900 border border-zinc-800 rounded-md overflow-hidden p-0.5">
        {['month', 'week', 'day'].map((v) => (
          <button
            key={v}
            onClick={() => toolbar.onView(v)}
            className={`px-3 py-1.5 text-sm font-medium rounded-sm transition-colors ${
              toolbar.view === v 
                ? 'bg-zinc-800 text-zinc-100 shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            {v === 'month' ? 'Mês' : v === 'week' ? 'Semana' : 'Dia'}
          </button>
        ))}
      </div>
    </div>
  );
};

const CustomMonthEvent = ({ event }: any) => {
  const tarefa = event.resource || {};
  
  let dotColor = '#3b82f6';
  if (tarefa.setor === 'Reunião') dotColor = '#ef4444';
  else if (tarefa.setor === 'Design' || tarefa.setor === 'Criação') dotColor = '#10b981';
  else if (tarefa.setor === 'Marketing' || tarefa.setor === 'Tráfego') dotColor = '#f59e0b';
  else dotColor = '#8b5cf6';
  
  if (tarefa.status === 'Aprovado' || tarefa.status === 'Fechado' || tarefa.status === 'Feito') {
    dotColor = '#059669';
  }

  const time = new Date(event.start).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex items-center gap-1.5 px-1 py-0.5 overflow-hidden text-xs w-full">
      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: dotColor }} />
      <span className="font-medium text-zinc-400 flex-shrink-0">{time}</span>
      <span className="truncate text-zinc-300 font-medium">{event.title}</span>
    </div>
  );
};

const CustomDateHeader = ({ label, date, isOffRange }: any) => {
  const isToday = isSameDay(date, new Date());

  return (
    <div className="flex justify-center p-1.5">
      <div className={`
        w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold
        ${isToday ? 'bg-blue-600 text-white shadow-sm' : isOffRange ? 'text-zinc-600' : 'text-zinc-300 hover:bg-zinc-800'}
      `}>
        {label}
      </div>
    </div>
  );
};

export default function CalendarioPage() {
  const { tarefas, addTarefa, currentUser } = useApp();

  const [modalNovaReuniao, setModalNovaReuniao] = useState(false);
  const [modalNovaTarefa, setModalNovaTarefa] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showSelector, setShowSelector] = useState(false);
  const [fastCreateTab, setFastCreateTab] = useState<'evento' | 'tarefa'>('evento');
  const [selectedEventData, setSelectedEventData] = useState<any>(null);
  
  const [popoverTitle, setPopoverTitle] = useState('');
  const [popoverTime, setPopoverTime] = useState('');

  // Mapping all tasks/meetings to calendar events
  const [googleEvents, setGoogleEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchGoogleEvents = async () => {
      const token = localStorage.getItem('@crm_google_token');
      if (!token) return;
      try {
        const calendarId = import.meta.env.VITE_GOOGLE_CALENDAR_ID || 'primary';
        const timeMin = new Date();
        timeMin.setMonth(timeMin.getMonth() - 2);
        const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?timeMin=${timeMin.toISOString()}&maxResults=250&singleEvents=true&orderBy=startTime`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.items) {
          const gEvents = data.items
            .map((item: any) => {
              const startStr = item.start?.dateTime || item.start?.date;
              const endStr = item.end?.dateTime || item.end?.date;
              
              const start = startStr ? new Date(startStr) : new Date(NaN);
              const end = endStr ? new Date(endStr) : new Date(NaN);

              return {
                id: item.id,
                title: item.summary || 'Sem Título (Google)',
                start,
                end,
                resource: { 
                  setor: 'Google', 
                  status: 'Google', 
                  titulo: item.summary || 'Sem Título', 
                  link: item.htmlLink,
                  descricao: item.description 
                }
              };
            })
            .filter((event: any) => !isNaN(event.start.getTime()) && !isNaN(event.end.getTime())); // Filter out invalid dates
            
          setGoogleEvents(gEvents);
        }
      } catch (err) {
        console.error('Erro ao sincronizar Google Calendar', err);
      }
    };
    fetchGoogleEvents();
  }, []);

  const calendarEvents = [
    ...tarefas
      .filter(t => t.prazo && !isNaN(new Date(t.prazo).getTime())) // only tasks with valid deadlines
      .map(t => {
        const start = new Date(t.prazo!);
        const end = new Date(start);
        // Meetings = 1 hour, normal tasks = 30 minutes
        if (t.setor === 'Reunião') {
          end.setHours(end.getHours() + 1);
        } else {
          end.setMinutes(end.getMinutes() + 30);
        }
        return {
          id: t.id,
          title: t.titulo || 'Sem título',
          start,
          end,
          resource: t
        };
      }),
    ...googleEvents
  ];

  const eventStyleGetter = (event: any) => {
    const tarefa = event.resource || {};
    let backgroundColor = '#3b82f6'; // blue for general
    if (tarefa.setor === 'Google') backgroundColor = '#4285F4'; // Google Blue
    else if (tarefa.setor === 'Reunião') backgroundColor = '#ef4444'; // RED for meetings
    else if (tarefa.setor === 'Design' || tarefa.setor === 'Criação') backgroundColor = '#10b981'; // Green for design
    else if (tarefa.setor === 'Marketing' || tarefa.setor === 'Tráfego') backgroundColor = '#f59e0b'; // Orange for marketing
    else backgroundColor = '#8b5cf6'; // Purple for tasks default

    if (tarefa.status === 'Aprovado' || tarefa.status === 'Fechado' || tarefa.status === 'Feito') {
      backgroundColor = '#059669'; // darker green when done
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        color: 'white',
        border: '0px',
        display: 'block'
      },
      className: 'custom-rbc-event' // to allow css targeting
    };
  };

  const handleSelectSlot = (slotInfo: any) => {
    setSelectedDate(slotInfo.start);
    setShowSelector(true);
    setPopoverTitle('');
    setPopoverTime('');
  };

  const handleSelectEvent = (event: any) => {
    setSelectedEventData(event);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pb-4 h-full flex flex-col max-w-[1600px] mx-auto w-full space-y-4">
      <div className="flex-none">
        <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-500" />
          Calendário Geral
        </h1>
        <p className="text-zinc-400 text-sm mt-1">Gerencie todas as reuniões e prazos de tarefas da agência.</p>
      </div>

      <div className="flex-1 glass-panel p-2 sm:p-5 rounded-xl custom-calendar-wrapper min-h-[600px] flex flex-col">
        <BigCalendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          culture="pt-BR"
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          components={{
            toolbar: CustomToolbar,
            month: {
              dateHeader: CustomDateHeader,
              event: CustomMonthEvent
            }
          }}
          defaultView={Views.MONTH}
          views={['month', 'week', 'day', 'agenda']}
          messages={{
            next: "Próximo",
            previous: "Anterior",
            today: "Hoje",
            month: "Mês",
            week: "Semana",
            day: "Dia",
            agenda: "Agenda",
            noEventsInRange: "Nenhum evento neste período."
          }}
        />
      </div>

      <ModalNovaReuniao 
        isOpen={modalNovaReuniao} 
        onClose={() => { setModalNovaReuniao(false); setSelectedDate(undefined); }} 
        initialDate={selectedDate}
      />
      
      <ModalNovaTarefa 
        isOpen={modalNovaTarefa} 
        onClose={() => { setModalNovaTarefa(false); setSelectedDate(undefined); }} 
        initialDate={selectedDate}
      />

      {/* Google-like Selector Modal */}
      {showSelector && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-[450px] overflow-hidden"
          >
            <div className="flex justify-end p-2 pb-0">
              <button onClick={() => setShowSelector(false)} className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 pb-6 pt-2 space-y-5">
              <input 
                type="text" 
                placeholder="Adicionar título" 
                value={popoverTitle}
                onChange={e => setPopoverTitle(e.target.value)}
                autoFocus
                className="w-full bg-transparent text-2xl font-medium text-white border-b-2 border-blue-500 pb-2 focus:outline-none placeholder:text-zinc-500"
              />
              <div className="flex gap-2">
                <button 
                  onClick={() => setFastCreateTab('evento')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${fastCreateTab === 'evento' ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400 hover:bg-zinc-800'}`}
                >
                  Evento
                </button>
                <button 
                  onClick={() => setFastCreateTab('tarefa')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${fastCreateTab === 'tarefa' ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400 hover:bg-zinc-800'}`}
                >
                  Tarefa
                </button>
              </div>

              <div className="flex items-center gap-4 text-zinc-300 text-sm mt-4">
                <Calendar className="w-5 h-5 text-zinc-400" />
                <span>
                  {selectedDate?.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
                <input 
                  type="time" 
                  value={popoverTime}
                  onChange={e => setPopoverTime(e.target.value)}
                  className="bg-zinc-800 text-white px-2 py-1 rounded border border-zinc-700 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-6 flex justify-between items-center">
                <button 
                  onClick={() => {
                    setShowSelector(false);
                    fastCreateTab === 'evento' ? setModalNovaReuniao(true) : setModalNovaTarefa(true);
                  }}
                  className="text-blue-500 text-sm font-medium hover:text-blue-400 px-2 py-1 rounded hover:bg-blue-500/10 transition-colors"
                >
                  Mais opções
                </button>
                <button 
                  onClick={() => {
                    if (!popoverTitle) return;
                    let finalPrazo = '';
                    if (selectedDate) {
                      const time = popoverTime || '09:00';
                      const [horas, minutos] = time.split(':');
                      const dataLocal = new Date(
                        selectedDate.getFullYear(),
                        selectedDate.getMonth(),
                        selectedDate.getDate(),
                        parseInt(horas),
                        parseInt(minutos)
                      );
                      finalPrazo = dataLocal.toISOString();
                    }
                    
                    const eventTitle = fastCreateTab === 'evento' ? `Reunião: ${popoverTitle}` : popoverTitle;
                    addTarefa({
                      titulo: eventTitle,
                      cliente_id: undefined,
                      responsavel_id: currentUser?.id || 1,
                      setor: fastCreateTab === 'evento' ? 'Reunião' : 'Geral',
                      prioridade: 'Média',
                      prazo: finalPrazo || undefined,
                      status: 'A fazer'
                    });

                    // Sync to Google
                    if (finalPrazo) {
                      const token = localStorage.getItem('@crm_google_token');
                      const calendarId = import.meta.env.VITE_GOOGLE_CALENDAR_ID || 'primary';
                      if (token) {
                        const start = new Date(finalPrazo);
                        const end = new Date(start.getTime() + (fastCreateTab === 'evento' ? 60*60*1000 : 30*60*1000));
                        fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`, {
                          method: 'POST',
                          headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({
                            summary: eventTitle,
                            start: { dateTime: start.toISOString() },
                            end: { dateTime: end.toISOString() }
                          })
                        }).catch(err => console.error(err));
                      }
                    }

                    setShowSelector(false);
                    setPopoverTitle('');
                    setPopoverTime('');
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full font-medium transition-colors shadow-md"
                >
                  Salvar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Event Details Popover */}
      {selectedEventData && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-[400px] overflow-hidden"
          >
            <div className="flex justify-between items-center p-3 pb-0">
              <div className="flex gap-1">
                 <button 
                  onClick={() => {
                     // Can hook up to actual edit in the future
                     setSelectedEventData(null);
                     // Here we could open the edit modal, but for now just close
                  }} 
                  className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-full transition-colors"
                  title="Editar"
                 > 
                   <Edit2 className="w-4 h-4" /> 
                 </button>
              </div>
              <button onClick={() => setSelectedEventData(null)} className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 pt-3 space-y-5">
              <div className="flex gap-4">
                 <div 
                   className="w-4 h-4 rounded-sm mt-1.5 flex-shrink-0" 
                   style={{ 
                     backgroundColor: selectedEventData.resource.setor === 'Reunião' ? '#ef4444' : 
                                      selectedEventData.resource.setor === 'Design' ? '#10b981' : 
                                      selectedEventData.resource.setor === 'Marketing' ? '#f59e0b' : '#8b5cf6' 
                   }} 
                 /> 
                 <div>
                   <h2 className="text-xl font-medium text-white leading-tight">{selectedEventData.title}</h2>
                   <div className="text-sm text-zinc-400 mt-2 space-y-2">
                     <p className="flex items-center gap-2">
                       {selectedEventData.start.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                     </p>
                     <p className="flex items-center gap-2">
                       <Clock className="w-4 h-4" />
                       {selectedEventData.start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - {selectedEventData.end.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                     </p>
                     <p className="flex items-center gap-2">
                       <AlignLeft className="w-4 h-4" />
                       Setor: {selectedEventData.resource.setor || 'Geral'}
                     </p>
                     <p className="flex items-center gap-2">
                       <CheckSquare className="w-4 h-4" />
                       Status: {selectedEventData.resource.status || 'Pendente'}
                     </p>
                   </div>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </motion.div>
  );
}
