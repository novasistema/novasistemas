import { Client, Product, Sale, Banner, Subscription } from '../types';

const STORAGE_KEYS = {
  CLIENTS: 'novasistema_clients',
  PRODUCTS: 'novasistema_products',
  SALES: 'novasistema_sales',
  BANNERS: 'novasistema_banners',
  SUBSCRIPTIONS: 'novasistema_subscriptions',
  ADMIN_PASSWORD: 'novasistema_admin_password',
};

export const storageService = {
  // Admin Password
  getAdminPassword: (): string => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD) || 'admin123';
  },
  saveAdminPassword: (password: string) => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, password);
  },

  // Subscriptions
  getSubscriptions: (): Subscription[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
    return data ? JSON.parse(data) : [];
  },
  saveSubscriptions: (subscriptions: Subscription[]) => {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subscriptions));
  },

  // Banners
  getBanners: (): Banner[] => {
    const data = localStorage.getItem(STORAGE_KEYS.BANNERS);
    return data ? JSON.parse(data) : [];
  },
  saveBanners: (banners: Banner[]) => {
    localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(banners));
  },

  // Clients
  getClients: (): Client[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    return data ? JSON.parse(data) : [];
  },
  saveClients: (clients: Client[]) => {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  },

  // Products
  getProducts: (): Product[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  },
  saveProducts: (products: Product[]) => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },

  // Sales
  getSales: (): Sale[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SALES);
    return data ? JSON.parse(data) : [];
  },
  saveSales: (sales: Sale[]) => {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  },

  // Seed initial data if empty
  seed: () => {
    if (!localStorage.getItem(STORAGE_KEYS.BANNERS)) {
      storageService.saveBanners([
        {
          id: '1',
          title: 'Mensajería Interna Integrada',
          description: 'Próximamente: Todos nuestros sistemas contarán con chat en tiempo real para equipos.',
          type: 'Innovation',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Nueva App de Inventario Móvil',
          description: 'Lanzamiento de nuestra app para escaneo de productos desde el celular.',
          type: 'Update',
          isActive: true,
          createdAt: new Date().toISOString()
        }
      ]);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CLIENTS)) {
      storageService.saveClients([
        { 
          id: '1', 
          name: 'TechCorp Solutions', 
          email: 'contact@techcorp.com', 
          phone: '123456789', 
          address: 'Distrito Tecnológico 456', 
          createdAt: new Date().toISOString(),
          systems: [
            { id: 's1', name: 'ERP Enterprise v2', type: 'Enterprise', status: 'Active', description: 'Sistema de gestión integral' }
          ]
        },
        { 
          id: '2', 
          name: 'María García', 
          email: 'maria@personal.me', 
          phone: '987654321', 
          address: 'Av. Siempreviva 742', 
          createdAt: new Date().toISOString(),
          systems: [
            { id: 's2', name: 'Personal Budget App', type: 'Personal', status: 'Development', description: 'App de finanzas personales' }
          ]
        },
      ]);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      storageService.saveProducts([
        { 
          id: '1', 
          name: 'Sistema ERP Gestión Comercial & Facturación', 
          category: 'Sistemas Empresariales', 
          price: 25000, 
          stock: 99, 
          sku: 'ERP-001',
          description: 'Control completo de inventario, compras, facturación electrónica, cajas diarias, clientes y métricas de rentabilidad en tiempo real.',
          demoUrl: 'https://demo-erp.nova-aj.app',
          inPortfolio: true
        },
        { 
          id: '2', 
          name: 'Sistema para Ferreterías y Corralones', 
          category: 'Gestión Vertical', 
          price: 22000, 
          stock: 99, 
          sku: 'FER-002',
          description: 'Manejo masivo de miles de artículos con variantes de medida, lector de códigos de barras, listas de precios de proveedores e impresión rápida de tickets.',
          demoUrl: 'https://demo-ferreteria.nova-aj.app',
          inPortfolio: true
        },
        { 
          id: '3', 
          name: 'App Móvil de Preventa y Distribución', 
          category: 'Aplicaciones Móviles', 
          price: 18000, 
          stock: 99, 
          sku: 'PRE-003',
          description: 'Optimización de rutas para repartidores y vendedores de calle. Funciona 100% offline y sincroniza pedidos, cobros y stock con la central.',
          demoUrl: 'https://demo-preventa.nova-aj.app',
          inPortfolio: true
        },
        { 
          id: '4', 
          name: 'Sistema de Turnos y Abonos Recurrentes', 
          category: 'Servicios & Clientes', 
          price: 15000, 
          stock: 99, 
          sku: 'TUR-004',
          description: 'Gestión de agenda, reservas online, cobro de cuotas mensuales y avisos automáticos de vencimiento por WhatsApp a tus clientes.',
          demoUrl: 'https://demo-turnos.nova-aj.app',
          inPortfolio: true
        },
      ]);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS)) {
      const today = new Date();
      const in30Days = new Date();
      in30Days.setDate(today.getDate() + 30);
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(today.getDate() - 2);

      storageService.saveSubscriptions([
        {
          id: 'sub1',
          clientId: '1',
          clientName: 'TechCorp Solutions',
          systemName: 'ERP Enterprise v2',
          appUrl: 'https://techcorp-erp.app',
          price: 15000,
          period: 'Mensual',
          startDate: today.toISOString(),
          nextBillingDate: in30Days.toISOString(),
          status: 'Activa',
        },
        {
          id: 'sub2',
          clientId: '2',
          clientName: 'María García',
          systemName: 'Personal Budget App',
          appUrl: 'https://budget.mariagarcia.com',
          price: 4500,
          period: 'Mensual',
          startDate: today.toISOString(),
          nextBillingDate: twoDaysAgo.toISOString(),
          status: 'Vencida',
        },
      ]);
    }
  }
};
