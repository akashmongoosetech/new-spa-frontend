import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!token) {
      setError('Missing reset token. Please use the link from your email.');
      return;
    }
    setLoading(true);
    try {
      await api.resetPassword(token, password);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md text-center space-y-4">
        <div className="w-14 h-14 bg-[#2CB5A0]/20 text-[#2CB5A0] rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-serif font-bold text-white">Password Updated</h2>
        <p className="text-xs text-gray-400 font-light">Your portal credentials have been successfully updated.</p>
        <button
          onClick={() => navigate('/admin-login')}
          className="w-full py-3 bg-[#2CB5A0] text-white rounded-xl text-xs font-bold transition-all shadow-md mt-4"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      <h2 className="text-xl font-serif font-bold text-white mb-2 text-center">Set New Password</h2>
      <p className="text-xs text-gray-400 text-center mb-6">Choose a new password for your portal account</p>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">New Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-950/80 border border-gray-800 focus:border-[#2CB5A0] rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
            placeholder="Min 6 characters"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Confirm Password</label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-gray-950/80 border border-gray-800 focus:border-[#2CB5A0] rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[#2CB5A0] hover:bg-[#259b89] text-white rounded-xl text-sm font-bold tracking-wide transition-all shadow-lg shadow-[#2CB5A0]/20 mt-4"
        >
          {loading ? 'Saving...' : 'Save New Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
