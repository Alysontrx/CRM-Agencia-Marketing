import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, PlayCircle, Calendar, ChevronDown, Video, CheckCircle2, AlertCircle, Play, UploadCloud, X, Link } from 'lucide-react';
import type { TarefaData } from '../../data/types';
import { useApp } from '../../context/AppContext';

export default function VideoKanban() {
  const { tarefas, clientes, currentUser, updateTarefa } = useApp();
  const [entregaModal, setEntregaModal] = React.useState<{open: boolean, taskId: number | null}>({open: false, taskId: null});
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const myTasks = tarefas.filter(t => t.responsavel_id === currentUser?.id);

  const correcoes = myTasks.filter(t => t.status === 'Atrasado'); // Mockado como Correção
  const filaParaFazer = myTasks.filter(t => t.status === 'A fazer');
  const emAndamento = myTasks.filter(t => !['A fazer', 'Atrasado', 'Feito', 'Aprovado', 'Aguardando revisão'].includes(t.status as string));
  const aguardando = myTasks.filter(t => t.status === 'Aguardando revisão');
  const concluidos = myTasks.filter(t => t.status === 'Feito' || t.status === 'Aprovado');

  const getStatusColor = (status: string) => {
    if (status === 'A fazer') return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    if (status === 'Atrasado') return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    if (status === 'Aguardando revisão') return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    if (status === 'Feito' || status === 'Aprovado') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    return 'bg-blue-500/10 text-blue-400 border-blue-500/30'; // Em andamento genérico
  };

  const colunas = [
    'Recebidos', 'Preparação', 'Editando', 'Color', 'Áudio', 'Renderizando', 'Em Aprovação', 'Correções', 'Concluído'
  ];

  const renderCard = (tarefa: TarefaData) => {
    const cliente = clientes.find(c => c.id === tarefa.cliente_id);
    const isUrgente = tarefa.prioridade === 'Urgente' || tarefa.prioridade === 'Alta';
    
    let visualStatus = tarefa.status;
    if (tarefa.status === 'A fazer') visualStatus = 'Recebidos';
    if (tarefa.status === 'Aguardando revisão') visualStatus = 'Em Aprovação';
    if (tarefa.status === 'Feito' || tarefa.status === 'Aprovado') visualStatus = 'Concluído';
    if (tarefa.status === 'Atrasado') visualStatus = 'Correções';

    return (
      <div key={tarefa.id} className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 hover:border-indigo-500/50 transition-all shadow-lg flex flex-col gap-4 relative overflow-hidden group">
        
        {/* Urgent Bar */}
        {isUrgente && <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />}
        {!isUrgente && <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500/50" />}

        {/* HEADER do Card */}
        <div className="flex justify-between items-start pt-1">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{cliente?.nome || 'Agência'}</p>
            <h3 className="text-zinc-100 font-bold text-base leading-tight line-clamp-2 pr-4">{tarefa.titulo}</h3>
          </div>
        </div>

        {/* METADATA do Card */}
        <div className="flex items-center gap-3 text-xs font-medium mt-auto">
          <Badge variant="outline" className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${isUrgente ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
            {isUrgente ? 'Prioridade' : 'Normal'}
          </Badge>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>Prazo: {tarefa.prazo ? new Date(tarefa.prazo).toLocaleDateString('pt-BR', {day: '2-digit', month: 'short'}) : '--'}</span>
          </div>
        </div>

        <div className="w-full h-px bg-zinc-800/60 my-1" />

        {/* AÇÕES E STATUS do Card */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <select 
              className={`w-full appearance-none text-xs font-bold rounded-lg pl-3 pr-8 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer border ${getStatusColor(tarefa.status)}`}
              value={visualStatus}
              onChange={(e) => {
                let newStatus = e.target.value;
                if (newStatus === 'Recebidos') newStatus = 'A fazer';
                if (newStatus === 'Em Aprovação') newStatus = 'Aguardando revisão';
                if (newStatus === 'Concluído') newStatus = 'Feito';
                if (newStatus === 'Correções') newStatus = 'Atrasado';
                updateTarefa(tarefa.id, { status: newStatus as any });
              }}
            >
              {colunas.map(col => <option key={col} value={col}>{col}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none" />
          </div>

          <button 
            onClick={() => {
              if (visualStatus === 'Recebidos' || visualStatus === 'A fazer') {
                updateTarefa(tarefa.id, { status: 'Em andamento' });
              } else if (visualStatus === 'Aguardando revisão' || visualStatus === 'Concluído') {
                alert('Este projeto já foi entregue.');
              } else {
                // Abrir modal de entrega
                setEntregaModal({ open: true, taskId: tarefa.id });
                setSelectedFile(null);
                setIsUploading(false);
              }
            }}
            className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-lg transition-colors shadow-lg shadow-indigo-500/20 group-hover:scale-105 duration-200" 
            title={visualStatus === 'Recebidos' ? 'Iniciar Produção' : 'Entregar Vídeo'}
          >
            {visualStatus === 'Recebidos' ? <Play className="w-4 h-4 ml-0.5" /> : <UploadCloud className="w-4 h-4" />}
          </button>
        </div>
      </div>
    );
  };

  const handleSubmitEntrega = () => {
    if (entregaModal.taskId && selectedFile) {
      setIsUploading(true);
      // Simula um tempo de upload
      setTimeout(() => {
        const fileUrl = URL.createObjectURL(selectedFile);
        updateTarefa(entregaModal.taskId!, { status: 'Aguardando revisão', link_entrega: fileUrl });
        setEntregaModal({ open: false, taskId: null });
        setSelectedFile(null);
        setIsUploading(false);
      }, 1500);
    }
  };

  return (
    <div className="flex-1 overflow-auto custom-scrollbar h-full relative px-2 md:px-0 pb-10 space-y-10">
      
      {/* 1. SEÇÃO: DEVOLVIDOS / CORREÇÕES (ATENÇÃO IMEDIATA) */}
      {correcoes.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-black text-white">Correções Solicitadas</h2>
            <Badge variant="destructive" className="ml-2 bg-rose-500">{correcoes.length}</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {correcoes.map(renderCard)}
          </div>
        </section>
      )}

      {/* 2. SEÇÃO: FILA DE TRABALHO */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <Video className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-black text-white">Fila de Produção</h2>
          <span className="text-zinc-500 text-sm font-medium">O que você precisa fazer</span>
        </div>
        
        {filaParaFazer.length === 0 ? (
          <div className="p-8 border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-500/50 mb-2" />
            <p className="text-zinc-400 font-bold">A fila está limpa!</p>
            <p className="text-zinc-500 text-sm">Não há novos vídeos para iniciar no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filaParaFazer.map(renderCard)}
          </div>
        )}
      </section>

      {/* 3. SEÇÃO: EM ANDAMENTO */}
      {emAndamento.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <PlayCircle className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-black text-white">Em Edição / Finalização</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {emAndamento.map(renderCard)}
          </div>
        </section>
      )}

      {/* 4. SEÇÃO: AGUARDANDO APROVAÇÃO E CONCLUÍDOS */}
      {(aguardando.length > 0 || concluidos.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-zinc-800/50">
          
          {/* Aguardando */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-black text-white">Aguardando Aprovação</h2>
            </div>
            <div className="space-y-3">
              {aguardando.length === 0 ? <p className="text-zinc-500 text-sm italic">Nenhum projeto em análise.</p> : aguardando.map(tarefa => (
                <div key={tarefa.id} className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <p className="text-zinc-300 font-bold text-sm line-clamp-1">{tarefa.titulo}</p>
                    <p className="text-zinc-500 text-[10px] uppercase font-bold mt-0.5">{clientes.find(c => c.id === tarefa.cliente_id)?.nome}</p>
                  </div>
                  <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/30">Em Análise</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Concluídos */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-black text-white">Últimas Entregas</h2>
            </div>
            <div className="space-y-3">
              {concluidos.length === 0 ? <p className="text-zinc-500 text-sm italic">Nenhum projeto concluído ainda.</p> : concluidos.map(tarefa => (
                <div key={tarefa.id} className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <p className="text-zinc-300 font-bold text-sm line-clamp-1">{tarefa.titulo}</p>
                    <p className="text-zinc-500 text-[10px] uppercase font-bold mt-0.5">{clientes.find(c => c.id === tarefa.cliente_id)?.nome}</p>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">Entregue</Badge>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* MODAL DE ENTREGA */}
      {entregaModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setEntregaModal({open: false, taskId: null})} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-indigo-500/10 rounded-2xl">
                <UploadCloud className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Entregar Vídeo</h3>
                <p className="text-zinc-400 text-sm">Insira o link para aprovação</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="relative border-2 border-dashed border-zinc-700 hover:border-indigo-500 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group">
                <input 
                  type="file" 
                  accept="video/mp4,video/x-m4v,video/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={e => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                />
                {!selectedFile ? (
                  <>
                    <UploadCloud className="w-10 h-10 text-zinc-600 group-hover:text-indigo-400 mb-3 transition-colors" />
                    <p className="text-zinc-300 font-bold mb-1">Clique ou arraste o vídeo aqui</p>
                    <p className="text-zinc-500 text-xs">MP4, MOV, WebM (Máx. 500MB)</p>
                  </>
                ) : (
                  <>
                    <Video className="w-10 h-10 text-indigo-400 mb-3" />
                    <p className="text-white font-bold mb-1 truncate w-full px-4">{selectedFile.name}</p>
                    <p className="text-zinc-400 text-xs">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </>
                )}
              </div>
              <p className="text-xs text-zinc-500 text-center">
                O arquivo será armazenado na plataforma e a administradora Gabi poderá assistir diretamente pelo painel dela.
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setEntregaModal({open: false, taskId: null})} className="flex-1 px-4 py-3 rounded-xl font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors" disabled={isUploading}>
                Cancelar
              </button>
              <button onClick={handleSubmitEntrega} disabled={!selectedFile || isUploading} className="flex-1 px-4 py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg shadow-indigo-500/20 transition-all">
                {isUploading ? 'Fazendo Upload...' : 'Enviar Vídeo'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
