
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background-dark/95 backdrop-blur-lg border-t border-white/5 pb-safe z-50">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        <button
          onClick={() => navigate('/')}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive('/') ? 'text-primary' : 'text-gray-500'
            }`}
        >
          <span className={`material-symbols-outlined text-2xl ${isActive('/') ? 'font-variation-fill' : ''}`}>dashboard</span>
          <span className="text-[10px] font-bold">Início</span>
        </button>

        <button
          onClick={() => navigate('/orders')}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive('/orders') ? 'text-primary' : 'text-gray-500'
            }`}
        >
          <span className={`material-symbols-outlined text-2xl ${isActive('/orders') ? 'font-variation-fill' : ''}`}>list_alt</span>
          <span className="text-[10px] font-medium">Pedidos</span>
        </button>

        <div className="relative -top-5">
          <button
            onClick={() => navigate('/new-order')}
            className="flex items-center justify-center size-12 rounded-full bg-primary shadow-[0_0_15px_rgba(19,236,19,0.4)] text-black hover:scale-105 transition-transform"
          >
            <span className="material-symbols-outlined text-2xl font-bold">add</span>
          </button>
        </div>

        <button
          onClick={() => navigate('/reports')}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive('/reports') ? 'text-primary' : 'text-gray-500'
            }`}
        >
          <span className={`material-symbols-outlined text-2xl ${isActive('/reports') ? 'font-variation-fill' : ''}`}>analytics</span>
          <span className="text-[10px] font-medium">Relatórios</span>
        </button>

        <button
          onClick={() => navigate('/settings')}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive('/settings') ? 'text-primary' : 'text-gray-500'
            }`}
        >
          <span className={`material-symbols-outlined text-2xl ${isActive('/settings') ? 'font-variation-fill' : ''}`}>settings</span>
          <span className="text-[10px] font-medium">Ajustes</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
