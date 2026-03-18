import { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { useApp } from '../context/AppContext';
import { Search, Filter, Sparkles, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  { id: 'all', name: 'Todos', emoji: '🌟' },
  { id: 'Netflix', name: 'Netflix', emoji: '🎬' },
  { id: 'HBO Max', name: 'HBO Max', emoji: '🎭' },
  { id: 'Spotify', name: 'Spotify', emoji: '🎵' },
  { id: 'Disney+', name: 'Disney+', emoji: '🏰' },
  { id: 'Prime Video', name: 'Prime Video', emoji: '📦' },
  { id: 'Crunchyroll', name: 'Crunchyroll', emoji: '🍥' },
  { id: 'Apple TV+', name: 'Apple TV+', emoji: '🍎' },
  { id: 'Paramount+', name: 'Paramount+', emoji: '⭐' }
];

export default function Store() {
  const { products, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState('all');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('name');

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(p => p.isActive);
    if (selectedService !== 'all') filtered = filtered.filter(p => p.service === selectedService);
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      filtered = filtered.filter(p => p.service.toLowerCase().includes(s) || p.planName.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
    }
    switch (sortBy) {
      case 'price-asc': return [...filtered].sort((a, b) => a.price - b.price);
      case 'price-desc': return [...filtered].sort((a, b) => b.price - a.price);
      default: return [...filtered].sort((a, b) => a.service.localeCompare(b.service));
    }
  }, [products, selectedService, searchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/50 via-gray-900 to-pink-900/50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Sparkles className="w-9 h-9 text-purple-400" />Cuentas Premium<Sparkles className="w-9 h-9 text-pink-400" />
            </h1>
            <p className="text-lg text-gray-300 max-w-xl mx-auto mb-6">
              Accede a los mejores servicios. Paga con puntos, recibe tus credenciales al instante.
            </p>
            {!currentUser && (
              <Link to="/auth" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 rounded-xl font-medium transition-all">
                <Lock className="w-4 h-4" />Iniciar sesión para comprar
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Buscar servicio, plan..." value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-sm transition-colors" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="bg-gray-800 border border-gray-700 rounded-xl text-white px-4 py-3 focus:outline-none focus:border-purple-500 text-sm cursor-pointer">
              <option value="name">Ordenar por nombre</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {services.map(s => (
            <button key={s.id} onClick={() => setSelectedService(s.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap font-medium text-sm transition-all flex-shrink-0 ${selectedService === s.id ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'}`}>
              <span>{s.emoji}</span>{s.name}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg">No se encontraron productos</p>
            <p className="text-sm mt-1">Intenta con otro filtro</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </div>
    </div>
  );
}
