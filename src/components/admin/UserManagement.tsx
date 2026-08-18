import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Clock,
  CheckCircle2,
  XCircle,
  Key
} from 'lucide-react';
import { AdminUser, LoginActivity } from '../../types';
import { Modal } from '../ui/Modal';
import { api } from '../../services/api';

interface UserManagementProps {
  currentUser: AdminUser | null;
  searchQuery: string;
}

export const UserManagement: React.FC<UserManagementProps> = ({ currentUser, searchQuery }) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [activities, setActivities] = useState<LoginActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal State
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<AdminUser['role']>('admin');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [uList, aList] = await Promise.all([api.getAdminUsers(), api.getLoginActivities()]);
      setUsers(uList || []);
      setActivities(aList || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const safeUsers = users || [];
  const isSuperAdmin =
    (currentUser?.role || '').toLowerCase().replace(/\s+/g, '_') === 'super_admin';
  const filteredUsers = safeUsers.filter(
    (u) =>
      u &&
      ((u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.role || '').toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setPassword('admin123');
    setRole('admin');
    setStatus('active');
    setShowUserModal(true);
  };

  const handleOpenEdit = (u: AdminUser) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setPassword('');
    setRole(u.role);
    setStatus(u.status);
    setShowUserModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingUser) {
        await api.updateAdminUser(editingUser.id, { name, email, role, status, password: password || undefined });
      } else {
        await api.createAdminUser({ name, email, password, role, status });
      }
      setShowUserModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this staff user?')) return;
    try {
      await api.deleteAdminUser(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const getRoleBadge = (r: AdminUser['role']) => {
    switch (r) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'admin':
        return 'bg-teal-100 text-[#2CB5A0] border-teal-200';
      case 'manager':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'receptionist':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Staff & Role-Based Access Control (RBAC)</h2>
          <p className="text-xs text-gray-500">Manage administrator privileges, staff roles, and track real-time security login activities.</p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-[#2CB5A0] hover:bg-teal-600 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-[#2CB5A0]/20"
          >
            <Plus className="w-4 h-4" /> Add Staff Account
          </button>
        )}
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-gray-400 bg-white rounded-3xl border border-gray-100">
          Loading staff accounts and security logs...
        </div>
      ) : (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex items-center justify-between text-xs">
          <h3 className="font-extrabold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2CB5A0]" /> Staff Accounts ({filteredUsers.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-100">
              <tr>
                <th className="py-4 px-6">Staff Member</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Assigned Role</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Last Login</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    No staff accounts found.
                  </td>
                </tr>
              ) : (
              filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <img src={u.avatarUrl} alt={u.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-[#2CB5A0]" />
                    <div>
                      <p className="font-bold text-gray-900">{u.name}</p>
                      <p className="text-[10px] text-gray-400">ID: {u.id}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-gray-700">{u.email}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getRoleBadge(u.role)}`}>
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        u.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-500 text-[11px]">
                    {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}
                    <p className="text-[10px] text-gray-400">IP: {u.lastLoginIp || '127.0.0.1'}</p>
                  </td>
                  <td className="py-4 px-6 text-right space-x-1">
                    <button
                      onClick={() => handleOpenEdit(u)}
                      className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
                      title="Edit User"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {u.id !== currentUser?.id && (
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Login Activity Logs */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 space-y-4">
        <h3 className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#2CB5A0]" /> Recent Security Login Activity
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Device</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {activities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    No login activity recorded yet.
                  </td>
                </tr>
              ) : (
              activities.slice(0, 8).map((act) => (
                <tr key={act.id}>
                  <td className="py-3 px-4 font-bold text-gray-900">{act.userName} ({act.userEmail})</td>
                  <td className="py-3 px-4 text-gray-500">{new Date(act.timestamp).toLocaleString()}</td>
                  <td className="py-3 px-4 font-mono text-gray-600">{act.ipAddress}</td>
                  <td className="py-3 px-4 text-gray-500">{act.deviceInfo}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        act.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {act.status}
                    </span>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Form Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title={editingUser ? `Edit Staff Member: ${editingUser.name}` : 'Create New Staff Member'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border font-semibold outline-none focus:ring-2 focus:ring-[#2CB5A0]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border font-semibold outline-none focus:ring-2 focus:ring-[#2CB5A0]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Password {editingUser && '(Leave blank to keep unchanged)'}</label>
            <input
              type="password"
              required={!editingUser}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Role</label>
              <select
                value={role}
                onChange={(e: any) => setRole(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border font-semibold outline-none"
              >
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="receptionist">Receptionist</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Account Status</label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border font-semibold outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive / Suspended</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t">
            <button
              type="button"
              onClick={() => setShowUserModal(false)}
              className="px-4 py-2.5 rounded-xl bg-gray-100 font-bold text-gray-600 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#2CB5A0] hover:bg-teal-600 text-white font-bold cursor-pointer shadow-md shadow-[#2CB5A0]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Staff User'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
