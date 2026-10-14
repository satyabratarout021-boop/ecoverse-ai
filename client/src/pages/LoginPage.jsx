import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Lock, Mail, Sparkles, UserCheck, ShieldCheck, Wrench, User } from 'lucide-react';

export const LoginPage = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role, dept = null) => {
    setError('');
    setLoading(true);
    try {
      await demoLogin(role, dept);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-cyan-400 p-0.5 mx-auto shadow-xl">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Leaf className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Sign in to EcoVerse AI</h2>
          <p className="text-xs text-slate-400">Smart Village & Smart City Unified Civic Platform</p>
        </div>

        {/* Demo Quick-Login Buttons (For Evaluation & Judges) */}
        <div className="p-4 rounded-2xl glass-panel border border-emerald-500/30 space-y-2.5">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block text-center">
            ⚡ One-Click Role Switcher (Zero-Friction Evaluation)
          </span>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleQuickDemo('citizen')}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 text-slate-200 flex items-center gap-1.5 justify-center transition-all"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Citizen User</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('local_admin')}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-blue-500 text-slate-200 flex items-center gap-1.5 justify-center transition-all"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Local Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('department_staff', 'water')}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-200 flex items-center gap-1.5 justify-center transition-all"
            >
              <Wrench className="w-3.5 h-3.5 text-cyan-400" />
              <span>Water Staff</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('department_staff', 'waste')}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-green-500 text-slate-200 flex items-center gap-1.5 justify-center transition-all"
            >
              <Wrench className="w-3.5 h-3.5 text-green-400" />
              <span>Waste Staff</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('department_staff', 'electricity')}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500 text-slate-200 flex items-center gap-1.5 justify-center transition-all"
            >
              <Wrench className="w-3.5 h-3.5 text-amber-400" />
              <span>Energy Staff</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('super_admin')}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-purple-500 text-slate-200 flex items-center gap-1.5 justify-center transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Super Admin</span>
            </button>
          </div>
        </div>

        {/* Regular Login Form */}
        <form onSubmit={handleSubmit} className="p-6 rounded-3xl glass-card border-slate-800 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder="citizen@ecoverse.gov"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>

          <p className="text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-400 font-semibold hover:underline">
              Register as Citizen
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
