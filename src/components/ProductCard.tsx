import { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { 
  Check, 
  X, 
  Coins, 
  ShoppingCart, 
  Clock,
  Eye,
  EyeOff,
  Copy,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { currentUser, purchaseProduct } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState<{
    success: boolean;
    message: string;
    email?: string;
    password?: string;
  } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const availableCredentials = product.credentials.filter(c => !c.isAssigned).length;
  const canPurchase = currentUser && currentUser.points >= product.price && availableCredentials > 0;

  const handlePurchase = async () => {
    setIsPurchasing(true);
    
    // Simular delay de compra
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = purchaseProduct(product.id);
    
    setPurchaseResult({
      success: result.success,
      message: result.message,
      email: result.credential?.email,
      password: result.credential?.password
    });
    
    setIsPurchasing(false);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPurchaseResult(null);
    setShowPassword(false);
  };

  return (
    <>
      {/* Product Card */}
      <div className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1">
        {/* Header con gradiente */}
        <div className={`relative h-32 bg-gradient-to-br ${product.color} p-6`}>
          <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-white text-sm font-medium">{product.duration}</span>
          </div>
          <div className="text-5xl">{product.serviceLogo}</div>
          <div className="absolute bottom-4 left-6">
            <h3 className="text-white font-bold text-lg">{product.service}</h3>
            <p className="text-white/80 text-sm">{product.planName}</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>

          {/* Features preview */}
          <ul className="space-y-2 mb-4">
            {product.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                {feature.included ? (
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                )}
                <span className={feature.included ? 'text-gray-300' : 'text-gray-500 line-through'}>
                  {feature.text.length > 45 ? feature.text.substring(0, 45) + '...' : feature.text}
                </span>
              </li>
            ))}
          </ul>

          {/* Stock indicator */}
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-2 h-2 rounded-full ${availableCredentials > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className={`text-sm ${availableCredentials > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {availableCredentials > 0 
                ? `${availableCredentials} ${availableCredentials === 1 ? 'cuenta disponible' : 'cuentas disponibles'}`
                : 'Sin stock'
              }
            </span>
          </div>

          {/* Price & Button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-700">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-400" />
              <span className="text-2xl font-bold text-white">{product.price}</span>
              <span className="text-gray-400 text-sm">pts</span>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              Ver más
            </button>
          </div>
        </div>
      </div>

      {/* Modal de compra */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            {/* Modal Header */}
            <div className={`relative h-40 bg-gradient-to-br ${product.color} p-6`}>
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-8 h-8 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="text-6xl mb-2">{product.serviceLogo}</div>
              <h2 className="text-white font-bold text-2xl">{product.service}</h2>
              <p className="text-white/80">{product.planName}</p>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {!purchaseResult ? (
                <>
                  <p className="text-gray-300 mb-6">{product.description}</p>

                  {/* Todas las features */}
                  <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      Características del plan
                    </h4>
                    <ul className="space-y-3">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          {feature.included ? (
                            <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-green-400" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <X className="w-3 h-3 text-gray-500" />
                            </div>
                          )}
                          <span className={feature.included ? 'text-gray-200' : 'text-gray-500'}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Info de duración */}
                  <div className="flex items-center gap-2 text-gray-400 mb-6">
                    <Clock className="w-4 h-4" />
                    <span>Duración: {product.duration}</span>
                  </div>

                  {/* Disponibilidad */}
                  <div className={`flex items-center gap-2 mb-6 p-3 rounded-lg ${
                    availableCredentials > 0 
                      ? 'bg-green-500/10 border border-green-500/30' 
                      : 'bg-red-500/10 border border-red-500/30'
                  }`}>
                    <div className={`w-3 h-3 rounded-full ${availableCredentials > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className={availableCredentials > 0 ? 'text-green-400' : 'text-red-400'}>
                      {availableCredentials > 0 
                        ? `${availableCredentials} ${availableCredentials === 1 ? 'cuenta disponible' : 'cuentas disponibles'}`
                        : 'Sin stock disponible'
                      }
                    </span>
                  </div>

                  {/* Precio y botón de compra */}
                  <div className="bg-gray-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-400">Total a pagar:</span>
                      <div className="flex items-center gap-2">
                        <Coins className="w-6 h-6 text-amber-400" />
                        <span className="text-3xl font-bold text-white">{product.price}</span>
                        <span className="text-gray-400">puntos</span>
                      </div>
                    </div>

                    {currentUser && (
                      <div className="flex items-center justify-between text-sm mb-4 pb-4 border-b border-gray-700">
                        <span className="text-gray-400">Tu saldo actual:</span>
                        <span className={currentUser.points >= product.price ? 'text-green-400' : 'text-red-400'}>
                          {currentUser.points.toLocaleString()} puntos
                        </span>
                      </div>
                    )}

                    <button
                      onClick={handlePurchase}
                      disabled={!canPurchase || isPurchasing}
                      className={`w-full py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                        canPurchase
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white'
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isPurchasing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Procesando...
                        </>
                      ) : !currentUser ? (
                        'Inicia sesión para comprar'
                      ) : currentUser.points < product.price ? (
                        `Te faltan ${product.price - currentUser.points} puntos`
                      ) : availableCredentials === 0 ? (
                        'Sin stock disponible'
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          Confirmar Compra
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                // Resultado de la compra
                <div className="text-center py-4">
                  {purchaseResult.success ? (
                    <>
                      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-10 h-10 text-green-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">¡Compra Exitosa!</h3>
                      <p className="text-gray-400 mb-6">{purchaseResult.message}</p>

                      {/* Credenciales */}
                      <div className="bg-gray-800 rounded-xl p-6 text-left">
                        <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                          <Key className="w-5 h-5 text-purple-400" />
                          Tus credenciales
                        </h4>
                        
                        {/* Email */}
                        <div className="mb-4">
                          <label className="text-gray-400 text-sm block mb-1">Usuario / Email</label>
                          <div className="flex items-center gap-2 bg-gray-900 rounded-lg p-3">
                            <span className="flex-1 text-white font-mono">{purchaseResult.email}</span>
                            <button
                              onClick={() => copyToClipboard(purchaseResult.email!, 'email')}
                              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                              {copiedField === 'email' ? (
                                <Check className="w-4 h-4 text-green-400" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Password */}
                        <div className="mb-4">
                          <label className="text-gray-400 text-sm block mb-1">Contraseña</label>
                          <div className="flex items-center gap-2 bg-gray-900 rounded-lg p-3">
                            <span className="flex-1 text-white font-mono">
                              {showPassword ? purchaseResult.password : '••••••••••••'}
                            </span>
                            <button
                              onClick={() => setShowPassword(!showPassword)}
                              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4 text-gray-400" />
                              ) : (
                                <Eye className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                            <button
                              onClick={() => copyToClipboard(purchaseResult.password!, 'password')}
                              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                              {copiedField === 'password' ? (
                                <Check className="w-4 h-4 text-green-400" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>

                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Guarda estas credenciales. También las puedes ver en "Mis Compras".
                        </p>
                      </div>

                      <button
                        onClick={closeModal}
                        className="mt-6 w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium transition-colors"
                      >
                        Entendido
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-10 h-10 text-red-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Compra Fallida</h3>
                      <p className="text-gray-400 mb-6">{purchaseResult.message}</p>
                      <button
                        onClick={closeModal}
                        className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
                      >
                        Cerrar
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Importar Key icon
function Key(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  );
}
