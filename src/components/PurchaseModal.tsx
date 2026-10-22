import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShoppingCart, 
  X, 
  CheckCircle2, 
  MessageCircle, 
  CreditCard, 
  Building, 
  Copy, 
  Check 
} from 'lucide-react';
import { Product } from '../types';

interface PurchaseModalProps {
  product: Product | null;
  onClose: () => void;
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({ product, onClose }) => {
  const [buyPaymentMethod, setBuyPaymentMethod] = useState<'whatsapp' | 'transfer' | 'invoice'>('whatsapp');
  const [copiedBankField, setCopiedBankField] = useState<string | null>(null);
  const [orderName, setOrderName] = useState('');
  const [orderPhone, setOrderPhone] = useState('');
  const [orderEmail, setOrderEmail] = useState('');
  const [orderCompany, setOrderCompany] = useState('');

  if (!product) return null;

  const handleCopyBank = async (text: string, keyName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedBankField(keyName);
      setTimeout(() => setCopiedBankField(null), 2500);
    } catch (e) {
      console.error('Error copying text:', e);
    }
  };

  const handleBuyWhatsApp = (app: Product, extraDetails?: string) => {
    const subText = app.hasSubscription && app.subscriptionPrice 
      ? ` (+ Mantenimiento: $${app.subscriptionPrice.toLocaleString()} / ${app.subscriptionPeriod || 'Mensual'})` 
      : '';
    const details = extraDetails ? `\n\nMis datos:\n${extraDetails}` : '';
    const text = encodeURIComponent(
      `¡Hola Nova AJ! Quiero comprar la aplicación "${app.name}" (SKU: ${app.sku}) por $${app.price.toLocaleString()}${subText}.${details}\n\nPor favor, envíame los pasos para el pago, instalación y entrega del sistema.`
    );
    window.open(`https://wa.me/5493815043132?text=${text}`, '_blank');
  };

  const handleOrderFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clientDetails = [
      orderName ? `• Nombre: ${orderName}` : '',
      orderCompany ? `• Empresa / Negocio: ${orderCompany}` : '',
      orderPhone ? `• Teléfono: ${orderPhone}` : '',
      orderEmail ? `• Email: ${orderEmail}` : '',
    ].filter(Boolean).join('\n');

