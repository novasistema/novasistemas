import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft,
  ShoppingCart,
  MessageCircle,
  ExternalLink,
  Share2,
  Check,
  Copy,
  Star,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
  GitBranch,
  Folder,
  Globe,
  Bot,
  Key,
  CreditCard,
  Building,
  HelpCircle,
  ChevronDown,
  Layers,
  Smartphone,
  Laptop,
  Flame,
  Award,
  Users,
  BadgeCheck,
  Lock,
  Download,
  Terminal,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Product } from '../types';

interface ProductSalesLandingProps {
  product: Product;
  onBack: () => void;
  onBuy: (product: Product) => void;
  onAdminClick?: () => void;
}

export const ProductSalesLanding: React.FC<ProductSalesLandingProps> = ({
  product,
  onBack,
  onBuy,
  onAdminClick,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'tech' | 'pricing' | 'faq'>('overview');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLinkType, setCopiedLinkType] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [selectedUtmSource, setSelectedUtmSource] = useState<'facebook' | 'instagram' | 'tiktok' | 'whatsapp' | 'clean'>('facebook');

  // Compute calculated pricing & discounts for marketing impact
  const calculatedOriginalPrice = product.originalPrice || Math.round(product.price * 1.35);
  const discountPercentage = Math.round(((calculatedOriginalPrice - product.price) / calculatedOriginalPrice) * 100);

  // Generate URL for sharing
  const getProductUrl = (source: 'facebook' | 'instagram' | 'tiktok' | 'whatsapp' | 'clean') => {
    const baseUrl = window.location.origin + window.location.pathname;
    if (source === 'clean') {
      return `${baseUrl}?product=${encodeURIComponent(product.id)}`;
    }
    const utmCampaign = encodeURIComponent(product.sku.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'campana_redes');
    return `${baseUrl}?product=${encodeURIComponent(product.id)}&utm_source=${source}&utm_medium=paid&utm_campaign=${utmCampaign}&fbclid=IwdGRjcAVHBqtleHRuA2FlbQEw`;
  };

  const handleCopyLink = async (source: 'facebook' | 'instagram' | 'tiktok' | 'whatsapp' | 'clean') => {
    const url = getProductUrl(source);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLinkType(source);
      setTimeout(() => setCopiedLinkType(null), 2500);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleWhatsAppInquiry = () => {
    const subText = product.hasSubscription && product.subscriptionPrice 
      ? ` (+ Abono: $${product.subscriptionPrice.toLocaleString()} / ${product.subscriptionPeriod || 'Mensual'})` 
      : '';
    const text = encodeURIComponent(
      `¡Hola Nova AJ! Vi la aplicación "${product.name}" (SKU: ${product.sku}) en el enlace de redes y quiero más información para adquirirla por $${product.price.toLocaleString()}${subText}. ¿Tienen disponibilidad para coordinar la demo y entrega?`
    );
    window.open(`https://wa.me/5493815043132?text=${text}`, '_blank');
  };

  // Default features if not custom specified
  const featuresList = (product.features && product.features.length > 0) ? product.features : [
    'Control de inventario, stock crítico y alertas automáticas en tiempo real',
    'Punto de venta (POS) ultra rápido adaptado para emitir comprobantes y tickets',
    'Gestión completa de clientes, cuentas corrientes, deudas y saldos',
    'Reportes estadísticos, gráficos de facturación, balance diario y mensual',
    'Acceso multidispositivo simultáneo desde Celular, Tablet, Notebook y PC de escritorio',
    'Base de datos segura en la nube con copias de respaldo automáticas 24/7',
    'Control de permisos por roles: Administrador, Cajero, Vendedor y Supervisor',
    'Exportación de planillas de ventas y catálogo a Excel y formatos PDF'
  ];

  // Default benefits
  const benefitsList = (product.benefits && product.benefits.length > 0) ? product.benefits : [
    {
      title: 'Evita pérdidas de dinero y descontrol',
      desc: 'Visualiza cada centavo que entra y sale de tu negocio con balances exactos y sin errores humanos.'
    },
    {
      title: 'Ahorra más de 15 horas semanales',
      desc: 'Automatiza procesos repetitivos de facturación, control de stock y seguimiento de cobranzas.'
    },
    {
      title: 'Tu negocio en tu bolsillo',
      desc: 'Revisa las ventas y métricas estés donde estés desde tu smartphone sin necesidad de estar físicamente en el local.'
    },
    {
      title: 'Listo para usar de inmediato',
      desc: 'Sin configuraciones complejas ni programas pesados: ingresas con usuario y contraseña desde tu navegador.'
    }
  ];

  // Default FAQs
  const faqs = [
    {
      q: '¿Cómo recibo el sistema una vez realizada la compra?',
      a: 'La entrega es inmediata. Al confirmar la compra te proporcionamos los accesos oficiales de Administrador y Creador, el enlace directo a tu aplicación en producción (Vercel), y opcionalmente el repositorio de GitHub con el código fuente y la documentación para tu PC.'
    },
    {
      q: '¿Necesito instalar algún programa pesado en mi computadora?',
      a: 'No. El sistema es una aplicación web moderna (PWA) basada en la nube. Puedes acceder desde cualquier navegador web en tu computadora, notebook, tablet o celular como si fuera una aplicación instalada.'
    },
    {
      q: '¿Qué incluye el soporte técnico y la garantía?',
      a: 'Incluye acompañamiento personalizado de Nova AJ para la configuración inicial, carga de datos base, resolución de dudas por WhatsApp y garantía total de operatividad del sistema.'
    },
    {
      q: '¿El pago de la aplicación es único o mensual?',
      a: product.hasSubscription && product.subscriptionPrice 
        ? `Adquieres la licencia de la aplicación por $${product.price.toLocaleString()} ARS y cuentas con un mantenimiento y soporte mensual de $${product.subscriptionPrice.toLocaleString()} ARS para asegurar servidores en la nube, actualizaciones continuas y copias de seguridad.` 
        : `El pago de $${product.price.toLocaleString()} ARS es por la compra del sistema y su puesta en marcha. No tienes costos ocultos ni comisiones por venta.`
    },
    {
      q: '¿Se puede personalizar o agregar funciones específicas para mi rubro?',
      a: 'Sí, totalmente. Al ser desarrolladores directos en Nova AJ, podemos adaptar pantallas, módulos, cálculos de impuestos o integraciones específicas que tu negocio requiera.'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans selection:bg-brand-orange selection:text-white pb-24">
      {/* Top Advertising Announcement Bar */}
      <div className="bg-gradient-to-r from-orange-600 via-brand-orange to-amber-500 text-white text-xs font-bold py-2.5 px-4 text-center flex items-center justify-center gap-2 shadow-sm">
        <Flame size={15} className="animate-bounce shrink-0" />
        <span>¡OFERTA ESPECIAL PARA REDES SOCIALES! Entrega inmediata y soporte 1 a 1 de Nova AJ</span>
        <span className="hidden md:inline bg-black/20 px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider ml-1">
          CUPOS LIMITADOS
        </span>
      </div>

      {/* Navigation Header */}
      <nav className="sticky top-0 z-40 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 -ml-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors flex items-center gap-1.5 text-xs sm:text-sm font-semibold"
              title="Volver al catálogo"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Volver al Catálogo</span>
            </button>
            <div className="h-6 w-px bg-neutral-800 hidden sm:block" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-brand-orange rounded-xl flex items-center justify-center text-white font-extrabold shadow-md shadow-brand-orange/30">
                N
              </div>
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white hidden md:inline">
                Nova AJ <span className="text-brand-orange text-xs font-normal">| Apps</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-neutral-700"
              title="Obtener enlace publicitario para redes"
            >
              <Share2 size={15} className="text-brand-orange" />
              <span className="hidden sm:inline">Link Publicidad / Ads</span>
              <span className="sm:hidden">Compartir</span>
            </button>

            {product.demoUrl && (
              <a
                href={product.demoUrl.startsWith('http') ? product.demoUrl : `https://${product.demoUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-neutral-700"
              >
                <ExternalLink size={14} className="text-emerald-400" />
                <span className="hidden sm:inline">Demo en Vivo</span>
                <span className="sm:hidden">Demo</span>
              </a>
            )}

            <button
              onClick={() => onBuy(product)}
              className="bg-gradient-to-r from-brand-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg shadow-brand-orange/25 active:scale-95 flex items-center gap-1.5"
            >
              <ShoppingCart size={16} />
              <span>Comprar Ahora</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-8 sm:pt-14 pb-12 sm:pb-20 px-4 sm:px-6 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-brand-orange/15 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Product Information & Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badges & Tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-brand-orange/20 border border-brand-orange/40 text-brand-orange rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={13} />
                  {product.badge || 'Sistema Verificado'}
                </span>
                <span className="px-3 py-1 bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-full text-xs font-medium">
                  {product.category}
                </span>
                <span className="px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-semibold flex items-center gap-1">
                  <BadgeCheck size={14} />
                  Código Fuente & Deploy Listo
                </span>
                <span className="px-2.5 py-1 bg-neutral-800 text-neutral-400 font-mono text-xs rounded-full">
                  SKU: {product.sku}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-white leading-[1.15]">
                {product.name}
              </h1>

              {/* High-Converting Tagline */}
              <p className="text-lg sm:text-xl text-neutral-300 font-medium leading-relaxed">
                {product.tagline || product.description || 'La plataforma definitiva diseñada para modernizar tu negocio, multiplicar la productividad y darte control total desde cualquier dispositivo.'}
              </p>

              {/* Rating and Social Proof */}
              <div className="flex items-center gap-3 pt-1 border-y border-neutral-800/80 py-3">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={17} fill="currentColor" />
                  ))}
                </div>
                <span className="text-sm font-bold text-white">4.9 / 5.0</span>
                <span className="text-neutral-500 text-xs">•</span>
                <span className="text-xs text-neutral-400">Calificado por más de 35 empresas y profesionales</span>
                <span className="hidden sm:inline text-neutral-500 text-xs">•</span>
                <span className="hidden sm:inline text-xs text-emerald-400 font-semibold">Garantía Nova AJ</span>
              </div>

              {/* Quick Benefits Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-neutral-300">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Acceso multidispositivo (Celular, Tablet y PC)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Base de datos en la nube con respaldo diario</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Credenciales privadas Admin y Creador</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Soporte técnico 1 a 1 y puesta en marcha</span>
                </div>
              </div>

              {/* Target Audience Badge */}
              <div className="p-3.5 bg-neutral-800/60 rounded-2xl border border-neutral-700/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Users size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-400 uppercase tracking-wide">
                    Diseñado especialmente para:
                  </div>
                  <div className="text-sm font-semibold text-neutral-200">
                    {product.targetAudience || 'Comercios, PYMEs, Distribuidoras, Profesionales independientes y Emprendedores.'}
                  </div>
                </div>
              </div>

              {/* Actions & Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  onClick={() => onBuy(product)}
                  className="flex-1 bg-gradient-to-r from-brand-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-xl shadow-brand-orange/30 active:scale-95 flex items-center justify-center gap-2.5 text-base sm:text-lg group"
                >
                  <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                  <span>Comprar Aplicación Ahora</span>
                </button>

                <button
                  onClick={handleWhatsAppInquiry}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-emerald-600/25 active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <MessageCircle size={20} />
                  <span>Pedir Demo por WhatsApp</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-2 px-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  Compra 100% segura
                </span>
                <span className="flex items-center gap-1">
                  <Zap size={14} className="text-amber-400" />
                  Activación en minutos
                </span>
                <span className="flex items-center gap-1">
                  <Award size={14} className="text-brand-orange" />
                  Soporte garantizado
                </span>
              </div>
            </div>

            {/* Right Column: Pricing & Purchase Box (High Conversion Card) */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-b from-neutral-800 to-neutral-850 p-6 sm:p-8 rounded-3xl border border-neutral-700/80 shadow-2xl relative overflow-hidden">
                {/* Ribbon */}
                <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md animate-pulse">
                  ¡Ahorras {discountPercentage}%!
                </div>

                <div className="mb-6">
                  <span className="text-xs font-bold text-brand-orange uppercase tracking-wider block mb-1">
                    Inversión Única de Licencia
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl sm:text-5xl font-black text-white">
                      ${product.price.toLocaleString()}
                    </span>
                    <span className="text-neutral-400 font-semibold text-sm">ARS</span>
                    <span className="text-neutral-500 line-through text-lg font-medium ml-1">
                      ${calculatedOriginalPrice.toLocaleString()}
                    </span>
                  </div>

                  {product.hasSubscription && product.subscriptionPrice ? (
                    <div className="mt-3 p-3 bg-neutral-900/90 rounded-xl border border-orange-500/30 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-neutral-400 block text-[11px]">Plan Mantenimiento / Nube:</span>
                        <span className="text-brand-orange font-bold text-sm">
                          + ${product.subscriptionPrice.toLocaleString()} / {product.subscriptionPeriod || 'Mensual'}
                        </span>
                      </div>
                      <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded font-bold uppercase">
                        Soporte & Servidor
                      </span>
                    </div>
                  ) : (
                    <div className="mt-2 text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={14} /> Sin cuotas obligatorias ni comisiones por ventas
                    </div>
                  )}
                </div>

                {/* What's included checklist */}
                <div className="space-y-3 py-4 border-t border-b border-neutral-700/80 text-xs sm:text-sm text-neutral-300">
                  <div className="font-bold text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Layers size={14} className="text-brand-orange" />
                    ¿Qué incluye tu entrega?
                  </div>
                  
                  <div className="flex items-start gap-2.5">
                    <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>Aplicación completa lista para operar en producción</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>Credenciales privadas de acceso (Admin y Creador)</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>Despliegue en la nube (Vercel) con certificado SSL gratis</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>Código fuente en GitHub y carpeta de desarrollo organizada</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>Capacitación personalizada y soporte técnico directo</span>
                  </div>
                </div>

                {/* Main Purchase CTA */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => onBuy(product)}
                    className="w-full bg-gradient-to-r from-brand-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold py-4 px-6 rounded-2xl transition-all shadow-xl shadow-brand-orange/30 active:scale-95 flex items-center justify-center gap-2 text-base group"
                  >
                    <ShoppingCart size={19} className="group-hover:scale-110 transition-transform" />
                    <span>Quiero Esta Aplicación Ahora</span>
                  </button>

                  <button
                    onClick={handleWhatsAppInquiry}
                    className="w-full bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-bold py-3 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
                  >
                    <MessageCircle size={17} className="text-emerald-400" />
                    <span>Consultar dudas antes de comprar</span>
                  </button>
                </div>

                {/* Formas de Pago Aceptadas */}
                <div className="mt-5 pt-4 border-t border-neutral-700/60 text-center">
                  <span className="text-[11px] font-bold text-neutral-400 block mb-2">
                    MÉTODOS DE PAGO DISPONIBLES:
                  </span>
                  <div className="flex items-center justify-center gap-3 text-xs text-neutral-300 font-semibold">
                    <span className="bg-neutral-900 px-2.5 py-1 rounded border border-neutral-700 flex items-center gap-1">
                      <CreditCard size={13} className="text-brand-orange" /> Transferencia CBU
                    </span>
                    <span className="bg-neutral-900 px-2.5 py-1 rounded border border-neutral-700 flex items-center gap-1">
                      <MessageCircle size={13} className="text-emerald-400" /> WhatsApp Directo
                    </span>
                    <span className="bg-neutral-900 px-2.5 py-1 rounded border border-neutral-700 flex items-center gap-1">
                      <Building size={13} className="text-indigo-400" /> Factura
                    </span>
                  </div>
                </div>

                {/* Direct Ads Campaign Share Button */}
                <div className="mt-4 pt-3 border-t border-neutral-700/40">
                  <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="w-full text-xs text-neutral-400 hover:text-brand-orange transition-colors flex items-center justify-center gap-1.5 py-1.5"
                  >
                    <Share2 size={13} />
                    <span>Copiar enlace de publicidad para campañas de Facebook Ads / Redes</span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Navigation Tabs Bar */}
      <section className="border-t border-b border-neutral-800 bg-neutral-950/80 sticky top-16 sm:top-20 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto py-3 no-scrollbar text-xs sm:text-sm font-bold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/20'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Sparkles size={15} />
              <span>Visión General & Problema</span>
            </button>

            <button
              onClick={() => setActiveTab('features')}
              className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'features'
                  ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/20'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Zap size={15} />
              <span>Módulos & Funcionalidades</span>
            </button>

            <button
              onClick={() => setActiveTab('tech')}
              className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'tech'
                  ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/20'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Terminal size={15} />
              <span>Pack Técnico & GitHub</span>
            </button>

            <button
              onClick={() => setActiveTab('pricing')}
              className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'pricing'
                  ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/20'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <CreditCard size={15} />
              <span>Planes & Compra</span>
            </button>

            <button
              onClick={() => setActiveTab('faq')}
              className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'faq'
                  ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/20'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <HelpCircle size={15} />
              <span>Preguntas Frecuentes</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area Based on Active Tab */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

        {/* TAB 1: OVERVIEW & PAIN POINTS */}
        {activeTab === 'overview' && (
          <div className="space-y-16">
            
            {/* Problema vs Solución (Copywriting de alta conversión) */}
            <div>
              <div className="text-center max-w-3xl mx-auto mb-10">
                <span className="px-3.5 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider rounded-full">
                  ¿Por qué necesitas esta aplicación?
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3">
                  Deja atrás el descontrol y lleva tu negocio al siguiente nivel
                </h2>
                <p className="mt-2 text-sm sm:text-base text-neutral-400">
                  Compara cómo cambia tu día a día antes y después de implementar <strong>{product.name}</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {/* Sin la app */}
                <div className="bg-red-950/20 border border-red-900/40 rounded-3xl p-6 sm:p-8 space-y-4">
                  <div className="flex items-center gap-2.5 text-red-400 font-bold text-base sm:text-lg">
                    <AlertCircle size={22} />
                    <span>SIN ESTA APLICACIÓN:</span>
                  </div>
                  <ul className="space-y-3 text-sm text-neutral-300">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold text-base">✕</span>
                      <span>Pérdidas de dinero invisibles por falta de registro de ventas y gastos.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold text-base">✕</span>
                      <span>Quiebres de stock: quedarte sin mercadería clave en el momento de mayor venta.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold text-base">✕</span>
                      <span>Horas perdidas calculando manualmente cierres de caja o balances en papel y Excel.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold text-base">✕</span>
                      <span>Cero visibilidad cuando estás lejos del local o negocio.</span>
                    </li>
                  </ul>
                </div>

                {/* Con la app */}
                <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl shadow-emerald-950/10">
                  <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-base sm:text-lg">
                    <CheckCircle2 size={22} />
                    <span>CON NOVA AJ - {product.name.toUpperCase()}:</span>
                  </div>
                  <ul className="space-y-3 text-sm text-neutral-200">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold text-base">✓</span>
                      <span>Control financiero exacto al centavo en tiempo real.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold text-base">✓</span>
                      <span>Alertas automáticas de reposición antes de que falte stock.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold text-base">✓</span>
                      <span>Cierres de caja y balances automáticos con un solo clic.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold text-base">✓</span>
                      <span>Acceso instantáneo desde tu celular las 24 horas del día.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Key Benefits Grid */}
            <div>
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="px-3.5 py-1 bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-xs font-bold uppercase tracking-wider rounded-full">
                  Beneficios Comprobados
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
                  Todo lo que ganas desde el primer día
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {benefitsList.map((item, idx) => (
                  <div key={idx} className="bg-neutral-800/60 border border-neutral-700/70 p-6 rounded-3xl space-y-3 hover:border-brand-orange/50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-brand-orange/15 text-brand-orange flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <h4 className="text-base font-bold text-white">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Demo & Live Preview Callout */}
            <div className="p-8 sm:p-10 bg-gradient-to-r from-neutral-800 via-neutral-850 to-neutral-800 rounded-3xl border border-neutral-700 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wide">
                  <Sparkles size={16} />
                  <span>¿Quieres ver cómo funciona en vivo?</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  Prueba la demo interactiva o agenda un recorrido por WhatsApp
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
                  Coordinamos una videollamada o te enviamos el usuario de demostración para que pruebes todas las pantallas con tus propios datos.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                {product.demoUrl && (
                  <a
                    href={product.demoUrl.startsWith('http') ? product.demoUrl : `https://${product.demoUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-3 px-5 rounded-xl transition-all flex items-center gap-2 text-xs sm:text-sm"
                  >
                    <ExternalLink size={15} />
                    <span>Abrir Demo Online</span>
                  </a>
                )}
                <button
                  onClick={handleWhatsAppInquiry}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-5 rounded-xl transition-all flex items-center gap-2 text-xs sm:text-sm shadow-lg shadow-emerald-600/20"
                >
                  <MessageCircle size={16} />
                  <span>Pedir Acceso Demo</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: FEATURES & MODULES */}
        {activeTab === 'features' && (
          <div className="space-y-12">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <span className="px-3.5 py-1 bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-xs font-bold uppercase tracking-wider rounded-full">
                Módulos Incluidos
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3">
                Funcionalidades Completas de {product.name}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-neutral-400">
                Cada módulo fue diseñado escuchando las necesidades reales de dueños de negocios y operadores de caja.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {featuresList.map((feat, idx) => (
                <div 
                  key={idx}
                  className="p-5 sm:p-6 bg-neutral-800/70 border border-neutral-700/80 rounded-2xl flex items-start gap-4 hover:border-brand-orange/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-orange/15 text-brand-orange flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white mb-1">
                      {feat}
                    </h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Optimizado para velocidad y facilidad de uso sin requerir conocimientos técnicos previos.
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Multidevice Section */}
            <div className="bg-neutral-850 p-8 rounded-3xl border border-neutral-800 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2 p-4">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Laptop size={24} />
                </div>
                <div className="font-bold text-white text-base">PC & Notebook</div>
                <p className="text-xs text-neutral-400">Panel administrativo con reportes detallados y vista amplia para gestión.</p>
              </div>

              <div className="space-y-2 p-4">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-orange/20 text-brand-orange flex items-center justify-center">
                  <Smartphone size={24} />
                </div>
                <div className="font-bold text-white text-base">Smartphone Móvil</div>
                <p className="text-xs text-neutral-400">Ventas al paso, control de stock y seguimiento remoto desde cualquier lugar.</p>
              </div>

              <div className="space-y-2 p-4">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <TrendingUp size={24} />
                </div>
                <div className="font-bold text-white text-base">Nube en Tiempo Real</div>
                <p className="text-xs text-neutral-400">Varios usuarios pueden trabajar simultáneamente sin pisarse ni duplicar datos.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TECHNICAL DELIVERY & REPOSITORY SPECS */}
        {activeTab === 'tech' && (
          <div className="space-y-10">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <span className="px-3.5 py-1 bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider rounded-full">
                Transparencia & Entrega Técnica
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3">
                Todo lo que recibes como Propietario del Sistema
              </h2>
              <p className="mt-2 text-sm sm:text-base text-neutral-400">
                Organización clara de carpetas locales, repositorios GitHub, Vercel y credenciales del software.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Repositorio GitHub & Deploy */}
              <div className="bg-neutral-800/80 p-6 sm:p-8 rounded-3xl border border-neutral-700/80 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <GitBranch size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Código Fuente & GitHub</h3>
                    <p className="text-xs text-neutral-400">Propiedad y control sobre el desarrollo</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 text-xs">
                  <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                    <span className="text-[10px] text-neutral-500 font-bold uppercase block">Repositorio GitHub</span>
                    <span className="font-mono text-neutral-200 text-xs break-all">
                      {product.githubRepo || 'ajnovasistemas/' + (product.sku.toLowerCase() || 'sistema-app')}
                    </span>
                  </div>

                  <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                    <span className="text-[10px] text-neutral-500 font-bold uppercase block">Proyecto Vercel / Cloud</span>
                    <span className="font-mono text-neutral-200 text-xs break-all">
                      {product.vercelProject || (product.sku.toLowerCase() + '-production')}
                    </span>
                  </div>

                  <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                    <span className="text-[10px] text-neutral-500 font-bold uppercase block">Carpeta de desarrollo en PC</span>
                    <span className="font-mono text-neutral-200 text-xs break-all">
                      {product.localFolderPath || 'C:\\Proyectos\\NovaAJ\\' + (product.sku.toLowerCase() || 'sistema')}
                    </span>
                  </div>

                  <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                    <span className="text-[10px] text-neutral-500 font-bold uppercase block">Cuenta Creadora Google AI Studio</span>
                    <span className="font-mono text-neutral-200 text-xs">
                      {product.aiStudioAccount || 'ajnovasistemas@gmail.com'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Credenciales de Acceso */}
              <div className="bg-neutral-800/80 p-6 sm:p-8 rounded-3xl border border-neutral-700/80 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Key size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Credenciales y Accesos Oficiales</h3>
                    <p className="text-xs text-neutral-400">Roles independientes para administración y creador</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 text-xs">
                  <div className="bg-neutral-900 p-3.5 rounded-xl border border-emerald-500/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                        <ShieldCheck size={14} /> Acceso Administrador (Dueño)
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                        Listo para entrega
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      Usuario y clave privada con control de ventas, caja, reportes y configuración.
                    </p>
                  </div>

                  <div className="bg-neutral-900 p-3.5 rounded-xl border border-orange-500/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-brand-orange text-xs flex items-center gap-1.5">
                        <Sparkles size={14} /> Acceso Creador / Master
                      </span>
                      <span className="text-[10px] bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded">
                        Full Control
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      Gestión de módulos, auditoría técnica, respaldos y permisos globales de Nova AJ.
                    </p>
                  </div>

                  <div className="bg-neutral-900 p-3.5 rounded-xl border border-neutral-800">
                    <span className="font-bold text-neutral-300 text-xs block mb-1">
                      Servidor y Seguridad
                    </span>
                    <p className="text-[11px] text-neutral-400">
                      Encriptación SSL, reglas de seguridad en Firestore/Base de datos y copias de seguridad continuas.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: PRICING & PLANS */}
        {activeTab === 'pricing' && (
          <div className="space-y-10">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <span className="px-3.5 py-1 bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-xs font-bold uppercase tracking-wider rounded-full">
                Planes Transparentes
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3">
                Elige la forma de adquirir tu sistema
              </h2>
              <p className="mt-2 text-sm sm:text-base text-neutral-400">
                Precios claros en moneda nacional sin sorpresas de tipo de cambio ni comisiones imprevistas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              
              {/* Option 1: Licencia Completa */}
              <div className="bg-neutral-800/80 p-8 rounded-3xl border border-neutral-700 space-y-6 flex flex-col justify-between">
                <div>
                  <span className="px-3 py-1 bg-neutral-700 text-neutral-300 text-xs font-bold rounded-full uppercase">
                    Licencia Única
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-3">Compra Definitiva</h3>
                  <p className="text-xs text-neutral-400 mt-1">El sistema pasa a ser tuyo con entrega completa.</p>
                  
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">${product.price.toLocaleString()}</span>
                    <span className="text-neutral-400 font-semibold text-xs">ARS (pago único)</span>
                  </div>

                  <ul className="mt-6 space-y-3 text-xs text-neutral-300">
                    <li className="flex items-center gap-2">
                      <Check size={15} className="text-emerald-400 shrink-0" />
                      <span>Licencia perpetua de la aplicación</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={15} className="text-emerald-400 shrink-0" />
                      <span>Entrega de accesos Admin y Creador</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={15} className="text-emerald-400 shrink-0" />
                      <span>Código listo en Vercel y GitHub</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={15} className="text-emerald-400 shrink-0" />
                      <span>Soporte inicial de configuración y arranque</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => onBuy(product)}
                  className="w-full bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-3.5 px-4 rounded-xl transition-all text-sm"
                >
                  Comprar Licencia (${product.price.toLocaleString()})
                </button>
              </div>

              {/* Option 2: Con Mantenimiento Premium */}
              <div className="bg-gradient-to-b from-neutral-800 via-neutral-850 to-neutral-900 p-8 rounded-3xl border-2 border-brand-orange space-y-6 flex flex-col justify-between relative shadow-2xl shadow-brand-orange/10">
                <div className="absolute -top-3.5 right-6 bg-brand-orange text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow">
                  Recomendado para Empresas
                </div>

                <div>
                  <span className="px-3 py-1 bg-brand-orange/20 text-brand-orange text-xs font-bold rounded-full uppercase">
                    Llave en Mano con Soporte
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-3">Plan Todo Incluido</h3>
                  <p className="text-xs text-neutral-400 mt-1">Servidor en la nube, soporte prioritario y actualizaciones.</p>
                  
                  <div className="mt-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-white">${product.price.toLocaleString()}</span>
                      <span className="text-neutral-400 font-semibold text-xs">ARS</span>
                    </div>
                    {product.hasSubscription && product.subscriptionPrice ? (
                      <div className="text-xs font-bold text-brand-orange mt-1">
                        + ${product.subscriptionPrice.toLocaleString()} / {product.subscriptionPeriod || 'Mensual'}
                      </div>
                    ) : (
                      <div className="text-xs text-emerald-400 font-medium mt-1">
                        Soporte continuo personalizado
                      </div>
                    )}
                  </div>

                  <ul className="mt-6 space-y-3 text-xs text-neutral-200">
                    <li className="flex items-center gap-2">
                      <Check size={15} className="text-emerald-400 shrink-0" />
                      <span>Todo lo incluido en la Licencia Completa</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={15} className="text-emerald-400 shrink-0" />
                      <span>Servidor cloud 24/7 sin caídas con SSL</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={15} className="text-emerald-400 shrink-0" />
                      <span>Copias de seguridad automáticas diarias</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={15} className="text-emerald-400 shrink-0" />
                      <span>Línea directa WhatsApp para resolución de dudas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={15} className="text-emerald-400 shrink-0" />
                      <span>Actualizaciones continuas y mejoras</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => onBuy(product)}
                  className="w-full bg-gradient-to-r from-brand-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black py-4 px-4 rounded-xl transition-all shadow-lg shadow-brand-orange/30 text-sm active:scale-95"
                >
                  Adquirir Plan Completo
                </button>
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: FAQ ACCORDION */}
        {activeTab === 'faq' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <span className="px-3.5 py-1 bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-xs font-bold uppercase tracking-wider rounded-full">
                Despeja tus dudas
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3">
                Preguntas Frecuentes
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx}
                  className="bg-neutral-800/70 border border-neutral-700/80 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="w-full p-5 text-left font-bold text-white text-sm sm:text-base flex items-center justify-between gap-4"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown 
                      size={18} 
                      className={`text-brand-orange shrink-0 transition-transform ${openFaqIndex === idx ? 'rotate-180' : ''}`} 
                    />
                  </button>

                  {openFaqIndex === idx && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-neutral-700/40 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-neutral-850 rounded-2xl border border-neutral-800 text-center space-y-3">
              <h4 className="text-base font-bold text-white">¿Tienes otra consulta o requerimiento especial?</h4>
              <p className="text-xs text-neutral-400">Estamos conectados en WhatsApp para responderte en menos de 5 minutos.</p>
              <button
                onClick={handleWhatsAppInquiry}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-colors"
              >
                <MessageCircle size={16} />
                <span>Hablar con un Asesor de Nova AJ</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Sticky Mobile Conversion Bar (Crucial for Facebook / Instagram Ads Traffic) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900/95 backdrop-blur-lg border-t border-neutral-800 p-3 sm:hidden shadow-2xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-neutral-400 uppercase font-bold block">Inversión Especial</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-white">${product.price.toLocaleString()}</span>
            <span className="text-[10px] text-neutral-400 font-semibold">ARS</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleWhatsAppInquiry}
            className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-600/20 active:scale-95"
            title="Consultar por WhatsApp"
          >
            <MessageCircle size={18} />
          </button>

          <button
            onClick={() => onBuy(product)}
            className="bg-brand-orange hover:bg-orange-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-brand-orange/30 active:scale-95"
          >
            <ShoppingCart size={15} />
            <span>Comprar Ahora</span>
          </button>
        </div>
      </div>

      {/* Share / Ads Campaign Modal (Generador de Enlaces de Publicidad para Redes) */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareModalOpen(false)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="glass-card w-full max-w-xl p-6 sm:p-8 relative z-10 bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-5 pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-orange/20 text-brand-orange flex items-center justify-center">
                    <Share2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Enlaces de Publicidad & Redes</h3>
                    <p className="text-xs text-neutral-400">
                      Copia el link listo para salir a publicitar en Facebook Ads, Instagram, TikTok o WhatsApp
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800"
                >
                  ✕
                </button>
              </div>

              {/* Channel Selector */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                    Selecciona el Canal de Difusión:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setSelectedUtmSource('facebook')}
                      className={`p-2.5 rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                        selectedUtmSource === 'facebook'
                          ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-bold'
                          : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span>Facebook Ads</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedUtmSource('instagram')}
                      className={`p-2.5 rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                        selectedUtmSource === 'instagram'
                          ? 'bg-pink-600/20 border-pink-500 text-pink-400 font-bold'
                          : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span>Instagram Ads</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedUtmSource('tiktok')}
                      className={`p-2.5 rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                        selectedUtmSource === 'tiktok'
                          ? 'bg-cyan-600/20 border-cyan-500 text-cyan-400 font-bold'
                          : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span>TikTok Ads</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedUtmSource('whatsapp')}
                      className={`p-2.5 rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                        selectedUtmSource === 'whatsapp'
                          ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 font-bold'
                          : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span>WhatsApp Direct</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedUtmSource('clean')}
                      className={`col-span-2 sm:col-span-2 p-2.5 rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                        selectedUtmSource === 'clean'
                          ? 'bg-orange-600/20 border-brand-orange text-brand-orange font-bold'
                          : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span>Enlace Limpio Directo (?product={product.id})</span>
                    </button>
                  </div>
                </div>

                {/* Generated URL Box */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400 font-semibold">Enlace generado con parámetros de campaña:</span>
                    {copiedLinkType === selectedUtmSource && (
                      <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                        <Check size={13} /> ¡Copiado al portapapeles!
                      </span>
                    )}
                  </div>
                  
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 font-mono text-xs text-neutral-300 break-all select-all">
                    {getProductUrl(selectedUtmSource)}
                  </div>

                  <button
                    onClick={() => handleCopyLink(selectedUtmSource)}
                    className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-brand-orange/20"
                  >
                    {copiedLinkType === selectedUtmSource ? (
                      <>
                        <Check size={16} className="text-white" />
                        <span>¡Enlace Copiado para Publicidad!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        <span>Copiar Enlace de Campaña</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Explanation text */}
                <div className="p-3.5 bg-neutral-800/60 rounded-xl border border-neutral-700/60 text-xs text-neutral-400 space-y-1">
                  <p className="font-semibold text-neutral-200">¿Cómo usarlo en tus anuncios?</p>
                  <p>
                    Pega este enlace en el campo <strong>URL del sitio web</strong> de tu anuncio en Facebook Ads Manager o en el botón de tu perfil de Instagram. Cualquier persona que haga clic llegará directamente a esta ficha de producto con todos los datos y el botón de compra inmediata.
                  </p>
                </div>

                {/* Quick Share to WhatsApp */}
                <div className="pt-2 flex items-center gap-2">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `¡Mira esta aplicación para optimizar tu negocio! "${product.name}": ${getProductUrl('whatsapp')}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageCircle size={15} />
                    <span>Compartir en WhatsApp</span>
                  </a>

                  <button
                    onClick={() => setIsShareModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-neutral-700 text-neutral-400 hover:text-white text-xs font-semibold"
                  >
                    Cerrar
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
