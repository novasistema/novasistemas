import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Layout, 
  Hammer, 
  Truck, 
  Wallet, 
  ClipboardList, 
  Sparkles, 
  Clock,
  ExternalLink,
  MessageCircle,
  Menu,
  X,
  Layers,
  CheckCircle2,
  PhoneCall,
  Share2,
  Copy,
  Check,
  CreditCard,
  ShieldCheck,
  Zap,
  Building,
  Lock
} from 'lucide-react';
import { Banner, Product, View } from '../types';

interface LandingViewProps {
  setView: (view: View) => void;
  banners: Banner[];
  products?: Product[];
  onAdminClick: () => void;
  onViewProductSales?: (product: Product) => void;
}

export const LandingView = ({ setView, banners, products = [], onAdminClick, onViewProductSales }: LandingViewProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copiedAppId, setCopiedAppId] = useState<string | null>(null);
  const [buyingApp, setBuyingApp] = useState<Product | null>(null);
  const [buyPaymentMethod, setBuyPaymentMethod] = useState<'whatsapp' | 'transfer' | 'invoice'>('whatsapp');
  const [copiedBankField, setCopiedBankField] = useState<string | null>(null);
  const [orderName, setOrderName] = useState('');
  const [orderPhone, setOrderPhone] = useState('');
  const [orderEmail, setOrderEmail] = useState('');
  const [orderCompany, setOrderCompany] = useState('');

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
    if (!buyingApp) return;
    const clientDetails = [
      orderName ? `• Nombre: ${orderName}` : '',
      orderCompany ? `• Empresa / Negocio: ${orderCompany}` : '',
      orderPhone ? `• Teléfono: ${orderPhone}` : '',
      orderEmail ? `• Email: ${orderEmail}` : '',
    ].filter(Boolean).join('\n');

    handleBuyWhatsApp(buyingApp, clientDetails);
    setBuyingApp(null);
  };

  const portfolioApps = (products || []).filter(p => p.inPortfolio !== false);

  const handleRequestDemo = (appName: string) => {
    const text = encodeURIComponent(`Hola Nova AJ! Me gustaría solicitar una Demo del sistema: ${appName}`);
    window.open(`https://wa.me/5493815043132?text=${text}`, '_blank');
  };

  const handleContactWhatsApp = () => {
    const text = encodeURIComponent('Hola Nova AJ! Quisiera consultar por el desarrollo de un proyecto o sistema a medida.');
    window.open(`https://wa.me/5493815043132?text=${text}`, '_blank');
  };

  const handleShareApp = async (app: Product) => {
    const rawUrl = `${window.location.origin}${window.location.pathname}?product=${encodeURIComponent(app.id)}&utm_source=redes`;
      
    const shareData = {
      title: app.name,
      text: `Conoce la aplicación "${app.name}" de Nova AJ:`,
      url: rawUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Fallback to clipboard if user dismissed or share failed
      }
    }

    try {
      await navigator.clipboard.writeText(rawUrl);
      setCopiedAppId(app.id);
      setTimeout(() => setCopiedAppId(null), 2500);
    } catch (e) {
      console.error('Error copying link:', e);
    }
  };

  const scrollToPortfolio = () => {
    const el = document.getElementById('portfolio');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-brand-orange rounded-xl flex items-center justify-center shadow-lg shadow-brand-orange/20">
              <span className="text-lg sm:text-xl font-bold text-white">N</span>
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight">Nova AJ</span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-neutral-600 hover:text-brand-orange font-medium transition-colors">Servicios</a>
            <a href="#portfolio" className="text-neutral-600 hover:text-brand-orange font-medium transition-colors flex items-center gap-1.5">
              <span>Portafolio</span>
              <span className="px-2 py-0.5 bg-brand-orange/10 text-brand-orange text-[10px] font-bold rounded-full">Apps</span>
            </a>
            <a href="#about" className="text-neutral-600 hover:text-brand-orange font-medium transition-colors">Nosotros</a>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={onAdminClick}
              className="bg-brand-orange hover:bg-orange-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all flex items-center gap-2 text-xs sm:text-sm font-bold shadow-lg shadow-brand-orange/20 active:scale-95"
            >
              <LayoutDashboard size={18} />
              <span className="hidden sm:inline">Administración</span>
              <span className="sm:hidden">Admin</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"
              aria-label="Abrir Menú"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-neutral-100 bg-white px-4 py-4 space-y-3 shadow-xl"
          >
            <a 
              href="#services" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="block py-2 text-sm font-semibold text-neutral-700 hover:text-brand-orange"
            >
              Servicios
            </a>
            <a 
              href="#portfolio" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="block py-2 text-sm font-semibold text-neutral-700 hover:text-brand-orange flex items-center justify-between"
            >
              <span>Portafolio de Aplicaciones</span>
              <span className="px-2 py-0.5 bg-brand-orange/10 text-brand-orange text-[10px] font-bold rounded-full">NUEVAS</span>
            </a>
            <a 
              href="#about" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="block py-2 text-sm font-semibold text-neutral-700 hover:text-brand-orange"
            >
              Nosotros
            </a>
            <div className="pt-2">
              <button
                onClick={handleContactWhatsApp}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm"
              >
                <MessageCircle size={18} />
                Contactar por WhatsApp
              </button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-28 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold mb-6">
              <Sparkles size={14} />
              <span>Desarrollo de Software & Aplicaciones A Medida</span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-neutral-900">
              Creamos sistemas <span className="text-brand-orange">a medida</span> para lo que necesites.
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-xl text-neutral-600 max-w-xl leading-relaxed">
              <strong>Nos adaptamos 100% a vos.</strong> Si tienes un negocio, una idea o un proceso que quieras automatizar, diseñamos la solución informática perfecta según tus reglas de trabajo.
            </p>

            <div className="mt-6 space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-neutral-800">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                <span>Soluciones adaptadas exactamente a tu ritmo y presupuesto</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-neutral-800">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                <span>Aplicaciones Web, Móviles y Gestión Empresarial</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-neutral-800">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                <span>Acompañamiento, soporte constante y capacitaciones</span>
              </div>
            </div>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button onClick={handleContactWhatsApp} className="btn-primary px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg justify-center shadow-xl shadow-brand-orange/20">
                <MessageCircle size={20} />
                Consultar Desarrollo A Medida
              </button>
              <button onClick={scrollToPortfolio} className="btn-secondary px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg justify-center">
                <Layers size={20} />
                Ver Portafolio
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden sm:block"
          >
            <div className="aspect-square bg-gradient-to-br from-brand-orange/10 via-orange-500/5 to-transparent rounded-[40px] flex items-center justify-center p-8 lg:p-10 border border-brand-orange/10">
              <div className="w-full h-full glass-card p-6 sm:p-8 flex flex-col justify-between shadow-2xl bg-white/95 border border-neutral-200/80 rounded-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-brand-orange rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-orange/30">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <div className="text-base font-extrabold text-neutral-900">Proyecto A Medida</div>
                      <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Nos adaptamos a tu necesidad
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-brand-orange/10 text-brand-orange text-xs font-bold rounded-full">
                    Nova AJ
                  </span>
                </div>

                <div className="space-y-3 my-4">
                  <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-700">1. Analizamos tu proyecto</span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-neutral-200 font-semibold text-neutral-500">100% Personalizado</span>
                  </div>
                  <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-700">2. Diseñamos el sistema a medida</span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-neutral-200 font-semibold text-neutral-500">Web & Móvil</span>
                  </div>
                  <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-700">3. Implementación y soporte</span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-neutral-200 font-semibold text-neutral-500">Acompañamiento</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                  <span className="font-semibold text-neutral-700">¿Tienes una idea en mente?</span>
                  <button onClick={handleContactWhatsApp} className="text-brand-orange font-bold hover:underline flex items-center gap-1">
                    Cotizar gratis &rarr;
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PORTFOLIO SECTION (Nuestras Aplicaciones) */}
      <section id="portfolio" className="py-16 sm:py-24 bg-neutral-50 border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="px-3.5 py-1 bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-wider rounded-full">
              Catálogo de Soluciones
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 mt-3">
              Portafolio de Aplicaciones
            </h2>
            <p className="mt-3 text-sm sm:text-lg text-neutral-500">
              Explora los sistemas que hemos desarrollado. Haz clic en <strong>Pedir Demo</strong> para coordinar una prueba guiada directamente por WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
            {portfolioApps.map((app, idx) => (
              <motion.div 
                key={`landing-portfolio-${app.id || idx}-${idx}`}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <span className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs font-bold">
                      {app.category}
                    </span>
                    <div className="text-right">
                      <div className="text-lg font-extrabold text-neutral-900">
                        ${app.price.toLocaleString()}
                      </div>
                      {app.hasSubscription && app.subscriptionPrice ? (
                        <div className="text-[11px] font-bold text-brand-orange bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-md mt-0.5">
                          + ${app.subscriptionPrice.toLocaleString()} / {app.subscriptionPeriod || 'Mensual'}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3">
                    {app.name}
                  </h3>

                  <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                    {app.description || 'Sistema web adaptado a dispositivos móviles para optimizar la gestión operativa de tu negocio.'}
                  </p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-xs font-medium text-neutral-600">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                      <span>Acceso multiplataforma (Celular, Tablet y PC)</span>
                    </div>
                    {app.hasSubscription && app.subscriptionPrice ? (
                      <div className="flex items-center gap-2 text-xs font-semibold text-brand-orange">
                        <CheckCircle2 size={16} className="text-brand-orange shrink-0" />
                        <span>Mantenimiento / Suscripción: ${app.subscriptionPrice.toLocaleString()} ({app.subscriptionPeriod || 'Mensual'})</span>
                      </div>
                    ) : null}
                    <div className="flex items-center gap-2 text-xs font-medium text-neutral-600">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                      <span>Soporte personalizado e implementación</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex flex-col gap-3">
                  {app.demoUrl ? (
                    <div className="flex items-center justify-between text-xs bg-neutral-50 px-3 py-2 rounded-xl border border-neutral-100 text-neutral-600 font-mono overflow-hidden">
                      <span className="truncate mr-2">{app.demoUrl}</span>
                      <button 
                        onClick={() => handleShareApp(app)}
                        className="text-brand-orange hover:text-orange-600 font-sans font-bold flex items-center gap-1 shrink-0"
                        title="Copiar / Compartir enlace"
                      >
                        {copiedAppId === app.id ? (
                          <>
                            <Check size={14} className="text-emerald-500" />
                            <span className="text-emerald-600 text-[11px]">¡Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={13} />
                            <span className="text-[11px]">Copiar Link</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-2.5">
                    {/* Botón Ver Toda la Información de Venta (Página Dedicada para Redes) */}
                    <button 
                      onClick={() => onViewProductSales ? onViewProductSales(app) : setBuyingApp(app)}
                      className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-xs shadow-md active:scale-95 border border-neutral-700/60 group"
                    >
                      <Sparkles size={15} className="text-brand-orange group-hover:rotate-12 transition-transform" />
                      <span>Ver Toda la Información & Ficha de Venta</span>
                    </button>

                    {/* Botón Principal: Comprar Aplicación */}
                    <button 
                      onClick={() => setBuyingApp(app)}
                      className="w-full bg-gradient-to-r from-brand-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/25 active:scale-95 text-sm group"
                    >
                      <ShoppingCart size={17} className="group-hover:scale-110 transition-transform" />
                      <span>Comprar Aplicación (${app.price.toLocaleString()})</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleRequestDemo(app.name)}
                        className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs active:scale-95"
                        title="Pedir Demo guiada por WhatsApp"
                      >
                        <MessageCircle size={15} />
                        <span>Pedir Demo</span>
                      </button>

                      <button
                        onClick={() => handleShareApp(app)}
                        className={`py-2.5 px-3 text-xs font-bold rounded-xl border border-neutral-200 transition-all flex items-center justify-center ${
                          copiedAppId === app.id ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-600'
                        }`}
                        title="Compartir enlace de esta aplicación"
                      >
                        {copiedAppId === app.id ? (
                          <>
                            <Check size={14} className="text-emerald-500" />
                            <span className="text-[11px] ml-1">¡Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Share2 size={14} />
                            <span className="text-[11px] ml-1">Compartir</span>
                          </>
                        )}
                      </button>

                      {app.demoUrl && (
                        <a 
                          href={app.demoUrl.startsWith('http') ? app.demoUrl : `https://${app.demoUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 px-3 text-xs font-bold rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 flex items-center justify-center gap-1 transition-colors"
                          title="Abrir Demo Online"
                        >
                          <span>Demo</span>
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {portfolioApps.length === 0 && (
              <div className="col-span-full py-12 text-center text-neutral-400 bg-white rounded-3xl border border-dashed border-neutral-200">
                No hay sistemas registrados en el portafolio actualmente.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Nuestros Servicios</h2>
            <p className="mt-3 text-neutral-500 text-sm sm:text-base">Ofrecemos soluciones tecnológicas integrales para cada necesidad.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { title: 'Sistemas Empresariales', icon: LayoutDashboard, desc: 'ERP, CRM y herramientas de gestión interna para optimizar procesos corporativos.' },
              { title: 'Aplicaciones Móviles', icon: ShoppingCart, desc: 'Apps nativas y multiplataforma diseñadas para brindar la mejor experiencia de usuario.' },
              { title: 'Desarrollo a Medida', icon: Package, desc: 'Software personalizado que se adapta exactamente a los requerimientos de tu proyecto.' }
            ].map((service, i) => (
              <motion.div 
                key={`landing-service-card-${i}`}
                whileHover={{ y: -6 }}
                className="glass-card p-6 sm:p-8 hover:shadow-xl transition-all rounded-3xl"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-brand-orange/10 text-brand-orange rounded-2xl flex items-center justify-center mb-6">
                  <service.icon size={28} />
                </div>
                <div className="text-lg sm:text-xl font-bold mb-3">{service.title}</div>
                <p className="text-neutral-500 leading-relaxed text-sm">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-16 sm:py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 sm:mb-16 gap-4">
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Soluciones Especializadas</h2>
              <p className="mt-3 text-neutral-500 text-sm sm:text-base">Desarrollamos sistemas verticales adaptados a industrias específicas.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { title: 'Gestión Comercial', icon: Layout, desc: 'Control total de inventario, ventas y facturación.' },
              { title: 'Ferreterías', icon: Hammer, desc: 'Sistemas con manejo de miles de SKUs y unidades de medida.' },
              { title: 'Distribuidoras', icon: Truck, desc: 'Logística, rutas de entrega y preventa móvil.' },
              { title: 'Finanzas', icon: Wallet, desc: 'Control de gastos, ingresos y proyecciones financieras.' },
              { title: 'Gestión de Tareas', icon: ClipboardList, desc: 'Organización de equipos y seguimiento de proyectos.' },
              { title: 'A Medida', icon: Sparkles, desc: 'Lo que tu negocio necesite, nosotros lo construimos.' },
            ].map((item, i) => (
              <div key={`landing-solution-card-${i}`} className="group p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200/60 hover:border-brand-orange/30 transition-all shadow-sm">
                <div className="w-12 h-12 bg-neutral-50 group-hover:bg-brand-orange/10 text-neutral-500 group-hover:text-brand-orange rounded-xl flex items-center justify-center mb-5 transition-colors">
                  <item.icon size={24} />
                </div>
                <h4 className="text-lg font-bold mb-2 text-neutral-900">{item.title}</h4>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Innovations Section */}
      <section className="py-16 sm:py-24 bg-neutral-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-orange/5 blur-[120px] rounded-full translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-brand-orange" size={20} />
            <span className="text-brand-orange font-bold tracking-widest uppercase text-xs">Innovación Constante</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-10 sm:mb-12">Próximos Cambios y Mejoras</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {(banners || []).filter(b => b.isActive).map((banner, idx) => (
              <div key={`landing-active-banner-${banner.id || idx}-${idx}`} className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    banner.type === 'Innovation' ? 'bg-indigo-500/20 text-indigo-400' : 
                    banner.type === 'Update' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {banner.type === 'Innovation' ? 'Innovación' : banner.type === 'Update' ? 'Actualización' : 'Aviso'}
                  </div>
                  <span className="text-white/40 text-xs flex items-center gap-1">
                    <Clock size={12} /> {new Date(banner.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">{banner.title}</h3>
                <p className="text-white/60 leading-relaxed text-xs sm:text-sm">{banner.description}</p>
              </div>
            ))}
            {(banners || []).filter(b => b.isActive).length === 0 && (
              <div className="col-span-full py-12 text-center text-white/30 italic">
                No hay anuncios activos en este momento.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="py-12 border-t border-neutral-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-white">N</span>
            </div>
            <span className="font-bold text-neutral-900">Nova AJ</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <button 
              onClick={handleContactWhatsApp}
              className="text-xs sm:text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5"
            >
              <PhoneCall size={16} />
              <span>WhatsApp de Ventas</span>
            </button>
            <button 
              onClick={onAdminClick}
              className="text-neutral-400 hover:text-brand-orange text-xs sm:text-sm font-medium transition-colors"
            >
              Acceso Administración
            </button>
            <p className="text-neutral-400 text-xs sm:text-sm text-center">© 2026 Nova AJ Sistema Digital. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
      {/* Modal de Compra de Aplicación */}
      {buyingApp && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setBuyingApp(null)}
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" 
          />

          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 15 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className="glass-card w-full max-w-xl p-6 sm:p-8 relative z-10 max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
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
                      {buyingApp.sku}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold uppercase">
                      Entrega Inmediata
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mt-1 leading-snug">
                    {buyingApp.name}
                  </h3>
                </div>
              </div>
              <button 
                onClick={() => setBuyingApp(null)} 
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
                    ${buyingApp.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-neutral-500 font-semibold ml-1">ARS</span>
                </div>
              </div>
              {buyingApp.hasSubscription && buyingApp.subscriptionPrice ? (
                <div className="text-xs font-bold text-brand-orange bg-white px-2.5 py-1 rounded-lg border border-orange-100 inline-block mb-3">
                  + ${buyingApp.subscriptionPrice.toLocaleString()} / {buyingApp.subscriptionPeriod || 'Mensual'} (Mantenimiento, soporte y actualizaciones)
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
                  onClick={() => handleBuyWhatsApp(buyingApp)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 active:scale-95 text-sm"
                >
                  <MessageCircle size={18} />
                  <span>Comprar por WhatsApp (${buyingApp.price.toLocaleString()})</span>
                </button>
              </div>
            )}

            {/* Tab 2: Bank Transfer */}
            {buyPaymentMethod === 'transfer' && (
              <div className="space-y-3">
                <p className="text-xs text-neutral-600 font-medium">
                  Realiza la transferencia por el importe de <strong>${buyingApp.price.toLocaleString()}</strong> a los siguientes datos:
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
                  onClick={() => handleBuyWhatsApp(buyingApp, 'He realizado o deseo confirmar la transferencia bancaria por este sistema.')}
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
                  Ingresa tus datos de facturación o contacto para registrar la compra oficial de <strong>{buyingApp.name}</strong>:
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
                onClick={() => setBuyingApp(null)}
                className="text-neutral-500 hover:text-neutral-800 font-semibold underline"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
