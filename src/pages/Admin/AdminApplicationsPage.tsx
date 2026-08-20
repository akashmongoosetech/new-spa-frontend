import React, { useEffect, useState } from 'react';
import { RefreshCw, UserPlus, CheckCircle2, XCircle, Trash2, Inbox } from 'lucide-react';
import { StaffApplication } from '../../types';
import { api } from '../../services/api';
import { showToast } from '../../utils/toastEvents';

type Filter = 'all' | 'pending' | 'approved' | 'rejected';

const STATUS_META: Record<StaffApplication['status'], { label: string; cls: string }> = {
  pending: { label: 'Pending', cls: 'bg-amber-50 text-amber-700' },
  approved: { label: 'Approved', cls: 'bg-emerald-50 text-emerald-700' },
  rejected: { label: 'Rejected', cls: 'bg-rose-50 text-rose-600' },
};

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
];

export const AdminApplicationsPage: React.FC = () => {
  const [apps, setApps] = useState<StaffApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [busyId, setBusyId] = useState<string | null>(null);

  const [approveTarget, setApproveTarget] = useState<StaffApplication | null>(null);
  const [rejectTarget, setRejectTarget] = useState<StaffApplication | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<StaffApplication | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const list = await api.getStaffApplications();
      setApps(list);
    } catch (err) {
      setApps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const visible = filter === 'all' ? apps : apps.filter((a) => a.status === filter);

  const handleApprove = async () => {
    if (!approveTarget) return;
    setBusyId(approveTarget.id);
    try {
      await api.approveStaffApplication(approveTarget.id);
      showToast({ type: 'success', title: 'Application approved', message: `${approveTarget.name} can now sign in.` });
      setApproveTarget(null);
      await load();
    } catch (err: any) {
      showToast({ type: 'error', title: 'Approval failed', message: err?.message || 'Could not approve application.' });
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    setBusyId(rejectTarget.id);
    try {
      await api.rejectStaffApplication(rejectTarget.id, rejectReason);
      showToast({ type: 'info', title: 'Application rejected', message: `${rejectTarget.name} has been notified.` });
      setRejectTarget(null);
      setRejectReason('');
      await load();
    } catch (err: any) {
      showToast({ type: 'error', title: 'Rejection failed', message: err?.message || 'Could not reject application.' });
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setBusyId(deleteTarget.id);
    try {
      await api.deleteStaffApplication(deleteTarget.id);
      showToast({ type: 'info', title: 'Application removed', message: 'Entry deleted.' });
      setDeleteTarget(null);
      await load();
    } catch (err: any) {
      showToast({ type: 'error', title: 'Delete failed', message: err?.message || 'Could not delete application.' });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Staff Applications</h1>
          <p className="text-xs text-gray-500 mt-1">Review and authorize staff portal access requests</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="px-4 py-2.5 bg-[#1A1A1A] hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-[#2CB5A0] ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div className="flex items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              filter === f.id ? 'bg-[#1A1A1A] text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-400'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-sm text-gray-400 flex flex-col items-center gap-2">
          <Inbox className="w-8 h-8 text-gray-300" />
          <span>No applications in this view.</span>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider border-b">
                <tr>
                  <th className="p-4">Applicant</th>
                  <th className="p-4">Requested Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Submitted</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visible.map((a) => {
                  const meta = STATUS_META[a.status] || STATUS_META.pending;
                  const busy = busyId === a.id;
                  return (
                    <tr key={a.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-gray-900">{a.name}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{a.email}</p>
                        {a.reviewNote && (
                          <p className="text-[11px] text-gray-500 mt-1 italic">Note: {a.reviewNote}</p>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#2CB5A0]/10 text-[#2CB5A0]">
                          {a.requestedRole}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${meta.cls}`}>{meta.label}</span>
                      </td>
                      <td className="p-4 text-gray-600">{a.createdAt ? new Date(a.createdAt).toLocaleString() : '—'}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          {a.status === 'pending' && (
                            <>
                              <button
                                onClick={() => setApproveTarget(a)}
                                disabled={busy}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1.5 cursor-pointer hover:bg-emerald-700 disabled:opacity-50"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                              </button>
                              <button
                                onClick={() => setRejectTarget(a)}
                                disabled={busy}
                                className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer hover:bg-rose-100 disabled:opacity-50"
                              >
                                <XCircle className="w-3.5 h-3.5" /> Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setDeleteTarget(a)}
                            disabled={busy}
                            className="px-2.5 py-1.5 rounded-lg text-gray-400 text-[11px] font-bold cursor-pointer hover:bg-gray-100 hover:text-rose-600 disabled:opacity-50"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {approveTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setApproveTarget(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Approve {approveTarget.name}?</h3>
            <p className="text-xs text-gray-500 mt-1">
              This grants <strong>{approveTarget.requestedRole}</strong> portal access to{' '}
              <strong>{approveTarget.email}</strong> immediately. An approval email will be sent.
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setApproveTarget(null)} className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 bg-gray-100 cursor-pointer hover:bg-gray-200">
                Cancel
              </button>
              <button onClick={handleApprove} disabled={busyId === approveTarget.id} className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 cursor-pointer hover:bg-emerald-700 disabled:opacity-50">
                {busyId === approveTarget.id ? 'Approving...' : 'Approve Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {rejectTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setRejectTarget(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <XCircle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Reject {rejectTarget.name}?</h3>
            <p className="text-xs text-gray-500 mt-1">The applicant will be notified by email. You can include a short reason (optional).</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="Optional reason for rejection..."
              className="w-full mt-3 bg-gray-50 border border-gray-200 focus:border-rose-400 rounded-xl py-3 px-4 text-xs text-gray-800 focus:outline-none resize-none"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setRejectTarget(null)} className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 bg-gray-100 cursor-pointer hover:bg-gray-200">
                Cancel
              </button>
              <button onClick={handleReject} disabled={busyId === rejectTarget.id} className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 cursor-pointer hover:bg-rose-700 disabled:opacity-50">
                {busyId === rejectTarget.id ? 'Rejecting...' : 'Reject Application'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setDeleteTarget(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-500 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Delete application?</h3>
            <p className="text-xs text-gray-500 mt-1">This permanently removes {deleteTarget.name}'s application ({deleteTarget.email}).</p>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 bg-gray-100 cursor-pointer hover:bg-gray-200">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={busyId === deleteTarget.id} className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gray-800 cursor-pointer hover:bg-black disabled:opacity-50">
                {busyId === deleteTarget.id ? 'Deleting...' : 'Delete Entry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApplicationsPage;