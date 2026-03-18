import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Store from './pages/Store';
import MyPurchases from './pages/MyPurchases';
import AdminDashboard from './pages/AdminDashboard';
import Auth from './pages/Auth';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useApp();
  return currentUser ? <>{children}</> : <Navigate to="/auth" replace />;
}

function AppRoutes() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <Routes>
        <Route path="/" element={<Store />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/mis-compras" element={<PrivateRoute><MyPurchases /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}

export default App;
