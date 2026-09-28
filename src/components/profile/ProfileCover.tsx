import React, { useState } from 'react';
import { Camera, Check, Link2, Loader2, Mail, Phone, Trash2, X } from 'lucide-react';
import { AdminUser } from '../../types';
import { formatRole, getInitials } from './useProfileForm';
import type { ProfileTone } from './profileTheme';
import { bodyText, strongText } from './profileTheme';

interface ProfileCoverProps {
  user: AdminUser;
  active: boolean;
  uploading: boolean;
  tone?: ProfileTone;
  avatarUrlInput: string;
  onAvatarUrlInputChange: (v: string) => void;
  savingUrl: boolean;
  onSaveAvatarUrl: () => void;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAvatar: () => void;
}

const rolePill: Record<string, string> = {
  super_admin: 'border-amber-300/40 bg-amber-400/15 text-amber-200',
  admin: 'border-[#2CB5A0]/40 bg-[#2CB5A0]/15 text-[#6FD3C4]',
  manager: 'border-sky-300/40 bg-sky-400/15 text-sky-200',
  receptionist: 'border-violet-300/40 bg-violet-400/15 text-violet-200',
};

const rolePillLight: Record<string, string> = {
  super_admin: 'border-amber-200 bg-amber-100 text-amber-800',
  admin: 'border-teal-200 bg-teal-100 text-teal-800',
  manager: 'border-sky-200 bg-sky-100 text-sky-800',
  receptionist: 'border-violet-200 bg-violet-100 text-violet-800',
};

/**
 * Sanctuary-style cover header: layered dark gradient banner with gold/teal
 * glow blobs, overlapping avatar with status dot, serif identity block and
 * photo actions. Stacks centered on mobile, row-aligned from sm up.
 */
export const ProfileCover: React.FC<ProfileCoverProps> = ({
  user,
  active,
  uploading,
  tone = 'light',
  avatarUrlInput,
  onAvatarUrlInputChange,
  savingUrl,
  onSaveAvatarUrl,
  fileRef,
  onAvatarChange,
  onRemoveAvatar,
}) => {
  const dark = tone === 'dark';
  const [showUrlForm, setShowUrlForm] = useState(false);
  const [previewOk, setPreviewOk] = useState(true);
  const previewUrl = avatarUrlInput.trim();
  const showPreview = /^https:\/\//i.test(previewUrl) && previewOk;
  const pill = dark
    ? rolePill[user.role] || 'border-white/20 bg-white/10 text-gray-200'
    : rolePillLight[user.role] || 'border-gray-200 bg-gray-100 text-gray-700';

  return (
    <section
      aria-label="Profile header"
      className={
        dark
          ? 'overflow-hidden rounded-2xl border border-white/10 bg-[#161a23]/90 shadow-xl shadow-black/30'
          : 'overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm'
      }
    >
      <div aria-hidden className="relative h-28 overflow-hidden sm:h-36">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1113] via-[#122823] to-[#0F2A26]" />
        <div className="absolute -left-10 -top-16 h-48 w-48 rounded-full bg-[#2CB5A0]/25 blur-3xl" />
        <div className="absolute -right-8 -bottom-20 h-56 w-56 rounded-full bg-[#C7A36A]/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <div className="px-4 pb-5 sm:px-6">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:gap-5 sm:text-left">
          <div className="relative -mt-10 shrink-0 sm:-mt-12">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={`${user.name || 'Staff member'} profile photo`}
                className="h-20 w-20 rounded-full bg-white/10 object-cover p-1 ring-2 ring-[#C7A36A] sm:h-24 sm:w-24"
              />
            ) : (
              <div
                aria-hidden
                className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#2CB5A0]/30 to-[#C7A36A]/30 p-1 ring-2 ring-[#C7A36A] sm:h-24 sm:w-24"
              >
                <span className="font-serif text-2xl font-bold text-[#e8d5a8]">
                  {getInitials(user.name)}
                </span>
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
              <h2
                className={`truncate font-serif text-xl font-bold sm:text-2xl ${strongText(tone)}`}
              >
                {user.name || 'Staff Member'}
              </h2>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold capitalize backdrop-blur ${pill}`}
              >
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
                {formatRole(user.role)}
              </span>
            </div>
            <div
              className={`mt-1.5 flex flex-col items-center gap-1 text-xs sm:flex-row sm:flex-wrap sm:gap-x-4 ${bodyText(tone)}`}
            >
              {user.email ? (
                <span className="inline-flex min-w-0 items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 shrink-0 opacity-60" />
                  <span className="truncate">{user.email}</span>
                </span>
              ) : null}
              {user.phone ? (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 shrink-0 opacity-60" />
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
              className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#2CB5A0] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#2CB5A0]/25 transition-colors hover:bg-[#259b89] disabled:opacity-50 sm:flex-none"
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
                className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl px-3 py-2.5 text-xs font-bold transition-colors disabled:opacity-50 ${
                  dark
                    ? 'bg-white/5 text-rose-300 hover:bg-rose-500/20'
                    : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                }`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={onAvatarChange} />

      <div className={`px-4 pb-5 sm:px-6 ${dark ? 'border-white/10' : 'border-gray-100'} border-t`}>
        <button
          type="button"
          aria-expanded={showUrlForm}
          onClick={() => setShowUrlForm((v) => !v)}
          className={`mt-3 inline-flex min-h-[36px] items-center gap-1.5 text-xs font-bold transition-colors ${
            dark ? 'text-[#6FD3C4] hover:text-white' : 'text-[#158c7c] hover:text-[#0f6b5e]'
          }`}
        >
          <Link2 className="h-3.5 w-3.5" />
          {showUrlForm ? 'Hide image link' : 'Use image link instead'}
        </button>

        {showUrlForm ? (
          <div className="mt-2 flex flex-col gap-2">
            <div className="flex flex-col gap-2 sm:flex-row">
              <label htmlFor="pf-avatar-url" className="sr-only">
                Profile picture image URL
              </label>
              <input
                id="pf-avatar-url"
                type="url"
                inputMode="url"
                autoComplete="url"
                placeholder="https://example.com/photo.jpg"
                value={avatarUrlInput}
                onChange={(e) => {
                  onAvatarUrlInputChange(e.target.value);
                  setPreviewOk(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onSaveAvatarUrl();
                  }
                }}
                className={`min-h-[44px] flex-1 rounded-xl border p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#2CB5A0] ${
                  dark
                    ? 'border-white/10 bg-black/40 text-white placeholder:text-gray-500 focus:border-[#2CB5A0]'
                    : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#2CB5A0]'
                }`}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onSaveAvatarUrl}
                  disabled={savingUrl || !previewUrl}
                  className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-[#2CB5A0] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#259b89] disabled:opacity-50"
                >
                  {savingUrl ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  {savingUrl ? 'Saving…' : 'Save'}
                </button>
                <button
                  type="button"
                  aria-label="Clear image link"
                  onClick={() => {
                    onAvatarUrlInputChange('');
                    setPreviewOk(true);
                  }}
                  className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl transition-colors ${
                    dark ? 'bg-white/5 text-gray-300 hover:bg-white/10' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {showPreview ? (
                <img
                  src={previewUrl}
                  alt="Image link preview"
                  onError={() => setPreviewOk(false)}
                  className="h-12 w-12 rounded-full object-cover ring-1 ring-[#C7A36A]"
                />
              ) : null}
              <p className={`text-[11px] ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                {previewUrl && !previewOk
                  ? 'That link could not be loaded as an image.'
                  : 'Paste an https link ending in .jpg, .png, .webp or .gif.'}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default ProfileCover;
