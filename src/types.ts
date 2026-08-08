export interface AppSystem {
  id: string;
  name: string;
  type: 'Enterprise' | 'Personal';
  status: 'Active' | 'Development' | 'Maintenance';
  description: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  systems: AppSystem[]; // Associated systems
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  description?: string;
  demoUrl?: string;
  inPortfolio?: boolean;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Sale {
  id: string;
  clientId: string;
  clientName: string;
  items: SaleItem[];
  total: number;
  date: string;
}

export interface Banner {
  id: string;
  title: string;
  description: string;
  type: 'Innovation' | 'Update' | 'Alert';
  isActive: boolean;
  createdAt: string;
}

export interface Subscription {
  id: string;
  clientId: string;
  clientName: string;
  systemName: string; // El sistema asociado
  appUrl?: string; // Enlace a la aplicación / panel de creador
  appUser?: string; // Usuario o email de acceso
  appPassword?: string; // Contraseña de acceso
  price: number;
  period: 'Mensual' | 'Anual' | 'Semestral';
  startDate: string;
  nextBillingDate: string;
  status: 'Activa' | 'Suspendida' | 'Vencida' | 'Pendiente';
}

export type View = 'landing' | 'dashboard' | 'clients' | 'products' | 'sales' | 'banners' | 'subscriptions';
