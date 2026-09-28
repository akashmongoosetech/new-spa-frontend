import React from 'react';
import { Camera, Loader2, Mail, Phone, Trash2 } from 'lucide-react';
import { AdminUser } from '../../types';
import { formatRole, getInitials } from './useProfileForm';

interface ProfileCoverProps {
  user: AdminUser;
  active: boolean;
  uploading: boolean;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAvatar: () => void;
}

const rolePill: Record<string, string> = {
  super_admin: 'bg-amber-100 text-amber-800 border-amber-200',
  admin: 'bg-teal-100 text-teal-800 border-teal-200',
  manager: 'bg-sky-100 text-sky-800 border-sky-200',
  receptionist: 'bg-violet-100 text-violet-800 border-violet-200',
};

/**
 * Gradient cover header with overlapping avatar, identity facts and
 * photo actions. Stacks centered on mobile, row-aligned from sm up.
 */
export const ProfileCover: React.FC<ProfileCoverProps> = ({
  user,
  active,
  uploading,
  fileRef,
  onAvatarChange,
  onRemoveAvatar,
}) => {
  const pill = rolePill[user.role] || 'bg-gray-100 text-gray-700 border-gray-200';

  return (
    <section
      aria-label="Profile header"
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      <div
        aria-hidden
        className="h-24 bg-gradient-to-r from-[#0F2A26] via-[#158c7c] to-[#2CB5A0] sm:h-32"
      />
      <div className="px-4 pb-5 sm:px-6">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:gap-5 sm:text-left">
          <div className="relative -mt-10 shrink-0 sm:-mt-12">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={`${user.name || 'Staff member'} profile photo`}
                className="h-20 w-20 rounded-full bg-white object-cover p-1 ring-2 ring-[#2CB5A0] sm:h-24 sm:w-24"
              />
            ) : (
              <div
                aria-hidden
                className="flex h-20 w-20 items-center justify-center rounded-full bg-[#2CB5A0]/15 p-1 ring-2 ring-[#2CB5A0] sm:h-24 sm:w-24"
              >
                <span className="text-2xl font-bold text-[#158c7c]">{getInitials(user.name)}</span>
              </div>
            )}
            <span
              aria-label={active ? 'Account active' : 'Account inactive'}
              title={active ? 'Active' : 'Inactive'}
              className={`absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white ${
                active ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
          </div>

          <div className="min-w-0 flex-1 sm:pb-1">
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:items-center">
              <h2 className="truncate text-lg font-bold text-gray-900 sm:text-xl">
                {user.name || 'Staff Member'}
              </h2>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold capitalize ${pill}`}
              >
                {formatRole(user.role)}
              </span>
            </div>
            <div className="mt-1.5 flex flex-col items-center gap-1 text-xs text-gray-500 sm:flex-row sm:flex-wrap sm:gap-x-4">
              {user.email ? (
                <span className="inline-flex min-w-0 items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                  <span className="truncate">{user.email}</span>
                </span>
              ) : null}
              {user.phone ? (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                  <span>{user.phone}</span>
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex w-full items-center gap-2 sm:w-auto sm:pb-1">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#2CB5A0] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#259b89] disabled:opacity-50 sm:flex-none"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
              {uploading ? 'Uploading…' : 'Upload Photo'}
            </button>
            {user.avatarUrl ? (
              <button
                type="button"
                onClick={onRemoveAvatar}
                disabled={uploading}
                aria-label="Remove profile photo"
                title="Remove photo"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-rose-50 px-3 py-2.5 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-100 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={onAvatarChange} />
    </section>
  );
};

export default ProfileCover;
