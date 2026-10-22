import React, { useState } from 'react';
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
  FileText,
  Share2,
  Globe,
  Copy,
  Check,
  Key,
  ShieldCheck,
  Sparkles,
  Lock,
  Folder,
  GitBranch,
  Cloud,
  Bot,
  ExternalLink,
  Eye
} from 'lucide-react';
import { Client, Product, Sale, Banner, View } from '../types';
import { ProductCredentialsModal } from './ProductCredentialsModal';

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
            {(sales || []).slice(0, 5).map((sale, idx) => (
              <div key={`dash-recent-sale-${sale.id || idx}-${idx}`} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
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
            {(clients || []).slice(0, 5).map((client, idx) => (
              <div key={`dash-client-${client.id || idx}-${idx}`} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
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
              {filtered.map((client, idx) => (
                <tr key={`client-row-${client.id || idx}-${idx}`} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium">{client.name}</div>
                    <div className="text-xs text-neutral-400">{client.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {(client.systems || []).map((s, i) => (
                        <span key={`client-${client.id || idx}-sys-${s.id || i}-${i}`} className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
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
  onViewSalesLanding?: (p: Product) => void;
}

export const ProductsView = ({ 
  products, 
  searchTerm, 
  setSearchTerm, 
  setEditingProduct, 
  setIsProductModalOpen, 
  handleDeleteProduct,
  onViewSalesLanding 
}: ProductsViewProps) => {
  const [copiedProductId, setCopiedProductId] = useState<string | null>(null);
  const [copiedTextKey, setCopiedTextKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'commercial' | 'devops'>('commercial');
  const [selectedCredentialsProduct, setSelectedCredentialsProduct] = useState<Product | null>(null);

  const filtered = (products || []).filter(p => 
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.sku || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.localFolderPath || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.githubRepo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.vercelProject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.aiStudioAccount || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyText = async (text: string, keyName: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTextKey(keyName);
      setTimeout(() => setCopiedTextKey(null), 2500);
    } catch (err) {
      console.error('Error copying text:', err);
    }
  };

  const handleShareProduct = async (product: Product) => {
    const rawUrl = `${window.location.origin}${window.location.pathname}?product=${encodeURIComponent(product.id)}&utm_source=facebook&utm_medium=paid&utm_campaign=${encodeURIComponent(product.sku.toLowerCase())}`;

    const shareText = `Aplicación ${product.name} (Nova AJ): ${rawUrl}`;

    if (navigator.share && navigator.canShare && navigator.canShare({ title: product.name, text: shareText, url: rawUrl })) {
      try {
        await navigator.share({
          title: product.name,
          text: `Conoce el sistema ${product.name} de Nova AJ:`,
          url: rawUrl,
        });
        return;
      } catch (e) {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(rawUrl);
      setCopiedProductId(product.id);
      setTimeout(() => setCopiedProductId(null), 2500);
    } catch (err) {
      console.error('Error copying product link:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Sistemas & Aplicaciones (Portafolio)</h2>
          <p className="text-neutral-500 mt-1 text-sm sm:text-base">
            Administra tus aplicaciones, carpetas locales de PC, repositorios GitHub, Vercel, cuentas de AI Studio y contraseñas privadas.
          </p>
        </div>
        <button onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }} className="btn-primary w-full md:w-auto justify-center">
          <Plus size={20} />
          Nueva Aplicación / Producto
        </button>
      </div>

      {/* Tabs para alternar entre Vista Comercial y Organización DevOps */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-1">
        <button
          onClick={() => setActiveTab('commercial')}
          className={`px-4 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'commercial'
              ? 'bg-brand-orange text-white shadow-sm'
              : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
          }`}
        >
          <ShoppingCart size={16} />
          <span>Vista Comercial & Precios</span>
          <span className={`px-2 py-0.2 text-[10px] rounded-full font-mono ${
            activeTab === 'commercial' ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'
          }`}>
            {products.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('devops')}
          className={`px-4 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'devops'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
          }`}
        >
          <GitBranch size={16} />
          <span>Organización DevOps & Repositorios</span>
          <span className={`px-2 py-0.2 text-[10px] rounded-full font-mono ${
            activeTab === 'devops' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'
          }`}>
            PC / GitHub / Vercel
          </span>
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <Search className="text-neutral-400 shrink-0" size={20} />
            <input 
              type="text" 
              placeholder={activeTab === 'devops' ? "Buscar por aplicación, carpeta de PC, GitHub, Vercel o cuenta AI Studio..." : "Buscar por nombre, categoría o código..."} 
              className="bg-transparent outline-none w-full text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {activeTab === 'devops' && (
            <span className="text-xs text-indigo-700 font-semibold bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 self-start sm:self-auto shrink-0 flex items-center gap-1.5">
              <Folder size={14} />
              <span>Haz clic en cualquier botón "Copiar" para usar la ruta en tu terminal</span>
            </span>
          )}
        </div>

        {activeTab === 'commercial' ? (
          /* TAB 1: VISTA COMERCIAL */
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase text-neutral-400 font-bold border-b border-neutral-100 bg-neutral-50">
                  <th className="px-6 py-4">Sistema / Aplicación</th>
                  <th className="px-6 py-4">Categoría</th>
                  <th className="px-6 py-4">Portafolio Web</th>
                  <th className="px-6 py-4">Precio</th>
                  <th className="px-6 py-4">Contraseñas & Accesos</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((product, idx) => {
                  const hasCredentials = Boolean(
                    product.adminUser || 
                    product.adminPassword || 
                    product.creatorUser || 
                    product.creatorPassword || 
                    product.adminLoginUrl ||
                    product.accessNotes ||
                    product.localFolderPath ||
                    product.githubRepo ||
                    product.vercelProject ||
                    product.aiStudioAccount ||
                    (product.extraCredentials && product.extraCredentials.length > 0)
                  );

                  return (
                    <tr key={`admin-prod-comm-${product.id || idx}-${idx}`} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-neutral-900">{product.name}</div>
                        {product.description && (
                          <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2 max-w-md">{product.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className="text-[11px] text-neutral-400 font-mono">SKU: {product.sku}</span>
                          {product.demoUrl && (
                            <a 
                              href={product.demoUrl.startsWith('http') ? product.demoUrl : `https://${product.demoUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-brand-orange hover:underline flex items-center gap-1 font-semibold truncate max-w-[180px]"
                            >
                              <Globe size={11} />
                              <span>{product.demoUrl.replace(/^https?:\/\//, '')}</span>
                            </a>
                          )}
                          {product.githubRepo && (
                            <span 
                              onClick={() => copyText(product.githubRepo || '', `gh-${product.id}`)}
                              className="text-[10px] font-mono bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded cursor-pointer flex items-center gap-1"
                              title="Copiar repositorio GitHub"
                            >
                              <GitBranch size={10} />
                              <span>{copiedTextKey === `gh-${product.id}` ? '¡Copiado!' : product.githubRepo}</span>
                            </span>
                          )}
                          {product.localFolderPath && (
                            <span 
                              onClick={() => copyText(product.localFolderPath || '', `folder-${product.id}`)}
                              className="text-[10px] font-mono bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded cursor-pointer flex items-center gap-1"
                              title={`Copiar ruta: ${product.localFolderPath}`}
                            >
                              <Folder size={10} />
                              <span>{copiedTextKey === `folder-${product.id}` ? '¡Ruta Copiada!' : 'PC: ' + (product.localFolderPath.split(/[\\/]/).filter(Boolean).pop() || 'Carpeta')}</span>
                            </span>
                          )}
                        </div>
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
                      <td className="px-6 py-4">
                        {hasCredentials ? (
                          <button
                            onClick={() => setSelectedCredentialsProduct(product)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100 hover:border-amber-300 transition-all shadow-xs group"
                            title="Ver contraseñas de Administrador y Creador"
                          >
                            <Key size={14} className="text-amber-600 group-hover:rotate-12 transition-transform" />
                            <span>Ver Claves</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setIsProductModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-neutral-500 hover:text-amber-700 hover:bg-amber-50/70 border border-dashed border-neutral-300 transition-all"
                            title="Agregar contraseñas para este producto"
                          >
                            <Plus size={13} />
                            <span>+ Agregar Claves</span>
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5 sm:gap-2">
                          <button 
                            onClick={() => setSelectedCredentialsProduct(product)}
                            className={`p-2 rounded-lg transition-all ${
                              hasCredentials 
                                ? 'text-amber-600 hover:bg-amber-50' 
                                : 'text-neutral-400 hover:text-amber-600 hover:bg-amber-50'
                            }`}
                            title="Ver / Copiar Contraseñas (Admin y Creador)"
                          >
                            <Key size={18} />
                          </button>
                          {onViewSalesLanding && (
                            <button
                              onClick={() => onViewSalesLanding(product)}
                              className="p-2 text-neutral-400 hover:text-brand-orange hover:bg-orange-50 rounded-lg transition-all"
                              title="Ver Página de Venta y Publicidad (Como la ve el cliente)"
                            >
                              <Eye size={18} />
                            </button>
                          )}
                          <button 
                            onClick={() => handleShareProduct(product)}
                            className={`p-2 rounded-lg transition-all ${
                              copiedProductId === product.id 
                                ? 'text-emerald-600 bg-emerald-50' 
                                : 'text-neutral-400 hover:text-brand-orange hover:bg-orange-50'
                            }`}
                            title={copiedProductId === product.id ? '¡Link publicitario copiado!' : 'Copiar enlace publicitario para campañas (Facebook / Redes)'}
                          >
                            {copiedProductId === product.id ? <Check size={18} /> : <Share2 size={18} />}
                          </button>
                          <button 
                            onClick={() => { setEditingProduct(product); setIsProductModalOpen(true); }}
                            className="p-2 text-neutral-400 hover:text-brand-orange hover:bg-orange-50 rounded-lg transition-all"
                            title="Editar Producto / Contraseñas"
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
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-neutral-400 italic">
                      No se encontraron sistemas o productos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* TAB 2: VISTA DEVOPS & REPOSITORIOS (PC, GitHub, Vercel, AI Studio) */
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase text-neutral-400 font-bold border-b border-neutral-100 bg-indigo-50/40">
                  <th className="px-6 py-4">Sistema / Aplicación</th>
                  <th className="px-6 py-4">Carpeta en mi PC</th>
                  <th className="px-6 py-4">Repositorio GitHub</th>
                  <th className="px-6 py-4">Proyecto Vercel</th>
                  <th className="px-6 py-4">Usuario AI Studio</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {filtered.map((product, idx) => (
                  <tr key={`admin-prod-devops-${product.id || idx}-${idx}`} className="hover:bg-neutral-50/60 transition-colors">
                    {/* Sistema */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-neutral-900 text-sm">{product.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded font-bold">
                          {product.sku}
                        </span>
                        <span className="text-neutral-400 text-[11px]">{product.category}</span>
                      </div>
                    </td>

                    {/* Carpeta en PC local */}
                    <td className="px-6 py-4 max-w-xs">
                      {product.localFolderPath ? (
                        <div className="flex items-center justify-between gap-2 bg-indigo-50/70 p-2 rounded-xl border border-indigo-100">
                          <div className="min-w-0">
                            <span className="font-mono text-xs font-semibold text-indigo-950 truncate block" title={product.localFolderPath}>
                              {product.localFolderPath}
                            </span>
                          </div>
                          <button
                            onClick={() => copyText(product.localFolderPath || '', `folder-full-${product.id}`)}
                            className="p-1.5 text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors shrink-0"
                            title="Copiar ruta de la carpeta para terminal o explorador"
                          >
                            {copiedTextKey === `folder-full-${product.id}` ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditingProduct(product); setIsProductModalOpen(true); }}
                          className="text-neutral-400 hover:text-indigo-600 italic text-[11px] flex items-center gap-1"
                        >
                          <Plus size={12} />
                          <span>Asignar carpeta PC</span>
                        </button>
                      )}
                    </td>

                    {/* Repositorio GitHub */}
                    <td className="px-6 py-4 max-w-xs">
                      {product.githubRepo ? (
                        <div className="flex items-center justify-between gap-2 bg-neutral-100/80 p-2 rounded-xl border border-neutral-200/80">
                          <div className="min-w-0">
                            <span className="font-mono text-xs font-semibold text-neutral-900 truncate block">
                              {product.githubRepo}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => copyText(product.githubRepo || '', `gh-full-${product.id}`)}
                              className="p-1 text-neutral-500 hover:text-black rounded hover:bg-neutral-200 transition-colors"
                              title="Copiar repositorio"
                            >
                              {copiedTextKey === `gh-full-${product.id}` ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                            </button>
                            <a
                              href={product.githubRepo.startsWith('http') ? product.githubRepo : `https://github.com/${product.githubRepo}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-neutral-700 hover:text-black rounded hover:bg-neutral-200 transition-colors"
                              title="Abrir en GitHub"
                            >
                              <ExternalLink size={13} />
                            </a>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditingProduct(product); setIsProductModalOpen(true); }}
                          className="text-neutral-400 hover:text-neutral-700 italic text-[11px] flex items-center gap-1"
                        >
                          <Plus size={12} />
                          <span>Asignar GitHub</span>
                        </button>
                      )}
                    </td>

                    {/* Proyecto Vercel */}
                    <td className="px-6 py-4 max-w-xs">
                      {product.vercelProject ? (
                        <div className="flex items-center justify-between gap-2 bg-sky-50/80 p-2 rounded-xl border border-sky-100">
                          <div className="min-w-0">
                            <span className="font-mono text-xs font-semibold text-sky-950 truncate block">
                              {product.vercelProject}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => copyText(product.vercelProject || '', `vercel-full-${product.id}`)}
                              className="p-1 text-sky-700 hover:bg-sky-100 rounded transition-colors"
                              title="Copiar proyecto Vercel"
                            >
                              {copiedTextKey === `vercel-full-${product.id}` ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                            </button>
                            <a
                              href={
                                product.vercelProject.startsWith('http') 
                                  ? product.vercelProject 
                                  : (product.vercelProject.includes('.') ? `https://${product.vercelProject}` : `https://${product.vercelProject}.vercel.app`)
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-sky-700 hover:bg-sky-100 rounded transition-colors"
                              title="Abrir en Vercel"
                            >
                              <ExternalLink size={13} />
                            </a>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditingProduct(product); setIsProductModalOpen(true); }}
                          className="text-neutral-400 hover:text-sky-600 italic text-[11px] flex items-center gap-1"
                        >
                          <Plus size={12} />
                          <span>Asignar Vercel</span>
                        </button>
                      )}
                    </td>

                    {/* Cuenta Google AI Studio */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-between gap-2 bg-purple-50/80 p-2 rounded-xl border border-purple-100">
                        <div className="min-w-0 flex items-center gap-1.5">
                          <Bot size={14} className="text-purple-600 shrink-0" />
                          <span className="font-mono text-xs font-semibold text-purple-950 truncate block">
                            {product.aiStudioAccount || 'ajnovasistemas@gmail.com'}
                          </span>
                        </div>
                        <button
                          onClick={() => copyText(product.aiStudioAccount || 'ajnovasistemas@gmail.com', `ai-full-${product.id}`)}
                          className="p-1 text-purple-700 hover:bg-purple-100 rounded transition-colors shrink-0"
                          title="Copiar cuenta AI Studio"
                        >
                          {copiedTextKey === `ai-full-${product.id}` ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button 
                          onClick={() => setSelectedCredentialsProduct(product)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                          title="Ver todas las credenciales y accesos"
                        >
                          <Key size={16} />
                        </button>
                        <button 
                          onClick={() => { setEditingProduct(product); setIsProductModalOpen(true); }}
                          className="p-2 text-neutral-400 hover:text-brand-orange hover:bg-orange-50 rounded-lg transition-all"
                          title="Editar datos de DevOps / Producto"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-neutral-400 italic">
                      No se encontraron sistemas o productos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de consulta rápida y copiado de contraseñas */}
      <ProductCredentialsModal
        isOpen={!!selectedCredentialsProduct}
        onClose={() => setSelectedCredentialsProduct(null)}
        product={selectedCredentialsProduct}
        onEdit={(prod) => {
          setSelectedCredentialsProduct(null);
          setEditingProduct(prod);
          setIsProductModalOpen(true);
        }}
      />
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
              {(sales || []).map((sale, idx) => (
                <tr key={`sales-row-${sale.id || idx}-${idx}`} className="hover:bg-neutral-50/50 transition-colors">
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
        {(banners || []).map((banner: Banner, idx: number) => (
          <div key={`banner-item-${banner.id || idx}-${idx}`} className={`glass-card p-6 border-l-4 ${
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
