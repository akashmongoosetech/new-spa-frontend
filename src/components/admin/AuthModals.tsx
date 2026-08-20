import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { api } from '../../services/api';

interface AuthModalsProps {
  showSignupModal: boolean;
  setShowSignupModal: (show: boolean) => void;
  showForgotModal: boolean;
  setShowForgotModal: (show: boolean) => void;
  showChangePasswordModal: boolean;
  setShowChangePasswordModal: (show: boolean) => void;
}

export const AuthModals: React.FC<AuthModalsProps> = ({
  showSignupModal,
  setShowSignupModal,
  showForgotModal,
  setShowForgotModal,
  showChangePasswordModal,
  setShowChangePasswordModal,
}) => {
  // Signup Form State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState('admin');
  const [signupMsg, setSignupMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [signupLoading, setSignupLoading] = useState(false);

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [forgotLoading, setForgotLoading] = useState(false);

  // Change Password State
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changeMsg, setChangeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [changeLoading, setChangeLoading] = useState(false);

  // Map frontend role keys to backend role names (backend never allows Super Admin via signup).
  const roleToBackend = (role: string): string => {
    switch (role) {
      case 'manager': return 'Manager';
      case 'receptionist': return 'Receptionist';
      default: return 'Admin';
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupMsg(null);
    setSignupLoading(true);
    try {
      await api.adminSignup({ name: signupName, email: signupEmail, password: signupPassword, requestedRole: roleToBackend(signupRole) });
      setSignupMsg({ type: 'success', text: 'Application submitted for director approval!' });
      setTimeout(() => setShowSignupModal(false), 1500);
    } catch (err: any) {
      setSignupMsg({ type: 'error', text: err.message || 'Failed to create account.' });
    } finally {
      setSignupLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMsg(null);
    setForgotLoading(true);
    try {
      const res = await api.forgotPassword(forgotEmail);
      setForgotMsg({ type: 'success', text: res.message });
    } catch (err: any) {
      setForgotMsg({ type: 'error', text: err.message });
    } finally {
      setForgotLoading(false);
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setChangeMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    setChangeMsg(null);
    setChangeLoading(true);
    try {
      const res = await api.changePassword(currPassword, newPassword);
      setChangeMsg({ type: 'success', text: res.message });
      setTimeout(() => setShowChangePasswordModal(false), 1500);
    } catch (err: any) {
      setChangeMsg({ type: 'error', text: err.message });
    } finally {
      setChangeLoading(false);
    }
  };

  return (
    <>
      {/* Admin Signup Modal */}
      <Modal isOpen={showSignupModal} onClose={() => setShowSignupModal(false)} title="Create Admin Staff Account">
        <form onSubmit={handleSignupSubmit} className="space-y-4">
          {signupMsg && (
            <div className={`p-3 rounded-xl text-xs font-semibold ${signupMsg.type === 'success' ? 'bg-teal-50 text-[#2CB5A0]' : 'bg-rose-50 text-rose-600'}`}>
              {signupMsg.text}
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-[#2CB5A0] outline-none"
              placeholder="e.g. Marcus Sterling"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-[#2CB5A0] outline-none"
              placeholder="admin@auraluxespa.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-[#2CB5A0] outline-none"
              placeholder="Min 6 characters"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Assigned Role</label>
            <select
              value={signupRole}
              onChange={(e: any) => setSignupRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold focus:ring-2 focus:ring-[#2CB5A0] outline-none"
            >
              <option value="admin">Admin (Bookings, Services, Settings)</option>
              <option value="manager">Manager (Bookings, Reports)</option>
              <option value="receptionist">Receptionist (Bookings, Contacts)</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={signupLoading}
            className="w-full py-3 rounded-xl bg-[#2CB5A0] hover:bg-teal-600 text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {signupLoading ? 'Creating Account...' : 'Create Staff Account'}
          </button>
        </form>
      </Modal>

      {/* Forgot Password Modal */}
      <Modal isOpen={showForgotModal} onClose={() => setShowForgotModal(false)} title="Reset Password Request">
        <form onSubmit={handleForgotSubmit} className="space-y-4">
          <p className="text-xs text-gray-600">Enter your administrator email to receive password recovery instructions.</p>
          {forgotMsg && (
            <div className={`p-3 rounded-xl text-xs font-semibold ${forgotMsg.type === 'success' ? 'bg-teal-50 text-[#2CB5A0]' : 'bg-rose-50 text-rose-600'}`}>
              {forgotMsg.text}
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Admin Email</label>
            <input
              type="email"
              required
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-[#2CB5A0] outline-none"
              placeholder="admin@auraluxespa.com"
            />
          </div>
          <button
            type="submit"
            disabled={forgotLoading}
            className="w-full py-3 rounded-xl bg-[#1A1A1A] hover:bg-black text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {forgotLoading ? 'Sending...' : 'Send Reset Instructions'}
          </button>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal isOpen={showChangePasswordModal} onClose={() => setShowChangePasswordModal(false)} title="Change Account Password">
        <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
          {changeMsg && (
            <div className={`p-3 rounded-xl text-xs font-semibold ${changeMsg.type === 'success' ? 'bg-teal-50 text-[#2CB5A0]' : 'bg-rose-50 text-rose-600'}`}>
              {changeMsg.text}
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currPassword}
              onChange={(e) => setCurrPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-[#2CB5A0] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-[#2CB5A0] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-[#2CB5A0] outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={changeLoading}
            className="w-full py-3 rounded-xl bg-[#2CB5A0] hover:bg-teal-600 text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {changeLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </Modal>
    </>
  );
};
