import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  Trash2,
  Send,
  Mail,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  CheckSquare,
  Square
} from 'lucide-react';
import { ContactMessage } from '../../types';
import { Modal } from '../ui/Modal';
import { api } from '../../services/api';
import { showToast } from '../../utils/toastEvents';

interface ContactManagerProps {
  contacts: ContactMessage[];
  onRefreshContacts: () => void;
  searchQuery: string;
}

export const ContactManager: React.FC<ContactManagerProps> = ({ contacts, onRefreshContacts, searchQuery }) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Selected Message for View or Reply
  const [activeMessage, setActiveMessage] = useState<ContactMessage | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  const safeContacts = contacts || [];
  const filteredContacts = safeContacts.filter((c) => {
    if (!c) return false;
    const matchesSearch =
      (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.message || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredContacts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredContacts.map((c) => c.id));
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.updateContactStatus(id, status);
      onRefreshContacts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMessage || !replyText.trim()) return;
    setReplyLoading(true);
    try {
      await api.replyToContact(activeMessage.id, replyText);
      setShowReplyModal(false);
      setReplyText('');
      onRefreshContacts();
    } catch (err) {
      console.error(err);
    } finally {
      setReplyLoading(false);
    }
  };

  const handleDeleteSingle = async (id: string) => {
    try {
      await api.deleteContact(id);
      onRefreshContacts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await api.bulkDeleteContacts(selectedIds);
      setSelectedIds([]);
      onRefreshContacts();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'in_progress':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'replied':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'closed':
        return 'bg-gray-100 text-gray-500 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Contact Messages & Inquiries</h2>
          <p className="text-xs text-gray-500">Manage client contact forms, group booking requests, and email responses.</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Trash2 className="w-4 h-4" /> Delete ({selectedIds.length})
            </button>
          )}
          <button
            onClick={async () => {
              try {
                await api.downloadExportReport('contacts');
              } catch (err: any) {
                showToast({
                  type: 'error',
                  title: 'Export Failed',
                  message: err?.message || 'Failed to export CSV.',
                });
              }
            }}
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-gray-500" /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center bg-gray-100 p-1 rounded-xl gap-0.5">
          {['all', 'new', 'in_progress', 'replied', 'closed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-colors cursor-pointer ${
                statusFilter === st ? 'bg-white text-black shadow-xs' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="text-gray-500">
          Showing <span className="font-bold text-gray-900">{filteredContacts.length}</span> messages
        </div>
      </div>

      {/* Contacts List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-100">
              <tr>
                <th className="py-4 px-4 w-10">
                  <button onClick={toggleSelectAll} className="cursor-pointer">
                    {selectedIds.length === filteredContacts.length && filteredContacts.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-[#2CB5A0]" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-300" />
                    )}
                  </button>
                </th>
                <th className="py-4 px-6">Sender Details</th>
                <th className="py-4 px-6">Subject & Preview</th>
                <th className="py-4 px-6">Received</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    No contact messages found.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((c) => {
                  const isSelected = selectedIds.includes(c.id);
                  return (
                    <tr key={c.id} className={`hover:bg-gray-50/80 transition-colors ${isSelected ? 'bg-teal-50/30' : ''}`}>
                      <td className="py-4 px-4">
                        <button onClick={() => toggleSelect(c.id)} className="cursor-pointer">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#2CB5A0]" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-300" />
                          )}
                        </button>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-bold text-gray-900">{c.name}</p>
                        <p className="text-[11px] text-gray-500">{c.email}</p>
                        <p className="text-[10px] text-gray-400">{c.phone || 'No Phone'}</p>
                      </td>
                      <td className="py-4 px-6 max-w-xs">
                        <p className="font-bold text-gray-800 truncate">{c.subject}</p>
                        <p className="text-gray-500 text-[11px] line-clamp-1 mt-0.5">{c.message}</p>
                      </td>
                      <td className="py-4 px-6 text-gray-500 text-[11px]">
                        {new Date(c.createdAt).toLocaleDateString()}{' '}
                        <span className="text-[10px] text-gray-400">
                          {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getStatusBadge(c.status)}`}>
                          {c.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-1">
                        <button
                          onClick={() => {
                            setActiveMessage(c);
                            setReplyText(c.replyMessage || '');
                            setShowReplyModal(true);
                          }}
                          className="p-1.5 rounded-lg bg-teal-50 text-[#2CB5A0] hover:bg-teal-100 cursor-pointer"
                          title="View & Reply Email"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSingle(c.id)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                          title="Delete Message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reply & Detail Modal */}
      <Modal isOpen={showReplyModal} onClose={() => setShowReplyModal(false)} title={`Inquiry from ${activeMessage?.name}`} size="lg">
        {activeMessage && (
          <div className="space-y-4 text-xs">
            {/* Sender Box */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{activeMessage.subject}</h4>
                  <p className="text-gray-600">
                    From: <span className="font-semibold text-gray-800">{activeMessage.name}</span> ({activeMessage.email})
                  </p>
                  <p className="text-gray-500">Phone: {activeMessage.phone || 'N/A'}</p>
                </div>
                <span className="text-[10px] text-gray-400">{new Date(activeMessage.createdAt).toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t mt-2 text-gray-700 leading-relaxed bg-white p-3 rounded-xl border border-gray-100">
                {activeMessage.message}
              </div>
            </div>

            {/* Email Reply Form */}
            <form onSubmit={handleSendReply} className="space-y-3">
              <label className="block font-bold text-gray-800">Reply Email Body</label>
              <textarea
                rows={4}
                required
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Dear guest, thank you for reaching out to Tripod Wellness..."
                className="w-full p-3.5 rounded-xl border text-xs focus:ring-2 focus:ring-[#2CB5A0] outline-none"
              ></textarea>
              <div className="flex justify-between items-center pt-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(activeMessage.id, 'in_progress')}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 font-semibold cursor-pointer"
                  >
                    Mark In Progress
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(activeMessage.id, 'closed')}
                    className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 font-semibold cursor-pointer"
                  >
                    Close Inquiry
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={replyLoading}
                  className="px-5 py-2.5 rounded-xl bg-[#2CB5A0] hover:bg-teal-600 text-white font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-[#2CB5A0]/20"
                >
                  <Send className="w-4 h-4" /> {replyLoading ? 'Sending...' : 'Send Official Reply'}
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};
