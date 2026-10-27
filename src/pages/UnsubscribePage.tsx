import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MailX, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';

type Status = 'idle' | 'sending' | 'done' | 'error';

export const UnsubscribePage: React.FC = () => {
  const [params] = useSearchParams();
  const email = (params.get('email') || '').trim();
  const token = (params.get('token') || '').trim();
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const validLink = Boolean(email && token);

  const handleUnsubscribe = async () => {
    if (!validLink || status === 'sending') return;
    setStatus('sending');
    setMessage('');
    try {
      await api.unsubscribeNewsletter(email, token);
      setStatus('done');
    } catch (err: any) {
      setStatus('error');
      setMessage(err?.message || 'We could not process this unsubscribe request.');
    }
  };

  return (
    <div className="min-h-[70vh] bg-[#FAFAFA] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-xl text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-[var(--brand-ink)]">
          {status === 'done' ? <CheckCircle2 className="h-7 w-7" /> : status === 'error' ? <AlertCircle className="h-7 w-7 text-rose-500" /> : <MailX className="h-7 w-7" />}
        </div>

        <h1 className="font-serif text-2xl font-bold text-gray-900">Newsletter preferences</h1>

        {!validLink && (
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            This unsubscribe link is incomplete. Please use the link from the footer of a Tripod Wellness email.
          </p>
        )}

        {validLink && status !== 'done' && (
          <>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Stop receiving newsletter emails at <strong className="text-gray-900">{email}</strong>?
            </p>
            <button
              type="button"
              onClick={handleUnsubscribe}
              disabled={status === 'sending'}
              className="mt-6 w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-bold text-brand-950 shadow-sm transition-colors hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === 'sending' ? 'Unsubscribing…' : 'Unsubscribe'}
            </button>
          </>
        )}

        {status === 'done' && (
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            You have been unsubscribed. You will no longer receive newsletter emails at{' '}
            <strong className="text-gray-900">{email}</strong>.
          </p>
        )}

        {status === 'error' && (
          <p className="mt-3 text-sm leading-relaxed text-rose-700">{message}</p>
        )}

        <Link to="/" className="mt-7 inline-flex items-center gap-2 text-xs font-semibold text-[var(--brand-ink)] hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Tripod Wellness
        </Link>
      </div>
    </div>
  );
};

export default UnsubscribePage;
