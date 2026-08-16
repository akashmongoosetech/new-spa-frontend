import React, { useState, useEffect } from 'react';
import { Lock, Search, RefreshCw, ShieldCheck } from 'lucide-react';
import { SystemAuditLog } from '../../types';
import { api } from '../../services/api';

export const AuditLogsView: React.FC = () => {
  const [logs, setLogs] = useState<SystemAuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await api.getAuditLogs();
      setLogs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const safeLogs = logs || [];
  const filteredLogs = safeLogs.filter(
    (l) =>
      l &&
      ((l.action || '').toLowerCase().includes(search.toLowerCase()) ||
        (l.user || '').toLowerCase().includes(search.toLowerCase()) ||
        (l.details || '').toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">System Audit & Security Logs</h2>
          <p className="text-xs text-gray-500">Immutable trail of administrative updates, booking status changes, and settings modifications.</p>
        </div>
        <button
          onClick={fetchLogs}
          className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Audit Trail
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
          <div className="relative max-w-xs w-full text-xs">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search audit trail..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl outline-none"
            />
          </div>
          <span className="text-xs font-bold text-gray-500">Showing {filteredLogs.length} audit records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b">
              <tr>
                <th className="py-3.5 px-6">Timestamp</th>
                <th className="py-3.5 px-6">Action</th>
                <th className="py-3.5 px-6">User / Executor</th>
                <th className="py-3.5 px-6">Details</th>
                <th className="py-3.5 px-6">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/80">
                  <td className="py-3.5 px-6 text-gray-500 text-[11px] font-mono">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-6 font-bold text-gray-900">{log.action}</td>
                  <td className="py-3.5 px-6 font-semibold text-[#2CB5A0]">{log.user}</td>
                  <td className="py-3.5 px-6 text-gray-600 max-w-sm truncate">{log.details}</td>
                  <td className="py-3.5 px-6 font-mono text-gray-400 text-[10px]">{log.ipAddress || '127.0.0.1'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
