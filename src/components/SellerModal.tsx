import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, UserCheck, Percent, Phone, Mail, FileText, DollarSign } from 'lucide-react';
import { Seller, Sale } from '../types';

interface SellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (seller: Seller) => void;
  editingSeller: Seller | null;
}

export const SellerModal: React.FC<SellerModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingSeller,
}) => {
  const [name, setName] = useState('');
  const [commissionRate, setCommissionRate] = useState<number>(15);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'Activo' | 'Inactivo'>('Activo');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingSeller) {
      setName(editingSeller.name || '');
      setCommissionRate(editingSeller.commissionRate ?? 15);
      setPhone(editingSeller.phone || '');
      setEmail(editingSeller.email || '');
      setStatus(editingSeller.status || 'Activo');
      setNotes(editingSeller.notes || '');
    } else {
      setName('');
      setCommissionRate(15);
      setPhone('');
      setEmail('');
      setStatus('Activo');
      setNotes('');
    }
  }, [editingSeller, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const sellerData: Seller = {
      id: editingSeller?.id || `sel-${Date.now()}`,
      name: name.trim(),
      commissionRate: Math.max(0, Math.min(100, Number(commissionRate) || 0)),
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      status,
      notes: notes.trim() || undefined,
      createdAt: editingSeller?.createdAt || new Date().toISOString(),
    };

    onSubmit(sellerData);
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-orange/10 text-brand-orange rounded-xl flex items-center justify-center">
              <UserCheck size={22} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-neutral-900">
                {editingSeller ? 'Editar Vendedor' : 'Nuevo Vendedor'}
              </h3>
              <p className="text-xs text-neutral-500">Configura datos y porcentaje de comisión por venta</p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg hover:bg-neutral-100">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Nombre Completo *
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Ej: Lucas Martínez"
            />
          </div>

          <div className="p-4 bg-orange-50/70 rounded-2xl border border-orange-200/70 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                <Percent size={14} className="text-brand-orange" />
                Comisión por Venta (%) *
              </label>
              <span className="text-xs font-bold text-brand-orange">{commissionRate}% sobre el total</span>
            </div>
            <input
              type="number"
              min={0}
              max={100}
              step="0.5"
              required
              value={commissionRate}
              onChange={(e) => setCommissionRate(Number(e.target.value))}
              className="input-field bg-white font-mono font-bold text-lg"
            />
            <div className="flex flex-wrap gap-1.5">
              {[10, 15, 20, 25, 30].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setCommissionRate(preset)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                    commissionRate === preset
                      ? 'bg-brand-orange text-white border-brand-orange shadow-xs'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:border-orange-300'
                  }`}
                >
                  {preset}%
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1 flex items-center gap-1">
                <Phone size={12} className="text-neutral-400" /> Teléfono / WhatsApp
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field py-2 text-sm"
                placeholder="+54 9 11..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1 flex items-center gap-1">
                <Mail size={12} className="text-neutral-400" /> Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field py-2 text-sm"
                placeholder="vendedor@nova-aj.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Estado</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'Activo' | 'Inactivo')}
              className="input-field py-2 text-sm bg-white"
            >
              <option value="Activo">Activo (Disponible para asignar ventas)</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1 flex items-center gap-1">
              <FileText size={12} className="text-neutral-400" /> Notas / Zona / Acuerdos
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field py-2 text-xs resize-none"
              placeholder="Ej: Vendedor comercial de redes sociales / zona norte..."
            />
          </div>

          <div className="pt-2">
            <button type="submit" className="btn-primary w-full justify-center py-3">
              {editingSeller ? 'Guardar Cambios' : 'Crear Vendedor'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

interface AssignSellerModalProps {
  sale: Sale | null;
  sellers: Seller[];
  onClose: () => void;
  onSave: (saleId: string, sellerId: string, commissionRate: number) => void;
}

export const AssignSellerModal: React.FC<AssignSellerModalProps> = ({
  sale,
  sellers,
  onClose,
  onSave,
}) => {
  const [sellerId, setSellerId] = useState('');
  const [rate, setRate] = useState<number>(15);

  useEffect(() => {
    if (sale) {
      setSellerId(sale.sellerId || '');
      if (sale.commissionRate !== undefined) {
        setRate(sale.commissionRate);
      } else if (sale.sellerId) {
        const s = sellers.find(sel => sel.id === sale.sellerId);
        setRate(s?.commissionRate ?? 15);
      } else {
        setRate(15);
      }
    }
  }, [sale, sellers]);

  if (!sale) return null;

  const handleSellerChange = (newId: string) => {
    setSellerId(newId);
    const found = sellers.find(s => s.id === newId);
    if (found) {
      setRate(found.commissionRate);
    }
  };

  const calculatedCommission = sellerId ? Math.round(((sale.total || 0) * (Number(rate) || 0)) / 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(sale.id, sellerId, Number(rate) || 0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
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
        className="glass-card w-full max-w-md p-6 sm:p-7 relative z-10"
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-neutral-900">Asignar Vendedor & Comisión</h3>
            <p className="text-xs text-neutral-500">
              Venta #{sale.id.slice(-6)} · {sale.clientName} (${(sale.total || 0).toLocaleString()})
            </p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Vendedor Responsable</label>
            <select
              value={sellerId}
              onChange={(e) => handleSellerChange(e.target.value)}
              className="input-field bg-white text-sm"
            >
              <option value="">-- Sin vendedor (Venta directa) --</option>
              {sellers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.commissionRate}% base) {s.status === 'Inactivo' ? '[Inactivo]' : ''}
                </option>
              ))}
            </select>
          </div>

          {sellerId && (
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Porcentaje de Comisión para esta venta (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step="0.5"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="input-field bg-white py-1.5 text-sm font-mono font-bold"
                />
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-emerald-200/60">
                <span className="text-xs font-semibold text-emerald-900 flex items-center gap-1">
                  <DollarSign size={14} /> Comisión calculada:
                </span>
                <span className="text-lg font-black text-emerald-700">
                  ${calculatedCommission.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
              Cancelar
            </button>
            <button type="submit" className="btn-primary flex-1 justify-center">
              Guardar Asignación
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
