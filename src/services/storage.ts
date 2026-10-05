import { Client, Product, Sale, Banner, Subscription } from '../types';
import { db } from '../lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot,
  getDocs,
  writeBatch
} from 'firebase/firestore';

const STORAGE_KEYS = {
  ADMIN_PASSWORD: 'novasistema_admin_password',
};

// Default seed data
const DEFAULT_BANNERS: Banner[] = [
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
];

const DEFAULT_PRODUCTS: Product[] = [
  { 
    id: '1', 
    name: 'Sistema ERP Gestión Comercial & Facturación', 
    category: 'Sistemas Empresariales', 
    price: 25000, 
    stock: 99, 
    sku: 'ERP-001',
    description: 'Control completo de inventario, compras, facturación electrónica, cajas diarias, clientes y métricas de rentabilidad en tiempo real.',
    demoUrl: 'https://demo-erp.nova-aj.app',
    inPortfolio: true,
    hasSubscription: true,
    subscriptionPrice: 8500,
    subscriptionPeriod: 'Mensual',
    adminLoginUrl: 'https://demo-erp.nova-aj.app/admin',
    adminUser: 'admin@empresa.com',
    adminPassword: 'ERPAdmin#2024',
    creatorUser: 'creador@nova-aj.app',
    creatorPassword: 'NovaMasterKey*99',
    accessNotes: 'Acceso total como Creador con privilegios raíz y configuración de módulos.'
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
    inPortfolio: true,
    hasSubscription: true,
    subscriptionPrice: 7500,
    subscriptionPeriod: 'Mensual',
    adminLoginUrl: 'https://demo-ferreteria.nova-aj.app/login',
    adminUser: 'administrador',
    adminPassword: 'Ferreteria2024*',
    creatorUser: 'creador_ferreteria',
    creatorPassword: 'CreadorFerre#2024',
    accessNotes: 'PIN de apertura de caja por defecto: 1234.'
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
    inPortfolio: true,
    hasSubscription: true,
    subscriptionPrice: 6000,
    subscriptionPeriod: 'Mensual',
    adminLoginUrl: 'https://demo-preventa.nova-aj.app/panel',
    adminUser: 'supervisor@distribucion.com',
    adminPassword: 'PreVentaPass!88',
    creatorUser: 'creador@nova-aj.app',
    creatorPassword: 'MobileMaster#77',
    accessNotes: 'Token API de sincronización activa en servidor central.'
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
    inPortfolio: true,
    hasSubscription: false,
    adminLoginUrl: 'https://demo-turnos.nova-aj.app/admin',
    adminUser: 'admin',
    adminPassword: 'TurnosAdmin2024',
    creatorUser: 'creador_turnos',
    creatorPassword: 'NovaTurnos#2024',
    accessNotes: 'Clave de webhook de WhatsApp disponible en panel de creador.'
  },
];

const DEFAULT_CLIENTS: Client[] = [
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
];

const getInitialSubscriptions = (): Subscription[] => {
  const today = new Date();
  const in30Days = new Date();
  in30Days.setDate(today.getDate() + 30);
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(today.getDate() - 2);

  return [
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
  ];
};

