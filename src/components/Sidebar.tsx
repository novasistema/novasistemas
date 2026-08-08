import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  Megaphone,
  Menu,
  X,
  LogOut,
  Calendar,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  activeView: View;
  setView: (v: View) => void;
  onLogoutAdmin: () => void;
  onChangePassword: () => void;
}

export const Sidebar = ({ activeView, setView, onLogoutAdmin, onChangePassword }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'products', label: 'Sistemas & Portafolio', icon: Package },
    { id: 'sales', label: 'Ventas', icon: ShoppingCart },
    { id: 'subscriptions', label: 'Suscripciones', icon: Calendar },
    { id: 'banners', label: 'Anuncios', icon: Megaphone },
  ];

  const handleNav = (view: View) => {
    setView(view);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-6 left-6 z-[60] p-3 bg-brand-orange text-white rounded-xl shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`
        w-64 h-screen bg-neutral-900 text-white flex flex-col fixed left-0 top-0 z-[55] transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center shadow-lg shadow-brand-orange/20">
            <span className="text-xl font-bold">N</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Nova AJ</h1>
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest">Sistema Digital</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id as View)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeView === item.id 
                  ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20' 
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 space-y-2 border-t border-white/5">
          <button 
            onClick={onChangePassword}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <KeyRound size={18} className="text-brand-orange" />
            <span>Cambiar Clave Admin</span>
          </button>

          <button 
            onClick={() => {
              onLogoutAdmin();
              handleNav('landing');
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
          >
            <LogOut size={18} />
            <span>Bloquear / Salir</span>
          </button>
          
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400">
              <ShieldCheck size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">Creador (Admin)</p>
              <p className="text-[10px] text-emerald-400 font-medium truncate">Sesión Protegida</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
