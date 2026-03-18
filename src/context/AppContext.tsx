import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User, Product, Purchase, Notification, Credential, PointsTransaction } from '../types';
import { initialUsers, initialProducts } from '../data/initialData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  products: Product[];
  purchases: Purchase[];
  notifications: Notification[];
  transactions: PointsTransaction[];

  // Auth
  login: (username: string, password: string) => { success: boolean; message: string };
  register: (name: string, username: string, email: string, password: string) => { success: boolean; message: string };
  logout: () => void;

  // Compras
  purchaseProduct: (productId: string) => { success: boolean; message: string; credential?: Credential };
  getUserPurchases: () => Purchase[];
  getAllPurchases: () => Purchase[];

  // Admin - Usuarios
  addPoints: (userId: string, amount: number, reason?: string) => void;
  removePoints: (userId: string, amount: number, reason?: string) => void;
  setPoints: (userId: string, amount: number) => void;
  deleteUser: (userId: string) => void;
  toggleUserStatus: (userId: string) => void;

  // Admin - Productos
  addProduct: (product: Omit<Product, 'id' | 'credentials'>) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  toggleProductStatus: (productId: string) => void;

  // Admin - Credenciales
  addCredential: (productId: string, email: string, password: string) => void;
  removeCredential: (productId: string, credentialId: string) => void;
  getProductCredentials: (productId: string) => Credential[];

  // Notificaciones
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'streamkeys_data';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      return {
        users: data.users || initialUsers,
        products: data.products || initialProducts,
        purchases: (data.purchases || []).map((p: Purchase) => ({
          ...p,
          purchaseDate: new Date(p.purchaseDate),
          expirationDate: new Date(p.expirationDate)
        })),
        transactions: data.transactions || []
      };
    }
  } catch {}
  return null;
}

function saveToStorage(users: User[], products: Product[], purchases: Purchase[], transactions: PointsTransaction[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ users, products, purchases, transactions }));
  } catch {}
}

