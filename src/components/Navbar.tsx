import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Coins, ShoppingBag, User, Shield, ChevronDown, Key, LogOut, Menu, X, History } from 'lucide-react';

export default function Navbar() {
  const { currentUser, logout } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/auth');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <Key className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">StreamKeys</span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <Link to="/" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${isActive('/') ? 'bg-purple-500/20 text-purple-400' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}>
              <ShoppingBag className="w-4 h-4" />Tienda
            </Link>
            {currentUser && (
              <Link to="/mis-compras" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${isActive('/mis-compras') ? 'bg-purple-500/20 text-purple-400' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}>
                <History className="w-4 h-4" />Mis Compras
              </Link>
            )}
            {currentUser?.role === 'admin' && (
              <Link to="/admin" className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${isActive('/admin') ? 'bg-amber-500/20 text-amber-400' : 'text-amber-400 hover:bg-gray-800'}`}>
                <Shield className="w-4 h-4" />Panel Admin
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentUser && currentUser.role !== 'admin' && (
              <div className="hidden sm:flex items-center gap-2 bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/30">
                <Coins className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-amber-400 text-sm">{currentUser.points.toLocaleString()} pts</span>
              </div>
            )}

            {currentUser ? (
              <div className="relative">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-xl transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-base">{currentUser.avatar}</div>
                  <span className="hidden sm:block text-white font-medium text-sm max-w-[100px] truncate">{currentUser.name}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-xl shadow-xl border border-gray-700 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-white font-medium text-sm">{currentUser.name}</p>
                      <p className="text-gray-400 text-xs mt-0.5">@{currentUser.username}</p>
                      {currentUser.role !== 'admin' && (
                        <div className="flex items-center gap-1 mt-2">
                          <Coins className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-amber-400 text-sm font-bold">{currentUser.points.toLocaleString()} puntos</span>
                        </div>
                      )}
                    </div>
                    {currentUser.role !== 'admin' && (
                      <Link to="/mis-compras" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-gray-700 transition-colors text-sm">
                        <History className="w-4 h-4" />Mis compras
                      </Link>
                    )}
                    {currentUser.role === 'admin' && (
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-amber-400 hover:bg-gray-700 transition-colors text-sm">
                        <Shield className="w-4 h-4" />Panel de Admin
                      </Link>
                    )}
                    <div className="border-t border-gray-700 mt-1 pt-1">
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-gray-700 transition-colors text-sm">
                        <LogOut className="w-4 h-4" />Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth" className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all">
                <User className="w-4 h-4" />Entrar
              </Link>
            )}

            <button onClick={() => setIsMobile(!isMobile)} className="md:hidden p-2 text-gray-400 hover:text-white">
              {isMobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isMobile && (
          <div className="md:hidden border-t border-gray-800 py-3 flex flex-col gap-1">
            <Link to="/" onClick={() => setIsMobile(false)} className={`flex items-center gap-2 px-4 py-3 rounded-lg ${isActive('/') ? 'bg-purple-500/20 text-purple-400' : 'text-gray-300 hover:bg-gray-800'}`}>
              <ShoppingBag className="w-4 h-4" />Tienda
            </Link>
            {currentUser && (
              <Link to="/mis-compras" onClick={() => setIsMobile(false)} className={`flex items-center gap-2 px-4 py-3 rounded-lg ${isActive('/mis-compras') ? 'bg-purple-500/20 text-purple-400' : 'text-gray-300 hover:bg-gray-800'}`}>
                <History className="w-4 h-4" />Mis Compras
              </Link>
            )}
            {currentUser?.role === 'admin' && (
              <Link to="/admin" onClick={() => setIsMobile(false)} className="flex items-center gap-2 px-4 py-3 rounded-lg text-amber-400 hover:bg-gray-800">
                <Shield className="w-4 h-4" />Panel Admin
              </Link>
            )}
            {!currentUser && (
              <Link to="/auth" onClick={() => setIsMobile(false)} className="flex items-center gap-2 px-4 py-3 text-purple-400 hover:bg-gray-800 rounded-lg">
                <User className="w-4 h-4" />Iniciar sesión
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
