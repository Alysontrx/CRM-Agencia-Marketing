import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CalendarDays, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PublicPlanejador() {
  const { token } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [cliente, setCliente] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  useEffect(() => {
    async function loadData() {
      if (!token) {
        setError("Link inválido.");
        setLoading(false);
        return;
      }

      try {
        const clienteIdStr = atob(token);
        const clienteId = Number(clienteIdStr);
        
        if (isNaN(clienteId)) {
          setError("Link inválido.");
          setLoading(false);
          return;
        }

        // Buscar cliente
        const { data: cData, error: cError } = await supabase
          .from('clientes')
          .select('*')
          .eq('id', clienteId)
          .single();

        if (cError || !cData) {
          setError("Cliente não encontrado.");
          setLoading(false);
          return;
        }

        setCliente(cData);

        // Buscar posts
        const { data: pData, error: pError } = await supabase
          .from('posts_planejador')
          .select('*')
          .eq('cliente_id', clienteId);

        if (!pError && pData) {
          setPosts(pData);
        }
      } catch (err) {
        console.error(err);
        setError("Houve um problema ao carregar o planejador.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500 mb-4" />
        <p className="font-medium animate-pulse">Carregando planejador...</p>
      </div>
    );
  }

  if (error || !cliente) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400">
        <CalendarDays className="w-12 h-12 mb-4 text-zinc-600" />
        <h1 className="text-xl font-bold text-white mb-2">Ops!</h1>
        <p>{error}</p>
      </div>
    );
  }

  // Filtrar os posts pelo mês/ano selecionados
  const filteredPosts = posts.filter(p => {
    const pDate = new Date(p.date + 'T12:00:00'); // Evitar problema de fuso
    return pDate.getMonth() === selectedMonth && pDate.getFullYear() === selectedYear;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-purple-500/30">
      {/* HEADER */}
      <header className="border-b border-zinc-800/50 bg-zinc-900/50 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center text-purple-500 font-bold text-xl shadow-inner shadow-purple-500/10">
              {cliente.nome[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                Planejamento de Conteúdo
              </h1>
              <p className="text-sm text-zinc-400">Cliente: <span className="font-medium text-zinc-300">{cliente.nome}</span></p>
            </div>
          </div>

          {/* FILTERS */}
          <div className="flex items-center gap-2">
            <select 
              className="h-9 bg-zinc-900 border border-zinc-700 rounded-lg px-3 text-sm text-zinc-100 focus:ring-2 focus:ring-purple-500/50 outline-none"
              value={selectedMonth}
              onChange={e => setSelectedMonth(Number(e.target.value))}
            >
              {meses.map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>
            
            <select 
              className="h-9 bg-zinc-900 border border-zinc-700 rounded-lg px-3 text-sm text-zinc-100 focus:ring-2 focus:ring-purple-500/50 outline-none"
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
            >
              {[2024, 2025, 2026, 2027].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {filteredPosts.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30 text-zinc-500 mt-8">
            <CalendarDays className="w-12 h-12 mb-3 text-zinc-700" />
            <p>Nenhum post agendado para {meses[selectedMonth]} {selectedYear}.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPosts.map((post, idx) => {
              const dataObj = new Date(post.date + 'T12:00:00');
              const diaDaSemana = dataObj.toLocaleDateString('pt-BR', { weekday: 'short' });
              const dia = dataObj.getDate();
              
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={post.id} 
                  className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl group flex flex-col hover:border-purple-500/50 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10"
                >
                  {/* Header do Card (Data) */}
                  <div className="bg-zinc-950 p-3 flex items-center gap-3 border-b border-zinc-800">
                    <div className="bg-purple-600/20 text-purple-400 font-bold px-3 py-1.5 rounded-lg text-xl min-w-[3rem] text-center shadow-inner shadow-purple-500/10">
                      {dia}
                    </div>
                    <div>
                      <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider block">{diaDaSemana}</span>
                      <span className="text-zinc-500 text-[10px]">{meses[selectedMonth]}</span>
                    </div>
                  </div>
                  
                  {/* Imagem (Arte do Post) */}
                  <div className="h-56 w-full bg-black relative overflow-hidden flex items-center justify-center border-b border-zinc-800">
                    {post.image ? (
                      <img src={post.image} alt="Arte" className="w-full h-full object-contain bg-zinc-950" />
                    ) : (
                      <div className="flex flex-col items-center text-zinc-600">
                        <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                        <span className="text-xs font-medium uppercase tracking-widest opacity-50">Sem Arte</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Legenda */}
                  <div className="p-5 flex-1 bg-zinc-900/50">
                    <h4 className="text-[10px] font-bold text-purple-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                      Legenda / Copy
                    </h4>
                    <div className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed font-medium">
                      {post.caption}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
