import React from 'react';
import { motion } from 'motion/react';
import { X, ShoppingCart, Plus, Trash2 } from 'lucide-react';
import { Client, Product, SaleItem, Banner } from '../types';

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
          <h3 className="text-xl font-bold">{editingProduct ? 'Editar Sistema / Producto' : 'Nuevo Sistema / Producto'}</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Nombre de la Aplicación o Sistema</label>
            <input name="name" defaultValue={editingProduct?.name} required className="input-field" placeholder="Ej: Sistema ERP Facturación" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Categoría</label>
              <input name="category" defaultValue={editingProduct?.category || 'Sistemas Empresariales'} required className="input-field" placeholder="Sistemas Empresariales" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">SKU / Código</label>
              <input name="sku" defaultValue={editingProduct?.sku || `SYS-${Math.floor(Math.random() * 900 + 100)}`} required className="input-field" placeholder="ERP-001" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Descripción (Portafolio / Web)</label>
            <textarea 
              name="description" 
              defaultValue={editingProduct?.description || ''} 
              rows={3} 
              className="input-field py-2" 
              placeholder="Escribe un breve resumen de las funciones principales para mostrar a los clientes en el portafolio..." 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Link Demo Online (Opcional)</label>
            <input name="demoUrl" defaultValue={editingProduct?.demoUrl || ''} className="input-field" placeholder="https://demo-sistema.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Precio ($)</label>
              <input name="price" type="number" defaultValue={editingProduct?.price} required className="input-field" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Stock / Cupos</label>
              <input name="stock" type="number" defaultValue={editingProduct?.stock ?? 99} required className="input-field" placeholder="99" />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox" 
              id="inPortfolio" 
              name="inPortfolio" 
              defaultChecked={editingProduct ? editingProduct.inPortfolio !== false : true} 
              className="w-4 h-4 text-brand-orange rounded border-neutral-300 focus:ring-brand-orange"
            />
            <label htmlFor="inPortfolio" className="text-sm font-medium text-neutral-800">
              Mostrar en Portafolio Público (Landing Web)
            </label>
          </div>
          <div className="pt-4">
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
  saleItems: SaleItem[];
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
  onAddItem: (productId: string) => void;
  onRemoveItem: (productId: string) => void;
  onComplete: () => void;
}

export const SaleModal = ({ 
  isOpen, 
  onClose, 
  clients = [], 
  products = [], 
  saleItems = [], 
  selectedClientId, 
  setSelectedClientId, 
  onAddItem, 
  onRemoveItem, 
  onComplete 
}: SaleModalProps) => {
  if (!isOpen) return null;
  const total = (saleItems || []).reduce((acc, item) => acc + (item.total || 0), 0);

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
        <div className="p-8 border-b border-neutral-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-orange/10 text-brand-orange rounded-xl flex items-center justify-center">
              <ShoppingCart size={24} />
            </div>
            <h3 className="text-xl font-bold">Nueva Venta</h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Seleccionar Cliente</label>
              <select 
                value={selectedClientId} 
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="input-field"
              >
                <option value="">Elegir un cliente...</option>
                {(clients || []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Agregar Productos</label>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {(products || []).map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                    <div>
                      <p className="text-sm font-bold">{p.name}</p>
                      <p className="text-xs text-neutral-500">${p.price} | Stock: {p.stock}</p>
                    </div>
                    <button 
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
              {(saleItems || []).map(item => (
                <div key={item.productId} className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm">
                  <div className="flex-1">
                    <p className="text-sm font-bold">{item.productName}</p>
                    <p className="text-xs text-neutral-500">{item.quantity} x ${item.price}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-bold">${item.total}</p>
                    <button onClick={() => onRemoveItem(item.productId)} className="text-rose-500 hover:bg-rose-50 p-1 rounded">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {(saleItems || []).length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-neutral-400 opacity-50">
                  <ShoppingCart size={40} className="mb-2" />
                  <p className="text-sm italic">El carrito está vacío</p>
                </div>
              )}
            </div>
            <div className="pt-4 border-t border-neutral-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-neutral-500 font-medium">Total a Pagar</span>
                <span className="text-2xl font-bold text-brand-orange">${total.toLocaleString()}</span>
              </div>
              <button 
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
