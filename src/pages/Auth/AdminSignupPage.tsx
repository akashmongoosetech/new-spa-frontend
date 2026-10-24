import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, BadgeCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { adminSignup } from '../../services/api';

const ROLE_OPTIONS: { value: string; label: string }[] = [
  { value: 'Manager', label: 'Manager' },
  { value: 'Receptionist', label: 'Receptionist' },
  { value: 'Admin', label: 'Admin' },
];

export const AdminSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [requestedRole, setRequestedRole] = useState('Manager');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      setError('Password must be at least 8 characters with a letter and a number.');
      return;
    }
    setLoading(true);
    try {
      await adminSignup({ name, email, password, requestedRole });
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-[#201A14]/90 border border-[#BFA476]/15 rounded-2xl p-8 shadow-2xl backdrop-blur-md text-center space-y-4">
        <div className="w-14 h-14 bg-brand-500/20 text-[var(--brand-ink)] rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-serif font-bold text-white">Application Submitted</h2>
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          Your staff account request has been forwarded to the Super Director for verification and authorization.
          You will receive an email once your access has been approved.
        </p>
        <button
          onClick={() => navigate('/admin-login')}
          className="w-full py-3 bg-brand-500 text-brand-950 rounded-xl text-xs font-bold transition-all shadow-md mt-4"
        >
          Return to Admin Login
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#201A14]/90 border border-[#BFA476]/15 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      <h2 className="text-xl font-serif font-bold text-white mb-2 text-center">Staff Account Application</h2>
      <p className="text-xs text-gray-400 text-center mb-6">Apply for authorized portal credentials — access is granted after director approval</p>

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
            className="w-full bg-[#17130F]/80 border border-[#BFA476]/15 focus:border-[#BFA476] rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
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
            className="w-full bg-[#17130F]/80 border border-[#BFA476]/15 focus:border-[#BFA476] rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
            placeholder="therapist@example.com"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#17130F]/80 border border-[#BFA476]/15 focus:border-[#BFA476] rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
            placeholder="Min 8 characters, letter + number"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Requested Access Level</label>
          <div className="grid grid-cols-3 gap-2">
            {ROLE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRequestedRole(opt.value)}
                className={`flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  requestedRole === opt.value
                    ? 'bg-brand-500/15 border-[#BFA476] text-[var(--brand-ink)]'
                    : 'bg-[#17130F]/60 border-[#BFA476]/15 text-gray-400 hover:border-gray-600'
                }`}
              >
                <BadgeCheck className="w-4 h-4" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-brand-500 hover:bg-brand-400 text-brand-950 rounded-xl text-sm font-bold tracking-wide transition-all shadow-lg shadow-[#BFA476]/20 mt-6"
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-[#BFA476]/15 text-center">
        <p className="text-xs text-gray-400">
          Already registered?{' '}
          <Link to="/admin-login" className="text-[var(--brand-ink)] font-semibold hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminSignupPage;
