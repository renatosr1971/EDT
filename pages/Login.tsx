
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro durante a autenticação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-0 sm:p-4 bg-background-dark">
      <div className="relative w-full max-w-md h-full sm:h-auto flex flex-col bg-surface-dark sm:rounded-3xl shadow-2xl overflow-hidden border border-white/5">
        <div className="relative w-full h-64 sm:h-56 shrink-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url("https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop")` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-dark to-transparent"></div>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="w-16 h-16 bg-background-dark/80 backdrop-blur-md rounded-2xl flex items-center justify-center border border-primary/30 shadow-lg">
              <span className="material-symbols-outlined text-primary text-4xl">storefront</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col px-6 py-8 w-full">
          <div className="text-center mb-8">
            <h1 className="text-white text-3xl font-bold tracking-tight mb-2">Encomendas Empório</h1>
            <p className="text-neutral-400 text-base font-medium">Login do Gerente</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className={`p-4 rounded-xl text-sm font-medium ${error.includes('Verifique seu e-mail') ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-300 text-sm font-semibold ml-1" htmlFor="email">E-mail</label>
              <div className="relative">
                <input
                  className="block w-full rounded-xl border border-[#326732] bg-[#193319] text-white placeholder:text-[#92c992]/50 focus:border-primary focus:ring-primary/20 h-14 px-4 outline-none transition-all"
                  id="email"
                  placeholder="gerente@emporio.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#92c992]">mail</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-300 text-sm font-semibold ml-1" htmlFor="password">Senha</label>
              <div className="relative">
                <input
                  className="block w-full rounded-xl border border-[#326732] bg-[#193319] text-white placeholder:text-[#92c992]/50 focus:border-primary focus:ring-primary/20 h-14 pl-4 pr-12 outline-none transition-all"
                  id="password"
                  placeholder="Digite sua senha"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 bottom-0 px-4 flex items-center justify-center text-[#92c992] hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              <div className="flex justify-end mt-1">
                <a className="text-sm font-medium text-neutral-400 hover:text-primary transition-colors" href="#">Esqueceu a senha?</a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full h-14 bg-primary hover:bg-[#0fd60f] active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 transition-all rounded-xl flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(19,236,19,0.2)]"
            >
              <span className="text-background-dark font-bold text-lg tracking-wide uppercase">
                {loading ? 'Processando...' : 'Entrar'}
              </span>
              {!loading && (
                <span className="material-symbols-outlined text-background-dark group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;
