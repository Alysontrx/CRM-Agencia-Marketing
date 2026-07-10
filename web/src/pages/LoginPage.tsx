import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, User, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 800)); // Simulando loading
    
    // Check SaaS Super Admin First
    let atlasUser = null;
    try {
      const { data } = await supabase.from('atlas_usuarios').select('*').ilike('email', email).single();
      atlasUser = data;
    } catch (e) {
      console.error(e);
    }

    if (!atlasUser && email.toLowerCase() === 'atlasupi@gmail.com') {
      atlasUser = {
        id: 1,
        nome: 'Alysontrx (ATLAS)',
        email: 'atlasupi@gmail.com',
        senha: '2606',
        funcao: 'Super Admin',
        avatar: 'https://github.com/shadcn.png'
      };
    }

    if (atlasUser) {
      if (password === atlasUser.senha) {
        localStorage.setItem('@atlas_super_admin', JSON.stringify(atlasUser));
        window.location.href = '/atlas-admin/agencias';
        return;
      } else {
        setError('Senha inválida.');
        setLoading(false);
        return;
      }
    }

    // Normal Agency User
    const ok = await login(email);
    if (!ok) setError('E-mail ou senha inválidos.');
    setLoading(false);
  };


  return (
    <div className="min-h-screen bg-[#09090b] flex overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* Lado Esquerdo - Visual Impactante */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-zinc-950">
        {/* Efeito de Malha de Gradiente (Simplificado para performance) */}
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/20 blur-[80px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/20 blur-[80px]" />
          <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[80px]" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <img src="/logo.png" alt="Sense Logo" className="h-20 w-auto max-w-[200px] object-contain brightness-0 invert opacity-90" />
        </div>

        <div className="relative z-10 max-w-lg my-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-medium mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Sense OS v2.0</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
              A inteligência por trás de agências <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">extraordinárias.</span>
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed max-w-md">
              Gerencie seus clientes, orquestre sua equipe e acompanhe métricas de crescimento em um único ecossistema focado em performance.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-sm text-zinc-500 font-medium">
          <span>&copy; {new Date().getFullYear()} Sense OS</span>
          <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
          <span>Todos os direitos reservados</span>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 relative z-10">
        
        {/* Glow sutil no mobile */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-blue-500/10 rounded-full blur-[100px] lg:hidden z-0" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md relative z-10"
        >
          <div className="lg:hidden flex justify-center mb-10">
            <img src="/logo.png" alt="Sense Logo" className="h-24 w-auto max-w-[250px] object-contain brightness-0 invert" />
          </div>

          <div className="mb-6 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Acessar portal</h2>
            <p className="text-zinc-400 text-sm">Insira suas credenciais para continuar.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300 ml-1">E-mail</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-blue-400 transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <input 
                  type="email" 
                  className="w-full h-12 bg-zinc-900/50 border border-zinc-800 rounded-xl pl-11 pr-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all hover:bg-zinc-900 shadow-sm" 
                  placeholder="nome@agencia.com" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-medium text-zinc-300">Senha</label>
                <a href="#" className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">Esqueceu a senha?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-blue-400 transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input 
                  type="password" 
                  className="w-full h-12 bg-zinc-900/50 border border-zinc-800 rounded-xl pl-11 pr-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all hover:bg-zinc-900 shadow-sm" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                />
              </div>
            </div>
            
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <button 
              type="submit" 
              className="w-full h-12 bg-white text-zinc-950 font-bold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:bg-zinc-100 hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 group relative overflow-hidden" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" />
                  <span>Autenticando...</span>
                </div>
              ) : (
                <>
                  <span>Entrar no Workspace</span>
                  <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </>
              )}
            </button>
          </form>


        </motion.div>
      </div>
    </div>
  );
}

