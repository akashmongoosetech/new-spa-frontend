import React from 'react';
import { UserRoundX } from 'lucide-react';
import type { ProfileTone } from './profileTheme';

/** Shimmer shown while the profile resolves; signed-out fallback otherwise. */
export const ProfileEmptyState: React.FC<{ loading: boolean; tone?: ProfileTone }> = ({
  loading,
  tone = 'light',
}) => {
  const dark = tone === 'dark';

  if (loading) {
    const pulse = dark ? 'bg-white/10' : 'bg-gray-200/70';
    return (
      <div className="max-w-5xl space-y-6" aria-label="Loading profile" aria-busy="true">
        <div className={`h-44 animate-pulse rounded-2xl sm:h-52 ${pulse}`} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <div className={`h-56 animate-pulse rounded-2xl ${pulse}`} />
          <div className="space-y-6">
            <div className={`h-64 animate-pulse rounded-2xl ${pulse}`} />
            <div className={`h-64 animate-pulse rounded-2xl ${pulse}`} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border p-8 text-center shadow-sm ${
        dark ? 'border-white/10 bg-[#161a23]/90' : 'border-gray-200 bg-white'
      }`}
    >
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-full ${
          dark ? 'bg-white/5' : 'bg-gray-100'
        }`}
      >
        <UserRoundX className={`h-6 w-6 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
      </span>
      <h2 className={`text-base font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
        Unable to load your profile
      </h2>
      <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
        Your session may have expired. Please sign in again.
      </p>
    </div>
  );
};

export default ProfileEmptyState;
