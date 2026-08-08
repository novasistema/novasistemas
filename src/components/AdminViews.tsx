import React from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingCart, 
  ChevronRight,
  Clock,
  FileText
} from 'lucide-react';
import { Client, Product, Sale, Banner, View } from '../types';

// --- StatCard ---
export const StatCard = ({ title, value, icon: Icon, trend, trendValue }: any) => (
  <div className="glass-card p-6 flex items-center gap-6">
    <div className="w-14 h-14 bg-brand-orange/10 text-brand-orange rounded-2xl flex items-center justify-center">
      <Icon size={28} />
    </div>
    <div>
      <p className="text-sm text-neutral-500 font-medium">{title}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-2xl font-bold text-neutral-900">{value}</h4>
        <span className={`text-xs font-bold flex items-center ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
          {trendValue}
        </span>
      </div>
    </div>
  </div>
);

// --- DashboardView ---
interface DashboardViewProps {
  sales: Sale[];
  clients: Client[];
  products: Product[];
  setView: (v: View) => void;
  setIsSaleModalOpen: (o: boolean) => void;
}

export const DashboardView = ({ sales = [], clients = [], products = [], setView, setIsSaleModalOpen }: DashboardViewProps) => {
  const totalSales = (sales || []).reduce((acc, s) => acc + (s.total || 0), 0);
  const activeClients = (clients || []).length;
  const lowStock = (products || []).filter(p => (p.stock || 0) < 5).length;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Panel de Control</h2>
          <p className="text-neutral-500 mt-1">Resumen general de operaciones y clientes.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setView('landing')} className="btn-secondary">
            Ver Web Pública
          </button>
          <button onClick={() => setIsSaleModalOpen(true)} className="btn-primary">
            <Plus size={20} />
            Nueva Venta
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Ventas Totales" value={`$${totalSales.toLocaleString()}`} icon={TrendingUp} trend="up" trendValue="12.5%" />
        <StatCard title="Clientes Activos" value={activeClients} icon={Users} trend="up" trendValue="3" />
        <StatCard title="Stock Crítico" value={lowStock} icon={Package} trend={lowStock > 0 ? 'down' : 'up'} trendValue={lowStock > 0 ? `${lowStock} prod.` : 'Todo OK'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Ventas Recientes</h3>
            <button onClick={() => setView('sales')} className="text-brand-orange text-sm font-medium flex items-center gap-1 hover:underline">
              Ver todas <ChevronRight size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {(sales || []).slice(0, 5).map(sale => (
              <div key={sale.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-brand-orange border border-neutral-100">
                    <ShoppingCart size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">{sale.clientName}</p>
                    <p className="text-xs text-neutral-500">{new Date(sale.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="font-bold text-neutral-900">${(sale.total || 0).toLocaleString()}</p>
              </div>
            ))}
            {(sales || []).length === 0 && <p className="text-center py-8 text-neutral-400 italic">No hay ventas registradas aún.</p>}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-bold text-lg mb-6">Clientes y Sistemas</h3>
          <div className="space-y-4">
            {(clients || []).slice(0, 5).map(client => (
              <div key={client.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-brand-orange border border-neutral-100">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">{client.name}</p>
                    <p className="text-xs text-neutral-500">{(client.systems || []).length} sistemas</p>
                  </div>
                </div>
                <button onClick={() => setView('clients')} className="text-neutral-400 hover:text-brand-orange">
                  <ChevronRight size={20} />
                </button>
              </div>
            ))}
            {(clients || []).length === 0 && <p className="text-center py-8 text-neutral-400 italic">No hay clientes registrados aún.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- ClientsView ---
interface ClientsViewProps {
  clients: Client[];
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  setEditingClient: (c: Client | null) => void;
  setIsClientModalOpen: (o: boolean) => void;
  handleDeleteClient: (id: string) => void;
}

export const ClientsView = ({ 
  clients, 
  searchTerm, 
  setSearchTerm, 
  setEditingClient, 
  setIsClientModalOpen, 
  handleDeleteClient 
}: ClientsViewProps) => {
  const filtered = (clients || []).filter(c => 
    (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Clientes y Sistemas</h2>
          <p className="text-neutral-500 mt-1">Gestiona clientes y sus aplicaciones asociadas.</p>
        </div>
        <button onClick={() => { setEditingClient(null); setIsClientModalOpen(true); }} className="btn-primary">
          <Plus size={20} />
          Nuevo Cliente
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center gap-3">
          <Search className="text-neutral-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o email..." 
            className="bg-transparent outline-none w-full text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs uppercase text-neutral-400 font-bold border-b border-neutral-100">
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Sistemas / Apps</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map(client => (
                <tr key={client.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium">{client.name}</div>
                    <div className="text-xs text-neutral-400">{client.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {(client.systems || []).map((s, i) => (
                        <span key={i} className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                          s.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
                          s.status === 'Development' ? 'bg-amber-50 text-amber-600' : 'bg-neutral-100 text-neutral-500'
                        }`}>
                          {s.name}
                        </span>
                      ))}
                      {(client.systems || []).length === 0 && <span className="text-xs text-neutral-400 italic">Sin sistemas</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-600 text-sm">
                    <div>{client.phone}</div>
                    <div className="text-xs opacity-60">{client.address}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => { setEditingClient(client); setIsClientModalOpen(true); }}
                        className="p-2 text-neutral-400 hover:text-brand-orange hover:bg-orange-50 rounded-lg transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClient(client.id)}
                        className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- ProductsView ---
interface ProductsViewProps {
  products: Product[];
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  setEditingProduct: (p: Product | null) => void;
  setIsProductModalOpen: (o: boolean) => void;
  handleDeleteProduct: (id: string) => void;
}

