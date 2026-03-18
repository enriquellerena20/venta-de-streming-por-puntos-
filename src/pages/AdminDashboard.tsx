import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Navigate } from 'react-router-dom';
import {
  Shield, Users, Key, Plus, Minus, Trash2, Search, Coins, Package,
  Eye, EyeOff, Check, AlertCircle, ChevronDown, ChevronUp,
  Edit3, Save, X, ToggleLeft, ToggleRight, UserX, UserCheck,
  BarChart3, ShoppingCart, Star, AlertTriangle
} from 'lucide-react';
import { Product, PlanFeature, User } from '../types';

type AdminTab = 'overview' | 'users' | 'products' | 'credentials' | 'purchases';

export default function AdminDashboard() {
  const {
    currentUser, users, products, purchases, transactions,
    addPoints, removePoints, setPoints, deleteUser, toggleUserStatus,
    addProduct, updateProduct, deleteProduct, toggleProductStatus,
    addCredential, removeCredential, getProductCredentials, getAllPurchases
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchUsers, setSearchUsers] = useState('');
  const [searchProducts, setSearchProducts] = useState('');
  const [pointsAmounts, setPointsAmounts] = useState<Record<string, number>>({});
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
  const [newCredentials, setNewCredentials] = useState<Record<string, { email: string; password: string }>>({});
  const [showPasswords, setShowPasswords] = useState<Set<string>>(new Set());
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    service: '', serviceLogo: '🎬', planName: '', description: '',
    price: 0, duration: '1 mes', color: 'from-purple-600 to-purple-900',
    features: [{ text: '', included: true }] as PlanFeature[]
  });

  if (!currentUser || currentUser.role !== 'admin') return <Navigate to="/" replace />;

  const allPurchases = getAllPurchases();

  const showNote = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Overview stats
  const totalUsers = users.filter(u => u.role !== 'admin').length;
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const totalPurchases = allPurchases.length;
  const totalPointsGiven = transactions.filter(t => t.type === 'add').reduce((s, t) => s + t.amount, 0);
  const totalPointsSpent = transactions.filter(t => t.type === 'spend').reduce((s, t) => s + t.amount, 0);
  const lowStockProducts = products.filter(p => p.credentials.filter(c => !c.isAssigned).length <= 1);

  // Filtered
  const filteredUsers = users.filter(u => u.role !== 'admin' && (
    u.name.toLowerCase().includes(searchUsers.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUsers.toLowerCase()) ||
    u.username.toLowerCase().includes(searchUsers.toLowerCase())
  ));
  const filteredProducts = products.filter(p =>
    p.service.toLowerCase().includes(searchProducts.toLowerCase()) ||
    p.planName.toLowerCase().includes(searchProducts.toLowerCase())
  );

  const startEdit = (product: Product) => {
    setEditingProduct(product.id);
    setEditForm({ ...product, features: product.features.map(f => ({ ...f })) });
  };

  const saveEdit = () => {
    if (!editingProduct) return;
    updateProduct(editingProduct, editForm);
    setEditingProduct(null);
    showNote('success', 'Producto actualizado correctamente');
  };

  const handleAddProduct = () => {
    if (!newProduct.service || !newProduct.planName || !newProduct.price) {
      showNote('error', 'Completa servicio, plan y precio');
      return;
    }
    addProduct({ ...newProduct, isActive: true });
    setNewProduct({ service: '', serviceLogo: '🎬', planName: '', description: '', price: 0, duration: '1 mes', color: 'from-purple-600 to-purple-900', features: [{ text: '', included: true }] });
    setShowAddProduct(false);
    showNote('success', 'Producto agregado correctamente');
  };

  const COLORS = [
    'from-red-600 to-red-800', 'from-purple-600 to-purple-900', 'from-green-500 to-green-700',
    'from-blue-600 to-blue-900', 'from-cyan-500 to-blue-600', 'from-orange-500 to-orange-700',
    'from-gray-700 to-gray-900', 'from-blue-500 to-indigo-700', 'from-pink-600 to-rose-800'
  ];

  const EMOJIS = ['🎬', '🎭', '🎵', '🏰', '📦', '🍥', '🍎', '⭐', '🎮', '📺', '🎯', '🚀'];

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Resumen', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'users', label: 'Usuarios', icon: <Users className="w-4 h-4" /> },
    { id: 'products', label: 'Productos', icon: <Package className="w-4 h-4" /> },
    { id: 'credentials', label: 'Credenciales', icon: <Key className="w-4 h-4" /> },
    { id: 'purchases', label: 'Ventas', icon: <ShoppingCart className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {notification && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-pulse ${notification.type === 'success' ? 'bg-green-500/20 border border-green-500/50 text-green-400' : 'bg-red-500/20 border border-red-500/50 text-red-400'}`}>
          {notification.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-br from-amber-900/30 via-gray-900 to-gray-900 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Shield className="w-8 h-8 text-amber-400" />Panel de Administración
              </h1>
              <p className="text-gray-400 mt-1 text-sm">Gestión completa de la plataforma StreamKeys</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {[
                { label: 'Usuarios', value: totalUsers },
                { label: 'Productos', value: `${activeProducts}/${totalProducts}` },
                { label: 'Ventas', value: totalPurchases }
              ].map(s => (
                <div key={s.label} className="bg-gray-800/60 px-5 py-3 rounded-xl border border-gray-700">
                  <p className="text-gray-400 text-xs">{s.label}</p>
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === t.id ? 'bg-amber-500 text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Usuarios activos', value: users.filter(u => u.role !== 'admin' && u.isActive).length, icon: <UserCheck className="w-5 h-5" />, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' },
                { label: 'Total ventas', value: totalPurchases, icon: <ShoppingCart className="w-5 h-5" />, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
                { label: 'Puntos otorgados', value: totalPointsGiven.toLocaleString(), icon: <Coins className="w-5 h-5" />, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
                { label: 'Puntos canjeados', value: totalPointsSpent.toLocaleString(), icon: <Star className="w-5 h-5" />, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/30' },
              ].map(s => (
                <div key={s.label} className={`${s.bg} border rounded-2xl p-5`}>
                  <div className={`${s.color} mb-2`}>{s.icon}</div>
                  <p className="text-gray-400 text-sm">{s.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {lowStockProducts.length > 0 && (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-5">
                <h3 className="text-orange-400 font-medium flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5" />Stock bajo — requieren atención
                </h3>
                <div className="space-y-2">
                  {lowStockProducts.map(p => (
                    <div key={p.id} className="flex items-center justify-between bg-gray-900/50 rounded-xl px-4 py-2">
                      <span className="text-white text-sm">{p.serviceLogo} {p.service} — {p.planName}</span>
                      <span className={`text-sm font-bold ${p.credentials.filter(c => !c.isAssigned).length === 0 ? 'text-red-400' : 'text-orange-400'}`}>
                        {p.credentials.filter(c => !c.isAssigned).length} disponibles
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-5">
              <h3 className="text-white font-medium mb-4">Últimas ventas</h3>
              {allPurchases.length === 0 ? (
                <p className="text-gray-500 text-sm">No hay ventas aún</p>
              ) : (
                <div className="space-y-2">
                  {[...allPurchases].reverse().slice(0, 5).map(p => {
                    const buyer = users.find(u => u.id === p.userId);
                    return (
                      <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-0">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{p.serviceLogo}</span>
                          <div>
                            <p className="text-white text-sm font-medium">{p.productName}</p>
                            <p className="text-gray-400 text-xs">{buyer?.name || 'Usuario'} · {new Date(p.purchaseDate).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                          <Coins className="w-3.5 h-3.5" />{p.pointsSpent}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* USERS */}
        {activeTab === 'users' && (
          <div>
            <div className="relative mb-5">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Buscar usuarios..." value={searchUsers}
                onChange={e => setSearchUsers(e.target.value)}
                className="w-full max-w-sm pl-11 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 text-sm" />
            </div>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No hay usuarios registrados</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredUsers.map((user: User) => (
                  <div key={user.id} className={`bg-gray-800/50 rounded-2xl border p-5 ${!user.isActive ? 'border-red-500/30 opacity-60' : 'border-gray-700/50'}`}>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl flex-shrink-0">{user.avatar}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium">{user.name}</p>
                            {!user.isActive && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">Suspendido</span>}
                          </div>
                          <p className="text-gray-400 text-xs">@{user.username} · {user.email}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Registrado: {new Date(user.createdAt).toLocaleDateString('es-PE')}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl">
                        <Coins className="w-4 h-4 text-amber-400" />
                        <span className="text-amber-400 font-bold">{user.points.toLocaleString()}</span>
                        <span className="text-amber-400/60 text-xs">pts</span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="flex items-center gap-2">
                          <input type="number" min="0" placeholder="Cantidad"
                            value={pointsAmounts[user.id] || ''}
                            onChange={e => setPointsAmounts(p => ({ ...p, [user.id]: parseInt(e.target.value) || 0 }))}
                            className="w-28 px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-center text-sm focus:outline-none focus:border-amber-500" />
                          <button onClick={() => { const a = pointsAmounts[user.id] || 0; if (a > 0) { addPoints(user.id, a); setPointsAmounts(p => ({ ...p, [user.id]: 0 })); showNote('success', `+${a} pts a ${user.name}`); } }}
                            className="p-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors" title="Agregar">
                            <Plus className="w-4 h-4" />
                          </button>
                          <button onClick={() => { const a = pointsAmounts[user.id] || 0; if (a > 0) { removePoints(user.id, a); setPointsAmounts(p => ({ ...p, [user.id]: 0 })); showNote('success', `-${a} pts de ${user.name}`); } }}
                            className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors" title="Quitar">
                            <Minus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { toggleUserStatus(user.id); showNote('success', `Usuario ${user.isActive ? 'suspendido' : 'activado'}`); }}
                            className={`p-2 rounded-lg transition-colors ${user.isActive ? 'bg-orange-600/20 text-orange-400 hover:bg-orange-600/40' : 'bg-green-600/20 text-green-400 hover:bg-green-600/40'}`} title={user.isActive ? 'Suspender' : 'Activar'}>
                            {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                          <button onClick={() => { if (confirm(`¿Eliminar a ${user.name}?`)) { deleteUser(user.id); showNote('success', 'Usuario eliminado'); } }}
                            className="p-2 bg-red-600/20 text-red-400 hover:bg-red-600/40 rounded-lg transition-colors" title="Eliminar">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PRODUCTS */}
        {activeTab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Buscar productos..." value={searchProducts}
                  onChange={e => setSearchProducts(e.target.value)}
                  className="w-full max-w-sm pl-11 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 text-sm" />
              </div>
              <button onClick={() => setShowAddProduct(!showAddProduct)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${showAddProduct ? 'bg-red-600 text-white' : 'bg-amber-500 text-black'}`}>
                {showAddProduct ? <><X className="w-4 h-4" />Cancelar</> : <><Plus className="w-4 h-4" />Nuevo producto</>}
              </button>
            </div>

            {/* Add Product Form */}
            {showAddProduct && (
              <div className="bg-gray-800/50 rounded-2xl border border-amber-500/30 p-6 mb-6">
                <h3 className="text-white font-medium mb-5 flex items-center gap-2"><Plus className="w-5 h-5 text-amber-400" />Agregar nuevo producto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Servicio</label>
                    <input type="text" placeholder="ej: Netflix" value={newProduct.service}
                      onChange={e => setNewProduct(p => ({ ...p, service: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Nombre del plan</label>
                    <input type="text" placeholder="ej: Premium" value={newProduct.planName}
                      onChange={e => setNewProduct(p => ({ ...p, planName: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Descripción corta</label>
                    <input type="text" placeholder="Breve descripción del plan" value={newProduct.description}
                      onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Precio (pts)</label>
                      <input type="number" placeholder="200" value={newProduct.price || ''}
                        onChange={e => setNewProduct(p => ({ ...p, price: parseInt(e.target.value) || 0 }))}
                        className="w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Duración</label>
                      <input type="text" placeholder="1 mes" value={newProduct.duration}
                        onChange={e => setNewProduct(p => ({ ...p, duration: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Emoji / Logo</label>
                    <div className="flex flex-wrap gap-2">
                      {EMOJIS.map(e => (
                        <button key={e} onClick={() => setNewProduct(p => ({ ...p, serviceLogo: e }))}
                          className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${newProduct.serviceLogo === e ? 'bg-amber-500/40 ring-2 ring-amber-500' : 'bg-gray-700 hover:bg-gray-600'}`}>
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Color de la tarjeta</label>
                    <div className="flex flex-wrap gap-2">
                      {COLORS.map(c => (
                        <button key={c} onClick={() => setNewProduct(p => ({ ...p, color: c }))}
                          className={`w-9 h-9 rounded-lg bg-gradient-to-br ${c} transition-all ${newProduct.color === c ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="text-xs text-gray-400 mb-2 block">Características</label>
                  {newProduct.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 mb-2">
                      <button onClick={() => setNewProduct(p => ({ ...p, features: p.features.map((f2, j) => i === j ? { ...f2, included: !f2.included } : f2) }))}
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${f.included ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {f.included ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      </button>
                      <input type="text" placeholder={`Característica ${i + 1}`} value={f.text}
                        onChange={e => setNewProduct(p => ({ ...p, features: p.features.map((f2, j) => i === j ? { ...f2, text: e.target.value } : f2) }))}
                        className="flex-1 px-3 py-1.5 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 text-sm" />
                      <button onClick={() => setNewProduct(p => ({ ...p, features: p.features.filter((_, j) => j !== i) }))}
                        className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                  <button onClick={() => setNewProduct(p => ({ ...p, features: [...p.features, { text: '', included: true }] }))}
                    className="flex items-center gap-1 text-green-400 text-xs hover:text-green-300 transition-colors mt-1">
                    <Plus className="w-3.5 h-3.5" />Agregar característica
                  </button>
                </div>
                <button onClick={handleAddProduct} className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-medium text-sm transition-colors">
                  <Check className="w-4 h-4" />Agregar producto
                </button>
              </div>
            )}

            <div className="space-y-3">
              {filteredProducts.map((product: Product) => {
                const isEditing = editingProduct === product.id;
                const avail = product.credentials.filter(c => !c.isAssigned).length;
                return (
                  <div key={product.id} className={`bg-gray-800/50 rounded-2xl border overflow-hidden ${!product.isActive ? 'border-gray-700/30 opacity-60' : 'border-gray-700/50'}`}>
                    <div className="p-5">
                      {isEditing ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs text-gray-400 mb-1 block">Servicio</label>
                              <input type="text" value={editForm.service || ''} onChange={e => setEditForm(f => ({ ...f, service: e.target.value }))}
                                className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500" />
                            </div>
                            <div>
                              <label className="text-xs text-gray-400 mb-1 block">Plan</label>
                              <input type="text" value={editForm.planName || ''} onChange={e => setEditForm(f => ({ ...f, planName: e.target.value }))}
                                className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500" />
                            </div>
                            <div>
                              <label className="text-xs text-gray-400 mb-1 block">Descripción</label>
                              <input type="text" value={editForm.description || ''} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                                className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-xs text-gray-400 mb-1 block">Precio (pts)</label>
                                <input type="number" value={editForm.price || ''} onChange={e => setEditForm(f => ({ ...f, price: parseInt(e.target.value) || 0 }))}
                                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500" />
                              </div>
                              <div>
                                <label className="text-xs text-gray-400 mb-1 block">Duración</label>
                                <input type="text" value={editForm.duration || ''} onChange={e => setEditForm(f => ({ ...f, duration: e.target.value }))}
                                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500" />
                              </div>
                            </div>
                          </div>
                          {/* Edit features */}
                          <div>
                            <label className="text-xs text-gray-400 mb-2 block">Características</label>
                            {(editForm.features || []).map((f, i) => (
                              <div key={i} className="flex items-center gap-2 mb-2">
                                <button onClick={() => setEditForm(ef => ({ ...ef, features: (ef.features || []).map((f2, j) => i === j ? { ...f2, included: !f2.included } : f2) }))}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${f.included ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                  {f.included ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                                </button>
                                <input type="text" value={f.text}
                                  onChange={e => setEditForm(ef => ({ ...ef, features: (ef.features || []).map((f2, j) => i === j ? { ...f2, text: e.target.value } : f2) }))}
                                  className="flex-1 px-3 py-1.5 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500" />
                                <button onClick={() => setEditForm(ef => ({ ...ef, features: (ef.features || []).filter((_, j) => j !== i) }))}
                                  className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg"><X className="w-3.5 h-3.5" /></button>
                              </div>
                            ))}
                            <button onClick={() => setEditForm(ef => ({ ...ef, features: [...(ef.features || []), { text: '', included: true }] }))}
                              className="flex items-center gap-1 text-green-400 text-xs hover:text-green-300 mt-1">
                              <Plus className="w-3.5 h-3.5" />Agregar característica
                            </button>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={saveEdit} className="flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl text-sm font-medium transition-colors">
                              <Save className="w-4 h-4" />Guardar cambios
                            </button>
                            <button onClick={() => setEditingProduct(null)} className="flex items-center gap-2 px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm transition-colors">
                              <X className="w-4 h-4" />Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 bg-gradient-to-br ${product.color} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
                              {product.serviceLogo}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <h3 className="text-white font-medium">{product.service} — {product.planName}</h3>
                                {!product.isActive && <span className="text-xs bg-gray-600/50 text-gray-400 px-2 py-0.5 rounded-full">Pausado</span>}
                              </div>
                              <p className="text-gray-400 text-sm">{product.description}</p>
                              <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-500">
                                <span className="flex items-center gap-1 text-amber-400"><Coins className="w-3 h-3" />{product.price} pts</span>
                                <span>{product.duration}</span>
                                <span className={avail > 1 ? 'text-green-400' : avail === 1 ? 'text-orange-400' : 'text-red-400'}>
                                  {avail} cuentas disponibles
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button onClick={() => startEdit(product)} className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 rounded-xl transition-colors" title="Editar">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => { toggleProductStatus(product.id); showNote('success', `Producto ${product.isActive ? 'pausado' : 'activado'}`); }}
                              className={`p-2 rounded-xl transition-colors ${product.isActive ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/40' : 'bg-green-500/20 text-green-400 hover:bg-green-500/40'}`}
                              title={product.isActive ? 'Pausar' : 'Activar'}>
                              {product.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                            </button>
                            <button onClick={() => { if (confirm(`¿Eliminar ${product.service} ${product.planName}?`)) { deleteProduct(product.id); showNote('success', 'Producto eliminado'); } }}
                              className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-xl transition-colors" title="Eliminar">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CREDENTIALS */}
        {activeTab === 'credentials' && (
          <div className="space-y-3">
            {products.map((product: Product) => {
              const credentials = getProductCredentials(product.id);
              const availableCount = credentials.filter(c => !c.isAssigned).length;
              const isExpanded = expandedProducts.has(product.id);
              return (
                <div key={product.id} className="bg-gray-800/50 rounded-2xl border border-gray-700/50 overflow-hidden">
                  <button onClick={() => setExpandedProducts(prev => { const s = new Set(prev); s.has(product.id) ? s.delete(product.id) : s.add(product.id); return s; })}
                    className="w-full flex items-center justify-between p-5 hover:bg-gray-700/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 bg-gradient-to-br ${product.color} rounded-xl flex items-center justify-center text-xl`}>{product.serviceLogo}</div>
                      <div className="text-left">
                        <h3 className="text-white font-medium">{product.service} — {product.planName}</h3>
                        <div className="flex items-center gap-3 mt-1 text-xs">
                          <span className="text-gray-400">{credentials.length} total</span>
                          <span className={availableCount > 0 ? 'text-green-400' : 'text-red-400'}>{availableCount} disponibles</span>
                          <span className="text-gray-500">{credentials.filter(c => c.isAssigned).length} asignadas</span>
                        </div>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </button>
                  {isExpanded && (
                    <div className="border-t border-gray-700 p-5">
                      <div className="bg-gray-900/50 rounded-xl p-4 mb-4">
                        <p className="text-sm font-medium text-white mb-3 flex items-center gap-2"><Plus className="w-4 h-4 text-green-400" />Agregar credencial</p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input type="email" placeholder="Email / Usuario" value={newCredentials[product.id]?.email || ''}
                            onChange={e => setNewCredentials(p => ({ ...p, [product.id]: { ...p[product.id], email: e.target.value } }))}
                            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 text-sm" />
                          <input type="text" placeholder="Contraseña" value={newCredentials[product.id]?.password || ''}
                            onChange={e => setNewCredentials(p => ({ ...p, [product.id]: { ...p[product.id], password: e.target.value } }))}
                            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 text-sm" />
                          <button onClick={() => { const c = newCredentials[product.id]; if (c?.email && c?.password) { addCredential(product.id, c.email, c.password); setNewCredentials(p => ({ ...p, [product.id]: { email: '', password: '' } })); showNote('success', 'Credencial agregada'); } }}
                            className="px-5 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2">
                            <Plus className="w-4 h-4" />Agregar
                          </button>
                        </div>
                      </div>
                      {credentials.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead><tr className="border-b border-gray-700">
                              <th className="text-left px-3 py-2.5 text-gray-400 font-medium">Email</th>
                              <th className="text-left px-3 py-2.5 text-gray-400 font-medium">Contraseña</th>
                              <th className="text-center px-3 py-2.5 text-gray-400 font-medium">Estado</th>
                              <th className="text-center px-3 py-2.5 text-gray-400 font-medium">Acción</th>
                            </tr></thead>
                            <tbody>
                              {credentials.map(cred => (
                                <tr key={cred.id} className="border-b border-gray-700/50">
                                  <td className="px-3 py-3 text-white font-mono text-xs">{cred.email}</td>
                                  <td className="px-3 py-3">
                                    <div className="flex items-center gap-2">
                                      <span className="text-white font-mono text-xs">{showPasswords.has(cred.id) ? cred.password : '••••••••'}</span>
                                      <button onClick={() => setShowPasswords(s => { const n = new Set(s); n.has(cred.id) ? n.delete(cred.id) : n.add(cred.id); return n; })} className="p-1 hover:bg-gray-700 rounded">
                                        {showPasswords.has(cred.id) ? <EyeOff className="w-3.5 h-3.5 text-gray-400" /> : <Eye className="w-3.5 h-3.5 text-gray-400" />}
                                      </button>
                                    </div>
                                  </td>
                                  <td className="px-3 py-3 text-center">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${cred.isAssigned ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                      {cred.isAssigned ? 'Asignada' : 'Disponible'}
                                    </span>
                                  </td>
                                  <td className="px-3 py-3 text-center">
                                    <button onClick={() => { if (!cred.isAssigned) { removeCredential(product.id, cred.id); showNote('success', 'Credencial eliminada'); } }}
                                      disabled={cred.isAssigned}
                                      className={`p-1.5 rounded-lg transition-colors ${cred.isAssigned ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-red-600/20 text-red-400 hover:bg-red-600/40'}`}>
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Key className="w-10 h-10 mx-auto mb-2 opacity-30" />
                          <p className="text-sm">Sin credenciales</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* PURCHASES / SALES */}
        {activeTab === 'purchases' && (
          <div>
            {allPurchases.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No hay ventas todavía</p>
              </div>
            ) : (
              <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-gray-700 bg-gray-900/50">
                      <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Orden</th>
                      <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Producto</th>
                      <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Usuario</th>
                      <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Fecha</th>
                      <th className="text-center px-5 py-3.5 text-gray-400 font-medium">Puntos</th>
                      <th className="text-center px-5 py-3.5 text-gray-400 font-medium">Estado</th>
                    </tr></thead>
                    <tbody>
                      {[...allPurchases].reverse().map(p => {
                        const buyer = users.find(u => u.id === p.userId);
                        return (
                          <tr key={p.id} className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors">
                            <td className="px-5 py-3.5 text-gray-400 font-mono text-xs">{p.oderId}</td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{p.serviceLogo}</span>
                                <span className="text-white">{p.productName}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2">
                                <span className="text-base">{buyer?.avatar || '?'}</span>
                                <div>
                                  <p className="text-white text-xs font-medium">{buyer?.name || 'Desconocido'}</p>
                                  <p className="text-gray-500 text-xs">@{buyer?.username || '—'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-gray-400 text-xs">{new Date(p.purchaseDate).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                            <td className="px-5 py-3.5 text-center">
                              <span className="flex items-center justify-center gap-1 text-amber-400 font-bold text-xs">
                                <Coins className="w-3 h-3" />{p.pointsSpent}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">Activo</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
