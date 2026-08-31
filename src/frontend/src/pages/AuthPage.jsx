import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Lock, Mail, User as UserIcon, ArrowRight, ShieldCheck } from 'lucide-react';
import { loginUser, registerUser, requestPasswordReset, submitNewPassword } from '../services/api';

export default function AuthPage({ onAuthSuccess }) {
  const navigate = useNavigate();
  const [view, setView] = useState('login'); // 'login', 'register', 'forgot', 'reset'
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '' });
  const [resetToken, setResetToken] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('reset_token');
    if (token) {
      setResetToken(token);
      setView('reset');
      setError('');
      setMessage('Security key verification detected. Enter your new password below.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleAuthComplete = (data) => {
    if (data?.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('stenox_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('stenox_user', JSON.stringify(data.user));
    }
    if (typeof onAuthSuccess === 'function') {
      onAuthSuccess(data);
    }
    navigate('/landing');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (view === 'register') {
        await registerUser(formData);
        const loginRes = await loginUser({ email: formData.email, password: formData.password });
        handleAuthComplete(loginRes.data);
      } else if (view === 'login') {
        const loginRes = await loginUser({ email: formData.email, password: formData.password });
        handleAuthComplete(loginRes.data);
      } else if (view === 'forgot') {
        const res = await requestPasswordReset({ email: formData.email });
        setMessage(res.data?.message || 'If an account exists, a reset link has been dispatched.');
      } else if (view === 'reset') {
        if (!resetToken) {
          throw new Error('Reset token missing or expired.');
        }
        const res = await submitNewPassword({ token: resetToken, new_password: formData.password });
        setMessage(res.data?.message || 'Password updated successfully. Redirecting to sign-in...');
        setTimeout(() => {
          setView('login');
          setMessage('');
          setResetToken(null);
          setFormData({ full_name: '', email: '', password: '' });
        }, 2500);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen ambient-glow flex flex-col justify-center items-center px-4 relative">
      <div className="absolute top-12 flex items-center space-x-2 text-slate-500 font-mono text-xs">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>STENOX SECURE PROTOCOL GATEWAY</span>
      </div>

      <div className="w-full max-w-md glass-panel rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>

        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 shadow-glow-emerald">
            <Terminal className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            {view === 'register' ? 'Create Node' : view === 'forgot' ? 'Recover Access' : view === 'reset' ? 'Set New Security Key' : 'Access Workspace'}
          </h1>
        </div>

        {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">{error}</div>}
        {message && <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {view === 'register' && (
            <div>
              <label className="block text-[11px] font-mono tracking-wider text-slate-400 mb-1">OPERATOR NAME</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input 
                  type="text" 
                  required 
                  placeholder="Jane Doe" 
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} 
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white text-sm focus:border-emerald-500 focus:outline-none transition-all" 
                />
              </div>
            </div>
          )}

          {(view === 'login' || view === 'register' || view === 'forgot') && (
            <div>
              <label className="block text-[11px] font-mono tracking-wider text-slate-400 mb-1">EMAIL ADDRESS</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input 
                  type="email" 
                  required 
                  placeholder="operator@stenox.internal" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white text-sm focus:border-emerald-500 focus:outline-none transition-all" 
                />
              </div>
            </div>
          )}

          {(view === 'login' || view === 'register' || view === 'reset') && (
            <div>
              <div className="flex justify-between">
                <label className="block text-[11px] font-mono tracking-wider text-slate-400 mb-1">
                  {view === 'reset' ? 'NEW PASSWORD' : 'SECURITY KEY'}
                </label>
                {view === 'login' && (
                  <button 
                    type="button" 
                    onClick={() => { setView('forgot'); setError(''); setMessage(''); }} 
                    className="text-[11px] text-emerald-400 hover:text-emerald-300"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••••••" 
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white text-sm focus:border-emerald-500 focus:outline-none transition-all" 
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-slate-950 font-bold text-sm shadow-glow-emerald transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>
              {loading ? 'Processing...' : view === 'forgot' ? 'Send Reset Link' : view === 'reset' ? 'Update Password' : view === 'register' ? 'Initialize Account' : 'Authenticate Session'}
            </span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </form>

        <div className="mt-6 text-center">
          {(view === 'login' || view === 'register') && (
            <button 
              onClick={() => { setView(view === 'login' ? 'register' : 'login'); setError(''); setMessage(''); }} 
              className="text-xs text-slate-400 hover:text-emerald-400 transition-colors"
            >
              {view === 'login' ? "Need an isolated endpoint? Create account" : "Already registered? Return to sign-in"}
            </button>
          )}
          {(view === 'forgot' || view === 'reset') && (
            <button 
              onClick={() => { setView('login'); setError(''); setMessage(''); }} 
              className="text-xs text-slate-400 hover:text-emerald-400 transition-colors"
            >
              Return to sign-in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}