export const ProductsView = ({ 
  products, 
  searchTerm, 
  setSearchTerm, 
  setEditingProduct, 
  setIsProductModalOpen, 
  handleDeleteProduct 
}: ProductsViewProps) => {
  const filtered = (products || []).filter(p => 
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.sku || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Sistemas & Aplicaciones (Portafolio)</h2>
          <p className="text-neutral-500 mt-1 text-sm sm:text-base">Administra las aplicaciones que ofreces y su visibilidad en el portafolio público.</p>
        </div>
        <button onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }} className="btn-primary w-full md:w-auto justify-center">
          <Plus size={20} />
          Nueva Aplicación / Producto
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center gap-3">
          <Search className="text-neutral-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nombre, categoría o código..." 
            className="bg-transparent outline-none w-full text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs uppercase text-neutral-400 font-bold border-b border-neutral-100 bg-neutral-50">
                <th className="px-6 py-4">Sistema / Aplicación</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Portafolio Web</th>
                <th className="px-6 py-4">Precio</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map(product => (
                <tr key={product.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-neutral-900">{product.name}</div>
                    {product.description && (
                      <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2 max-w-md">{product.description}</p>
                    )}
                    <div className="text-[11px] text-neutral-400 font-mono mt-1">SKU: {product.sku}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-neutral-100 rounded-lg text-xs font-semibold text-neutral-700">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${
                      product.inPortfolio !== false 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                        : 'bg-neutral-100 text-neutral-400'
                    }`}>
                      {product.inPortfolio !== false ? 'Visible en Web' : 'Oculto'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-neutral-900">${product.price.toLocaleString()}</div>
                    {product.hasSubscription && product.subscriptionPrice ? (
                      <div className="text-[11px] font-medium text-brand-orange mt-0.5">
                        +${product.subscriptionPrice.toLocaleString()} / {product.subscriptionPeriod || 'Mensual'}
                      </div>
                    ) : (
                      <div className="text-[11px] text-neutral-400">Sin suscripción</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => { setEditingProduct(product); setIsProductModalOpen(true); }}
                        className="p-2 text-neutral-400 hover:text-brand-orange hover:bg-orange-50 rounded-lg transition-all"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-400 italic">
                    No se encontraron sistemas o productos.
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

// --- SalesView ---
interface SalesViewProps {
  sales: Sale[];
  setIsSaleModalOpen: (o: boolean) => void;
  onViewInvoice: (s: Sale) => void;
}

export const SalesView = ({ sales, setIsSaleModalOpen, onViewInvoice }: SalesViewProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Ventas</h2>
          <p className="text-neutral-500 mt-1">Historial de transacciones y facturación.</p>
        </div>
        <button onClick={() => setIsSaleModalOpen(true)} className="btn-primary">
          <Plus size={20} />
          Nueva Venta
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs uppercase text-neutral-400 font-bold border-b border-neutral-100">
                <th className="px-6 py-4">ID Venta</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {(sales || []).map(sale => (
                <tr key={sale.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-neutral-500">#{sale.id.slice(-6)}</td>
                  <td className="px-6 py-4 text-neutral-600">{new Date(sale.date).toLocaleString()}</td>
                  <td className="px-6 py-4 font-medium">{sale.clientName}</td>
                  <td className="px-6 py-4 text-neutral-600">
                    {(sale.items || []).length} {(sale.items || []).length === 1 ? 'producto' : 'productos'}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-neutral-900">
                    ${(sale.total || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onViewInvoice(sale)}
                      className="p-2 text-neutral-400 hover:text-brand-orange hover:bg-orange-50 rounded-lg transition-all"
                      title="Ver Factura X / Recibo"
                    >
                      <FileText size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(sales || []).length === 0 && (
            <div className="py-12 text-center text-neutral-400">
              No hay ventas registradas aún.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- BannersView ---
interface BannersViewProps {
  banners: Banner[];
  onEdit: (b: Banner) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export const BannersView = ({ banners, onEdit, onDelete, onAdd }: BannersViewProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Anuncios e Innovaciones</h2>
          <p className="text-neutral-500 mt-1">Gestiona los banners informativos de la web pública.</p>
        </div>
        <button onClick={onAdd} className="btn-primary">
          <Plus size={20} />
          Nuevo Anuncio
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(banners || []).map((banner: Banner) => (
          <div key={banner.id} className={`glass-card p-6 border-l-4 ${
            banner.isActive ? 'border-brand-orange' : 'border-neutral-300 opacity-60'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                banner.type === 'Innovation' ? 'bg-indigo-50 text-indigo-600' : 
                banner.type === 'Update' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
              }`}>
                {banner.type}
              </div>
              <div className="flex gap-2">
                <button onClick={() => onEdit(banner)} className="p-2 text-neutral-400 hover:text-brand-orange transition-colors">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => onDelete(banner.id)} className="p-2 text-neutral-400 hover:text-rose-600 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <h3 className="font-bold text-lg mb-2">{banner.title}</h3>
            <p className="text-sm text-neutral-500 mb-4">{banner.description}</p>
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="flex items-center gap-1">
                <Clock size={12} /> {new Date(banner.createdAt).toLocaleDateString()}
              </span>
              <span className={`font-bold ${banner.isActive ? 'text-emerald-600' : 'text-neutral-400'}`}>
                {banner.isActive ? 'ACTIVO' : 'INACTIVO'}
              </span>
            </div>
          </div>
        ))}
        {(banners || []).length === 0 && (
          <div className="col-span-2 py-12 text-center text-neutral-400 italic">
            No hay anuncios registrados.
          </div>
        )}
      </div>
    </div>
  );
};
