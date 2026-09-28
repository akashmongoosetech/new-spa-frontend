import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Loader2, Save } from 'lucide-react';
import { AdminUser, BusinessSettings } from '../../types';
import {
  AccountCard,
  ContactFormCard,
  PersonalFormCard,
  ProfileCover,
  ProfileEmptyState,
  useProfileForm,
} from '../../components/profile';

interface ProfileContext {
  currentUser?: AdminUser | null;
  onUpdateCurrentUser?: (u: AdminUser) => void;
  settings?: BusinessSettings;
  searchQuery?: string;
}

export const AdminProfilePage: React.FC = () => {
  const context = useOutletContext<ProfileContext>() || {};
  const form = useProfileForm(context);
  const { user, loading, active, saving, uploading, fileRef } = form;

  if (!user) {
    return <ProfileEmptyState loading={loading} />;
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-xl font-serif font-bold text-gray-900 sm:text-2xl">My Profile</h1>
        <p className="mt-1 text-xs text-gray-500">
          Manage your personal details, contact information and profile picture
        </p>
      </div>

      <ProfileCover
        user={user}
        active={active}
        uploading={uploading}
        tone="light"
        avatarUrlInput={form.avatarUrlInput}
        onAvatarUrlInputChange={form.setAvatarUrlInput}
        savingUrl={form.savingUrl}
        onSaveAvatarUrl={form.handleSaveAvatarUrl}
        fileRef={fileRef}
        onAvatarChange={form.handleAvatarChange}
        onRemoveAvatar={form.handleRemoveAvatar}
      />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-6">
          <AccountCard user={user} active={active} />
        </aside>

        <form onSubmit={form.handleSave} className="min-w-0 space-y-6">
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
      </div>
    </div>
  );
};

export default AdminProfilePage;
