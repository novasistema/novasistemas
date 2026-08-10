import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Globe, User, Key, Eye, EyeOff } from 'lucide-react';
import { Client, Product, Subscription } from '../types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editingSubscription: Subscription | null;
  clients: Client[];
  products?: Product[];
}

export const SubscriptionModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingSubscription, 
  clients = [],
  products = [] 
}: SubscriptionModalProps) => {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [systemName, setSystemName] = useState('');
  const [selectedSystemKey, setSelectedSystemKey] = useState('');
  const [customSystem, setCustomSystem] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [priceValue, setPriceValue] = useState<number | string>('');
  const [periodValue, setPeriodValue] = useState<'Mensual' | 'Anual' | 'Semestral'>('Mensual');

  useEffect(() => {
    if (editingSubscription) {
      setSelectedClientId(editingSubscription.clientId);
      setSystemName(editingSubscription.systemName);
      setPriceValue(editingSubscription.price);
      setPeriodValue(editingSubscription.period);
      setCustomSystem(true);
    } else {
      setSelectedClientId('');
      setSystemName('');
      setSelectedSystemKey('');
      setPriceValue('');
      setPeriodValue('Mensual');
      setCustomSystem(false);
    }
  }, [editingSubscription, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const client = clients.find(c => c.id === selectedClientId);

    const finalSystemName = customSystem 
      ? (formData.get('systemNameCustom') as string || '').trim() 
      : systemName;

    const subscriptionData = {
      id: editingSubscription?.id || Date.now().toString(),
      clientId: selectedClientId,
      clientName: client ? client.name : (editingSubscription?.clientName || ''),
      systemName: finalSystemName,
      appUrl: (formData.get('appUrl') as string || '').trim(),
      appUser: (formData.get('appUser') as string || '').trim(),
      appPassword: (formData.get('appPassword') as string || '').trim(),
      price: Number(formData.get('price')),
      period: formData.get('period') as any,
      startDate: formData.get('startDate') as string,
      nextBillingDate: formData.get('nextBillingDate') as string,
      status: formData.get('status') as any,
    };

    onSubmit(subscriptionData);
  };

  const selectedClient = clients.find(c => c.id === selectedClientId);
  const clientSystems = selectedClient?.systems || [];

  const handleSystemSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedSystemKey(val);

    if (val.startsWith('PORTFOLIO:')) {
      const prodId = val.replace('PORTFOLIO:', '');
      const prod = products.find(p => p.id === prodId);
      if (prod) {
        setSystemName(prod.name);
        if (prod.hasSubscription && prod.subscriptionPrice) {
          setPriceValue(prod.subscriptionPrice);
          setPeriodValue(prod.subscriptionPeriod || 'Mensual');
        } else {
          setPriceValue(prod.price);
        }
      }
    } else if (val.startsWith('CLIENT:')) {
      const sysId = val.replace('CLIENT:', '');
      const sys = clientSystems.find(s => s.id === sysId);
      if (sys) {
        setSystemName(sys.name);
      }
    } else {
      setSystemName('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" 
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass-card w-full max-w-md p-6 sm:p-8 relative z-10 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">
            {editingSubscription ? 'Editar Suscripción' : 'Nueva Suscripción'}
          </h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Cliente</label>
            <select 
              value={selectedClientId}
              onChange={(e) => {
                setSelectedClientId(e.target.value);
              }}
              required
              disabled={!!editingSubscription}
              className="input-field"
            >
              <option value="">Seleccionar Cliente...</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-neutral-700">Sistema / Servicio</label>
              <button 
                type="button" 
                onClick={() => {
                  setCustomSystem(!customSystem);
                  if (customSystem) {
                    setSystemName('');
                    setSelectedSystemKey('');
                  }
                }}
                className="text-xs text-brand-orange hover:underline font-semibold"
              >
                {customSystem ? 'Elegir del Portafolio' : 'Escribir manual'}
              </button>
            </div>

            {!customSystem ? (
              <select 
                value={selectedSystemKey} 
                onChange={handleSystemSelect}
                required
                className="input-field"
              >
                <option value="">Seleccionar Sistema o Servicio...</option>
                
                {clientSystems.length > 0 && (
                  <optgroup label="👤 Sistemas Específicos del Cliente">
                    {clientSystems.map(s => (
                      <option key={s.id} value={`CLIENT:${s.id}`}>
                        {s.name} ({s.type})
                      </option>
                    ))}
                  </optgroup>
                )}

                {products.length > 0 && (
                  <optgroup label="📦 Portafolio / Productos Nova AJ">
                    {products.map(p => (
                      <option key={p.id} value={`PORTFOLIO:${p.id}`}>
                        {p.name} {p.hasSubscription && p.subscriptionPrice ? `(Suscripción: $${p.subscriptionPrice.toLocaleString()} / ${p.subscriptionPeriod || 'Mensual'})` : `($${p.price.toLocaleString()})`}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            ) : (
              <input 
                name="systemNameCustom"
                defaultValue={editingSubscription?.systemName}
                required
                className="input-field" 
                placeholder="Ej: Mantenimiento WEB, Hosting Anual, etc." 
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1 flex items-center gap-1.5">
              <Globe size={16} className="text-neutral-400" />
              Enlace / URL de la Aplicación (Control Creador)
            </label>
            <input 
              name="appUrl"
              type="url"
              defaultValue={editingSubscription?.appUrl || ''}
              className="input-field" 
              placeholder="https://su-sistema.com o link del panel" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1 flex items-center gap-1.5">
                <User size={16} className="text-neutral-400" />
                Usuario / Email
              </label>
              <input 
                name="appUser"
                type="text"
                defaultValue={editingSubscription?.appUser || ''}
                className="input-field" 
                placeholder="admin@cliente.com" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1 flex items-center gap-1.5">
                <Key size={16} className="text-neutral-400" />
                Contraseña
              </label>
              <div className="relative">
                <input 
                  name="appPassword"
                  type={showPassword ? 'text' : 'password'}
                  defaultValue={editingSubscription?.appPassword || ''}
                  className="input-field pr-10" 
                  placeholder="••••••••" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1"
                  title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Precio Cobro ($)</label>
              <input 
                name="price" 
                type="number" 
                value={priceValue}
                onChange={(e) => setPriceValue(e.target.value)}
                required 
                className="input-field" 
                placeholder="0" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Periodo</label>
              <select 
                name="period" 
                value={periodValue}
                onChange={(e) => setPeriodValue(e.target.value as any)}
                className="input-field"
              >
                <option value="Mensual">Mensual</option>
                <option value="Semestral">Semestral</option>
                <option value="Anual">Anual</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Fecha Inicio</label>
              <input 
                name="startDate" 
                type="date" 
                defaultValue={editingSubscription?.startDate ? editingSubscription.startDate.split('T')[0] : new Date().toISOString().split('T')[0]} 
                required 
                className="input-field" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Próximo Cobro</label>
              <input 
                name="nextBillingDate" 
                type="date" 
                defaultValue={editingSubscription?.nextBillingDate ? editingSubscription.nextBillingDate.split('T')[0] : (() => {
                  const d = new Date();
                  d.setDate(d.getDate() + 30);
                  return d.toISOString().split('T')[0];
                })()} 
                required 
                className="input-field" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Estado</label>
            <select name="status" defaultValue={editingSubscription?.status || 'Activa'} className="input-field">
              <option value="Activa">Activa</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Vencida">Vencida</option>
              <option value="Suspendida">Suspendida</option>
            </select>
          </div>

          <div className="pt-4">
            <button type="submit" className="btn-primary w-full justify-center py-3">
              {editingSubscription ? 'Guardar Cambios' : 'Crear Suscripción'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
