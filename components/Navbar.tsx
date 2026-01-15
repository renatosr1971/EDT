
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      setIsAdmin(data?.role === 'admin');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      if (!supabase) return;
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  const navItems = [
    { name: 'Início', path: '/', icon: 'dashboard' },
    { name: 'Pedidos', path: '/orders', icon: 'list_alt' },
    { name: 'Relatórios', path: '/reports', icon: 'analytics' },
    ...(isAdmin ? [{ name: 'Usuários', path: '/users', icon: 'group' }] : []),
  ];

  return (
    <>
      {/* Mobile Bottom Navbar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background-dark/95 backdrop-blur-lg border-t border-white/5 pb-safe z-50 md:hidden">
        <div className="flex items-center justify-around h-16 w-full px-2">
          {navItems.slice(0, 2).map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive(item.path) ? 'text-primary' : 'text-gray-500'}`}
            >
              <span className={`material-symbols-outlined text-[22px] ${isActive(item.path) ? 'font-variation-fill' : ''}`}>{item.icon}</span>
              <span className="text-[10px] font-bold">{item.name}</span>
            </button>
          ))}

          <div className="relative -top-5 flex-shrink-0">
            <button
              onClick={() => navigate('/new-order')}
              className="flex items-center justify-center size-12 rounded-full bg-primary shadow-[0_0_15px_rgba(19,236,19,0.4)] text-black hover:scale-105 transition-transform"
            >
              <span className="material-symbols-outlined text-2xl font-bold">add</span>
            </button>
          </div>


          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center w-full h-full gap-1 text-red-500/70 hover:text-red-400 transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">logout</span>
            <span className="text-[10px] font-medium">Sair</span>
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-surface-dark border-r border-white/5 flex-col p-6 z-50">
        <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-black">
            <span className="material-symbols-outlined font-bold text-2xl">bakery_dining</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white line-clamp-1">Empório EDT</h1>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive(item.path)
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
            >
              <span className={`material-symbols-outlined text-2xl transition-transform group-hover:scale-110 ${isActive(item.path) ? 'font-variation-fill' : ''}`}>
                {item.icon}
              </span>
              <span className="font-bold text-sm tracking-wide">{item.name}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate('/new-order')}
          className="mt-4 flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-primary text-black font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-wider"
        >
          <span className="material-symbols-outlined font-bold">add_circle</span>
          Novo Pedido
        </button>

        <div className="mt-10 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3 px-2">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-primary/20"
                style={{ backgroundImage: `url("https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y")` }}
              />
              <div className="flex flex-col overflow-hidden max-w-[100px]">
                <p className="text-white text-sm font-bold truncate">Admin</p>
                <p className="text-gray-500 text-[10px] truncate uppercase tracking-tighter">Conectado</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="size-9 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300"
              title="Sair do aplicativo"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
