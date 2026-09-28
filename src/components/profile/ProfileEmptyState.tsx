import React from 'react';
import { UserRoundX } from 'lucide-react';

/** Shimmer shown while the profile resolves; signed-out fallback otherwise. */
export const ProfileEmptyState: React.FC<{ loading: boolean }> = ({ loading }) => {
  if (loading) {
    return (
      <div className="max-w-5xl space-y-6" aria-label="Loading profile" aria-busy="true">
        <div className="h-44 animate-pulse rounded-2xl bg-gray-200/70 sm:h-52" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <div className="h-56 animate-pulse rounded-2xl bg-gray-200/70" />
          <div className="space-y-6">
            <div className="h-64 animate-pulse rounded-2xl bg-gray-200/70" />
            <div className="h-64 animate-pulse rounded-2xl bg-gray-200/70" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <UserRoundX className="h-6 w-6 text-gray-400" />
      </span>
      <h2 className="text-base font-bold text-gray-900">Unable to load your profile</h2>
      <p className="text-sm text-gray-500">Your session may have expired. Please sign in again.</p>
    </div>
  );
};

export default ProfileEmptyState;
