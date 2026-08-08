import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  MessageSquare, 
  DollarSign, 
  Calendar, 
  AlertTriangle,
  FileCheck,
  TrendingUp,
  Clock,
  ExternalLink,
  User,
  Key,
  Copy,
  Check,
  Eye,
  EyeOff
} from 'lucide-react';
import { Subscription, Client, Sale } from '../types';

interface SubscriptionsViewProps {
  subscriptions: Subscription[];
  clients: Client[];
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  onAddSubscription: () => void;
  onEditSubscription: (s: Subscription) => void;
  onDeleteSubscription: (id: string) => void;
  onGenerateSaleFromSub: (s: Subscription) => void;
}

export const SubscriptionsView = ({
  subscriptions = [],
  clients = [],
  searchTerm,
  setSearchTerm,
  onAddSubscription,
  onEditSubscription,
  onDeleteSubscription,
  onGenerateSaleFromSub,
}: SubscriptionsViewProps) => {
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Filter logic
  const filtered = (subscriptions || []).filter(sub => {
    const matchesSearch = 
      (sub.clientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sub.systemName || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'todos') return matchesSearch;
    return matchesSearch && sub.status.toLowerCase() === statusFilter.toLowerCase();
  });

  // Calculations
  const activeSubs = subscriptions.filter(s => s.status === 'Activa');
  const totalMRR = activeSubs.reduce((acc, curr) => {
    // Standardize to monthly rate for MRR calculation
    if (curr.period === 'Anual') return acc + (curr.price / 12);
    if (curr.period === 'Semestral') return acc + (curr.price / 6);
    return acc + curr.price;
  }, 0);

  const vencidasCount = subscriptions.filter(s => s.status === 'Vencida').length;
  const pendienteCount = subscriptions.filter(s => s.status === 'Pendiente').length;

  const handleWhatsAppBilling = (sub: Subscription) => {
    const client = clients.find(c => c.id === sub.clientId);
    const message = `*NOVA AJ - Aviso de Suscripción*\n\nEstimado/a *${sub.clientName}*,\n\nLe recordamos la suscripción de su sistema *${sub.systemName}*:\n\n*Servicio:* ${sub.systemName} (${sub.period})\n*Monto:* $${sub.price.toLocaleString()}\n*Próximo Vencimiento:* ${new Date(sub.nextBillingDate).toLocaleDateString()}\n\n_Para realizar el pago, puede realizar una transferencia bancaria y enviarnos el comprobante._\n\n¡Muchas gracias por su confianza!\nNova AJ - Sistemas Digitales`;
    
    const rawPhone = client?.phone || '';
    const cleanPhone = rawPhone.replace(/\D/g, '');
    
    let phoneWithCountry = cleanPhone;
    if (cleanPhone.length > 0 && !cleanPhone.startsWith('54')) {
      if (cleanPhone.length === 10) {
        phoneWithCountry = '549' + cleanPhone;
      } else {
        phoneWithCountry = '54' + cleanPhone;
      }
    }

    const url = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Suscripciones / Abonos</h2>
          <p className="text-neutral-500 mt-1">Gestiona los cobros periódicos de tus sistemas o licencias.</p>
        </div>
        <button onClick={onAddSubscription} className="btn-primary">
          <Plus size={20} />
          Nueva Suscripción
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs text-neutral-500 font-medium">Ingresos Estimados (MRR)</p>
            <h4 className="text-xl font-bold text-neutral-900">${Math.round(totalMRR).toLocaleString()}/mes</h4>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-xs text-neutral-500 font-medium">Suscripciones Activas</p>
            <h4 className="text-xl font-bold text-neutral-900">{activeSubs.length}</h4>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-xs text-neutral-500 font-medium">Suscripciones Vencidas</p>
            <h4 className="text-xl font-bold text-neutral-900">{vencidasCount}</h4>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs text-neutral-500 font-medium">Cobros Pendientes</p>
            <h4 className="text-xl font-bold text-neutral-900">{pendienteCount}</h4>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap bg-neutral-100 p-1 rounded-xl max-w-full overflow-x-auto gap-1">
          {['todos', 'activa', 'vencida', 'pendiente', 'suspendida'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 text-xs font-bold rounded-lg uppercase transition-all ${
                statusFilter === status 
                  ? 'bg-white text-neutral-900 shadow-sm' 
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="glass-card flex items-center gap-3 px-4 py-3 w-full md:max-w-xs">
          <Search className="text-neutral-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por cliente o sistema..." 
            className="bg-transparent outline-none w-full text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid subscriptions list */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs uppercase text-neutral-400 font-bold border-b border-neutral-100 bg-neutral-50">
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Servicio / Sistema</th>
                <th className="px-6 py-4">Credenciales de Acceso</th>
                <th className="px-6 py-4">Precio / Periodo</th>
                <th className="px-6 py-4">Próximo Cobro</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-sm">
              {filtered.map(sub => {
                const showPass = visiblePasswords[sub.id];
                return (
                <tr key={sub.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-neutral-900">{sub.clientName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-neutral-900">{sub.systemName}</div>
                    {sub.appUrl && (
                      <a 
                        href={sub.appUrl.startsWith('http') ? sub.appUrl : `https://${sub.appUrl}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-brand-orange hover:text-orange-700 font-semibold mt-1 hover:underline"
                        title="Abrir aplicación / Control Creador"
                      >
                        <ExternalLink size={12} />
                        <span className="truncate max-w-[180px]">{sub.appUrl.replace(/^https?:\/\//, '')}</span>
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {(sub.appUser || sub.appPassword) ? (
                      <div className="space-y-1 text-xs">
                        {sub.appUser && (
                          <div className="flex items-center gap-1.5 text-neutral-700">
                            <User size={13} className="text-neutral-400 shrink-0" />
                            <span className="font-mono">{sub.appUser}</span>
                            <button
                              onClick={() => handleCopy(sub.appUser!, `user-${sub.id}`)}
                              className="p-1 text-neutral-400 hover:text-neutral-700 rounded transition-colors"
                              title="Copiar Usuario"
                            >
                              {copiedKey === `user-${sub.id}` ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                            </button>
                          </div>
                        )}
                        {sub.appPassword && (
                          <div className="flex items-center gap-1.5 text-neutral-700">
                            <Key size={13} className="text-neutral-400 shrink-0" />
                            <span className="font-mono">
                              {showPass ? sub.appPassword : '••••••••'}
                            </span>
                            <button
                              onClick={() => togglePasswordVisibility(sub.id)}
                              className="p-1 text-neutral-400 hover:text-neutral-700 rounded transition-colors"
                              title={showPass ? 'Ocultar contraseña' : 'Ver contraseña'}
                            >
                              {showPass ? <EyeOff size={12} /> : <Eye size={12} />}
                            </button>
                            <button
                              onClick={() => handleCopy(sub.appPassword!, `pass-${sub.id}`)}
                              className="p-1 text-neutral-400 hover:text-neutral-700 rounded transition-colors"
                              title="Copiar Contraseña"
                            >
                              {copiedKey === `pass-${sub.id}` ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-neutral-400 italic">Sin credenciales</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-neutral-900">${sub.price.toLocaleString()}</div>
                    <div className="text-xs text-neutral-400 font-medium">{sub.period}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-neutral-400" />
                      <span className="font-mono">{new Date(sub.nextBillingDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                      sub.status === 'Activa' ? 'bg-emerald-50 text-emerald-600' : 
                      sub.status === 'Pendiente' ? 'bg-amber-50 text-amber-600' : 
                      sub.status === 'Vencida' ? 'bg-red-50 text-red-600' : 'bg-neutral-100 text-neutral-500'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {sub.appUrl && (
                        <a 
                          href={sub.appUrl.startsWith('http') ? sub.appUrl : `https://${sub.appUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all flex items-center justify-center"
                          title="Abrir Aplicación (Control Creador)"
                        >
                          <ExternalLink size={18} />
                        </a>
                      )}
                      <button 
                        onClick={() => handleWhatsAppBilling(sub)}
                        className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all"
                        title="Enviar Aviso de Pago por WhatsApp"
                      >
                        <MessageSquare size={18} />
                      </button>
                      <button 
                        onClick={() => onGenerateSaleFromSub(sub)}
                        className="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Generar Factura X & Recibo para esta cuota"
                      >
                        <FileCheck size={18} />
                      </button>
                      <button 
                        onClick={() => onEditSubscription(sub)}
                        className="p-2 text-neutral-400 hover:text-brand-orange hover:bg-orange-50 rounded-lg transition-all"
                        title="Editar Suscripción"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => onDeleteSubscription(sub.id)}
                        className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Eliminar Suscripción"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400 italic">
                    No se encontraron suscripciones con los filtros ingresados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
