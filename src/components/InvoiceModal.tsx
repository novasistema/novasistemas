import React from 'react';
import { motion } from 'motion/react';
import { X, Printer, Download, FileText, MessageSquare } from 'lucide-react';
import { Sale, Client } from '../types';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: Sale | null;
  client: Client | null;
}

export const InvoiceModal = ({ isOpen, onClose, sale, client }: InvoiceModalProps) => {
  if (!isOpen || !sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const itemsText = (sale.items || []).map(item => `• ${item.quantity}x ${item.productName} ($${(item.price || 0).toLocaleString()})`).join('\n');
    const message = `*NOVA AJ - Sistemas Digitales*\n\nEstimado/a *${sale.clientName}*,\n\nLe enviamos el detalle para abonar su suscripción:\n\n*Factura N°:* 0001-0000${sale.id.slice(-4)}\n*Fecha:* ${new Date(sale.date).toLocaleDateString()}\n\n*Detalles de Suscripción:*\n${itemsText}\n\n*Total a Abonar:* $${(sale.total || 0).toLocaleString()}\n\n_Para realizar el pago, puede hacerlo por transferencia bancaria o ponerse en contacto con nosotros para coordinar._\n\n¡Muchas gracias por confiar en nosotros!`;
    
    const rawPhone = client?.phone || '';
    const cleanPhone = rawPhone.replace(/\D/g, '');
    
    let phoneWithCountry = cleanPhone;
    if (cleanPhone.length > 0 && !cleanPhone.startsWith('54')) {
      if (cleanPhone.length === 10) {
        phoneWithCountry = '549' + cleanPhone;
      } else {
        phoneWithCountry = '54' + cleanPhone;
      }
    }

    const url = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-md" 
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white w-full max-w-4xl min-h-[80vh] relative z-10 rounded-3xl shadow-2xl flex flex-col overflow-hidden my-8"
      >
        {/* Header / Toolbar */}
        <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-orange text-white rounded-xl flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Documentos de Venta</h3>
              <p className="text-xs text-neutral-500">Factura X / Recibo de Pago</p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <button 
              onClick={handleWhatsAppShare}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/10 active:scale-95"
            >
              <MessageSquare size={18} /> Enviar Cobro por WhatsApp
            </button>
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-bold text-neutral-700 hover:bg-neutral-50 transition-all"
            >
              <Printer size={18} /> Imprimir
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-600 transition-all"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 p-12 overflow-y-auto print:p-0 print:overflow-visible bg-neutral-100/30">
          <div className="max-w-[800px] mx-auto space-y-8">
            
            {/* FACTURA X */}
            <div className="bg-white p-12 shadow-sm border border-neutral-200 rounded-sm print:shadow-none print:border-neutral-300 relative overflow-hidden">
              {/* Watermark/Header for Factura X */}
              <div className="absolute top-0 right-0 p-4">
                <div className="w-16 h-16 border-2 border-neutral-900 flex items-center justify-center text-4xl font-black">
                  X
                </div>
                <p className="text-[10px] text-center mt-1 font-bold uppercase tracking-widest">Documento No Válido como Factura</p>
              </div>

              <div className="flex justify-between items-start mb-12">
                <div>
                  <h1 className="text-3xl font-black text-brand-orange mb-1">NOVA AJ</h1>
                  <p className="text-sm font-bold text-neutral-800">Sistemas Digitales & Soluciones IT</p>
                  <p className="text-xs text-neutral-500 mt-2">Calle Falsa 123, Ciudad Autónoma de Buenos Aires</p>
                  <p className="text-xs text-neutral-500">Tel: +54 11 1234-5678 | Email: hola@nova-aj.com</p>
                </div>
                <div className="text-right pt-20">
                  <h2 className="text-xl font-bold uppercase tracking-tighter mb-1">Factura</h2>
                  <p className="text-sm font-mono text-neutral-500">Nº 0001-0000{sale.id.slice(-4)}</p>
                  <p className="text-sm text-neutral-500 mt-1">Fecha: {new Date(sale.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12 mb-12 py-8 border-y border-neutral-100">
                <div>
                  <p className="text-[10px] uppercase font-bold text-neutral-400 mb-2">Cliente</p>
                  <p className="font-bold text-lg">{sale.clientName}</p>
                  {client && (
                    <div className="text-sm text-neutral-600 mt-1 space-y-0.5">
                      <p>{client.email}</p>
                      <p>{client.phone}</p>
                      <p>{client.address}</p>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-neutral-400 mb-2">Condición de Venta</p>
                  <p className="font-bold">Contado / Transferencia</p>
                  <p className="text-sm text-neutral-500 mt-1">Vencimiento: {new Date(sale.date).toLocaleDateString()}</p>
                </div>
              </div>

              <table className="w-full mb-12">
                <thead>
                  <tr className="border-b-2 border-neutral-900 text-left text-xs uppercase font-black">
                    <th className="py-3">Descripción</th>
                    <th className="py-3 text-center">Cant.</th>
                    <th className="py-3 text-right">Precio Unit.</th>
                    <th className="py-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {sale.items.map((item, i) => (
                    <tr key={i} className="text-sm">
                      <td className="py-4 font-medium">{item.productName}</td>
                      <td className="py-4 text-center">{item.quantity}</td>
                      <td className="py-4 text-right">${item.price.toLocaleString()}</td>
                      <td className="py-4 text-right font-bold">${item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end">
                <div className="w-64 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Subtotal</span>
                    <span className="font-bold">${sale.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Descuentos</span>
                    <span className="font-bold">$0</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t-2 border-neutral-900">
                    <span className="text-lg font-black uppercase">Total</span>
                    <span className="text-2xl font-black text-brand-orange">${sale.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-20 pt-8 border-t border-neutral-100 text-[10px] text-neutral-400 text-center uppercase tracking-widest">
                Gracias por confiar en Nova AJ - Soluciones Digitales a su Medida
              </div>
            </div>

            {/* RECIBO */}
            <div className="bg-white p-12 shadow-sm border border-neutral-200 rounded-sm print:shadow-none print:border-neutral-300 relative overflow-hidden break-before-page">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neutral-900 text-white flex items-center justify-center text-2xl font-black">R</div>
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tighter">Recibo</h2>
                    <p className="text-xs text-neutral-500 font-mono">Nº 0001-0000{sale.id.slice(-4)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{new Date(sale.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-6 text-sm leading-loose">
                <p className="border-b border-dotted border-neutral-300 pb-1">
                  Recibimos de <span className="font-bold px-2">{sale.clientName}</span>
                </p>
                <p className="border-b border-dotted border-neutral-300 pb-1">
                  la cantidad de pesos <span className="font-bold px-2">{sale.total.toLocaleString()} (Pesos Argentinos)</span>
                </p>
                <p className="border-b border-dotted border-neutral-300 pb-1">
                  en concepto de <span className="font-bold px-2">Pago por servicios de software / {sale.items.map(i => i.productName).join(', ')}</span>
                </p>
              </div>

              <div className="mt-12 flex justify-between items-end">
                <div className="bg-neutral-100 p-4 rounded-lg">
                  <p className="text-[10px] uppercase font-bold text-neutral-500 mb-1">Total Recibido</p>
                  <p className="text-2xl font-black">${sale.total.toLocaleString()}</p>
                </div>
                <div className="w-48 text-center">
                  <div className="border-b border-neutral-900 mb-2 h-12"></div>
                  <p className="text-[10px] uppercase font-bold">Firma y Sello</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};
