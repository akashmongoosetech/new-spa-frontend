import React from 'react';
import { Award, Clock, LogIn, Shield } from 'lucide-react';
import { AdminUser } from '../../types';
import { formatProfileDate, formatRole } from './useProfileForm';
import type { ProfileTone } from './profileTheme';
import { bodyText, cardClass, mutedText, sectionTitleClass } from './profileTheme';

interface AccountCardProps {
  user: AdminUser;
  active: boolean;
  tone?: ProfileTone;
}

/** Read-only account summary for the left rail. */
export const AccountCard: React.FC<AccountCardProps> = ({ user, active, tone = 'light' }) => {
  const dark = tone === 'dark';
  const rows: { label: React.ReactNode; value: React.ReactNode }[] = [
    {
      label: 'Status',
      value: (
        <span
          className={`inline-flex items-center gap-1.5 font-bold ${
            active ? 'text-emerald-500' : 'text-rose-500'
          }`}
        >
          <span aria-hidden className={`h-2 w-2 rounded-full ${active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          {active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      label: (
        <span className="inline-flex items-center gap-1.5">
          <Award className={`h-3.5 w-3.5 ${dark ? 'text-[#C7A36A]' : 'text-gray-400'}`} /> Role
        </span>
      ),
      value: (
        <span className={`font-bold capitalize ${dark ? 'text-[#e8d5a8]' : 'text-gray-800'}`}>
          {formatRole(user.role)}
        </span>
      ),
    },
    {
      label: (
        <span className="inline-flex items-center gap-1.5">
          <Clock className={`h-3.5 w-3.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`} /> Member since
        </span>
      ),
      value: (
        <span className={`font-semibold ${bodyText(tone)}`}>{formatProfileDate(user.createdAt)}</span>
      ),
    },
    {
      label: (
        <span className="inline-flex items-center gap-1.5">
          <LogIn className={`h-3.5 w-3.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`} /> Last login
        </span>
      ),
      value: (
        <span className={`font-semibold ${bodyText(tone)}`}>{formatProfileDate(user.lastLogin)}</span>
      ),
    },
  ];

  return (
    <section aria-label="Account summary" className={`${cardClass(tone)} space-y-3 p-5 sm:p-6`}>
      <h3 className={sectionTitleClass(tone)}>
        <Shield className={`h-4 w-4 ${dark ? 'text-[#C7A36A]' : 'text-[#2CB5A0]'}`} /> Account
      </h3>
      <dl className="space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center justify-between gap-3 text-sm">
            <dt className={`shrink-0 ${mutedText(tone)}`}>{row.label}</dt>
            <dd className="min-w-0 text-right">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default AccountCard;
