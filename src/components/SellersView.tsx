import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  UserCheck,
  DollarSign,
  Percent,
  CheckCircle2,
  Clock,
  ShoppingCart,
  FileText,
  Users,
  Award,
  Package,
  Filter
} from 'lucide-react';
import { Seller, Sale } from '../types';

interface SellersViewProps {
  sellers: Seller[];
  sales: Sale[];
  onAddSeller: () => void;
  onEditSeller: (seller: Seller) => void;
  onDeleteSeller: (id: string) => void;
  onNewSaleForSeller: (sellerId?: string) => void;
  onToggleCommissionPaid: (saleId: string) => void;
  onAssignSellerToSale: (sale: Sale) => void;
  onViewInvoice: (sale: Sale) => void;
}

export const SellersView: React.FC<SellersViewProps> = ({
  sellers = [],
  sales = [],
  onAddSeller,
  onEditSeller,
  onDeleteSeller,
  onNewSaleForSeller,
  onToggleCommissionPaid,
  onAssignSellerToSale,
  onViewInvoice,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'ledger'>('summary');
  const [selectedSellerFilter, setSelectedSellerFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Compute aggregated metrics per seller
  const sellerStats = useMemo(() => {
    return sellers.map((seller) => {
      const sellerSales = sales.filter((s) => s.sellerId === seller.id);
      const totalRevenue = sellerSales.reduce((acc, s) => acc + (s.total || 0), 0);
      const totalCommission = sellerSales.reduce((acc, s) => {
        if (s.commissionAmount !== undefined) return acc + s.commissionAmount;
        const rate = s.commissionRate ?? seller.commissionRate ?? 0;
        return acc + Math.round(((s.total || 0) * rate) / 100);
      }, 0);
      const paidCommission = sellerSales
        .filter((s) => s.commissionPaid)
        .reduce((acc, s) => {
          if (s.commissionAmount !== undefined) return acc + s.commissionAmount;
          const rate = s.commissionRate ?? seller.commissionRate ?? 0;
          return acc + Math.round(((s.total || 0) * rate) / 100);
        }, 0);
      const pendingCommission = Math.max(0, totalCommission - paidCommission);

      // Extract unique system names sold
      const systemsSoldMap = new Map<string, number>();
      sellerSales.forEach((s) => {
        (s.items || []).forEach((item) => {
          const prev = systemsSoldMap.get(item.productName) || 0;
          systemsSoldMap.set(item.productName, prev + (item.quantity || 1));
        });
      });

      return {
        seller,
        salesCount: sellerSales.length,
        totalRevenue,
        totalCommission,
        paidCommission,
        pendingCommission,
        systemsSold: Array.from(systemsSoldMap.entries()).map(([name, qty]) => ({ name, qty })),
      };
    });
  }, [sellers, sales]);

  // Global KPIs
  const globalStats = useMemo(() => {
    const activeSellers = sellers.filter((s) => s.status === 'Activo').length;
    const salesWithSeller = sales.filter((s) => Boolean(s.sellerId));
    const totalSoldBySellers = salesWithSeller.reduce((acc, s) => acc + (s.total || 0), 0);
    const totalCommissions = salesWithSeller.reduce((acc, s) => {
      if (s.commissionAmount !== undefined) return acc + s.commissionAmount;
      const sel = sellers.find((v) => v.id === s.sellerId);
      const rate = s.commissionRate ?? sel?.commissionRate ?? 0;
      return acc + Math.round(((s.total || 0) * rate) / 100);
    }, 0);
    const paidCommissions = salesWithSeller
      .filter((s) => s.commissionPaid)
      .reduce((acc, s) => {
        if (s.commissionAmount !== undefined) return acc + s.commissionAmount;
        const sel = sellers.find((v) => v.id === s.sellerId);
        const rate = s.commissionRate ?? sel?.commissionRate ?? 0;
        return acc + Math.round(((s.total || 0) * rate) / 100);
      }, 0);

    return {
      activeSellers,
      salesCount: salesWithSeller.length,
      totalSoldBySellers,
      totalCommissions,
      paidCommissions,
      pendingCommissions: Math.max(0, totalCommissions - paidCommissions),
    };
  }, [sellers, sales]);

  const filteredSellerStats = sellerStats.filter((item) => {
    const q = searchTerm.toLowerCase();
    if (!q) return true;
    return (
      item.seller.name.toLowerCase().includes(q) ||
      (item.seller.email || '').toLowerCase().includes(q) ||
      (item.seller.phone || '').toLowerCase().includes(q) ||
      item.systemsSold.some((sys) => sys.name.toLowerCase().includes(q))
    );
  });

  const filteredLedgerSales = useMemo(() => {
    return sales.filter((sale) => {
      if (selectedSellerFilter === 'unassigned') {
        if (sale.sellerId) return false;
      } else if (selectedSellerFilter !== 'all') {
        if (sale.sellerId !== selectedSellerFilter) return false;
      }

      const q = searchTerm.toLowerCase();
      if (!q) return true;
      const sellerName = sale.sellerName || sellers.find((s) => s.id === sale.sellerId)?.name || '';
      const systemsText = (sale.items || []).map((i) => i.productName).join(' ').toLowerCase();
      return (
        sellerName.toLowerCase().includes(q) ||
        (sale.clientName || '').toLowerCase().includes(q) ||
        systemsText.includes(q)
      );
    });
  }, [sales, sellers, selectedSellerFilter, searchTerm]);

  const handleInspectSeller = (sellerId: string) => {
    setSelectedSellerFilter(sellerId);
    setActiveTab('ledger');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            Vendedores & Comisiones
          </h2>
          <p className="text-neutral-500 mt-1 text-sm sm:text-base">
            Controla qué sistemas vendió cada vendedor, el monto de venta y su comisión correspondiente.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
          <button
            onClick={() => onNewSaleForSeller(selectedSellerFilter !== 'all' && selectedSellerFilter !== 'unassigned' ? selectedSellerFilter : undefined)}
            className="btn-secondary flex-1 md:flex-none justify-center text-sm"
          >
            <ShoppingCart size={17} className="text-brand-orange" />
            <span>Registrar Venta</span>
          </button>
          <button
            onClick={onAddSeller}
            className="btn-primary flex-1 md:flex-none justify-center text-sm"
          >
            <Plus size={18} />
            <span>Nuevo Vendedor</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-orange/10 text-brand-orange rounded-2xl flex items-center justify-center shrink-0">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Vendedores Activos</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <h4 className="text-2xl font-extrabold text-neutral-900">{globalStats.activeSellers}</h4>
              <span className="text-xs text-neutral-400 font-medium">/ {sellers.length} total</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Vendido por Equipo</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <h4 className="text-2xl font-extrabold text-neutral-900">
                ${globalStats.totalSoldBySellers.toLocaleString()}
              </h4>
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold">{globalStats.salesCount} ventas asignadas</p>
          </div>
        </div>

        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
            <Award size={24} />
          </div>
          <div>
            <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Comisiones Totales</p>
            <h4 className="text-2xl font-extrabold text-neutral-900 mt-0.5">
              ${globalStats.totalCommissions.toLocaleString()}
            </h4>
            <p className="text-[11px] text-indigo-600 font-semibold">
              Pagadas: ${globalStats.paidCommissions.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="glass-card p-5 flex items-center gap-4 border-l-4 border-amber-500">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Comisiones Pendientes</p>
            <h4 className="text-2xl font-extrabold text-amber-700 mt-0.5">
              ${globalStats.pendingCommissions.toLocaleString()}
            </h4>
            <p className="text-[11px] text-neutral-500">Por liquidar a vendedores</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 pb-1">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-4 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'summary'
              ? 'bg-brand-orange text-white shadow-sm'
              : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
          }`}
        >
          <UserCheck size={16} />
          <span>Vendedores y Totales</span>
          <span className={`px-2 py-0.5 text-[10px] rounded-full font-mono ${
            activeTab === 'summary' ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'
          }`}>
            {sellers.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-4 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'ledger'
              ? 'bg-neutral-900 text-white shadow-sm'
              : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
          }`}
        >
          <Package size={16} />
          <span>Detalle de Sistemas Vendidos & Comisiones</span>
          <span className={`px-2 py-0.5 text-[10px] rounded-full font-mono ${
            activeTab === 'ledger' ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'
          }`}>
            {sales.length}
          </span>
        </button>
      </div>

      {/* Main Card */}
      <div className="glass-card overflow-hidden">
        {/* Search & Filter Toolbar */}
        <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <Search className="text-neutral-400 shrink-0" size={18} />
            <input
              type="text"
              placeholder={
                activeTab === 'summary'
                  ? 'Buscar vendedor por nombre, email o sistema vendido...'
                  : 'Buscar por vendedor, sistema vendido o cliente...'
              }
              className="bg-transparent outline-none w-full text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {activeTab === 'ledger' && (
            <div className="flex items-center gap-2 shrink-0">
              <Filter size={15} className="text-neutral-400" />
              <select
                value={selectedSellerFilter}
                onChange={(e) => setSelectedSellerFilter(e.target.value)}
                className="bg-white border border-neutral-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-neutral-700 outline-none focus:border-brand-orange"
              >
                <option value="all">Todos los vendedores / ventas</option>
                {sellers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.commissionRate}%)
                  </option>
                ))}
                <option value="unassigned">Sin vendedor asignado (Directas)</option>
              </select>
            </div>
          )}
        </div>

        {/* TAB 1: RESUMEN POR VENDEDOR */}
        {activeTab === 'summary' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase text-neutral-400 font-bold border-b border-neutral-100 bg-neutral-50">
                  <th className="px-6 py-4">Vendedor</th>
                  <th className="px-6 py-4">% Comisión</th>
                  <th className="px-6 py-4">Sistemas Vendidos</th>
                  <th className="px-6 py-4 text-right">Dinero Vendido</th>
                  <th className="px-6 py-4 text-right">Comisión por Ventas</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredSellerStats.map(({ seller, salesCount, totalRevenue, totalCommission, paidCommission, pendingCommission, systemsSold }) => (
                  <tr key={seller.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-orange/10 text-brand-orange font-bold flex items-center justify-center text-sm shrink-0">
                          {seller.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-neutral-900 flex items-center gap-2">
                            <span>{seller.name}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                seller.status === 'Activo'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-neutral-100 text-neutral-500'
                              }`}
                            >
                              {seller.status}
                            </span>
                          </div>
                          <div className="text-xs text-neutral-500 mt-0.5">
                            {[seller.phone, seller.email].filter(Boolean).join(' · ') || 'Sin contacto'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 text-brand-orange border border-orange-200/70 font-mono font-bold text-xs">
                        <Percent size={12} />
                        {seller.commissionRate}%
                      </span>
                    </td>

                    <td className="px-6 py-4 max-w-xs">
                      {systemsSold.length > 0 ? (
                        <div className="space-y-1">
                          <div className="text-[11px] font-bold text-neutral-500">
                            {salesCount} {salesCount === 1 ? 'operación' : 'operaciones'}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {systemsSold.map((sys, idx) => (
                              <span
                                key={`${seller.id}-sys-${idx}`}
                                className="px-2 py-0.5 bg-neutral-100 text-neutral-800 rounded-md text-[11px] font-semibold border border-neutral-200/60"
                              >
                                {sys.qty > 1 ? `${sys.qty}x ` : ''}{sys.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-400 italic">Sin ventas registradas aún</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="font-extrabold text-neutral-900 text-base">
                        ${totalRevenue.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {salesCount} {salesCount === 1 ? 'venta' : 'ventas'}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="font-extrabold text-emerald-700 text-base">
                        ${totalCommission.toLocaleString()}
                      </div>
                      {totalCommission > 0 && (
                        <div className="flex items-center justify-end gap-1.5 mt-1 text-[10px] font-bold">
                          {pendingCommission > 0 && (
                            <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded">
                              Pend: ${pendingCommission.toLocaleString()}
                            </span>
                          )}
                          {paidCommission > 0 && (
                            <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                              Pagado: ${paidCommission.toLocaleString()}
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleInspectSeller(seller.id)}
                          className="px-2.5 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all"
                          title="Ver detalle de cada sistema vendido y liquidar comisiones"
                        >
                          Ver Detalle
                        </button>
                        <button
                          onClick={() => onNewSaleForSeller(seller.id)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          title="Registrar nueva venta para este vendedor"
                        >
                          <Plus size={17} />
                        </button>
                        <button
                          onClick={() => onEditSeller(seller)}
                          className="p-2 text-neutral-400 hover:text-brand-orange hover:bg-orange-50 rounded-lg transition-all"
                          title="Editar Vendedor"
                        >
                          <Edit2 size={17} />
                        </button>
                        <button
                          onClick={() => onDeleteSeller(seller.id)}
                          className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Eliminar Vendedor"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredSellerStats.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-14 text-center">
                      <div className="flex flex-col items-center justify-center text-neutral-400 space-y-3">
                        <UserCheck size={36} className="opacity-30" />
                        <p className="text-sm font-medium">
                          {sellers.length === 0
                            ? 'Aún no hay vendedores registrados en el equipo.'
                            : 'No se encontraron vendedores con ese criterio.'}
                        </p>
                        {sellers.length === 0 && (
                          <button onClick={onAddSeller} className="btn-primary text-xs py-2 px-4">
                            <Plus size={15} />
                            Agregar Primer Vendedor
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* TAB 2: DETALLE DE SISTEMAS VENDIDOS POR VENDEDOR Y COMISIÓN POR VENTA */
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase text-neutral-400 font-bold border-b border-neutral-100 bg-neutral-50">
                  <th className="px-6 py-4">Vendedor</th>
                  <th className="px-6 py-4">Sistemas Vendidos</th>
                  <th className="px-6 py-4">Cliente & Fecha</th>
                  <th className="px-6 py-4 text-right">Monto Vendido</th>
                  <th className="px-6 py-4 text-right">Comisión por Venta</th>
                  <th className="px-6 py-4 text-center">Estado Comisión</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredLedgerSales.map((sale, idx) => {
                  const sellerObj = sellers.find((s) => s.id === sale.sellerId);
                  const sellerDisplayName = sale.sellerName || sellerObj?.name;
                  const rate = sale.commissionRate ?? sellerObj?.commissionRate ?? 0;
                  const commissionMoney =
                    sale.sellerId
                      ? sale.commissionAmount !== undefined
                        ? sale.commissionAmount
                        : Math.round(((sale.total || 0) * rate) / 100)
                      : 0;

                  return (
                    <tr key={`seller-ledger-${sale.id || idx}-${idx}`} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="px-6 py-4">
                        {sellerDisplayName ? (
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-brand-orange/10 text-brand-orange font-bold text-xs flex items-center justify-center shrink-0">
                              {sellerDisplayName.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-sm text-neutral-900">{sellerDisplayName}</div>
                              <div className="text-[11px] text-neutral-400">#{sale.id.slice(-6)}</div>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => onAssignSellerToSale(sale)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-dashed border-neutral-300 text-xs text-neutral-500 hover:border-brand-orange hover:text-brand-orange hover:bg-orange-50/50 transition-all"
                          >
                            <Plus size={12} />
                            <span>Asignar Vendedor</span>
                          </button>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {(sale.items || []).map((item, i) => (
                            <div key={i} className="text-xs flex items-center gap-2">
                              <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-700 font-mono rounded font-bold text-[10px]">
                                {item.quantity}x
                              </span>
                              <span className="font-semibold text-neutral-800">{item.productName}</span>
                              <span className="text-neutral-400 font-mono text-[11px]">
                                (${(item.total || item.price || 0).toLocaleString()})
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-neutral-800">{sale.clientName}</div>
                        <div className="text-xs text-neutral-400">{new Date(sale.date).toLocaleDateString()}</div>
                      </td>

                      <td className="px-6 py-4 text-right font-extrabold text-neutral-900">
                        ${(sale.total || 0).toLocaleString()}
                      </td>

                      <td className="px-6 py-4 text-right">
                        {sale.sellerId ? (
                          <div>
                            <div className="font-extrabold text-emerald-700">
                              ${commissionMoney.toLocaleString()}
                            </div>
                            <div className="text-[11px] font-mono text-neutral-500">
                              ({rate}% s/ venta)
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-neutral-400 italic">—</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-center">
                        {sale.sellerId ? (
                          <button
                            onClick={() => onToggleCommissionPaid(sale.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                              sale.commissionPaid
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                            }`}
                            title="Haz clic para cambiar estado entre Pendiente y Pagada"
                          >
                            {sale.commissionPaid ? (
                              <>
                                <CheckCircle2 size={13} />
                                <span>Pagada</span>
                              </>
                            ) : (
                              <>
                                <Clock size={13} />
                                <span>Pendiente</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-xs text-neutral-400">Directa</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => onAssignSellerToSale(sale)}
                            className="p-2 text-neutral-400 hover:text-brand-orange hover:bg-orange-50 rounded-lg transition-all"
                            title="Asignar o cambiar vendedor / % comisión"
                          >
                            <UserCheck size={17} />
                          </button>
                          <button
                            onClick={() => onViewInvoice(sale)}
                            className="p-2 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Ver Factura / Recibo"
                          >
                            <FileText size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredLedgerSales.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-neutral-400 italic text-sm">
                      No se encontraron ventas para el filtro seleccionado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
