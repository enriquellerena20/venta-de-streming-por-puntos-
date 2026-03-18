import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Key, User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

export default function Auth() {
  const { login, register } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [regForm, setRegForm] = useState({ name: '', username: '', email: '', password: '', confirm: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMsg(null);
    await new Promise(r => setTimeout(r, 600));
    const result = login(loginForm.username, loginForm.password);
    setLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setMsg({ type: 'error', text: result.message });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regForm.password !== regForm.confirm) { setMsg({ type: 'error', text: 'Las contraseñas no coinciden' }); return; }
    setLoading(true); setMsg(null);
    await new Promise(r => setTimeout(r, 600));
    const result = register(regForm.name, regForm.username, regForm.email, regForm.password);
    setLoading(false);
    if (result.success) {
      setMsg({ type: 'success', text: result.message });
      setTimeout(() => { setTab('login'); setMsg(null); }, 1800);
    } else {
      setMsg({ type: 'error', text: result.message });
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Key className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">StreamKeys</h1>
          <p className="text-gray-400 mt-1 text-sm">Accede a los mejores servicios de streaming</p>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          {/* Tabs */}
          <div className="flex">
            <button onClick={() => { setTab('login'); setMsg(null); }}
              className={`flex-1 py-4 font-medium text-sm transition-all ${tab === 'login' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
              Iniciar sesión
            </button>
            <button onClick={() => { setTab('register'); setMsg(null); }}
              className={`flex-1 py-4 font-medium text-sm transition-all ${tab === 'register' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
              Crear cuenta
            </button>
          </div>

          <div className="p-8">
            {/* Message */}
            {msg && (
              <div className={`flex items-center gap-2 p-3 rounded-xl mb-5 text-sm ${msg.type === 'error' ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-green-500/10 border border-green-500/30 text-green-400'}`}>
                {msg.type === 'error' ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle className="w-4 h-4 flex-shrink-0" />}
                {msg.text}
              </div>
            )}

            {tab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Usuario o email</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="text" placeholder="usuario o email" value={loginForm.username}
                      onChange={e => setLoginForm(p => ({ ...p, username: e.target.value }))} required
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={loginForm.password}
                      onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))} required
                      className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2">
                  {loading ? 'Verificando...' : 'Entrar'}
                </button>
                <div className="mt-4 p-3 bg-gray-800/50 rounded-xl text-xs text-gray-500 space-y-1">
                  <p className="font-medium text-gray-400 mb-1">Cuenta de prueba:</p>
                  <p>Admin: <span className="text-purple-400 font-mono">admin</span> / <span className="text-purple-400 font-mono">admin123</span></p>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Nombre completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="text" placeholder="Tu nombre" value={regForm.name}
                      onChange={e => setRegForm(p => ({ ...p, name: e.target.value }))} required
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Nombre de usuario</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">@</span>
                    <input type="text" placeholder="mi_usuario" value={regForm.username}
                      onChange={e => setRegForm(p => ({ ...p, username: e.target.value.toLowerCase().replace(/\s/g,'') }))} required
                      className="w-full pl-8 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="email" placeholder="tu@email.com" value={regForm.email}
                      onChange={e => setRegForm(p => ({ ...p, email: e.target.value }))} required
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input type={showPass ? 'text' : 'password'} placeholder="Min. 6 chars" value={regForm.password}
                        onChange={e => setRegForm(p => ({ ...p, password: e.target.value }))} required
                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Confirmar</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input type={showPass ? 'text' : 'password'} placeholder="Repetir" value={regForm.confirm}
                        onChange={e => setRegForm(p => ({ ...p, confirm: e.target.value }))} required
                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors text-sm" />
                    </div>
                  </div>
                </div>
                <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none">
                  <input type="checkbox" onChange={e => setShowPass(e.target.checked)} className="rounded" />
                  Mostrar contraseñas
                </label>
                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? 'Creando cuenta...' : 'Crear mi cuenta'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