export function AppProvider({ children }: { children: ReactNode }) {
  const stored = loadFromStorage();
  const [users, setUsers] = useState<User[]>(stored?.users || initialUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(stored?.products || initialProducts);
  const [purchases, setPurchases] = useState<Purchase[]>(stored?.purchases || []);
  const [transactions, setTransactions] = useState<PointsTransaction[]>(stored?.transactions || []);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    saveToStorage(users, products, purchases, transactions);
  }, [users, products, purchases, transactions]);

  const login = useCallback((username: string, password: string) => {
    const user = users.find(u => (u.username === username || u.email === username) && u.password === password);
    if (!user) return { success: false, message: 'Usuario o contraseña incorrectos' };
    if (!user.isActive) return { success: false, message: 'Tu cuenta está desactivada. Contacta al administrador.' };
    setCurrentUser(user);
    return { success: true, message: `Bienvenido, ${user.name}` };
  }, [users]);

  const register = useCallback((name: string, username: string, email: string, password: string) => {
    if (users.find(u => u.username === username)) return { success: false, message: 'Ese nombre de usuario ya está en uso' };
    if (users.find(u => u.email === email)) return { success: false, message: 'Ese email ya está registrado' };
    if (password.length < 6) return { success: false, message: 'La contraseña debe tener al menos 6 caracteres' };
    const avatars = ['😎','🌟','🎮','🎯','🚀','💫','🦄','🔥','⚡','🎸'];
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      username,
      email,
      password,
      role: 'user',
      points: 0,
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
      createdAt: new Date(),
      isActive: true
    };
    setUsers(prev => [...prev, newUser]);
    return { success: true, message: '¡Cuenta creada! Ya puedes iniciar sesión.' };
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const purchaseProduct = useCallback((productId: string): { success: boolean; message: string; credential?: Credential } => {
    if (!currentUser) return { success: false, message: 'Debes iniciar sesión para comprar' };
    const product = products.find(p => p.id === productId);
    if (!product || !product.isActive) return { success: false, message: 'Producto no disponible' };
    const availableCredential = product.credentials.find(c => !c.isAssigned);
    if (!availableCredential) return { success: false, message: 'No hay cuentas disponibles. ¡Vuelve pronto!' };
    if (currentUser.points < product.price) return { success: false, message: `Necesitas ${product.price} pts y tienes ${currentUser.points}` };

    const now = new Date();
    const expiration = new Date(now);
    expiration.setMonth(expiration.getMonth() + 1);

    const newPurchase: Purchase = {
      id: `purchase-${Date.now()}`,
      oderId: `ORD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      userId: currentUser.id,
      productId: product.id,
      productName: `${product.service} ${product.planName}`,
      serviceName: product.service,
      serviceLogo: product.serviceLogo,
      planName: product.planName,
      credentialEmail: availableCredential.email,
      credentialPassword: availableCredential.password,
      pointsSpent: product.price,
      purchaseDate: now,
      expirationDate: expiration,
      status: 'active'
    };

    setProducts(prev => prev.map(p => p.id === productId ? {
      ...p, credentials: p.credentials.map(c =>
        c.id === availableCredential.id ? { ...c, isAssigned: true, assignedTo: currentUser.id, assignedAt: now } : c
      )
    } : p));

    const newPoints = currentUser.points - product.price;
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, points: newPoints } : u));
    setCurrentUser(prev => prev ? { ...prev, points: newPoints } : null);
    setPurchases(prev => [...prev, newPurchase]);

    const tx: PointsTransaction = {
      id: `tx-${Date.now()}`,
      userId: currentUser.id,
      amount: product.price,
      type: 'spend',
      reason: `Compra: ${product.service} ${product.planName}`,
      date: now
    };
    setTransactions(prev => [...prev, tx]);

    return { success: true, message: '¡Compra exitosa!', credential: availableCredential };
  }, [currentUser, products]);

  const getUserPurchases = useCallback(() => {
    if (!currentUser) return [];
    return purchases.filter(p => p.userId === currentUser.id);
  }, [currentUser, purchases]);

  const getAllPurchases = useCallback(() => purchases, [purchases]);

  const addPoints = useCallback((userId: string, amount: number, reason = 'Asignado por administrador') => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, points: u.points + amount } : u));
    if (currentUser?.id === userId) setCurrentUser(prev => prev ? { ...prev, points: prev.points + amount } : null);
    const tx: PointsTransaction = { id: `tx-${Date.now()}`, userId, amount, type: 'add', reason, date: new Date(), adminId: currentUser?.id };
    setTransactions(prev => [...prev, tx]);
  }, [currentUser]);

  const removePoints = useCallback((userId: string, amount: number, reason = 'Removido por administrador') => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, points: Math.max(0, u.points - amount) } : u));
    if (currentUser?.id === userId) setCurrentUser(prev => prev ? { ...prev, points: Math.max(0, prev.points - amount) } : null);
    const tx: PointsTransaction = { id: `tx-${Date.now()}`, userId, amount, type: 'remove', reason, date: new Date(), adminId: currentUser?.id };
    setTransactions(prev => [...prev, tx]);
  }, [currentUser]);

  const setPoints = useCallback((userId: string, amount: number) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, points: Math.max(0, amount) } : u));
    if (currentUser?.id === userId) setCurrentUser(prev => prev ? { ...prev, points: Math.max(0, amount) } : null);
  }, [currentUser]);

  const deleteUser = useCallback((userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  }, []);

  const toggleUserStatus = useCallback((userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u));
  }, []);

  const addProduct = useCallback((product: Omit<Product, 'id' | 'credentials'>) => {
    const newProduct: Product = { ...product, id: `prod-${Date.now()}`, credentials: [] };
    setProducts(prev => [...prev, newProduct]);
  }, []);

  const updateProduct = useCallback((productId: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updates } : p));
  }, []);

  const deleteProduct = useCallback((productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  }, []);

  const toggleProductStatus = useCallback((productId: string) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, isActive: !p.isActive } : p));
  }, []);

  const addCredential = useCallback((productId: string, email: string, password: string) => {
    setProducts(prev => prev.map(p => p.id === productId ? {
      ...p, credentials: [...p.credentials, { id: `cred-${Date.now()}`, email, password, isAssigned: false }]
    } : p));
  }, []);

  const removeCredential = useCallback((productId: string, credentialId: string) => {
    setProducts(prev => prev.map(p => p.id === productId ? {
      ...p, credentials: p.credentials.filter(c => c.id !== credentialId)
    } : p));
  }, []);

  const getProductCredentials = useCallback((productId: string) => {
    return products.find(p => p.id === productId)?.credentials || [];
  }, [products]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const n: Notification = { ...notification, id: `notif-${Date.now()}` };
    setNotifications(prev => [...prev, n]);
    setTimeout(() => removeNotification(n.id), 5000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{
      currentUser, users, products, purchases, notifications, transactions,
      login, register, logout,
      purchaseProduct, getUserPurchases, getAllPurchases,
      addPoints, removePoints, setPoints, deleteUser, toggleUserStatus,
      addProduct, updateProduct, deleteProduct, toggleProductStatus,
      addCredential, removeCredential, getProductCredentials,
      addNotification, removeNotification
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
