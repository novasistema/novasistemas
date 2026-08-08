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
  PhoneCall
} from 'lucide-react';
import { Banner, Product, View } from '../types';

interface LandingViewProps {
  setView: (view: View) => void;
  banners: Banner[];
  products?: Product[];
  onAdminClick: () => void;
}

export const LandingView = ({ setView, banners, products = [], onAdminClick }: LandingViewProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const portfolioApps = (products || []).filter(p => p.inPortfolio !== false);

  const handleRequestDemo = (appName: string) => {
    const text = encodeURIComponent(`Hola Nova AJ! Me gustaría solicitar una Demo del sistema: ${appName}`);
    window.open(`https://wa.me/5493815043132?text=${text}`, '_blank');
  };

  const handleContactWhatsApp = () => {
    const text = encodeURIComponent('Hola Nova AJ! Quisiera consultar por el desarrollo de un proyecto o sistema a medida.');
    window.open(`https://wa.me/5493815043132?text=${text}`, '_blank');
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
              <span>Desarrollo de Software & Aplicaciones</span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-neutral-900">
              Sistemas <span className="text-brand-orange">Digitales</span> para un mundo moderno.
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-xl text-neutral-500 max-w-lg leading-relaxed">
              Desarrollamos aplicaciones empresariales y soluciones personales a medida. Potencia tu negocio con tecnología de vanguardia.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button onClick={handleContactWhatsApp} className="btn-primary px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg justify-center shadow-xl shadow-brand-orange/20">
                <MessageCircle size={20} />
                Empezar Proyecto
              </button>
              <button onClick={scrollToPortfolio} className="btn-secondary px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg justify-center">
                <Layers size={20} />
                Ver Portafolio
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden sm:block"
          >
            <div className="aspect-square bg-brand-orange/5 rounded-[40px] flex items-center justify-center p-8 lg:p-12">
              <div className="w-full h-full glass-card p-6 sm:p-8 flex flex-col gap-6 shadow-2xl bg-white/90">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-orange rounded-xl flex items-center justify-center text-white shadow-md">
                    <LayoutDashboard size={24} />
                  </div>
                  <div>
                    <div className="h-4 w-32 bg-neutral-200 rounded-full mb-2" />
                    <div className="h-3 w-20 bg-neutral-100 rounded-full" />
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4 space-y-2">
                    <div className="h-3 w-12 bg-emerald-200 rounded-full" />
                    <div className="h-5 w-20 bg-neutral-800 rounded-full" />
                  </div>
                  <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4 space-y-2">
                    <div className="h-3 w-12 bg-brand-orange/30 rounded-full" />
                    <div className="h-5 w-16 bg-neutral-800 rounded-full" />
                  </div>
                  <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4 col-span-2 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="h-3 w-24 bg-neutral-200 rounded-full" />
                      <div className="h-4 w-36 bg-neutral-700 rounded-full" />
                    </div>
                    <div className="w-8 h-8 bg-brand-orange/10 rounded-lg" />
                  </div>
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
            {portfolioApps.map((app) => (
              <motion.div 
                key={app.id}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <span className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs font-bold">
                      {app.category}
                    </span>
                    <span className="text-lg font-extrabold text-neutral-900">
                      ${app.price.toLocaleString()}
                    </span>
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
                    <div className="flex items-center gap-2 text-xs font-medium text-neutral-600">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                      <span>Soporte personalizado e implementación</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button 
                    onClick={() => handleRequestDemo(app.name)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 text-sm"
                  >
                    <MessageCircle size={18} />
                    <span>Pedir Demo por WhatsApp</span>
                  </button>

                  {app.demoUrl && (
                    <a 
                      href={app.demoUrl.startsWith('http') ? app.demoUrl : `https://${app.demoUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary py-3 px-4 text-xs font-bold justify-center"
                    >
                      <span>Ver Demo Online</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
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
                key={i}
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
              <div key={i} className="group p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200/60 hover:border-brand-orange/30 transition-all shadow-sm">
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
            {(banners || []).filter(b => b.isActive).map((banner) => (
              <div key={banner.id} className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
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
    </div>
  );
};
