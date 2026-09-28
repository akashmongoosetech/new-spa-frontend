import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Key, Loader2, Lock, LogOut, Save, Sparkles, X } from 'lucide-react';
import { AdminUser } from '../types';
import { api } from '../services/api';
import { showToast } from '../utils/toastEvents';
import {
  AccountCard,
  ContactFormCard,
  PersonalFormCard,
  ProfileCover,
  ProfileEmptyState,
  useProfileForm,
} from '../components/profile';
import { cardClass, inputClassFor, sectionTitleClass } from '../components/profile/profileTheme';

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
  // Inside the light admin modal keep the light tone, otherwise match the
  // dark sanctuary auth layout.
  const tone = modalMode ? 'light' : 'dark';
  const dark = tone === 'dark';
  const form = useProfileForm(context);
  const { user, loading, active, saving, uploading, fileRef } = form;

  // Change-password card state (previously rendered but never submitted).
  const [pwCurrent, setPwCurrent] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  if (!user) {
    return <ProfileEmptyState loading={loading} tone={tone} />;
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
    <div className="w-full space-y-6">
      {modalMode ? (
        <div
          className={`flex items-center justify-between border-b pb-4 ${
            dark ? 'border-white/10' : 'border-gray-200'
          }`}
        >
          <h1 className="font-serif text-xl font-bold sm:text-2xl">My Profile</h1>
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
        <div className="space-y-3 text-center sm:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#2CB5A0]/35 bg-[#1C2628]/80 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#6FD3C4]">
            <Sparkles className="h-3.5 w-3.5 text-[#C7A36A]" />
            Sanctuary Console
          </span>
          <h1 className="font-serif text-3xl font-bold text-white sm:text-4xl">
            My <span className="text-gold-gradient">Profile</span>
          </h1>
          <p className="text-xs text-gray-400">
            Manage your personal details, contact information and profile picture
          </p>
        </div>
      )}

      <ProfileCover
        user={user}
        active={active}
        uploading={uploading}
        tone={tone}
        fileRef={fileRef}
        onAvatarChange={form.handleAvatarChange}
        onRemoveAvatar={form.handleRemoveAvatar}
      />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="space-y-6 lg:sticky lg:top-6">
          <AccountCard user={user} active={active} tone={tone} />
          {!modalMode ? (
            <button
              type="button"
              onClick={handleLogout}
              className={`inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-bold shadow-sm transition-colors ${
                dark
                  ? 'border-white/10 bg-white/[0.04] text-gray-300 hover:border-rose-400/40 hover:text-rose-300'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-rose-600'
              }`}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          ) : null}
        </aside>

        <div className="min-w-0 space-y-6">
          <form onSubmit={form.handleSave} className="space-y-6">
            <PersonalFormCard form={form} tone={tone} />
            <ContactFormCard form={form} tone={tone} />

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

          <section aria-label="Change password" className={`${cardClass(tone)} space-y-4 p-5 sm:p-6`}>
            <h3 className={sectionTitleClass(tone)}>
              <Key className={`h-4 w-4 ${dark ? 'text-[#C7A36A]' : 'text-[#2CB5A0]'}`} />
              Change Password
            </h3>
            <form onSubmit={handleChangePassword}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="pf-pw-current"
                    className="mb-1.5 flex items-center gap-1 text-xs font-bold uppercase text-gray-400"
                  >
                    <Lock className="h-3.5 w-3.5 opacity-60" />
                    <span>Current Password</span>
                  </label>
                  <input
                    id="pf-pw-current"
                    type="password"
                    autoComplete="current-password"
                    value={pwCurrent}
                    onChange={(e) => setPwCurrent(e.target.value)}
                    placeholder="Enter your current password"
                    className={inputClassFor(tone)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="pf-pw-new"
                    className="mb-1.5 block text-xs font-bold uppercase text-gray-400"
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
                    className={inputClassFor(tone)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="pf-pw-confirm"
                    className="mb-1.5 block text-xs font-bold uppercase text-gray-400"
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
                    className={inputClassFor(tone)}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-stretch sm:justify-end">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className={`inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border px-6 py-3 text-xs font-bold shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto ${
                    dark
                      ? 'border-white/10 bg-white/[0.04] text-gray-200 hover:border-[#2CB5A0]/50 hover:text-[#6FD3C4]'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-[#2CB5A0] hover:text-[#158c7c]'
                  }`}
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