export const storageService = {
  // Admin Password (stored locally for quick access or custom password)
  getAdminPassword: (): string => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD) || 'admin123';
  },
  saveAdminPassword: (password: string) => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, password);
  },
  resetAdminPassword: (): void => {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_PASSWORD);
  },

  // --- REAL-TIME LISTENERS & FIRESTORE SYNC ---

  subscribeProducts: (callback: (products: Product[]) => void) => {
    const colRef = collection(db, 'products');
    return onSnapshot(colRef, async (snapshot) => {
      if (snapshot.empty) {
        // Seed initial products if collection is completely empty
        const batch = writeBatch(db);
        DEFAULT_PRODUCTS.forEach(p => {
          batch.set(doc(db, 'products', p.id), p);
        });
        await batch.commit();
      } else {
        const items = snapshot.docs.map(docSnap => {
          const data = docSnap.data() as Product;
          const seed = DEFAULT_PRODUCTS.find(p => p.id === data.id);
          if (seed && !data.adminUser && !data.creatorUser && !data.adminPassword) {
            return {
              ...seed,
              ...data,
              adminLoginUrl: data.adminLoginUrl || seed.adminLoginUrl,
              adminUser: data.adminUser || seed.adminUser,
              adminPassword: data.adminPassword || seed.adminPassword,
              creatorUser: data.creatorUser || seed.creatorUser,
              creatorPassword: data.creatorPassword || seed.creatorPassword,
              accessNotes: data.accessNotes || seed.accessNotes,
            };
          }
          return data;
        });
        callback(items);
      }
    }, (error) => {
      console.error('Firestore products error:', error);
    });
  },

  saveProducts: async (products: Product[]) => {
    // 1. Get current docs to detect deletions
    try {
      const snap = await getDocs(collection(db, 'products'));
      const existingIds = new Set(snap.docs.map(d => d.id));
      const currentIds = new Set(products.map(p => p.id));

      const batch = writeBatch(db);
      // Delete removed docs
      existingIds.forEach(id => {
        if (!currentIds.has(id)) {
          batch.delete(doc(db, 'products', id));
        }
      });
      // Save/update doc
      products.forEach(p => {
        batch.set(doc(db, 'products', p.id), p);
      });
      await batch.commit();
    } catch (e) {
      console.error('Error saving products to Firestore:', e);
    }
  },

  subscribeClients: (callback: (clients: Client[]) => void) => {
    const colRef = collection(db, 'clients');
    return onSnapshot(colRef, async (snapshot) => {
      if (snapshot.empty) {
        const batch = writeBatch(db);
        DEFAULT_CLIENTS.forEach(c => {
          batch.set(doc(db, 'clients', c.id), c);
        });
        await batch.commit();
      } else {
        const items = snapshot.docs.map(doc => doc.data() as Client);
        callback(items);
      }
    }, (error) => {
      console.error('Firestore clients error:', error);
    });
  },

  saveClients: async (clients: Client[]) => {
    try {
      const snap = await getDocs(collection(db, 'clients'));
      const existingIds = new Set(snap.docs.map(d => d.id));
      const currentIds = new Set(clients.map(c => c.id));

      const batch = writeBatch(db);
      existingIds.forEach(id => {
        if (!currentIds.has(id)) {
          batch.delete(doc(db, 'clients', id));
        }
      });
      clients.forEach(c => {
        batch.set(doc(db, 'clients', c.id), c);
      });
      await batch.commit();
    } catch (e) {
      console.error('Error saving clients to Firestore:', e);
    }
  },

  subscribeSales: (callback: (sales: Sale[]) => void) => {
    const colRef = collection(db, 'sales');
    return onSnapshot(colRef, (snapshot) => {
      const items = snapshot.docs.map(doc => doc.data() as Sale);
      // Sort by date desc
      items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      callback(items);
    }, (error) => {
      console.error('Firestore sales error:', error);
    });
  },

  saveSales: async (sales: Sale[]) => {
    try {
      const snap = await getDocs(collection(db, 'sales'));
      const existingIds = new Set(snap.docs.map(d => d.id));
      const currentIds = new Set(sales.map(s => s.id));

      const batch = writeBatch(db);
      existingIds.forEach(id => {
        if (!currentIds.has(id)) {
          batch.delete(doc(db, 'sales', id));
        }
      });
      sales.forEach(s => {
        batch.set(doc(db, 'sales', s.id), s);
      });
      await batch.commit();
    } catch (e) {
      console.error('Error saving sales to Firestore:', e);
    }
  },

  subscribeBanners: (callback: (banners: Banner[]) => void) => {
    const colRef = collection(db, 'banners');
    return onSnapshot(colRef, async (snapshot) => {
      if (snapshot.empty) {
        const batch = writeBatch(db);
        DEFAULT_BANNERS.forEach(b => {
          batch.set(doc(db, 'banners', b.id), b);
        });
        await batch.commit();
      } else {
        const items = snapshot.docs.map(doc => doc.data() as Banner);
        callback(items);
      }
    }, (error) => {
      console.error('Firestore banners error:', error);
    });
  },

  saveBanners: async (banners: Banner[]) => {
    try {
      const snap = await getDocs(collection(db, 'banners'));
      const existingIds = new Set(snap.docs.map(d => d.id));
      const currentIds = new Set(banners.map(b => b.id));

      const batch = writeBatch(db);
      existingIds.forEach(id => {
        if (!currentIds.has(id)) {
          batch.delete(doc(db, 'banners', id));
        }
      });
      banners.forEach(b => {
        batch.set(doc(db, 'banners', b.id), b);
      });
      await batch.commit();
    } catch (e) {
      console.error('Error saving banners to Firestore:', e);
    }
  },

  subscribeSubscriptions: (callback: (subscriptions: Subscription[]) => void) => {
    const colRef = collection(db, 'subscriptions');
    return onSnapshot(colRef, async (snapshot) => {
      if (snapshot.empty) {
        const batch = writeBatch(db);
        const defaults = getInitialSubscriptions();
        defaults.forEach(s => {
          batch.set(doc(db, 'subscriptions', s.id), s);
        });
        await batch.commit();
      } else {
        const items = snapshot.docs.map(doc => doc.data() as Subscription);
        callback(items);
      }
    }, (error) => {
      console.error('Firestore subscriptions error:', error);
    });
  },

  saveSubscriptions: async (subscriptions: Subscription[]) => {
    try {
      const snap = await getDocs(collection(db, 'subscriptions'));
      const existingIds = new Set(snap.docs.map(d => d.id));
      const currentIds = new Set(subscriptions.map(s => s.id));

      const batch = writeBatch(db);
      existingIds.forEach(id => {
        if (!currentIds.has(id)) {
          batch.delete(doc(db, 'subscriptions', id));
        }
      });
      subscriptions.forEach(s => {
        batch.set(doc(db, 'subscriptions', s.id), s);
      });
      await batch.commit();
    } catch (e) {
      console.error('Error saving subscriptions to Firestore:', e);
    }
  }
};
