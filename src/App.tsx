import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Client, Product, Sale, View, SaleItem, Banner, Subscription } from './types';
import { storageService } from './services/storage';

// Components
import { LandingView } from './components/LandingView';
import { Sidebar } from './components/Sidebar';
import { 
  DashboardView, 
  ClientsView, 
  ProductsView, 
  SalesView, 
  BannersView 
} from './components/AdminViews';
import { SubscriptionsView } from './components/SubscriptionsView';
import { 
  ClientModal, 
  ProductModal, 
  SaleModal, 
  BannerModal 
} from './components/Modals';
import { SubscriptionModal } from './components/SubscriptionModal';
import { InvoiceModal } from './components/InvoiceModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ChangePasswordModal } from './components/ChangePasswordModal';

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  
  // Modals / Forms
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  // Search
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    storageService.seed();
    setClients(storageService.getClients());
    setProducts(storageService.getProducts());
    setSales(storageService.getSales());
    setBanners(storageService.getBanners());
    setSubscriptions(storageService.getSubscriptions());
  }, []);

  // --- Handlers ---

  const handleAddClient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newClient: Client = {
      id: editingClient?.id || Date.now().toString(),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      createdAt: editingClient?.createdAt || new Date().toISOString(),
      systems: editingClient?.systems || [],
    };

    let updatedClients;
    if (editingClient) {
      updatedClients = clients.map(c => c.id === editingClient.id ? newClient : c);
    } else {
      updatedClients = [...clients, newClient];
    }

    storageService.saveClients(updatedClients);
    setClients(updatedClients);
    setIsClientModalOpen(false);
    setEditingClient(null);
  };

  const handleDeleteClient = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      const updated = clients.filter(c => c.id !== id);
      storageService.saveClients(updated);
      setClients(updated);
    }
  };

  const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProduct: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      price: Number(formData.get('price')),
      stock: Number(formData.get('stock')),
      sku: formData.get('sku') as string,
      description: (formData.get('description') as string || '').trim(),
      demoUrl: (formData.get('demoUrl') as string || '').trim(),
      inPortfolio: formData.get('inPortfolio') === 'on' || formData.get('inPortfolio') === 'true',
    };

    let updatedProducts;
    if (editingProduct) {
      updatedProducts = products.map(p => p.id === editingProduct.id ? newProduct : p);
    } else {
      updatedProducts = [...products, newProduct];
    }

    storageService.saveProducts(updatedProducts);
    setProducts(updatedProducts);
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      const updated = products.filter(p => p.id !== id);
      storageService.saveProducts(updated);
      setProducts(updated);
    }
  };

  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [selectedClientId, setSelectedClientId] = useState('');

  const handleAddSaleItem = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock <= 0) return;

    const existing = saleItems.find(item => item.productId === productId);
    if (existing) {
      if (existing.quantity >= product.stock) return;
      setSaleItems(saleItems.map(item => 
        item.productId === productId 
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      setSaleItems([...saleItems, {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        price: product.price,
        total: product.price
      }]);
    }
  };

  const handleRemoveSaleItem = (productId: string) => {
    setSaleItems(saleItems.filter(item => item.productId !== productId));
  };

  const handleCompleteSale = () => {
    if (!selectedClientId || saleItems.length === 0) return;

    const client = clients.find(c => c.id === selectedClientId);
    if (!client) return;

    const total = saleItems.reduce((acc, item) => acc + item.total, 0);
    const newSale: Sale = {
      id: Date.now().toString(),
      clientId: client.id,
      clientName: client.name,
      items: saleItems,
      total,
      date: new Date().toISOString()
    };

    // Update stock
    const updatedProducts = products.map(p => {
      const saleItem = saleItems.find(si => si.productId === p.id);
      if (saleItem) {
        return { ...p, stock: p.stock - saleItem.quantity };
      }
      return p;
    });

    const updatedSales = [newSale, ...sales];
    storageService.saveSales(updatedSales);
    storageService.saveProducts(updatedProducts);
    
    setSales(updatedSales);
    setProducts(updatedProducts);
    setIsSaleModalOpen(false);
    setSaleItems([]);
    setSelectedClientId('');
  };

  const handleAddBanner = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newBanner: Banner = {
      id: editingBanner?.id || Date.now().toString(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as any,
      isActive: formData.get('isActive') === 'on',
      createdAt: editingBanner?.createdAt || new Date().toISOString(),
    };

    let updatedBanners;
    if (editingBanner) {
      updatedBanners = banners.map(b => b.id === editingBanner.id ? newBanner : b);
    } else {
      updatedBanners = [newBanner, ...banners];
    }

    storageService.saveBanners(updatedBanners);
    setBanners(updatedBanners);
    setIsBannerModalOpen(false);
    setEditingBanner(null);
  };

  const handleDeleteBanner = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este anuncio?')) {
      const updated = banners.filter(b => b.id !== id);
      storageService.saveBanners(updated);
      setBanners(updated);
    }
  };

  const handleAddSubscription = (subData: Subscription) => {
    let updated;
    if (editingSubscription) {
      updated = subscriptions.map(s => s.id === editingSubscription.id ? subData : s);
    } else {
      updated = [subData, ...subscriptions];
    }
    storageService.saveSubscriptions(updated);
    setSubscriptions(updated);
    setIsSubscriptionModalOpen(false);
    setEditingSubscription(null);
  };

  const handleDeleteSubscription = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta suscripción?')) {
      const updated = subscriptions.filter(s => s.id !== id);
      storageService.saveSubscriptions(updated);
      setSubscriptions(updated);
    }
  };

  const handleGenerateSaleFromSub = (sub: Subscription) => {
    const client = clients.find(c => c.id === sub.clientId);
    const clientName = client ? client.name : sub.clientName;

    const newSale: Sale = {
      id: 'S' + Date.now().toString(),
      clientId: sub.clientId,
      clientName: clientName,
      items: [
        {
          productId: 'SUB-' + sub.id,
          productName: `Abono de Suscripción: ${sub.systemName} (${sub.period})`,
          quantity: 1,
          price: sub.price,
          total: sub.price,
        }
      ],
      total: sub.price,
      date: new Date().toISOString()
    };

    const updatedSales = [newSale, ...sales];
    storageService.saveSales(updatedSales);
    setSales(updatedSales);

    // Auto load in invoice view immediately!
    setSelectedSale(newSale);
    setIsInvoiceModalOpen(true);
  };

  const handleAdminClick = () => {
    if (isAdminAuthenticated) {
      setView('dashboard');
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsAdminLoginOpen(false);
    setView('dashboard');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setView('landing');
  };

  if (view === 'landing' || !isAdminAuthenticated) {
    return (
      <>
        <LandingView 
          setView={setView} 
          banners={banners} 
          products={products}
          onAdminClick={handleAdminClick} 
        />
        <AnimatePresence>
          <AdminLoginModal 
            isOpen={isAdminLoginOpen} 
            onClose={() => setIsAdminLoginOpen(false)} 
            onSuccess={handleAdminLoginSuccess} 
          />
        </AnimatePresence>
      </>
    );
  }

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <Sidebar 
        activeView={view} 
        setView={setView} 
        onLogoutAdmin={handleAdminLogout}
        onChangePassword={() => setIsChangePasswordOpen(true)}
      />
      
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-24 lg:pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {view === 'dashboard' && (
              <DashboardView 
                sales={sales} 
                clients={clients} 
                products={products} 
                setView={setView} 
                setIsSaleModalOpen={setIsSaleModalOpen} 
              />
            )}
            {view === 'clients' && (
              <ClientsView 
                clients={clients} 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                setEditingClient={setEditingClient} 
                setIsClientModalOpen={setIsClientModalOpen} 
                handleDeleteClient={handleDeleteClient} 
              />
            )}
            {view === 'products' && (
              <ProductsView 
                products={products} 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                setEditingProduct={setEditingProduct} 
                setIsProductModalOpen={setIsProductModalOpen} 
                handleDeleteProduct={handleDeleteProduct} 
              />
            )}
            {view === 'sales' && (
              <SalesView 
                sales={sales} 
                setIsSaleModalOpen={setIsSaleModalOpen} 
                onViewInvoice={(sale) => {
                  setSelectedSale(sale);
                  setIsInvoiceModalOpen(true);
                }}
              />
            )}
            {view === 'banners' && (
              <BannersView 
                banners={banners} 
                onEdit={(b) => { setEditingBanner(b); setIsBannerModalOpen(true); }} 
                onDelete={handleDeleteBanner} 
                onAdd={() => { setEditingBanner(null); setIsBannerModalOpen(true); }} 
              />
            )}
            {view === 'subscriptions' && (
              <SubscriptionsView 
                subscriptions={subscriptions}
                clients={clients}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onAddSubscription={() => { setEditingSubscription(null); setIsSubscriptionModalOpen(true); }}
                onEditSubscription={(sub) => { setEditingSubscription(sub); setIsSubscriptionModalOpen(true); }}
                onDeleteSubscription={handleDeleteSubscription}
                onGenerateSaleFromSub={handleGenerateSaleFromSub}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modals */}
      <AnimatePresence>
        <ClientModal 
          isOpen={isClientModalOpen} 
          onClose={() => setIsClientModalOpen(false)} 
          onSubmit={handleAddClient} 
          editingClient={editingClient} 
        />
        <ProductModal 
          isOpen={isProductModalOpen} 
          onClose={() => setIsProductModalOpen(false)} 
          onSubmit={handleAddProduct} 
          editingProduct={editingProduct} 
        />
        <SaleModal 
          isOpen={isSaleModalOpen} 
          onClose={() => setIsSaleModalOpen(false)} 
          clients={clients} 
          products={products} 
          saleItems={saleItems} 
          selectedClientId={selectedClientId} 
          setSelectedClientId={setSelectedClientId} 
          onAddItem={handleAddSaleItem} 
          onRemoveItem={handleRemoveSaleItem} 
          onComplete={handleCompleteSale} 
        />
        <BannerModal 
          isOpen={isBannerModalOpen} 
          onClose={() => setIsBannerModalOpen(false)} 
          onSubmit={handleAddBanner} 
          editingBanner={editingBanner} 
        />
        <SubscriptionModal 
          isOpen={isSubscriptionModalOpen}
          onClose={() => setIsSubscriptionModalOpen(false)}
          onSubmit={handleAddSubscription}
          editingSubscription={editingSubscription}
          clients={clients}
        />
        <InvoiceModal 
          isOpen={isInvoiceModalOpen} 
          onClose={() => setIsInvoiceModalOpen(false)} 
          sale={selectedSale}
          client={clients.find(c => c.id === selectedSale?.clientId) || null}
        />
        <ChangePasswordModal 
          isOpen={isChangePasswordOpen}
          onClose={() => setIsChangePasswordOpen(false)}
        />
      </AnimatePresence>
    </div>
  );
}
