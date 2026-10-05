import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Key, 
  ShieldCheck, 
  Sparkles, 
  Globe, 
  ExternalLink, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Edit2, 
  FileText,
  Lock
} from 'lucide-react';
import { Product } from '../types';

interface ProductCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit: (product: Product) => void;
}

export const ProductCredentialsModal: React.FC<ProductCredentialsModalProps> = ({
  isOpen,
  onClose,
  product,
  onEdit,
}) => {
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [showCreatorPass, setShowCreatorPass] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen || !product) return null;

  const copyToClipboard = async (text: string, keyName: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(keyName);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const copyAllCredentials = async () => {
    const loginUrl = product.adminLoginUrl || product.demoUrl || 'No especificada';
    const text = [
      `🔐 ACCESOS Y CONTRASEÑAS: ${product.name}`,
      `📦 SKU: ${product.sku} | Categoría: ${product.category}`,
      `🌐 URL Acceso / Panel: ${loginUrl}`,
      '',
      '--- ACCESO ADMINISTRADOR ---',
      `👤 Usuario: ${product.adminUser || 'No configurado'}`,
      `🔑 Contraseña: ${product.adminPassword || 'No configurada'}`,
      '',
      '--- ACCESO CREADOR / MASTER ---',
      `⚡ Usuario Creador: ${product.creatorUser || 'No configurado'}`,
      `🔑 Contraseña Creador: ${product.creatorPassword || 'No configurada'}`,
      product.accessNotes ? `\n📝 Notas de Acceso:\n${product.accessNotes}` : '',
      product.extraCredentials && product.extraCredentials.length > 0 ? (
        '\n--- OTROS ACCESOS ---\n' + product.extraCredentials.map(c => `• ${c.title}: ${c.user} / ${c.password} ${c.notes ? `(${c.notes})` : ''}`).join('\n')
      ) : ''
    ].filter(Boolean).join('\n');

    await copyToClipboard(text, 'all');
  };

  const hasCredentials = Boolean(
    product.adminUser || 
    product.adminPassword || 
    product.creatorUser || 
    product.creatorPassword ||
    product.adminLoginUrl ||
    product.accessNotes ||
    (product.extraCredentials && product.extraCredentials.length > 0)
  );

  const loginUrl = product.adminLoginUrl || product.demoUrl;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" 
      />

      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 10 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="glass-card w-full max-w-xl p-6 sm:p-8 relative z-10 max-h-[90vh] overflow-y-auto bg-white shadow-2xl rounded-3xl"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6 pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner">
              <Key size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-[10px] font-mono font-bold">
                  {product.sku}
                </span>
                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[10px] font-bold uppercase">
                  Sector de Claves Privadas
                </span>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mt-1 leading-snug">
                {product.name}
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-neutral-400 hover:text-neutral-600 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* URL Direct Panel Access */}
        {loginUrl && (
          <div className="mb-5 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <Globe size={18} className="text-brand-orange shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  {product.adminLoginUrl ? 'URL de Acceso al Panel de Control' : 'Enlace Web / Demo'}
                </p>
                <p className="text-xs font-mono text-neutral-800 font-semibold truncate">
                  {loginUrl}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => copyToClipboard(loginUrl, 'url')}
                className="px-2.5 py-1.5 bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-semibold rounded-lg border border-neutral-200 flex items-center gap-1.5 transition-colors"
                title="Copiar enlace"
              >
                {copiedKey === 'url' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                <span>{copiedKey === 'url' ? 'Copiado' : 'Copiar URL'}</span>
              </button>
              <a
                href={loginUrl.startsWith('http') ? loginUrl : `https://${loginUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 bg-brand-orange text-white text-xs font-bold rounded-lg hover:bg-orange-600 flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>Abrir Panel</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        )}

        {!hasCredentials && (
          <div className="p-6 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200 text-center mb-6">
            <Lock className="mx-auto text-neutral-400 mb-2" size={28} />
            <p className="text-sm font-semibold text-neutral-700">Aún no has registrado contraseñas para este producto.</p>
            <p className="text-xs text-neutral-500 mt-1">Haz clic en "Configurar Contraseñas" para agregar los accesos de Administrador o Creador.</p>
            <button
              onClick={() => {
                onClose();
                onEdit(product);
              }}
              className="mt-4 btn-primary text-xs py-2 px-4 justify-center mx-auto"
            >
              <Edit2 size={14} />
              <span>Configurar Contraseñas Ahora</span>
            </button>
          </div>
        )}

        {hasCredentials && (
          <div className="space-y-4 mb-6">
            {/* Box 1: Acceso Administrador */}
            <div className="p-4 bg-gradient-to-br from-emerald-50/70 to-teal-50/30 rounded-2xl border border-emerald-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-emerald-600 text-white rounded-lg flex items-center justify-center shadow-sm">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950">Acceso Administrador</h4>
                    <p className="text-[10px] text-emerald-700">Para el dueño del negocio o administrador local</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                  Admin
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* User */}
                <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-100 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="block text-[10px] font-bold text-neutral-400 uppercase">Usuario / Email</span>
                    <span className="text-xs font-mono font-semibold text-neutral-800 truncate block">
                      {product.adminUser || <span className="text-neutral-400 italic">No configurado</span>}
                    </span>
                  </div>
                  {product.adminUser && (
                    <button
                      onClick={() => copyToClipboard(product.adminUser || '', 'adminUser')}
                      className="p-1.5 text-neutral-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors shrink-0"
                      title="Copiar usuario"
                    >
                      {copiedKey === 'adminUser' ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                    </button>
                  )}
                </div>

                {/* Password */}
                <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-100 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="block text-[10px] font-bold text-neutral-400 uppercase">Contraseña</span>
                    <span className="text-xs font-mono font-semibold text-neutral-800 truncate block">
                      {product.adminPassword ? (
                        showAdminPass ? product.adminPassword : '••••••••••••'
                      ) : (
                        <span className="text-neutral-400 italic">No configurada</span>
                      )}
                    </span>
                  </div>
                  {product.adminPassword && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setShowAdminPass(!showAdminPass)}
                        className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors"
                        title={showAdminPass ? 'Ocultar' : 'Mostrar'}
                      >
                        {showAdminPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(product.adminPassword || '', 'adminPassword')}
                        className="p-1.5 text-neutral-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                        title="Copiar contraseña"
                      >
                        {copiedKey === 'adminPassword' ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Box 2: Acceso Creador */}
            <div className="p-4 bg-gradient-to-br from-orange-50/70 to-amber-50/30 rounded-2xl border border-orange-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-brand-orange text-white rounded-lg flex items-center justify-center shadow-sm">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-orange-950">Acceso Creador / Master</h4>
                    <p className="text-[10px] text-orange-700">Para desarrollo, soporte técnico, backups y configuración</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-orange-100 text-orange-800 rounded">
                  Superadmin
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Creator User */}
                <div className="bg-white/90 p-2.5 rounded-xl border border-orange-100 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="block text-[10px] font-bold text-neutral-400 uppercase">Usuario Creador</span>
                    <span className="text-xs font-mono font-semibold text-neutral-800 truncate block">
                      {product.creatorUser || <span className="text-neutral-400 italic">No configurado</span>}
                    </span>
                  </div>
                  {product.creatorUser && (
                    <button
                      onClick={() => copyToClipboard(product.creatorUser || '', 'creatorUser')}
                      className="p-1.5 text-neutral-400 hover:text-brand-orange rounded-lg hover:bg-orange-50 transition-colors shrink-0"
                      title="Copiar usuario creador"
                    >
                      {copiedKey === 'creatorUser' ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                    </button>
                  )}
                </div>

                {/* Creator Password */}
                <div className="bg-white/90 p-2.5 rounded-xl border border-orange-100 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="block text-[10px] font-bold text-neutral-400 uppercase">Contraseña Creador</span>
                    <span className="text-xs font-mono font-semibold text-neutral-800 truncate block">
                      {product.creatorPassword ? (
                        showCreatorPass ? product.creatorPassword : '••••••••••••'
                      ) : (
                        <span className="text-neutral-400 italic">No configurada</span>
                      )}
                    </span>
                  </div>
                  {product.creatorPassword && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setShowCreatorPass(!showCreatorPass)}
                        className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors"
                        title={showCreatorPass ? 'Ocultar' : 'Mostrar'}
                      >
                        {showCreatorPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(product.creatorPassword || '', 'creatorPassword')}
                        className="p-1.5 text-neutral-400 hover:text-brand-orange rounded-lg hover:bg-orange-50 transition-colors"
                        title="Copiar contraseña creador"
                      >
                        {copiedKey === 'creatorPassword' ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Notes / Technical PINs */}
            {product.accessNotes && (
              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/70">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-700">
                    <FileText size={15} className="text-neutral-400" />
                    <span>Notas Técnicas e Instrucciones de Acceso</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(product.accessNotes || '', 'notes')}
                    className="text-[11px] text-brand-orange hover:underline font-semibold flex items-center gap-1"
                  >
                    {copiedKey === 'notes' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    <span>{copiedKey === 'notes' ? '¡Copiado!' : 'Copiar notas'}</span>
                  </button>
                </div>
                <p className="text-xs text-neutral-600 whitespace-pre-wrap font-sans bg-white p-2.5 rounded-xl border border-neutral-100">
                  {product.accessNotes}
                </p>
              </div>
            )}

            {/* Extra Credentials if any */}
            {product.extraCredentials && product.extraCredentials.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-neutral-700">Accesos y Cuentas Adicionales</p>
                {product.extraCredentials.map((c, i) => (
                  <div key={c.id || i} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/60 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-neutral-800">{c.title}:</span>{' '}
                      <span className="font-mono text-neutral-600">{c.user}</span> / <span className="font-mono text-neutral-600">{c.password}</span>
                      {c.notes && <p className="text-[10px] text-neutral-400 mt-0.5">{c.notes}</p>}
                    </div>
                    <button
                      onClick={() => copyToClipboard(`${c.title}: ${c.user} / ${c.password}`, `extra-${i}`)}
                      className="p-1 text-neutral-400 hover:text-brand-orange"
                      title="Copiar"
                    >
                      {copiedKey === `extra-${i}` ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {hasCredentials ? (
            <button
              onClick={copyAllCredentials}
              className={`btn-secondary text-xs font-bold py-2.5 px-4 justify-center ${
                copiedKey === 'all' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : ''
              }`}
            >
              {copiedKey === 'all' ? (
                <>
                  <Check size={16} className="text-emerald-500" />
                  <span>¡Todos los Accesos Copiados!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Copiar Todos los Datos</span>
                </>
              )}
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(product);
              }}
              className="btn-secondary text-xs font-bold py-2.5 px-3.5 justify-center flex-1 sm:flex-initial"
            >
              <Edit2 size={15} />
              <span>Editar Claves</span>
            </button>
            <button
              onClick={onClose}
              className="btn-primary text-xs font-bold py-2.5 px-5 justify-center flex-1 sm:flex-initial"
            >
              Listo
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
