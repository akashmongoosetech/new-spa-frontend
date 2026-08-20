import React, { useEffect, useState } from 'react';
import { Mail, RefreshCw } from 'lucide-react';
import { EmailLog } from '../../types';
import { api } from '../../services/api';

const TYPE_LABELS: Record<string, string> = {
  booking_confirmation: 'Booking Confirmation',
  booking_status_update: 'Booking Status Update',
  booking_reminder: 'Booking Reminder',
  contact_thankyou: 'Contact Thank You',
  newsletter_welcome: 'Newsletter Welcome',
};

export const AdminEmailLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<EmailLog | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const l = await api.getEmailLogs();
      if (Array.isArray(l)) setLogs(l);
    } catch (err) {
      // keep empty state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Email Dispatch Log</h1>
          <p className="text-xs text-gray-500 mt-1">Audit trail of automated notifications sent to clients</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="px-4 py-2.5 bg-[#1A1A1A] hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-[#2CB5A0] ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Loading...' : 'Refresh Log'}
        </button>
      </div>

      {logs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-sm text-gray-400 flex flex-col items-center gap-2">
          <Mail className="w-8 h-8 text-gray-300" />
          <span>No emails dispatched yet.</span>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider border-b">
                <tr>
                  <th className="p-4">Recipient</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Sent At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50/80 transition-colors cursor-pointer" onClick={() => setSelected(l)}>
                    <td className="p-4 font-bold text-gray-900">{l.to}</td>
                    <td className="p-4 text-gray-600">{l.subject}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#2CB5A0]/10 text-[#2CB5A0]">
                        {TYPE_LABELS[l.type] || l.type}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{l.sentAt ? new Date(l.sentAt).toLocaleString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900">{selected.subject}</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  To: {selected.to} &bull; {TYPE_LABELS[selected.type] || selected.type} &bull; {selected.sentAt ? new Date(selected.sentAt).toLocaleString() : ''}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold cursor-pointer hover:bg-gray-200"
              >
                Close
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <iframe
                title="Email preview"
                srcDoc={selected.htmlContent || '<p style="font-family:sans-serif;color:#333">No HTML preview available.</p>'}
                className="w-full h-full min-h-75 border border-gray-200 rounded-xl"
                sandbox=""
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEmailLogsPage;