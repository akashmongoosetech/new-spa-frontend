import React from 'react';
import { Clock, LogIn, Shield } from 'lucide-react';
import { AdminUser } from '../../types';
import { formatProfileDate, formatRole } from './useProfileForm';

interface AccountCardProps {
  user: AdminUser;
  active: boolean;
}

/** Read-only account summary for the left rail. */
export const AccountCard: React.FC<AccountCardProps> = ({ user, active }) => {
  const rows: { label: React.ReactNode; value: React.ReactNode }[] = [
    {
      label: 'Status',
      value: (
        <span className={`font-bold ${active ? 'text-emerald-600' : 'text-rose-600'}`}>
          {active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      label: 'Role',
      value: <span className="font-bold capitalize text-gray-800">{formatRole(user.role)}</span>,
    },
    {
      label: (
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-gray-400" /> Member since
        </span>
      ),
      value: <span className="font-semibold text-gray-700">{formatProfileDate(user.createdAt)}</span>,
    },
    {
      label: (
        <span className="inline-flex items-center gap-1.5">
          <LogIn className="h-3.5 w-3.5 text-gray-400" /> Last login
        </span>
      ),
      value: <span className="font-semibold text-gray-700">{formatProfileDate(user.lastLogin)}</span>,
    },
  ];

  return (
    <section
      aria-label="Account summary"
      className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <h3 className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500">
        <Shield className="h-4 w-4 text-[#2CB5A0]" /> Account
      </h3>
      <dl className="space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center justify-between gap-3 text-sm">
            <dt className="shrink-0 text-gray-500">{row.label}</dt>
            <dd className="min-w-0 text-right">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default AccountCard;
