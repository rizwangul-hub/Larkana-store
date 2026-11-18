import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Lock, ShieldAlert } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from '../../components/BrandLogo';

export const AdminLoginPage: React.FC = () => {
  const { isAdminAuthenticated, loginAdmin, settings } = useStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAdminAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter both the demo admin email and password.');
      return;
    }
    const ok = loginAdmin(email, password);
    if (!ok) {
      setError('Invalid demo credentials. Use admin@larkanastore.com and Admin123!');
      return;
    }
    navigate('/admin', { replace: true });
  };

  const fillDemoCredentials = () => {
    setEmail('admin@larkanastore.com');
    setPassword('Admin123!');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 px-4 sm:px-6">
      <div className="max-w-md w-full mx-auto space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <BrandLogo storeName={settings.storeName} />
          </Link>
          <h1 className="font-display text-2xl font-bold text-slate-900 pt-2">
            Admin Panel Login
          </h1>
          <p className="text-sm text-slate-600">
            Manage demo products, categories, orders, and store settings.
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-bold text-orange-800 uppercase tracking-wide">
              Demo Credentials
            </p>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-xs font-semibold text-orange-700 underline hover:text-orange-900 cursor-pointer"
            >
              Fill Demo Credentials
            </button>
          </div>
          <div className="text-xs text-slate-700 font-mono space-y-1">
            <p>Email: admin@larkanastore.com</p>
            <p>Password: Admin123!</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm"
        >
          {error && (
            <div
              role="alert"
              className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700"
            >
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="admin-email"
              className="block text-sm font-semibold text-slate-800 mb-1.5"
            >
              Admin Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@larkanastore.com"
              className="w-full h-11 px-3.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-orange-600"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-sm font-semibold text-slate-800 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter demo password"
                className="w-full h-11 pl-3.5 pr-11 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-orange-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 inline-flex items-center justify-center rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Eye className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-3 rounded-xl bg-orange-600 text-white font-semibold text-sm hover:bg-orange-700 transition-colors cursor-pointer"
          >
            <Lock className="w-4 h-4" aria-hidden="true" />
            <span>Sign In to Admin Demo</span>
          </button>
        </form>

        {/* Security Clarification */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-600">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="leading-relaxed">
            <strong>Demo Security Note:</strong> LocalStorage authentication is used for this frontend client demonstration only and must be replaced with secure server-side authentication before production launch.
          </p>
        </div>

        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-orange-600"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to {settings.storeName}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
