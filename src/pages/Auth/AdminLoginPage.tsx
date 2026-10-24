import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { adminLogin } from '../../services/api';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await adminLogin(email, password);
      localStorage.setItem('aura_admin_user', JSON.stringify(result.user));
      localStorage.setItem('aura_admin_token', result.token);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please verify your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#201A14]/90 border border-[#BFA476]/15 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      <h2 className="text-xl font-serif font-bold text-white mb-2 text-center">Admin Console Sign In</h2>
      <p className="text-xs text-gray-400 text-center mb-6">Enter authorized credentials to enter sanctuary panel</p>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-medium text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#17130F]/80 border border-[#BFA476]/15 focus:border-[#BFA476] rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none transition-colors"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Password
            </label>
            <Link to="/forgot-password" className="text-xs text-[var(--brand-ink)] hover:underline">
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#17130F]/80 border border-[#BFA476]/15 focus:border-[#BFA476] rounded-xl py-3 pl-10 pr-10 text-sm text-white focus:outline-none transition-colors"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-linear-to-r from-[#C3AA7E] to-[#BFA476] hover:brightness-110 text-brand-950 rounded-xl text-sm font-bold tracking-wide transition-all shadow-lg shadow-[#BFA476]/20 flex items-center justify-center gap-2 mt-6"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-brand-950/30 border-t-brand-950 rounded-full animate-spin" />
          ) : (
            <>
              <span>Authenticate Portal</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-[#BFA476]/15 text-center">
        <p className="text-xs text-gray-400">
          Need staff access?{' '}
          <Link to="/admin-signup" className="text-[var(--brand-ink)] font-semibold hover:underline">
            Request Registration
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
