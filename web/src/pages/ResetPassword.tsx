import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Lock, Mail, ArrowRight, CheckCircle2, Loader2, ShieldAlert, Eye, EyeOff } from 'lucide-react';

type Screen = 'request' | 'sent' | 'reset' | 'success';

export default function ResetPassword() {
  const [screen, setScreen] = useState<Screen>('request');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if there's a token in the URL (coming from email link)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      setScreen('reset');
    }
  }, []);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setScreen('sent');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setScreen('success');
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden px-4">
      {/* Background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(79,70,229,0.15)]">
            <ShieldAlert className="w-10 h-10 text-indigo-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            SENSE <span className="text-indigo-500">OS</span>
          </h1>
          <p className="text-zinc-500 mt-2 font-medium tracking-wider uppercase text-sm">
            Recuperação de Acesso
          </p>
        </div>

        <AnimatePresence mode="wait">
          {/* TELA 1: Solicitar reset */}
          {screen === 'request' && (
            <motion.form
              key="request"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleRequestReset}
              className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl shadow-2xl"
            >
              <h2 className="text-xl font-bold text-white mb-2">Esqueci minha senha</h2>
              <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
                Digite seu e‑mail de acesso. Enviaremos um link para redefinir sua senha.
              </p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm mb-5 font-medium">
                  {error}
                </div>
              )}

              <div className="mb-5">
                <label className="block text-sm font-medium text-zinc-400 mb-2">E-mail</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-zinc-500" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Enviar link de recuperação <ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              <p className="text-center mt-5">
                <a href="/login" className="text-sm text-zinc-500 hover:text-indigo-400 transition-colors">
                  ← Voltar ao login
                </a>
              </p>
            </motion.form>
          )}

          {/* TELA 2: E-mail enviado */}
          {screen === 'sent' && (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">E-mail enviado!</h2>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                Enviamos um link de recuperação para <span className="text-white font-medium">{email}</span>.<br />
                Verifique sua caixa de entrada (e a pasta de spam).
              </p>
              <p className="text-center">
                <a href="/login" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                  ← Voltar ao login
                </a>
              </p>
            </motion.div>
          )}

          {/* TELA 3: Nova senha */}
          {screen === 'reset' && (
            <motion.form
              key="reset"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleResetPassword}
              className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl shadow-2xl"
            >
              <h2 className="text-xl font-bold text-white mb-2">Criar nova senha</h2>
              <p className="text-zinc-500 text-sm mb-6">Digite sua nova senha abaixo.</p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm mb-5 font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Nova senha</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-zinc-500" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-11 pr-12 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Mínimo 6 caracteres"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-zinc-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Confirmar nova senha</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-zinc-500" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Repita a senha"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Salvar nova senha <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </motion.form>
          )}

          {/* TELA 4: Sucesso */}
          {screen === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Senha redefinida!</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Sua senha foi atualizada com sucesso.<br />
                Redirecionando para o login em alguns segundos...
              </p>
              <div className="mt-6">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-400 mx-auto" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
