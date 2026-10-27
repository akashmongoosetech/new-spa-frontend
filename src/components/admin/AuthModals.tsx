import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import { api } from '../../services/api';
import { markConversionPending } from '../../utils/analytics';

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
  const navigate = useNavigate();
  // Signup Form State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState('admin');
  const [signupConsent, setSignupConsent] = useState(false);
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
    if (!signupConsent) {
      setSignupMsg({ type: 'error', text: 'Please agree to the Privacy Policy before submitting this application.' });
      return;
    }
    setSignupLoading(true);
    try {
      await api.adminSignup({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        requestedRole: roleToBackend(signupRole),
        consent: true,
      });
      setSignupMsg({ type: 'success', text: 'Application submitted for director approval.' });
      setShowSignupModal(false);
      markConversionPending('application');
      navigate('/thank-you?type=application', { replace: true });
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
      <Modal isOpen={showSignupModal} onClose={() => setShowSignupModal(false)} title="Apply for Staff Access">
        <form onSubmit={handleSignupSubmit} className="space-y-4">
          {signupMsg && (
            <div className={`p-3 rounded-xl text-xs font-semibold ${signupMsg.type === 'success' ? 'bg-brand-50 text-[var(--brand-ink)]' : 'bg-rose-50 text-rose-600'}`}>
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
              className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-[#BFA476] outline-none"
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
              className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-[#BFA476] outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-[#BFA476] outline-none"
              placeholder="Min 8 characters, letter + number"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Assigned Role</label>
            <select
              value={signupRole}
              onChange={(e: any) => setSignupRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold focus:ring-2 focus:ring-[#BFA476] outline-none"
            >
              <option value="admin">Admin (Bookings, Services, Settings)</option>
              <option value="manager">Manager (Bookings, Reports)</option>
              <option value="receptionist">Receptionist (Bookings, Contacts)</option>
            </select>
          </div>
          <label htmlFor="admin-signup-consent" className="flex items-start gap-2 text-[11px] leading-relaxed text-gray-600">
            <input
              id="admin-signup-consent"
              type="checkbox"
              required
              checked={signupConsent}
              onChange={(event) => setSignupConsent(event.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#BFA476]"
            />
            <span>
              I agree to the{' '}
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[var(--brand-ink)] underline underline-offset-2"
              >
                Privacy Policy
              </a>{' '}
              and to the review of this staff application.
            </span>
          </label>
          <button
            type="submit"
            disabled={signupLoading || !signupConsent}
            className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-500 text-brand-950 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {signupLoading ? 'Submitting Application...' : 'Submit Staff Application'}
          </button>
        </form>
      </Modal>

      {/* Forgot Password Modal */}
      <Modal isOpen={showForgotModal} onClose={() => setShowForgotModal(false)} title="Reset Password Request">
        <form onSubmit={handleForgotSubmit} className="space-y-4">
          <p className="text-xs text-gray-600">Enter your administrator email to receive password recovery instructions.</p>
          {forgotMsg && (
            <div className={`p-3 rounded-xl text-xs font-semibold ${forgotMsg.type === 'success' ? 'bg-brand-50 text-[var(--brand-ink)]' : 'bg-rose-50 text-rose-600'}`}>
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
              className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-[#BFA476] outline-none"
              placeholder="you@example.com"
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
            <div className={`p-3 rounded-xl text-xs font-semibold ${changeMsg.type === 'success' ? 'bg-brand-50 text-[var(--brand-ink)]' : 'bg-rose-50 text-rose-600'}`}>
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
              className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-[#BFA476] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 8 characters, letter + number"
              className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-[#BFA476] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-[#BFA476] outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={changeLoading}
            className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-500 text-brand-950 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {changeLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </Modal>
    </>
  );
};
