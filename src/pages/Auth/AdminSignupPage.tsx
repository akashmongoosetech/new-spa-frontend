import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { adminSignup } from '../../services/api';

export const AdminSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminSignup({ name, email, password });
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md text-center space-y-4">
        <div className="w-14 h-14 bg-[#2CB5A0]/20 text-[#2CB5A0] rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-serif font-bold text-white">Registration Request Submitted</h2>
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          Your staff account request has been forwarded to the Super Director for verification and authorization.
        </p>
        <button
          onClick={() => navigate('/admin-login')}
          className="w-full py-3 bg-[#2CB5A0] text-white rounded-xl text-xs font-bold transition-all shadow-md mt-4"
        >
          Return to Admin Login
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      <h2 className="text-xl font-serif font-bold text-white mb-2 text-center">Staff Account Application</h2>
      <p className="text-xs text-gray-400 text-center mb-6">Register for authorized therapist or manager portal credentials</p>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-950/80 border border-gray-800 focus:border-[#2CB5A0] rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
            placeholder="Julian Vance"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Work Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-950/80 border border-gray-800 focus:border-[#2CB5A0] rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
            placeholder="therapist@auraluxespa.com"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Password</label>
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

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[#2CB5A0] hover:bg-[#259b89] text-white rounded-xl text-sm font-bold tracking-wide transition-all shadow-lg shadow-[#2CB5A0]/20 mt-6"
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-800 text-center">
        <p className="text-xs text-gray-400">
          Already registered?{' '}
          <Link to="/admin-login" className="text-[#2CB5A0] font-semibold hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminSignupPage;
