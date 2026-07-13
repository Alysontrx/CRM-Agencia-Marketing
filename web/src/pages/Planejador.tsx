import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Plus, Image as ImageIcon, Trash2, CalendarDays, Loader2, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface PostPlanner {
  id: string;
  cliente_id: number;
  date: string; // YYYY-MM-DD
  image: string; // base64
  caption: string;
}

export default function PlanejadorPage() {
  const { clientes } = useApp();
  
  // Mês e Cliente selecionados
  const [selectedClienteId, setSelectedClienteId] = useState<number | null>(null);
  
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  // Todos os posts salvos
  const [posts, setPosts] = useState<PostPlanner[]>(() => {
    const saved = localStorage.getItem('sense-planejador-posts');
    if (saved && saved !== '[]') {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Erro ao ler posts', e);
      }
    }
    
    // Dados fictícios para caso esteja vazio
    const hoje = new Date();
    const proximaSemana = new Date(hoje); proximaSemana.setDate(hoje.getDate() + 3);
    
    return [
      {
        id: 'mock1',
        cliente_id: clientes[0]?.id || 1,
        date: hoje.toISOString().split('T')[0],
        image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        caption: 'O inverno chegou! ❄️🧥 E com ele, as melhores tendências de moda para você arrasar.\n\n#Inverno #Moda2026'
      },
      {
        id: 'mock2',
        cliente_id: clientes[0]?.id || 1,
        date: proximaSemana.toISOString().split('T')[0],
        image: 'https://images.unsplash.com/photo-1515347619152-198158586c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        caption: 'Acessórios que transformam qualquer look básico. Qual o seu favorito? 👇✨\n\n#Acessorios #Estilo'
      }
    ];
  });

  // Modal Novo Post
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPostDate, setNewPostDate] = useState('');
  const [newPostCaption, setNewPostCaption] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('sense-planejador-posts', JSON.stringify(posts));
  }, [posts]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setNewPostImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClienteId || !newPostDate || !newPostCaption || !newPostImage) {
      alert("Preencha todos os campos e anexe uma imagem!");
      return;
    }

    const newPost: PostPlanner = {
      id: Date.now().toString(),
      cliente_id: selectedClienteId,
      date: newPostDate,
      image: newPostImage,
      caption: newPostCaption
    };

    setPosts([...posts, newPost]);
    setIsModalOpen(false);
    setNewPostDate('');
    setNewPostCaption('');
    setNewPostImage(null);
  };

  const handleDeletePost = (id: string) => {
    if (confirm("Tem certeza que deseja apagar este post?")) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  // Filtrar os posts pelo cliente e mês/ano selecionados
  const filteredPosts = posts.filter(p => {
    if (p.cliente_id !== selectedClienteId) return false;
    const pDate = new Date(p.date + 'T12:00:00'); // Evitar problema de fuso
    return pDate.getMonth() === selectedMonth && pDate.getFullYear() === selectedYear;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-purple-500" />
            Planejador de Conteúdo
          </h2>
          <p className="text-sm text-zinc-400 mt-1">Visualize e adiante os posts de cada cliente separados por mês.</p>
        </div>
        
        {selectedClienteId && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium shadow-lg transition-colors flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Agendar Novo Post
          </button>
        )}
      </div>

      {/* FILTROS */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Selecione o Cliente</label>
            <select 
              className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:ring-2 focus:ring-purple-500/50"
              value={selectedClienteId || ''}
              onChange={e => setSelectedClienteId(Number(e.target.value))}
            >
              <option value="">Escolha um cliente...</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Mês</label>
            <select 
              className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:ring-2 focus:ring-purple-500/50"
              value={selectedMonth}
              onChange={e => setSelectedMonth(Number(e.target.value))}
            >
              {meses.map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Ano</label>
            <select 
              className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:ring-2 focus:ring-purple-500/50"
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
            >
              {[2024, 2025, 2026, 2027].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* GRID DE POSTS */}
      {!selectedClienteId ? (
        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30 text-zinc-500">
          <Calendar className="w-12 h-12 mb-3 text-zinc-700" />
          <p>Selecione um cliente para ver ou agendar os posts do mês.</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30 text-zinc-500">
          <ImageIcon className="w-12 h-12 mb-3 text-zinc-700" />
          <p>Nenhum post agendado para {meses[selectedMonth]} {selectedYear}.</p>
          <button onClick={() => setIsModalOpen(true)} className="mt-4 text-purple-400 hover:text-purple-300 text-sm font-medium">
            + Começar a preencher o mês
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPosts.map(post => {
            const dataObj = new Date(post.date + 'T12:00:00');
            const diaDaSemana = dataObj.toLocaleDateString('pt-BR', { weekday: 'short' });
            const dia = dataObj.getDate();
            
            return (
              <div key={post.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg group flex flex-col hover:border-purple-500/50 transition-all">
                {/* Header do Card (Data) */}
                <div className="bg-zinc-950 p-3 flex items-center justify-between border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="bg-purple-600/20 text-purple-400 font-bold px-2 py-1 rounded text-lg min-w-[2.5rem] text-center">
                      {dia}
                    </div>
                    <span className="text-zinc-400 text-xs font-medium uppercase">{diaDaSemana}</span>
                  </div>
                  <button 
                    onClick={() => handleDeletePost(post.id)}
                    className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Imagem (Arte do Post) */}
                <div className="h-48 w-full bg-black relative overflow-hidden flex items-center justify-center border-b border-zinc-800">
                  <img src={post.image} alt="Arte" className="max-w-full max-h-full object-contain" />
                </div>
                
                {/* Legenda */}
                <div className="p-4 flex-1">
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Legenda Oficial</h4>
                  <div className="text-sm text-zinc-300 whitespace-pre-wrap line-clamp-6 group-hover:line-clamp-none transition-all">
                    {post.caption}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DE NOVO POST */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
              <h3 className="text-lg font-bold text-zinc-100">Agendar Novo Post</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">&times;</button>
            </div>
            
            <form onSubmit={handleCreatePost} className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-300">Data de Publicação</label>
                    <input 
                      type="date" 
                      required
                      value={newPostDate}
                      onChange={e => setNewPostDate(e.target.value)}
                      className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-100 focus:ring-2 focus:ring-purple-500/50 color-scheme-dark"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-300">Arte do Post</label>
                    <div 
                      onClick={() => imageInputRef.current?.click()}
                      className="h-32 border-2 border-dashed border-zinc-700 hover:border-purple-500 rounded-xl bg-zinc-950 flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden"
                    >
                      {newPostImage ? (
                        <img src={newPostImage} alt="Preview" className="h-full object-contain" />
                      ) : (
                        <>
                          <ImageIcon className="w-8 h-8 text-zinc-500 mb-2" />
                          <span className="text-xs text-zinc-400 font-medium">Clique para upar a imagem (.jpg, .png)</span>
                        </>
                      )}
                    </div>
                    <input type="file" ref={imageInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                  </div>
                </div>

                <div className="space-y-1.5 h-full flex flex-col">
                  <label className="text-sm font-medium text-zinc-300">Legenda (Copy)</label>
                  <textarea
                    required
                    value={newPostCaption}
                    onChange={e => setNewPostCaption(e.target.value)}
                    placeholder="Cole aqui a legenda que a IA criou ou escreva a sua..."
                    className="w-full flex-1 min-h-[200px] bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-100 focus:ring-2 focus:ring-purple-500/50 resize-none custom-scrollbar"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white">
                  Cancelar
                </button>
                <button type="submit" className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-lg transition-colors">
                  Salvar Post no Planejador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
