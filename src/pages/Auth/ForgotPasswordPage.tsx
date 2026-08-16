import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowLeft, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.forgotPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md text-center space-y-4">
        <div className="w-14 h-14 bg-[#2CB5A0]/20 text-[#2CB5A0] rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-serif font-bold text-white">Reset Link Dispatched</h2>
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          If <strong className="text-white">{email}</strong> exists in our system, password reset instructions have been emailed.
        </p>
        <Link
          to="/admin-login"
          className="block w-full py-3 bg-[#2CB5A0] text-white rounded-xl text-xs font-bold transition-all shadow-md mt-4"
        >
          Return to Admin Login
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      <h2 className="text-xl font-serif font-bold text-white mb-2 text-center">Reset Access Password</h2>
      <p className="text-xs text-gray-400 text-center mb-6">Enter your registered email to receive a secure recovery token</p>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-950/80 border border-gray-800 focus:border-[#2CB5A0] rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none"
              placeholder="admin@auraluxespa.com"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[#2CB5A0] hover:bg-[#259b89] text-white rounded-xl text-sm font-bold tracking-wide transition-all shadow-lg shadow-[#2CB5A0]/20 mt-4"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-800 text-center">
        <Link to="/admin-login" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
