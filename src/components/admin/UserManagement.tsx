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
import { DeleteModal } from '../ui/DeleteModal';
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
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<AdminUser['role']>('admin');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [adminPassword, setAdminPassword] = useState('');
  const [originalEmail, setOriginalEmail] = useState('');

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
  const roleKey = (r?: string) => (r || '').toLowerCase().replace(/\s+/g, '_');
  const ROLE_RANK: Record<string, number> = { super_admin: 3, admin: 2, manager: 1, receptionist: 0 };
  const isSuperAdmin = roleKey(currentUser?.role) === 'super_admin';
  // Mirrors the backend hierarchy: no role may manage an account at or above
  // its own level (and only a Super Admin may manage Super Admins).
  const canManage = (u: AdminUser) =>
    isSuperAdmin || (ROLE_RANK[roleKey(u.role)] ?? -1) < (ROLE_RANK[roleKey(currentUser?.role)] ?? -1);
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
    setPassword('');
    setPhone('');
    setRole('admin');
    setStatus('active');
    setAdminPassword('');
    setOriginalEmail('');
    setShowUserModal(true);
  };

  const handleOpenEdit = (u: AdminUser) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setPassword('');
    setPhone(u.phone || '');
    setRole(u.role);
    setStatus(u.status);
    setAdminPassword('');
    setOriginalEmail(u.email);
    setShowUserModal(true);
  };

  const emailChanged = !!editingUser && email.trim().toLowerCase() !== (originalEmail || '').toLowerCase();
  const needsReauth =
    !!editingUser &&
    (emailChanged || password.length > 0 || status !== editingUser.status || role !== editingUser.role);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingUser) {
        await api.updateAdminUser(editingUser.id, {
          name,
          email,
          role,
          status,
          phone,
          password: password || undefined,
          currentPassword: needsReauth ? adminPassword || undefined : undefined,
        });
      } else {
        await api.createAdminUser({ name, email, password, role, status, phone });
      }
      setShowUserModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await api.deleteAdminUser(deleteTarget.id);
    setDeleteTarget(null);
    fetchData();
  };

  const getRoleBadge = (r: AdminUser['role']) => {
    switch (r) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'admin':
        return 'bg-brand-100 text-[var(--brand-ink)] border-brand-200';
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
            className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-500 text-brand-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-[#BFA476]/20"
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
            <ShieldCheck className="w-4 h-4 text-[var(--brand-ink)]" /> Staff Accounts ({filteredUsers.length})
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
                    {u.avatarUrl ? (
                      <img src={u.avatarUrl} alt={u.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-[#BFA476]" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-brand-500 ring-2 ring-[#BFA476]/40 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-brand-950">
                          {(u.name || 'A')
                            .trim()
                            .split(/\s+/)
                            .slice(0, 2)
                            .map((p) => p[0])
                            .join('')
                            .toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-gray-900">{u.name}</p>
                      <p className="text-[10px] text-gray-400">ID: {u.id}</p>
                      {u.phone && <p className="text-[10px] text-gray-400">Phone: {u.phone}</p>}
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
                      disabled={!canManage(u)}
                      className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      title={canManage(u) ? 'Edit User' : 'You cannot manage this account'}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {u.id !== currentUser?.id && canManage(u) && (
                      <button
                        onClick={() => setDeleteTarget(u)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                        title="Delete User"
                        aria-label={`Delete user ${u.name}`}
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
          <Clock className="w-4 h-4 text-[var(--brand-ink)]" /> Recent Security Login Activity
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
              className="w-full px-3.5 py-2.5 rounded-xl border font-semibold outline-none focus:ring-2 focus:ring-[#BFA476]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border font-semibold outline-none focus:ring-2 focus:ring-[#BFA476]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Optional"
              className="w-full px-3.5 py-2.5 rounded-xl border font-semibold outline-none focus:ring-2 focus:ring-[#BFA476]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Password {editingUser && '(Leave blank to keep unchanged)'}</label>
            <input
              type="password"
              required={!editingUser}
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters, letter + number"
              className="w-full px-3.5 py-2.5 rounded-xl border outline-none"
            />
          </div>

          {needsReauth && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
              <label className="block font-bold text-amber-800">
                Confirm with your password (required for email, password, role or status changes)
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Your current password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 outline-none"
              />
              <p className="text-[10px] text-amber-700">
                Security-sensitive changes re-authenticate the acting administrator and revoke the account's existing sessions.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Role</label>
              {isSuperAdmin ? (
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
              ) : (
                <div className="w-full px-3 py-2.5 rounded-xl border bg-gray-50 font-semibold text-gray-600 capitalize">
                  {(role || '').replace('_', ' ')}
                </div>
              )}
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
              className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-500 text-brand-950 font-bold cursor-pointer shadow-md shadow-[#BFA476]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Staff User'}
            </button>
          </div>
        </form>
      </Modal>

      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove Staff User"
        itemName={deleteTarget ? `${deleteTarget.name} (${deleteTarget.email})` : undefined}
        dangerHint="Their portal access is revoked immediately."
      />
    </div>
  );
};