    handleBuyWhatsApp(product, clientDetails);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" 
      />

      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 15 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="glass-card w-full max-w-xl p-6 sm:p-8 relative z-10 max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl text-neutral-900"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-5 pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-orange/10 text-brand-orange rounded-2xl flex items-center justify-center shadow-inner">
              <ShoppingCart size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-[10px] font-mono font-bold">
                  {product.sku}
                </span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold uppercase">
                  Entrega Inmediata
                </span>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mt-1 leading-snug">
                {product.name}
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-neutral-400 hover:text-neutral-600 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Price Box */}
        <div className="p-4 bg-gradient-to-br from-orange-50/70 via-amber-50/40 to-neutral-50 rounded-2xl border border-orange-200/80 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Inversión Total del Sistema</span>
            <div className="text-left sm:text-right">
              <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
                ${product.price.toLocaleString()}
              </span>
              <span className="text-xs text-neutral-500 font-semibold ml-1">ARS</span>
            </div>
          </div>
          {product.hasSubscription && product.subscriptionPrice ? (
            <div className="text-xs font-bold text-brand-orange bg-white px-2.5 py-1 rounded-lg border border-orange-100 inline-block mb-3">
              + ${product.subscriptionPrice.toLocaleString()} / {product.subscriptionPeriod || 'Mensual'} (Mantenimiento, soporte y actualizaciones)
            </div>
          ) : null}

          {/* What is included */}
          <div className="space-y-1.5 pt-2 border-t border-orange-200/50 text-xs text-neutral-700 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
              <span>Licencia de uso del sistema y configuración inicial completa</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
              <span>Credenciales privadas de Administrador y Creador</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
              <span>Base de datos en la nube y acceso multidispositivo (PC, Tablet y Móvil)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
              <span>Capacitación y soporte post-instalación de Nova AJ</span>
            </div>
          </div>
        </div>

        {/* Methods Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl mb-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setBuyPaymentMethod('whatsapp')}
            className={`flex-1 py-2 px-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              buyPaymentMethod === 'whatsapp' ? 'bg-white text-emerald-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <MessageCircle size={15} />
            <span>WhatsApp (Directo)</span>
          </button>
          <button
            type="button"
            onClick={() => setBuyPaymentMethod('transfer')}
            className={`flex-1 py-2 px-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              buyPaymentMethod === 'transfer' ? 'bg-white text-brand-orange shadow-sm' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <CreditCard size={15} />
            <span>Transferencia Bancaria</span>
          </button>
          <button
            type="button"
            onClick={() => setBuyPaymentMethod('invoice')}
            className={`flex-1 py-2 px-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              buyPaymentMethod === 'invoice' ? 'bg-white text-indigo-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Building size={15} />
            <span>Datos & Factura</span>
          </button>
        </div>

        {/* Tab 1: WhatsApp Checkout */}
        {buyPaymentMethod === 'whatsapp' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-xs text-emerald-950 leading-relaxed">
              <p className="font-semibold mb-1">Coordinación directa e instantánea:</p>
              <p>Al hacer clic en el botón inferior, se abrirá WhatsApp con el mensaje listo para coordinar el pago, factura y la entrega de tu sistema con el equipo de Nova AJ.</p>
            </div>

            <button
              type="button"
              onClick={() => handleBuyWhatsApp(product)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 active:scale-95 text-sm"
            >
              <MessageCircle size={18} />
              <span>Comprar por WhatsApp (${product.price.toLocaleString()})</span>
            </button>
          </div>
        )}

        {/* Tab 2: Bank Transfer */}
        {buyPaymentMethod === 'transfer' && (
          <div className="space-y-3">
            <p className="text-xs text-neutral-600 font-medium">
              Realiza la transferencia por el importe de <strong>${product.price.toLocaleString()}</strong> a los siguientes datos:
            </p>

            <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200/80 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase block">Alias CBU</span>
                  <span className="font-mono font-bold text-neutral-900 text-sm">NOVA.AJ.SISTEMAS</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyBank('NOVA.AJ.SISTEMAS', 'alias')}
                  className="px-2.5 py-1 text-xs font-semibold text-brand-orange bg-orange-50 hover:bg-orange-100 rounded-lg flex items-center gap-1"
                >
                  {copiedBankField === 'alias' ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                  <span>{copiedBankField === 'alias' ? 'Copiado' : 'Copiar Alias'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-200/60">
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase block">CBU / CVU</span>
                  <span className="font-mono font-bold text-neutral-800 text-xs">0720000788000036281902</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyBank('0720000788000036281902', 'cbu')}
                  className="px-2.5 py-1 text-xs font-semibold text-neutral-700 bg-neutral-200/70 hover:bg-neutral-200 rounded-lg flex items-center gap-1"
                >
                  {copiedBankField === 'cbu' ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                  <span>{copiedBankField === 'cbu' ? 'Copiado' : 'Copiar CBU'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-200/60 text-[11px] text-neutral-600">
                <div>
                  <span className="text-[10px] text-neutral-400 block font-bold">Titular:</span>
                  <span className="font-semibold text-neutral-800">Nova AJ Soluciones</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block font-bold">CUIT:</span>
                  <span className="font-mono text-neutral-800">30-71649281-9</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleBuyWhatsApp(product, 'He realizado o deseo confirmar la transferencia bancaria por este sistema.')}
              className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-3.5 px-5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/20 active:scale-95 text-sm"
            >
              <MessageCircle size={18} />
              <span>Enviar Comprobante por WhatsApp</span>
            </button>
          </div>
        )}

        {/* Tab 3: Formal order details form */}
        {buyPaymentMethod === 'invoice' && (
          <form onSubmit={handleOrderFormSubmit} className="space-y-3">
            <p className="text-xs text-neutral-600">
              Ingresa tus datos de facturación o contacto para registrar la compra oficial de <strong>{product.name}</strong>:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Nombre y Apellido</label>
                <input
                  required
                  value={orderName}
                  onChange={(e) => setOrderName(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  className="input-field py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Empresa / Negocio</label>
                <input
                  value={orderCompany}
                  onChange={(e) => setOrderCompany(e.target.value)}
                  placeholder="Ej: Ferretería Central"
                  className="input-field py-1.5 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Teléfono / WhatsApp</label>
                <input
                  required
                  value={orderPhone}
                  onChange={(e) => setOrderPhone(e.target.value)}
                  placeholder="+54 9 11..."
                  className="input-field py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">Email de Facturación</label>
                <input
                  type="email"
                  value={orderEmail}
                  onChange={(e) => setOrderEmail(e.target.value)}
                  placeholder="facturacion@empresa.com"
                  className="input-field py-1.5 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 active:scale-95 text-sm pt-2"
            >
              <MessageCircle size={18} />
              <span>Confirmar Pedido y Abrir WhatsApp</span>
            </button>
          </form>
        )}

        {/* Footer close */}
        <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
          <span>Soporte e instalación garantizada</span>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-800 font-semibold underline"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </div>
  );
};
