import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Key, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Calendar, 
  Clock, 
  ShoppingBag,
  AlertCircle,
  Coins
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyPurchases() {
  const { getUserPurchases, currentUser } = useApp();
  const purchases = getUserPurchases();
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const togglePassword = (purchaseId: string) => {
    setVisiblePasswords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(purchaseId)) {
        newSet.delete(purchaseId);
      } else {
        newSet.add(purchaseId);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Activa
          </span>
        );
      case 'expired':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
            <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
            Expirada
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
            Cancelada
          </span>
        );
      default:
        return null;
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Inicia Sesión</h2>
          <p className="text-gray-400">Debes iniciar sesión para ver tus compras</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-900/30 via-gray-900 to-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Key className="w-8 h-8 text-purple-400" />
                Mis Compras
              </h1>
              <p className="text-gray-400 mt-1">
                Accede a todas tus cuentas de streaming compradas
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-gray-800/50 px-4 py-2 rounded-xl border border-gray-700">
                <p className="text-gray-400 text-sm">Total de compras</p>
                <p className="text-2xl font-bold text-white">{purchases.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {purchases.length > 0 ? (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden hover:border-purple-500/30 transition-colors"
              >
                {/* Purchase Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-gray-700/50">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{purchase.serviceLogo}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {purchase.serviceName} - {purchase.planName}
                      </h3>
                      <p className="text-gray-400 text-sm flex items-center gap-2">
                        <span className="font-mono">#{purchase.oderId}</span>
                        {getStatusBadge(purchase.status)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-amber-400">
                    <Coins className="w-5 h-5" />
                    <span className="font-bold">{purchase.pointsSpent} pts</span>
                  </div>
                </div>

                {/* Credentials */}
                <div className="p-6 bg-gray-900/50">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    Credenciales de acceso
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Email */}
                    <div>
                      <label className="text-gray-500 text-xs block mb-1">Usuario / Email</label>
                      <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-3 border border-gray-700">
                        <span className="flex-1 text-white font-mono text-sm truncate">
                          {purchase.credentialEmail}
                        </span>
                        <button
                          onClick={() => copyToClipboard(purchase.credentialEmail, `email-${purchase.id}`)}
                          className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                          title="Copiar email"
                        >
                          {copiedField === `email-${purchase.id}` ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="text-gray-500 text-xs block mb-1">Contraseña</label>
                      <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-3 border border-gray-700">
                        <span className="flex-1 text-white font-mono text-sm">
                          {visiblePasswords.has(purchase.id) 
                            ? purchase.credentialPassword 
                            : '••••••••••••'
                          }
                        </span>
                        <button
                          onClick={() => togglePassword(purchase.id)}
                          className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                          title={visiblePasswords.has(purchase.id) ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        >
                          {visiblePasswords.has(purchase.id) ? (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                        <button
                          onClick={() => copyToClipboard(purchase.credentialPassword, `pass-${purchase.id}`)}
                          className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                          title="Copiar contraseña"
                        >
                          {copiedField === `pass-${purchase.id}` ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Purchase Info Footer */}
                <div className="flex flex-wrap gap-4 p-4 bg-gray-800/30 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>Comprado: {formatDate(purchase.purchaseDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Expira: {formatDate(purchase.expirationDate)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No tienes compras aún</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Explora nuestra tienda y adquiere cuentas premium de tus servicios de streaming favoritos.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              Ir a la tienda
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
