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

export interface ProductCredential {
  id: string;
  title: string;
  user: string;
  password: string;
  notes?: string;
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
  hasSubscription?: boolean;
  subscriptionPrice?: number;
  subscriptionPeriod?: 'Mensual' | 'Anual' | 'Semestral';
  // Sector de contraseñas y accesos (Administrador / Creador)
  adminLoginUrl?: string;
  adminUser?: string;
  adminPassword?: string;
  creatorUser?: string;
  creatorPassword?: string;
  accessNotes?: string;
  extraCredentials?: ProductCredential[];
  // Organización técnica: PC local, GitHub, Vercel y Google AI Studio
  localFolderPath?: string; // Carpeta en PC local (ej: C:\Proyectos\nova-erp)
  githubRepo?: string;      // Repositorio GitHub (ej: ajnovasistemas/nova-erp)
  vercelProject?: string;   // Nombre o URL de proyecto Vercel (ej: nova-erp-demo)
  aiStudioAccount?: string; // Usuario / Cuenta Google AI Studio (ej: ajnovasistemas@gmail.com)
  // Ficha de venta y landing de producto para redes sociales
  tagline?: string;         // Frase de impacto o propuesta de valor
  originalPrice?: number;   // Precio tachado de oferta para psicología de venta
  badge?: string;           // Ej: "Más Vendido", "Oferta Lanzamiento", "Recomendado"
  targetAudience?: string;  // A quién va dirigido (Comercios, PYMEs, etc.)
  features?: string[];      // Lista de módulos o características destacadas
  benefits?: string[];      // Beneficios clave / problemas que resuelve
  videoUrl?: string;        // URL de video demostrativo
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
