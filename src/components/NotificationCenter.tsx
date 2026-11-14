import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Check, 
  ShoppingCart, 
  X, 
  Volume2, 
  Trash2, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { AppNotification } from '../types';
import { 
  notificationService, 
  playPurchaseChime, 
  requestWebNotificationPermission 
} from '../services/notificationService';

interface NotificationCenterProps {
  notifications: AppNotification[];
  onSelectSaleNotification?: (notif: AppNotification) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onSelectSaleNotification
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeToasts, setActiveToasts] = useState<AppNotification[]>([]);
  const [prevCount, setPrevCount] = useState<number | null>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Detect newly arriving notifications to trigger floating toast and audio chime
  useEffect(() => {
    if (prevCount === null) {
      setPrevCount(notifications.length);
      return;
    }

    if (notifications.length > prevCount) {
      const newItems = notifications.slice(0, notifications.length - prevCount);
      // Play chime for incoming new sales
      const hasNewSale = newItems.some(n => n.type === 'sale' && !n.read);
      if (hasNewSale) {
        playPurchaseChime();
        // Add to active toast list
        setActiveToasts(prev => [...newItems, ...prev].slice(0, 3));
      }
    }
    setPrevCount(notifications.length);
  }, [notifications, prevCount]);

  // Auto dismiss toasts after 7 seconds
  useEffect(() => {
    if (activeToasts.length === 0) return;
    const timer = setTimeout(() => {
      setActiveToasts(prev => prev.slice(1));
    }, 7000);
    return () => clearTimeout(timer);
  }, [activeToasts]);

  const dismissToast = (id: string) => {
    setActiveToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleNotificationClick = (notif: AppNotification) => {
    notificationService.markAsRead(notif.id);
    if (onSelectSaleNotification) {
      onSelectSaleNotification(notif);
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Real-time Toast Alerts (Top-Right) */}
      <div className="fixed top-5 right-5 z-[150] space-y-3 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        <AnimatePresence>
          {activeToasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="pointer-events-auto bg-neutral-900/95 text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/40 backdrop-blur-md flex items-start gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <ShoppingCart size={20} className="animate-pulse" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <Sparkles size={12} />
                  <span>¡Nueva Compra Realizada!</span>
                </div>
                <h4 className="text-sm font-bold text-white mt-0.5 truncate">
                  {toast.productName || 'Producto Nova AJ'}
                </h4>
                <p className="text-xs text-neutral-300 mt-0.5 line-clamp-2 leading-relaxed">
                  {toast.message}
                </p>
                {toast.amount && (
                  <div className="mt-2 inline-block px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-md font-mono font-bold text-xs border border-emerald-500/30">
                    Total: ${toast.amount.toLocaleString()}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bell Button (Trigger) */}
      <div className="relative inline-block">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Notificaciones"
          className="relative p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 hover:text-neutral-900 transition-all flex items-center justify-center"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange text-[10px] font-bold text-white shadow-md ring-2 ring-white animate-bounce">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown Drawer */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-[120]" 
                onClick={() => setIsOpen(false)} 
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-neutral-200/80 z-[130] overflow-hidden flex flex-col max-h-[85vh]"
              >
                {/* Header */}
                <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-brand-orange/10 text-brand-orange flex items-center justify-center">
                      <Bell size={16} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-neutral-900">Avisos y Compras</h3>
                      <p className="text-[11px] text-neutral-500">
                        {unreadCount > 0 ? `${unreadCount} pendientes de lectura` : 'Al día, sin avisos pendientes'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      title="Probar sonido de compra"
                      onClick={() => playPurchaseChime()}
                      className="p-1.5 text-neutral-400 hover:text-brand-orange hover:bg-neutral-200/60 rounded-lg transition-colors"
                    >
                      <Volume2 size={16} />
                    </button>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        title="Marcar todas como leídas"
                        onClick={() => notificationService.markAllAsRead(notifications)}
                        className="p-1.5 text-neutral-400 hover:text-emerald-600 hover:bg-neutral-200/60 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1"
                      >
                        <Check size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Notification list */}
                <div className="overflow-y-auto divide-y divide-neutral-100 flex-1 p-2">
                  {notifications.length === 0 ? (
                    <div className="py-10 text-center px-4">
                      <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-3">
                        <ShoppingCart size={22} />
                      </div>
                      <p className="text-sm font-semibold text-neutral-700">Aún no hay compras registradas</p>
                      <p className="text-xs text-neutral-400 mt-1">
                        Cada vez que un cliente realice una compra o pedido por WhatsApp o catálogo, sonará una alarma y aparecerá aquí.
                      </p>
                    </div>
                  ) : (
                    notifications.map(item => (
                      <div
                        key={item.id}
                        onClick={() => handleNotificationClick(item)}
                        className={`p-3 rounded-2xl transition-all cursor-pointer flex items-start gap-3 my-1 ${
                          item.read 
                            ? 'bg-transparent hover:bg-neutral-50 text-neutral-600' 
                            : 'bg-orange-50/60 hover:bg-orange-50 border border-orange-100 text-neutral-900'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          item.read 
                            ? 'bg-neutral-100 text-neutral-500' 
                            : 'bg-brand-orange/20 text-brand-orange font-bold'
                        }`}>
                          <ShoppingCart size={17} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-xs truncate text-neutral-900">
                              {item.title}
                            </span>
                            <span className="text-[10px] text-neutral-400 whitespace-nowrap">
                              {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <p className="text-xs text-neutral-600 mt-0.5 leading-snug line-clamp-2">
                            {item.message}
                          </p>

                          <div className="flex items-center gap-2 mt-2">
                            {item.amount && (
                              <span className="px-2 py-0.5 bg-emerald-100/70 text-emerald-800 rounded text-[10px] font-mono font-bold">
                                ${item.amount.toLocaleString()}
                              </span>
                            )}
                            {item.clientName && (
                              <span className="text-[10px] text-neutral-500 truncate">
                                Cliente: {item.clientName}
                              </span>
                            )}
                          </div>
                        </div>

                        {!item.read && (
                          <div className="w-2 h-2 rounded-full bg-brand-orange shrink-0 mt-2" />
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => requestWebNotificationPermission()}
                    className="text-brand-orange hover:text-orange-700 font-semibold flex items-center gap-1.5 text-[11px]"
                  >
                    <Sparkles size={12} />
                    Activar avisos de escritorio
                  </button>

                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={() => notificationService.clearAll()}
                      className="text-neutral-400 hover:text-red-600 transition-colors flex items-center gap-1 text-[11px]"
                    >
                      <Trash2 size={12} />
                      Limpiar
                    </button>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
