import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export const AdminProfilePage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = localStorage.getItem('aura_admin_user');
        const me = stored ? JSON.parse(stored) : null;
        const users = await api.getAdminUsers();
        const match = me?.id ? users.find((u) => u.id === me.id) : users[0];
        if (match) {
          setUserId(match.id);
          setName(match.name);
          setEmail(match.email);
          setPhone(match.phone || '');
          setRole(match.role || '');
        } else if (me) {
          setUserId(me.id);
          setName(me.name || '');
          setEmail(me.email || '');
        }
      } catch (err) {
        const stored = localStorage.getItem('aura_admin_user');
        if (stored) {
          const me = JSON.parse(stored);
          setUserId(me.id || null);
          setName(me.name || '');
          setEmail(me.email || '');
          setRole(me.role || '');
        }
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setError('');
    setSaved(false);
    try {
      await api.updateAdminUser(userId, { name, email, phone });
      const updated = await api.getAdminUsers();
      const match = updated.find((u) => u.id === userId);
      if (match) localStorage.setItem('aura_admin_user', JSON.stringify(match));
      setSaved(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to update profile.');
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900">Admin Profile Settings</h1>
        <p className="text-xs text-gray-500 mt-1">Manage your administrative personal contact details and preferences</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
        {saved && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile updated successfully!</span>
          </div>
        )}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center gap-4 border-b pb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#2CB5A0] bg-gray-100 flex items-center justify-center">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{name || 'Administrator'}</h3>
            <p className="text-xs text-[#2CB5A0] font-semibold">{role || 'Admin'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:border-[#2CB5A0] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:border-[#2CB5A0] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:border-[#2CB5A0] focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="px-6 py-3 bg-[#2CB5A0] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4" />
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProfilePage;
