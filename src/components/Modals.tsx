import React from 'react';
import { motion } from 'motion/react';
import { X, ShoppingCart, Plus, Trash2, Key, ShieldCheck, Sparkles, Globe, Eye, EyeOff, Lock, FileText, Folder, GitBranch, Cloud, Bot, Check, CheckCircle2, Loader2, Layers, UserCheck, Percent } from 'lucide-react';
import { Client, Product, SaleItem, Banner, ProductPlan, Seller } from '../types';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  editingClient: Client | null;
}

export const ClientModal = ({ isOpen, onClose, onSubmit, editingClient }: ClientModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" 
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="glass-card w-full max-w-md p-6 sm:p-8 relative z-10 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">{editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Nombre Completo</label>
            <input name="name" defaultValue={editingClient?.name} required className="input-field" placeholder="Ej: Juan Pérez" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
            <input name="email" type="email" defaultValue={editingClient?.email} required className="input-field" placeholder="juan@ejemplo.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Teléfono</label>
              <input name="phone" defaultValue={editingClient?.phone} className="input-field" placeholder="+54 11..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Dirección</label>
              <input name="address" defaultValue={editingClient?.address} className="input-field" placeholder="Calle 123..." />
            </div>
          </div>
          <div className="pt-4">
            <button type="submit" className="btn-primary w-full justify-center py-3">
              {editingClient ? 'Guardar Cambios' : 'Crear Cliente'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  editingProduct: Product | null;
}

export const ProductModal = ({ isOpen, onClose, onSubmit, editingProduct }: ProductModalProps) => {
  const [hasSub, setHasSub] = React.useState<boolean>(editingProduct?.hasSubscription || false);
  const [showAdminPassword, setShowAdminPassword] = React.useState(false);
  const [showCreatorPassword, setShowCreatorPassword] = React.useState(false);
  const [isCredentialsOpen, setIsCredentialsOpen] = React.useState(true);
  const [isDevOpsOpen, setIsDevOpsOpen] = React.useState(true);

  // Form field states
  const [name, setName] = React.useState(editingProduct?.name || '');
  const [category, setCategory] = React.useState(editingProduct?.category || 'Sistemas Empresariales');
  const [description, setDescription] = React.useState(editingProduct?.description || '');
  const [price, setPrice] = React.useState<number | string>(editingProduct?.price || 25000);
  const [tagline, setTagline] = React.useState(editingProduct?.tagline || '');
  const [targetAudience, setTargetAudience] = React.useState(editingProduct?.targetAudience || '');
  const [inPortfolio, setInPortfolio] = React.useState<boolean>(editingProduct ? editingProduct.inPortfolio !== false : true);

  // AI Copy Generator state
  const [isAiCopyOpen, setIsAiCopyOpen] = React.useState(false);
  const [aiCopyTone, setAiCopyTone] = React.useState<'persuasive' | 'features' | 'compact' | 'professional'>('persuasive');
  const [isGeneratingCopy, setIsGeneratingCopy] = React.useState(false);
  const [copyToast, setCopyToast] = React.useState('');
  const [aiSuggestions, setAiSuggestions] = React.useState<{ tagline?: string; targetAudience?: string; benefits?: string[] } | null>(null);

  // 3 Planes con distintos precios y lo que lleva cada uno
  const [plans, setPlans] = React.useState<ProductPlan[]>(() => {
    if (editingProduct?.plans && editingProduct.plans.length === 3) {
      return editingProduct.plans;
    }
    const base = Number(editingProduct?.price) || 25000;
    return [
      {
        id: 'plan-1',
        name: 'Plan Inicial / Básico',
        price: Math.max(5000, Math.round((base * 0.7) / 1000) * 1000),
        period: 'Pago Único',
        badge: 'Económico',
        isPopular: false,
        description: 'Ideal para comercios que comienzan a digitalizarse con funciones esenciales.',
        features: [
          '1 Puesto de Venta / Usuario',
          'Control de inventario y stock base',
          'Registro rápido de ventas y clientes',
          'Comprobantes y tickets en PDF / Térmico',
          'Soporte técnico estándar vía WhatsApp'
        ]
      },
      {
        id: 'plan-2',
        name: 'Plan Pro Comercial',
        price: base,
        period: 'Pago Único',
        badge: 'Más Vendido',
        isPopular: true,
        description: 'El paquete más completo y recomendado para operar todo el negocio sin límites.',
        features: [
          'Hasta 3 Puestos de Venta en simultáneo',
          'Alertas automáticas de faltantes de stock',
          'Cuentas corrientes, deudas y saldos de clientes',
          'Caja diaria con apertura, cierre y arqueo',
          'Reportes de facturación y rentabilidad en vivo',
          'Instalación y acompañamiento 1 a 1 de Nova AJ'
        ]
      },
      {
        id: 'plan-3',
        name: 'Plan Full Enterprise',
        price: Math.round((base * 1.6) / 1000) * 1000,
        period: 'Pago Único',
        badge: 'Completo',
        isPopular: false,
        description: 'Para empresas consolidadas, múltiples sucursales o franquicias con soporte prioritario.',
        features: [
          'Usuarios y puestos de venta ilimitados',
          'Múltiples sucursales o depósitos sincronizados',
          'Auditoría completa de cajeros y roles de empleados',
          'Acceso al repositorio GitHub y despliegue Vercel',
          'Capacitación al personal y soporte prioritario 24/7',
          'Personalizaciones de módulos y reportes a medida'
        ]
      }
    ];
  });

  const [activePlanIdx, setActivePlanIdx] = React.useState<number>(1);
  const [isGeneratingPlans, setIsGeneratingPlans] = React.useState(false);
  const [newFeatureText, setNewFeatureText] = React.useState('');

  React.useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name || '');
      setCategory(editingProduct.category || 'Sistemas Empresariales');
      setDescription(editingProduct.description || '');
      setPrice(editingProduct.price || 25000);
      setTagline(editingProduct.tagline || '');
      setTargetAudience(editingProduct.targetAudience || '');
      setHasSub(editingProduct.hasSubscription || false);
      setInPortfolio(editingProduct.inPortfolio !== false);
      if (editingProduct.plans && editingProduct.plans.length === 3) {
        setPlans(editingProduct.plans);
      }
    } else {
      setName('');
      setCategory('Sistemas Empresariales');
      setDescription('');
      setPrice(25000);
      setTagline('');
      setTargetAudience('');
      setHasSub(false);
      setInPortfolio(true);
    }
  }, [editingProduct, isOpen]);

  const handleGenerateAiCopy = async () => {
    setIsGeneratingCopy(true);
    setCopyToast('');
    try {
      const res = await fetch('/api/gemini/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || 'Sistema de Gestión',
          category: category || 'Sistemas Empresariales',
          draftText: description,
          style: aiCopyTone,
        }),
      });
      const data = await res.json();
      if (data?.copy) {
        setDescription(data.copy);
        setAiSuggestions({
          tagline: data.tagline,
          targetAudience: data.targetAudience,
          benefits: data.benefits,
        });
        setCopyToast('¡Copy comercial generado e insertado con IA!');
        setTimeout(() => setCopyToast(''), 4500);
      }
    } catch (err) {
      console.error('Error generating AI copy:', err);
      setCopyToast('Error de conexión al generar copy.');
    } finally {
      setIsGeneratingCopy(false);
    }
  };

  const handleGenerateAiPlans = async () => {
    setIsGeneratingPlans(true);
    setCopyToast('');
    try {
      const res = await fetch('/api/gemini/generate-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || 'Sistema de Gestión',
          category: category || 'Sistemas Empresariales',
          basePrice: Number(price) || 25000,
        }),
      });
      const data = await res.json();
      if (data?.plans && Array.isArray(data.plans) && data.plans.length === 3) {
        setPlans(data.plans);
        setCopyToast('¡3 planes con precios y módulos sugeridos por la IA!');
        setTimeout(() => setCopyToast(''), 4500);
      }
    } catch (err) {
      console.error('Error generating AI plans:', err);
    } finally {
      setIsGeneratingPlans(false);
    }
  };

  const updatePlan = (idx: number, field: keyof ProductPlan, val: any) => {
    setPlans(prev => prev.map((p, i) => i === idx ? { ...p, [field]: val } : p));
  };

  const addFeatureToPlan = (idx: number) => {
    if (!newFeatureText.trim()) return;
    setPlans(prev => prev.map((p, i) => i === idx ? { ...p, features: [...(p.features || []), newFeatureText.trim()] } : p));
    setNewFeatureText('');
  };

  const removeFeatureFromPlan = (planIdx: number, featureIdx: number) => {
    setPlans(prev => prev.map((p, i) => i === planIdx ? { ...p, features: p.features.filter((_, fi) => fi !== featureIdx) } : p));
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" 
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="glass-card w-full max-w-2xl p-6 sm:p-8 relative z-10 max-h-[92vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold">{editingProduct ? 'Editar Sistema / Producto' : 'Nuevo Sistema / Producto'}</h3>
            <p className="text-xs text-neutral-500 mt-0.5">Configura detalles del producto, suscripción y credenciales de acceso</p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg hover:bg-neutral-100">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Nombre de la Aplicación o Sistema</label>
            <input 
              name="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className="input-field" 
              placeholder="Ej: CRM FERRETERIA" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Categoría</label>
              <input 
                name="category" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                required 
                className="input-field" 
                placeholder="Sistemas Ferreterias" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">SKU / Código</label>
              <input 
                name="sku" 
                defaultValue={editingProduct?.sku || `SYS-${Math.floor(Math.random() * 900 + 100)}`} 
                required 
                className="input-field font-mono" 
                placeholder="fer-251" 
              />
            </div>
          </div>

          {/* Campo Descripción (Portafolio / Web) con Asistente IA Copywriter */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-neutral-700">
                Descripción (Portafolio / Web)
              </label>
              <button
                type="button"
                onClick={() => setIsAiCopyOpen(!isAiCopyOpen)}
                className="px-2.5 py-1 text-xs font-bold text-brand-orange bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <Sparkles size={13} className="text-brand-orange" />
                <span>{isAiCopyOpen ? 'Ocultar Asistente IA' : '✨ Generar Copy con IA'}</span>
              </button>
            </div>

            {/* Asistente IA para Redacción de Copy */}
            {isAiCopyOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 p-3.5 bg-gradient-to-br from-orange-50/90 via-amber-50/60 to-orange-50/90 border border-brand-orange/30 rounded-2xl space-y-3 shadow-inner"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                    <Bot size={15} className="text-brand-orange" />
                    Enfoque del copy para vender en redes:
                  </span>
                  <span className="text-[10px] text-neutral-500 font-semibold bg-white/80 px-2 py-0.5 rounded-md border border-neutral-200">
                    Gemini 3.8 Flash
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                  {[
                    { id: 'persuasive', label: '🚀 Ventas / Redes', desc: 'Psicología comercial' },
                    { id: 'features', label: '🛠️ Módulos Clave', desc: 'Funcionalidades' },
                    { id: 'compact', label: '⚡ Rápido y Corto', desc: 'Directo al grano' },
                    { id: 'professional', label: '💼 Corporativo', desc: 'Formal y B2B' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setAiCopyTone(t.id as any)}
                      className={`p-2 rounded-xl text-left border transition-all ${
                        aiCopyTone === t.id
                          ? 'bg-brand-orange text-white border-brand-orange shadow-md shadow-brand-orange/20 font-bold'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:border-orange-300 font-medium'
                      }`}
                    >
                      <div className="text-[11px] leading-tight truncate">{t.label}</div>
                      <div className={`text-[9px] mt-0.5 truncate ${aiCopyTone === t.id ? 'text-orange-100' : 'text-neutral-400'}`}>
                        {t.desc}
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleGenerateAiCopy}
                  disabled={isGeneratingCopy}
                  className="w-full py-2.5 px-3 bg-brand-orange hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-brand-orange/20 disabled:opacity-50"
                >
                  {isGeneratingCopy ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Redactando copy comercial con IA...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={15} />
                      <span>Generar Copy de Alto Impacto para {name || 'este sistema'}</span>
                    </>
                  )}
                </button>

                {/* Sugerencias de Eslogan y Público */}
                {aiSuggestions && (
                  <div className="pt-2 border-t border-orange-200/60 text-xs space-y-1.5">
                    {aiSuggestions.tagline && (
                      <div className="flex items-center justify-between bg-white/90 p-2 rounded-xl border border-orange-200/60">
                        <span className="text-[11px] text-neutral-700 truncate flex-1">
                          <strong>Eslogan sugerido:</strong> {aiSuggestions.tagline}
                        </span>
                        <button
                          type="button"
                          onClick={() => setTagline(aiSuggestions.tagline || '')}
                          className="text-[10px] text-brand-orange font-bold hover:underline shrink-0 ml-2"
                        >
                          Usar en Tagline
                        </button>
                      </div>
                    )}
                    {aiSuggestions.targetAudience && (
                      <div className="flex items-center justify-between bg-white/90 p-2 rounded-xl border border-orange-200/60">
                        <span className="text-[11px] text-neutral-700 truncate flex-1">
                          <strong>Público sugerido:</strong> {aiSuggestions.targetAudience}
                        </span>
                        <button
                          type="button"
                          onClick={() => setTargetAudience(aiSuggestions.targetAudience || '')}
                          className="text-[10px] text-brand-orange font-bold hover:underline shrink-0 ml-2"
                        >
                          Usar en Público
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {copyToast && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-2 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-1.5 font-semibold"
              >
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <span>{copyToast}</span>
              </motion.div>
            )}

            <textarea 
              name="description" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3} 
              className="input-field py-2 text-sm leading-relaxed" 
              placeholder="Escribe o genera con IA un resumen comercial para captar clientes en redes y catálogo..." 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1 flex items-center gap-1.5">
              <Globe size={15} className="text-neutral-400" />
              Link Demo Online Público (Opcional)
            </label>
            <input name="demoUrl" defaultValue={editingProduct?.demoUrl || ''} className="input-field" placeholder="https://demo-sistema.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Precio Venta ($)</label>
              <input 
                name="price" 
                type="number" 
                value={price} 
                onChange={(e) => setPrice(Number(e.target.value) || 0)} 
                required 
                className="input-field" 
                placeholder="0.00" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Stock / Cupos</label>
              <input name="stock" type="number" defaultValue={editingProduct?.stock ?? 99} required className="input-field" placeholder="99" />
            </div>
          </div>

          {/* Subscription Checkbox and Fields */}
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-3">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="hasSubscription" 
                name="hasSubscription" 
                checked={hasSub}
                onChange={(e) => setHasSub(e.target.checked)}
                className="w-4 h-4 text-brand-orange rounded border-neutral-300 focus:ring-brand-orange"
              />
              <label htmlFor="hasSubscription" className="text-sm font-bold text-neutral-800">
                ¿Incluye Suscripción / Mantenimiento Periódico?
              </label>
            </div>

            {hasSub && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-200/60"
              >
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Precio Suscripción ($)</label>
                  <input 
                    name="subscriptionPrice" 
                    type="number" 
                    defaultValue={editingProduct?.subscriptionPrice || 0} 
                    required={hasSub}
                    className="input-field py-1.5 text-sm" 
                    placeholder="Ej: 5000" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Periodo de Cobro</label>
                  <select 
                    name="subscriptionPeriod" 
                    defaultValue={editingProduct?.subscriptionPeriod || 'Mensual'} 
                    className="input-field py-1.5 text-sm bg-white"
                  >
                    <option value="Mensual">Mensual</option>
                    <option value="Semestral">Semestral</option>
                    <option value="Anual">Anual</option>
                  </select>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sector de Contraseñas y Accesos (Admin / Creador) */}
          <div className="p-4 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-amber-500/10 rounded-2xl border border-amber-300/40 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold">
                  <Key size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    Sector de Contraseñas & Accesos
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded uppercase">
                      Privado
                    </span>
                  </h4>
                  <p className="text-[11px] text-neutral-500">Credenciales para ingresar como Administrador o Creador</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCredentialsOpen(!isCredentialsOpen)}
                className="text-xs text-amber-700 hover:text-amber-900 font-semibold underline"
              >
                {isCredentialsOpen ? 'Ocultar campos' : 'Mostrar campos'}
              </button>
            </div>

            {isCredentialsOpen && (
              <div className="space-y-3.5 pt-1">
                {/* Login URL */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1 flex items-center gap-1.5">
                    <Globe size={14} className="text-amber-600" />
                    URL de Ingreso al Panel / Login
                  </label>
                  <input 
                    name="adminLoginUrl" 
                    type="url"
                    defaultValue={editingProduct?.adminLoginUrl || ''} 
                    className="input-field py-2 text-sm bg-white" 
                    placeholder="https://su-sistema.com/admin o /login" 
                  />
                </div>

                {/* Acceso Administrador */}
                <div className="p-3.5 bg-white/95 rounded-xl border border-emerald-200/80 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                      <ShieldCheck size={16} className="text-emerald-600" />
                      <span>Acceso Administrador</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-medium">Dueño del negocio / Gerente</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Usuario / Email Admin</label>
                      <input 
                        name="adminUser" 
                        defaultValue={editingProduct?.adminUser || ''} 
                        className="input-field py-1.5 text-xs font-mono" 
                        placeholder="admin@empresa.com o admin" 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Contraseña Admin</label>
                      <div className="relative">
                        <input 
                          name="adminPassword" 
                          type={showAdminPassword ? "text" : "password"}
                          defaultValue={editingProduct?.adminPassword || ''} 
                          className="input-field py-1.5 text-xs font-mono pr-9" 
                          placeholder="••••••••" 
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowAdminPassword(!showAdminPassword)} 
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                          title={showAdminPassword ? "Ocultar" : "Mostrar"}
                        >
                          {showAdminPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Acceso Creador */}
                <div className="p-3.5 bg-white/95 rounded-xl border border-orange-200/80 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-orange-950">
                      <Sparkles size={16} className="text-brand-orange" />
                      <span>Acceso Creador / Master / Superadmin</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-medium">Control total / Desarrollo</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Usuario Creador</label>
                      <input 
                        name="creatorUser" 
                        defaultValue={editingProduct?.creatorUser || ''} 
                        className="input-field py-1.5 text-xs font-mono" 
                        placeholder="creador@nova-aj.app" 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Contraseña Creador</label>
                      <div className="relative">
                        <input 
                          name="creatorPassword" 
                          type={showCreatorPassword ? "text" : "password"}
                          defaultValue={editingProduct?.creatorPassword || ''} 
                          className="input-field py-1.5 text-xs font-mono pr-9" 
                          placeholder="••••••••" 
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowCreatorPassword(!showCreatorPassword)} 
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                          title={showCreatorPassword ? "Ocultar" : "Mostrar"}
                        >
                          {showCreatorPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notas de Acceso / PIN / Servidor */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1 flex items-center gap-1.5">
                    <FileText size={14} className="text-neutral-400" />
                    Notas Técnicas, PIN de Caja o Tokens de Acceso (Opcional)
                  </label>
                  <textarea 
                    name="accessNotes" 
                    defaultValue={editingProduct?.accessNotes || ''} 
                    rows={2} 
                    className="input-field py-1.5 text-xs bg-white" 
                    placeholder="Ej: PIN de caja: 1234. Llave maestra de recuperación. Base de datos en puerto 5432..." 
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sector de Organización de Desarrollo: PC, GitHub, Vercel & AI Studio */}
          <div className="p-4 bg-gradient-to-br from-indigo-500/5 via-sky-500/5 to-slate-500/10 rounded-2xl border border-indigo-200/70 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-700 flex items-center justify-center font-bold">
                  <GitBranch size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    Organización DevOps & Repositorios
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded uppercase">
                      GitHub & Deploy
                    </span>
                  </h4>
                  <p className="text-[11px] text-neutral-500">Carpeta local en tu PC, GitHub, Vercel y cuenta creadora de AI Studio</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDevOpsOpen(!isDevOpsOpen)}
                className="text-xs text-indigo-700 hover:text-indigo-900 font-semibold underline"
              >
                {isDevOpsOpen ? 'Ocultar campos' : 'Mostrar campos'}
              </button>
            </div>

            {isDevOpsOpen && (
              <div className="space-y-3.5 pt-1">
                {/* Carpeta en PC */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Folder size={14} className="text-indigo-600" />
                      Carpeta de mi PC conectada a GitHub
                    </span>
                    <span className="text-[10px] text-neutral-400 font-normal">Ruta local de tu disco</span>
                  </label>
                  <input 
                    name="localFolderPath" 
                    defaultValue={editingProduct?.localFolderPath || ''} 
                    className="input-field py-2 text-xs font-mono bg-white text-neutral-800 placeholder:text-neutral-400" 
                    placeholder="Ej: C:\Proyectos\Nova-AJ\mi-sistema o /home/usuario/proyectos/mi-sistema" 
                  />
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Guarda la ruta de la carpeta donde tienes el código para copiarla rápidamente a tu terminal o editor.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Repositorio GitHub */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1 flex items-center gap-1.5">
                      <GitBranch size={14} className="text-neutral-800" />
                      Nombre de Repositorio GitHub
                    </label>
                    <input 
                      name="githubRepo" 
                      defaultValue={editingProduct?.githubRepo || ''} 
                      className="input-field py-2 text-xs font-mono bg-white text-neutral-800" 
                      placeholder="usuario/nombre-del-repo" 
                    />
                  </div>

                  {/* Proyecto Vercel */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1 flex items-center gap-1.5">
                      <Cloud size={14} className="text-sky-600" />
                      Nombre de Proyecto Vercel
                    </label>
                    <input 
                      name="vercelProject" 
                      defaultValue={editingProduct?.vercelProject || ''} 
                      className="input-field py-2 text-xs font-mono bg-white text-neutral-800" 
                      placeholder="nombre-proyecto-vercel" 
                    />
                  </div>
                </div>

                {/* Usuario Google AI Studio */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Bot size={14} className="text-indigo-600" />
                      Usuario / Cuenta de AI Studio Creadora
                    </span>
                    <span className="text-[10px] text-neutral-400 font-normal">Cuenta de Google asociada</span>
                  </label>
                  <input 
                    name="aiStudioAccount" 
                    defaultValue={editingProduct?.aiStudioAccount || 'ajnovasistemas@gmail.com'} 
                    className="input-field py-2 text-xs font-mono bg-white text-neutral-800" 
                    placeholder="ajnovasistemas@gmail.com" 
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sector Ficha de Venta y Publicidad en Redes Sociales */}
          <div className="p-4 bg-gradient-to-br from-orange-500/5 via-amber-500/5 to-rose-500/5 rounded-2xl border border-orange-200/80 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-orange/20 text-brand-orange flex items-center justify-center font-bold">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    Ficha de Venta & Publicidad en Redes
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-[10px] font-bold rounded uppercase">
                      Marketing
                    </span>
                  </h4>
                  <p className="text-[11px] text-neutral-500">Datos para la página de venta que verá el cliente desde anuncios</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Propuesta de Valor / Frase Gancho (Tagline)
                </label>
                <input 
                  name="tagline" 
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="input-field py-1.5 text-xs bg-white" 
                  placeholder="Ej: Automatiza tus ventas, evita faltantes y controla tu stock desde el celular" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Precio Regular Tachado ($) (Efecto Oferta)
                  </label>
                  <input 
                    name="originalPrice" 
                    type="number"
                    defaultValue={editingProduct?.originalPrice || ''} 
                    className="input-field py-1.5 text-xs bg-white" 
                    placeholder="Ej: 120000" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Insignia / Badge de Venta
                  </label>
                  <input 
                    name="badge" 
                    defaultValue={editingProduct?.badge || 'Oferta Especial Redes'} 
                    className="input-field py-1.5 text-xs bg-white" 
                    placeholder="Ej: Más Vendido / Oferta Redes" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Público Objetivo / Rubros Ideales
                </label>
                <input 
                  name="targetAudience" 
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="input-field py-1.5 text-xs bg-white" 
                  placeholder="Ej: Ferreterías, distribuidoras, comercios mayoristas y minoristas" 
                />
              </div>
            </div>
          </div>

          {/* Sector de 3 Planes de Precios y Módulos */}
          <div className="p-4 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/10 rounded-2xl border border-emerald-300/60 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center font-bold">
                  <Layers size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    Planes de Precios (3 Niveles / Paquetes)
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded uppercase">
                      3 Opciones
                    </span>
                  </h4>
                  <p className="text-[11px] text-neutral-500">Configura 3 planes con distintos precios y lo que incluye cada uno</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateAiPlans}
                disabled={isGeneratingPlans}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
              >
                {isGeneratingPlans ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Calculando con IA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={13} />
                    <span>✨ Sugerir 3 Planes con IA</span>
                  </>
                )}
              </button>
            </div>

            {/* Selector de Plan (Tab 1, Tab 2, Tab 3) */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-white/80 rounded-xl border border-emerald-200/60">
              {plans.map((p, idx) => (
                <button
                  key={p.id || idx}
                  type="button"
                  onClick={() => setActivePlanIdx(idx)}
                  className={`py-2 px-2 rounded-lg text-center transition-all ${
                    activePlanIdx === idx
                      ? 'bg-emerald-600 text-white font-bold shadow-sm'
                      : 'text-neutral-600 hover:bg-neutral-100 font-medium'
                  }`}
                >
                  <div className="text-xs truncate">{p.name || `Plan ${idx + 1}`}</div>
                  <div className={`text-[11px] font-mono mt-0.5 font-bold ${activePlanIdx === idx ? 'text-emerald-100' : 'text-emerald-700'}`}>
                    ${(p.price || 0).toLocaleString()}
                  </div>
                </button>
              ))}
            </div>

            {/* Editor del Plan Activo */}
            {plans[activePlanIdx] && (
              <div className="p-3.5 bg-white rounded-xl border border-neutral-200/80 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Nombre del Plan</label>
                    <input
                      type="text"
                      value={plans[activePlanIdx].name}
                      onChange={(e) => updatePlan(activePlanIdx, 'name', e.target.value)}
                      placeholder="Ej: Plan Inicial / Básico"
                      className="input-field py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Precio ($ ARS)</label>
                    <input
                      type="number"
                      value={plans[activePlanIdx].price}
                      onChange={(e) => updatePlan(activePlanIdx, 'price', Number(e.target.value) || 0)}
                      placeholder="0.00"
                      className="input-field py-1.5 text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Modalidad</label>
                    <select
                      value={plans[activePlanIdx].period || 'Pago Único'}
                      onChange={(e) => updatePlan(activePlanIdx, 'period', e.target.value as any)}
                      className="input-field py-1.5 text-xs bg-white"
                    >
                      <option value="Pago Único">Pago Único (Compra)</option>
                      <option value="Mensual">Mensual (Abono)</option>
                      <option value="Anual">Anual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Insignia / Badge</label>
                    <input
                      type="text"
                      value={plans[activePlanIdx].badge || ''}
                      onChange={(e) => updatePlan(activePlanIdx, 'badge', e.target.value)}
                      placeholder="Ej: Más Vendido / Recomendado"
                      className="input-field py-1.5 text-xs"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-4">
                    <input
                      type="checkbox"
                      id={`isPopular-${activePlanIdx}`}
                      checked={Boolean(plans[activePlanIdx].isPopular)}
                      onChange={(e) => {
                        const updated = plans.map((p, i) => ({
                          ...p,
                          isPopular: i === activePlanIdx ? e.target.checked : false
                        }));
                        setPlans(updated);
                      }}
                      className="w-4 h-4 text-emerald-600 rounded border-neutral-300 focus:ring-emerald-500"
                    />
                    <label htmlFor={`isPopular-${activePlanIdx}`} className="text-xs font-bold text-neutral-800 cursor-pointer">
                      Plan Destacado ⭐
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Descripción Breve</label>
                  <input
                    type="text"
                    value={plans[activePlanIdx].description || ''}
                    onChange={(e) => updatePlan(activePlanIdx, 'description', e.target.value)}
                    placeholder="Ej: Ideal para negocios que buscan automatizar caja y stock básico"
                    className="input-field py-1.5 text-xs"
                  />
                </div>

                {/* Lo que lleva / Incluye el plan */}
                <div>
                  <label className="block text-[11px] font-bold text-neutral-800 mb-1.5">
                    Lo que incluye este plan (Módulos y Entregables):
                  </label>
                  
                  <div className="space-y-1.5 mb-2 max-h-40 overflow-y-auto p-1">
                    {(plans[activePlanIdx].features || []).map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 bg-neutral-50 px-2.5 py-1.5 rounded-lg border border-neutral-200/80 text-xs text-neutral-800">
                        <Check size={13} className="text-emerald-600 shrink-0" />
                        <span className="flex-1">{feat}</span>
                        <button
                          type="button"
                          onClick={() => removeFeatureFromPlan(activePlanIdx, fIdx)}
                          className="text-neutral-400 hover:text-red-600 p-0.5"
                          title="Eliminar función"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Agregar nueva función */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeatureText}
                      onChange={(e) => setNewFeatureText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addFeatureToPlan(activePlanIdx);
                        }
                      }}
                      placeholder="Escribe un módulo o función (ej: 2 Puestos de Venta) y presiona Agregar"
                      className="input-field py-1 text-xs flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => addFeatureToPlan(activePlanIdx)}
                      className="px-3 py-1 bg-neutral-900 hover:bg-black text-white rounded-lg text-xs font-bold transition-all"
                    >
                      + Agregar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Hidden Input serializing the 3 plans */}
            <input type="hidden" name="plans" value={JSON.stringify(plans)} />
          </div>

          <div className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
            inPortfolio
              ? 'bg-emerald-50/70 border-emerald-200'
              : 'bg-neutral-100/80 border-neutral-200'
          }`}>
            <input type="hidden" name="inPortfolio" value={inPortfolio ? 'true' : 'false'} />
            <div className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                inPortfolio ? 'bg-emerald-500/20 text-emerald-700' : 'bg-neutral-200 text-neutral-500'
              }`}>
                {inPortfolio ? <Eye size={18} /> : <EyeOff size={18} />}
              </div>
              <div>
                <div className="text-sm font-bold text-neutral-900">
                  {inPortfolio ? 'Aplicación Activa (Visible en Web Pública)' : 'Aplicación Desactivada (Oculta al Público)'}
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {inPortfolio
                    ? 'Los visitantes pueden ver esta aplicación en tu portafolio y abrir su página de venta.'
                    : 'No se mostrará en el portafolio público ni en los enlaces de redes hasta que la vuelvas a activar.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setInPortfolio(!inPortfolio)}
              className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                inPortfolio
                  ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              <span className={`w-7 h-4 rounded-full p-0.5 flex items-center transition-colors ${inPortfolio ? 'bg-white/30 justify-end' : 'bg-neutral-300 justify-start'}`}>
                <span className="w-3 h-3 rounded-full bg-white shadow-sm" />
              </span>
              <span>{inPortfolio ? 'Activada' : 'Desactivada'}</span>
            </button>
          </div>
          <div className="pt-2">
            <button type="submit" className="btn-primary w-full justify-center py-3">
              {editingProduct ? 'Guardar Cambios' : 'Crear Aplicación / Producto'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

interface SaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  products: Product[];
  sellers?: Seller[];
  saleItems: SaleItem[];
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
  selectedSellerId?: string;
  setSelectedSellerId?: (id: string) => void;
  commissionRate?: number;
  setCommissionRate?: (rate: number) => void;
  onAddItem: (productId: string) => void;
  onUpdateItemPrice?: (productId: string, price: number) => void;
  onRemoveItem: (productId: string) => void;
  onComplete: () => void;
}

export const SaleModal = ({ 
  isOpen, 
  onClose, 
  clients = [], 
  products = [], 
  sellers = [],
  saleItems = [], 
  selectedClientId, 
  setSelectedClientId,
  selectedSellerId = '',
  setSelectedSellerId,
  commissionRate = 0,
  setCommissionRate,
  onAddItem,
  onUpdateItemPrice,
  onRemoveItem, 
  onComplete 
}: SaleModalProps) => {
  if (!isOpen) return null;
  const total = (saleItems || []).reduce((acc, item) => acc + (item.total || 0), 0);
  const selectedSeller = sellers.find(s => s.id === selectedSellerId);
  const commissionAmount = selectedSellerId ? Math.round((total * (Number(commissionRate) || 0)) / 100) : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" 
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="glass-card w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative z-10"
      >
        <div className="p-6 sm:p-8 border-b border-neutral-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-orange/10 text-brand-orange rounded-xl flex items-center justify-center">
              <ShoppingCart size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Nueva Venta</h3>
              <p className="text-xs text-neutral-500">Asigna cliente, sistemas vendidos, vendedor y comisión</p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Seleccionar Cliente *</label>
              <select 
                value={selectedClientId} 
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="input-field bg-white"
              >
                <option value="">Elegir un cliente...</option>
                {(clients || []).map((c, idx) => (
                  <option key={`sale-client-${c.id || idx}-${idx}`} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Selector de Vendedor y % Comisión */}
            {setSelectedSellerId && (
              <div className="p-4 bg-orange-50/70 rounded-2xl border border-orange-200/70 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                  <UserCheck size={14} className="text-brand-orange" />
                  Vendedor Asignado (Comisión)
                </label>
                <select
                  value={selectedSellerId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedSellerId(id);
                    const found = sellers.find(s => s.id === id);
                    if (found && setCommissionRate) {
                      setCommissionRate(found.commissionRate);
                    } else if (!id && setCommissionRate) {
                      setCommissionRate(0);
                    }
                  }}
                  className="input-field bg-white py-2 text-sm"
                >
                  <option value="">Venta Directa (Sin vendedor)</option>
                  {sellers.filter(s => s.status === 'Activo' || s.id === selectedSellerId).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.commissionRate}% comisión base)
                    </option>
                  ))}
                </select>

                {selectedSellerId && setCommissionRate && (
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <span className="text-xs font-semibold text-neutral-700 flex items-center gap-1">
                      <Percent size={13} className="text-brand-orange" /> Comisión (%):
                    </span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step="0.5"
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(Number(e.target.value) || 0)}
                      className="input-field bg-white py-1 px-2.5 text-sm font-mono font-bold w-24 text-right"
                    />
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Agregar Sistemas / Productos</label>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {(products || []).map((p, idx) => (
                  <div key={`sale-prod-pick-${p.id || idx}-${idx}`} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                    <div>
                      <p className="text-sm font-bold flex items-center gap-2">
                        <span>{p.name}</span>
                        {p.inPortfolio === false && (
                          <span className="px-1.5 py-0.5 bg-neutral-200 text-neutral-600 text-[10px] rounded font-semibold">
                            Oculta en Web
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-neutral-500">${p.price.toLocaleString()} | Stock: {p.stock}</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => onAddItem(p.id)}
                      disabled={p.stock <= 0}
                      className="p-2 bg-white text-brand-orange rounded-lg border border-neutral-100 hover:bg-brand-orange hover:text-white disabled:opacity-50 transition-all"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-neutral-50 rounded-3xl p-6 flex flex-col">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              Resumen de Venta
              <span className="px-2 py-0.5 bg-brand-orange text-white text-[10px] rounded-full">
                {(saleItems || []).length} items
              </span>
            </h4>
            <div className="flex-1 space-y-3 overflow-y-auto mb-6 pr-2">
              {(saleItems || []).map((item, idx) => (
                <div key={`sale-cart-item-${item.productId}-${idx}`} className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{item.productName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-neutral-500">{item.quantity} x</span>
                      {onUpdateItemPrice ? (
                        <input
                          type="number"
                          min={0}
                          value={item.price}
                          onChange={(e) => onUpdateItemPrice(item.productId, Number(e.target.value) || 0)}
                          className="w-24 px-2 py-0.5 text-xs font-mono font-bold border border-neutral-200 rounded-md focus:border-brand-orange outline-none"
                          title="Editar precio de venta"
                        />
                      ) : (
                        <span className="text-xs text-neutral-500">${item.price.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <p className="text-sm font-bold">${item.total.toLocaleString()}</p>
                    <button type="button" onClick={() => onRemoveItem(item.productId)} className="text-rose-500 hover:bg-rose-50 p-1 rounded">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {(saleItems || []).length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-neutral-400 opacity-50 py-10">
                  <ShoppingCart size={40} className="mb-2" />
                  <p className="text-sm italic">El carrito está vacío</p>
                </div>
              )}
            </div>
            <div className="pt-4 border-t border-neutral-200 space-y-3">
              {selectedSeller && (
                <div className="flex items-center justify-between px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                  <span className="font-semibold text-emerald-900">
                    Comisión {selectedSeller.name} ({commissionRate}%):
                  </span>
                  <span className="font-black text-emerald-700 text-sm">
                    ${commissionAmount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-neutral-500 font-medium">Total a Pagar</span>
                <span className="text-2xl font-bold text-brand-orange">${total.toLocaleString()}</span>
              </div>
              <button 
                type="button"
                onClick={onComplete}
                disabled={!selectedClientId || saleItems.length === 0}
                className="btn-primary w-full justify-center py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Completar Venta
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

interface BannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  editingBanner: Banner | null;
}

export const BannerModal = ({ isOpen, onClose, onSubmit, editingBanner }: BannerModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" 
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="glass-card w-full max-w-md p-6 sm:p-8 relative z-10 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">{editingBanner ? 'Editar Anuncio' : 'Nuevo Anuncio'}</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Título</label>
            <input name="title" defaultValue={editingBanner?.title} required className="input-field" placeholder="Ej: Mensajería Interna" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Descripción</label>
            <textarea name="description" defaultValue={editingBanner?.description} required rows={3} className="input-field resize-none" placeholder="Describe la innovación..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Tipo</label>
              <select name="type" defaultValue={editingBanner?.type || 'Innovation'} className="input-field">
                <option value="Innovation">Innovación</option>
                <option value="Update">Actualización</option>
                <option value="Alert">Aviso</option>
              </select>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input type="checkbox" name="isActive" id="isActive" defaultChecked={editingBanner ? editingBanner.isActive : true} className="w-5 h-5 accent-brand-orange" />
              <label htmlFor="isActive" className="text-sm font-bold text-neutral-700">Activo</label>
            </div>
          </div>
          <div className="pt-4">
            <button type="submit" className="btn-primary w-full justify-center py-3">
              {editingBanner ? 'Guardar Cambios' : 'Crear Anuncio'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
