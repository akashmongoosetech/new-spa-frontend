import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Key, Loader2, Lock, LogOut, Save, X } from 'lucide-react';
import { AdminUser } from '../types';
import { api } from '../services/api';
import { showToast } from '../utils/toastEvents';
import {
  AccountCard,
  ContactFormCard,
  PersonalFormCard,
  ProfileCover,
  ProfileEmptyState,
  inputClass,
  useProfileForm,
} from '../components/profile';

interface ProfileModalProps {
  modalMode?: boolean;
  onClose?: () => void;
}

interface ProfileContext {
  currentUser?: AdminUser | null;
  onUpdateCurrentUser?: (u: AdminUser) => void;
  settings?: unknown;
  searchQuery?: string;
}

export const ProfilePage: React.FC<ProfileModalProps> = ({ modalMode = false, onClose }) => {
  const context = useOutletContext<ProfileContext>() || {};
  const navigate = useNavigate();
  const form = useProfileForm(context);
  const { user, loading, active, saving, uploading, fileRef } = form;

  // Change-password card state (previously rendered but never submitted).
  const [pwCurrent, setPwCurrent] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  if (!user) {
    return <ProfileEmptyState loading={loading} />;
  }

  const validatePassword = (): string | null => {
    if (!pwCurrent) return 'Current password is required.';
    if (pwNew.length < 8 || !/[a-zA-Z]/.test(pwNew) || !/\d/.test(pwNew)) {
      return 'New password must be at least 8 characters with a letter and a number.';
    }
    if (pwNew !== pwConfirm) return 'New passwords do not match.';
    if (pwCurrent === pwNew) return 'New password must be different from the current one.';
    return null;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validatePassword();
    if (err) {
      showToast({ type: 'error', title: 'Check the form', message: err });
      return;
    }
    setChangingPassword(true);
    try {
      await api.changePassword(pwCurrent, pwNew, pwConfirm);
      showToast({
        type: 'success',
        title: 'Password changed',
        message: 'Please sign in again with your new password.',
      });
      localStorage.removeItem('aura_admin_token');
      localStorage.removeItem('aura_admin_user');
      navigate('/admin-login');
    } catch (err: unknown) {
      showToast({
        type: 'error',
        title: 'Password change failed',
        message: err instanceof Error ? err.message : 'Could not change your password.',
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('aura_admin_token');
    localStorage.removeItem('aura_admin_user');
    navigate('/admin-login');
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {modalMode ? (
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <h1 className="text-xl font-serif font-bold text-gray-900 sm:text-2xl">My Profile</h1>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close profile"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div>
          <h1 className="text-xl font-serif font-bold text-gray-900 sm:text-2xl">My Profile</h1>
          <p className="mt-1 text-xs text-gray-500">
            Manage your personal details, contact information and profile picture
          </p>
        </div>
      )}

      <ProfileCover
        user={user}
        active={active}
        uploading={uploading}
        fileRef={fileRef}
        onAvatarChange={form.handleAvatarChange}
        onRemoveAvatar={form.handleRemoveAvatar}
      />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-6 lg:sticky lg:top-6">
          <AccountCard user={user} active={active} />
          {!modalMode ? (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-rose-600"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          ) : null}
        </aside>

        <div className="min-w-0 space-y-6">
          <form onSubmit={form.handleSave} className="space-y-6">
            <PersonalFormCard form={form} />
            <ContactFormCard form={form} />

            {/* Sticky floating save bar on mobile, inline on desktop */}
            <div className="sticky bottom-3 z-10 flex justify-stretch sm:static sm:justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#2CB5A0] px-6 py-3 text-xs font-bold text-white shadow-lg shadow-[#2CB5A0]/25 transition-colors hover:bg-[#259b89] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:shadow-sm"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>

          <section
            aria-label="Change password"
            className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500">
              <Key className="h-4 w-4 text-[#2CB5A0]" /> Change Password
            </h3>
            <form onSubmit={handleChangePassword}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="pf-pw-current"
                    className="mb-1.5 flex items-center gap-1 text-xs font-bold uppercase text-gray-700"
                  >
                    <Lock className="h-3.5 w-3.5 text-gray-400" />
                    <span>Current Password</span>
                  </label>
                  <input
                    id="pf-pw-current"
                    type="password"
                    autoComplete="current-password"
                    value={pwCurrent}
                    onChange={(e) => setPwCurrent(e.target.value)}
                    placeholder="Enter your current password"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="pf-pw-new"
                    className="mb-1.5 block text-xs font-bold uppercase text-gray-700"
                  >
                    New Password
                  </label>
                  <input
                    id="pf-pw-new"
                    type="password"
                    autoComplete="new-password"
                    value={pwNew}
                    onChange={(e) => setPwNew(e.target.value)}
                    placeholder="Min 8 chars, letter + number"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="pf-pw-confirm"
                    className="mb-1.5 block text-xs font-bold uppercase text-gray-700"
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="pf-pw-confirm"
                    type="password"
                    autoComplete="new-password"
                    value={pwConfirm}
                    onChange={(e) => setPwConfirm(e.target.value)}
                    placeholder="Repeat new password"
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-stretch sm:justify-end">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-xs font-bold text-gray-700 shadow-sm transition-colors hover:border-[#2CB5A0] hover:text-[#158c7c] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {changingPassword ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Key className="h-4 w-4" />
                  )}
                  {changingPassword ? 'Updating…' : 'Update Password'}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
