import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Save, CheckCircle2, AlertCircle, Loader2, LogOut } from 'lucide-react';
import { api } from '../../services/api';
import { showToast } from '../../utils/toastEvents';

const inputClass =
  'w-full border border-gray-300 rounded-xl p-3 text-sm focus:border-[#2CB5A0] focus:outline-none';

export const AdminChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (next.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (!/[a-zA-Z]/.test(next) || !/\d/.test(next)) {
      setError('New password must contain at least one letter and one number.');
      return;
    }
    if (next !== confirm) {
      setError('New passwords do not match.');
      return;
    }
    if (current === next) {
      setError('New password must be different from your current password.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.changePassword(current, next, confirm);
      setSuccess(true);
      setError('');
      setCurrent('');
      setNext('');
      setConfirm('');
      // Sessions are invalidated after a password change — sign in again.
      localStorage.removeItem('aura_admin_user');
      localStorage.removeItem('aura_admin_token');
      showToast({
        type: 'success',
        title: 'Password changed',
        message: res.message || 'Please sign in again with your new password.',
      });
      setTimeout(() => navigate('/admin-login'), 1500);
    } catch (err: any) {
      setError(err?.message || 'Failed to update password. Please verify your current password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900">Change Admin Password</h1>
        <p className="text-xs text-gray-500 mt-1">
          Your password must be at least 8 characters and include a letter and a number. You will be asked to sign in
          again after the change.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Password updated successfully! Redirecting to sign in...</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Current Password</label>
            <input
              type="password"
              required
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">New Password</label>
            <input
              type="password"
              required
              value={next}
              onChange={(e) => setNext(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="px-6 py-3 bg-[#2CB5A0] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm mt-4 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : success ? <LogOut className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {loading ? 'Saving...' : success ? 'Redirecting...' : 'Save New Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminChangePasswordPage;