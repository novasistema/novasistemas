import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Eye, EyeOff, X, ShieldAlert, ArrowRight, KeyRound, RotateCcw, CheckCircle2 } from 'lucide-react';
import { storageService } from '../services/storage';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal = ({ isOpen, onClose, onSuccess }: AdminLoginModalProps) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPassword = storageService.getAdminPassword();
    
    if (password === storedPassword) {
      setError(false);
      setPassword('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  const handleResetPassword = () => {
    storageService.resetAdminPassword();
    setPassword('admin123');
    setError(false);
    setConfirmReset(false);
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-md" 
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="glass-card w-full max-w-md p-8 relative z-10 bg-white shadow-2xl rounded-3xl"
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 bg-brand-orange/10 text-brand-orange rounded-2xl flex items-center justify-center mb-4 shadow-inner">
            <Lock size={32} />
          </div>
          <h3 className="text-2xl font-bold text-neutral-900">Acceso Privado</h3>
          <p className="text-sm text-neutral-500 mt-1 max-w-xs">
            Ingresa la contraseña de administrador para ingresar al panel de control.
          </p>
        </div>

        {resetSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -8 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2.5 font-medium"
          >
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <div>
              ¡Contraseña restablecida con éxito a: <strong className="font-mono font-bold text-emerald-950">admin123</strong>! Se ha autocompletado en el campo.
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
                Contraseña de Creador
              </label>
              {!confirmReset && (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="text-xs text-brand-orange hover:text-orange-700 font-semibold hover:underline flex items-center gap-1"
                >
                  <RotateCcw size={12} />
                  ¿Olvidaste tu clave?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Ingresa tu clave..."
                autoFocus
                required
                className={`input-field pr-12 text-lg tracking-wide ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-2"
                title={showPassword ? 'Ocultar' : 'Mostrar'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1.5 mt-2"
              >
                <div className="flex items-center gap-2 text-red-600 text-xs font-semibold">
                  <ShieldAlert size={14} />
                  Contraseña incorrecta. Inténtalo de nuevo.
                </div>
                {!confirmReset && (
                  <button
                    type="button"
                    onClick={() => setConfirmReset(true)}
                    className="text-xs text-brand-orange hover:text-orange-700 font-medium underline block"
                  >
                    ¿No recuerdas la contraseña que cambiaste? Haz clic aquí para restablecerla.
                  </button>
                )}
              </motion.div>
            )}
          </div>

          {confirmReset && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-2 text-amber-900"
            >
              <div className="font-bold flex items-center gap-1.5">
                <RotateCcw size={14} className="text-amber-700" />
                ¿Restablecer a la clave de fábrica?
              </div>
              <p className="text-amber-800 leading-relaxed">
                Esto restaurará la contraseña original: <strong className="font-mono text-neutral-900">admin123</strong>.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs shadow-sm transition-all"
                >
                  Sí, restablecer clave
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-1.5 bg-white border border-amber-300 text-amber-800 rounded-lg text-xs hover:bg-amber-100 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          )}

          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-xs text-neutral-500 flex items-center gap-2">
            <KeyRound size={16} className="text-brand-orange shrink-0" />
            <span>Clave predeterminada inicial: <strong className="font-mono text-neutral-800">admin123</strong></span>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              className="btn-primary w-full justify-center py-3.5 text-base font-bold shadow-lg shadow-brand-orange/25 active:scale-98"
            >
              Ingresar al Panel
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
